import xml.etree.ElementTree as ET
import re

tree = ET.parse('out/broadcast/live_inspected.svg')
root = tree.getroot()

gold_paths = []
for elem in root.iter():
    tag = elem.tag.split('}')[-1]
    if tag == 'path' and elem.attrib.get('fill') == '#fabe52':
        d = elem.attrib.get('d', '')
        coords = [float(n) for n in re.findall(r'[-+]?\d*\.?\d+', d)]
        if len(coords) >= 4:
            xs = coords[0::2]
            ys = coords[1::2]
            min_x, max_x = min(xs), max(xs)
            min_y, max_y = min(ys), max(ys)
            cx, cy = (min_x + max_x) / 2, (min_y + max_y) / 2
            w, h = max_x - min_x, max_y - min_y
            gold_paths.append({
                'cx': cx, 'cy': cy,
                'w': w, 'h': h,
                'min_x': min_x, 'max_x': max_x,
                'min_y': min_y, 'max_y': max_y,
                'd_len': len(d),
                'elem': elem
            })

print(f"Total gold paths: {len(gold_paths)}")
# Sort by area or size
gold_paths.sort(key=lambda p: p['w'] * p['h'], reverse=True)
for i, p in enumerate(gold_paths[:15]):
    print(f"Path {i}: Center=({p['cx']:.1f}, {p['cy']:.1f}), W={p['w']:.1f}, H={p['h']:.1f}, d_len={p['d_len']}")
