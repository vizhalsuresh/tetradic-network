#!/usr/bin/env python3
"""
TETRADIC NETWORK — Vox Explainer Local VO Generator (Calliope / Kokoro-82M)
Reads script.json for a show, synthesizes audio for every beat, probes duration with ffprobe,
and writes audio/vo_durations.json according to the Vox Explainer pipeline spec.
"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import json
import subprocess
from scripts.tts_director import KokoroDirector

def generate_vo_for_show(project_dir, voice="af_sarah"):
    script_path = os.path.join(project_dir, "script.json")
    if not os.path.exists(script_path):
        print(f"Error: {script_path} not found")
        sys.exit(1)

    with open(script_path, "r") as f:
        data = json.load(f)

    vo_dir = os.path.join(project_dir, "audio", "vo")
    os.makedirs(vo_dir, exist_ok=True)

    director = KokoroDirector(base_voice=voice)
    beats_info = []
    total_duration = 0.0

    print(f"=== Synthesizing Voiceover for: {data.get('title', 'Unknown')} ({len(data['beats'])} beats) ===")

    for beat in data["beats"]:
        beat_id = beat["id"]
        narration = beat["narration"]
        out_filename = f"beat_{beat_id:02d}.mp3"
        out_path = os.path.join(vo_dir, out_filename)

        # Wrap in SSML with measured documentary cadence
        ssml = f'<speak><prosody rate="-4%">{narration}</prosody></speak>'
        
        # Check if already generated
        if not os.path.exists(out_path) or os.path.getsize(out_path) < 1000:
            print(f"Generating Beat {beat_id:02d}...")
            director.render_ssml(ssml, out_path)
        else:
            print(f"Beat {beat_id:02d} already exists, skipping synthesis.")

        # Probe duration via ffprobe
        cmd = [
            "ffprobe", "-v", "error",
            "-show_entries", "format=duration",
            "-of", "csv=p=0", out_path
        ]
        res = subprocess.run(cmd, stdout=subprocess.PIPE, text=True, check=True)
        duration = round(float(res.stdout.strip()), 2)
        total_duration += duration

        beats_info.append({
            "id": beat_id,
            "file": f"audio/vo/{out_filename}",
            "duration": duration,
            "caption_text": beat.get("caption_text")
        })
        print(f"  -> Beat {beat_id:02d}: {duration}s | Caption: {beat.get('caption_text')}")

    durations_path = os.path.join(project_dir, "audio", "vo_durations.json")
    summary = {
        "title": data.get("title"),
        "total_duration": round(total_duration, 2),
        "total_minutes": round(total_duration / 60.0, 2),
        "beat_count": len(beats_info),
        "beats": beats_info
    }
    with open(durations_path, "w") as f:
        json.dump(summary, f, indent=2)

    print(f"✅ Generated {len(beats_info)} VO files. Total duration: {total_duration:.1f}s ({total_duration/60.0:.2f} min)")
    print(f"Saved manifest: {durations_path}")
    return summary

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 scripts/generate_vox_vo.py <project_dir> [voice]")
        sys.exit(1)
    voice = sys.argv[2] if len(sys.argv) > 2 else "af_sarah"
    generate_vo_for_show(sys.argv[1], voice)
