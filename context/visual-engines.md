# Procedural Visual Engines & Directing Rules

> **Core Philosophy**: Zero stock footage. Zero generic AI video slop.  
> Every visual is engineered through mathematics, code-drawn canvas, shaders, and procedural typography.

---

## 1. Visual Directing Standards

### The 3–5 Second Visual Reset Rule
YouTube retention collapses when a frame remains static for more than 4 seconds:
- **Every 3 seconds**: At least one visual state change must occur (camera zoom, parameter rotation, particle acceleration, data ticker increment, or typographic highlight).
- **Camera Choreography**: Use smooth cubic expo curves or spring physics. Never use linear interpolation for camera sweeps.

### Spring Motion vs. Linear Motion
```typescript
import { spring, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

// Snappy mechanical lock-in (ideal for HUD telemetry and coordinate lines)
const snapProgress = spring({
  frame: frame - delay,
  fps,
  config: { damping: 14, stiffness: 150, mass: 0.8 },
});

// Smooth cinematic deceleration (ideal for camera drift and scene transitions)
const EASE_OUT_EXPO = [0.16, 1, 0.3, 1];
```

---

## 2. Color Direction: Sanzo Wada System

Always use the **`sanzo-wada-colorist`** skill rather than guessing hex codes:
- **Origin**: Sanzo Wada's 1933 *Haishoku Sōkan* (348 historical Japanese color combinations).
- **Rule**: Minimum WCAG contrast ratio of **7.0:1** for all typography and mobile Short viewports.

### How to Query & Apply in Code
Run:
```bash
python3 .agents/skills/sanzo-wada-colorist/scripts/query_palette.py --id 164 --format remotion
```

Example in Remotion scene:
```typescript
// Sanzo Wada Combination #164 (Deep Navy + Cyan Accent + Off-white)
export const PALETTE = {
  background: "#080E1A", // Deep Navy
  surface: "#121C2F",
  accent: "#00F0FF",     // Technical Cyan
  textPrimary: "#F0F4F8",
  textMuted: "#6B7C96",
  grid: "rgba(0, 240, 255, 0.08)",
};
```

---

## 3. Code-Drawn Characters & Metaphors (Anidoodle)

When a human character, emotion, or hand-drawn metaphor is required:
- Use **Anidoodle** (`.agents/skills/anidoodle` & `anidoodle-art/`).
- Characters are drawn via pure Canvas 2D Bezier curves and line functions.
- Timelapses and stroke animations draw themselves in code with zero external raster images.

---

## 4. Multi-Format Viewport Architecture (16:9 & 9:16)

Every scene component must support responsive props:

```typescript
export interface SceneProps {
  aspectRatio: '16:9' | '9:16';
  width: number;
  height: number;
}

export const IsometricSystem: React.FC<SceneProps> = ({ aspectRatio, width, height }) => {
  const isVertical = aspectRatio === '9:16';
  // Adjust camera distance and typography scale dynamically
  const cameraZoom = isVertical ? 0.75 : 1.0;
  const fontSize = isVertical ? 48 : 32;
  // ...
};
```

---

## 5. Visual Engine Matrix & Curated GitHub Signals Library

Ingested from our **Instagram Knowledge Vault & GitHub Signals pipeline** (`@githubsignals`, `@index.opensource`), these open-source tools and deterministic engines power ORBIT's 100% code-driven broadcast standard:

| Visual Requirement | Technology / Engine | Top Open-Source Repos & Tools | ORBIT Show & Role | Why This Stack |
| :--- | :--- | :--- | :--- | :--- |
| **Procedural Landscapes & Mountains** | Canvas 2D + Algorithmic Shading | [`LingDong-/shan-shui-inf`](https://github.com/LingDong-/shan-shui-inf) | *The Paradox* & *The Blueprint* | Infinite traditional Chinese ink-wash landscapes rendered purely via mathematical strokes and noise; zero raster bitmaps. |
| **Cosmic Fluids, Quantum Gas & Energy** | WebGL / GLSL Shaders (Navier-Stokes) | [`PavelDoGreat/WebGL-Fluid-Simulation`](https://github.com/PavelDoGreat/WebGL-Fluid-Simulation) | *The Paradox* (Quantum / Relativity) | Real-time GPU Navier-Stokes fluid solver with advection, vorticity confinement, pressure Poisson solving, and bloom. |
| **2D Character Rigging & Avatars** | 2D Mesh Deformation & Bone Rigging | [`shinshin86/mesh-avatar-studio`](https://github.com/shinshin86/mesh-avatar-studio) | *Sunday Devlog* & *The Blueprint* | Transforms static illustrations into living characters (blinking, talking, hair sway) with local coordinate point editing. |
| **Planetary Terrain & Fluvial Erosion** | Heightfields + Hydraulic/Thermal Erosion | [`dandrino/terrain-erosion-3-ways`](https://github.com/dandrino/terrain-erosion-3-ways) | *The Simulation* (Planetary Scales) | Deterministic droplet erosion algorithms sculpt canyons, river deltas, and realistic geological time-lapses. |
| **Stable Real-Time Physics & Soft Bodies** | Position-Based Dynamics (PBD) | [`matthias-research/pages`](https://github.com/matthias-research/pages) | *The Blueprint* & *The Simulation* | Unconditionally stable cloth, rope, soft body, and collision simulations without Euler integrator blowup. |
| **Vector CAD Schematics & Cross-Sections** | 3D-to-2D Vector Projection & Hidden-Line Removal | [`fogleman/ln`](https://github.com/fogleman/ln), [`abey79/vpype`](https://github.com/abey79/vpype) | *The Blueprint* (Engineering CAD) | Projects 3D CSG solids and parametric meshes into crisp 2D SVG paths with mathematically exact hidden-line removal. |
| **Artificial Life & Emergent Biology** | N-Body Particle Interaction Matrix | [`hunar4321/particle-life`](https://github.com/hunar4321/particle-life) | *The Simulation* (Extreme Biology) | Emergent primordial cellular life, mitosis, and predator-prey dynamics arising from attraction/repulsion coefficients. |
| **Organic Shading, Pencil & Watercolor** | p5.js + Kubelka-Munk Spectral Color | [`acamposuribe/p5.brush`](https://github.com/acamposuribe/p5.brush), [`rvanwijnen/spectral.js`](https://github.com/rvanwijnen/spectral.js) | *The Paradox* & *Anidoodle Art* | Replaces digital RGB mud with physical pigment blending, realistic bristle pressure, pencil grain, and watercolor bleed. |
| **Geometric Approximation & Morphing** | Hill Climbing / Simulated Annealing | [`fogleman/primitive`](https://github.com/fogleman/primitive) | *The Paradox* (Deconstructions) | Reconstructs reference imagery using N geometric primitives (polygons, ellipses, beziers) for deterministic keyframe transitions. |
| **Origami & Deployable Space Structures** | Dynamic Strain Kinematics / Three.js | [`amandaghassaei/OrigamiSimulator`](https://github.com/amandaghassaei/OrigamiSimulator) | *The Blueprint* (Aerospace Mechanics) | Real-time folding kinematics and origami tessellations for deployable satellite solar arrays and robotic linkages. |
| **Volumetric Clouds & Cosmic Nebulae** | 3D Worley-Perlin Noise & Raymarching | [`sebh/TileableVolumeNoise`](https://github.com/sebh/TileableVolumeNoise) | *The Paradox* & *The Simulation* | Seamless 3D volume noise textures for raymarching planetary atmospheres, nebulae, and stellar accretion disks without tiling seams. |
| **String Art & Network Topologies** | Greedy Path Optimization / Canvas 2D | [`piellardj/image-stylization-threading`](https://github.com/piellardj/image-stylization-threading) | *The Paradox* (Philosophical Topologies) | Synthesizes complex images out of thousands of continuous straight threads stretched between perimeter pins. |
| **Autonomous Video QC & Cut Pacing** | Computer Vision Feedback Loop | [`yeje-cpu/seecut`](https://github.com/yeje-cpu/seecut) | *Sunday Network Reel* | Self-reflective video editor reviewing output cuts for pacing defects, automatically optimizing timing and B-roll. |
| **Agent-Driven Pixel Art & Sprites** | Lua Scripting / Aseprite Socket API | [`with-pebbly/aseprite-ai-artist`](https://github.com/with-pebbly/aseprite-ai-artist) | *Sunday Devlog* & *The Blueprint* | Enables AI agents to draw and animate pixel art directly inside Aseprite with layer isolation and palette enforcement. |
| **Procedural Biological Illustration** | Canvas 2D + Bezier Spine Curves | [`LingDong-/fishdraw`](https://github.com/LingDong-/fishdraw) | *The Simulation* | Mathematical generation of organic marine life and spine curvature with calligraphic cross-hatching. |
| **Rigid Body Mechanics & Clockwork** | 2D Physics Engine (wasm/C++) | [`erincatto/box2d`](https://github.com/erincatto/box2d) | *The Blueprint* (Clocks & Levers) | Mechanical gear trains, escapements, pendulums, and structural collapses with exact restitution and friction. |
| **Curated WebGL 3D Hero Scenes** | React Three Fiber + Drei | [`3ui.com`](https://3ui.com), [`mrdoob/three.js`](https://github.com/mrdoob/three.js) | All Shows (Opening Bumpers) | 160+ interactive 3D WebGL hero environments, orbiters, volumetric lighting, and cybernetic HUD meshes. |
| **Scientific Document & Formula Ingestion** | LayoutLM + Multi-Modal Parsing | [`opendatalab/MinerU`](https://github.com/opendatalab/MinerU) | All Shows (Script & Paper Research) | Extracts complex academic whitepapers, LaTeX formulas, and schematics into structured markdown for procedural re-rendering. |
| **Hand-Drawn Doodle & Explainer Metaphors** | Canvas 2D Bezier Curves | [`.agents/skills/anidoodle`](file:///home/revenant/Projects/video/.agents/skills/anidoodle) | *The Paradox* & *The Blueprint* | Pure code-drawn characters, emotional gestures, blackboard diagrams, and stroke timelapses without raster art. |
| **Color Harmony & Palette Verification** | 348 Tokyo Historical Palettes (1933) | [`.agents/skills/sanzo-wada-colorist`](file:///home/revenant/Projects/video/.agents/skills/sanzo-wada-colorist) | All Shows (Network Visual Styling) | Historical Japanese color theory guaranteeing 7.0:1 WCAG contrast and deterministic palettes for Remotion and shaders. |

