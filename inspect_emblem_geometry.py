import xml.etree.ElementTree as ET
import re

def get_path_data(filename):
    tree = ET.parse(filename)
    root = tree.getroot()
    paths = []
    for p in root.findall('.//{http://www.w3.org/2000/svg}path'):
        paths.append({
            'd': p.attrib.get('d', ''),
            'transform': p.attrib.get('transform', '')
        })
    return paths

gold_paths = get_path_data('out/broadcast/gold_tree_only.svg')
orange_paths = get_path_data('out/broadcast/orange_accent_only.svg')

print(f"Gold paths: {len(gold_paths)}")
print(f"Orange paths: {len(orange_paths)}")

