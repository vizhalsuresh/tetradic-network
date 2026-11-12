import xml.etree.ElementTree as ET
import re

tree = ET.parse('out/broadcast/live_inspected.svg')
root = tree.getroot()

ref_g = root.find('.//{http://www.w3.org/2000/svg}g[@id="Reference_Template_Locked"]')
item1 = ref_g[1]

gold_elems = []
for elem in item1.iter():
    if elem.attrib.get('fill') == '#fabe52':
        d = elem.attrib.get('d', '')
        nums = [float(n) for n in re.findall(r'[-+]?\d*\.?\d+', d)]
        if len(nums) >= 4:
            xs = nums[0::2]
            ys = nums[1::2]
            min_x, max_x = min(xs), max(xs)
            min_y, max_y = min(ys), max(ys)
            cx, cy = (min_x + max_x)/2, (min_y + max_y)/2
            w, h = max_x - min_x, max_y - min_y
            gold_elems.append({
                'elem': elem,
                'cx': cx, 'cy': cy,
                'w': w, 'h': h,
                'min_x': min_x, 'max_x': max_x,
                'min_y': min_y, 'max_y': max_y,
                'd': d
            })

print(f"Total gold elements in Item 1: {len(gold_elems)}")
# Let's sort by vertical position or area
gold_elems.sort(key=lambda p: p['w']*p['h'], reverse=True)
for i, g in enumerate(gold_elems):
    print(f"  G{i}: Center=({g['cx']:.1f}, {g['cy']:.1f}), W={g['w']:.1f}, H={g['h']:.1f}, area={g['w']*g['h']:.0f}")

