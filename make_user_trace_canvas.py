import base64
import subprocess

# Load clean high-res emblem (source_emblem_tight.png)
with open('out/broadcast/source_emblem_tight.png', 'rb') as f:
    img_b64 = base64.b64encode(f.read()).decode('utf-8')

svg_content = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000">
  <!-- ARTBOARD BACKGROUND -->
  <rect width="1000" height="1000" fill="#0B493A" />
  
  <!-- HIGH-RES SOURCE EMBLEM READY FOR USER TRACE -->
  <image id="EMBLEM_TO_TRACE" href="data:image/png;base64,{img_b64}" x="197" y="240" width="606" height="520" opacity="1.0" />
</svg>
'''

with open('out/broadcast/ready_for_user_trace.svg', 'w') as f:
    f.write(svg_content)

cmd = ['flatpak', 'run', '--command=vectorcraft-cli', 'ai.storyteller.vectorcraft', 'convert', 'out/broadcast/ready_for_user_trace.svg', 'out/broadcast/ready_for_user_trace.vectorcraft']
subprocess.run(cmd, check=True)
print("ready_for_user_trace.vectorcraft created!")
