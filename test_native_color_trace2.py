import json
import subprocess

cmd_script = [
    {"command": "document.open", "params": {"path": "out/broadcast/full_opacity_template.vectorcraft"}},
    {"command": "select.set", "params": {"ids": [3]}},
    {"command": "imageTrace.makeAndExpand", "params": {
        "id": 3,
        "params": {
            "mode": "color",
            "colors": 8,
            "palette": "automatic",
            "paths": 50,
            "corners": 45,
            "noise": 5
        }
    }},
    {"command": "file.saveAs", "params": {"path": "out/broadcast/tetradic_trace_template.vectorcraft"}}
]

with open("run_color_trace.json", "w") as f:
    json.dump(cmd_script, f)

cmd = [
    "flatpak", "run", "--command=vectorcraft-cli",
    "ai.storyteller.vectorcraft", "run",
    "--commands", "run_color_trace.json",
    "--export", "out/broadcast/native_color_trace_result.png"
]

res = subprocess.run(cmd, capture_output=True, text=True)
print("Return code:", res.returncode)
print("Stdout:", res.stdout)
print("Stderr:", res.stderr)
