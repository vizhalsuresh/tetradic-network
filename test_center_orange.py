import xml.etree.ElementTree as ET
import re
import subprocess

# Let's see what happens if the trunk swoop is gold like the tree,
# and the coder & laptop in the center hollow is the accent orange!

DARK_SLATE = "#0B493A"
KHAKI_GOLD = "#F3B659"
ACCENT_ORANGE = "#E65A28"

tree_g = ET.parse('out/broadcast/trace_gold_smooth.svg')
paths_g = [p.attrib.get('d') for p in tree_g.getroot().findall('.//{http://www.w3.org/2000/svg}path')]

tree_o = ET.parse('out/broadcast/trace_orange_smooth.svg')
paths_o = [p.attrib.get('d') for p in tree_o.getroot().findall('.//{http://www.w3.org/2000/svg}path')]

# Separate G0 into trunk vs coder
# In paths_g, find the biggest path (the main tree)
main_tree_d = max(paths_g, key=len)
digits_d = [p for p in paths_g if p != main_tree_d]

# Split main_tree_d into subpaths: Subpath 0 is tree trunk. Subpath 1 & 2 are coder & laptop.
subpaths = [p for p in re.split(r'(?=M)', main_tree_d) if p.strip()]
tree_trunk_d = subpaths[0] if len(subpaths) > 0 else ""
coder_laptop_d = " ".join(subpaths[1:]) if len(subpaths) > 1 else ""

# Transform to center on 1000x1000 artboard
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

scale = 750.0 / emb_h
target_cx = 500.0   # Center of 1000x1000
target_cy = 480.0

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

tr_trunk = transform_d(tree_trunk_d, scale, emb_cx, emb_cy, target_cx, target_cy)
tr_swoop = [transform_d(d, scale, emb_cx, emb_cy, target_cx, target_cy) for d in paths_o]
tr_digits = [transform_d(d, scale, emb_cx, emb_cy, target_cx, target_cy) for d in digits_d]
tr_coder = transform_d(coder_laptop_d, scale, emb_cx, emb_cy, target_cx, target_cy)

# Build SVG: Tree + Swoop + Digits in Khaki Gold, Coder in Accent Orange!
svg_content = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000">
  <!-- BACKGROUND -->
  <rect width="1000" height="1000" fill="{DARK_SLATE}" />

  <!-- TREE TRUNK & CANOPY (KHAKI GOLD) -->
  <g id="Tree_Trunk_and_Branches" fill="{KHAKI_GOLD}">
    <path d="{tr_trunk}" />
'''
for d in tr_swoop:
    svg_content += f'    <path d="{d}" />\n'
for d in tr_digits:
    svg_content += f'    <path d="{d}" />\n'

svg_content += f'''  </g>

  <!-- CENTER FOCAL ACCENT: CODER & LAPTOP IN HOLLOW (ACCENT ORANGE) -->
  <g id="Center_Coder_Accent" fill="{ACCENT_ORANGE}">
    <path d="{tr_coder}" />
  </g>
</svg>
'''

with open('out/broadcast/test_center_orange.svg', 'w') as f:
    f.write(svg_content)

# Convert to PNG preview
cmd_png = ['flatpak', 'run', '--command=vectorcraft-cli', 'ai.storyteller.vectorcraft', 'convert', 'out/broadcast/test_center_orange.svg', 'out/broadcast/test_center_orange.png']
res_png = subprocess.run(cmd_png, capture_output=True, text=True)
print("Preview rendered:", res_png.stdout)

