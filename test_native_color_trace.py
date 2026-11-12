import json
import base64

# Load full-opacity tight emblem
with open('out/broadcast/source_emblem_tight.png', 'rb') as f:
    img_b64 = base64.b64encode(f.read()).decode('utf-8')

# Create an SVG with the image at 100% FULL OPACITY
svg_content = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000">
  <rect width="1000" height="1000" fill="#0B493A" />
  <image id="source_image" href="data:image/png;base64,{img_b64}" x="197" y="240" width="606" height="520" opacity="1.0" />
</svg>
'''

with open('out/broadcast/full_opacity_template.svg', 'w') as f:
    f.write(svg_content)

print("Created full_opacity_template.svg")
