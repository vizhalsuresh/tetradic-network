import cv2
import numpy as np

comp = cv2.imread('out/broadcast/test_emblem_composite.png')
# Let's check coder area in comp (y=320..420, x=260..340)
coder_area = comp[320:420, 260:340]
gold_pixels = np.sum((coder_area[:, :, 0] > 70) & (coder_area[:, :, 1] > 150) & (coder_area[:, :, 2] > 200))
print("Gold pixels in coder area:", gold_pixels)

# Let's check raw area
raw = cv2.imread('out/broadcast/emblem_raw.png')
raw_area = raw[320:420, 260:340]
raw_gold = np.sum((raw_area[:, :, 0] > 50) & (raw_area[:, :, 1] > 150) & (raw_area[:, :, 2] > 200))
print("Raw gold pixels in coder area:", raw_gold)
