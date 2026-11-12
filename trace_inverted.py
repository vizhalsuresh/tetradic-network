import cv2
import vtracer
import xml.etree.ElementTree as ET

# 1. Invert gold mask: Tree = 0 (black), Background = 255 (white)
gold = cv2.imread('out/broadcast/clean_gold_mask.png', cv2.IMREAD_GRAYSCALE)
gold_inv = 255 - gold
cv2.imwrite('out/broadcast/gold_inv.png', gold_inv)

vtracer.convert_image_to_svg_py(
    'out/broadcast/gold_inv.png',
    'out/broadcast/gold_tree_only.svg',
    colormode='binary',
    mode='spline',
    hierarchical='stacked',
    filter_speckle=4,
    color_precision=8,
    layer_difference=16,
    corner_threshold=60,
    length_threshold=4.0,
    splice_threshold=45,
    path_precision=2
)

# 2. Invert orange mask: Accent = 0 (black), Background = 255 (white)
orange = cv2.imread('out/broadcast/clean_orange_mask.png', cv2.IMREAD_GRAYSCALE)
orange_inv = 255 - orange
cv2.imwrite('out/broadcast/orange_inv.png', orange_inv)

vtracer.convert_image_to_svg_py(
    'out/broadcast/orange_inv.png',
    'out/broadcast/orange_accent_only.svg',
    colormode='binary',
    mode='spline',
    hierarchical='stacked',
    filter_speckle=2,
    color_precision=8,
    layer_difference=16,
    corner_threshold=60,
    length_threshold=4.0,
    splice_threshold=45,
    path_precision=2
)

tree_g = ET.parse('out/broadcast/gold_tree_only.svg')
root_g = tree_g.getroot()
paths_g = root_g.findall('{http://www.w3.org/2000/svg}path')
print("Gold tree paths count:", len(paths_g))
for i, p in enumerate(paths_g[:5]):
    print(f"  Gold Path {i}: transform={p.attrib.get('transform')}, d_len={len(p.attrib.get('d', ''))}")

tree_o = ET.parse('out/broadcast/orange_accent_only.svg')
root_o = tree_o.getroot()
paths_o = root_o.findall('{http://www.w3.org/2000/svg}path')
print("Orange accent paths count:", len(paths_o))
for i, p in enumerate(paths_o[:5]):
    print(f"  Orange Path {i}: transform={p.attrib.get('transform')}, d_len={len(p.attrib.get('d', ''))}")
