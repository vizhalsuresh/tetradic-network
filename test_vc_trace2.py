import json

cmd_script = [
    {"command": "document.open", "params": {"path": "out/broadcast/tetradic_trace_template.vectorcraft"}},
    {"command": "select.all"},
    {"command": "imageTrace.makeAndExpand", "params": {
        "params": {
            "mode": "blackAndWhite",
            "threshold": 128,
            "ignoreWhite": True
        }
    }},
    {"command": "file.saveAs", "params": {"path": "out/broadcast/autotraced_vectorcraft.vectorcraft"}}
]

with open("commands.json", "w") as f:
    json.dump(cmd_script, f)

