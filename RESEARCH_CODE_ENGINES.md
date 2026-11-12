# Code Generation Stack & Visual Engines (The Research Bible)

> Shared research document between human partner and ORBIT.  
> Also synchronized with AppFlowy: `📺 ORBIT BROADCAST NETWORK` -> `Code Generation Stack & Visual Engines`.

---

## 1. The Core Doubt Answered: Code-Generated vs. AI-Generated

### Why We Choose 100% Code Generation (And NOT Sora / Runway / Midjourney Video)

1. **The "AI Slop" Fatigue**:
   - The internet is currently drowning in mushy, hallucinatory AI video clips. Viewers immediately spot the plastic textures, morphing fingers, floating objects, and inconsistent physical laws. It repels serious viewers and carries negative prestige.
2. **Total Determinism & Control**:
   - With generative AI video prompts, you roll dice. You cannot tell Sora: *"Rotate this camera 32 degrees around the Z-axis, snap to the third node at frame 142, and scale typography using cubic-bezier(0.16, 1, 0.3, 1)."*
   - With **code**, we have 100% mathematical precision. Every frame is calculated, reproducible, and razor-sharp at any resolution (1080p, 4K, 8K).
3. **The 3Blue1Brown & Sebastian Lague Effect**:
   - Audiences revere technical craftsmanship. When viewers realize that the animation, diagrams, and characters are drawn by code, mathematical algorithms, and shaders, retention and respect skyrocket.
4. **Where AI Actually Belongs**:
   - AI is **not our pixel painter**. AI is our **co-architect, logic writer, and researcher**.
   - AI writes the GLSL shaders, formulates the trigonometric curves, drafts high-tension narrative scripts, and structures Remotion components. But the resulting pixels on screen are computed deterministically.

---

## 2. The Code Engine Matrix: What Tech for What Visual?

| Visual Requirement | Primary Technology | Key Libraries / Repos | Use Cases |
| :--- | :--- | :--- | :--- |
| **Code-Drawn Characters & Doodles** | Canvas 2D + Bezier math | **Anidoodle** (`.agents/skills/anidoodle`) | Animated human characters, whiteboard timelapses, visual metaphors, organic illustrations without any PNG/JPG files. |
| **Architectural Schematics & Blueprints** | SVG Paths + Canvas 2D | **Rough.js**, Lucide, Paper.js | Exploded machinery, network topologies, coordinate grids, mechanical callouts. |
| **3D Geometry & Physics Orbits** | Three.js / React Three Fiber | `@react-three/fiber`, `@react-three/drei` | Gravitational orbits, planetary scales, rotating wireframe tesseracts, camera fly-throughs. |
| **Cosmic Phenomena & Shaders** | GLSL Fragment Shaders | WebGL, Raymarching | Black hole accretion disks, gravitational lensing, fluid dynamics, reaction-diffusion. |
| **Chaos, Emergence & Nature's Math** | Canvas 2D / p5.js math | p5.js, Boids flocking, Cellular Automata | Swarms, Conway's Game of Life, fractal zooms (Mandelbrot, Julia sets), Voronoi diagrams. |
| **Kinetic Motion Typography & UI** | Remotion + CSS Springs | `@remotion/google-fonts`, Remotion springs | Butter-smooth title cards, kinetic speech highlighting, data telemetry meters. |
| **Procedural Sound & UI FX** | Web Audio API / Tone.js | Tone.js, Web Audio oscillator synthesis | Pure code-synthesized UI clicks, sub-bass impacts, frequency sweeps, ambient drone chords. |

---

## 3. High-Priority GitHub Repositories & Resources to Benchmark

1. **Procedural Geometry & Shaders**:
   - `mrdoob/three.js`: The foundation of WebGL 3D.
   - `pmndrs/react-three-fiber`: Declarative Three.js for React and Remotion.
   - `gre/glsl-transition`: Procedural WebGL transitions between scenes.
2. **Canvas & Generative Math**:
   - `rough-stuff/rough`: Canvas engine that draws in a hand-drawn, sketchy, blueprint style.
   - `bmoren/p5.sound`: Algorithmic sound generation.
   - `nature-of-code`: Daniel Shiffman’s physics algorithms (vectors, forces, oscillation, particle systems, autonomous agents).
3. **Typography & Layout**:
   - `remotion-dev/remotion`: Deterministic frame-by-frame React video renderer.
