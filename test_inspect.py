import json
import subprocess

cmd_script = [
    {"command": "document.open", "params": {"path": "out/broadcast/full_opacity_template.vectorcraft"}},
    {"command": "document.inspect"}
]

with open("inspect_commands.json", "w") as f:
    json.dump(cmd_script, f)

cmd = [
    "flatpak", "run", "--command=vectorcraft-cli",
    "ai.storyteller.vectorcraft", "run",
    "--commands", "inspect_commands.json"
]

res = subprocess.run(cmd, capture_output=True, text=True)
print("Stdout:", res.stdout[:500])
