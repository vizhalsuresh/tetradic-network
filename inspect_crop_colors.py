import cv2
import numpy as np

raw = cv2.imread('out/broadcast/emblem_center_crop.png')
# let's look at average colors in slices of the hollow
print("Crop shape:", raw.shape)

# Let's inspect a horizontal slice across y=150 (which corresponds to y=350 in the full image)
# and print colors across x
slice_y = raw[150, :] # around y=350 in full image
# print some key coordinates
print("Samples across trunk hollow at relative y=150:")
for x in range(0, raw.shape[1], 20):
    b, g, r = slice_y[x]
    print(f"  x={x+200}: #{r:02x}{g:02x}{b:02x}")
