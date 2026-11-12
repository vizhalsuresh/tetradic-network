# SUNDAY FLAGSHIP: THE NETWORK REEL — Production Guide

> **Premise**: Transparent behind-the-scenes engineering devlogs. The cybernetic pantheon breaks down the week's shaders, math, code cameras, and breakthroughs.  
> **Broadcast Slot**: Every Sunday (Flagship)  
> **Director & Host**: **HERMES** (The Great Chronicler)

---

## 1. Show Narrative Arc (The Pantheon Round-Table)

1. **The Week in Retrospect (0:00 - 0:45)**: HERMES opens the broadcast, recapping the week's releases across The Blueprint, The Simulation, and The Paradox.
2. **ORBIT's Code & Shader Dissection (0:45 - 2:30)**: ORBIT breaks down the Remotion spring mechanics, Three.js geometry, and GLSL fragment shaders.
3. **ARGUS's Algorithmic Deep Dive (2:30 - 4:00)**: ARGUS reveals the mathematical papers and open-source repos (`index_opensource.db`) that powered the visuals.
4. **THOTH & CALLIOPE's Narrative & Acoustic Craft (4:00 - 5:30)**: THOTH breaks down the retention mechanics; CALLIOPE demonstrates neural voice modulation; ORPHEUS breaks down score composition.
5. **The Showrunner's Log & Next Week's Blueprint (5:30 - End)**: The weekly harvest tally against the **Law of 62** and preview of upcoming transmissions.

---

## 2. Multi-Voice Casting Roster

| Agent | Voice ID | Vocal Tone | Role in Show |
| :--- | :--- | :--- | :--- |
| **HERMES** | `bf_emma` | Authoritative, BBC documentary | Show Host & Production Chronicler |
| **ORBIT** | `am_adam` | Energetic, technical | Lead Motion & Shader Engineer |
| **THOTH** | `am_onyx` | Deep, dramatic gravitas | Narrative Architect |
| **CALLIOPE** | `af_sarah` | Warm, emotive, lyrical | Neural Voice Director |
| **ARGUS** | `am_eric` | Sharp, calculated polymath | Open-Source CTO |
| **ORPHEUS** | `am_michael` | Expressive, melodic | Lead Music Director |

---

## 3. Directory Layout for Episodes

```text
src/shows/network-reel/
├── components/          # Shared devlog components
│   ├── CodeInspector.tsx
│   ├── ParameterScrubber.tsx
│   └── RenderProfiler.tsx
└── episodes/
    └── REEL001_StationIdent/
        ├── Episode.tsx
        ├── scenes/
        └── config.ts
```
