import xml.etree.ElementTree as ET
import re

tree = ET.parse('out/broadcast/live_inspected.svg')
root = tree.getroot()

ref_g = root.find('.//{http://www.w3.org/2000/svg}g[@id="Reference_Template_Locked"]')
item1 = ref_g[1]

for elem in item1.iter():
    f = elem.attrib.get('fill', '')
    if f == '#f26201':
        d = elem.attrib.get('d', '')
        coords = [float(n) for n in re.findall(r'[-+]?\d*\.?\d+', d)]
        xs = coords[0::2]
        ys = coords[1::2]
        print(f"Orange Swoop: X=[{min(xs):.1f}, {max(xs):.1f}], Y=[{min(ys):.1f}, {max(ys):.1f}], points={len(xs)}, d_len={len(d)}")
