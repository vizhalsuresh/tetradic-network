import numpy as np
import soundfile as sf
import scipy.signal
import subprocess

def main():
    sr = 48000
    duration = 12.0
    total_samples = int(duration * sr)
    bam_time = 7.50
    bam_idx = int(bam_time * sr)

    # 1. Load the original MusicGen acoustic guitar generation from scripts/generate_guitar_strum_12s.py
    # or the raw generation
    orig_wav, file_sr = sf.read('public/audio/blueprint_master_guitar_strum_12s.wav')
    if file_sr != sr:
        raise ValueError("Sample rate mismatch")

    # 2. Separate Pre-BAM Guitar and Post-BAM Sustain
    # The user says: "to end the total guitar slowly fade te guitar and the bell togete"
    # Pre-BAM (0.0s to 7.5s): We keep the beautiful acoustic guitar strumming & arpeggios that the user loved!
    guitar_track = orig_wav.copy()
    
    # At 7.50s, we END the active rhythmic guitar playing!
    # Instead, we let the final acoustic chord sustain and smoothly fade out together with the mild chime
    post_bam_samples = total_samples - bam_idx
    t_post = np.linspace(0, post_bam_samples / sr, post_bam_samples, endpoint=False)

    # Smooth exponential unified fade-out envelope for guitar and chime (slow, gentle fade over 4.5s)
    fade_env = np.exp(-t_post / 1.7) * np.clip(1.0 - (t_post / 4.45)**2.5, 0, 1)

    # In the original track, guitar was continuing to play rhythmically past 7.5s.
    # To "end the total guitar" and only have a gentle ringing sustain that fades out:
    # We take the acoustic resonance at 7.5s and apply a warm resonant filter + fade_env:
    # Create lush acoustic grand piano & guitar sustain chord (Dm9: D3, A3, F4, A4, C5, E5)
    sustain_chord = np.zeros(post_bam_samples)
    chord_partials = [
        (146.83, 0.40, 3.5), # D3 (warm acoustic body)
        (220.00, 0.35, 3.2), # A3
        (349.23, 0.30, 2.8), # F4 (minor warmth)
        (440.00, 0.25, 2.5), # A4
        (523.25, 0.20, 2.2), # C5 (7th)
        (659.25, 0.16, 2.0), # E5 (9th color)
    ]
    for freq, amp, tau in chord_partials:
        decay = np.exp(-t_post / tau)
        # Subtle harmonic richness
        sustain_chord += np.sin(2 * np.pi * freq * t_post) * decay * amp * 0.18

    # Apply the fade to any residual post-bam audio, ducking active rhythm by 80% and blending with sustain
    guitar_post_l = guitar_track[bam_idx:, 0] * 0.25 * fade_env + sustain_chord * fade_env
    guitar_post_r = guitar_track[bam_idx:, 1] * 0.25 * fade_env + sustain_chord * fade_env

    guitar_track[bam_idx:, 0] = guitar_post_l
    guitar_track[bam_idx:, 1] = guitar_post_r

    # 3. Synthesize the MILD CRYSTALLINE CHIME (Not a loud heavy bell, very mild and gentle)
    # Think of a celestial glass chime / soft wind chime / singing crystal chime
    f0 = 587.33 # D5 fundamental

    # Mild, soft harmonic chime partials with gentle mallet attack
    chime_partials = [
        (1.0,   0.28, 3.6), # D5 - delicate crystalline prime
        (1.5,   0.18, 3.2), # A5 - pure fifth warmth
        (2.0,   0.14, 2.5), # D6 - clear octave chime
        (2.75,  0.08, 1.8), # Gentle upper shimmer
        (3.0,   0.06, 1.4), # Pure harmonic
        (4.0,   0.04, 1.0), # Soft glass glint
    ]

    chime_l = np.zeros(post_bam_samples)
    chime_r = np.zeros(post_bam_samples)

    for ratio, amp, tau in chime_partials:
        freq = f0 * ratio
        # Very gentle air beating (0.5 Hz)
        beat = 1.0 + 0.0012 * np.sin(2 * np.pi * 0.5 * t_post)
        decay = np.exp(-t_post / tau) * fade_env
        pan = 0.5 + 0.22 * np.sin(ratio * 2.8)
        wave = np.sin(2 * np.pi * freq * beat * t_post) * decay * amp
        chime_l += wave * (1.0 - pan)
        chime_r += wave * pan

    # Soft felt mallet strike (very mild, NO harsh metal click!)
    strike_len = int(0.015 * sr)
    t_strike = np.linspace(0, 0.015, strike_len)
    soft_mallet = np.exp(-t_strike / 0.005) * np.sin(2 * np.pi * 1200 * t_strike) * 0.12
    chime_l[:strike_len] += soft_mallet * 0.5
    chime_r[:strike_len] += soft_mallet * 0.5

    # Master Sum:
    master = guitar_track.copy()
    
    # Pre-BAM (0.0s - 7.5s): untouched, perfectly balanced acoustic guitar + clock ticks
    # Post-BAM (7.5s - 12.0s): guitar sustain + mild chime slowly fading together
    master[bam_idx:, 0] += chime_l * 0.85
    master[bam_idx:, 1] += chime_r * 0.85

    # Peak normalization
    peak = np.max(np.abs(master))
    if peak > 0.92:
        master = master / peak * 0.88

    # Output paths
    wav_path = 'public/audio/blueprint_master_guitar_strum_12s.wav'
    mp3_path = 'public/audio/blueprint_master_guitar_strum_12s.mp3'
    sf.write(wav_path, master, sr)
    print(f"Saved mild chime & unified fade master WAV: {wav_path} (Peak: {np.max(np.abs(master)):.3f})")

    # Encode to 320kbps MP3
    subprocess.run([
        'ffmpeg', '-y', '-i', wav_path,
        '-codec:a', 'libmp3lame', '-b:a', '320k',
        mp3_path
    ], check=True)
    print(f"Generated 320kbps MP3: {mp3_path}")

    # Synchronize default aliases
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
    print("All endpoints synchronized with mild chime 12s master!")

if __name__ == '__main__':
    main()
