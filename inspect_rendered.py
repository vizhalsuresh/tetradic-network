import cv2
import numpy as np

img = cv2.imread('out/broadcast/test_emblem_composite.png')
print("Image shape:", img.shape)

# Let's count the distinct colors in test_emblem_composite.png
colors, counts = np.unique(img.reshape(-1, 3), axis=0, return_counts=True)
sorted_indices = np.argsort(-counts)
print("Top colors (BGR):")
for idx in sorted_indices[:10]:
    b, g, r = colors[idx]
    hex_code = f"#{r:02x}{g:02x}{b:02x}"
    print(f"  {hex_code}: {counts[idx]} pixels")

