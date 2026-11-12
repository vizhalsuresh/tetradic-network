import re
import xml.etree.ElementTree as ET
import subprocess

DARK_SLATE = "#0B493A"       # Swatch card Dark Slate Gray background
KHAKI_ORANGE = "#F3B659"     # Swatch card lower block Khaki Orange (Tree & Digits)
ACCENT_ORANGE = "#E65A28"    # Accent Orange (ONLY in the center!)

# Load proper paths
tree_g = ET.parse('out/broadcast/gold_tree_only.svg')
paths_g = tree_g.getroot().findall('{http://www.w3.org/2000/svg}path')

tree_o = ET.parse('out/broadcast/orange_accent_only.svg')
paths_o = tree_o.getroot().findall('{http://www.w3.org/2000/svg}path')

# Compute bounding box
all_x, all_y = [], []
for p in paths_g + paths_o:
    d = p.attrib.get('d', '')
    tf = p.attrib.get('transform', '')
    dx, dy = 0.0, 0.0
    if 'translate' in tf:
        coords = tf.replace('translate(', '').replace(')', '').split(',')
        dx, dy = float(coords[0]), float(coords[1])
    nums = [float(n) for n in re.findall(r'[-+]?\d*\.?\d+', d)]
    for i in range(0, len(nums)-1, 2):
        all_x.append(nums[i] + dx)
        all_y.append(nums[i+1] + dy)

min_x, max_x = min(all_x), max(all_x)
min_y, max_y = min(all_y), max(all_y)
emb_w = max_x - min_x
emb_h = max_y - min_y
emb_cx = (min_x + max_x) / 2.0
emb_cy = (min_y + max_y) / 2.0

scale = 750.0 / emb_h
target_cx = 500.0
target_cy = 490.0

print(f"Emblem Box: W={emb_w:.1f}, H={emb_h:.1f}, Center=({emb_cx:.1f}, {emb_cy:.1f}), Scale={scale:.2f}")

def transform_path_data(d, tf, scale, cx, cy, tcx, tcy):
    dx, dy = 0.0, 0.0
    if 'translate' in tf:
        coords = tf.replace('translate(', '').replace(')', '').split(',')
        dx, dy = float(coords[0]), float(coords[1])
        
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
                x = (nums[i] + dx - cx) * scale + tcx
                y = (nums[i+1] + dy - cy) * scale + tcy
                res.append(f"{x:.2f} {y:.2f}")
            new_parts.append(f"{cur_cmd} {' '.join(res)}")
    return " ".join(new_parts)

tr_gold = [transform_path_data(p.attrib.get('d'), p.attrib.get('transform', ''), scale, emb_cx, emb_cy, target_cx, target_cy) for p in paths_g]
tr_orange = [transform_path_data(p.attrib.get('d'), p.attrib.get('transform', ''), scale, emb_cx, emb_cy, target_cx, target_cy) for p in paths_o]

# Build 1000x1000 clean SVG
clean_svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000">
  <defs>
    <style>
      .bg {{ fill: {DARK_SLATE}; }}
      .tree-gold {{ fill: {KHAKI_ORANGE}; }}
      .center-accent-orange {{ fill: {ACCENT_ORANGE}; }}
    </style>
  </defs>

  <!-- LAYER 1: BACKGROUND (DARK SLATE GRAY) -->
  <g id="01_Background">
    <rect width="1000" height="1000" class="bg" />
  </g>

  <!-- LAYER 2: TREE CANOPY, BRANCHES & BINARY DIGITS (KHAKI ORANGE / GOLD) -->
  <g id="02_Tree_Canopy_and_Digits" class="tree-gold">
'''

for d in tr_gold:
    clean_svg += f'    <path d="{d}" />\n'

clean_svg += f'''  </g>

  <!-- LAYER 3: CENTER ACCENT SWOOP (ACCENT ORANGE IN THE CENTER ONLY!) -->
  <g id="03_Center_Accent_Orange" class="center-accent-orange">
'''

for d in tr_orange:
    clean_svg += f'    <path d="{d}" />\n'

clean_svg += '''  </g>
</svg>
'''

out_svg = 'out/broadcast/tetradic_trace_template.svg'
out_vc = 'out/broadcast/tetradic_trace_template.vectorcraft'
out_png = 'out/broadcast/tetradic_correct_center_accent.png'

with open(out_svg, 'w') as f:
    f.write(clean_svg)

# Convert to VectorCraft native project
cmd = ['flatpak', 'run', '--command=vectorcraft-cli', 'ai.storyteller.vectorcraft', 'convert', out_svg, out_vc]
res = subprocess.run(cmd, capture_output=True, text=True)
print("VectorCraft CLI output:", res.stdout)

# Convert to PNG preview
cmd_png = ['flatpak', 'run', '--command=vectorcraft-cli', 'ai.storyteller.vectorcraft', 'convert', out_vc, out_png]
res_png = subprocess.run(cmd_png, capture_output=True, text=True)
print("PNG preview output:", res_png.stdout)

