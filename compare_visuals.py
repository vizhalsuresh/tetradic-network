import cv2
import numpy as np

raw = cv2.imread('out/broadcast/emblem_raw.png')
comp = cv2.imread('out/broadcast/test_emblem_composite.png')

# In comp, background is #0B493A (Dark Slate).
# In raw, background is approximately #013B35.
# Let's save a side-by-side comparison image!
h = min(raw.shape[0], comp.shape[0])
w = min(raw.shape[1], comp.shape[1])

side_by_side = np.hstack([raw[:h, :w], comp[:h, :w]])
cv2.imwrite('out/broadcast/compare_side_by_side.png', side_by_side)
print("Saved out/broadcast/compare_side_by_side.png:", side_by_side.shape)
