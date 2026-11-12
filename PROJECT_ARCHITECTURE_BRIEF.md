# PROJECT ARCHITECTURE BRIEF: ORBIT BROADCAST NETWORK

> **Document Purpose**: Complete architectural, creative, and technical brief summarizing the network vision, toolchain, and operational model. Use this document as the prompt/context for architectural agents to propose the optimal repository and project structure.

---

## 1. Executive Summary & Core Mission

We are building a **100% code-driven television broadcast network** for YouTube.

- **Creative Partner Persona**: **ORBIT** (Creative Technologist, Procedural Artist, and Cinematic Motion Director).
- **Core Thesis**: *"We don't record reality. We render imagination."*
- **The Visual Rule**: Zero generic stock footage. Zero mushy AI video generation (no Sora, Runway, Kling, or Midjourney video artifacts). Every visual, character, diagram, camera sweep, and title card is generated deterministically through code, mathematics, shaders, and procedural engines.
- **The Creative Angle**: **We are Cinematic Storytellers, NOT academic lecturers.**
  - Unlike *3Blue1Brown* (which focuses on instructional math lessons and blackboard proofs), we operate in the tradition of *Kurzgesagt*, *Lemmino*, *Melodysheep*, *Aperture*, and *David Fincher*.
  - We tell high-stakes stories (system crashes, historical turning points, cosmic dread, secret algorithms, human ambition, economic heists).
  - Code is our Hollywood CGI studio: procedural shaders, code-drawn characters, and mathematical camera choreography exist to elevate narrative tension.
- **Audience Playbook**: We are eccentric from conventional YouTube in our visual medium, but we ruthlessly employ YouTube's retention playbook (arresting 3-second hook, visual state change every 3–5 seconds, escalating stakes, curiosity gaps).

---

## 2. Programming Grid: The 3 Universal Shows

To sustain daily/alternate-day video releases without creative burnout, we designed **3 universal genre-agnostic containers** (+ 1 weekly devlog). Literally any topic fits into one of these three:

```
                    ┌───────────────────────────────┐
                    │     ORBIT BROADCAST GRID      │
                    └───────────────┬───────────────┘
                                    │
    ┌───────────────────────────────┼───────────────────────────────┐
    ▼                               ▼                               ▼
[ MON / THU ]                   [ TUE / FRI ]                   [ WED / SAT ]
SHOW 1: THE BLUEPRINT           SHOW 2: THE SIMULATION          SHOW 3: THE PARADOX
How Reality Works               What If / Extreme Cases         Why Reality Breaks
(Deconstructed Systems)         (Stress-Tests & Swarms)         (Counter-Intuitive Truths)
    │                               │                               │
    └───────────────────────────────┼───────────────────────────────┘
                                    │
                                    ▼
                              [ SUNDAY ]
                         THE NETWORK REEL
                      (Behind The Code Devlog)
```

1. **Show 1: THE BLUEPRINT** (How Systems Work)
   - Scope: Machinery, financial rails, biological systems, digital infrastructure, network packets.
   - Aesthetic: Isometric grids, exploded CAD-style wireframe schematics, dimensional telemetry, technical callouts.
2. **Show 2: THE SIMULATION** (What If & Extreme Edge Cases)
   - Scope: Catastrophes, hypothetical realities, societal collapse, planetary physics, scale comparisons.
   - Aesthetic: 50,000+ particle fields, agent swarms, stress-heatmaps, shockwaves, dynamic camera chase.
3. **Show 3: THE PARADOX** (Why Reality Breaks)
   - Scope: Mathematical enigmas, game theory, optical illusions, cognitive glitches, hidden truths.
   - Aesthetic: High-contrast film noir, geometric optical shifts, branching decision trees, dual-tone lighting.
4. **Sunday Broadcast: THE NETWORK REEL** (Behind The Code)
   - Scope: Transparent breakdown of the GLSL shaders, Remotion components, math formulas, and rendering bugs from that week's episodes.

---

## 3. Distribution & Format Strategy

- **Long-Form Sweet Spot**: 8:30 to 11:30 minutes (qualifies for mid-roll monetization, maximizes YouTube watch time, holds 50–65% retention).
- **The Programmatic 16:9 ➔ 9:16 Pipeline**:
  - Because scenes are defined in code, we do NOT crop or letterbox.
  - The same scene component accepts viewport parameters (`1920x1080` vs `1080x1920`), re-centering cameras and scaling typography dynamically.
  - Every long-form episode yields 3–4 standalone 45-second Shorts for top-of-funnel algorithmic discovery.
- **Thumbnails**: 100% programmatic rendering of hero frames directly from Remotion code at `1280x720` with high mobile contrast.

---

## 4. Installed Local Tech Stack & Engines

The local machine has the following tools and engines ready for integration:

| Layer | Technology | Status / Path | Purpose |
| :--- | :--- | :--- | :--- |
| **Master Orchestrator** | **Remotion** (React 19, TypeScript) | Installed (`src/`, `remotion.config.ts`) | Frame-by-frame deterministic rendering, timeline sequencing, responsive viewports. |
| **Character & Illustration** | **Anidoodle** | Installed (`.agents/skills/anidoodle`) | 100% code-drawn 2D characters, whiteboard timelapses, organic illustrations (zero external PNG/JPG). |
| **Aesthetic Color Harmony** | **Sanzo Wada Colorist** | Installed (`.agents/skills/sanzo-wada-colorist`) | 348 deterministic historical palettes from Sanzo Wada (1933), seasonal themes, WCAG contrast verification. |
| **3D & Procedural Geometry** | **Three.js / React Three Fiber / WebGL** | WebGL ready | Gravitational orbits, volumetric point clouds, rotating tesseracts, GLSL shaders. |
| **Autonomous 3D Assets** | **Blender (bpy)** | Installed (`/home/revenant/.local/bin/blender` + MCP) | Scripted 3D scene generation, physics simulations, camera fly-throughs. |
| **Autonomous NLE & Color** | **DaVinci Resolve Studio** | Installed (`/opt/davinci-resolve` with Python API `fusionscript.so`) | Automated timeline assembly, Fairlight audio mastering, studio film LUTs and color grading via Python. |
| **Local Video Editing** | **Tesseract & Tesseract Motion** | Installed (`Tesseract/`, `tesseract-cli/`) | Local native timeline and motion graphics editing. |
| **Headless Video Processing**| **FFmpeg & ffprobe** | Installed (`/usr/bin/ffmpeg`) | Headless splicing, audio normalization, format conversion. |
| **Knowledge Base** | **AppFlowy** | Connected via MCP (`📺 ORBIT BROADCAST NETWORK`) | Shared notes, research tables, and decision logs. |

---

## 5. Architectural Requirements for the New Project Structure

We need a clean, scalable, and modular project structure that can support:

1. **Multi-Show Scalability**: Clean separation between `The Blueprint`, `The Simulation`, and `The Paradox`, while sharing network branding, bumpers, typography, and math/color utilities.
2. **Reusable Procedural Assets & Components**:
   - Shared HUD telemetry (clocks, tickers, coordinate grids, callouts).
   - Anidoodle character engines.
   - Three.js canvas rigs and reusable GLSL shaders.
   - Sanzo Wada color palette query integration.
3. **Automated Pipeline CLI**:
   - Scripts to scaffold new episodes: `npm run episode:new --show=blueprint --id=001`
   - Scripts to render dual formats: `npm run render:longform` and `npm run render:shorts`
   - Scripts to generate thumbnails: `npm run render:thumbnail`
   - Optional DaVinci Resolve automated timeline assembly script.
4. **Content & Asset Management**:
   - Organized storage for episode voiceovers, sound stems (SFX, ambient synth beds), scripts, and metadata.
   - Clean separation between ephemeral render outputs (`out/`) and permanent master assets.

---

## 6. Request for the Architectural Agent

Please review this brief and recommend:
1. **The Ideal Directory & File Tree**: Full layout for `src/`, `scripts/`, `content/`, `assets/`, etc.
2. **Component & Module Hierarchy**: How shared visual engines (Three.js, Canvas, Anidoodle, Shaders) plug into episode scenes.
3. **Data & Config Schema**: How an episode's script, timing, voiceover cues, and palette ID are defined in code (e.g. `episode.config.ts` or JSON).
4. **CLI / Build Pipeline**: The recommended scripts in `package.json` to orchestrate creation, preview, and rendering.
