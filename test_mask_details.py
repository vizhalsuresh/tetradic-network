import cv2
import numpy as np

gold_mask = cv2.imread('out/broadcast/clean_gold_mask.png', cv2.IMREAD_GRAYSCALE)
print("Gold mask shape:", gold_mask.shape)
print("Row sums around trunk (y=300 to 450):")
for y in range(300, 450, 15):
    print(f"y={y}: sum={np.sum(gold_mask[y, :])}, non-zero={np.count_nonzero(gold_mask[y, :])}")

orange_mask = cv2.imread('out/broadcast/clean_orange_mask.png', cv2.IMREAD_GRAYSCALE)
print("Orange mask row sums around trunk (y=240 to 380):")
for y in range(240, 380, 15):
    print(f"y={y}: sum={np.sum(orange_mask[y, :])}, non-zero={np.count_nonzero(orange_mask[y, :])}")
