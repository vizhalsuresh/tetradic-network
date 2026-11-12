import os
import time
import torch
import soundfile as sf
import numpy as np
import scipy.signal
import subprocess
from transformers import AutoProcessor, MusicgenForConditionalGeneration

def main():
    print("Loading MusicGen model from local cache...")
    t0 = time.time()
    model_id = "facebook/musicgen-small"
    processor = AutoProcessor.from_pretrained(model_id, local_files_only=True)
    model = MusicgenForConditionalGeneration.from_pretrained(model_id, local_files_only=True)
    print(f"Model loaded in {time.time()-t0:.2f}s")

    tracks = [
        {
            "id": "optA",
            "name": "The Clockwork Artisan",
            "prompt": "Intricate fingerstyle acoustic guitar arpeggios, staccato marimba chime melody, delicate mechanical clockwork ticking, warm acoustic bass, prestigious documentary ident, crisp studio recording",
            "target_wav": "public/audio/blueprint_music_optA_clockwork_artisan.wav",
            "target_mp3": "public/audio/blueprint_music_optA_clockwork_artisan.mp3",
            "foley_type": "clockwork"
        },
        {
            "id": "optB",
            "name": "The Grand Architect",
            "prompt": "Solemn acoustic concert grand piano chord progression, rich cinematic bowed cello swell, noble brass accent, subtle mechanical relay click, dramatic orchestral sub drop, prestige broadcast theme",
            "target_wav": "public/audio/blueprint_music_optB_grand_architect.wav",
            "target_mp3": "public/audio/blueprint_music_optB_grand_architect.mp3",
            "foley_type": "orchestral"
        },
        {
            "id": "optC",
            "name": "The Kinetic Workshop",
            "prompt": "Bright 12-string acoustic guitar chords, metallic glockenspiel 4-note mnemonic jingle, rhythmic ratchet clicks, dynamic acoustic percussion, cinematic TV network ident, high production value",
            "target_wav": "public/audio/blueprint_music_optC_kinetic_workshop.wav",
            "target_mp3": "public/audio/blueprint_music_optC_kinetic_workshop.mp3",
            "foley_type": "kinetic"
        }
    ]

    target_sr = 48000
    target_samples = int(7.0 * target_sr)

    for track in tracks:
        print(f"\n--- Generating Track: {track['name']} ---")
        t_start = time.time()
        inputs = processor(text=[track["prompt"]], padding=True, return_tensors="pt")
        # 260 tokens ~ 5.2s
        audio_values = model.generate(**inputs, max_new_tokens=260)
        raw_audio = audio_values[0, 0].cpu().numpy()
        gen_sr = 32000
        print(f"Generated raw tokens in {time.time()-t_start:.2f}s")

        # Resample to 48kHz
        resampled = scipy.signal.resample(raw_audio, int(len(raw_audio) * target_sr / gen_sr))
        out_audio = np.zeros(target_samples)
        copy_len = min(len(resampled), target_samples)
        out_audio[:copy_len] = resampled[:copy_len]

        # Add bespoke Foley tailored to each option
        foley = np.zeros(target_samples)
        if track["foley_type"] == "clockwork":
            # Delicate clockwork ticks
            for t_sec in [0.3, 0.7, 1.1, 1.5, 1.9, 2.3, 2.7, 3.1, 3.5, 3.9, 4.3]:
                idx = int(t_sec * target_sr)
                if idx + 800 < target_samples:
                    tick = np.exp(-np.linspace(0, 10, 800)) * np.sin(2 * np.pi * 3800 * np.linspace(0, 800/target_sr, 800))
                    foley[idx:idx+800] += tick * 0.16
        elif track["foley_type"] == "orchestral":
            # Subtle mechanical relay click before cello swell
            for t_sec in [0.5, 1.5, 2.5, 3.5]:
                idx = int(t_sec * target_sr)
                if idx + 1000 < target_samples:
                    click = np.random.uniform(-1, 1, 1000) * np.exp(-np.linspace(0, 12, 1000)) * 0.12
                    foley[idx:idx+1000] += click
        else: # kinetic
            # Rapid ratchet gear clicks
            for t_sec in [0.2, 0.4, 0.6, 0.8, 1.2, 1.4, 1.6, 2.0, 2.4, 2.8, 3.2, 3.6, 4.0]:
                idx = int(t_sec * target_sr)
                if idx + 600 < target_samples:
                    ratchet = np.exp(-np.linspace(0, 14, 600)) * np.sin(2 * np.pi * 4500 * np.linspace(0, 600/target_sr, 600))
                    foley[idx:idx+600] += ratchet * 0.15

        # Snap Impact at 4.6s (Frame 138-140 in 30fps)
        snap_idx = int(4.6 * target_sr)
        snap_len = int(1.4 * target_sr)
        t_snap = np.linspace(0, 1.4, snap_len)
        sub_drop = np.sin(2 * np.pi * (52 * np.exp(-t_snap * 3.2)) * t_snap) * np.exp(-t_snap * 2.0) * 0.58
        click_len = 1400
        click = np.random.uniform(-1, 1, click_len) * np.exp(-np.linspace(0, 16, click_len)) * 0.38
        if snap_idx + snap_len < target_samples:
            foley[snap_idx:snap_idx+snap_len] += sub_drop
            foley[snap_idx:snap_idx+click_len] += click

        # Stereo mix and mastering
        mixed_l = out_audio * 0.88 + foley * 0.72
        mixed_r = out_audio * 0.88 + foley * 0.72
        stereo_r = np.roll(mixed_r, 150) # cinema stereo spread
        stereo = np.vstack([mixed_l, stereo_r]).T
        peak = np.max(np.abs(stereo))
        if peak > 0:
            stereo = (stereo / peak) * 0.92

        sf.write(track["target_wav"], stereo, target_sr)
        subprocess.run(["ffmpeg", "-y", "-i", track["target_wav"], "-b:a", "320k", track["target_mp3"]], check=True)
        print(f"Finished & mastered: {track['target_mp3']}")

        # Copy to brain artifact directory as well
        artifact_dir = "/home/revenant/.gemini/antigravity/brain/e7c9dc1f-6305-464e-8322-b0b88de2e48b"
        subprocess.run(["cp", track["target_mp3"], artifact_dir], check=True)

    print("\nAll 3 music options generated and mastered successfully!")

if __name__ == "__main__":
    main()
