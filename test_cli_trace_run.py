import json
import subprocess

cmd_script = [
    {"command": "document.open", "params": {"path": "out/broadcast/full_opacity_template.vectorcraft"}},
    {"command": "select.byKind", "params": {"kind": "Image"}},
    {"command": "imageTrace.makeAndExpand", "params": {
        "params": {
            "mode": "color",
            "colors": 16,
            "palette": "automatic",
            "paths": 60,
            "corners": 50,
            "noise": 4
        }
    }},
    {"command": "file.saveAs", "params": {"path": "out/broadcast/full_opacity_colortraced.vectorcraft"}}
]

with open("trace_commands.json", "w") as f:
    json.dump(cmd_script, f)

cmd = [
    "flatpak", "run", "--command=vectorcraft-cli",
    "ai.storyteller.vectorcraft", "run",
    "--commands", "trace_commands.json",
    "--export", "out/broadcast/full_opacity_colortraced.png"
]

res = subprocess.run(cmd, capture_output=True, text=True)
print("Return code:", res.returncode)
print("Stdout:", res.stdout)
print("Stderr:", res.stderr)
