import xml.etree.ElementTree as ET

tree = ET.parse('out/broadcast/live_inspected.svg')
root = tree.getroot()

for i, child in enumerate(root):
    tag = child.tag.split('}')[-1]
    cid = child.attrib.get('id', '')
    fill = child.attrib.get('fill', '')
    style = child.attrib.get('style', '')
    print(f"Child {i}: <{tag}> id='{cid}' fill='{fill}' subchildren={len(child)}")
    for j, grandchild in enumerate(child):
        gtag = grandchild.tag.split('}')[-1]
        gid = grandchild.attrib.get('id', '')
        gfill = grandchild.attrib.get('fill', '')
        print(f"    Sub {j}: <{gtag}> id='{gid}' fill='{gfill}' sub={len(grandchild)}")

