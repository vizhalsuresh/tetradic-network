import cv2
import numpy as np

m_dark = cv2.imread('out/broadcast/logos/tetradic_logo_montserrat_dark.png')
s_dark = cv2.imread('out/broadcast/logos/tetradic_logo_spacegrotesk_dark.png')
c_dark = cv2.imread('out/broadcast/logos/tetradic_logo_cinzel_dark.png')

m_light = cv2.imread('out/broadcast/logos/tetradic_logo_montserrat_light.png')
s_light = cv2.imread('out/broadcast/logos/tetradic_logo_spacegrotesk_light.png')
c_light = cv2.imread('out/broadcast/logos/tetradic_logo_cinzel_light.png')

# Resize to 500x500 for compact comparison sheet
def res(img):
    return cv2.resize(img, (500, 500), interpolation=cv2.INTER_AREA)

row_dark = np.hstack([res(m_dark), res(s_dark), res(c_dark)])
row_light = np.hstack([res(m_light), res(s_light), res(c_light)])

# Add a divider
divider = np.zeros((20, row_dark.shape[1], 3), dtype=np.uint8)
divider[:] = (20, 20, 20)

showcase = np.vstack([row_dark, divider, row_light])
cv2.imwrite('out/broadcast/typography_showcase.png', showcase)
print("Saved typography showcase image: out/broadcast/typography_showcase.png", showcase.shape)
