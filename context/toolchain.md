# Verified Toolchain & Execution Guide

> **Audited and Verified**: 2026-10-02  
> This file contains the exact paths, versions, and programmatic execution methods for all external software on this host machine.

---

## 1. Local Tool Summary

| Tool | Version | Path / Command | Primary Function |
| :--- | :--- | :--- | :--- |
| **Node.js** | `v20.20.2` | `/usr/bin/node` | Remotion runtime & build scripts |
| **npm** | `10.8.2` | `/usr/bin/npm` | Package manager |
| **Remotion** | `4.0.528` | Local npm package (`npx remotion`) | Frame-by-frame deterministic video renderer |
| **FFmpeg** | `6.1.1` | `/usr/bin/ffmpeg` | Video encoding, audio multiplexing, format conversion |
| **Blender** | `4.2.23 LTS` | `/home/revenant/.local/bin/blender` | Scripted 3D scene generation & physics via Python `bpy` |
| **DaVinci Resolve** | `20.3.2.0009` | `/opt/davinci-resolve/bin/resolve` | Studio NLE, timeline assembly, Fairlight audio mixing |
| **DaVinci Script API** | Python 3 | `/opt/davinci-resolve/Developer/Scripting/` | Headless timeline automation (`fusionscript.so`) |
| **Tesseract CLI** | `0.2.0` | `tesseract-cli/tesseract-0.2.0-linux-x86_64` | Local motion graphics engine |

---

## 2. Remotion Video Engine

### Preview Development Server
```bash
# Launch interactive timeline preview
npx remotion preview src/index.ts
```

### Rendering Long-Form (16:9) and Shorts (9:16)
```bash
# Render a specific composition
npx remotion render src/index.ts <CompositionId> out/<filename>.mp4

# Render a single hero frame as high-res thumbnail
npx remotion still src/index.ts <CompositionId> out/thumbnail.png --frame=<frame_number>
```

---

## 3. Blender Python (`bpy`) Automation

Blender is verified at `/home/revenant/.local/bin/blender`.

### Running Headless Python Scripts
```bash
# Execute headless Blender script to generate 3D assets or renders
/home/revenant/.local/bin/blender -b -P scripts/blender/render_orbital.py -- --output out/orbital.mp4
```

---

## 4. DaVinci Resolve Python Scripting API

DaVinci Resolve Studio is installed at `/opt/davinci-resolve`.

### Python Bridge Configuration
To run automated timeline assembly scripts in Python:
```python
import sys
import os

# Set environment paths for DaVinci Resolve Scripting
RESOLVE_SCRIPT_API = "/opt/davinci-resolve/Developer/Scripting"
RESOLVE_SCRIPT_LIB = "/opt/davinci-resolve/libs/Fusion/fusionscript.so"

sys.path.append(os.path.join(RESOLVE_SCRIPT_API, "Modules"))

try:
    import DaVinciResolveScript as dvr
    resolve = dvr.scriptapp("Resolve")
    project_manager = resolve.GetProjectManager()
    current_project = project_manager.GetCurrentProject()
    print(f"Connected to DaVinci Resolve: {current_project.GetName()}")
except Exception as e:
    print(f"DaVinci Resolve API connection note: {e}")
```

---

## 5. Sanzo Wada Colorist Skill

Palette query tool is verified at `.agents/skills/sanzo-wada-colorist/scripts/query_palette.py`.

```bash
# Query palette by mood & WCAG contrast
python3 .agents/skills/sanzo-wada-colorist/scripts/query_palette.py --mood "contrast" --min-contrast 7.0 --mode dark

# Output Remotion / React TypeScript color object
python3 .agents/skills/sanzo-wada-colorist/scripts/query_palette.py --id 164 --format remotion
```
