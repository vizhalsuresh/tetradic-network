import xml.etree.ElementTree as ET

tree = ET.parse('out/broadcast/gold_tree_only.svg')
root = tree.getroot()
paths = root.findall('{http://www.w3.org/2000/svg}path')

print(f"Total paths: {len(paths)}")
for i, p in enumerate(paths):
    tf = p.attrib.get('transform', '')
    d = p.attrib.get('d', '')
    if 'translate' in tf:
        coords = tf.replace('translate(', '').replace(')', '').split(',')
        x, y = float(coords[0]), float(coords[1])
        if 200 <= x <= 350 and 200 <= y <= 450:
            print(f"Path {i} at ({x:.1f}, {y:.1f}), d_len={len(d)}, d_preview={d[:80]}")
