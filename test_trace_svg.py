import base64
import os

with open('out/broadcast/emblem_raw.png', 'rb') as f:
    img_b64 = base64.b64encode(f.read()).decode('utf-8')

svg_content = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000">
  <defs>
    <style>
      .ref-layer {{ opacity: 0.5; }}
    </style>
  </defs>
  
  <!-- BACKGROUND -->
  <rect width="1000" height="1000" fill="#0B493A" />
  
  <!-- LOCKED REFERENCE TEMPLATE (50% OPACITY) -->
  <g id="Reference_Template_Locked" class="ref-layer">
    <image href="data:image/png;base64,{img_b64}" x="197" y="100" width="606" height="470" />
  </g>
  
  <!-- USER DRAWING LAYERS -->
  <g id="Traced_Canopy_Binary_Digits" fill="#F3B659">
  </g>
  
  <g id="Traced_Coder_and_Laptop" fill="#F3B659">
  </g>
  
  <g id="Traced_Orange_Trunk_Swoop" fill="#E65A28">
  </g>
</svg>
'''

with open('out/broadcast/tetradic_trace_template.svg', 'w') as f:
    f.write(svg_content)

print("Saved tetradic_trace_template.svg")
