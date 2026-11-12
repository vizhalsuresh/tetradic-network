---
name: sanzo-wada-colorist
description: >-
  Use this skill whenever designing, styling, or theming coded video scenes, algorithmic art, Remotion sequences, Three.js shaders, p5.js animations, or YouTube thumbnails. Provides Sanzo Wada's 348 color combinations (Haishoku Sōkan, 1933) enriched with aesthetic theory, seasonal motifs, WCAG contrast verification, and deterministic query tools.
---

# Sanzo Wada Color Director (ORBIT Creative Video Edition)

This skill equips the agent with the aesthetic theory, color harmony, and palette dataset of Japanese master artist **Sanzo Wada (和田 三造, 1883–1967)** from his 1933 masterwork *Haishoku Sōkan* (配色総鑑).

Use this skill to elevate coded YouTube visuals from generic neon/terminal cliches to timeless, museum-grade generative art.

---

## When to Activate This Skill

Activate this skill when:
* Creating or modifying Remotion video scenes, transitions, or typography.
* Writing Three.js / WebGL / GLSL shaders, particle systems, or 3D meshes.
* Generating 2D canvas, p5.js, SVG, or mathematical visualizations (Manim / Motion Canvas).
* Generating YouTube video thumbnails that require high-contrast mobile readability.
* The user asks for a color palette, aesthetic theme, or visual art direction.

---

## The 4-Step Decision Protocol

Whenever styling a scene or generating creative code, follow this protocol:

### Step 1: Identify Emotional & Conceptual Tone
Determine the feeling of the video scene:
* **Austere / Mathematical Rigor:** Winter/Autumn palettes, deep Sumi slate backdrop with sharp ochre or lemon yellow syntax.
* **Algorithmic Flow / Shaders / Nature:** Summer/Spring palettes, verdant moss, water cerulean, dusty rose accents.
* **High-Paced / Fast Cuts / YouTube Shorts:** High-contrast 1930s *Modan* duos (WCAG contrast > 7.0:1).
* **Meditative / Ambient Coding:** Low-contrast *Shibui* harmonies with subtle tonal friction.

### Step 2: Query Deterministic Palette Data
Do **NOT** guess or hallucinate hex codes. Run the bundled query tool:

```bash
# Query by mood and contrast:
python3 .agents/skills/sanzo-wada-colorist/scripts/query_palette.py --mood "contrast" --min-contrast 7.0 --mode dark

# Query for specific code format (remotion, threejs, p5, or glsl):
python3 .agents/skills/sanzo-wada-colorist/scripts/query_palette.py --id 164 --format remotion

# Get a random seasonal palette:
python3 .agents/skills/sanzo-wada-colorist/scripts/query_palette.py --season "autumn" --random --format threejs
```

### Step 3: Enforce Semantic Layer Hierarchy (60-30-10 Rule)
Distribute the palette across the visual layers:
1. **Canvas / Background (~60%):** Ground the scene. In dark mode, use deep slates or indigos (never pure `#000000`). In light mode, use unbleached parchment (never blinding `#ffffff`).
2. **Primary Structure / Typography (~30%):** Formula text, code editor body, structural geometry, axes. Must have minimum 4.5:1 WCAG contrast against canvas.
3. **Kinetic Accent / Particle Glow (~10%):** The saturated focal point. Use for cursor glows, particle bursts, active nodes, or key metrics.

### Step 4: Inject Code-Ready Architecture
Use the established recipes in [creative_coding_recipes.md](./references/creative_coding_recipes.md) to integrate the palette directly into Remotion, Three.js, p5.js, or Canvas code.

---

## Key Reference Files
* **[BOOK_CONTEXT_AND_PHILOSOPHY.md](./references/BOOK_CONTEXT_AND_PHILOSOPHY.md)**: Historical background of Wada, Ridgway's 1912 nomenclature, and Showa-era aesthetic principles.
* **[creative_coding_recipes.md](./references/creative_coding_recipes.md)**: Code templates for Remotion, Three.js shaders, p5.js flow fields, and YouTube thumbnails.
* **[wada_combinations_enriched.json](./references/wada_combinations_enriched.json)**: Full database of 348 combinations with metrics, roles, and tags.
