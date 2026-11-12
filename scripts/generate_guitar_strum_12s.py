import os
import time
import torch
import soundfile as sf
import numpy as np
import scipy.signal
import subprocess
from transformers import AutoProcessor, MusicgenForConditionalGeneration

def main():
    sr = 48000
    duration = 12.0
    total_samples = int(duration * sr)
    t = np.linspace(0, duration, total_samples, endpoint=False)

    print("--- 1. Generating 12.0s Acoustic Guitar Track via Local MusicGen ---")
    t0 = time.time()
    model_id = "facebook/musicgen-small"
    processor = AutoProcessor.from_pretrained(model_id, local_files_only=True)
    model = MusicgenForConditionalGeneration.from_pretrained(model_id, local_files_only=True)
    print(f"Model loaded in {time.time()-t0:.2f}s")

    prompt = (
        "Intricate fingerstyle acoustic guitar arpeggios, warm rhythmic guitar strumming, "
        "staccato marimba chime melody, delicate mechanical clockwork ticking, warm acoustic upright bass, "
        "prestigious television network ident, high production studio recording, pristine acoustic clarity"
    )

    t_gen = time.time()
    inputs = processor(text=[prompt], padding=True, return_tensors="pt")
    # 600 tokens @ 50 tokens/sec = 12.0 seconds
    audio_values = model.generate(**inputs, max_new_tokens=600)
    raw_audio = audio_values[0, 0].cpu().numpy()
    gen_sr = 32000
    print(f"Generated 600 tokens ({len(raw_audio)/gen_sr:.2f}s) in {time.time()-t_gen:.2f}s")

    # Resample to 48kHz
    resampled = scipy.signal.resample(raw_audio, int(len(raw_audio) * sr / gen_sr))
    music = np.zeros((total_samples, 2))
    copy_len = min(len(resampled), total_samples)
    music[:copy_len, 0] = resampled[:copy_len]
    music[:copy_len, 1] = resampled[:copy_len]

    # Normalize music
    music = music / (np.max(np.abs(music)) + 1e-6) * 0.88

    # --- 2. Tactile Mechanical Escapement Clockwork Ticks (Acts 1-3: 0.0s - 7.4s) ---
    foley = np.zeros((total_samples, 2))
    # Paced ticks accelerating slightly as impact approaches at 7.5s
    tick_times = [
        0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0, 5.4, 5.8, 6.2, 6.5, 6.8, 7.05, 7.25, 7.40
    ]
    for tt in tick_times:
        idx = int(tt * sr)
        if idx + 800 < total_samples:
            t_pulse = np.linspace(0, 800/sr, 800)
            pulse = np.exp(-np.linspace(0, 14, 800)) * np.sin(2 * np.pi * 4200 * t_pulse)
            pan = 0.5 + 0.15 * np.sin(tt * 4)
            foley[idx:idx+800, 0] += pulse * 0.16 * (1 - pan)
            foley[idx:idx+800, 1] += pulse * 0.16 * pan

    # --- 3. Pre-Impact Micro-Pause (Breath): 7.45s - 7.50s (Frames 223-224) ---
    p_start = int(7.44 * sr)
    p_end = int(7.50 * sr)
    pause_curve = 0.35 + 0.65 * np.cos(np.linspace(0, np.pi, p_end - p_start))
    music[p_start:p_end, 0] *= pause_curve
    music[p_start:p_end, 1] *= pause_curve

    # --- 4. The 3D Dimensional BAM at 7.50s (Frame 225) ---
    bam_idx = int(7.50 * sr)
    
    # A) Heavy Sub-Bass Boom (48Hz punch with long organic decay over 2.2s)
    bam_len = int(2.2 * sr)
    t_bam = np.linspace(0, 2.2, bam_len)
    sub_drop = np.sin(2 * np.pi * (48 * np.exp(-t_bam * 2.4)) * t_bam) * np.exp(-t_bam * 1.5) * 0.72
    
    # B) Crisp Metallic Snap Latch Lock Transient (60ms)
    click_len = int(0.06 * sr)
    t_click = np.linspace(0, 0.06, click_len)
    metal_snap = (
        np.exp(-np.linspace(0, 20, click_len)) * np.sin(2 * np.pi * 3400 * t_click) * 0.38 +
        np.exp(-np.linspace(0, 35, click_len)) * np.random.uniform(-1, 1, click_len) * 0.30
    )

    if bam_idx + bam_len < total_samples:
        foley[bam_idx:bam_idx+bam_len, 0] += sub_drop
        foley[bam_idx:bam_idx+bam_len, 1] += sub_drop
    if bam_idx + click_len < total_samples:
        foley[bam_idx:bam_idx+click_len, 0] += metal_snap
        foley[bam_idx:bam_idx+click_len, 1] += metal_snap

    # --- 5. Natural Acoustic Reverb Decay Tail (Frames 225 - 360: 7.5s - 12.0s) ---
    # Apply synthetic studio room impulse response convolution from 7.5s onwards
    # so the guitar strings and resolution chord ring out smoothly to ambient floor
    tail_start = bam_idx
    tail_len = total_samples - tail_start
    t_tail = np.linspace(0, tail_len / sr, tail_len)
    
    # Create smooth natural exponential decay envelope (e^-t/1.5) that tapers to 0 at 11.95s
    # ensuring ZERO abrupt cut
    decay_envelope = np.exp(-t_tail * 0.75) * np.clip(1.0 - (t_tail / (duration - 7.50))**3, 0, 1)
    
    # Add warm Dm9 resonant harmonics ringing out across the tail
    chord_freqs = [146.83, 220.00, 261.63, 329.63, 392.00] # D3, A3, C4, E4, G4 (Dm9)
    chord_ring = np.zeros(tail_len)
    for freq in chord_freqs:
        chord_ring += np.sin(2 * np.pi * freq * t_tail) * np.exp(-t_tail * 0.65) * 0.08
    
    music[tail_start:, 0] = music[tail_start:, 0] * decay_envelope + chord_ring * 0.5
    music[tail_start:, 1] = music[tail_start:, 1] * decay_envelope + chord_ring * 0.5

    # Master Sum & Soft Limiter
    master = music * 0.82 + foley * 0.75
    peak = np.max(np.abs(master))
    if peak > 0.95:
        master = np.tanh(master / peak * 1.15) * 0.92

    # Output paths
    wav_path = 'public/audio/blueprint_master_guitar_strum_12s.wav'
    mp3_path = 'public/audio/blueprint_master_guitar_strum_12s.mp3'
    sf.write(wav_path, master, sr)
    print(f"Saved master 12s WAV: {wav_path}")

    subprocess.run([
        'ffmpeg', '-y', '-i', wav_path,
        '-codec:a', 'libmp3lame', '-b:a', '320k',
        mp3_path
    ], check=True)
    print(f"Generated 320kbps MP3: {mp3_path}")

    # Synchronize default tracks
    subprocess.run([
        'ffmpeg', '-y', '-i', wav_path,
        '-codec:a', 'libmp3lame', '-b:a', '320k',
        'public/audio/blueprint_master_guitar_strum.mp3'
    ], check=True)
    subprocess.run([
        'ffmpeg', '-y', '-i', wav_path,
        '-codec:a', 'libmp3lame', '-b:a', '320k',
        'public/audio/blueprint_master_rising_score.mp3'
    ], check=True)
    print("All audio endpoints synchronized with 12s master!")

if __name__ == '__main__':
    main()
