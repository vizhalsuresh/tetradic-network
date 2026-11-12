#!/usr/bin/env python3
"""
query_palette.py - Sanzo Wada Color Palette Query Engine for Coded Video Generation
Provides deterministic queries and code-ready snippets for Remotion, Three.js, p5.js, and GLSL.
"""

import sys
import json
import argparse
import random
from pathlib import Path

DATA_PATH = Path(__file__).resolve().parent.parent / "references" / "wada_combinations_enriched.json"

def hex_to_rgb_norm(hex_code):
    h = hex_code.lstrip("#")
    r = int(h[0:2], 16) / 255.0
    g = int(h[2:4], 16) / 255.0
    b = int(h[4:6], 16) / 255.0
    return round(r, 4), round(g, 4), round(b, 4)

def format_remotion(combo, mode="dark"):
    roles = combo["coded_video_roles"][mode + "_mode"]
    colors = combo["colors"]
    swatches_str = "\n".join([f'    {{ name: "{c["name"]}", hex: "{c["hex"]}", tone: "{c["tone"]}" }},' for c in colors])
    cr = combo['metrics']['max_contrast_ratio']
    return f"""// Sanzo Wada Palette #{combo['combination_id']} ({combo['season']})
// Recommended: {combo['recommended_video_aesthetic']}
export const WadaTheme_{combo['combination_id']} = {{
  name: "Wada Combo #{combo['combination_id']}",
  season: "{combo['season']}",
  canvas: "{roles['canvas_bg']}",         // {roles['canvas_name']}
  primary: "{roles['primary_stroke']}",    // {roles['primary_stroke_name']}
  accent: "{roles['accent_particle']}",     // {roles['accent_name']}
  palette: {json.dumps(combo['hex_codes'])},
  swatches: [
{swatches_str}
  ],
  contrastRatio: {cr}
}};"""

def format_threejs(combo, mode="dark"):
    roles = combo["coded_video_roles"][mode + "_mode"]
    r_canvas = hex_to_rgb_norm(roles['canvas_bg'])
    r_primary = hex_to_rgb_norm(roles['primary_stroke'])
    r_accent = hex_to_rgb_norm(roles['accent_particle'])
    return f"""// Three.js / React Three Fiber Theme - Wada #{combo['combination_id']}
import * as THREE from 'three';

export const wadaColors_{combo['combination_id']} = {{
  canvasBg: new THREE.Color('{roles['canvas_bg']}'),
  primaryStroke: new THREE.Color('{roles['primary_stroke']}'),
  accentGlow: new THREE.Color('{roles['accent_particle']}'),
  rawHex: {json.dumps(combo['hex_codes'])},
  glslUniforms: {{
    uCanvas: {{ value: new THREE.Vector3({r_canvas[0]}, {r_canvas[1]}, {r_canvas[2]}) }},
    uPrimary: {{ value: new THREE.Vector3({r_primary[0]}, {r_primary[1]}, {r_primary[2]}) }},
    uAccent: {{ value: new THREE.Vector3({r_accent[0]}, {r_accent[1]}, {r_accent[2]}) }},
  }}
}};"""

def format_p5(combo, mode="dark"):
    roles = combo["coded_video_roles"][mode + "_mode"]
    return f"""// p5.js Creative Coding Palette - Wada #{combo['combination_id']}
const WADA_THEME = {{
  canvas: '{roles['canvas_bg']}',
  geometry: '{roles['primary_stroke']}',
  accent: '{roles['accent_particle']}',
  all: {json.dumps(combo['hex_codes'])}
}};

function applyWadaCanvas() {{
  background(WADA_THEME.canvas);
}}"""

def format_glsl(combo, mode="dark"):
    roles = combo["coded_video_roles"][mode + "_mode"]
    r_c = hex_to_rgb_norm(roles['canvas_bg'])
    r_p = hex_to_rgb_norm(roles['primary_stroke'])
    r_a = hex_to_rgb_norm(roles['accent_particle'])
    return f"""// GLSL Fragment Shader Palette - Sanzo Wada #{combo['combination_id']}
// Contrast Ratio: {combo['metrics']['max_contrast_ratio']}:1
vec3 uCanvas  = vec3({r_c[0]}, {r_c[1]}, {r_c[2]}); // {roles['canvas_name']}
vec3 uPrimary = vec3({r_p[0]}, {r_p[1]}, {r_p[2]}); // {roles['primary_stroke_name']}
vec3 uAccent  = vec3({r_a[0]}, {r_a[1]}, {r_a[2]}); // {roles['accent_name']}"""

def main():
    parser = argparse.ArgumentParser(description="Query Sanzo Wada Color Combinations for Coded Video")
    parser.add_argument("--id", type=int, help="Combination ID (1-348)")
    parser.add_argument("--mood", type=str, help="Filter by mood (e.g. 'contrast', 'warm', 'cool', 'subtle', 'dynamic')")
    parser.add_argument("--season", type=str, help="Filter by season (spring, summer, autumn, winter)")
    parser.add_argument("--count", type=int, choices=[2, 3, 4], help="Filter by color count")
    parser.add_argument("--min-contrast", type=float, help="Minimum WCAG contrast ratio (e.g. 4.5 or 7.0)")
    parser.add_argument("--mode", choices=["dark", "light"], default="dark", help="Canvas mode (default: dark)")
    parser.add_argument("--format", choices=["summary", "json", "remotion", "threejs", "p5", "glsl"], default="summary", help="Output format")
    parser.add_argument("--limit", type=int, default=5, help="Max results to return (default: 5)")
    parser.add_argument("--random", action="store_true", help="Pick one randomly from matching results")

    args = parser.parse_args()

    if not DATA_PATH.exists():
        print(f"Error: Database not found at {DATA_PATH}", file=sys.stderr)
        sys.exit(1)

    with open(DATA_PATH) as f:
        combinations = json.load(f)

    results = []

    if args.id:
        match = next((c for c in combinations if c["combination_id"] == args.id), None)
        if match:
            results = [match]
    else:
        filtered = combinations
        if args.count:
            filtered = [c for c in filtered if c["color_count"] == args.count]
        if args.min_contrast:
            filtered = [c for c in filtered if c["metrics"]["max_contrast_ratio"] >= args.min_contrast]
        if args.season:
            s_query = args.season.lower()
            filtered = [c for c in filtered if s_query in c["season"].lower()]
        if args.mood:
            m_query = args.mood.lower()
            filtered = [
                c for c in filtered 
                if any(m_query in m.lower() for m in c["mood_tags"])
                or m_query in c["recommended_video_aesthetic"].lower()
            ]

        if args.random and filtered:
            results = [random.choice(filtered)]
        else:
            results = filtered[:args.limit]

    if not results:
        print("No matching Wada combinations found for the specified criteria.")
        sys.exit(0)

    for combo in results:
        if args.format == "summary":
            roles = combo["coded_video_roles"][args.mode + "_mode"]
            print(f"============================================================")
            print(f"Sanzo Wada Combination #{combo['combination_id']} ({combo['color_count']} colors)")
            print(f"Season: {combo['season']}")
            print(f"Mood: {', '.join(combo['mood_tags'])}")
            print(f"Max Contrast: {combo['metrics']['max_contrast_ratio']}:1 | WCAG AA: {combo['metrics']['wcag_aa_accessible']} | AAA: {combo['metrics']['wcag_aaa_accessible']}")
            print(f"Recommended Aesthetic: {combo['recommended_video_aesthetic']}")
            print(f"------------------------------------------------------------")
            print(f"Roles ({args.mode.upper()} CANVAS):")
            print(f"  [Canvas BG]       {roles['canvas_bg']}  ({roles['canvas_name']})")
            print(f"  [Primary Stroke]  {roles['primary_stroke']}  ({roles['primary_stroke_name']})")
            print(f"  [Accent Glow]     {roles['accent_particle']}  ({roles['accent_name']})")
            print(f"All Colors:")
            for c in combo['colors']:
                print(f"  • {c['hex']} | {c['name']:<20} | {c['tone']:<18} | {c['hue_category']}")
            print(f"============================================================\n")
        elif args.format == "json":
            print(json.dumps(combo, indent=2))
        elif args.format == "remotion":
            print(format_remotion(combo, args.mode))
        elif args.format == "threejs":
            print(format_threejs(combo, args.mode))
        elif args.format == "p5":
            print(format_p5(combo, args.mode))
        elif args.format == "glsl":
            print(format_glsl(combo, args.mode))

if __name__ == "__main__":
    main()
