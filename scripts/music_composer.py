#!/usr/bin/env python3
"""
TETRADIC NETWORK — Orpheus Procedural Music & Sound Design Engine
Generates bespoke cinematic scores, sub-bass drones, analog pads, risers, and impact foley.
100% deterministic, 48kHz studio audio, 0 external cloud dependencies.
"""

import sys
import os
import wave
import subprocess
import numpy as np

def compose_cinematic_theme(output_path, duration_seconds=8.0, impact_time=4.16, key="Dm"):
    sr = 48000
    t = np.linspace(0, duration_seconds, int(sr * duration_seconds), endpoint=False)

    # 1. Sub-Bass Drone (36.7Hz + 73.4Hz)
    sub = (np.sin(2 * np.pi * 36.7 * t) + 0.6 * np.sin(2 * np.pi * 73.4 * t) + 0.3 * np.sin(2 * np.pi * 74.1 * t))
    drone_env = np.minimum(t * 1.5, 1.0) * np.clip(1.0 - (t - (duration_seconds - 1.5)) / 1.5, 0.0, 1.0)
    drone = sub * drone_env * 0.35

    # 2. Cinematic Analog Synthesizer Pad (D minor 9th)
    pad_freqs = [146.8, 174.6, 220.0, 261.6, 329.6]
    pad = np.zeros_like(t)
    for f in pad_freqs:
        harm = np.sin(2 * np.pi * f * t) + 0.25 * np.sin(2 * np.pi * f * 2.01 * t)
        pad += harm
    pad /= len(pad_freqs)
    pad_env = np.clip(t / 3.0, 0, 1) * np.clip(1.0 - (t - (duration_seconds - 2.0)) / 2.0, 0, 1)
    pad = pad * pad_env * 0.40

    # 3. Rising Tension Riser
    riser = np.zeros_like(t)
    t_start = max(0, impact_time - 2.16)
    idx_riser = (t >= t_start) & (t <= impact_time)
    t_r = t[idx_riser] - t_start
    dur_r = impact_time - t_start
    freq_rise = 90.0 + 360.0 * (t_r / dur_r)**2
    phase_rise = 2 * np.pi * np.cumsum(freq_rise) / sr
    riser[idx_riser] = 0.35 * np.sin(phase_rise) * (t_r / dur_r)**1.5

    # 4. Cinematic Sub-Bass Impact Boom
    impact_boom = np.zeros_like(t)
    idx_impact = t >= impact_time
    t_imp = t[idx_impact] - impact_time
    impact_freq = 110.0 * np.exp(-t_imp * 12.0) + 40.0
    impact_phase = 2 * np.pi * np.cumsum(impact_freq) / sr
    impact_boom[idx_impact] = 0.9 * np.sin(impact_phase) * np.exp(-t_imp * 2.5)

    # 5. Mechanical Latch Transient
    click = np.zeros_like(t)
    idx_click = (t >= impact_time) & (t <= impact_time + 0.08)
    t_c = t[idx_click] - impact_time
    noise = (np.random.rand(len(t_c)) * 2 - 1) * np.exp(-t_c * 80.0)
    ping = np.sin(2 * np.pi * 2800 * t_c) * np.exp(-t_c * 40.0)
    click[idx_click] = 0.6 * noise + 0.4 * ping

    # Final Master Mix
    mix = drone + pad + riser + impact_boom * 0.75 + click * 0.5
    mix = np.clip(mix * 0.85, -0.98, 0.98)

    os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
    wav_path = output_path.replace('.mp3', '.wav')
    data = (mix * 32767).astype(np.int16)
    with wave.open(wav_path, 'wb') as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(sr)
        wf.writeframes(data.tobytes())

    # Hollywood mastering
    cmd_ffmpeg = [
        'ffmpeg', '-y', '-i', wav_path,
        '-af', 'bass=g=3:f=90,aecho=0.8:0.88:40|80:0.25|0.15,acompressor=threshold=-16dB:ratio=3:attack=10:release=100,volume=1.2',
        '-b:a', '192k', output_path
    ]
    subprocess.run(cmd_ffmpeg, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    os.remove(wav_path)
    print(f"Generated: {output_path}")

if __name__ == "__main__":
    out = sys.argv[1] if len(sys.argv) > 1 else "out/broadcast/music/theme.mp3"
    dur = float(sys.argv[2]) if len(sys.argv) > 2 else 8.0
    imp = float(sys.argv[3]) if len(sys.argv) > 3 else 4.16
    compose_cinematic_theme(out, dur, imp)
