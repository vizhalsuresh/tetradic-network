import xml.etree.ElementTree as ET

tree = ET.parse('out/broadcast/gold_traced.svg')
root = tree.getroot()
print(f"SVG tag: {root.tag}, attrib: {root.attrib}")
paths = root.findall('{http://www.w3.org/2000/svg}path')
print(f"Total paths in gold_traced: {len(paths)}")
for i, p in enumerate(paths[:10]):
    print(f"Path {i}: fill={p.attrib.get('fill')}, transform={p.attrib.get('transform')}, d_len={len(p.attrib.get('d', ''))}")

tree_o = ET.parse('out/broadcast/orange_traced.svg')
root_o = tree_o.getroot()
paths_o = root_o.findall('{http://www.w3.org/2000/svg}path')
print(f"Total paths in orange_traced: {len(paths_o)}")
for i, p in enumerate(paths_o[:10]):
    print(f"Path {i}: fill={p.attrib.get('fill')}, transform={p.attrib.get('transform')}, d_len={len(p.attrib.get('d', ''))}")
