import re
import xml.etree.ElementTree as ET
import subprocess

DARK_SLATE = "#0B493A"       # Background
KHAKI_ORANGE = "#F3B659"     # Eyedropper sampled Khaki Orange from card
ACCENT_ORANGE = "#E65A28"    # Accent Orange in the center trunk

# Read smoothed paths
tree_g = ET.parse('out/broadcast/trace_gold_smooth.svg')
paths_g = [p.attrib.get('d') for p in tree_g.getroot().findall('.//{http://www.w3.org/2000/svg}path')]

tree_o = ET.parse('out/broadcast/trace_orange_smooth.svg')
paths_o = [p.attrib.get('d') for p in tree_o.getroot().findall('.//{http://www.w3.org/2000/svg}path')]

# Calculate bounding box of all paths to center perfectly at X=500, Y=500 on 1000x1000 canvas
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

# Target: 750px height, centered at (500, 500)
scale = 720.0 / emb_h
target_cx = 500.0
target_cy = 500.0

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

# Clean standalone 1000x1000 master SVG (NO side card, NO clutter, pure centered logo)
clean_master_svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000">
  <defs>
    <style>
      .bg {{ fill: {DARK_SLATE}; }}
      .tree-khaki {{ fill: {KHAKI_ORANGE}; }}
      .center-accent-orange {{ fill: {ACCENT_ORANGE}; }}
    </style>
  </defs>

  <!-- LAYER 1: 1000x1000 BACKGROUND -->
  <g id="01_Background">
    <rect width="1000" height="1000" class="bg" />
  </g>

  <!-- LAYER 2: TREE CANOPY & BINARY DIGITS (SAMPLED KHAKI ORANGE) -->
  <g id="02_Tree_Canopy_and_Digits" class="tree-khaki">
'''

for d in tr_gold_paths:
    clean_master_svg += f'    <path d="{d}" />\n'

clean_master_svg += f'''  </g>

  <!-- LAYER 3: CENTER ACCENT SWOOP (VIBRANT ACCENT ORANGE IN THE CENTER) -->
  <g id="03_Center_Trunk_Accent_Orange" class="center-accent-orange">
'''

for d in tr_orange_paths:
    clean_master_svg += f'    <path d="{d}" />\n'

clean_master_svg += '''  </g>
</svg>
'''

out_svg = 'out/broadcast/tetradic_logo_centered.svg'
out_vc = 'out/broadcast/tetradic_trace_template.vectorcraft'
out_png = 'out/broadcast/tetradic_logo_centered.png'

with open(out_svg, 'w') as f:
    f.write(clean_master_svg)

# Convert to VectorCraft file
cmd = ['flatpak', 'run', '--command=vectorcraft-cli', 'ai.storyteller.vectorcraft', 'convert', out_svg, out_vc]
res = subprocess.run(cmd, capture_output=True, text=True)
print("VectorCraft CLI output:", res.stdout)

# Convert to high-res PNG preview
cmd_png = ['flatpak', 'run', '--command=vectorcraft-cli', 'ai.storyteller.vectorcraft', 'convert', out_vc, out_png]
res_png = subprocess.run(cmd_png, capture_output=True, text=True)
print("PNG preview output:", res_png.stdout)
