import xml.etree.ElementTree as ET

tree = ET.parse('out/broadcast/gold_tree_only.svg')
root = tree.getroot()
paths = root.findall('{http://www.w3.org/2000/svg}path')

print("Path lengths sorted descending:")
paths_with_len = []
for i, p in enumerate(paths):
    d = p.attrib.get('d', '')
    tf = p.attrib.get('transform', '')
    paths_with_len.append((len(d), i, tf, d[:60]))

paths_with_len.sort(key=lambda x: x[0], reverse=True)
for l, i, tf, prev in paths_with_len[:10]:
    print(f"Path {i}: len={l}, transform={tf}, prev={prev}")
