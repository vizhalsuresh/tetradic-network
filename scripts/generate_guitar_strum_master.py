import numpy as np
import soundfile as sf
import scipy.signal
import subprocess

def main():
    sr = 48000
    duration = 7.0
    total_samples = int(duration * sr)
    t = np.linspace(0, duration, total_samples, endpoint=False)

    # 1. Load the pristine acoustic guitar strumming from Option A (The Clockwork Artisan)
    optA_data, optA_sr = sf.read('public/audio/blueprint_music_optA_clockwork_artisan.wav')
    if optA_sr != sr:
        optA_data = scipy.signal.resample(optA_data, int(len(optA_data) * sr / optA_sr))
    
    # Ensure stereo shape (total_samples, 2)
    if len(optA_data.shape) == 1:
        optA_data = np.column_stack([optA_data, optA_data])
    
    music = np.zeros((total_samples, 2))
    copy_len = min(len(optA_data), total_samples)
    music[:copy_len] = optA_data[:copy_len]

    # Normalize music
    music = music / (np.max(np.abs(music)) + 1e-6) * 0.88

    # 2. Organic mechanical Foley (NO artificial sine risers, only pure tactile mechanical clock ticks)
    foley = np.zeros((total_samples, 2))
    
    # Tactile clockwork ticks accompanying the drafting lines (Acts 1-3)
    tick_times = [
        0.3, 0.7, 1.1, 1.5, 1.9, 2.3, 2.7, 3.1, 3.4, 3.7, 3.95, 4.15, 4.30, 4.42, 4.52
    ]
    for tt in tick_times:
        idx = int(tt * sr)
        if idx + 800 < total_samples:
            # Mechanical escapement click
            t_pulse = np.linspace(0, 800/sr, 800)
            pulse = np.exp(-np.linspace(0, 14, 800)) * np.sin(2 * np.pi * 4200 * t_pulse)
            # Subtle stereo spread
            pan = 0.5 + 0.15 * np.sin(tt * 5)
            foley[idx:idx+800, 0] += pulse * 0.18 * (1 - pan)
            foley[idx:idx+800, 1] += pulse * 0.18 * pan

    # 3. Micro-Pause (Breath) right before 3D BAM: 4.56s - 4.60s (Frames 136-137)
    # Dip volume gently by 50% for 40ms to create dramatic contrast before impact
    pause_mask = np.ones((total_samples, 1))
    p_start = int(4.55 * sr)
    p_end = int(4.60 * sr)
    pause_curve = 0.4 + 0.6 * np.cos(np.linspace(0, np.pi, p_end - p_start))
    pause_mask[p_start:p_end, 0] = pause_curve
    music = music * pause_mask

    # 4. The 3D Dimensional BAM (Frame 138 = 4.60s)
    # A) Heavy Sub-Bass Boom (48Hz punch decaying organically over 1.6s)
    bam_idx = int(4.60 * sr)
    bam_len = int(1.6 * sr)
    t_bam = np.linspace(0, 1.6, bam_len)
    sub_drop = np.sin(2 * np.pi * (50 * np.exp(-t_bam * 2.8)) * t_bam) * np.exp(-t_bam * 1.8) * 0.68
    
    # B) Crisp Mechanical Latch Clamp Click (metallic snap lock transient)
    click_len = int(0.06 * sr) # 60ms
    t_click = np.linspace(0, 0.06, click_len)
    metal_snap = (
        np.exp(-np.linspace(0, 20, click_len)) * np.sin(2 * np.pi * 3200 * t_click) * 0.35 +
        np.exp(-np.linspace(0, 35, click_len)) * np.random.uniform(-1, 1, click_len) * 0.28
    )

    if bam_idx + bam_len < total_samples:
        foley[bam_idx:bam_idx+bam_len, 0] += sub_drop
        foley[bam_idx:bam_idx+bam_len, 1] += sub_drop
    if bam_idx + click_len < total_samples:
        foley[bam_idx:bam_idx+click_len, 0] += metal_snap
        foley[bam_idx:bam_idx+click_len, 1] += metal_snap

    # 5. Master Sum & Soft Clip Limiter
    master = music + foley
    peak = np.max(np.abs(master))
    if peak > 0.95:
        master = np.tanh(master / peak * 1.2) * 0.92
    
    # Save WAV
    wav_path = 'public/audio/blueprint_master_guitar_strum.wav'
    sf.write(wav_path, master, sr)
    print(f"Saved master WAV: {wav_path}")

    # Convert to MP3 at 320kbps
    mp3_path = 'public/audio/blueprint_master_guitar_strum.mp3'
    cmd = [
        'ffmpeg', '-y', '-i', wav_path,
        '-codec:a', 'libmp3lame', '-b:a', '320k',
        mp3_path
    ]
    subprocess.run(cmd, check=True)
    print(f"Generated 320kbps MP3: {mp3_path}")

    # Also update blueprint_master_rising_score.mp3 so any cached component immediately uses this strumming version
    cmd2 = [
        'ffmpeg', '-y', '-i', wav_path,
        '-codec:a', 'libmp3lame', '-b:a', '320k',
        'public/audio/blueprint_master_rising_score.mp3'
    ]
    subprocess.run(cmd2, check=True)
    print("Synchronized blueprint_master_rising_score.mp3 with master guitar strum score!")

if __name__ == '__main__':
    main()
