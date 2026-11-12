import subprocess
import xml.etree.ElementTree as ET
import re
import os

# 1. Official Colors
DARK_SLATE = '#0B493A'        # Dark Slate Gray background
KHAKI_ORANGE = '#F3B659'      # Khaki Gold / Tree & Digits
ACCENT_ORANGE = '#E65A28'     # Accent Orange (Strictly center only!)
ACCENT_GOLD = '#DDBA6F'

# 2. Load the geometry from Tetradic_Master_Logo_Final.svg
final_svg_tree = ET.parse('out/broadcast/Tetradic_Master_Logo_Final.svg')
root = final_svg_tree.getroot()

# Extract paths by layer
tree_path = root.find('.//{http://www.w3.org/2000/svg}g[@id="02_Tree_Canopy_and_Trunk"]/{http://www.w3.org/2000/svg}path').attrib.get('d')
digit_paths = [p.attrib.get('d') for p in root.findall('.//{http://www.w3.org/2000/svg}g[@id="03_Binary_Canopy_Digits"]/{http://www.w3.org/2000/svg}path')]
coder_paths = [p.attrib.get('d') for p in root.findall('.//{http://www.w3.org/2000/svg}g[@id="04_Coder_and_Laptop"]/{http://www.w3.org/2000/svg}path')]
orange_path = root.find('.//{http://www.w3.org/2000/svg}g[@id="05_Center_Accent_Orange"]/{http://www.w3.org/2000/svg}path').attrib.get('d')

print(f"Loaded: Tree=1, Digits={len(digit_paths)}, Coder={len(coder_paths)}, Orange=1")

# Adjust vertical centering slightly to give room for typography below
# Original emblem center was at Y=480, height ~580 (Y range 190 to 770)
# Shift emblem up by 40px so Y is 150 to 730, leaving 740 to 950 for typography!
DY_OFFSET = -35.0

def shift_d(d, dy):
    tokens = re.split(r'([MLCQZmlcqz])', d.strip())
    new_parts = []
    cur_cmd = None
    for tok in tokens:
        tok = tok.strip()
        if not tok: continue
        if tok in ['M', 'L', 'C', 'Q', 'Z', 'm', 'l', 'c', 'q', 'z']:
            cur_cmd = tok
            if cur_cmd in ['Z', 'z']: new_parts.append('Z')
        else:
            nums = [float(n) for n in re.findall(r'[-+]?\d*\.?\d+', tok)]
            res = []
            for i in range(0, len(nums)-1, 2):
                x = nums[i]
                y = nums[i+1] + dy
                res.append(f"{x:.2f} {y:.2f}")
            new_parts.append(f"{cur_cmd} {' '.join(res)}")
    return " ".join(new_parts)

shifted_tree = shift_d(tree_path, DY_OFFSET)
shifted_digits = [shift_d(d, DY_OFFSET) for d in digit_paths]
shifted_coder = [shift_d(d, DY_OFFSET) for d in coder_paths]
shifted_orange = shift_d(orange_path, DY_OFFSET)

# Generate Dark Mode Master SVG (1000 x 1000)
def generate_master_svg(bg_color, fg_color, orange_color, mode_name):
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000">
  <defs>
    <style>
      .terminal-title {{
        font-family: 'JetBrains Mono', monospace;
        font-size: 52px;
        font-weight: 800;
        letter-spacing: 12px;
        fill: {fg_color};
        text-anchor: middle;
      }}
      .terminal-sub {{
        font-family: 'JetBrains Mono', monospace;
        font-size: 19px;
        font-weight: 700;
        letter-spacing: 9px;
        fill: {orange_color};
        text-anchor: middle;
      }}
    </style>
  </defs>

  <!-- LAYER 1: CANVAS BACKGROUND -->
  <g id="01_Background">
    <rect width="1000" height="1000" fill="{bg_color}" />
  </g>

  <!-- LAYER 2: TREE CANOPY & TRUNK -->
  <g id="02_Tree_Canopy_and_Trunk" fill="{fg_color}">
    <path d="{shifted_tree}" />
  </g>

  <!-- LAYER 3: BINARY CANOPY DIGITS (0s & 1s) -->
  <g id="03_Binary_Canopy_Digits" fill="{fg_color}">
'''
    for d in shifted_digits:
        svg += f'    <path d="{d}" />\n'

    svg += f'''  </g>

  <!-- LAYER 4: CODER & LAPTOP IN TRUNK HOLLOW -->
  <g id="04_Coder_and_Laptop" fill="{fg_color}">
'''
    for d in shifted_coder:
        svg += f'    <path d="{d}" />\n'

    svg += f'''  </g>

  <!-- LAYER 5: CENTER ACCENT ORANGE SWOOP (INVARIANT: ALWAYS ACCENT ORANGE!) -->
  <g id="05_Center_Accent_Orange" fill="{orange_color}">
    <path d="{shifted_orange}" />
  </g>

  <!-- LAYER 6: TERMINAL BRAND TYPOGRAPHY (JETBRAINS MONO) -->
  <g id="06_Brand_Typography">
    <text x="506" y="805" class="terminal-title">TETRADIC</text>
    <text x="505" y="855" class="terminal-sub">// NETWORK //</text>
  </g>
</svg>
'''
    return svg

dark_svg = generate_master_svg(DARK_SLATE, KHAKI_ORANGE, ACCENT_ORANGE, "dark")
inverted_svg = generate_master_svg(KHAKI_ORANGE, DARK_SLATE, ACCENT_ORANGE, "inverted")

with open('out/broadcast/Tetradic_Master_Logo_Dark.svg', 'w') as f:
    f.write(dark_svg)

with open('out/broadcast/Tetradic_Master_Logo_Inverted.svg', 'w') as f:
    f.write(inverted_svg)

print("Saved Dark and Inverted SVGs!")

# Convert to native VectorCraft (.vectorcraft) and PNG previews
for mode in ['Dark', 'Inverted']:
    svg_file = f'out/broadcast/Tetradic_Master_Logo_{mode}.svg'
    vc_file = f'out/broadcast/Tetradic_Master_Logo_{mode}.vectorcraft'
    png_file = f'out/broadcast/Tetradic_Master_Logo_{mode}.png'
    
    # 1. Convert SVG to .vectorcraft
    subprocess.run(['flatpak', 'run', '--command=vectorcraft-cli', 'ai.storyteller.vectorcraft', 'convert', svg_file, vc_file], check=True)
    # 2. Export to PNG
    subprocess.run(['flatpak', 'run', '--command=vectorcraft-cli', 'ai.storyteller.vectorcraft', 'convert', vc_file, png_file], check=True)
    print(f"Generated {mode} suite (.vectorcraft + .png)")

# Create a combined side-by-side presentation file for VectorCraft (2048 x 1024)
combined_svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2048 1024" width="2048" height="1024">
  <defs>
    <style>
      .label {{ font-family: 'JetBrains Mono', monospace; font-size: 18px; font-weight: bold; fill: #FFFFFF; letter-spacing: 3px; }}
      .sub-label {{ font-family: 'JetBrains Mono', monospace; font-size: 13px; fill: {ACCENT_GOLD}; letter-spacing: 1px; }}
      .box-dark {{ fill: {DARK_SLATE}; stroke: #1D6B57; stroke-width: 2; }}
      .box-light {{ fill: {KHAKI_ORANGE}; stroke: #B58437; stroke-width: 2; }}
    </style>
  </defs>

  <!-- ARTBOARD BACKGROUND -->
  <rect width="2048" height="1024" fill="#06221B" />

  <!-- LEFT PANEL: BROADCAST DARK MASTER -->
  <g id="01_Broadcast_Dark_Master" transform="translate(48, 64)">
    <rect width="900" height="900" rx="12" class="box-dark" />
    <g transform="translate(-50, -50) scale(1.0)">
      <g fill="{KHAKI_ORANGE}">
        <path d="{shifted_tree}" />
'''
for d in shifted_digits:
    combined_svg += f'        <path d="{d}" />\n'
for d in shifted_coder:
    combined_svg += f'        <path d="{d}" />\n'

combined_svg += f'''      </g>
      <g fill="{ACCENT_ORANGE}">
        <path d="{shifted_orange}" />
      </g>
      <g>
        <text x="506" y="805" font-family="JetBrains Mono" font-size="52" font-weight="800" letter-spacing="12" fill="{KHAKI_ORANGE}" text-anchor="middle">TETRADIC</text>
        <text x="505" y="855" font-family="JetBrains Mono" font-size="19" font-weight="700" letter-spacing="9" fill="{ACCENT_ORANGE}" text-anchor="middle">// NETWORK //</text>
      </g>
    </g>
    <text x="450" y="40" text-anchor="middle" class="label">MODE A: BROADCAST DARK MASTER</text>
    <text x="450" y="65" text-anchor="middle" class="sub-label">DARK SLATE (#0B493A) + KHAKI GOLD (#F3B659) + ACCENT ORANGE (#E65A28)</text>
  </g>

  <!-- RIGHT PANEL: INVERTED WARM GOLD MASTER -->
  <g id="02_Inverted_Warm_Gold_Master" transform="translate(1100, 64)">
    <rect width="900" height="900" rx="12" class="box-light" />
    <g transform="translate(-50, -50) scale(1.0)">
      <g fill="{DARK_SLATE}">
        <path d="{shifted_tree}" />
'''
for d in shifted_digits:
    combined_svg += f'        <path d="{d}" />\n'
for d in shifted_coder:
    combined_svg += f'        <path d="{d}" />\n'

combined_svg += f'''      </g>
      <!-- ORANGE REMAINS INVARIANT! -->
      <g fill="{ACCENT_ORANGE}">
        <path d="{shifted_orange}" />
      </g>
      <g>
        <text x="506" y="805" font-family="JetBrains Mono" font-size="52" font-weight="800" letter-spacing="12" fill="{DARK_SLATE}" text-anchor="middle">TETRADIC</text>
        <text x="505" y="855" font-family="JetBrains Mono" font-size="19" font-weight="700" letter-spacing="9" fill="{ACCENT_ORANGE}" text-anchor="middle">// NETWORK //</text>
      </g>
    </g>
    <text x="450" y="40" text-anchor="middle" font-family="JetBrains Mono" font-size="18" font-weight="bold" fill="{DARK_SLATE}" letter-spacing="3">MODE B: INVERTED WARM GOLD</text>
    <text x="450" y="65" text-anchor="middle" font-family="JetBrains Mono" font-size="13" font-weight="600" fill="#784E12" letter-spacing="1">KHAKI GOLD (#F3B659) + DARK SLATE (#0B493A) + ACCENT ORANGE (#E65A28)</text>
  </g>
</svg>
'''

combined_svg_path = 'out/broadcast/Tetradic_Brand_Presentation_Suite.svg'
combined_vc_path = 'out/broadcast/Tetradic_Brand_Presentation_Suite.vectorcraft'
combined_png_path = 'out/broadcast/Tetradic_Brand_Presentation_Suite.png'

with open(combined_svg_path, 'w') as f:
    f.write(combined_svg)

subprocess.run(['flatpak', 'run', '--command=vectorcraft-cli', 'ai.storyteller.vectorcraft', 'convert', combined_svg_path, combined_vc_path], check=True)
subprocess.run(['flatpak', 'run', '--command=vectorcraft-cli', 'ai.storyteller.vectorcraft', 'convert', combined_vc_path, combined_png_path], check=True)
print("Generated Combined Presentation Suite!")
