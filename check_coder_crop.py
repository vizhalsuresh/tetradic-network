import cv2
import numpy as np

raw = cv2.imread('out/broadcast/emblem_raw.png')
comp = cv2.imread('out/broadcast/test_emblem_composite.png')

# Hollow crop: y from 260 to 440, x from 220 to 380
crop_raw = raw[260:440, 220:380]
crop_comp = comp[260:440, 220:380]

hollow_side = np.hstack([crop_raw, crop_comp])
cv2.imwrite('out/broadcast/hollow_side_by_side.png', hollow_side)
print("Saved out/broadcast/hollow_side_by_side.png:", hollow_side.shape)
