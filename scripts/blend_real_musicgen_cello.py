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
    post_samples = total_samples - bam_idx

    print("--- 1. Loading Original Acoustic Guitar Track ---")
    # Load the original 12s acoustic guitar track
    orig_wav, file_sr = sf.read('public/audio/blueprint_master_guitar_strum_12s.wav')
    assert file_sr == sr

    master = np.zeros((total_samples, 2))
    # Pre-BAM: Keep pristine guitar strumming and ticks
    master[:bam_idx, :] = orig_wav[:bam_idx, :]

    # Post-BAM Guitar: Stop active rhythmic strumming, keep gentle guitar tail and fade out
    t_post = np.linspace(0, post_samples / sr, post_samples, endpoint=False)
    # Smooth exponential fade envelope for the 4.5s hero hold
    fade_env = np.exp(-t_post / 1.7) * np.clip(1.0 - (t_post / 4.45)**2.5, 0, 1)

    # Low-pass filter guitar tail at 1200 Hz to ensure pure warmth
    b_lp, a_lp = scipy.signal.butter(2, 1200 / (sr/2), btype='low')
    guitar_tail_l = scipy.signal.lfilter(b_lp, a_lp, orig_wav[bam_idx:, 0]) * 0.35 * fade_env
    guitar_tail_r = scipy.signal.lfilter(b_lp, a_lp, orig_wav[bam_idx:, 1]) * 0.35 * fade_env

    master[bam_idx:, 0] = guitar_tail_l
    master[bam_idx:, 1] = guitar_tail_r

    print("--- 2. Integrating Real Acoustic MusicGen Cello ---")
    cello_raw, cello_sr = sf.read('/tmp/test_musicgen_cello.wav')
    if cello_sr != sr:
        cello_raw = scipy.signal.resample(cello_raw, int(len(cello_raw) * sr / cello_sr))

    # Convert cello to mono if stereo or keep mono
    if cello_raw.ndim == 2:
        cello_mono = np.mean(cello_raw, axis=1)
    else:
        cello_mono = cello_raw

    # Normalize cello_mono
    cello_mono = cello_mono / (np.max(np.abs(cello_mono)) + 1e-6)

    # Fit cello to post_samples
    cello_len = min(len(cello_mono), post_samples)
    cello_track = np.zeros(post_samples)
    cello_track[:cello_len] = cello_mono[:cello_len]

    # Apply soft attack (250ms gentle bow-in, zero click) + slow unified fade
    attack_len = int(0.25 * sr)
    attack_curve = 0.5 * (1.0 - np.cos(np.pi * np.linspace(0, 1, attack_len)))
    cello_track[:attack_len] *= attack_curve
    cello_track *= fade_env

    # Apply Warm Acoustic Low-Pass Filter at 900 Hz to cello to ensure velvety Sul Tasto warmth
    b_c, a_c = scipy.signal.butter(2, 900 / (sr/2), btype='low')
    cello_track = scipy.signal.lfilter(b_c, a_c, cello_track)

    # Soft, warm volume blend (so it supports the guitar, not overpowering)
    cello_level = 0.32
    master[bam_idx:, 0] += cello_track * cello_level * 0.95
    master[bam_idx:, 1] += cello_track * cello_level * 1.05

    print("--- 3. Sub-Bass 48Hz Impact Boom at 7.50s ---")
    bam_len = int(2.0 * sr)
    t_bam = np.linspace(0, 2.0, bam_len)
    sub_drop = np.sin(2 * np.pi * (48 * np.exp(-t_bam * 2.2)) * t_bam) * np.exp(-t_bam * 1.6) * 0.55
    master[bam_idx:bam_idx+bam_len, 0] += sub_drop
    master[bam_idx:bam_idx+bam_len, 1] += sub_drop

    # Normalize cleanly
    peak = np.max(np.abs(master))
    print(f"Peak before normalization: {peak:.3f}")
    if peak > 0.90:
        master = master / peak * 0.88

    wav_out = 'public/audio/blueprint_master_guitar_strum_12s.wav'
    mp3_out = 'public/audio/blueprint_master_guitar_strum_12s.mp3'
    sf.write(wav_out, master, sr)
    print(f"Saved master WAV: {wav_out}")

    subprocess.run([
        'ffmpeg', '-y', '-i', wav_out,
        '-codec:a', 'libmp3lame', '-b:a', '320k',
        mp3_out
    ], check=True)
    print(f"Saved 320kbps MP3: {mp3_out}")

    # Synchronize default tracks
    subprocess.run([
        'ffmpeg', '-y', '-i', wav_out,
        '-codec:a', 'libmp3lame', '-b:a', '320k',
        'public/audio/blueprint_master_guitar_strum.mp3'
    ], check=True)
    subprocess.run([
        'ffmpeg', '-y', '-i', wav_out,
        '-codec:a', 'libmp3lame', '-b:a', '320k',
        'public/audio/blueprint_master_rising_score.mp3'
    ], check=True)

    # Copy to artifacts directory
    artifact_mp3 = '/home/revenant/.gemini/antigravity/brain/e7c9dc1f-6305-464e-8322-b0b88de2e48b/blueprint_master_guitar_strum_12s.mp3'
    subprocess.run(['cp', mp3_out, artifact_mp3], check=True)
    print(f"Copied master audio to artifacts: {artifact_mp3}")

    # Inspect rms in the tail
    rms_10_11 = np.sqrt(np.mean(master[int(10.0*sr):int(11.0*sr)]**2))
    rms_11_12 = np.sqrt(np.mean(master[int(11.0*sr):int(11.95*sr)]**2))
    print(f"RMS at 10-11s: {rms_10_11:.5f}")
    print(f"RMS at 11-12s: {rms_11_12:.5f}")
    print("✅ Real acoustic cello blend complete!")

if __name__ == '__main__':
    main()
