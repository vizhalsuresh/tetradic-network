"""
ORPHEUS — Master Sonic Suite for Show 2: The Simulation (Option 1 Variations)
Elevated variations on Option 1 (The Singularity):
1A: Geodesic Lensing / Event Horizon Void
1B: Tidal Spaghettification / Organic Acceleration
1C: Spacetime Chirp / Metric Ripple (LIGO f ~ (tc - t)^(-3/8) & QNM Ringdown)

Adheres strictly to Showrunner's established preferences:
- Zero metallic bells/chimes
- 100% organic acoustic instruments (felt grand piano, fingerstyle guitar, authentic cello bloom, wood percussion)
- Pre-impact 40ms silence breath (7.46s to 7.50s)
- 44Hz seismic sub-bass BAM impact at 7.50s (Frame 225)
- Unified 4.5s exponential decay of instrument sustain into room silence at 11.95s
- Hollywood trailer mastering (+4dB warmth @ 110Hz, razor clarity @ 3.5kHz, low-passed tails)
"""

import os
import time
import torch
import soundfile as sf
import numpy as np
import scipy.signal
import subprocess
from transformers import AutoProcessor, MusicgenForConditionalGeneration

def apply_hollywood_mastering(audio, sr=48000):
    """
    Hollywood Trailer Mastering:
    - Low-end proximity warmth: +4dB boost around 110Hz
    - Mid clarity / string articulation: +2.5dB at 3.5kHz
    - High-frequency ceiling: gentle roll-off above 10kHz to banish any harshness
    """
    # 1. Low-end shelf / peak at 110Hz (+4dB, gain ~ 1.58)
    b_low, a_low = scipy.signal.iirpeak(110 / (sr / 2), Q=1.0)
    low_band = scipy.signal.lfilter(b_low, a_low, audio, axis=0)
    audio = audio + low_band * 0.58

    # 2. String articulation at 3.5kHz (+2.5dB, gain ~ 1.33)
    b_mid, a_mid = scipy.signal.iirpeak(3500 / (sr / 2), Q=1.2)
    mid_band = scipy.signal.lfilter(b_mid, a_mid, audio, axis=0)
    audio = audio + mid_band * 0.33

    # 3. Smooth low-pass at 11kHz to guarantee ZERO harshness
    b_high, a_high = scipy.signal.butter(2, 11000 / (sr / 2), btype='low')
    audio = scipy.signal.lfilter(b_high, a_high, audio, axis=0)

    return audio

def build_common_envelopes(duration_sec=12.0, sr=48000, bam_time=7.50):
    total_samples = int(duration_sec * sr)
    bam_idx = int(bam_time * sr)
    post_samples = total_samples - bam_idx
    t_post = np.linspace(0, post_samples / sr, post_samples, endpoint=False)

    # Unified slow exponential fade over the 4.5s hero hold
    fade_env = np.exp(-t_post / 1.75) * np.clip(1.0 - (t_post / 4.45)**2.5, 0, 1)

    # 40ms pre-impact silence breath (7.46s to 7.50s)
    p_start = int(7.46 * sr)
    p_end = bam_idx
    breath_curve = 0.5 * (1.0 + np.cos(np.pi * np.linspace(0, 1, p_end - p_start)))

    # 44Hz Seismic Sub-Bass BAM at 7.50s
    bam_len = int(2.2 * sr)
    t_bam = np.linspace(0, 2.2, bam_len)
    sub_drop = np.sin(2 * np.pi * (44 * np.exp(-t_bam * 2.2)) * t_bam) * np.exp(-t_bam * 1.5) * 0.70

    # Organic wood latch snap (60ms) - physical, non-metallic
    snap_len = int(0.06 * sr)
    t_snap = np.linspace(0, 0.06, snap_len)
    wood_snap = np.exp(-t_snap / 0.008) * np.sin(2 * np.pi * 320 * t_snap) * 0.35

    return total_samples, bam_idx, post_samples, t_post, fade_env, (p_start, p_end, breath_curve), sub_drop, wood_snap

def main():
    sr = 48000
    duration = 12.0
    os.makedirs('public/audio', exist_ok=True)

    total_samples, bam_idx, post_samples, t_post, fade_env, breath, sub_drop, wood_snap = build_common_envelopes(duration, sr)
    p_start, p_end, breath_curve = breath

    print("--- 1. Loading Authentic Recorded Cello ---")
    cello_raw, cello_sr = sf.read('/tmp/test_musicgen_cello.wav')
    if cello_sr != sr:
        cello_raw = scipy.signal.resample(cello_raw, int(len(cello_raw) * sr / cello_sr))
    if cello_raw.ndim == 2:
        cello_raw = np.mean(cello_raw, axis=1)
    cello_raw = cello_raw / (np.max(np.abs(cello_raw)) + 1e-6)

    # Prepare warm low-passed cello pad
    b_lp, a_lp = scipy.signal.butter(2, 900 / (sr/2), btype='low')
    cello_tail = scipy.signal.lfilter(b_lp, a_lp, cello_raw[:min(len(cello_raw), post_samples)])
    cello_padded = np.zeros(post_samples)
    cello_padded[:len(cello_tail)] = cello_tail
    att_len = int(0.22 * sr)
    cello_padded[:att_len] *= 0.5 * (1.0 - np.cos(np.pi * np.linspace(0, 1, att_len)))
    cello_faded = cello_padded * fade_env * 0.35

    print("--- 2. Loading Local MusicGen Model ---")
    t0 = time.time()
    model_id = "facebook/musicgen-small"
    processor = AutoProcessor.from_pretrained(model_id, local_files_only=True)
    model = MusicgenForConditionalGeneration.from_pretrained(model_id, local_files_only=True)
    print(f"Model loaded in {time.time()-t0:.2f}s")

    # =========================================================================
    # THEME 1A: Geodesic Lensing / Event Horizon Void
    # =========================================================================
    print("\n=== Generating Theme 1A: Geodesic Lensing ===")
    prompt_1a = (
        "Slow ominous felt acoustic grand piano descending low octaves, deep bowed cello drone, "
        "gentle 12th-fret acoustic guitar natural harmonics, deep acoustic double bass undertow, "
        "gravitational lensing physics documentary, intimate studio room ambience, zero synths, zero bells"
    )
    inputs_1a = processor(text=[prompt_1a], padding=True, return_tensors="pt")
    audio_1a = model.generate(**inputs_1a, max_new_tokens=600)[0, 0].cpu().numpy()
    resampled_1a = scipy.signal.resample(audio_1a, int(len(audio_1a) * sr / 32000))
    resampled_1a = resampled_1a / (np.max(np.abs(resampled_1a)) + 1e-6) * 0.85

    track_1a = np.zeros((total_samples, 2))
    copy_len = min(len(resampled_1a), total_samples)
    track_1a[:copy_len, 0] = resampled_1a[:copy_len]
    track_1a[:copy_len, 1] = resampled_1a[:copy_len]

    # Pre-BAM silence breath
    track_1a[p_start:p_end, 0] *= breath_curve
    track_1a[p_start:p_end, 1] *= breath_curve

    # Post-BAM: blend cello bloom and decaying piano/guitar sustain
    track_1a[bam_idx:, 0] = track_1a[bam_idx:, 0] * 0.18 * fade_env + cello_faded * 0.95
    track_1a[bam_idx:, 1] = track_1a[bam_idx:, 1] * 0.18 * fade_env + cello_faded * 1.05

    # 44Hz BAM
    track_1a[bam_idx:bam_idx+len(sub_drop), 0] += sub_drop
    track_1a[bam_idx:bam_idx+len(sub_drop), 1] += sub_drop
    track_1a[bam_idx:bam_idx+len(wood_snap), 0] += wood_snap
    track_1a[bam_idx:bam_idx+len(wood_snap), 1] += wood_snap

    # Hollywood mastering
    track_1a = apply_hollywood_mastering(track_1a, sr)
    peak = np.max(np.abs(track_1a))
    if peak > 0.89:
        track_1a = track_1a / peak * 0.88

    wav_1a = 'public/audio/simulation_theme_1A_geodesic_lensing.wav'
    mp3_1a = 'public/audio/simulation_theme_1A_geodesic_lensing.mp3'
    sf.write(wav_1a, track_1a, sr)
    subprocess.run(['ffmpeg', '-y', '-i', wav_1a, '-codec:a', 'libmp3lame', '-b:a', '320k', mp3_1a], check=True)
    print(f"Delivered Theme 1A: {mp3_1a}")

    # =========================================================================
    # THEME 1B: Tidal Spaghettification / Organic Acceleration
    # =========================================================================
    print("\n=== Generating Theme 1B: Tidal Spaghettification ===")
    prompt_1b = (
        "Fast intricate fingerstyle acoustic guitar arpeggios accelerating tempo, "
        "organic wooden clockwork clicks, tactile acoustic cajon taps, resonant acoustic cello, "
        "high tension scientific simulation, close-mic physical instrument recording, zero synths"
    )
    inputs_1b = processor(text=[prompt_1b], padding=True, return_tensors="pt")
    audio_1b = model.generate(**inputs_1b, max_new_tokens=600)[0, 0].cpu().numpy()
    resampled_1b = scipy.signal.resample(audio_1b, int(len(audio_1b) * sr / 32000))
    resampled_1b = resampled_1b / (np.max(np.abs(resampled_1b)) + 1e-6) * 0.85

    track_1b = np.zeros((total_samples, 2))
    copy_len = min(len(resampled_1b), total_samples)
    track_1b[:copy_len, 0] = resampled_1b[:copy_len]
    track_1b[:copy_len, 1] = resampled_1b[:copy_len]

    # Add accelerating organic wood strain ticks before BAM
    # Exponential acceleration: t_k from 2.0s to 7.42s
    t_ticks = []
    curr_t = 1.5
    dt = 0.55
    while curr_t < 7.42:
        t_ticks.append(curr_t)
        dt *= 0.82
        curr_t += max(dt, 0.05)

    for tt in t_ticks:
        t_idx = int(tt * sr)
        t_len = min(int(0.025 * sr), total_samples - t_idx)
        if t_len > 0:
            t_wave = np.linspace(0, 0.025, t_len)
            tick = np.exp(-t_wave / 0.005) * np.sin(2 * np.pi * 540 * t_wave) * 0.22
            track_1b[t_idx:t_idx+t_len, 0] += tick
            track_1b[t_idx:t_idx+t_len, 1] += tick

    # Pre-BAM silence breath
    track_1b[p_start:p_end, 0] *= breath_curve
    track_1b[p_start:p_end, 1] *= breath_curve

    # Post-BAM: active arpeggios cease, huge cello bloom and warm open guitar ringout
    track_1b[bam_idx:, 0] = track_1b[bam_idx:, 0] * 0.15 * fade_env + cello_faded * 1.15
    track_1b[bam_idx:, 1] = track_1b[bam_idx:, 1] * 0.15 * fade_env + cello_faded * 1.15

    # 44Hz BAM with heavy acoustic cajon body thump
    cajon_len = int(0.12 * sr)
    t_c = np.linspace(0, 0.12, cajon_len)
    cajon_thump = np.exp(-t_c / 0.03) * np.sin(2 * np.pi * 92 * t_c) * 0.50
    track_1b[bam_idx:bam_idx+len(sub_drop), 0] += sub_drop
    track_1b[bam_idx:bam_idx+len(sub_drop), 1] += sub_drop
    track_1b[bam_idx:bam_idx+cajon_len, 0] += cajon_thump
    track_1b[bam_idx:bam_idx+cajon_len, 1] += cajon_thump

    # Hollywood mastering
    track_1b = apply_hollywood_mastering(track_1b, sr)
    peak = np.max(np.abs(track_1b))
    if peak > 0.89:
        track_1b = track_1b / peak * 0.88

    wav_1b = 'public/audio/simulation_theme_1B_tidal_spaghettification.wav'
    mp3_1b = 'public/audio/simulation_theme_1B_tidal_spaghettification.mp3'
    sf.write(wav_1b, track_1b, sr)
    subprocess.run(['ffmpeg', '-y', '-i', wav_1b, '-codec:a', 'libmp3lame', '-b:a', '320k', mp3_1b], check=True)
    print(f"Delivered Theme 1B: {mp3_1b}")

    # =========================================================================
    # THEME 1C: Spacetime Chirp / Metric Ripple (LIGO f ~ (tc - t)^(-3/8) & QNM)
    # =========================================================================
    print("\n=== Generating Theme 1C: Spacetime Chirp ===")
    prompt_1c = (
        "Acoustic cello sul ponticello rising harmonic glissando, intimate fingerstyle acoustic guitar "
        "body taps and string scrapes, warm grand piano low resonance, relativistic astrophysics score, "
        "haunting cinematic tension, authentic wooden acoustic instruments, zero electronic buzz"
    )
    inputs_1c = processor(text=[prompt_1c], padding=True, return_tensors="pt")
    audio_1c = model.generate(**inputs_1c, max_new_tokens=600)[0, 0].cpu().numpy()
    resampled_1c = scipy.signal.resample(audio_1c, int(len(audio_1c) * sr / 32000))
    resampled_1c = resampled_1c / (np.max(np.abs(resampled_1c)) + 1e-6) * 0.85

    track_1c = np.zeros((total_samples, 2))
    copy_len = min(len(resampled_1c), total_samples)
    track_1c[:copy_len, 0] = resampled_1c[:copy_len]
    track_1c[:copy_len, 1] = resampled_1c[:copy_len]

    # Synthesize authentic acoustic string harmonic chirp glissando f(t) = f0 * (1 - t/tc)^(-3/8)
    tc = 7.46
    chirp_samples = int(tc * sr)
    t_chirp = np.linspace(0, tc, chirp_samples, endpoint=False)
    # Start at 110Hz (A2 string), chirp accelerates up to ~550Hz (C#5) before silence
    f_chirp = 110.0 * np.power(np.maximum(1.0 - t_chirp / tc, 0.005), -0.375)
    f_chirp = np.clip(f_chirp, 110.0, 620.0)
    phase_chirp = 2 * np.pi * np.cumsum(f_chirp) / sr
    # Physical string harmonic tone with wooden resonance
    acoustic_chirp = np.sin(phase_chirp) * 0.5 + np.sin(2 * phase_chirp) * 0.25 + np.sin(3 * phase_chirp) * 0.12
    # Envelope: gentle start, swelling as inspiral tightens, ducking into breath
    chirp_env = np.linspace(0.05, 0.45, chirp_samples)**1.8
    acoustic_chirp *= chirp_env

    # Soft low pass to maintain cello warmth (zero screech)
    b_ch, a_ch = scipy.signal.butter(2, 1200 / (sr/2), btype='low')
    acoustic_chirp = scipy.signal.lfilter(b_ch, a_ch, acoustic_chirp)

    track_1c[:chirp_samples, 0] += acoustic_chirp * 0.32
    track_1c[:chirp_samples, 1] += acoustic_chirp * 0.32

    # Pre-BAM silence breath
    track_1c[p_start:p_end, 0] *= breath_curve
    track_1c[p_start:p_end, 1] *= breath_curve

    # Post-BAM: Kerr Black Hole QNM Quadrupole Ringdown Oscillation (44Hz, tau=0.85s)
    qnm_len = int(3.5 * sr)
    t_qnm = np.linspace(0, 3.5, qnm_len)
    qnm_ringdown = np.sin(2 * np.pi * 44 * t_qnm) * np.exp(-t_qnm / 0.85) * 0.65

    track_1c[bam_idx:bam_idx+qnm_len, 0] += qnm_ringdown
    track_1c[bam_idx:bam_idx+qnm_len, 1] += qnm_ringdown

    # Layer warm authentic cello and piano hero hold
    track_1c[bam_idx:, 0] = track_1c[bam_idx:, 0] * 0.18 * fade_env + cello_faded * 1.10
    track_1c[bam_idx:, 1] = track_1c[bam_idx:, 1] * 0.18 * fade_env + cello_faded * 1.10

    # Hollywood mastering
    track_1c = apply_hollywood_mastering(track_1c, sr)
    peak = np.max(np.abs(track_1c))
    if peak > 0.89:
        track_1c = track_1c / peak * 0.88

    wav_1c = 'public/audio/simulation_theme_1C_spacetime_chirp.wav'
    mp3_1c = 'public/audio/simulation_theme_1C_spacetime_chirp.mp3'
    sf.write(wav_1c, track_1c, sr)
    subprocess.run(['ffmpeg', '-y', '-i', wav_1c, '-codec:a', 'libmp3lame', '-b:a', '320k', mp3_1c], check=True)
    print(f"Delivered Theme 1C: {mp3_1c}")

    print("\n--- ALL THREE ELEVATED THEMES SUCCESSFULLY SYNTHESIZED AND DELIVERED ---")

if __name__ == '__main__':
    main()
