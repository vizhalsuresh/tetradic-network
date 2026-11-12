import re
import os
import xml.etree.ElementTree as ET
import matplotlib.font_manager as fm
from matplotlib.textpath import TextPath
import numpy as np

# Palette constants from user's swatch card
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

# Function to convert Matplotlib TextPath to SVG path d string
def text_to_svg_path(text, font_path, size, tracking=0.15):
    font_prop = fm.FontProperties(fname=font_path)
    
    # We render letter by letter to apply custom tracking (letter-spacing)
    full_d = []
    current_x = 0.0
    
    # Calculate advance width using a test glyph or font metrics
    for char in text:
        tp = TextPath((0, 0), char, size=size, prop=font_prop)
        verts = tp.vertices
        codes = tp.codes
        
        # Bounding box of character
        if len(verts) > 0:
            char_min_x = np.min(verts[:, 0])
            char_max_x = np.max(verts[:, 0])
            char_width = char_max_x - char_min_x
        else:
            # Space character
            char_width = size * 0.4
        
        # Render glyph contours
        i = 0
        while i < len(verts):
            code = codes[i]
            x, y = verts[i]
            y = -y # Flip Y for SVG
            x += current_x
            
            if code == 1: # MOVETO
                full_d.append(f"M {x:.2f} {y:.2f}")
                i += 1
            elif code == 2: # LINETO
                full_d.append(f"L {x:.2f} {y:.2f}")
                i += 1
            elif code == 3: # QUADRATIC
                x1, y1 = verts[i]; y1 = -y1; x1 += current_x
                x2, y2 = verts[i+1]; y2 = -y2; x2 += current_x
                full_d.append(f"Q {x1:.2f} {y1:.2f} {x2:.2f} {y2:.2f}")
                i += 2
            elif code == 4: # CUBIC
                x1, y1 = verts[i]; y1 = -y1; x1 += current_x
                x2, y2 = verts[i+1]; y2 = -y2; x2 += current_x
                x3, y3 = verts[i+2]; y3 = -y3; x3 += current_x
                full_d.append(f"C {x1:.2f} {y1:.2f} {x2:.2f} {y2:.2f} {x3:.2f} {y3:.2f}")
                i += 3
            elif code == 79: # CLOSEPOLY
                full_d.append("Z")
                i += 1
            else:
                i += 1
                
        # Advance X with tracking
        advance = char_width + (size * tracking) if len(verts) > 0 else (size * 0.45)
        current_x += advance

    total_width = current_x - (size * tracking)
    return " ".join(full_d), total_width

print("Helper ready")
