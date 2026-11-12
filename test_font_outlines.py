import matplotlib.font_manager as fm
from matplotlib.textpath import TextPath
from matplotlib.patches import PathPatch
import matplotlib.pyplot as plt

# Load font
font_prop = fm.FontProperties(fname='assets/fonts/Montserrat-Bold.ttf')
tp = TextPath((0, 0), "TETRADIC", size=48, prop=font_prop)
print("TextPath vertices:", len(tp.vertices))

# Convert matplotlib Path to SVG path d string
def path_to_svg_d(path, flip_y=True, offset_x=0, offset_y=0):
    commands = []
    codes = path.codes
    verts = path.vertices
    i = 0
    while i < len(verts):
        code = codes[i]
        x, y = verts[i]
        if flip_y:
            y = -y
        x += offset_x
        y += offset_y
        
        if code == 1: # MOVETO
            commands.append(f"M {x:.2f} {y:.2f}")
            i += 1
        elif code == 2: # LINETO
            commands.append(f"L {x:.2f} {y:.2f}")
            i += 1
        elif code == 3: # CURVE3 (quadratic bezier)
            x1, y1 = verts[i]
            x2, y2 = verts[i+1]
            if flip_y:
                y1 = -y1
                y2 = -y2
            x1 += offset_x; y1 += offset_y
            x2 += offset_x; y2 += offset_y
            commands.append(f"Q {x1:.2f} {y1:.2f} {x2:.2f} {y2:.2f}")
            i += 2
        elif code == 4: # CURVE4 (cubic bezier)
            x1, y1 = verts[i]
            x2, y2 = verts[i+1]
            x3, y3 = verts[i+2]
            if flip_y:
                y1 = -y1
                y2 = -y2
                y3 = -y3
            x1 += offset_x; y1 += offset_y
            x2 += offset_x; y2 += offset_y
            x3 += offset_x; y3 += offset_y
            commands.append(f"C {x1:.2f} {y1:.2f} {x2:.2f} {y2:.2f} {x3:.2f} {y3:.2f}")
            i += 3
        elif code == 79: # CLOSEPOLY
            commands.append("Z")
            i += 1
        else:
            i += 1
    return " ".join(commands)

d_str = path_to_svg_d(tp)
print("SVG d preview:", d_str[:120])
