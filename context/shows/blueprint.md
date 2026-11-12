# SHOW 1: THE BLUEPRINT — Production Guide

> **Premise**: Deconstruct the hidden machinery, architecture, and engineering of any system.  
> **Broadcast Slot**: Monday & Thursday

---

## 1. Show Narrative Arc (The Deconstruction Method)

1. **The Marvel (0:00 - 0:30)**: Introduce a system everyone takes for granted (undersea cables, GPS, credit card settlement, high-frequency trading).
2. **The Layered Anatomy (0:30 - 3:00)**: Peel back layer by layer using exploded isometric wireframes and technical callouts.
3. **The Point of Failure (3:00 - 6:00)**: What prevents this system from catastrophic collapse? (Redundancy, error correction, feedback loops).
4. **The Engineering Epiphany (6:00 - End)**: The philosophical beauty of human engineering.

---

## 2. Visual Identity & Code Components

- **Aesthetic**: Technical architectural CAD, precision wireframes, coordinate telemetry.
- **Palette Recommendation**: Sanzo Wada #164 or #210 (Deep technical indigo, crisp cyan, laser amber callouts).
- **Core Components**:
  - `IsometricGrid`: Moving 3D coordinate planes.
  - `TelemetryHUD`: Real-time metric counters, lat/long coords, memory clocks.
  - `ExplodedSchematic`: Vector parts separating along axial vectors.
  - `DimensionCallout`: Animated dimension lines with pixel distances.

---

## 3. Directory Layout for Episodes

```text
src/shows/blueprint/
├── components/          # Shared Blueprint visual engines
│   ├── IsometricGrid.tsx
│   ├── TelemetryHUD.tsx
│   └── VectorCallout.tsx
└── episodes/
    └── BP001_UnderseaInternet/
        ├── Episode.tsx  # Main composition
        ├── scenes/      # Scene breakdown
        └── config.ts    # Timing, voiceover audio path, data props
```
