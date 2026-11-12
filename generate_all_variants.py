import re
import os
import xml.etree.ElementTree as ET
import matplotlib.font_manager as fm
from matplotlib.textpath import TextPath
import numpy as np

DARK_SLATE = "#0B493A"       # Swatch card Dark Slate Gray
KHAKI_GOLD = "#F3B659"       # Swatch card rendered Khaki Gold tone
KHAKI_LIGHT = "#EAF06A"      # Swatch card #EAF06A hex specification
ORANGE_ACCENT = "#E65A28"    # Swatch card accent orange

# Load emblem paths
tree_g = ET.parse('out/broadcast/gold_tree_only.svg')
root_g = tree_g.getroot()
paths_g = root_g.findall('{http://www.w3.org/2000/svg}path')

tree_o = ET.parse('out/broadcast/orange_accent_only.svg')
root_o = tree_o.getroot()
paths_o = root_o.findall('{http://www.w3.org/2000/svg}path')

def text_to_svg_path(text, font_path, size, tracking=0.2):
    font_prop = fm.FontProperties(fname=font_path)
    full_d = []
    current_x = 0.0
    
    for char in text:
        tp = TextPath((0, 0), char, size=size, prop=font_prop)
        verts = tp.vertices
        codes = tp.codes
        
        if len(verts) > 0:
            char_min_x = np.min(verts[:, 0])
            char_max_x = np.max(verts[:, 0])
            char_width = char_max_x - char_min_x
        else:
            char_width = size * 0.4
        
        i = 0
        while i < len(verts):
            code = codes[i]
            x, y = verts[i]
            y = -y
            x += current_x
            
            if code == 1:
                full_d.append(f"M {x:.2f} {y:.2f}")
                i += 1
            elif code == 2:
                full_d.append(f"L {x:.2f} {y:.2f}")
                i += 1
            elif code == 3:
                x1, y1 = verts[i]; y1 = -y1; x1 += current_x
                x2, y2 = verts[i+1]; y2 = -y2; x2 += current_x
                full_d.append(f"Q {x1:.2f} {y1:.2f} {x2:.2f} {y2:.2f}")
                i += 2
            elif code == 4:
                x1, y1 = verts[i]; y1 = -y1; x1 += current_x
                x2, y2 = verts[i+1]; y2 = -y2; x2 += current_x
                x3, y3 = verts[i+2]; y3 = -y3; x3 += current_x
                full_d.append(f"C {x1:.2f} {y1:.2f} {x2:.2f} {y2:.2f} {x3:.2f} {y3:.2f}")
                i += 3
            elif code == 79:
                full_d.append("Z")
                i += 1
            else:
                i += 1
                
        advance = char_width + (size * tracking) if len(verts) > 0 else (size * 0.5)
        current_x += advance

    total_width = current_x - (size * tracking) if len(text) > 0 else 0
    return " ".join(full_d), total_width

# Transform emblem to fit 1000x1000 canvas centered at X=500, Y=330
# Original emblem box: X=[87.2, 514.9], Y=[16.0, 458.1] -> W=427.7, H=442.1, Center=(301.1, 237.1)
TARGET_SCALE = 1.12
EMBLEM_CX = 301.1
EMBLEM_CY = 237.1
TARGET_CX = 500.0
TARGET_CY = 325.0

# Pre-transform emblem paths to absolute coordinates on 1000x1000 canvas
def transform_path_data(d, tf, scale, cx, cy, tcx, tcy):
    # parse transform
    dx, dy = 0.0, 0.0
    if 'translate' in tf:
        coords = tf.replace('translate(', '').replace(')', '').split(',')
        dx, dy = float(coords[0]), float(coords[1])
    
    # We regex replace numbers in d
    def scale_point(match):
        cmd = match.group(1)
        coords_str = match.group(2).strip()
        nums = [float(n) for n in re.findall(r'[-+]?\d*\.?\d+', coords_str)]
        res_nums = []
        for i in range(0, len(nums)-1, 2):
            x = (nums[i] + dx - cx) * scale + tcx
            y = (nums[i+1] + dy - cy) * scale + tcy
            res_nums.append(f"{x:.2f} {y:.2f}")
        return cmd + " " + " ".join(res_nums)
    
    # tokenize commands: M, C, L, Z
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
            # coords
            nums = [float(n) for n in re.findall(r'[-+]?\d*\.?\d+', tok)]
            res_coords = []
            for i in range(0, len(nums)-1, 2):
                x = (nums[i] + dx - cx) * scale + tcx
                y = (nums[i+1] + dy - cy) * scale + tcy
                res_coords.append(f"{x:.2f} {y:.2f}")
            new_parts.append(f"{cur_cmd} {' '.join(res_coords)}")
    return " ".join(new_parts)

transformed_gold_paths = []
for p in paths_g:
    d = p.attrib.get('d', '')
    tf = p.attrib.get('transform', '')
    new_d = transform_path_data(d, tf, TARGET_SCALE, EMBLEM_CX, EMBLEM_CY, TARGET_CX, TARGET_CY)
    transformed_gold_paths.append(new_d)

transformed_orange_paths = []
for p in paths_o:
    d = p.attrib.get('d', '')
    tf = p.attrib.get('transform', '')
    new_d = transform_path_data(d, tf, TARGET_SCALE, EMBLEM_CX, EMBLEM_CY, TARGET_CX, TARGET_CY)
    transformed_orange_paths.append(new_d)

print(f"Transformed {len(transformed_gold_paths)} gold paths and {len(transformed_orange_paths)} orange paths.")

# Define typography styles
FONTS = {
    'montserrat': {
        'name': 'Montserrat (Geometric Modern)',
        'bold': 'assets/fonts/Montserrat-Bold.ttf',
        'sub': 'assets/fonts/Montserrat-Medium.ttf',
        'title_size': 58,
        'title_track': 0.28,
        'sub_size': 20,
        'sub_track': 0.55
    },
    'spacegrotesk': {
        'name': 'Space Grotesk (Tech Computational)',
        'bold': 'assets/fonts/SpaceGrotesk-Bold.ttf',
        'sub': 'assets/fonts/SpaceGrotesk-Medium.ttf',
        'title_size': 58,
        'title_track': 0.24,
        'sub_size': 20,
        'sub_track': 0.50
    },
    'cinzel': {
        'name': 'Cinzel (Classical Sacred Geometry)',
        'bold': 'assets/fonts/Cinzel-Bold.ttf',
        'sub': 'assets/fonts/Montserrat-Medium.ttf',
        'title_size': 58,
        'title_track': 0.32,
        'sub_size': 20,
        'sub_track': 0.55
    }
}

os.makedirs('out/broadcast/logos', exist_ok=True)

for key, cfg in FONTS.items():
    title_d, title_w = text_to_svg_path("TETRADIC", cfg['bold'], cfg['title_size'], cfg['title_track'])
    sub_d, sub_w = text_to_svg_path("NETWORK", cfg['sub'], cfg['sub_size'], cfg['sub_track'])
    
    title_x = TARGET_CX - (title_w / 2.0)
    title_y = 665.0
    
    sub_x = TARGET_CX - (sub_w / 2.0)
    sub_y = 730.0
    
    # Accent rule line coordinates flanking "NETWORK"
    line_y = 724.0
    rule_w = 40.0
    rule_left_x1 = sub_x - rule_w - 18.0
    rule_left_x2 = sub_x - 18.0
    rule_right_x1 = sub_x + sub_w + 18.0
    rule_right_x2 = sub_x + sub_w + 18.0 + rule_w
    
    # Build Dark Variant
    svg_dark = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000">
  <defs>
    <style>
      .bg {{ fill: {DARK_SLATE}; }}
      .tree-gold {{ fill: {KHAKI_GOLD}; }}
      .tree-orange {{ fill: {ORANGE_ACCENT}; }}
      .title {{ fill: {KHAKI_GOLD}; }}
      .sub {{ fill: {KHAKI_LIGHT}; }}
      .accent-line {{ stroke: {ORANGE_ACCENT}; stroke-width: 2.5; stroke-linecap: round; }}
    </style>
  </defs>
  <rect width="1000" height="1000" class="bg" />
  
  <!-- Tree Emblem: Canopy, Binary Digits & Coder Silhouette -->
  <g id="tree-canopy" class="tree-gold">
'''
    for d in transformed_gold_paths:
        svg_dark += f'    <path d="{d}" />\n'
    svg_dark += f'''  </g>
  <g id="tree-trunk-swoop" class="tree-orange">
'''
    for d in transformed_orange_paths:
        svg_dark += f'    <path d="{d}" />\n'
    svg_dark += f'''  </g>

  <!-- Broadcast Network Typography -->
  <g id="title-tetradic" class="title" transform="translate({title_x:.2f}, {title_y:.2f})">
    <path d="{title_d}" />
  </g>
  <g id="subtitle-network" class="sub" transform="translate({sub_x:.2f}, {sub_y:.2f})">
    <path d="{sub_d}" />
  </g>
  <line x1="{rule_left_x1:.2f}" y1="{line_y:.2f}" x2="{rule_left_x2:.2f}" y2="{line_y:.2f}" class="accent-line" />
  <line x1="{rule_right_x1:.2f}" y1="{line_y:.2f}" x2="{rule_right_x2:.2f}" y2="{line_y:.2f}" class="accent-line" />
</svg>
'''
    dark_svg_path = f"out/broadcast/logos/tetradic_logo_{key}_dark.svg"
    with open(dark_svg_path, 'w') as f:
        f.write(svg_dark)

    # Build Light Variant
    svg_light = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000">
  <defs>
    <style>
      .bg {{ fill: {KHAKI_GOLD}; }}
      .tree-slate {{ fill: {DARK_SLATE}; }}
      .tree-orange {{ fill: {ORANGE_ACCENT}; }}
      .title {{ fill: {DARK_SLATE}; }}
      .sub {{ fill: {DARK_SLATE}; opacity: 0.88; }}
      .accent-line {{ stroke: {ORANGE_ACCENT}; stroke-width: 2.5; stroke-linecap: round; }}
    </style>
  </defs>
  <rect width="1000" height="1000" class="bg" />
  
  <!-- Tree Emblem: Canopy, Binary Digits & Coder Silhouette -->
  <g id="tree-canopy" class="tree-slate">
'''
    for d in transformed_gold_paths:
        svg_light += f'    <path d="{d}" />\n'
    svg_light += f'''  </g>
  <g id="tree-trunk-swoop" class="tree-orange">
'''
    for d in transformed_orange_paths:
        svg_light += f'    <path d="{d}" />\n'
    svg_light += f'''  </g>

  <!-- Broadcast Network Typography -->
  <g id="title-tetradic" class="title" transform="translate({title_x:.2f}, {title_y:.2f})">
    <path d="{title_d}" />
  </g>
  <g id="subtitle-network" class="sub" transform="translate({sub_x:.2f}, {sub_y:.2f})">
    <path d="{sub_d}" />
  </g>
  <line x1="{rule_left_x1:.2f}" y1="{line_y:.2f}" x2="{rule_left_x2:.2f}" y2="{line_y:.2f}" class="accent-line" />
  <line x1="{rule_right_x1:.2f}" y1="{line_y:.2f}" x2="{rule_right_x2:.2f}" y2="{line_y:.2f}" class="accent-line" />
</svg>
'''
    light_svg_path = f"out/broadcast/logos/tetradic_logo_{key}_light.svg"
    with open(light_svg_path, 'w') as f:
        f.write(svg_light)

    # Build Transparent Variant (Dark Slate graphics for light overlay or Gold graphics for dark overlay)
    svg_trans = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000">
  <defs>
    <style>
      .tree-gold {{ fill: {KHAKI_GOLD}; }}
      .tree-orange {{ fill: {ORANGE_ACCENT}; }}
      .title {{ fill: {KHAKI_GOLD}; }}
      .sub {{ fill: {KHAKI_LIGHT}; }}
      .accent-line {{ stroke: {ORANGE_ACCENT}; stroke-width: 2.5; stroke-linecap: round; }}
    </style>
  </defs>
  <!-- Transparent Background -->
  
  <!-- Tree Emblem: Canopy, Binary Digits & Coder Silhouette -->
  <g id="tree-canopy" class="tree-gold">
'''
    for d in transformed_gold_paths:
        svg_trans += f'    <path d="{d}" />\n'
    svg_trans += f'''  </g>
  <g id="tree-trunk-swoop" class="tree-orange">
'''
    for d in transformed_orange_paths:
        svg_trans += f'    <path d="{d}" />\n'
    svg_trans += f'''  </g>

  <!-- Broadcast Network Typography -->
  <g id="title-tetradic" class="title" transform="translate({title_x:.2f}, {title_y:.2f})">
    <path d="{title_d}" />
  </g>
  <g id="subtitle-network" class="sub" transform="translate({sub_x:.2f}, {sub_y:.2f})">
    <path d="{sub_d}" />
  </g>
  <line x1="{rule_left_x1:.2f}" y1="{line_y:.2f}" x2="{rule_left_x2:.2f}" y2="{line_y:.2f}" class="accent-line" />
  <line x1="{rule_right_x1:.2f}" y1="{line_y:.2f}" x2="{rule_right_x2:.2f}" y2="{line_y:.2f}" class="accent-line" />
</svg>
'''
    trans_svg_path = f"out/broadcast/logos/tetradic_logo_{key}_transparent.svg"
    with open(trans_svg_path, 'w') as f:
        f.write(svg_trans)

print("Generated SVGs for all styles!")
