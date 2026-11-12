import xml.etree.ElementTree as ET
import re

tree = ET.parse('out/broadcast/live_inspected.svg')
root = tree.getroot()

ref_g = root.find('.//{http://www.w3.org/2000/svg}g[@id="Reference_Template_Locked"]')
item1 = ref_g[1]

# find G0 (the biggest path)
for elem in item1.iter():
    d = elem.attrib.get('d', '')
    if len(d) > 3000 and elem.attrib.get('fill') == '#fabe52':
        # split by M
        subpaths = [p for p in re.split(r'(?=M)', d) if p.strip()]
        print(f"G0 has {len(subpaths)} subpaths!")
        for k, sp in enumerate(subpaths):
            coords = [float(n) for n in re.findall(r'[-+]?\d*\.?\d+', sp)]
            xs = coords[0::2]
            ys = coords[1::2]
            print(f"  Subpath {k}: points={len(xs)}, X=[{min(xs):.1f}, {max(xs):.1f}], Y=[{min(ys):.1f}, {max(ys):.1f}]")
