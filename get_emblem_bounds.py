import xml.etree.ElementTree as ET
import re

tree_g = ET.parse('out/broadcast/gold_tree_only.svg')
root_g = tree_g.getroot()
paths_g = root_g.findall('{http://www.w3.org/2000/svg}path')

tree_o = ET.parse('out/broadcast/orange_accent_only.svg')
root_o = tree_o.getroot()
paths_o = root_o.findall('{http://www.w3.org/2000/svg}path')

all_x, all_y = [], []

for p in paths_g + paths_o:
    d = p.attrib.get('d', '')
    tf = p.attrib.get('transform', '')
    dx, dy = 0.0, 0.0
    if 'translate' in tf:
        coords = tf.replace('translate(', '').replace(')', '').split(',')
        dx, dy = float(coords[0]), float(coords[1])
    
    # parse coordinates
    nums = [float(n) for n in re.findall(r'[-+]?\d*\.?\d+', d)]
    for i in range(0, len(nums)-1, 2):
        all_x.append(nums[i] + dx)
        all_y.append(nums[i+1] + dy)

min_x, max_x = min(all_x), max(all_x)
min_y, max_y = min(all_y), max(all_y)
print(f"Emblem Bounding Box: X=[{min_x:.1f}, {max_x:.1f}], Y=[{min_y:.1f}, {max_y:.1f}]")
print(f"Emblem Width: {max_x - min_x:.1f}, Height: {max_y - min_y:.1f}")
print(f"Emblem Center: X={(min_x + max_x)/2:.1f}, Y={(min_y + max_y)/2:.1f}")
