import subprocess
import json

# Let's see if vectorcraft-cli run can perform imageTrace on emblem_raw.png
cmd_script = [
    {"command": "document.open", "params": {"file": "out/broadcast/tetradic_trace_template.vectorcraft"}},
    {"command": "layer.unlockAll"},
    {"command": "select.all"},
    {"command": "imageTrace.makeAndExpand", "params": {
        "params": {
            "mode": "blackAndWhite",
            "threshold": 128,
            "ignoreWhite": True,
            "snapCurvesToLines": True,
            "shapes": False
        }
    }},
    {"command": "file.saveAs", "params": {"path": "out/broadcast/autotraced_vectorcraft.vectorcraft"}}
]

with open("commands.json", "w") as f:
    json.dump(cmd_script, f)

