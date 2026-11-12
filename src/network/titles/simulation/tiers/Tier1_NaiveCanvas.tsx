import React, { useRef, useEffect } from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Audio,
  staticFile,
} from 'remotion';

/**
 * TIER 1: NAIVE CANVAS (The "Basic" Baseline - What We Are Banishing)
 * Characteristics:
 * - 2D canvas circles (ctx.arc)
 * - Basic trigonometric sine waves
 * - Flat unshaded particle dots
 * - Generic expanding ring shockwave
 * - Flat 2D layout without depth or field interaction
 */
export const Tier1_NaiveCanvas: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const isBam = frame >= 150;
  const shakeFrame = Math.max(0, frame - 150);

  const titleSpring = spring({
    frame: shakeFrame,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);
    const cx = width / 2;
    const cy = height / 2;

    // 1. Basic 2D Dashed Concentric Circles (Naive Grid)
    ctx.strokeStyle = '#4DD0E1';
    ctx.lineWidth = 1;
    ctx.setLineDash([6, 6]);
    for (let r = 80; r <= 480; r += 80) {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.setLineDash([]);

    // 2. Simple Particles in 2D Orbits
    const count = 400;
    for (let i = 0; i < count; i++) {
      const radius = 90 + (i * 1.1);
      const speed = 0.02 + (1.0 / Math.sqrt(radius)) * 0.4;
      const angle = (i * 0.25) + frame * speed;
      const px = cx + Math.cos(angle) * radius;
      const py = cy + Math.sin(angle) * (radius * 0.4);

      ctx.fillStyle = i % 2 === 0 ? '#F3B659' : '#00E5FF';
      ctx.beginPath();
      ctx.arc(px, py, 2, 0, Math.PI * 2);
      ctx.fill();
    }

    // 3. Black Hole Center Circle
    ctx.fillStyle = '#060A0D';
    ctx.beginPath();
    ctx.arc(cx, cy, 70, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#F3B659';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, 72, 0, Math.PI * 2);
    ctx.stroke();

    // 4. Generic BAM expanding circle
    if (isBam && shakeFrame <= 25) {
      const shockR = shakeFrame * 22;
      ctx.strokeStyle = `rgba(255, 87, 34, ${1 - shakeFrame / 25})`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(cx, cy, shockR, 0, Math.PI * 2);
      ctx.stroke();
    }
  }, [frame, width, height, isBam, shakeFrame]);

  return (
    <AbsoluteFill style={{ backgroundColor: '#0A0D10', fontFamily: 'monospace' }}>
      <Audio src={staticFile('audio/simulation_theme_hybrid_master.mp3')} startFrom={75} />
      <canvas ref={canvasRef} width={width} height={height} style={{ position: 'absolute', inset: 0 }} />

      {/* Tier Label Banner */}
      <div style={{ position: 'absolute', top: 40, left: 60, color: '#FF5722', fontSize: 18, fontWeight: 900 }}>
        [TIER 1: NAIVE CANVAS — BASIC 2D APPROXIMATION]
        <div style={{ fontSize: 13, color: '#888', marginTop: 4 }}>
          Standard ctx.arc circles, simple sine wave orbits, flat unshaded dots.
        </div>
      </div>

      {/* Title */}
      {isBam && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <h1 style={{
            fontSize: 90,
            color: '#F3B659',
            margin: 0,
            transform: `scale(${interpolate(titleSpring, [0, 1], [0.8, 1.0])})`,
          }}>
            THE SIMULATION
          </h1>
        </div>
      )}
    </AbsoluteFill>
  );
};
