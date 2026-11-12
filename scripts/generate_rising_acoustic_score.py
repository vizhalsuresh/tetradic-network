import numpy as np
import soundfile as sf
import scipy.signal
import subprocess

def create_rising_acoustic_score():
    sr = 48000
    duration = 7.0
    total_samples = int(duration * sr)
    t = np.linspace(0, duration, total_samples, endpoint=False)

    # 1. Load the real acoustic MusicGen generation from earlier as the organic texture base
    # out/test_musicgen_guitar_piano.wav has real acoustic guitar & piano
    data, gen_sr = sf.read('out/test_musicgen_guitar_piano.wav')
    if len(data.shape) > 1:
        data = data[:, 0]
    
    # Resample to 48kHz
    resampled = scipy.signal.resample(data, int(len(data) * sr / gen_sr))
    
    # 2. Build Act 1 (0.0s - 2.2s): Quiet, delicate acoustic drafting intro
    # We apply an envelope that starts soft and gradually builds
    intro_env = np.clip(t / 2.2, 0, 1)
    
    # 3. Build Act 2 & 3 (2.2s - 4.6s): RISING TENSION CURVE
    # Exponential acoustic riser:
    # Rising pitch sweep simulating accelerating guitar/string harmonics
    t_rise = np.clip((t - 2.0) / 2.5, 0, 1)
    # Pitch rises from 220Hz (A3) up to 880Hz (A5)
    rise_freq = 220 * (4.0 ** t_rise)
    # Phase accumulation for continuous frequency modulation
    phase = 2 * np.pi * np.cumsum(rise_freq) / sr
    # Warm acoustic harmonic series (odd & even harmonics)
    acoustic_riser = (
        0.5 * np.sin(phase) +
        0.3 * np.sin(2 * phase) +
        0.15 * np.sin(3 * phase) +
        0.08 * np.sin(4 * phase)
    )
    # Modulate riser volume with exponential growth right up to 4.55s
    riser_gain = np.where((t >= 2.0) & (t < 4.55), np.exp((t - 4.55) * 1.8), 0.0)
    acoustic_riser = acoustic_riser * riser_gain

    # Accelerating clockwork tick rhythm synced to the video lift-off
    ticks = np.zeros(total_samples)
    # Ticks accelerate as time approaches 4.5s
    tick_times = [
        0.4, 0.8, 1.2, 1.6, 2.0, 2.3, 2.6, 2.85, 3.1, 3.3, 3.5, 3.7, 3.85, 4.0, 4.12, 4.24, 4.34, 4.42, 4.50
    ]
    for tt in tick_times:
        idx = int(tt * sr)
        if idx + 700 < total_samples:
            # Mechanical escapement transient
            tick_pulse = np.exp(-np.linspace(0, 12, 700)) * np.sin(2 * np.pi * 3600 * np.linspace(0, 700/sr, 700))
            # Velocity increases closer to impact
            vol = 0.12 + 0.28 * (tt / 4.55)
            ticks[idx:idx+700] += tick_pulse * vol

    # 4. PRE-IMPACT MICRO-PAUSE (4.55s - 4.60s / Frames 136-138)
    # 50ms of tension drop right before the snap lock
    pre_impact_mute = np.where((t >= 4.55) & (t < 4.60), 0.05, 1.0)

    # 5. IMPACT & RESOLUTION (4.60s - 7.0s / Frames 138-210)
    # Frame 138 = 138 / 30 = 4.60s
    t_post = t - 4.60
    post_mask = t >= 4.60
    
    # Sub-bass cinematic boom (42Hz fundamental falling to 28Hz)
    boom_freq = 46.0 * np.exp(-t_post * 2.8)
    boom_phase = 2 * np.pi * np.cumsum(boom_freq) / sr
    sub_boom = np.where(post_mask, np.sin(boom_phase) * np.exp(-t_post * 2.1) * 0.65, 0.0)

    # Metallic hydraulic snap click transient at 4.60s
    snap_idx = int(4.60 * sr)
    snap_len = 1600
    snap_transient = np.zeros(total_samples)
    if snap_idx + snap_len < total_samples:
        click = np.random.uniform(-1, 1, snap_len) * np.exp(-np.linspace(0, 18, snap_len)) * 0.45
        snap_transient[snap_idx:snap_idx+snap_len] = click

    # Warm Acoustic Grand Piano / Guitar Resolution Chord (Dm9: D, F, A, C, E)
    # Ringing out from 4.60s to 7.0s
    chord_freqs = [146.83, 174.61, 220.00, 261.63, 329.63, 440.00] # D3, F3, A3, C4, E4, A4
    resolution_chord = np.zeros(total_samples)
    for f in chord_freqs:
        tone = np.sin(2 * np.pi * f * t_post) + 0.3 * np.sin(2 * np.pi * 2 * f * t_post)
        decay = np.exp(-t_post * 0.95) # long natural piano decay
        resolution_chord += np.where(post_mask, tone * decay * 0.08, 0.0)

    # 6. Fit the MusicGen acoustic guitar track into the timeline
    musicgen_bed = np.zeros(total_samples)
    bed_len = min(len(resampled), total_samples)
    musicgen_bed[:bed_len] = resampled[:bed_len]
    # Duck musicgen slightly during the riser so the riser cuts through cleanly
    musicgen_bed = musicgen_bed * np.where(t < 2.0, 0.7, np.where(t < 4.55, 0.5, 0.3))

    # 7. MASTER MIX (Stereo Soundstage)
    combined_mono = (
        (musicgen_bed * 0.75 + acoustic_riser * 0.85 + ticks * 0.8) * pre_impact_mute +
        sub_boom +
        snap_transient +
        resolution_chord * 0.9
    )

    # Stereo widening: left and right decorrelated
    left = combined_mono
    right = np.roll(combined_mono, 130) # 2.7ms Haas psychoacoustic stereo spread
    stereo = np.vstack([left, right]).T

    # Peak normalization to -0.8 dBFS
    peak = np.max(np.abs(stereo))
    if peak > 0:
        stereo = (stereo / peak) * 0.92

    wav_path = 'public/audio/blueprint_master_rising_score.wav'
    mp3_path = 'public/audio/blueprint_master_rising_score.mp3'
    sf.write(wav_path, stereo, sr)

    subprocess.run([
        'ffmpeg', '-y', '-i', wav_path,
        '-b:a', '320k',
        mp3_path
    ], check=True)

    # Copy to brain artifact directory
    subprocess.run(['cp', mp3_path, '/home/revenant/.gemini/antigravity/brain/e7c9dc1f-6305-464e-8322-b0b88de2e48b/'], check=True)
    print("Master rising acoustic score generated and mastered successfully at:", mp3_path)

if __name__ == '__main__':
    create_rising_acoustic_score()
