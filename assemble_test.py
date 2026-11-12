import xml.etree.ElementTree as ET

tree_g = ET.parse('out/broadcast/gold_tree_only.svg')
root_g = tree_g.getroot()
paths_g = root_g.findall('{http://www.w3.org/2000/svg}path')

tree_o = ET.parse('out/broadcast/orange_accent_only.svg')
root_o = tree_o.getroot()
paths_o = root_o.findall('{http://www.w3.org/2000/svg}path')

# Swatch colors
DARK_SLATE = "#0B493A"
KHAKI_GOLD = "#F3B659"
ORANGE_ACCENT = "#E65A28"

svg_content = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 606 470" width="606" height="470">
  <rect width="606" height="470" fill="{DARK_SLATE}" />
  <g id="gold-emblem" fill="{KHAKI_GOLD}">
'''

for p in paths_g:
    d = p.attrib.get('d', '')
    tf = p.attrib.get('transform', '')
    tf_str = f' transform="{tf}"' if tf else ''
    svg_content += f'    <path d="{d}"{tf_str} />\n'

svg_content += f'''  </g>
  <g id="orange-accent" fill="{ORANGE_ACCENT}">
'''

for p in paths_o:
    d = p.attrib.get('d', '')
    tf = p.attrib.get('transform', '')
    tf_str = f' transform="{tf}"' if tf else ''
    svg_content += f'    <path d="{d}"{tf_str} />\n'

svg_content += '''  </g>
</svg>
'''

with open('out/broadcast/test_emblem_composite.svg', 'w') as f:
    f.write(svg_content)

print("Saved test_emblem_composite.svg")
