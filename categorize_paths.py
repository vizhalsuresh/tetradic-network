import xml.etree.ElementTree as ET
import re

tree = ET.parse('out/broadcast/live_inspected.svg')
root = tree.getroot()

paths = []
for idx, elem in enumerate(root.iter()):
    tag = elem.tag.split('}')[-1]
    if tag in ['path', 'polygon', 'polyline']:
        fill = elem.attrib.get('fill', '#000000')
        d = elem.attrib.get('d', '')
        
        # calculate approximate bounding box
        coords = [float(n) for n in re.findall(r'[-+]?\d*\.?\d+', d)]
        if len(coords) >= 4:
            xs = coords[0::2]
            ys = coords[1::2]
            min_x, max_x = min(xs), max(xs)
            min_y, max_y = min(ys), max(ys)
            cx, cy = (min_x + max_x) / 2, (min_y + max_y) / 2
            w, h = max_x - min_x, max_y - min_y
            area = w * h
            paths.append({
                'idx': idx,
                'fill': fill,
                'cx': cx, 'cy': cy,
                'w': w, 'h': h,
                'min_x': min_x, 'max_x': max_x,
                'min_y': min_y, 'max_y': max_y,
                'area': area,
                'd_len': len(d),
                'elem': elem
            })

print(f"Total geometric paths: {len(paths)}")
print("Summary by fill color:")
color_groups = {}
for p in paths:
    color_groups.setdefault(p['fill'], []).append(p)

for col, plist in color_groups.items():
    print(f"  {col}: {len(plist)} paths, total area sum={sum(p['area'] for p in plist):.0f}")
