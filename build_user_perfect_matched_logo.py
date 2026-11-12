import cv2
import numpy as np
import xml.etree.ElementTree as ET
import re
import subprocess

# 1. Colors from verified palette
DARK_SLATE = '#0B493A'        # Background Canvas
KHAKI_ORANGE = '#F3B659'      # Tree Canopy, Digits, Coder
ACCENT_ORANGE = '#E65A28'     # Center Accent Orange (Strictly center only!)

# 2. Load user's isolated components from user_individual.svg
user_tree = ET.parse('out/broadcast/user_individual.svg')
paths = user_tree.getroot().findall('.//{http://www.w3.org/2000/svg}path')

proto_1_d = paths[0].attrib.get('d', '')
p1_d = paths[1].attrib.get('d', '')
proto_0_d = paths[2].attrib.get('d', '')
orange_d = paths[3].attrib.get('d', '')

subpaths = [s for s in re.split(r'(?=M)', p1_d) if s.strip()]
tree_trunk_d = subpaths[0]
coder_d = subpaths[1] if len(subpaths) > 1 else ''
laptop_d = subpaths[2] if len(subpaths) > 2 else ''

def get_bbox(d):
    coords = [float(n) for n in re.findall(r'[-+]?\d*\.?\d+', d)]
    xs, ys = coords[0::2], coords[1::2]
    return min(xs), max(xs), min(ys), max(ys)

p1_minx, p1_maxx, p1_miny, p1_maxy = get_bbox(proto_1_d)
p0_minx, p0_maxx, p0_miny, p0_maxy = get_bbox(proto_0_d)
tree_minx, tree_maxx, tree_miny, tree_maxy = get_bbox(tree_trunk_d)
orange_minx, orange_maxx, orange_miny, orange_maxy = get_bbox(orange_d)

proto_1_cx = (p1_minx + p1_maxx) / 2.0
proto_1_cy = (p1_miny + p1_maxy) / 2.0
proto_1_w = p1_maxx - p1_minx
proto_1_h = p1_maxy - p1_miny

proto_0_cx = (p0_minx + p0_maxx) / 2.0
proto_0_cy = (p0_miny + p0_maxy) / 2.0
proto_0_w = p0_maxx - p0_minx
proto_0_h = p0_maxy - p0_miny

print(f"Prototype 1: W={proto_1_w:.1f}, H={proto_1_h:.1f}")
print(f"Prototype 0: W={proto_0_w:.1f}, H={proto_0_h:.1f}")

# 3. Detect all binary digits from original high-res emblem image
bot = cv2.imread('out/broadcast/var_bottom.png')
emblem_img = bot[40:495, 328:753] # shape (455, 425, 3)
eh, ew, _ = emblem_img.shape

bg = emblem_img[5, 5]
diff = np.linalg.norm(emblem_img.astype(float) - bg, axis=2)
gold_mask = (diff > 40) & (emblem_img[:, :, 2] > 100) & (emblem_img[:, :, 1] > 100)

num_labels, labels, stats, centroids = cv2.connectedComponentsWithStats(gold_mask.astype(np.uint8))

detected_digits = []
for i in range(1, num_labels):
    area = stats[i, cv2.CC_STAT_AREA]
    x = stats[i, cv2.CC_STAT_LEFT]
    y = stats[i, cv2.CC_STAT_TOP]
    w = stats[i, cv2.CC_STAT_WIDTH]
    h = stats[i, cv2.CC_STAT_HEIGHT]
    cx, cy = centroids[i]
    
    if 7 <= w <= 45 and 12 <= h <= 55 and 40 <= area <= 1200 and cy < 360:
        aspect = h / w
        is_one = aspect > 1.55
        detected_digits.append({
            'type': '1' if is_one else '0',
            'w': w, 'h': h,
            'cx': cx, 'cy': cy
        })

print(f"Mapped {len(detected_digits)} binary digits from original canopy!")

# 4. Compute target canvas placement (1000x1000 artboard, centered at X=500, Y=480)
# Original emblem box in emblem_img coordinates: [0, ew] x [7, eh-10]
orig_cx = ew / 2.0
orig_cy = eh / 2.0
target_cx = 500.0
target_cy = 480.0
target_h = 720.0
scale = target_h / eh

print(f"Global Placement: Center=({target_cx}, {target_cy}), Scale={scale:.3f}")

def transform_path_data(d, src_cx, src_cy, src_w, src_h, dest_cx, dest_cy, dest_w, dest_h):
    sx = dest_w / src_w if src_w > 0 else 1.0
    sy = dest_h / src_h if src_h > 0 else 1.0
    tokens = re.split(r'([MLCQZmlcqz])', d.strip())
    new_parts = []
    cur_cmd = None
    for tok in tokens:
        tok = tok.strip()
        if not tok: continue
        if tok in ['M', 'L', 'C', 'Q', 'Z', 'm', 'l', 'c', 'q', 'z']:
            cur_cmd = tok
            if cur_cmd in ['Z', 'z']:
                new_parts.append('Z')
        else:
            nums = [float(n) for n in re.findall(r'[-+]?\d*\.?\d+', tok)]
            res = []
            for i in range(0, len(nums)-1, 2):
                x = (nums[i] - src_cx) * sx + dest_cx
                y = (nums[i+1] - src_cy) * sy + dest_cy
                res.append(f"{x:.2f} {y:.2f}")
            new_parts.append(f"{cur_cmd} {' '.join(res)}")
    return " ".join(new_parts)

# Transform Tree Trunk, Coder, and Laptop
user_tree_cx = (tree_minx + tree_maxx) / 2.0
user_tree_cy = (tree_miny + tree_maxy) / 2.0
user_tree_w = tree_maxx - tree_minx
user_tree_h = tree_maxy - tree_miny

dest_tree_w = user_tree_w * scale
dest_tree_h = user_tree_h * scale

final_tree_d = transform_path_data(tree_trunk_d, user_tree_cx, user_tree_cy, user_tree_w, user_tree_h, target_cx, target_cy, dest_tree_w, dest_tree_h)
final_coder_d = transform_path_data(coder_d, user_tree_cx, user_tree_cy, user_tree_w, user_tree_h, target_cx, target_cy, dest_tree_w, dest_tree_h)
final_laptop_d = transform_path_data(laptop_d, user_tree_cx, user_tree_cy, user_tree_w, user_tree_h, target_cx, target_cy, dest_tree_w, dest_tree_h)

# Align Orange Swoop:
# In the original emblem, Orange Swoop box is [114, 194] x [224, 434]
# In target canvas coordinates:
orig_orange_cx = (114 + 194) / 2.0
orig_orange_cy = (224 + 434) / 2.0
orig_orange_w = 194 - 114
orig_orange_h = 434 - 224

dest_orange_cx = (orig_orange_cx - orig_cx) * scale + target_cx
dest_orange_cy = (orig_orange_cy - orig_cy) * scale + target_cy
dest_orange_w = orig_orange_w * scale
dest_orange_h = orig_orange_h * scale

user_orange_cx = (orange_minx + orange_maxx) / 2.0
user_orange_cy = (orange_miny + orange_maxy) / 2.0
user_orange_w = orange_maxx - orange_minx
user_orange_h = orange_maxy - orange_miny

final_orange_d = transform_path_data(orange_d, user_orange_cx, user_orange_cy, user_orange_w, user_orange_h, dest_orange_cx, dest_orange_cy, dest_orange_w, dest_orange_h)

# Stamp all 41 binary digits
stamped_digits_svg = []
for d in detected_digits:
    dcx = (d['cx'] - orig_cx) * scale + target_cx
    dcy = (d['cy'] - orig_cy) * scale + target_cy
    dw = d['w'] * scale
    dh = d['h'] * scale
    
    if d['type'] == '1':
        stamped_d = transform_path_data(proto_1_d, proto_1_cx, proto_1_cy, proto_1_w, proto_1_h, dcx, dcy, dw, dh)
    else:
        stamped_d = transform_path_data(proto_0_d, proto_0_cx, proto_0_cy, proto_0_w, proto_0_h, dcx, dcy, dw, dh)
    
    stamped_digits_svg.append(f'      <path d="{stamped_d}" />')

# 5. Build clean, organized SVG with separate layers
master_svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000">
  <defs>
    <style>
      .bg {{ fill: {DARK_SLATE}; }}
      .tree {{ fill: {KHAKI_ORANGE}; }}
      .digits {{ fill: {KHAKI_ORANGE}; }}
      .coder {{ fill: {KHAKI_ORANGE}; }}
      .center-orange {{ fill: {ACCENT_ORANGE}; }}
    </style>
  </defs>

  <!-- LAYER 1: CANVAS BACKGROUND -->
  <g id="01_Background" class="bg">
    <rect width="1000" height="1000" fill="{DARK_SLATE}" />
  </g>

  <!-- LAYER 2: TREE CANOPY & TRUNK -->
  <g id="02_Tree_Canopy_and_Trunk" class="tree" fill="{KHAKI_ORANGE}">
    <path d="{final_tree_d}" />
  </g>

  <!-- LAYER 3: UNIFORM BINARY CANOPY (USER PROTOTYPE 1s & 0s) -->
  <g id="03_Binary_Canopy_Digits" class="digits" fill="{KHAKI_ORANGE}">
''' + "\n".join(stamped_digits_svg) + f'''
  </g>

  <!-- LAYER 4: CODER & LAPTOP IN TRUNK HOLLOW -->
  <g id="04_Coder_and_Laptop" class="coder" fill="{KHAKI_ORANGE}">
    <path d="{final_coder_d}" />
    <path d="{final_laptop_d}" />
  </g>

  <!-- LAYER 5: CENTER ACCENT ORANGE SWOOP (STRICTLY IN THE CENTER CONTOUR!) -->
  <g id="05_Center_Accent_Orange" class="center-orange" fill="{ACCENT_ORANGE}">
    <path d="{final_orange_d}" />
  </g>
</svg>
'''

out_svg = 'out/broadcast/Tetradic_Master_Logo_Final.svg'
out_vc = 'out/broadcast/Tetradic_Master_Logo_Final.vectorcraft'
out_png = 'out/broadcast/Tetradic_Master_Logo_Final.png'

with open(out_svg, 'w') as f:
    f.write(master_svg)

print("Saved final master SVG to", out_svg)

# Convert to native VectorCraft file
cmd = ['flatpak', 'run', '--command=vectorcraft-cli', 'ai.storyteller.vectorcraft', 'convert', out_svg, out_vc]
res = subprocess.run(cmd, capture_output=True, text=True)
print("VectorCraft CLI convert to .vectorcraft:", res.stdout, res.stderr)

# Convert to PNG preview
cmd_png = ['flatpak', 'run', '--command=vectorcraft-cli', 'ai.storyteller.vectorcraft', 'convert', out_vc, out_png]
res_png = subprocess.run(cmd_png, capture_output=True, text=True)
print("VectorCraft CLI convert to .png:", res_png.stdout, res_png.stderr)
