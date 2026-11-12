#!/usr/bin/env python3
"""
TETRADIC NETWORK — 1-Minute Show Voice Audition Engine
Generates 3 distinct voice options per show:
- The Blueprint: Commanding Voices
- The Simulation: Gentle Female Voices
- The Paradox: Very Ominous Voices

Applies cadence deceleration, pregnant pauses, and Hollywood trailer mastering.
"""

import os
import sys
import wave
import subprocess
import numpy as np
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

def master_audio(wav_path, mp3_path, bass_gain=4, treble_freq=3500, treble_gain=2, comp_thresh="-18dB", comp_ratio=4, vol=1.25):
    """Hollywood trailer mastering chain via FFmpeg."""
    cmd = [
        'ffmpeg', '-y', '-i', wav_path,
        '-af', f'bass=g={bass_gain}:f=110,equalizer=f={treble_freq}:t=q:w=1:g={treble_gain},acompressor=threshold={comp_thresh}:ratio={comp_ratio}:attack=5:release=50,volume={vol}',
        '-b:a', '192k', mp3_path
    ]
    subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    if os.path.exists(wav_path):
        os.remove(wav_path)

def render_script(kokoro_inst, segments_spec, output_mp3, mastering_kwargs=None):
    """
    segments_spec: list of tuples:
      ('text', text_str, style_vec, speed) or
      ('pause', pause_ms)
    """
    audio_chunks = []
    sr = kokoro_onnx.SAMPLE_RATE
    for item in segments_spec:
        if item[0] == 'text':
            _, text, style_vec, speed = item
            samples, _ = kokoro_inst.create(text, voice=style_vec, speed=speed, lang='en-us')
            audio_chunks.append(samples.flatten())
        elif item[0] == 'pause':
            _, ms = item
            pause_samples = np.zeros(int(sr * (ms / 1000.0)), dtype=np.float32)
            audio_chunks.append(pause_samples)

    full_audio = np.concatenate(audio_chunks)
    wav_path = output_mp3.replace('.mp3', '.wav')
    os.makedirs(os.path.dirname(os.path.abspath(output_mp3)), exist_ok=True)
    
    data = np.clip(full_audio * 32767, -32768, 32767).astype(np.int16)
    with wave.open(wav_path, 'wb') as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(sr)
        wf.writeframes(data.tobytes())

    if mastering_kwargs is None:
        mastering_kwargs = {}
    master_audio(wav_path, output_mp3, **mastering_kwargs)
    print(f"Mastered: {output_mp3} (duration: {len(full_audio)/sr:.2f}s)")

def main():
    print("--- Initializing Kokoro Neural Engine ---")
    k = Kokoro('models/kokoro/kokoro-v1.0.onnx', 'models/kokoro/voices-v1.0.bin')
    out_dir = "public/audio/auditions"
    os.makedirs(out_dir, exist_ok=True)

    # =========================================================================
    # SHOW 1: THE BLUEPRINT (BP-001)
    # Topic: The Relativistic Clockwork of the Global GPS Matrix
    # Persona: COMMANDING VOICE
    # =========================================================================
    bp_text_p1 = "Look above your head. Twenty thousand kilometers into the vacuum of space, thirty-one atomic clocks are engaged in a silent war against the curvature of spacetime."
    bp_text_p2 = "Einstein's General Relativity dictates that clocks in weaker gravity tick forty-five microseconds faster every day. Special relativity pulls them back by seven microseconds. The net delta is thirty-eight point six microseconds per day."
    bp_text_p3 = "If our orbital engineers failed to hardcode that relativistic offset directly into the satellite oscillators before launch, every GPS coordinate on Earth would drift by eleven kilometers in twenty-four hours."
    bp_text_p4 = "And GPS is not navigation. It is the master heartbeat of human civilization. Wall Street automated trading, cellular packet handoffs, and national power grids are all slaved to that exact signal. A drift of four microseconds, and the modern financial architecture collapses into instant, unrecoverable chaos."
    bp_text_p5 = "This is the architecture of precision. This is the blueprint."

    # Blueprint Option 1: The Master Architect (am_fenrir 60% + am_onyx 40%) - Deep American Command
    v_fenrir = k.get_voice_style('am_fenrir')
    v_onyx = k.get_voice_style('am_onyx')
    style_bp1 = 0.60 * v_fenrir + 0.40 * v_onyx
    spec_bp1 = [
        ('text', bp_text_p1, style_bp1, 0.84),
        ('pause', 550),
        ('text', bp_text_p2, style_bp1, 0.88),
        ('pause', 500),
        ('text', bp_text_p3, style_bp1, 0.86),
        ('pause', 650),
        ('text', bp_text_p4, style_bp1, 0.82),
        ('pause', 750),
        ('text', bp_text_p5, style_bp1, 0.78),
    ]
    render_script(k, spec_bp1, f"{out_dir}/blueprint_opt1_master_architect.mp3", 
                  {'bass_gain': 5, 'treble_gain': 2.5, 'comp_thresh': '-19dB', 'vol': 1.3})

    # Blueprint Option 2: The Sovereign Imperial (bm_george 100%) - Authoritative British Command
    v_george = k.get_voice_style('bm_george')
    spec_bp2 = [
        ('text', bp_text_p1, v_george, 0.85),
        ('pause', 550),
        ('text', bp_text_p2, v_george, 0.88),
        ('pause', 500),
        ('text', bp_text_p3, v_george, 0.86),
        ('pause', 650),
        ('text', bp_text_p4, v_george, 0.83),
        ('pause', 750),
        ('text', bp_text_p5, v_george, 0.78),
    ]
    render_script(k, spec_bp2, f"{out_dir}/blueprint_opt2_sovereign_imperial.mp3",
                  {'bass_gain': 4.5, 'treble_gain': 2.5, 'comp_thresh': '-18dB', 'vol': 1.25})

    # Blueprint Option 3: The Titanium Matriarch (af_nicole 65% + af_sarah 35%) - Commanding Female Director
    v_nicole = k.get_voice_style('af_nicole')
    v_sarah = k.get_voice_style('af_sarah')
    style_bp3 = 0.65 * v_nicole + 0.35 * v_sarah
    spec_bp3 = [
        ('text', bp_text_p1, style_bp3, 0.83),
        ('pause', 550),
        ('text', bp_text_p2, style_bp3, 0.87),
        ('pause', 500),
        ('text', bp_text_p3, style_bp3, 0.85),
        ('pause', 650),
        ('text', bp_text_p4, style_bp3, 0.81),
        ('pause', 750),
        ('text', bp_text_p5, style_bp3, 0.76),
    ]
    render_script(k, spec_bp3, f"{out_dir}/blueprint_opt3_titanium_matriarch.mp3",
                  {'bass_gain': 5, 'treble_gain': 3.0, 'comp_thresh': '-19dB', 'vol': 1.3})

    # =========================================================================
    # SHOW 2: THE SIMULATION (SIM-001)
    # Topic: The False Vacuum Decay Catastrophe
    # Persona: GENTLE FEMALE VOICE
    # =========================================================================
    sim_text_p1 = "Everything you can see, touch, or measure rests upon an illusion of stability."
    sim_text_p2 = "According to our best models of particle physics, the Higgs field that gives mass to the universe may not sit at its true minimum. We may be living inside a metastable false vacuum. A temporary bubble, waiting for a single quantum fluctuation."
    sim_text_p3 = "Somewhere in deep space, through pure quantum tunneling, a microscopic sphere of true vacuum could nucleate at this very second. Inside that bubble, the fundamental constants of nature will instantly invert."
    sim_text_p4 = "The bubble wall expands outward at the exact speed of light. Because it moves at the speed of light, no telescope can warn us. No sensor can see it coming. When it hits, atomic nuclei will simply dissolve. Electromagnetism will turn off. Every star, every planet, and every conscious mind will disintegrate without a sound."
    sim_text_p5 = "Let us run the simulation, and watch reality break apart."

    # Simulation Option 1: The Cosmic Whisper (af_heart 60% + af_nova 40%) - Soft Melodysheep Intimacy
    v_heart = k.get_voice_style('af_heart')
    v_nova = k.get_voice_style('af_nova')
    style_sim1 = 0.60 * v_heart + 0.40 * v_nova
    spec_sim1 = [
        ('text', sim_text_p1, style_sim1, 0.76),
        ('pause', 650),
        ('text', sim_text_p2, style_sim1, 0.80),
        ('pause', 600),
        ('text', sim_text_p3, style_sim1, 0.78),
        ('pause', 700),
        ('text', sim_text_p4, style_sim1, 0.77),
        ('pause', 800),
        ('text', sim_text_p5, style_sim1, 0.73),
    ]
    render_script(k, spec_sim1, f"{out_dir}/simulation_opt1_cosmic_whisper.mp3",
                  {'bass_gain': 3.5, 'treble_freq': 4000, 'treble_gain': 2.0, 'comp_thresh': '-20dB', 'vol': 1.35})

    # Simulation Option 2: The Ethereal Sage (af_sky 60% + af_bella 40%) - Warm Celestial Serenity
    v_sky = k.get_voice_style('af_sky')
    v_bella = k.get_voice_style('af_bella')
    style_sim2 = 0.60 * v_sky + 0.40 * v_bella
    spec_sim2 = [
        ('text', sim_text_p1, style_sim2, 0.78),
        ('pause', 650),
        ('text', sim_text_p2, style_sim2, 0.82),
        ('pause', 600),
        ('text', sim_text_p3, style_sim2, 0.80),
        ('pause', 700),
        ('text', sim_text_p4, style_sim2, 0.79),
        ('pause', 800),
        ('text', sim_text_p5, style_sim2, 0.75),
    ]
    render_script(k, spec_sim2, f"{out_dir}/simulation_opt2_ethereal_sage.mp3",
                  {'bass_gain': 3.0, 'treble_freq': 3800, 'treble_gain': 2.0, 'comp_thresh': '-19dB', 'vol': 1.3})

    # Simulation Option 3: The Velvet Observer (bf_lily 100%) - Gentle British Elegance
    v_lily = k.get_voice_style('bf_lily')
    spec_sim3 = [
        ('text', sim_text_p1, v_lily, 0.79),
        ('pause', 650),
        ('text', sim_text_p2, v_lily, 0.82),
        ('pause', 600),
        ('text', sim_text_p3, v_lily, 0.81),
        ('pause', 700),
        ('text', sim_text_p4, v_lily, 0.80),
        ('pause', 800),
        ('text', sim_text_p5, v_lily, 0.74),
    ]
    render_script(k, spec_sim3, f"{out_dir}/simulation_opt3_velvet_observer.mp3",
                  {'bass_gain': 3.5, 'treble_freq': 3800, 'treble_gain': 2.2, 'comp_thresh': '-19dB', 'vol': 1.3})

    # =========================================================================
    # SHOW 3: THE PARADOX (PDX-001)
    # Topic: The Boltzmann Brain Horror
    # Persona: VERY OMINOUS VOICE
    # =========================================================================
    pdx_text_p1 = "You believe you have a past. You believe you were born, that you grew up, that you are listening to these words right now."
    pdx_text_p2 = "Thermodynamics says you are almost certainly wrong."
    pdx_text_p3 = "The second law states that entropy must always increase. In an infinite, expanding cosmos, thermodynamic equilibrium is absolute coldness. But quantum mechanics allows random thermal fluctuations."
    pdx_text_p4 = "Mathematically, it requires vastly less entropy for random quantum chaos to spontaneously fluctuate a single, isolated brain into existence in the dark void—imprinted with false memories of an entire universe—than it does to create an actual universe of two trillion galaxies."
    pdx_text_p5 = "For every real observer that ever evolved, there are trillions upon trillions of Boltzmann brains hallucinating a reality that never existed. In a few seconds, the fluctuation will end, and you will dissolve back into the silence."
    pdx_text_p6 = "Welcome to the paradox."

    # Paradox Option 1: The Shadow Inquisitor (am_fenrir 100% slowed, deep sub-bass) - Menacing Noir
    spec_pdx1 = [
        ('text', pdx_text_p1, v_fenrir, 0.78),
        ('pause', 700),
        ('text', pdx_text_p2, v_fenrir, 0.74),
        ('pause', 850),
        ('text', pdx_text_p3, v_fenrir, 0.80),
        ('pause', 650),
        ('text', pdx_text_p4, v_fenrir, 0.78),
        ('pause', 800),
        ('text', pdx_text_p5, v_fenrir, 0.75),
        ('pause', 900),
        ('text', pdx_text_p6, v_fenrir, 0.70),
    ]
    render_script(k, spec_pdx1, f"{out_dir}/paradox_opt1_shadow_inquisitor.mp3",
                  {'bass_gain': 6.5, 'treble_freq': 3000, 'treble_gain': 2.0, 'comp_thresh': '-21dB', 'vol': 1.35})

    # Paradox Option 2: The Enigmatic Intellect (bm_daniel 100%) - Cold British Psychological Dread
    v_daniel = k.get_voice_style('bm_daniel')
    spec_pdx2 = [
        ('text', pdx_text_p1, v_daniel, 0.80),
        ('pause', 700),
        ('text', pdx_text_p2, v_daniel, 0.75),
        ('pause', 850),
        ('text', pdx_text_p3, v_daniel, 0.82),
        ('pause', 650),
        ('text', pdx_text_p4, v_daniel, 0.80),
        ('pause', 800),
        ('text', pdx_text_p5, v_daniel, 0.76),
        ('pause', 900),
        ('text', pdx_text_p6, v_daniel, 0.72),
    ]
    render_script(k, spec_pdx2, f"{out_dir}/paradox_opt2_enigmatic_intellect.mp3",
                  {'bass_gain': 5.0, 'treble_freq': 3400, 'treble_gain': 2.5, 'comp_thresh': '-20dB', 'vol': 1.3})

    # Paradox Option 3: The Calculating Dread (am_echo 60% + am_onyx 40%) - Cold Indifferent Void
    v_echo = k.get_voice_style('am_echo')
    style_pdx3 = 0.60 * v_echo + 0.40 * v_onyx
    spec_pdx3 = [
        ('text', pdx_text_p1, style_pdx3, 0.79),
        ('pause', 700),
        ('text', pdx_text_p2, style_pdx3, 0.73),
        ('pause', 850),
        ('text', pdx_text_p3, style_pdx3, 0.81),
        ('pause', 650),
        ('text', pdx_text_p4, style_pdx3, 0.78),
        ('pause', 800),
        ('text', pdx_text_p5, style_pdx3, 0.74),
        ('pause', 900),
        ('text', pdx_text_p6, style_pdx3, 0.69),
    ]
    render_script(k, spec_pdx3, f"{out_dir}/paradox_opt3_calculating_dread.mp3",
                  {'bass_gain': 6.0, 'treble_freq': 3200, 'treble_gain': 2.0, 'comp_thresh': '-20dB', 'vol': 1.3})

    print("\n--- ALL 9 AUDITION TRACKS GENERATED SUCCESSFULLY ---")

if __name__ == '__main__':
    main()
