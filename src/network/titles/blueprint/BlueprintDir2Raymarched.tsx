import React, { useEffect, useRef } from 'react';
import {
  AbsoluteFill,
  Audio,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

export interface BlueprintTitleProps {
  aspectRatio?: '16:9' | '9:16';
  episodeCode?: string;
}

export const BlueprintDir2Raymarched: React.FC<BlueprintTitleProps> = ({
  aspectRatio = '16:9',
  episodeCode = 'BP-001',
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isVertical = aspectRatio === '9:16' || height > width;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const snapSpring = spring({
    frame: frame - 110,
    fps,
    config: { damping: 13, stiffness: 90, mass: 1.0 },
  });

  // Canvas Procedural Raymarched Wireframe Mesh Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    const cx = width / 2;
    const cy = height / 2;

    // Camera angles
    const angleX = (35 - snapSpring * 35) * (Math.PI / 180);
    const angleY = (-25 + (frame * 0.4) - snapSpring * (frame * 0.4 - 25)) * (Math.PI / 180);

    // 3D Box vertices
    const size = isVertical ? 220 : 320;
    const vertices = [
      [-size, -size * 0.4, -size * 0.4],
      [size, -size * 0.4, -size * 0.4],
      [size, size * 0.4, -size * 0.4],
      [-size, size * 0.4, -size * 0.4],
      [-size, -size * 0.4, size * 0.4],
      [size, -size * 0.4, size * 0.4],
      [size, size * 0.4, size * 0.4],
      [-size, size * 0.4, size * 0.4],
    ];

    // Project 3D to 2D
    const projected = vertices.map(([x, y, z]) => {
      // Rotate Y
      const x1 = x * Math.cos(angleY) + z * Math.sin(angleY);
      const z1 = -x * Math.sin(angleY) + z * Math.cos(angleY);
      // Rotate X
      const y2 = y * Math.cos(angleX) - z1 * Math.sin(angleX);
      const z2 = y * Math.sin(angleX) + z1 * Math.cos(angleX);

      const fov = 1200;
      const scale = fov / (fov + z2);
      return [cx + x1 * scale, cy + y2 * scale, z2];
    });

    // Draw 12 Volumetric Box Edges
    const edges = [
      [0, 1], [1, 2], [2, 3], [3, 0], // Back
      [4, 5], [5, 6], [6, 7], [7, 4], // Front
      [0, 4], [1, 5], [2, 6], [3, 7], // Struts
    ];

    ctx.lineWidth = 2.5;
    edges.forEach(([i, j]) => {
      const p1 = projected[i];
      const p2 = projected[j];
      const grad = ctx.createLinearGradient(p1[0], p1[1], p2[0], p2[1]);
      grad.addColorStop(0, '#E65A28');
      grad.addColorStop(0.5, '#F3B659');
      grad.addColorStop(1, '#4DD0E1');
      ctx.strokeStyle = grad;
      ctx.beginPath();
      ctx.moveTo(p1[0], p1[1]);
      ctx.lineTo(p2[0], p2[1]);
      ctx.stroke();
    });

    // Draw glowing vertices
    projected.forEach(([px, py]) => {
      ctx.fillStyle = '#E65A28';
      ctx.shadowColor = '#E65A28';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(px, py, 4, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.shadowBlur = 0;

    // Laser depth slice plane sweeping down
    const scanY = cy - 200 + ((frame * 3.5) % 400);
    ctx.strokeStyle = 'rgba(77, 208, 225, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(cx - 500, scanY);
    ctx.lineTo(cx + 500, scanY);
    ctx.stroke();
  }, [frame, width, height, isVertical, snapSpring]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#030E0A',
        backgroundImage: 'radial-gradient(circle at 50% 40%, #0B493A 0%, #020705 100%)',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: "'JetBrains Mono', monospace",
        color: '#F3B659',
        overflow: 'hidden',
      }}
    >
      <Audio src={staticFile('audio/blueprint_acoustic_ident.mp3')} />

      {/* Procedural Canvas Raymarched Wireframe Mesh */}
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
        }}
      />

      {/* Center Typography Overlay */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          textAlign: 'center',
          transform: `scale(${interpolate(snapSpring, [0, 1], [0.9, 1.0])})`,
        }}
      >
        <div
          style={{
            fontSize: isVertical ? 15 : 19,
            fontWeight: 800,
            letterSpacing: '0.38em',
            color: '#E65A28',
            marginBottom: 14,
            textTransform: 'uppercase',
          }}
        >
          // VOLUMETRIC RAYMARCHED CAD //
        </div>

        <h1
          style={{
            margin: 0,
            fontSize: isVertical ? 66 : 110,
            fontWeight: 900,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: '#F3B659',
            lineHeight: 1,
            textShadow: '0 0 40px rgba(243, 182, 89, 0.5), 0 0 80px rgba(230, 90, 40, 0.3)',
          }}
        >
          THE BLUEPRINT
        </h1>

        <div
          style={{
            marginTop: 22,
            fontSize: isVertical ? 13 : 16,
            fontWeight: 700,
            letterSpacing: '0.24em',
            color: 'rgba(224, 247, 250, 0.85)',
          }}
        >
          <span style={{ color: '#E65A28' }}>[{episodeCode}]</span>
          <span> WIREFRAME MESH // RAYMARCHED DEPTH</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
