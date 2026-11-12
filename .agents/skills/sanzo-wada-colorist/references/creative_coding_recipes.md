# Creative Coding Recipes with Sanzo Wada Palettes
## Guidelines for Remotion, Three.js, p5.js, and GLSL in ORBIT

---

## 1. Remotion Video Composition Recipe

When creating motion graphic explainers or coded scenes in Remotion:

```tsx
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import { WadaTheme_164 } from './wada_theme';

export const CodedScene: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: WadaTheme_164.canvas }}>
      <div style={{ opacity, color: WadaTheme_164.primary, fontFamily: 'monospace' }}>
        <h1>ALGORITHMIC OPTIMIZATION</h1>
      </div>
      {/* Particle Accent Component */}
      <div style={{ backgroundColor: WadaTheme_164.accent, width: 12, height: 12, borderRadius: '50%' }} />
    </AbsoluteFill>
  );
};
```

---

## 2. Three.js / React Three Fiber Particle Shader

In GLSL fragment shaders, avoid raw RGB numbers. Pass normalized Wada uniforms:

```glsl
uniform vec3 uCanvas;    // Background fog / void
uniform vec3 uPrimary;   // Core geometry / wireframe
uniform vec3 uAccent;    // Energy glow / active pulses

varying float vEnergy;

void main() {
  vec3 col = mix(uPrimary, uAccent, vEnergy);
  gl_FragColor = vec4(col, 1.0);
}
```

---

## 3. p5.js Generative Art / Flow Fields

```javascript
// Flow field with Sanzo Wada Combination #348 (Quad)
const WADA_348 = {
  bg: '#253122',       // Deep Slate Olive (Dark Canvas)
  stream: '#437742',   // Cossack Green (Mid field)
  highlight: '#c1c494',// Olive Buff (High luminance paths)
  spark: '#501345'     // Cotinga Purple (Rare burst points)
};

function setup() {
  createCanvas(1920, 1080);
  background(WADA_348.bg);
}

function drawParticle(p) {
  stroke(p.isSpawning ? WADA_348.spark : WADA_348.highlight);
  strokeWeight(p.size);
  point(p.x, p.y);
}
```

---

## 4. The YouTube Thumbnail Rule (High Contrast)

For YouTube thumbnails generated with code:
1. Filter for combinations with **WCAG AAA Compliance (`max_contrast >= 7.0`)**.
2. Restrict to **Duos (2-color)** or **Trios (3-color)** to prevent visual clutter at small mobile preview sizes.
3. Use the accent color at scale (e.g. bold 120px headline or glowing central geometry).
