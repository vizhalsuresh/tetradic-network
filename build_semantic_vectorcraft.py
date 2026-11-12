import xml.etree.ElementTree as ET
import re
import subprocess

tree = ET.parse('out/broadcast/live_inspected.svg')
root = tree.getroot()

ref_g = root.find('.//{http://www.w3.org/2000/svg}g[@id="Reference_Template_Locked"]')
item1 = ref_g[1]

# Palette specifications from user
DARK_SLATE = "#0B493A"       # Background
KHAKI_ORANGE = "#EAF06A"     # User requested exact hex #EAF06A for tree & digits
ACCENT_ORANGE = "#E65A28"    # Vibrant accent orange for trunk swoop

# Separate elements from item1
# 1. Orange Swoop
orange_d = ""
for elem in item1.iter():
    if elem.attrib.get('fill') == '#f26201':
        orange_d = elem.attrib.get('d', '')
        break

# 2. Gold Elements
g0_d = ""
binary_digits = []

for elem in item1.iter():
    if elem.attrib.get('fill') == '#fabe52':
        d = elem.attrib.get('d', '')
        if len(d) > 3000:
            g0_d = d
        else:
            binary_digits.append(d)

# Subpaths of G0: Subpath 0 is Tree Trunk. Subpath 1 & 2 are Coder & Laptop.
subpaths = [p for p in re.split(r'(?=M)', g0_d) if p.strip()]
tree_trunk_d = subpaths[0] if len(subpaths) > 0 else ""
coder_laptop_d = " ".join(subpaths[1:]) if len(subpaths) > 1 else ""

# Center offset: current center of emblem
# Bounding box of all elements:
all_nums = [float(n) for n in re.findall(r'[-+]?\d*\.?\d+', tree_trunk_d + " " + orange_d)]
xs = all_nums[0::2]
ys = all_nums[1::2]
min_x, max_x = min(xs), max(xs)
min_y, max_y = min(ys), max(ys)
cur_cx = (min_x + max_x) / 2.0
cur_cy = (min_y + max_y) / 2.0

# Target center: X=500, Y=340 (leaving room for typography below at 650-750)
dx = 500.0 - cur_cx
dy = 340.0 - cur_cy

print(f"Current Center: ({cur_cx:.1f}, {cur_cy:.1f}), Offset: dx={dx:.1f}, dy={dy:.1f}")

def translate_d(d, offset_x, offset_y):
    # Regex replace numbers in d
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
                x = nums[i] + offset_x
                y = nums[i+1] + offset_y
                res.append(f"{x:.2f} {y:.2f}")
            new_parts.append(f"{cur_cmd} {' '.join(res)}")
    return " ".join(new_parts)

tr_tree = translate_d(tree_trunk_d, dx, dy)
tr_coder = translate_d(coder_laptop_d, dx, dy)
tr_orange = translate_d(orange_d, dx, dy)
tr_digits = [translate_d(d, dx, dy) for d in binary_digits]

# Build clean semantic SVG with VectorCraft layers
clean_svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000">
  <defs>
    <style>
      .bg {{ fill: {DARK_SLATE}; }}
      .tree {{ fill: {KHAKI_ORANGE}; }}
      .coder {{ fill: {KHAKI_ORANGE}; }}
      .digits {{ fill: {KHAKI_ORANGE}; }}
      .orange-swoop {{ fill: {ACCENT_ORANGE}; }}
    </style>
  </defs>

  <!-- LAYER 1: CANVAS BACKGROUND -->
  <g id="01_Background" class="bg">
    <rect width="1000" height="1000" fill="{DARK_SLATE}" />
  </g>

  <!-- LAYER 2: TREE TRUNK & BRANCHES -->
  <g id="02_Tree_Trunk_Branches" class="tree">
    <path d="{tr_tree}" fill="{KHAKI_ORANGE}" />
  </g>

  <!-- LAYER 3: BINARY DIGITS CANOPY (0s and 1s) -->
  <g id="03_Binary_Canopy_0s_and_1s" class="digits">
'''

for d in tr_digits:
    clean_svg += f'    <path d="{d}" fill="{KHAKI_ORANGE}" />\n'

clean_svg += f'''  </g>

  <!-- LAYER 4: CODER & LAPTOP IN TRUNK HOLLOW -->
  <g id="04_Coder_and_Laptop" class="coder">
    <path d="{tr_coder}" fill="{KHAKI_ORANGE}" />
  </g>

  <!-- LAYER 5: DYNAMIC ORANGE TRUNK ACCENT -->
  <g id="05_Orange_Trunk_Swoop" class="orange-swoop">
    <path d="{tr_orange}" fill="{ACCENT_ORANGE}" />
  </g>
</svg>
'''

out_svg_path = 'out/broadcast/tetradic_trace_template.svg'
with open(out_svg_path, 'w') as f:
    f.write(clean_svg)

print("Saved clean semantic SVG to", out_svg_path)

# Convert to native .vectorcraft file
out_vc_path = 'out/broadcast/tetradic_trace_template.vectorcraft'
cmd = [
    'flatpak', 'run', '--command=vectorcraft-cli',
    'ai.storyteller.vectorcraft', 'convert',
    out_svg_path, out_vc_path
]
res = subprocess.run(cmd, capture_output=True, text=True)
print("VectorCraft CLI result:", res.stdout, res.stderr)

# Also generate a PNG preview
out_png_path = 'out/broadcast/tetradic_separated_preview.png'
cmd_png = [
    'flatpak', 'run', '--command=vectorcraft-cli',
    'ai.storyteller.vectorcraft', 'convert',
    out_vc_path, out_png_path
]
res_png = subprocess.run(cmd_png, capture_output=True, text=True)
print("PNG preview result:", res_png.stdout)
