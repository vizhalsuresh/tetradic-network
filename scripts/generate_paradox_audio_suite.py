import os
import soundfile as sf
import numpy as np
import scipy.signal
import subprocess

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
    sub_drop = np.sin(2 * np.pi * (44 * np.exp(-t_bam * 2.2)) * t_bam) * np.exp(-t_bam * 1.5) * 0.70

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

    # Load authentic recorded cello
    cello_raw, cello_sr = sf.read('/tmp/test_musicgen_cello.wav')
    if cello_sr != sr:
        cello_raw = scipy.signal.resample(cello_raw, int(len(cello_raw) * sr / cello_sr))
    if cello_raw.ndim == 2:
        cello_raw = np.mean(cello_raw, axis=1)
    cello_raw = cello_raw / (np.max(np.abs(cello_raw)) + 1e-6)

    # Synthesize film noir felt piano & acoustic guitar mystery motif
    t = np.linspace(0, duration, total_samples, endpoint=False)
    audio = np.zeros(total_samples, dtype=np.float32)

    # Piano chords: mysterious Cm9 (C2, G2, Eb3, Bb3, D4) and F#dim / Abmaj7
    def add_piano_note(freq, start_t, dur, vel):
        idx = int(start_t * sr)
        n_samples = min(int(dur * sr), total_samples - idx)
        if n_samples <= 0: return
        tn = np.linspace(0, n_samples / sr, n_samples, endpoint=False)
        # Felt piano harmonics: warm fundamental + dampened 2nd and 3rd harmonics
        note = (np.sin(2 * np.pi * freq * tn) * 0.6 +
                np.sin(2 * np.pi * 2 * freq * tn) * 0.25 +
                np.sin(2 * np.pi * 3 * freq * tn) * 0.1) * np.exp(-tn / 1.8) * vel
        audio[idx:idx + n_samples] += note

    # Pre-BAM rhythm: Mysterious descending bass notes and ticking curiosity (0.0 to 7.46s)
    notes = [
        (65.4, 0.0, 2.5, 0.4),   # C2
        (98.0, 0.8, 2.0, 0.35),  # G2
        (155.56, 1.6, 2.0, 0.3), # Eb3
        (233.08, 2.4, 2.0, 0.3), # Bb3
        (293.66, 3.2, 2.0, 0.28),# D4
        (58.27, 4.0, 2.5, 0.45), # Bb1
        (87.31, 4.8, 2.0, 0.35), # F2
        (138.59, 5.6, 1.8, 0.3), # C#3
        (185.00, 6.4, 1.2, 0.35) # F#3 tension note
    ]
    for freq, st, dur, vel in notes:
        add_piano_note(freq, st, dur, vel)

    # Organic clockwork tick / cards shuffle (tactile wooden foley)
    for tick_time in np.arange(0.5, 7.3, 0.5):
        t_idx = int(tick_time * sr)
        tk_len = int(0.015 * sr)
        if t_idx + tk_len < total_samples:
            tk = np.random.randn(tk_len) * np.exp(-np.linspace(0, 15, tk_len)) * 0.06
            audio[t_idx:t_idx + tk_len] += tk

    # Apply 40ms pre-impact breath
    audio[p_start:p_end] *= breath_curve
    # Active pre-BAM rhythm zeroed out after 7.50s
    audio[bam_idx:] = 0.0

    # At 7.50s BAM: Add Seismic Sub-Bass Drop
    audio[bam_idx:bam_idx + len(sub_drop)] += sub_drop
    audio[bam_idx:bam_idx + len(wood_snap)] += wood_snap

    # At 7.50s BAM: Monolithic C minor 9 sustained chord
    post_piano = np.zeros(post_samples, dtype=np.float32)
    chord_freqs = [65.41, 130.81, 155.56, 196.00, 233.08, 293.66] # C2, C3, Eb3, G3, Bb3, D4
    for f in chord_freqs:
        post_piano += np.sin(2 * np.pi * f * t_post) * np.exp(-t_post / 1.8) * 0.12

    # Add authentic recorded cello bloom over the 4.5s hero hold
    cello_len = min(len(cello_raw), post_samples)
    cello_bloom = cello_raw[:cello_len] * fade_env[:cello_len] * 0.32

    # Combine post-BAM hero hold
    audio[bam_idx:bam_idx + post_samples] += post_piano * fade_env
    audio[bam_idx:bam_idx + cello_len] += cello_bloom

    # Low-pass filter at 900Hz for warmth + gentle compression
    b, a = scipy.signal.butter(2, 900 / (sr / 2), btype='low')
    audio = scipy.signal.lfilter(b, a, audio) * 0.85 + audio * 0.15

    # Peak normalize to -1.0 dB
    peak = np.max(np.abs(audio))
    if peak > 0:
        audio = (audio / peak) * 0.89

    # Stereo widening: subtle haas effect (0.7ms delay on right channel)
    delay_samples = int(0.0007 * sr)
    left = audio
    right = np.roll(audio, delay_samples)
    right[:delay_samples] = 0
    stereo = np.column_stack([left, right])

    wav_out = 'public/audio/paradox_theme_master_12s.wav'
    mp3_out = 'public/audio/paradox_theme_master_12s.mp3'
    sf.write(wav_out, stereo, sr)
    subprocess.run(['ffmpeg', '-y', '-i', wav_out, '-b:a', '320k', mp3_out], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    print(f"Generated {mp3_out} successfully! Peak: {np.max(np.abs(stereo)):.2f}")

if __name__ == '__main__':
    main()
