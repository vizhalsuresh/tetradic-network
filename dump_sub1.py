import xml.etree.ElementTree as ET

tree = ET.parse('out/broadcast/live_inspected.svg')
root = tree.getroot()

ref_g = root.find('.//{http://www.w3.org/2000/svg}g[@id="Reference_Template_Locked"]')
if ref_g is None:
    # try without namespace
    for elem in root.iter():
        if elem.attrib.get('id') == 'Reference_Template_Locked':
            ref_g = elem
            break

print("Reference_Template_Locked children:", len(ref_g))
for i, child in enumerate(ref_g):
    tag = child.tag.split('}')[-1]
    cid = child.attrib.get('id', '')
    fill = child.attrib.get('fill', '')
    print(f"  Item {i}: <{tag}> id='{cid}' fill='{fill}' len_children={len(child)}")
    for j, gc in enumerate(child[:5]):
        gtag = gc.tag.split('}')[-1]
        gfill = gc.attrib.get('fill', '')
        print(f"      Sub {j}: <{gtag}> fill='{gfill}' len={len(gc)}")
