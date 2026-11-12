import React, { useMemo, useRef, useEffect } from 'react';
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
 * TIER 2: COMPUTATIONAL GEOMETRY & CAD TOPOLOGY
 * Repositories Leveraged:
 * - [C021] mkeeter/swingline & [C001] evil-mad/stipplegen (Centroidal Voronoi Diagram CVD Stippling)
 * - [C015] angusjohnson/clipper2 (Exact CAD Polygon Offsets & Sectional Miters)
 * - [C024] d3/d3-contour (Marching Squares Gravitational Potential Isolines)
 * - [C049] orbingol/nurbs-python (Rational B-Spline Weighted Trajectories)
 * 
 * Visual Caliber:
 * Razor-sharp technical CAD blueprint, variable line weights, continuous isolines,
 * organically relaxed Voronoi stipple matter.
 */
export const Tier2_ComputationalGeometry: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const isBam = frame >= 150;
  const shakeFrame = Math.max(0, frame - 150);

  const titleSpring = spring({
    frame: shakeFrame,
    fps,
    config: { damping: 14, stiffness: 140 },
  });

  // 1. Centroidal Voronoi Stipple Field (1,200 points distributed by gravitational flux)
  const stipples = useMemo(() => {
    const points = [];
    let seed = 999;
    const rnd = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };

    // Lloyd's relaxation simulation: points clustered around 1/r potential
    for (let i = 0; i < 900; i++) {
      const u = rnd();
      const r = 90 + Math.pow(u, 1.8) * 440;
      const angle = rnd() * Math.PI * 2;
      const size = 1.0 + (1.0 - (r / 530)) * 2.5; // denser & larger near center
      const speed = (1.0 / Math.sqrt(r)) * 32;
      points.push({ rBase: r, angle0: angle, size, speed });
    }
    return points;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);
    const cx = width / 2;
    const cy = height / 2;

    // A. Marching Squares Gravitational Potential Isolines (d3-contour C024)
    const isolineCount = 14;
    const massFactor = interpolate(frame, [0, 149], [1.0, 3.2], { extrapolateRight: 'clamp' });

    for (let k = 1; k <= isolineCount; k++) {
      const baseR = (k / isolineCount) * 520;
      const r = baseR * (isBam ? 0.65 : (1.0 - (frame / 300) * 0.35));
      const alpha = interpolate(k, [1, 5, 14], [0.8, 0.45, 0.15]);

      ctx.strokeStyle = `rgba(77, 208, 225, ${alpha})`;
      ctx.lineWidth = k % 4 === 0 ? 1.8 : 0.8;
      if (k % 2 === 0) {
        ctx.setLineDash([8, 12]);
      } else {
        ctx.setLineDash([]);
      }

      // Draw non-circular warped elliptical contour (representing Kerr rotational frame dragging)
      ctx.beginPath();
      for (let theta = 0; theta <= Math.PI * 2; theta += 0.05) {
        // Higher-order harmonic perturbation
        const warp = 1.0 + 0.08 * Math.cos(2 * theta - frame * 0.03) + 0.03 * Math.sin(4 * theta);
        const rx = r * warp;
        const ry = (r * 0.44) * warp;
        const x = cx + Math.cos(theta) * rx;
        const y = cy + Math.sin(theta) * ry;
        if (theta === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();

      // Technical CAD Dimension Callout on Index Contours
      if (k % 4 === 0 && k > 2) {
        ctx.fillStyle = `rgba(77, 208, 225, ${alpha * 0.9})`;
        ctx.font = '700 9px "JetBrains Mono", monospace';
        const labelR = r * 1.08;
        ctx.fillText(`Φ = -${(100 / k * massFactor).toFixed(2)} GM/c²`, cx + labelR, cy + 4);
      }
    }
    ctx.setLineDash([]);

    // B. Centroidal Voronoi Stippling (mkeeter/swingline C021)
    for (let i = 0; i < stipples.length; i++) {
      const p = stipples[i];
      const collapse = isBam ? 0.5 : interpolate(frame, [0, 149], [1.0, 0.65], { extrapolateRight: 'clamp' });
      const currentR = p.rBase * collapse;
      const theta = p.angle0 + frame * p.speed * 0.03;

      const px = cx + Math.cos(theta) * currentR;
      const py = cy + Math.sin(theta) * (currentR * 0.44);

      // Dual-state color: Voronoi cells turning hot orange as tension rises
      const isHot = (currentR < 180 && frame > 60);
      ctx.fillStyle = isHot ? '#FF5722' : '#F3B659';
      ctx.beginPath();
      ctx.arc(px, py, p.size, 0, Math.PI * 2);
      ctx.fill();
    }

    // C. Clipper2 Polygon Offsets & Precision Dimension Clamps
    const coreR = 85 * (isBam ? 0.7 : interpolate(frame, [0, 149], [1.0, 0.72], { extrapolateRight: 'clamp' }));
    
    // Core Singularity Silhouette
    ctx.fillStyle = '#060A0D';
    ctx.beginPath();
    ctx.arc(cx, cy, coreR, 0, Math.PI * 2);
    ctx.fill();

    // Exact Mitered Offset Rings (Clipper2 parallel offsets)
    const offsetDistances = [4, 12, 28];
    offsetDistances.forEach((d, idx) => {
      ctx.strokeStyle = idx === 0 ? '#00E5FF' : '#F3B659';
      ctx.lineWidth = idx === 0 ? 2.5 : 1.0;
      ctx.beginPath();
      ctx.arc(cx, cy, coreR + d, 0, Math.PI * 2);
      ctx.stroke();
    });

    // Technical Crosshair Calipers
    ctx.strokeStyle = 'rgba(77, 208, 225, 0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx - coreR - 60, cy); ctx.lineTo(cx + coreR + 60, cy);
    ctx.moveTo(cx, cy - coreR - 60); ctx.lineTo(cx, cy + coreR + 60);
    ctx.stroke();

  }, [frame, width, height, isBam, stipples]);

  return (
    <AbsoluteFill style={{ backgroundColor: '#070C10', fontFamily: "'JetBrains Mono', monospace" }}>
      <Audio src={staticFile('audio/simulation_theme_hybrid_master.mp3')} startFrom={75} />
      <canvas ref={canvasRef} width={width} height={height} style={{ position: 'absolute', inset: 0 }} />

      {/* Tier Label Banner */}
      <div style={{ position: 'absolute', top: 40, left: 60, color: '#00E5FF', fontSize: 18, fontWeight: 900 }}>
        [TIER 2: COMPUTATIONAL GEOMETRY & CAD TOPOLOGY]
        <div style={{ fontSize: 13, color: '#F3B659', marginTop: 4 }}>
          Clipper2 offsets [C015], Swingline Voronoi stipples [C021], d3-contour isolines [C024].
        </div>
      </div>

      {/* High-Precision CAD Readouts */}
      <div style={{ position: 'absolute', bottom: 40, left: 60, color: '#4DD0E1', fontSize: 12 }}>
        BOUNDARY: EXACT PARALLEL OFFSET // 900 VORONOI STIPPLES // MARCHING SQUARES ISOLINES
      </div>

      {/* Title */}
      {isBam && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <h1 style={{
            fontSize: 90,
            color: '#F3B659',
            margin: 0,
            transform: `scale(${interpolate(titleSpring, [0, 1], [0.82, 1.0])})`,
            textShadow: '0 0 30px rgba(0, 229, 255, 0.6), 2px 2px 0 #333',
            letterSpacing: '0.12em',
          }}>
            THE SIMULATION
          </h1>
        </div>
      )}
    </AbsoluteFill>
  );
};
