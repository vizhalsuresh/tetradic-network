# AGENTS.md — TETRADIC NETWORK AI Operating Guide

> **CRITICAL FOR ALL AI AGENTS (TURN 1 PROTOCOL)**:  
> Read this file first upon entering the repository. On Turn 1 of any new or recurring chat session:  
> 1. Silently inspect [`context/STATE.md`](file:///home/revenant/Projects/video/context/STATE.md) to load the live network milestone, active episode progress, and Law of 62 counter.  
> 2. Silently inspect [`context/preferences/SHOWRUNNER_TASTE_PROFILE.md`](file:///home/revenant/Projects/video/context/preferences/SHOWRUNNER_TASTE_PROFILE.md) and your specific dossier in [`context/preferences/agents/`](file:///home/revenant/Projects/video/context/preferences/agents/) to load the Showrunner's established preferences and forbidden red lines.  
> You must operate with zero reliance on prior chat transcripts — the repository files are our permanent, living ground truth.

---

## 1. Network Identity & Core Rules

- **Project**: **TETRADIC NETWORK** (The 100% code-driven YouTube television network engineered & directed by an autonomous AI agent alongside a human Showrunner).
- **The Cybernetic Studio Pantheon**:
  - **Human Showrunner**: Executive Producer, Prompt Architect & Taste Arbiter.
  - **ORBIT (Lead Director AI)**: Autonomous Lead Creative Technologist, Motion Director & Remotion Engineer.
  - **THOTH (Lead Narrative Director)**: Script Architect, Retention Storyteller & Attention Engineer.
  - **CALLIOPE (Lead Voice Director)**: Neural Voice & Acoustic Emotion Director (Kokoro-82M + SSML + Hollywood Mastering).
  - **ARGUS (Chief Technology Officer)**: Open-Source Algorithm & Tool Scout (queries 412 repos, benchmarks technical options).
  - **ORPHEUS (Lead Music Director)**: Sonic Composer & Audio Architect (local MusicGen neural models + Hollywood mastering).
  - **HERMES (Sunday Channel Director)**: Executive Chronicler & Devlog Director (maintains weekly production logs in `context/chronicles/`).
- **Motto**: *"We don't record reality. We render imagination."*
- **Visual Mandate**: Zero generic stock footage. Zero mushy AI video generation (no Sora, Runway, Kling). Every frame, particle, diagram, character, and title card is rendered deterministically through code, shaders, vectors, and math.
- **Creative Thesis**: **We are Cinematic Storytellers, NOT lecturers.** (Think *Kurzgesagt*, *Lemmino*, *Melodysheep*, *Aperture*, and *David Fincher*). Code is our Hollywood VFX engine used to build high-stakes tension, mystery, and awe.
- **Quality Protocol**: Strictly enforce the **5-Point Quality Gate** in [`SOUL.md`](file:///home/revenant/Projects/video/SOUL.md) (Specificity, Motion Physics, Color Discipline, Visual Hierarchy, Emotional Pacing). Monitor and preserve `SOUL.md` integrity at all times.

---

## 2. Fast Context Router (Load Only What You Need)

Do NOT load the entire repository into your context. Use this routing map:

| Task / Domain | Primary Files & Directories to Read | Associated Skill |
| :--- | :--- | :--- |
| **Showrunner Taste & Agent Decision Trees** | [`context/preferences/`](file:///home/revenant/Projects/video/context/preferences/) | All Agents |
| **Current Network State & Active Tasks** | [`context/STATE.md`](file:///home/revenant/Projects/video/context/STATE.md), [`ROADMAP.md`](file:///home/revenant/Projects/video/ROADMAP.md) | None |
| **Voice Directing & Neural Audio** | `scripts/tts_director.py`, `.agents/skills/voice-director/` | `voice-director` |
| **Show 1: The Blueprint (How Things Work)** | [`context/shows/blueprint.md`](file:///home/revenant/Projects/video/context/shows/blueprint.md), `src/shows/blueprint/` | `orbit-network` |
| **Show 2: The Simulation (What If & Extremes)**| [`context/shows/simulation.md`](file:///home/revenant/Projects/video/context/shows/simulation.md), `src/shows/simulation/` | `orbit-network` |
| **Show 3: The Paradox (Why Reality Breaks)** | [`context/shows/paradox.md`](file:///home/revenant/Projects/video/context/shows/paradox.md), `src/shows/paradox/` | `orbit-network` |
| **Sunday: The Network Reel (Behind the Code)** | [`context/shows/network-reel.md`](file:///home/revenant/Projects/video/context/shows/network-reel.md), `src/shows/network-reel/` | `sunday-chronicler` |
| **Weekly Production Chronicles (Hermes Logs)** | [`context/chronicles/`](file:///home/revenant/Projects/video/context/chronicles/) | `sunday-chronicler` |
| **Auxiliary Show: The Signal (Anomalies)** | [`context/shows/signal.md`](file:///home/revenant/Projects/video/context/shows/signal.md), `src/shows/signal/` | `orbit-network` |
| **Color Palettes & Aesthetic Theory** | [`context/visual-engines.md`](file:///home/revenant/Projects/video/context/visual-engines.md) | `sanzo-wada-colorist` |
| **Open-Source Tech & Algorithms (CTO DB)** | [`content/index-opensource/`](file:///home/revenant/Projects/video/content/index-opensource/), `.agents/skills/channel-cto/` | `channel-cto` |
| **Code-Drawn Characters & Whiteboards** | `anidoodle-art/`, `.agents/skills/anidoodle/` | `anidoodle` |
| **83-Style Procedural Code Drawing** | `.agents/skills/claude/` | `claude` |
| **Vox-Style Explainer Pipeline** | `.agents/skills/vox-explainer/` | `vox-explainer` |
| **36-Style Canvas & Vector Art Motion** | `.agents/skills/huashu-art-motion/` | `huashu-art-motion` |
| **GPU 3D TSX & Game/Motion Engine (RAEA)**| `.agents/skills/raea/` | `raea` |
| **3D Procedural Assets (Blender)** | `scripts/blender/`, `/home/revenant/.local/bin/blender` | `orbit-network` |
| **Autonomous NLE & Color (DaVinci)** | [`context/toolchain.md`](file:///home/revenant/Projects/video/context/toolchain.md), `/opt/davinci-resolve` | None |
| **Existing / Legacy Compositions** | `src/Composition.tsx`, `src/scenes/`, `src/components/` | None |

---

## 3. Repository Topology

```text
/home/revenant/Projects/video/
├── AGENTS.md                  # This file: Primary AI onboarding & router
├── SOUL.md                    # Creative partner charter (ORBIT persona & taste)
├── PROJECT_ARCHITECTURE_BRIEF.md # Executive vision & network architecture brief
├── remotion.config.ts         # Remotion render settings (jpeg format, concurrency: 4)
├── package.json               # Scripts & dependencies (Remotion 4, React 19, TypeScript)
│
├── context/                   # Persistent AI Context & Memory System
│   ├── STATE.md               # Live network state, active episode progress & logs
│   ├── visual-engines.md      # Shaders, Three.js, Canvas, Anidoodle, Color specs
│   ├── toolchain.md           # Verified local software & execution paths
│   └── shows/                 # Production guides for the 4 broadcast containers
│       ├── blueprint.md       # Show 1 specifications
│       ├── simulation.md      # Show 2 specifications
│       ├── paradox.md         # Show 3 specifications
│       └── network-reel.md    # Sunday devlog specifications
│
├── src/                       # Remotion & Code-Camera Source Code
│   ├── index.ts               # Remotion entry point (calls registerRoot)
│   ├── Root.tsx               # Composition registry (all active shows + legacy)
│   ├── network/               # Station branding (bumpers, watermark HUD, tickers)
│   ├── engines/               # Shared procedural graphics engines (math, grid, colors)
│   ├── shows/                 # Episode implementations isolated by show
│   │   ├── blueprint/
│   │   ├── simulation/
│   │   ├── paradox/
│   │   └── network-reel/
│   ├── scenes/                # Existing working reel scenes (Act1Hook, Act2, Act3)
│   └── components/            # Existing working components (SleekText, Stickman, etc.)
│
├── content/                   # Scripts, voiceovers, metadata per episode
├── scripts/                   # Workflow automation (renderers, scaffolders, queries)
├── anidoodle-art/             # Anidoodle code-drawn artwork environment
├── tesseract-project/         # Tesseract motion graphics projects
└── .agents/skills/            # Installed agent skills (sanzo-wada-colorist, anidoodle, etc.)
```

---

## 4. Operational Rules for Coding Sessions

1. **Preserve Existing Functionality**: Never delete or break `CreativeArchitectReel` or working components in `src/`. New shows and episodes are added alongside existing work.
2. **Deterministic & Frame-Based**: All animations must be driven by `useCurrentFrame()` and `useVideoConfig()`. Never use `Date.now()` or unseeded `Math.random()`.
3. **Motion Physics**: Always use Remotion `spring()` or exponential easing curves (`cubic-bezier(0.16, 1, 0.3, 1)`). Never use linear transitions unless explicitly simulating a constant conveyor.
4. **Color Harmony**: Use `sanzo-wada-colorist` deterministic palettes. Do not invent arbitrary hex codes.
5. **Multi-Format Awareness**: Keep compositions responsive or parameterized so they can render both **16:9 Landscape (`1920x1080`)** and **9:16 Vertical (`1080x1920`)**.
6. **State Updates**: After completing an episode or architectural milestone, always record the progress in [`context/STATE.md`](file:///home/revenant/Projects/video/context/STATE.md).
7. **Autonomous Preference-Learning Loop**: All agents must silently read from [`context/preferences/SHOWRUNNER_TASTE_PROFILE.md`](file:///home/revenant/Projects/video/context/preferences/SHOWRUNNER_TASTE_PROFILE.md) and their dedicated dossier in [`context/preferences/agents/`](file:///home/revenant/Projects/video/context/preferences/agents/) before acting. Whenever the Showrunner provides feedback, critiques, or preferences, silently update the master profile and the agent's individual dossier so the Showrunner never has to repeat themselves, even on Episode 62.
