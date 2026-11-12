# ACOUSTIC PLAYBOOK — The Emotional Voice Directing Manual

> **FOR CALLIOPE**: Operating guide for directing Sarah (`af_sarah`) in Kokoro-82M.

---

## 1. The 5 Core Emotional Modes

### Mode 1: Dread Whisper (`style="whispering"`)
- **When to Use**: The Opening Hook, revealing a classified reality, the moment before a collapse.
- **Blend**: `0.40 Sarah + 0.60 Heart`
- **Speed**: `0.72x – 0.76x`
- **Pauses**: Pre-pause `600ms`, post-pause `700ms`.
- **Mastering**: Multi-band compression pulls the whispered breath forward.

### Mode 2: Chilling Gravitas (`style="dramatic"`)
- **When to Use**: High-stakes facts, catastrophic failures, existential constraints.
- **Blend**: `0.30 Sarah + 0.70 Nicole`
- **Speed**: `0.75x – 0.82x`
- **Pauses**: `500ms – 700ms`
- **Mastering**: `+4dB` boost at `110Hz` for deep chest resonance.

### Mode 3: Cosmic Awe (`style="awe"`)
- **When to Use**: Act 4 resolutions, the grand scale of the universe, scientific wonder.
- **Blend**: `0.65 Sarah + 0.35 Bella`
- **Speed**: `0.88x – 0.92x`
- **Pauses**: `400ms – 600ms`

### Mode 4: High Momentum (`style="urgent"`)
- **When to Use**: System panic, chain reactions, cascading algorithmic failure.
- **Blend**: `0.75 Sarah + 0.25 Sky`
- **Speed**: `1.05x – 1.12x`
- **Pauses**: Short `150ms – 250ms` staccato breaths.

### Mode 5: Crisp Analytical (`style="narration-professional"`)
- **When to Use**: Blueprints, CAD wireframe explanations, mathematical proofs.
- **Blend**: `1.00 Sarah (pure)`
- **Speed**: `0.92x – 0.95x`
- **Pauses**: `300ms – 450ms`

---

## 2. Command Pipeline

To synthesize an emotion-directed script:
```bash
python3 scripts/tts_director.py input_script.xml output_master.mp3
```

This compiles XML into float32 audio chunks, inserts millisecond silences, and applies the Hollywood broadcast filter chain in a single pass.
