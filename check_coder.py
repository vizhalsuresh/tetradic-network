import cv2
import numpy as np

raw = cv2.imread('out/broadcast/emblem_raw.png')
h, w, _ = raw.shape
print(f"Emblem raw shape: {h}x{w}")

# Let's inspect the center lower area where the person/laptop is
# usually y from 200 to 450, x from 200 to 400
crop_center = raw[200:450, 200:410]
cv2.imwrite('out/broadcast/emblem_center_crop.png', crop_center)

gold_mask = cv2.imread('out/broadcast/clean_gold_mask.png')
cv2.imwrite('out/broadcast/gold_mask_center_crop.png', gold_mask[200:450, 200:410])

orange_mask = cv2.imread('out/broadcast/clean_orange_mask.png')
cv2.imwrite('out/broadcast/orange_mask_center_crop.png', orange_mask[200:450, 200:410])

test_comp = cv2.imread('out/broadcast/test_emblem_composite.png')
cv2.imwrite('out/broadcast/test_comp_center_crop.png', test_comp[200:450, 200:410])

print("Crops saved for visual inspection.")
