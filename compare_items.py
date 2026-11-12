import xml.etree.ElementTree as ET
import re

tree = ET.parse('out/broadcast/live_inspected.svg')
root = tree.getroot()

ref_g = root.find('.//{http://www.w3.org/2000/svg}g[@id="Reference_Template_Locked"]')
for i in [0, 1]:
    group = ref_g[i]
    all_x, all_y = [], []
    fills = {}
    for elem in group.iter():
        d = elem.attrib.get('d', '')
        f = elem.attrib.get('fill', '')
        if f: fills[f] = fills.get(f, 0) + 1
        nums = [float(n) for n in re.findall(r'[-+]?\d*\.?\d+', d)]
        all_x.extend(nums[0::2])
        all_y.extend(nums[1::2])
    print(f"Item {i}: X=[{min(all_x):.1f}, {max(all_x):.1f}], Y=[{min(all_y):.1f}, {max(all_y):.1f}], fills={fills}")
