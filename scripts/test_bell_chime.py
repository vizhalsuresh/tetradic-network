import numpy as np
import soundfile as sf
import scipy.signal

sr = 48000
duration = 5.0
t = np.linspace(0, duration, int(duration * sr), endpoint=False)

# Fundamental D5 (587.33 Hz) matching D-minor key of the guitar
f0 = 587.33

# True orchestral bell partial ratios & relative amplitudes & decay rates
# [frequency_ratio, amplitude, decay_time_constant]
partials = [
    [0.5,  0.45, 4.2],  # Hum tone (D4: 293.66 Hz) - deep, long resonance
    [1.0,  0.60, 3.8],  # Prime / Strike tone (D5: 587.33 Hz) - core bell body
    [1.189, 0.40, 2.8], # Tierce (minor third F5: ~698 Hz) - solemn bell identity
    [1.5,  0.35, 3.2],  # Quint (fifth A5: 881 Hz) - noble harmony
    [2.0,  0.30, 2.2],  # Octave / Nominal (D6: 1174 Hz) - clarity
    [2.75, 0.22, 1.4],  # Upper partial 1 - metallic bite
    [3.36, 0.18, 1.1],  # Upper partial 2 - crystal shimmer
    [4.07, 0.14, 0.9],  # Upper partial 3 - strike glint
    [5.43, 0.10, 0.6],  # High clang transient
]

bell = np.zeros_like(t)

for ratio, amp, tau in partials:
    freq = f0 * ratio
    # Add subtle frequency beating / chorusing (0.8 Hz) for organic physical bell motion
    beat = 1.0 + 0.002 * np.sin(2 * np.pi * 0.8 * t)
    decay = np.exp(-t / tau)
    partial_wave = np.sin(2 * np.pi * freq * beat * t) * decay * amp
    bell += partial_wave

# Strike transient: metallic hammer click on bronze (initial 15ms)
strike_len = int(0.02 * sr)
t_strike = np.linspace(0, 0.02, strike_len)
hammer = np.exp(-t_strike / 0.003) * np.sin(2 * np.pi * 2800 * t_strike) * 0.45
hammer += np.random.uniform(-1, 1, strike_len) * np.exp(-t_strike / 0.002) * 0.25
bell[:strike_len] += hammer

# Taper smoothly to 0 at the end to guarantee zero click
fade_len = int(0.1 * sr)
bell[-fade_len:] *= np.linspace(1, 0, fade_len)

# Stereo spread: slightly pan different partials for wide cinematic soundstage
bell_l = bell.copy()
bell_r = bell.copy()
for ratio, amp, tau in partials:
    freq = f0 * ratio
    decay = np.exp(-t / tau)
    # Slight micro-delay between L and R for stereo depth
    pan = 0.5 + 0.25 * np.sin(ratio * 3.5)
    bell_l += np.sin(2 * np.pi * freq * t) * decay * amp * (1 - pan) * 0.3
    bell_r += np.sin(2 * np.pi * freq * (t + 0.001)) * decay * amp * pan * 0.3

# Normalize
stereo_bell = np.column_stack([bell_l, bell_r])
stereo_bell = stereo_bell / (np.max(np.abs(stereo_bell)) + 1e-6) * 0.75

sf.write('out/test_bell_chime.wav', stereo_bell, sr)
print("Bell synthesized successfully! Peak:", np.max(np.abs(stereo_bell)))
