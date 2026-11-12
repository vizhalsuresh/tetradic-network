import os
import time
import torch
import soundfile as sf
import numpy as np
import scipy.signal
import subprocess
from transformers import AutoProcessor, MusicgenForConditionalGeneration

def build_fade_and_bam(duration_sec=12.0, sr=48000, bam_time=7.50):
    total_samples = int(duration_sec * sr)
    bam_idx = int(bam_time * sr)
    post_samples = total_samples - bam_idx
    t_post = np.linspace(0, post_samples / sr, post_samples, endpoint=False)
    
    # Unified slow exponential fade over the 4.5s hero hold
    fade_env = np.exp(-t_post / 1.7) * np.clip(1.0 - (t_post / 4.45)**2.5, 0, 1)

    # 40ms pre-impact silence breath (7.46s to 7.50s)
    p_start = int(7.46 * sr)
    p_end = bam_idx
    breath_curve = 0.5 * (1.0 + np.cos(np.pi * np.linspace(0, 1, p_end - p_start)))

    # 44Hz Seismic Sub-Bass BAM at 7.50s
    bam_len = int(2.2 * sr)
    t_bam = np.linspace(0, 2.2, bam_len)
    sub_drop = np.sin(2 * np.pi * (44 * np.exp(-t_bam * 2.2)) * t_bam) * np.exp(-t_bam * 1.5) * 0.68

    # Tactile wood latch snap (60ms) - organic, non-metallic
    snap_len = int(0.06 * sr)
    t_snap = np.linspace(0, 0.06, snap_len)
    wood_snap = np.exp(-t_snap / 0.008) * np.sin(2 * np.pi * 320 * t_snap) * 0.40

    return total_samples, bam_idx, post_samples, t_post, fade_env, (p_start, p_end, breath_curve), sub_drop, wood_snap

def main():
    sr = 48000
    duration = 12.0
    os.makedirs('public/audio', exist_ok=True)
    
    total_samples, bam_idx, post_samples, t_post, fade_env, breath, sub_drop, wood_snap = build_fade_and_bam(duration, sr)
    p_start, p_end, breath_curve = breath

    print("--- Loading Local MusicGen Model ---")
    t0 = time.time()
    model_id = "facebook/musicgen-small"
    processor = AutoProcessor.from_pretrained(model_id, local_files_only=True)
    model = MusicgenForConditionalGeneration.from_pretrained(model_id, local_files_only=True)
    print(f"Model loaded in {time.time()-t0:.2f}s")

    # Load authentic recorded cello
    cello_raw, cello_sr = sf.read('/tmp/test_musicgen_cello.wav')
    if cello_sr != sr:
        cello_raw = scipy.signal.resample(cello_raw, int(len(cello_raw) * sr / cello_sr))
    if cello_raw.ndim == 2:
        cello_raw = np.mean(cello_raw, axis=1)
    cello_raw = cello_raw / (np.max(np.abs(cello_raw)) + 1e-6)

    # =========================================================================
    # THEME A: Gravitational Pulse (Piano octaves + bowed cello + guitar harmonics)
    # =========================================================================
    print("\n--- Generating Theme A: Gravitational Pulse ---")
    prompt_a = (
        "Slow, heavy, ominous felt acoustic grand piano low bass octaves pulsing, "
        "bowed solo acoustic cello sul tasto drone, natural 12th-fret acoustic guitar harmonics, "
        "deep acoustic double bass, gravitational physics documentary, cinematic room ambience, zero synths"
    )
    inputs_a = processor(text=[prompt_a], padding=True, return_tensors="pt")
    audio_a = model.generate(**inputs_a, max_new_tokens=600)[0, 0].cpu().numpy()
    resampled_a = scipy.signal.resample(audio_a, int(len(audio_a) * sr / 32000))
    resampled_a = resampled_a / (np.max(np.abs(resampled_a)) + 1e-6) * 0.85

    track_a = np.zeros((total_samples, 2))
    copy_len = min(len(resampled_a), total_samples)
    track_a[:copy_len, 0] = resampled_a[:copy_len]
    track_a[:copy_len, 1] = resampled_a[:copy_len]

    # Pre-BAM silence breath
    track_a[p_start:p_end, 0] *= breath_curve
    track_a[p_start:p_end, 1] *= breath_curve

    # Post-BAM: cease active rhythm, blend warm cello and guitar sustain, apply unified fade
    b_lp, a_lp = scipy.signal.butter(2, 950 / (sr/2), btype='low')
    cello_tail = scipy.signal.lfilter(b_lp, a_lp, cello_raw[:min(len(cello_raw), post_samples)])
    cello_padded = np.zeros(post_samples)
    cello_padded[:len(cello_tail)] = cello_tail

    # Attack envelope on cello entry (200ms)
    att_len = int(0.20 * sr)
    cello_padded[:att_len] *= 0.5 * (1.0 - np.cos(np.pi * np.linspace(0, 1, att_len)))
    cello_faded = cello_padded * fade_env * 0.35

    track_a[bam_idx:, 0] = track_a[bam_idx:, 0] * 0.20 * fade_env + cello_faded * 0.95
    track_a[bam_idx:, 1] = track_a[bam_idx:, 1] * 0.20 * fade_env + cello_faded * 1.05

    # 44Hz BAM
    track_a[bam_idx:bam_idx+len(sub_drop), 0] += sub_drop
    track_a[bam_idx:bam_idx+len(sub_drop), 1] += sub_drop

    # Normalize
    track_a = track_a / (np.max(np.abs(track_a)) + 1e-6) * 0.88
    sf.write('public/audio/simulation_theme_A_gravitational_pulse.wav', track_a, sr)
    subprocess.run(['ffmpeg', '-y', '-i', 'public/audio/simulation_theme_A_gravitational_pulse.wav',
                    '-codec:a', 'libmp3lame', '-b:a', '320k', 'public/audio/simulation_theme_A_gravitational_pulse.mp3'], check=True)
    print("✅ Theme A rendered!")

    # =========================================================================
    # THEME B: Kinetic Cascade (Fingerstyle guitar arpeggios + clockwork wood ticks)
    # =========================================================================
    print("\n--- Generating Theme B: Kinetic Cascade ---")
    prompt_b = (
        "Driving high-tension fingerstyle acoustic guitar arpeggios in D minor, "
        "rapid intricate guitar picking, tactile wooden clockwork escapement ticking accelerating, "
        "hollow woodblock rim percussion, organic acoustic studio recording, pristine clarity, zero synths"
    )
    inputs_b = processor(text=[prompt_b], padding=True, return_tensors="pt")
    audio_b = model.generate(**inputs_b, max_new_tokens=600)[0, 0].cpu().numpy()
    resampled_b = scipy.signal.resample(audio_b, int(len(audio_b) * sr / 32000))
    resampled_b = resampled_b / (np.max(np.abs(resampled_b)) + 1e-6) * 0.85

    track_b = np.zeros((total_samples, 2))
    copy_len = min(len(resampled_b), total_samples)
    track_b[:copy_len, 0] = resampled_b[:copy_len]
    track_b[:copy_len, 1] = resampled_b[:copy_len]

    # Organic wood ticks accelerating into BAM
    tick_times = [0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0, 5.4, 5.8, 6.2, 6.5, 6.8, 7.05, 7.25, 7.42]
    for tt in tick_times:
        idx = int(tt * sr)
        if idx + 600 < total_samples:
            t_pulse = np.linspace(0, 600/sr, 600)
            pulse = np.exp(-t_pulse / 0.003) * np.sin(2 * np.pi * 3800 * t_pulse) * 0.15
            track_b[idx:idx+600, 0] += pulse
            track_b[idx:idx+600, 1] += pulse

    track_b[p_start:p_end, 0] *= breath_curve
    track_b[p_start:p_end, 1] *= breath_curve

    # Post-BAM: Cease active picking, guitar sustain decaying with warm cello
    track_b[bam_idx:, 0] = track_b[bam_idx:, 0] * 0.22 * fade_env + cello_faded * 0.85
    track_b[bam_idx:, 1] = track_b[bam_idx:, 1] * 0.22 * fade_env + cello_faded * 0.95

    # 44Hz BAM + Wood Snap
    track_b[bam_idx:bam_idx+len(sub_drop), 0] += sub_drop
    track_b[bam_idx:bam_idx+len(sub_drop), 1] += sub_drop
    track_b[bam_idx:bam_idx+len(wood_snap), 0] += wood_snap
    track_b[bam_idx:bam_idx+len(wood_snap), 1] += wood_snap

    track_b = track_b / (np.max(np.abs(track_b)) + 1e-6) * 0.88
    sf.write('public/audio/simulation_theme_B_kinetic_cascade.wav', track_b, sr)
    subprocess.run(['ffmpeg', '-y', '-i', 'public/audio/simulation_theme_B_kinetic_cascade.wav',
                    '-codec:a', 'libmp3lame', '-b:a', '320k', 'public/audio/simulation_theme_B_kinetic_cascade.mp3'], check=True)
    print("✅ Theme B rendered!")

    # =========================================================================
    # THEME C: Singularity Vacuum (Acoustic breath + suction drop + massive Dm9 chord)
    # =========================================================================
    print("\n--- Generating Theme C: Singularity Vacuum ---")
    prompt_c = (
        "Intimate acoustic guitar with warm fingerstyle chords, hushed cello drone, "
        "subtle warm acoustic room reverb, sudden vacuum drop before massive warm acoustic chord resolution, "
        "BBC science documentary theme, organic warmth, zero synths"
    )
    inputs_c = processor(text=[prompt_c], padding=True, return_tensors="pt")
    audio_c = model.generate(**inputs_c, max_new_tokens=600)[0, 0].cpu().numpy()
    resampled_c = scipy.signal.resample(audio_c, int(len(audio_c) * sr / 32000))
    resampled_c = resampled_c / (np.max(np.abs(resampled_c)) + 1e-6) * 0.85

    track_c = np.zeros((total_samples, 2))
    copy_len = min(len(resampled_c), total_samples)
    track_c[:copy_len, 0] = resampled_c[:copy_len]
    track_c[:copy_len, 1] = resampled_c[:copy_len]

    # Reverse suction sweep from 6.8s to 7.46s
    suck_start = int(6.8 * sr)
    suck_len = p_start - suck_start
    t_suck = np.linspace(0, suck_len / sr, suck_len)
    suction = (np.exp(t_suck * 3.5) / np.exp(suck_len/sr * 3.5)) * np.sin(2 * np.pi * (60 + 120 * (t_suck / (suck_len/sr))**2) * t_suck) * 0.28
    track_c[suck_start:p_start, 0] += suction
    track_c[suck_start:p_start, 1] += suction

    track_c[p_start:p_end, 0] *= breath_curve
    track_c[p_start:p_end, 1] *= breath_curve

    # Post-BAM: Massive warm acoustic resolution chord (Dm add9: D3, A3, F4, A4, C5, E5) + cello
    chord_freqs = [(146.83, 0.45, 3.8), (220.00, 0.38, 3.4), (349.23, 0.30, 3.0), (440.00, 0.24, 2.7), (523.25, 0.18, 2.3), (659.25, 0.12, 2.0)]
    sustain_chord = np.zeros(post_samples)
    for f, a, tau in chord_freqs:
        sustain_chord += np.sin(2 * np.pi * f * t_post) * np.exp(-t_post / tau) * a * 0.16

    track_c[bam_idx:, 0] = sustain_chord * fade_env + cello_faded * 1.1
    track_c[bam_idx:, 1] = sustain_chord * fade_env + cello_faded * 1.1

    track_c[bam_idx:bam_idx+len(sub_drop), 0] += sub_drop * 1.15
    track_c[bam_idx:bam_idx+len(sub_drop), 1] += sub_drop * 1.15

    track_c = track_c / (np.max(np.abs(track_c)) + 1e-6) * 0.88
    sf.write('public/audio/simulation_theme_C_singularity_vacuum.wav', track_c, sr)
    subprocess.run(['ffmpeg', '-y', '-i', 'public/audio/simulation_theme_C_singularity_vacuum.wav',
                    '-codec:a', 'libmp3lame', '-b:a', '320k', 'public/audio/simulation_theme_C_singularity_vacuum.mp3'], check=True)
    print("✅ Theme C rendered!")

    # Copy all 3 MP3s to artifacts directory
    artifact_dir = '/home/revenant/.gemini/antigravity/brain/e7c9dc1f-6305-464e-8322-b0b88de2e48b'
    for theme_name in ['A_gravitational_pulse', 'B_kinetic_cascade', 'C_singularity_vacuum']:
        mp3_file = f'public/audio/simulation_theme_{theme_name}.mp3'
        dest = os.path.join(artifact_dir, f'simulation_theme_{theme_name}.mp3')
        subprocess.run(['cp', mp3_file, dest], check=True)
        print(f"Copied {mp3_file} to artifacts: {dest}")

    print("\n🎉 ALL 3 ACOUSTIC THEMES SUCCESSFULLY GENERATED & MASTERED!")

if __name__ == '__main__':
    main()
