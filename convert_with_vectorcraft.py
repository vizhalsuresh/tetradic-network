import subprocess
import os
import glob

svg_files = glob.glob('out/broadcast/logos/*.svg')
print(f"Found {len(svg_files)} SVGs to convert with VectorCraft CLI:")

for svg_path in sorted(svg_files):
    base = os.path.splitext(svg_path)[0]
    png_path = base + ".png"
    vc_path = base + ".vectorcraft"
    
    # 1. Convert to PNG preview (1000x1000)
    cmd_png = [
        'flatpak', 'run', '--command=vectorcraft-cli',
        'ai.storyteller.vectorcraft', 'convert',
        svg_path, png_path
    ]
    res_png = subprocess.run(cmd_png, capture_output=True, text=True)
    if res_png.returncode == 0:
        print(f"  [OK] PNG: {png_path}")
    else:
        print(f"  [ERR] PNG {png_path}: {res_png.stderr}")
        
    # 2. Convert to native .vectorcraft file for VectorCraft editing
    cmd_vc = [
        'flatpak', 'run', '--command=vectorcraft-cli',
        'ai.storyteller.vectorcraft', 'convert',
        svg_path, vc_path
    ]
    res_vc = subprocess.run(cmd_vc, capture_output=True, text=True)
    if res_vc.returncode == 0:
        print(f"  [OK] VectorCraft: {vc_path}")
    else:
        print(f"  [ERR] VectorCraft {vc_path}: {res_vc.stderr}")

print("Batch conversion completed!")
