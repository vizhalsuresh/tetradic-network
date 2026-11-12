#!/usr/bin/env python3
"""
ORBIT Broadcast Network - Procedural Logo Animation Asset Generator
Generates high-fidelity 1920x1080 broadcast video passes and 48kHz audio:
1. pass1_stroke_write_on.mp4 (Procedural laser write-on with spark tips)
2. pass2_wheel_mechanical_spin.mp4 (Astrolabe wheel rotating with ease-out expo)
3. pass3_eye_anamorphic_glint.mp4 (Bird eye ignite flare and pulsing rings)
4. pass4_space_dust_grid.mp4 (Deep obsidian coordinate grid with floating bokeh)
5. logo_audio_score.wav (48kHz stereo procedural sound design)
"""

import os
import cv2
import numpy as np
import scipy.io.wavfile as wavfile
import subprocess
import time

OUT_DIR = "/home/revenant/Projects/video/out/logo_animation/assets"
PREV_DIR = "/home/revenant/Projects/video/out/logo_animation/previews"
os.makedirs(OUT_DIR, exist_ok=True)
os.makedirs(PREV_DIR, exist_ok=True)

ORIG_PATH = "/home/revenant/.gemini/antigravity/brain/086147db-72ae-4e4c-b513-57996b9e21ae/.user_uploaded/media_1792939692423_a0edd59a.png"
orig = cv2.imread(ORIG_PATH, cv2.IMREAD_GRAYSCALE)
orig_h, orig_w = orig.shape

# Threshold black lines (foreground)
_, binary = cv2.threshold(orig, 140, 255, cv2.THRESH_BINARY_INV)

# Screen placement (1920x1080)
TARGET_H = 700
scale = TARGET_H / orig_h
TARGET_W = int(orig_w * scale)
logo_resized = cv2.resize(binary, (TARGET_W, TARGET_H), interpolation=cv2.INTER_AREA)

X_OFF = (1920 - TARGET_W) // 2  # 595
Y_OFF = (1080 - TARGET_H) // 2 - 20  # 170

# Screen feature coordinates
WHEEL_CX = X_OFF + int(485.5 * scale)  # 1058
WHEEL_CY = Y_OFF + int(259.5 * scale)  # 417
WHEEL_R = int(195.0 * scale)           # 186
EYE_X = X_OFF + int(202.5 * scale)     # 788
EYE_Y = Y_OFF + int(265.5 * scale)     # 423

TOTAL_SECONDS = 6.0
FPS = 30
TOTAL_FRAMES = int(TOTAL_SECONDS * FPS)  # 180 frames

print(f"=== Generating Procedural Logo Assets ===")
print(f"Target Canvas: 1920x1080 @ {FPS} FPS ({TOTAL_FRAMES} frames)")
print(f"Logo Offset: ({X_OFF}, {Y_OFF}), Wheel Center: ({WHEEL_CX}, {WHEEL_CY}), Eye: ({EYE_X}, {EYE_Y})")

# -------------------------------------------------------------
# 1. BUILD REVEAL TIMING MAP (T_map) FOR 1920x1080 SCREEN
# -------------------------------------------------------------
T_map = np.ones((1080, 1920), dtype=np.float32) * 999.0
logo_mask_screen = np.zeros((1080, 1920), dtype=bool)

# Place logo on screen
logo_mask_screen[Y_OFF:Y_OFF+TARGET_H, X_OFF:X_OFF+TARGET_W] = (logo_resized > 50)

# Coordinate grids for the logo region
Y_grid, X_grid = np.indices((1080, 1920))

# Distance from wheel center
dist_wheel = np.sqrt((X_grid - WHEEL_CX)**2 + (Y_grid - WHEEL_CY)**2)
in_wheel = (dist_wheel <= WHEEL_R) & logo_mask_screen

# Angle from top clockwise
angle_wheel = np.arctan2(Y_grid - WHEEL_CY, X_grid - WHEEL_CX) + np.pi / 2
angle_wheel = (angle_wheel + 2 * np.pi) % (2 * np.pi)

# 1A. Diagonal Divider Bar: (x + y) along 45 degrees
# In logo coordinates: points where (x_logo + y_logo) is in line with the divider
# Diagonal line passes through (x=240, y=190) to (x=600, y=550) in orig
diag_coord = (X_grid + Y_grid).astype(np.float32)
# Distance to diagonal line: x - y ≈ const
# The diagonal line has equation: Y - WHEEL_CY ≈ (X - WHEEL_CX) -> X - Y ≈ WHEEL_CX - WHEEL_CY ≈ 641
dist_to_diag_axis = np.abs((X_grid - Y_grid) - (WHEEL_CX - WHEEL_CY))
is_diagonal_bar = (dist_to_diag_axis < int(28 * scale)) & logo_mask_screen

# Set timing for Diagonal Bar: t = 0.15s to 0.70s
diag_min = (X_OFF + Y_OFF)
diag_max = (X_OFF + TARGET_W + Y_OFF + TARGET_H)
norm_diag = np.clip((diag_coord - (diag_min + 300)) / 600.0, 0.0, 1.0)
T_map[is_diagonal_bar] = 0.15 + norm_diag[is_diagonal_bar] * 0.55

# 1B. Celestial Wheel: t = 0.60s to 1.90s
# Concentric expansion + clockwise rotation
norm_wheel_dist = np.clip(dist_wheel / WHEEL_R, 0.0, 1.0)
norm_wheel_angle = angle_wheel / (2 * np.pi)
wheel_t = 0.60 + norm_wheel_dist * 0.40 + norm_wheel_angle * 0.90
T_map[in_wheel & ~is_diagonal_bar] = wheel_t[in_wheel & ~is_diagonal_bar]

# 1C. Bird Body, Beak & Head: x_screen < WHEEL_CX, y_screen in [300, 620]
is_bird_region = (X_grid < (WHEEL_CX + 20)) & (Y_grid > (Y_OFF + int(150 * scale))) & (Y_grid < (Y_OFF + int(480 * scale)))
is_bird = is_bird_region & logo_mask_screen & ~in_wheel & ~is_diagonal_bar
# Sweep from beak (leftmost: X ~ 730) to wing/tail (right: X ~ 1050)
bird_progress = np.clip((X_grid - (X_OFF + int(140 * scale))) / (300.0 * scale), 0.0, 1.0)
T_map[is_bird] = 1.30 + bird_progress[is_bird] * 0.90

# 1D. Surrounding Compartments & Border
remaining = logo_mask_screen & (T_map > 900.0)
# Top shields: y < 350 -> t = 1.8 to 2.5
is_top = remaining & (Y_grid < (Y_OFF + int(180 * scale)))
T_map[is_top] = 1.80 + ((X_grid[is_top] - X_OFF) / float(TARGET_W)) * 0.70

# Bottom diamond tiles & triangle: y > 580 -> t = 2.1 to 2.9
is_bottom = remaining & (Y_grid > (Y_OFF + int(480 * scale)))
T_map[is_bottom] = 2.10 + ((X_grid[is_bottom] - X_OFF) / float(TARGET_W)) * 0.80

# Remaining (left/right scales, stars, outer border): t = 2.4 to 3.2
still_remaining = logo_mask_screen & (T_map > 900.0)
norm_rem = np.clip((X_grid + Y_grid - (X_OFF + Y_OFF)) / float(TARGET_W + TARGET_H), 0.0, 1.0)
T_map[still_remaining] = 2.40 + norm_rem[still_remaining] * 0.80

# Clean up any missed logo pixels
missed = logo_mask_screen & (T_map > 900.0)
T_map[missed] = 3.0

print(f"Timing Map complete: active from t={T_map[logo_mask_screen].min():.2f}s to t={T_map[logo_mask_screen].max():.2f}s")

# -------------------------------------------------------------
# 2. GENERATE PASS 1: PROCEDURAL STROKE WRITE-ON VIDEO
# -------------------------------------------------------------
print("\n[1/5] Rendering Pass 1: Procedural Stroke Write-On (1920x1080 @ 30fps)...")
pass1_out = os.path.join(OUT_DIR, "pass1_stroke_write_on.mp4")

proc1 = subprocess.Popen([
    "ffmpeg", "-y", "-f", "rawvideo", "-vcodec", "rawvideo",
    "-s", "1920x1080", "-pix_fmt", "bgr24", "-r", str(FPS),
    "-i", "-", "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "16",
    "-preset", "fast", pass1_out
], stdin=subprocess.PIPE, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

for frame_idx in range(TOTAL_FRAMES):
    t = frame_idx / float(FPS)
    
    # Base frame (black background for screen/add blend mode)
    frame = np.zeros((1080, 1920, 3), dtype=np.uint8)
    
    if t >= 0.15:
        # Drawn mask: pixels where T_map <= t
        drawn = logo_mask_screen & (T_map <= t)
        
        # Base lines in surgical off-white / silver [230, 235, 240]
        frame[drawn] = [230, 235, 240]
        
        # Color accents:
        # Wheel lines in soft luminous gold: BGR [120, 200, 255]
        wheel_drawn = drawn & in_wheel
        frame[wheel_drawn] = [120, 200, 255]
        
        # Diagonal bar in technical cyan: BGR [255, 240, 50]
        diag_drawn = drawn & is_diagonal_bar
        frame[diag_drawn] = [255, 240, 50]
        
        # Active stroke sparks: pixels drawn in the last 0.08s
        # hot white core + blooming glow
        spark_mask = logo_mask_screen & (T_map <= t) & (T_map > (t - 0.08))
        if np.any(spark_mask):
            frame[spark_mask] = [255, 255, 255]
            # Soft spark aura via dilation on active tips
            spark_uint = (spark_mask.astype(np.uint8) * 255)
            dilated_spark = cv2.dilate(spark_uint, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (7, 7)))
            aura_mask = (dilated_spark > 0) & ~spark_mask & ~drawn
            frame[aura_mask] = [180, 140, 50] # golden aura
            
    proc1.stdin.write(frame.tobytes())

proc1.stdin.close()
proc1.wait()
print(f"Pass 1 rendered successfully: {pass1_out}")

# -------------------------------------------------------------
# 3. GENERATE PASS 2: ASTROLABE WHEEL MECHANICAL SPIN
# -------------------------------------------------------------
print("\n[2/5] Rendering Pass 2: Astrolabe Mechanical Spin (1920x1080 @ 30fps)...")
pass2_out = os.path.join(OUT_DIR, "pass2_wheel_spin.mp4")

# Extract the wheel patch alone
wheel_patch_mask = np.zeros((1080, 1920), dtype=np.uint8)
cv2.circle(wheel_patch_mask, (WHEEL_CX, WHEEL_CY), WHEEL_R, 255, -1)
wheel_isolated = np.zeros((1080, 1920, 3), dtype=np.uint8)
wheel_pixels = in_wheel & ~is_diagonal_bar
wheel_isolated[wheel_pixels] = [140, 215, 255] # Luminous warm gold

proc2 = subprocess.Popen([
    "ffmpeg", "-y", "-f", "rawvideo", "-vcodec", "rawvideo",
    "-s", "1920x1080", "-pix_fmt", "bgr24", "-r", str(FPS),
    "-i", "-", "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "16",
    "-preset", "fast", pass2_out
], stdin=subprocess.PIPE, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

for frame_idx in range(TOTAL_FRAMES):
    t = frame_idx / float(FPS)
    frame = np.zeros((1080, 1920, 3), dtype=np.uint8)
    
    # Active between t = 0.6s and t = 3.6s
    if 0.6 <= t <= 3.8:
        # Progress 0.0 to 1.0
        p = np.clip((t - 0.6) / 2.8, 0.0, 1.0)
        # Exponential ease-out: 1 - 2^(-10 * p)
        ease_p = 1.0 - np.power(2.0, -10.0 * p) if p < 1.0 else 1.0
        # Angle starts at -120 degrees and settles exactly at 0.0 degrees!
        rot_angle = -120.0 * (1.0 - ease_p)
        
        # Opacity fade in from 0.6 to 0.9s, hold, then fade into base
        alpha = np.clip((t - 0.6) / 0.3, 0.0, 1.0)
        if t > 3.2:
            alpha = np.clip(1.0 - (t - 3.2) / 0.6, 0.0, 1.0)
            
        if alpha > 0.01:
            M = cv2.getRotationMatrix2D((WHEEL_CX, WHEEL_CY), rot_angle, 1.0)
            rotated_wheel = cv2.warpAffine(wheel_isolated, M, (1920, 1080), flags=cv2.INTER_LINEAR)
            if alpha < 0.99:
                rotated_wheel = (rotated_wheel.astype(np.float32) * alpha).astype(np.uint8)
            frame = rotated_wheel
            
    proc2.stdin.write(frame.tobytes())

proc2.stdin.close()
proc2.wait()
print(f"Pass 2 rendered successfully: {pass2_out}")

# -------------------------------------------------------------
# 4. GENERATE PASS 3: BIRD EYE ANAMORPHIC IGNITE GLINT
# -------------------------------------------------------------
print("\n[3/5] Rendering Pass 3: Bird Eye Ignite Flare (1920x1080 @ 30fps)...")
pass3_out = os.path.join(OUT_DIR, "pass3_eye_ignite.mp4")

proc3 = subprocess.Popen([
    "ffmpeg", "-y", "-f", "rawvideo", "-vcodec", "rawvideo",
    "-s", "1920x1080", "-pix_fmt", "bgr24", "-r", str(FPS),
    "-i", "-", "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "16",
    "-preset", "fast", pass3_out
], stdin=subprocess.PIPE, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

for frame_idx in range(TOTAL_FRAMES):
    t = frame_idx / float(FPS)
    frame = np.zeros((1080, 1920, 3), dtype=np.uint8)
    
    # Eye ignites at t = 2.20s!
    if t >= 2.15:
        rel_t = t - 2.15
        
        # Initial flash pulse (t = 2.15 to 2.6)
        if rel_t < 0.8:
            flash_intensity = np.exp(-rel_t * 6.0)
            # 1. Anamorphic horizontal streak
            streak_len = int(80 * flash_intensity + 15)
            streak_thick = int(2 + 2 * flash_intensity)
            cv2.line(frame, (EYE_X - streak_len, EYE_Y), (EYE_X + streak_len, EYE_Y), (255, 240, 200), streak_thick)
            
            # 2. Vertical streak
            v_len = int(25 * flash_intensity + 4)
            cv2.line(frame, (EYE_X, EYE_Y - v_len), (EYE_X, EYE_Y + v_len), (255, 220, 160), 2)
            
            # 3. Expanding shockwave ring
            ring_r = int(rel_t * 90.0)
            if ring_r < 60:
                cv2.circle(frame, (EYE_X, EYE_Y), ring_r, (int(255 * flash_intensity), int(220 * flash_intensity), int(100 * flash_intensity)), 1)
                
        # Steady technical pupil glint (cyan-white core)
        cv2.circle(frame, (EYE_X, EYE_Y), 3, (255, 255, 255), -1)
        cv2.circle(frame, (EYE_X, EYE_Y), 6, (255, 240, 0), 1)
        
    proc3.stdin.write(frame.tobytes())

proc3.stdin.close()
proc3.wait()
print(f"Pass 3 rendered successfully: {pass3_out}")

# -------------------------------------------------------------
# 5. GENERATE PASS 4: AMBIENT SPACE DUST & SACRED GRID
# -------------------------------------------------------------
print("\n[4/5] Rendering Pass 4: Ambient Space Dust & Coordinate Grid (1920x1080 @ 30fps)...")
pass4_out = os.path.join(OUT_DIR, "pass4_space_dust.mp4")

proc4 = subprocess.Popen([
    "ffmpeg", "-y", "-f", "rawvideo", "-vcodec", "rawvideo",
    "-s", "1920x1080", "-pix_fmt", "bgr24", "-r", str(FPS),
    "-i", "-", "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "18",
    "-preset", "fast", pass4_out
], stdin=subprocess.PIPE, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

# Seeded deterministic floating dust particles
np.random.seed(42)
NUM_PARTICLES = 140
p_x = np.random.uniform(50, 1870, NUM_PARTICLES)
p_y = np.random.uniform(50, 1030, NUM_PARTICLES)
p_vx = np.random.uniform(-15.0, 15.0, NUM_PARTICLES)
p_vy = np.random.uniform(-10.0, -35.0, NUM_PARTICLES)
p_r = np.random.uniform(1.0, 3.5, NUM_PARTICLES)
p_alpha = np.random.uniform(0.3, 0.9, NUM_PARTICLES)
p_color = np.random.choice([0, 1], size=NUM_PARTICLES) # 0 = gold, 1 = cyan

for frame_idx in range(TOTAL_FRAMES):
    t = frame_idx / float(FPS)
    frame = np.zeros((1080, 1920, 3), dtype=np.uint8)
    
    # 1. Subtle radial vignette / deep blue gradient
    # Coordinate grid lines: concentric reticles around wheel center
    grid_alpha = np.clip(t / 1.5, 0.0, 1.0) * 0.18
    if grid_alpha > 0.01:
        # Concentric thin circles around wheel
        for r_grid in [WHEEL_R + 60, WHEEL_R + 140, WHEEL_R + 240]:
            cv2.circle(frame, (WHEEL_CX, WHEEL_CY), r_grid, (int(60 * grid_alpha), int(90 * grid_alpha), int(120 * grid_alpha)), 1)
        # Crosshair lines
        cv2.line(frame, (WHEEL_CX - 350, WHEEL_CY), (WHEEL_CX + 350, WHEEL_CY), (int(40*grid_alpha), int(70*grid_alpha), int(100*grid_alpha)), 1)
        cv2.line(frame, (WHEEL_CX, WHEEL_CY - 350), (WHEEL_CX, WHEEL_CY + 350), (int(40*grid_alpha), int(70*grid_alpha), int(100*grid_alpha)), 1)

    # 2. Render particles
    dt = 1.0 / FPS
    p_x = (p_x + p_vx * dt) % 1920
    p_y = (p_y + p_vy * dt) % 1080
    
    # Breathing opacity pulse
    pulse = 0.7 + 0.3 * np.sin(t * 2.0 + np.arange(NUM_PARTICLES))
    
    for i in range(NUM_PARTICLES):
        px, py = int(p_x[i]), int(p_y[i])
        pr = int(p_r[i])
        b_col = (40, 180, 255) if p_color[i] == 0 else (255, 230, 40)
        c_val = tuple(int(c * p_alpha[i] * pulse[i]) for c in b_col)
        cv2.circle(frame, (px, py), pr, c_val, -1)
        
    proc4.stdin.write(frame.tobytes())

proc4.stdin.close()
proc4.wait()
print(f"Pass 4 rendered successfully: {pass4_out}")

# -------------------------------------------------------------
# 6. GENERATE SOUND DESIGN TRACK (48kHz Stereo)
# -------------------------------------------------------------
print("\n[5/5] Synthesizing 48kHz Stereo Soundtrack Score...")
sr = 48000
total_samples = int(TOTAL_SECONDS * sr)
t_audio = np.linspace(0, TOTAL_SECONDS, total_samples, endpoint=False)

left = np.zeros(total_samples, dtype=np.float32)
right = np.zeros(total_samples, dtype=np.float32)

# A. Sub-bass cinematic boom at t = 0.15s (diagonal slash)
sub_t = t_audio - 0.15
sub_mask = (sub_t >= 0) & (sub_t <= 2.5)
sub_freq = 60.0 * np.exp(-sub_t[sub_mask] * 1.5) + 35.0
sub_env = np.exp(-sub_t[sub_mask] * 2.0)
sub_wave = np.sin(2 * np.pi * sub_freq * sub_t[sub_mask]) * sub_env * 0.45
left[sub_mask] += sub_wave
right[sub_mask] += sub_wave

# B. Searing laser write-on riser (t = 0.15 to 0.7s)
laser_mask = (t_audio >= 0.15) & (t_audio <= 0.75)
laser_t = t_audio[laser_mask] - 0.15
laser_freq = 200.0 + 1200.0 * (laser_t / 0.6)**2
laser_wave = np.sin(2 * np.pi * laser_freq * laser_t) * np.sin(np.pi * laser_t / 0.6) * 0.18
left[laser_mask] += laser_wave * (1.0 - laser_t / 0.6)  # pans L -> R
right[laser_mask] += laser_wave * (laser_t / 0.6)

# C. Rhythmic clockwork ratchet clicks for wheel spin (t = 0.7s to 2.2s)
for click_time in np.linspace(0.7, 2.1, 18):
    c_idx = int(click_time * sr)
    c_dur = int(0.02 * sr)
    if c_idx + c_dur < total_samples:
        t_click = np.linspace(0, 0.02, c_dur)
        click_sound = np.sin(2 * np.pi * 3200 * t_click) * np.exp(-t_click * 300) * 0.14
        left[c_idx:c_idx+c_dur] += click_sound * 0.8
        right[c_idx:c_idx+c_dur] += click_sound * 1.2

# D. Celestial Harmonic Bell Chime at t = 2.15s (Bird Eye Ignite!)
chime_t = t_audio - 2.15
chime_mask = (chime_t >= 0) & (chime_t <= 3.2)
ch_t = chime_t[chime_mask]
# E Major Pentatonic Harmonics (E6, G#6, B6, E7: 1318.5Hz, 1661.2Hz, 1975.5Hz, 2637.0Hz)
bell1 = np.sin(2 * np.pi * 1318.5 * ch_t) * np.exp(-ch_t * 1.8) * 0.22
bell2 = np.sin(2 * np.pi * 1661.2 * ch_t) * np.exp(-ch_t * 2.2) * 0.18
bell3 = np.sin(2 * np.pi * 1975.5 * ch_t) * np.exp(-ch_t * 2.6) * 0.14
bell4 = np.sin(2 * np.pi * 2637.0 * ch_t) * np.exp(-ch_t * 3.4) * 0.10
total_bell = bell1 + bell2 + bell3 + bell4
left[chime_mask] += total_bell * 0.95
right[chime_mask] += total_bell * 1.05

# E. Warm resonant brass/bass swell for the Light Sweep (t = 3.2s to 5.5s)
swell_t = t_audio - 3.2
swell_mask = (swell_t >= 0) & (swell_t <= 2.4)
sw_t = swell_t[swell_mask]
sw_env = np.sin(np.pi * sw_t / 2.4)**2
sw_wave = (
    np.sin(2 * np.pi * 110.0 * sw_t) * 0.25 + # A2 fundamental
    np.sin(2 * np.pi * 164.81 * sw_t) * 0.15 + # E3 fifth
    np.sin(2 * np.pi * 220.0 * sw_t) * 0.10   # A3 octave
) * sw_env
left[swell_mask] += sw_wave
right[swell_mask] += sw_wave

# Master limiter / normalize to -1.0 dB
max_val = max(np.max(np.abs(left)), np.max(np.abs(right)), 1e-6)
norm_factor = 0.88 / max_val
left = np.clip(left * norm_factor, -0.98, 0.98)
right = np.clip(right * norm_factor, -0.98, 0.98)

# Convert to 16-bit PCM
left_i16 = (left * 32767).astype(np.int16)
right_i16 = (right * 32767).astype(np.int16)
stereo_audio = np.column_stack([left_i16, right_i16])

audio_out = os.path.join(OUT_DIR, "logo_audio_score.wav")
wavfile.write(audio_out, sr, stereo_audio)
print(f"Soundtrack synthesized successfully: {audio_out}")

print("\n=== ALL 5 PROCEDURAL ASSETS READY FOR EFFECTCRAFT! ===")
