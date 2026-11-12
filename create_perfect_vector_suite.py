import cv2
import numpy as np
import base64
import os
import re
import vtracer
import xml.etree.ElementTree as ET
import subprocess

# 1. Load Swatch Image & sample exact eyedropper colors
swatch_path = '/home/revenant/.gemini/antigravity/brain/e7c9dc1f-6305-464e-8322-b0b88de2e48b/.user_uploaded/media_1794153938623_711dbe7c.jpg'
swatch = cv2.imread(swatch_path)
h_s, w_s, _ = swatch.shape

dark_sample = np.median(swatch[int(h_s*0.25):int(h_s*0.35), int(w_s*0.3):int(w_s*0.7)], axis=(0,1)).astype(int)
dark_hex = f"#{dark_sample[2]:02x}{dark_sample[1]:02x}{dark_sample[0]:02x}"

khaki_sample = np.median(swatch[int(h_s*0.65):int(h_s*0.75), int(w_s*0.3):int(w_s*0.7)], axis=(0,1)).astype(int)
khaki_hex = f"#{khaki_sample[2]:02x}{khaki_sample[1]:02x}{khaki_sample[0]:02x}"

accent_orange = "#E65A28"

print(f"Sampled Dark Slate: {dark_hex}")
print(f"Sampled Khaki Orange: {khaki_hex}")

# 2. Extract clean high-res emblem and separate into color channels
raw = cv2.imread('out/broadcast/source_emblem_tight.png')
h, w, _ = raw.shape

# Color segmentation in HSV for highest purity
hsv = cv2.cvtColor(raw, cv2.COLOR_BGR2HSV)

# Orange trunk swoop mask (Hue ~ 5 to 20, High Saturation)
orange_mask = cv2.inRange(hsv, np.array([5, 140, 160]), np.array([22, 255, 255]))
# Morphological cleanup
kernel = np.ones((2,2), np.uint8)
orange_mask = cv2.morphologyEx(orange_mask, cv2.MORPH_OPEN, kernel)
cv2.imwrite('out/broadcast/trace_orange_clean.png', 255 - orange_mask)

# Gold tree & digits mask (Hue ~ 22 to 38, or bright warm tones)
gold_mask = cv2.inRange(hsv, np.array([20, 80, 140]), np.array([45, 255, 255]))
# Remove any orange overlap
gold_mask = cv2.bitwise_and(gold_mask, cv2.bitwise_not(orange_mask))
# Morphological smoothing to avoid stairstep jagged edges
gold_mask = cv2.morphologyEx(gold_mask, cv2.MORPH_CLOSE, kernel)
cv2.imwrite('out/broadcast/trace_gold_clean.png', 255 - gold_mask)

print("Generated clean inverted channel masks.")

# 3. Spline trace both channels with vtracer mode='spline' and high smoothing (Simplify)
vtracer.convert_image_to_svg_py(
    'out/broadcast/trace_gold_clean.png',
    'out/broadcast/trace_gold_smooth.svg',
    colormode='binary',
    mode='spline',
    hierarchical='stacked',
    filter_speckle=6,
    color_precision=8,
    layer_difference=16,
    corner_threshold=45,       # Smooth curves
    length_threshold=4.5,      # Longer segments = fewer anchor points = smoother curves!
    splice_threshold=50,       # Merges collinear splines
    path_precision=2
)

vtracer.convert_image_to_svg_py(
    'out/broadcast/trace_orange_clean.png',
    'out/broadcast/trace_orange_smooth.svg',
    colormode='binary',
    mode='spline',
    hierarchical='stacked',
    filter_speckle=4,
    color_precision=8,
    layer_difference=16,
    corner_threshold=45,
    length_threshold=4.5,
    splice_threshold=50,
    path_precision=2
)

print("Spline trace with curve smoothing completed!")

# 4. Read back paths
tree_g = ET.parse('out/broadcast/trace_gold_smooth.svg')
paths_g = [p.attrib.get('d') for p in tree_g.getroot().findall('.//{http://www.w3.org/2000/svg}path')]

tree_o = ET.parse('out/broadcast/trace_orange_smooth.svg')
paths_o = [p.attrib.get('d') for p in tree_o.getroot().findall('.//{http://www.w3.org/2000/svg}path')]

# Encode Swatch Card Image to base64 so it can be dropped directly into the canvas
with open(swatch_path, 'rb') as f:
    swatch_b64 = base64.b64encode(f.read()).decode('utf-8')

# Calculate bounding box of emblem to center it at X=550, Y=500 on an expanded 1600x1000 artboard
all_nums = []
for d in paths_g + paths_o:
    all_nums.extend([float(n) for n in re.findall(r'[-+]?\d*\.?\d+', d)])

xs = all_nums[0::2]
ys = all_nums[1::2]
min_x, max_x = min(xs), max(xs)
min_y, max_y = min(ys), max(ys)
emb_w = max_x - min_x
emb_h = max_y - min_y
emb_cx = (min_x + max_x) / 2.0
emb_cy = (min_y + max_y) / 2.0

scale = 750.0 / emb_h   # Scale emblem to 750px height
target_cx = 580.0
target_cy = 500.0

print(f"Emblem original: {emb_w:.1f}x{emb_h:.1f}, Scale: {scale:.2f}")

def transform_d(d, scale, cx, cy, tcx, tcy):
    tokens = re.split(r'([MLCQZ])', d.strip())
    new_parts = []
    cur_cmd = None
    for tok in tokens:
        tok = tok.strip()
        if not tok: continue
        if tok in ['M', 'L', 'C', 'Q', 'Z']:
            cur_cmd = tok
            if cur_cmd == 'Z':
                new_parts.append('Z')
        else:
            nums = [float(n) for n in re.findall(r'[-+]?\d*\.?\d+', tok)]
            res = []
            for i in range(0, len(nums)-1, 2):
                x = (nums[i] - cx) * scale + tcx
                y = (nums[i+1] - cy) * scale + tcy
                res.append(f"{x:.2f} {y:.2f}")
            new_parts.append(f"{cur_cmd} {' '.join(res)}")
    return " ".join(new_parts)

tr_gold_paths = [transform_d(d, scale, emb_cx, emb_cy, target_cx, target_cy) for d in paths_g]
tr_orange_paths = [transform_d(d, scale, emb_cx, emb_cy, target_cx, target_cy) for d in paths_o]

# 5. Build Master VectorCraft Project with:
# - Left Panel (X=1150 to X=1550): Embedded Swatch Card Reference Image with eyedropper color callouts
# - Center Artboard (X=100 to X=1050): The Clean, Smoothed Vector Logo in exact eyedropper colors
master_svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" width="1600" height="1000">
  <defs>
    <style>
      .bg {{ fill: {dark_hex}; }}
      .gold-emblem {{ fill: {khaki_hex}; }}
      .orange-swoop {{ fill: {accent_orange}; }}
      .text-label {{ font-family: sans-serif; font-weight: bold; fill: #FFFFFF; font-size: 16px; letter-spacing: 0.15em; }}
      .hex-label {{ font-family: monospace; font-size: 14px; fill: {khaki_hex}; }}
    </style>
  </defs>

  <!-- LAYER 1: ARTBOARD BACKGROUND -->
  <g id="01_Background">
    <rect width="1600" height="1000" class="bg" />
    <!-- Center divider -->
    <line x1="1100" y1="50" x2="1100" y2="950" stroke="#1A5C4B" stroke-width="2" stroke-dasharray="6,6" />
  </g>

  <!-- LAYER 2: CLEAN SMOOTHED TREE CANOPY & DIGITS -->
  <g id="02_Tree_Canopy_and_Digits" class="gold-emblem">
'''

for d in tr_gold_paths:
    master_svg += f'    <path d="{d}" />\n'

master_svg += f'''  </g>

  <!-- LAYER 3: CLEAN SMOOTHED ORANGE TRUNK SWOOP -->
  <g id="03_Orange_Trunk_Swoop" class="orange-swoop">
'''

for d in tr_orange_paths:
    master_svg += f'    <path d="{d}" />\n'

master_svg += f'''  </g>

  <!-- LAYER 4: DROPPED SWATCH CARD & EYEDROPPER REFERENCE (RIGHT PANEL) -->
  <g id="04_Dropped_Swatch_Card_Reference">
    <!-- Embedded original swatch card image -->
    <image href="data:image/jpeg;base64,{swatch_b64}" x="1140" y="80" width="420" height="524" />
    
    <!-- Color Swatch Eyedropper Chips -->
    <!-- Chip 1: Dark Slate Gray -->
    <rect x="1140" y="640" width="48" height="48" rx="8" fill="{dark_hex}" stroke="#FFFFFF" stroke-width="1.5" />
    <text x="1205" y="662" class="text-label">DARK SLATE GRAY</text>
    <text x="1205" y="682" class="hex-label">{dark_hex.upper()} (EYEDROPPER SAMPLE)</text>

    <!-- Chip 2: Khaki Orange -->
    <rect x="1140" y="720" width="48" height="48" rx="8" fill="{khaki_hex}" stroke="#FFFFFF" stroke-width="1.5" />
    <text x="1205" y="742" class="text-label">KHAKI ORANGE</text>
    <text x="1205" y="762" class="hex-label">{khaki_hex.upper()} (EYEDROPPER SAMPLE)</text>

    <!-- Chip 3: Accent Orange -->
    <rect x="1140" y="800" width="48" height="48" rx="8" fill="{accent_orange}" stroke="#FFFFFF" stroke-width="1.5" />
    <text x="1205" y="822" class="text-label">ACCENT ORANGE</text>
    <text x="1205" y="842" class="hex-label">{accent_orange.upper()} (DYNAMIC TRUNK ACCENT)</text>
  </g>
</svg>
'''

out_svg = 'out/broadcast/tetradic_swatch_matched.svg'
out_vc = 'out/broadcast/tetradic_trace_template.vectorcraft'
out_png = 'out/broadcast/tetradic_swatch_matched.png'

with open(out_svg, 'w') as f:
    f.write(master_svg)

print("Saved master SVG with embedded swatch card.")

# Convert to VectorCraft native project
cmd = ['flatpak', 'run', '--command=vectorcraft-cli', 'ai.storyteller.vectorcraft', 'convert', out_svg, out_vc]
res = subprocess.run(cmd, capture_output=True, text=True)
print("VectorCraft CLI output:", res.stdout)

# Convert to PNG preview
cmd_png = ['flatpak', 'run', '--command=vectorcraft-cli', 'ai.storyteller.vectorcraft', 'convert', out_vc, out_png]
res_png = subprocess.run(cmd_png, capture_output=True, text=True)
print("PNG preview output:", res_png.stdout)
