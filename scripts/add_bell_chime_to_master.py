import numpy as np
import soundfile as sf
import subprocess

def main():
    sr = 48000
    duration = 12.0
    total_samples = int(duration * sr)

    # 1. Load the existing master audio that the user praised ("perfect background sound")
    current_master, file_sr = sf.read('public/audio/blueprint_master_guitar_strum_12s.wav')
    if file_sr != sr:
        raise ValueError("Sample rate mismatch")

    # 2. Synthesize the Prestigious Orchestral Bell Chime (Impact at 7.50s = Frame 225)
    bam_time = 7.50
    bam_idx = int(bam_time * sr)
    bell_duration = duration - bam_time # 4.50 seconds
    bell_samples = total_samples - bam_idx
    t = np.linspace(0, bell_duration, bell_samples, endpoint=False)

    f0 = 587.33 # Fundamental D5 in key with D-minor guitar

    # True acoustic bell partial ratios, relative amplitudes, and natural decay rates
    partials = [
        [0.5,   0.40, 3.8],  # Hum tone (D4: 293.66 Hz) - deep warm foundation
        [1.0,   0.55, 3.4],  # Prime strike tone (D5: 587.33 Hz) - core bell resonance
        [1.189, 0.38, 2.8],  # Tierce (minor third F5: 698 Hz) - mysterious, solemn character
        [1.5,   0.32, 3.0],  # Quint (fifth A5: 881 Hz) - noble harmonic brilliance
        [2.0,   0.28, 2.0],  # Octave (D6: 1174 Hz) - singing clarity
        [2.75,  0.20, 1.4],  # Upper harmonic partial 1
        [3.36,  0.16, 1.0],  # Upper harmonic partial 2 (chime glint)
        [4.07,  0.12, 0.8],  # Strike shimmer
        [5.43,  0.08, 0.5],  # High metal transient
    ]

    bell_l = np.zeros(bell_samples)
    bell_r = np.zeros(bell_samples)

    for ratio, amp, tau in partials:
        freq = f0 * ratio
        # Gentle acoustic beating (0.75 Hz) for natural air fluctuation
        beat = 1.0 + 0.0018 * np.sin(2 * np.pi * 0.75 * t)
        decay = np.exp(-t / tau)
        
        # Stereo panning spread across frequencies
        pan = 0.5 + 0.28 * np.sin(ratio * 3.8)
        wave = np.sin(2 * np.pi * freq * beat * t) * decay * amp
        bell_l += wave * (1.0 - pan)
        bell_r += wave * pan

    # Strike transient: metallic hammer on bronze alloy (first 25ms)
    strike_len = int(0.025 * sr)
    t_strike = np.linspace(0, 0.025, strike_len)
    hammer = (
        np.exp(-t_strike / 0.004) * np.sin(2 * np.pi * 3100 * t_strike) * 0.40 +
        np.exp(-t_strike / 0.002) * np.random.uniform(-1, 1, strike_len) * 0.25
    )
    bell_l[:strike_len] += hammer * 0.5
    bell_r[:strike_len] += hammer * 0.5

    # Taper smoothly at the end so it decays cleanly to zero
    fade_len = int(0.15 * sr)
    fade_env = np.linspace(1, 0, fade_len)
    bell_l[-fade_len:] *= fade_env
    bell_r[-fade_len:] *= fade_env

    # Scale bell level to sit beautifully in the mix (present, crystalline, but not deafening)
    bell_max = max(np.max(np.abs(bell_l)), np.max(np.abs(bell_r)))
    bell_l = (bell_l / bell_max) * 0.46
    bell_r = (bell_r / bell_max) * 0.46

    # 3. Layer Bell into Master Audio Track
    master_new = current_master.copy()
    master_new[bam_idx:, 0] += bell_l
    master_new[bam_idx:, 1] += bell_r

    # Soft Limiter / Tanh Saturation
    peak = np.max(np.abs(master_new))
    if peak > 0.95:
        master_new = np.tanh(master_new / peak * 1.12) * 0.92

    # Save output WAV
    wav_path = 'public/audio/blueprint_master_guitar_strum_12s.wav'
    mp3_path = 'public/audio/blueprint_master_guitar_strum_12s.mp3'
    sf.write(wav_path, master_new, sr)
    print(f"Saved bell-enhanced master WAV: {wav_path} (Peak: {np.max(np.abs(master_new)):.3f})")

    # Encode to 320kbps MP3
    subprocess.run([
        'ffmpeg', '-y', '-i', wav_path,
        '-codec:a', 'libmp3lame', '-b:a', '320k',
        mp3_path
    ], check=True)
    print(f"Generated 320kbps MP3: {mp3_path}")

    # Synchronize default track aliases
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
    print("All endpoints synchronized with bell-enhanced 12s master!")

if __name__ == '__main__':
    main()
