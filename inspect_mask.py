import cv2
import numpy as np

gold_mask = cv2.imread('out/broadcast/clean_gold_mask.png', cv2.IMREAD_GRAYSCALE)
print("clean_gold_mask shape:", gold_mask.shape)
print("Corners:", gold_mask[0,0], gold_mask[0, -1], gold_mask[-1, 0], gold_mask[-1, -1])
print("Non-zero count:", np.count_nonzero(gold_mask))

orange_mask = cv2.imread('out/broadcast/clean_orange_mask.png', cv2.IMREAD_GRAYSCALE)
print("clean_orange_mask shape:", orange_mask.shape)
print("Corners:", orange_mask[0,0], orange_mask[0, -1], orange_mask[-1, 0], orange_mask[-1, -1])
print("Non-zero count:", np.count_nonzero(orange_mask))
