import json

def image_layer(id, name, asset, start, duration, pos, scale=[100,100]):
    return {
        "type": "Image",
        "id": id,
        "name": name,
        "activeRange": { "start": int(start*1000), "duration": int(duration*1000) },
        "source": { "assetId": asset, "fit": "contain" },
        "transform": {
            "anchorPoint": [0.0, 0.0],
            "position": pos,
            "scale": scale,
            "rotation": 0.0,
            "opacity": 100.0
        }
    }

def bg_layer(id):
    return {
        "type": "Rect",
        "id": id,
        "name": "Background",
        "activeRange": { "start": 0, "duration": 35000 },
        "rect": {
            "fillColor": [0.05, 0.05, 0.05, 1.0],
            "size": [1080.0, 1920.0],
            "fillEnabled": True
        },
        "transform": {
            "anchorPoint": [0.0, 0.0],
            "position": [0.0, 0.0],
            "scale": [100.0, 100.0],
            "rotation": 0.0,
            "opacity": 100.0
        }
    }

layers = []
layers.append(bg_layer(100))

# Act 1 (0-5s)
layers.append(image_layer(1, "Pose 0", "pose-0", 0, 5, [0, 400], [100, 100]))

# Act 2 (5-25s)
powers = ["pose-1", "pose-2", "pose-3", "pose-4", "pose-0"]
layer_id = 10
start_time = 5.0
for asset in powers:
    layers.append(image_layer(layer_id, f"Power Image {layer_id}", asset, start_time, 4.0, [0, 400], [100, 100]))
    layer_id += 2
    start_time += 4.0

# Act 3 (25-35s)
layers.append(image_layer(30, "Outro Image", "pose-1", 25.0, 10.0, [0, 400], [100, 100]))

layers.reverse()

with open("editable_final.json", "r") as f:
    doc = json.load(f)

doc["duration"] = 35.0
doc["composition"]["layers"] = layers

with open("editable_final.json", "w") as f:
    json.dump(doc, f, indent=2)
