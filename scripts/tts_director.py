#!/usr/bin/env python3
"""
TETRADIC NETWORK — Kokoro SSML Emotion Director
Translates SSML markup into emotion-directed, blended neural speech using local Kokoro-82M.
Zero cloud dependencies, zero subscription costs.
"""

import sys
import os
import xml.etree.ElementTree as ET
import numpy as np
import wave
import subprocess
import kokoro_onnx
from kokoro_onnx import Kokoro

# Patch kokoro-onnx 0.5.0 input_ids speed type bug
def _fixed_create(self, phonemes, voice, speed):
    if len(phonemes) > kokoro_onnx.MAX_PHONEME_LENGTH:
        phonemes = phonemes[:kokoro_onnx.MAX_PHONEME_LENGTH]
    tokens = np.array(self.tokenizer.tokenize(phonemes), dtype=np.int64)
    voice_v = voice[len(tokens)]
    tokens_list = [[0, *tokens, 0]]
    inputs = {
        'input_ids': tokens_list,
        'style': np.array(voice_v, dtype=np.float32),
        'speed': np.array([speed], dtype=np.float32),
    }
    audio = self.sess.run(None, inputs)[0]
    return audio, kokoro_onnx.SAMPLE_RATE

Kokoro._create_audio = _fixed_create

class KokoroDirector:
    def __init__(self, model_path="models/kokoro/kokoro-v1.0.onnx", voices_path="models/kokoro/voices-v1.0.bin", base_voice="af_sarah"):
        self.k = Kokoro(model_path, voices_path)
        self.base_voice = base_voice
        self.sr = kokoro_onnx.SAMPLE_RATE
        
        # Load style vectors
        v_base = self.k.get_voice_style(base_voice)
        v_nicole = self.k.get_voice_style('af_nicole')
        v_bella = self.k.get_voice_style('af_bella')
        v_heart = self.k.get_voice_style('af_heart')
        v_sky = self.k.get_voice_style('af_sky')
        
        # Define emotion blending profiles (with heavy emotion polarity)
        self.emotions = {
            'default': (v_base, 0.95),
            'narration-professional': (v_base, 0.92),
            'serious': (0.35 * v_base + 0.65 * v_nicole, 0.80),
            'dramatic': (0.30 * v_base + 0.70 * v_nicole, 0.76),
            'whispering': (0.40 * v_base + 0.60 * v_heart, 0.74),
            'awe': (0.65 * v_base + 0.35 * v_bella, 0.88),
            'urgent': (0.75 * v_base + 0.25 * v_sky, 1.08),
        }

    def render_ssml(self, ssml_string, output_path):
        root = ET.fromstring(ssml_string)
        segments = []

        def walk(node, current_style='default', current_rate_mod=1.0):
            style_key = current_style
            rate_mod = current_rate_mod

            tag = node.tag.split('}')[-1]
            if tag == 'express-as':
                style_attr = node.attrib.get('style', 'default')
                if style_attr in self.emotions:
                    style_key = style_attr
            elif tag == 'prosody':
                rate_str = node.attrib.get('rate', '0%')
                if '%' in rate_str:
                    val = float(rate_str.replace('%', ''))
                    rate_mod = 1.0 + (val / 100.0)

            if node.text and node.text.strip():
                text = node.text.strip()
                style_vec, base_speed = self.emotions.get(style_key, self.emotions['default'])
                final_speed = base_speed * rate_mod
                samples, _ = self.k.create(text, voice=style_vec, speed=final_speed, lang='en-us')
                segments.append(samples.flatten())

            for child in node:
                child_tag = child.tag.split('}')[-1]
                if child_tag == 'break':
                    time_str = child.attrib.get('time', '300ms')
                    ms = int(time_str.replace('ms', '').replace('s', '000'))
                    pause = np.zeros(int(self.sr * (ms / 1000.0)), dtype=np.float32)
                    segments.append(pause.flatten())
                else:
                    walk(child, current_style=style_key, current_rate_mod=rate_mod)

                if child.tail and child.tail.strip():
                    text = child.tail.strip()
                    style_vec, base_speed = self.emotions.get(style_key, self.emotions['default'])
                    final_speed = base_speed * rate_mod
                    samples, _ = self.k.create(text, voice=style_vec, speed=final_speed, lang='en-us')
                    segments.append(samples.flatten())

        walk(root)
        full_audio = np.concatenate(segments)

        # Export audio
        os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
        wav_path = output_path.replace('.mp3', '.wav')
        data = np.clip(full_audio * 32767, -32768, 32767).astype(np.int16)
        with wave.open(wav_path, 'wb') as wf:
            wf.setnchannels(1)
            wf.setsampwidth(2)
            wf.setframerate(self.sr)
            wf.writeframes(data.tobytes())
        
        if output_path.endswith('.mp3'):
            # Hollywood trailer audio mastering chain: sub-bass proximity (110Hz), presence (3.5kHz), multiband compression
            cmd_ffmpeg = [
                'ffmpeg', '-y', '-i', wav_path,
                '-af', 'bass=g=4:f=110,equalizer=f=3500:t=q:w=1:g=2,acompressor=threshold=-18dB:ratio=4:attack=5:release=50,volume=1.2',
                '-b:a', '192k', output_path
            ]
            subprocess.run(cmd_ffmpeg, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            os.remove(wav_path)
        print(f"Generated: {output_path}")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python3 tts_director.py <input.xml> <output.mp3>")
        sys.exit(1)
    with open(sys.argv[1], 'r') as f:
        ssml = f.read()
    director = KokoroDirector(base_voice="af_sarah")
    director.render_ssml(ssml, sys.argv[2])
