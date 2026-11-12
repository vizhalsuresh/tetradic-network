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
 * FUSION A: THE RELATIVISTIC VECTOR-FLUID VORTEX
 * Repositories Collided:
 * - [X064] fogleman/ln: 3D analytical vector raymarching with hidden-line removal for 3D spacetime funnel
 * - [C114] astrokriel/lineintegralconvolutions: Dense Line Integral Convolution (LIC) plasma fluid flow
 * - [N012] pmocz/finitevolume-python: Compressible supersonic Euler shockwaves & Riemann shock diamonds
 * - [C071] rvanwijnen/spectral.js: Kubelka-Munk spectral reflectance light transport
 * 
 * Visual Experience:
 * 3D perspective camera glides over a 3D gravity well funnel draped with flowing,
 * fibrous LIC relativistic plasma fluid. At BAM, supersonic Riemann shock diamonds
 * violently shatter both the 3D funnel wireframe and the fluid streams.
 */
export const FusionA_VectorFluidVortex: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const isBam = frame >= 150;
  const shakeFrame = Math.max(0, frame - 150);

  // 3D Camera Gliding Trajectory
  const camPitch = interpolate(frame, [0, 150, 240], [52, 38, 42]); // degrees
  const camYaw = frame * 0.009; // slow cinematic rotation
  const camDist = interpolate(frame, [0, 150, 240], [1.0, 1.09, 1.05]);

  const snapSpring = spring({
    frame: shakeFrame,
    fps,
    config: { damping: 14, stiffness: 180, mass: 1.2 },
  });

  // Tectonic screen shake on BAM
  const shakeIntensity = interpolate(shakeFrame, [0, 4, 18], [15, 8, 0], { extrapolateRight: 'clamp' });
  const shakeX = Math.sin(shakeFrame * 1.8) * shakeIntensity;
  const shakeY = Math.cos(shakeFrame * 2.2) * (shakeIntensity * 0.7);

  // 1. 3D Spacetime Funnel Mesh (fogleman/ln X064)
  const funnelRings = useMemo(() => {
    const rings = [];
    const ringCount = 20;
    for (let rIdx = 1; rIdx <= ringCount; rIdx++) {
      const radius = 65 + Math.pow(rIdx / ringCount, 1.7) * 560;
      const depth = -Math.pow(1.0 - (rIdx / ringCount), 2.2) * 280;
      rings.push({ radius, depth, rIdx });
    }
    return rings;
  }, []);

  // 2. Line Integral Convolution (LIC) Plasma Fluid Filaments (astrokriel/lineintegralconvolutions C114)
  // 420 curved continuous streamlines draped over the 3D funnel
  const licStreams = useMemo(() => {
    const streams = [];
    let seed = 31415;
    const rnd = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };
    for (let i = 0; i < 420; i++) {
      const rBase = 75 + Math.pow(rnd(), 1.4) * 500;
      const angle0 = rnd() * Math.PI * 2;
      const arcLen = 0.35 + rnd() * 0.8;
      const width = 0.8 + rnd() * 2.4;
      const speed = (1.0 / Math.sqrt(rBase)) * 40;
      const isDoppler = rnd() > 0.4;
      streams.push({ rBase, angle0, arcLen, width, speed, isDoppler });
    }
    return streams;
  }, []);

  // 3. Supersonic Riemann Shock Diamond Nodes (pmocz/finitevolume-python N012)
  const shockDiamonds = useMemo(() => {
    const diamonds = [];
    const count = 32;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      diamonds.push({ angle, speedFactor: 1.0 + (i % 4) * 0.15 });
    }
    return diamonds;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);
    const cx = width / 2;
    const cy = height / 2;

    const pitchRad = (camPitch * Math.PI) / 180;
    const cosP = Math.cos(pitchRad);
    const sinP = Math.sin(pitchRad);

    // 3D Projection Helper Function
    const project3D = (x: number, y: number, z: number) => {
      const rx = x * Math.cos(camYaw) - y * Math.sin(camYaw);
      const ry = x * Math.sin(camYaw) + y * Math.cos(camYaw);
      const px = rx;
      const py = ry * cosP - z * sinP;
      const pz = ry * sinP + z * cosP;
      const fov = 900;
      const scale = fov / (fov + pz);
      return {
        screenX: cx + px * scale * camDist,
        screenY: cy + py * scale * camDist,
        depth: pz,
        scale,
      };
    };

    const collapse = isBam ? 0.36 : interpolate(frame, [0, 149], [1.0, 0.46], { extrapolateRight: 'clamp' });

    // --- ENGINE 1: 3D VECTOR RAYMARCHED SPACETIME FUNNEL (fogleman/ln X064) ---
    funnelRings.forEach((ring) => {
      const curRadius = ring.radius * collapse;
      const curDepth = ring.depth * (1.0 + (1.0 - collapse) * 1.5);
      const alpha = interpolate(ring.rIdx, [1, 7, 20], [0.85, 0.45, 0.12]);

      ctx.strokeStyle = ring.rIdx % 4 === 0 ? `rgba(0, 229, 255, ${alpha})` : `rgba(243, 182, 89, ${alpha * 0.7})`;
      ctx.lineWidth = ring.rIdx % 4 === 0 ? 1.5 : 0.8;

      ctx.beginPath();
      const segments = 64;
      for (let s = 0; s <= segments; s++) {
        const theta = (s / segments) * Math.PI * 2;
        const x3d = Math.cos(theta) * curRadius;
        const y3d = Math.sin(theta) * curRadius;
        const z3d = curDepth;
        const proj = project3D(x3d, y3d, z3d);
        if (s === 0) ctx.moveTo(proj.screenX, proj.screenY);
        else ctx.lineTo(proj.screenX, proj.screenY);
      }
      ctx.stroke();
    });

    // Inward Geodesic Ribs (16 connecting splines)
    for (let sp = 0; sp < 16; sp++) {
      const spTheta = (sp / 16) * Math.PI * 2;
      ctx.strokeStyle = 'rgba(77, 208, 225, 0.22)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      funnelRings.forEach((ring, idx) => {
        const curRadius = ring.radius * collapse;
        const curDepth = ring.depth * (1.0 + (1.0 - collapse) * 1.5);
        const proj = project3D(Math.cos(spTheta) * curRadius, Math.sin(spTheta) * curRadius, curDepth);
        if (idx === 0) ctx.moveTo(proj.screenX, proj.screenY);
        else ctx.lineTo(proj.screenX, proj.screenY);
      });
      ctx.stroke();
    }

    // --- ENGINE 2: LINE INTEGRAL CONVOLUTION (LIC) RELATIVISTIC PLASMA FLUID (C114) ---
    // Filaments flow in 3D directly on top of the gravitational funnel surface!
    licStreams.forEach((st) => {
      const curR = st.rBase * collapse;
      const angle = st.angle0 + frame * st.speed * 0.035;

      ctx.beginPath();
      const steps = 14;
      for (let s = 0; s <= steps; s++) {
        const theta = angle + (s / steps) * st.arcLen;
        const rStream = curR - (s / steps) * 16;
        const x3d = Math.cos(theta) * rStream;
        const y3d = Math.sin(theta) * rStream;
        const z3d = -Math.pow(Math.max(0, 1.0 - (rStream / 480)), 2.2) * 240;

        const proj = project3D(x3d, y3d, z3d);
        if (s === 0) ctx.moveTo(proj.screenX, proj.screenY);
        else ctx.lineTo(proj.screenX, proj.screenY);
      }

      // Kubelka-Munk Spectral Doppler (C071)
      const cosVal = Math.cos(angle - camYaw);
      let strokeColor = st.isDoppler
        ? (cosVal < -0.2 ? 'rgba(0, 229, 255, 0.75)' : 'rgba(255, 87, 34, 0.75)')
        : 'rgba(243, 182, 89, 0.55)';

      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = st.width;
      ctx.stroke();
    });

    // --- ENGINE 3: SUPERSONIC RIEMANN SHOCK DIAMONDS AT BAM (N012 Finite Volume) ---
    if (isBam && shakeFrame <= 35) {
      const shockRadius = interpolate(shakeFrame, [0, 35], [75 * collapse, 840], { extrapolateRight: 'clamp' });
      const shockOpacity = interpolate(shakeFrame, [0, 4, 35], [0, 0.95, 0]);

      // Supersonic Discontinuity Ellipse in 3D perspective
      ctx.strokeStyle = `rgba(255, 87, 34, ${shockOpacity})`;
      ctx.lineWidth = interpolate(shakeFrame, [0, 35], [6, 1.5]);
      ctx.beginPath();
      for (let s = 0; s <= 64; s++) {
        const theta = (s / 64) * Math.PI * 2;
        const proj = project3D(Math.cos(theta) * shockRadius, Math.sin(theta) * shockRadius, 0);
        if (s === 0) ctx.moveTo(proj.screenX, proj.screenY);
        else ctx.lineTo(proj.screenX, proj.screenY);
      }
      ctx.stroke();

      // Shock Diamond Nodes (Compressible gas cell intersections)
      shockDiamonds.forEach((d) => {
        const dDist = shockRadius * 0.88 * d.speedFactor;
        const proj = project3D(Math.cos(d.angle) * dDist, Math.sin(d.angle) * dDist, 0);
        ctx.fillStyle = '#FFFFFF';
        ctx.shadowColor = '#00E5FF';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(proj.screenX, proj.screenY, 3.8 * proj.scale, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });
    }

    // --- CENTRAL SINGULARITY & LUMINOUS PHOTON RING ---
    const horizonProj = project3D(0, 0, -240 * (isBam ? 1.0 : (1.0 - collapse)));
    const horizonR = 72 * collapse * horizonProj.scale;

    // Black Hole Shadow
    ctx.fillStyle = '#030507';
    ctx.beginPath();
    ctx.arc(horizonProj.screenX, horizonProj.screenY, horizonR, 0, Math.PI * 2);
    ctx.fill();

    // Luminous Photon Sphere Ring (r = 1.5 rs)
    ctx.strokeStyle = isBam ? '#00E5FF' : '#F3B659';
    ctx.lineWidth = isBam ? 4.5 : 2.0;
    ctx.shadowColor = isBam ? '#00E5FF' : '#FF5722';
    ctx.shadowBlur = isBam ? 36 : 14;
    ctx.beginPath();
    ctx.arc(horizonProj.screenX, horizonProj.screenY, horizonR * 1.5, 0, Math.PI * 2);
    ctx.stroke();
    ctx.shadowBlur = 0;

  }, [frame, width, height, isBam, camPitch, camYaw, camDist, funnelRings, licStreams, shockDiamonds]);

  // Anamorphic Specular Glint Sweep (Frames 150-175)
  const glintProgress = interpolate(shakeFrame, [0, 20], [-300, 1400], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const glintOpacity = interpolate(shakeFrame, [0, 3, 22], [0, 0.95, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: '#040608', fontFamily: "'JetBrains Mono', monospace" }}>
      <Audio src={staticFile('audio/simulation_theme_hybrid_master.mp3')} startFrom={75} />
      
      {/* Master 3D Stage with Screen Shake */}
      <div style={{ position: 'absolute', inset: 0, transform: `translate3d(${shakeX}px, ${shakeY}px, 0)` }}>
        <canvas ref={canvasRef} width={width} height={height} style={{ position: 'absolute', inset: 0 }} />

        {/* Fusion Label Banner */}
        <div style={{ position: 'absolute', top: 40, left: 60, color: '#F3B659', fontSize: 18, fontWeight: 900 }}>
          [FUSION A: THE RELATIVISTIC VECTOR-FLUID VORTEX]
          <div style={{ fontSize: 13, color: '#00E5FF', marginTop: 4 }}>
            3D Spacetime Funnel [X064 ln] × LIC Plasma Fluid [C114] × Riemann Shocks [N012] × Spectral Light [C071]
          </div>
        </div>

        {/* Real-Time Telemetry HUD */}
        <div style={{ position: 'absolute', bottom: 40, left: 60, color: '#4DD0E1', fontSize: 12 }}>
          3D VECTOR GEODESICS // CONTINUOUS LIC PLASMA ADVECTION // SUPERSONIC MACH 3.2 SHOCK DIAMONDS
        </div>

        {/* Anamorphic Glint */}
        {isBam && shakeFrame <= 26 && (
          <div style={{
            position: 'absolute',
            left: glintProgress,
            top: '50%',
            width: 850,
            height: 2,
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.95) 50%, transparent 100%)',
            boxShadow: '0 0 24px 6px rgba(0, 229, 255, 0.95), 0 0 50px 14px rgba(243, 182, 89, 0.75)',
            opacity: glintOpacity,
            transform: 'translateY(-50%)',
            pointerEvents: 'none',
          }} />
        )}

        {/* Title */}
        {isBam && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <h1 style={{
              fontSize: 94,
              fontWeight: 900,
              color: '#F3B659',
              margin: 0,
              transform: `scale(${interpolate(snapSpring, [0, 1], [0.82, 1.0])})`,
              textShadow: `
                4px 4px 0 #8B6514,
                8px 8px 30px rgba(0, 0, 0, 0.95),
                0 0 60px rgba(243, 182, 89, 0.6)
              `,
              letterSpacing: '0.16em',
            }}>
              THE SIMULATION
            </h1>
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
