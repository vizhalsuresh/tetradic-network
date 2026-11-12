import cv2
import numpy as np

# Load swatch image
swatch = cv2.imread('/home/revenant/.gemini/antigravity/brain/e7c9dc1f-6305-464e-8322-b0b88de2e48b/.user_uploaded/media_1794153938623_711dbe7c.jpg')
h, w, _ = swatch.shape

# Precise eyedropper sampling
# Sample dark slate (upper block)
dark_region = swatch[int(h*0.25):int(h*0.35), int(w*0.3):int(w*0.7)]
dark_bgr = np.median(dark_region, axis=(0, 1)).astype(int)
dark_hex = f"#{dark_bgr[2]:02x}{dark_bgr[1]:02x}{dark_bgr[0]:02x}".upper()

# Sample khaki orange (lower block)
khaki_region = swatch[int(h*0.65):int(h*0.75), int(w*0.3):int(w*0.7)]
khaki_bgr = np.median(khaki_region, axis=(0, 1)).astype(int)
khaki_hex = f"#{khaki_bgr[2]:02x}{khaki_bgr[1]:02x}{khaki_bgr[0]:02x}".upper()

# Sample top text
text_region = swatch[200:260, 150:580]
text_mask = np.sum(text_region, axis=2) > 300
text_bgr = np.median(text_region[text_mask], axis=0).astype(int)
text_hex = f"#{text_bgr[2]:02x}{text_bgr[1]:02x}{text_bgr[0]:02x}".upper()

print("=== EXACT EYEDROPPER SAMPLE FROM CARD ===")
print(f"Dark Slate Gray (Upper Block): {dark_hex} (RGB: {dark_bgr[2]}, {dark_bgr[1]}, {dark_bgr[0]})")
print(f"Khaki Orange (Lower Block):    {khaki_hex} (RGB: {khaki_bgr[2]}, {khaki_bgr[1]}, {khaki_bgr[0]})")
print(f"Text Highlight Tone:          {text_hex} (RGB: {text_bgr[2]}, {text_bgr[1]}, {text_bgr[0]})")

