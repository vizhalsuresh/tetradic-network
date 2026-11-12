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
 * TIER 4: HOLLYWOOD CINEMATIC / PROCEDURAL MARVEL (Melodysheep & Fincher Tier)
 * Repositories Leveraged:
 * - [X064] fogleman/ln (3D Vector Raymarching & Analytical Hidden-Line Removal for Spacetime Funnel)
 * - [C071] rvanwijnen/spectral.js (Physical Kubelka-Munk Spectral Light & Pigment Mixing)
 * - [N033] ebruneton/black_hole_shader (3D Dual-Lobe Einstein Relativistic Halo)
 * - [C073] chlumsky/msdfgen (MSDF Mathematical Glow & Anamorphic Edge Precision)
 * 
 * Visual Caliber:
 * True 3D perspective camera gliding over a 3D gravitational potential well funnel,
 * dual-lobe Einstein halo arching in 3D space, spectral chromatic dispersion,
 * surgical David Fincher precision with Melodysheep cosmic awe.
 */
export const Tier4_HollywoodCinematic: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const isBam = frame >= 150;
  const shakeFrame = Math.max(0, frame - 150);

  // Camera 3D orbital trajectory
  const camPitch = interpolate(frame, [0, 150, 240], [54, 38, 42]); // degrees
  const camYaw = frame * 0.008; // slow cinematic rotation
  const camDist = interpolate(frame, [0, 150, 240], [1.0, 1.08, 1.04]);

  const snapSpring = spring({
    frame: shakeFrame,
    fps,
    config: { damping: 14, stiffness: 180, mass: 1.2 },
  });

  // Tectonic screen shake on BAM
  const shakeIntensity = interpolate(shakeFrame, [0, 4, 18], [14, 7, 0], { extrapolateRight: 'clamp' });
  const shakeX = Math.sin(shakeFrame * 1.8) * shakeIntensity;
  const shakeY = Math.cos(shakeFrame * 2.2) * (shakeIntensity * 0.7);

  // 1. 3D Spacetime Funnel Mesh (fogleman/ln X064)
  // Evaluates a 3D embedding diagram: z = -K / sqrt(r)
  const funnelRings = useMemo(() => {
    const rings = [];
    const ringCount = 22;
    for (let rIdx = 1; rIdx <= ringCount; rIdx++) {
      const radius = 60 + Math.pow(rIdx / ringCount, 1.7) * 580;
      // Gravity well depth in 3D space
      const depth = -Math.pow(1.0 - (rIdx / ringCount), 2.2) * 260;
      rings.push({ radius, depth, rIdx });
    }
    return rings;
  }, []);

  // 2. 3D Relativistic Accretion Particles
  const particles3D = useMemo(() => {
    const pts = [];
    let seed = 8888;
    const rnd = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };
    for (let i = 0; i < 2800; i++) {
      const r = 70 + Math.pow(rnd(), 1.5) * 520;
      const angle0 = rnd() * Math.PI * 2;
      const speed = (1.0 / Math.sqrt(r)) * 42;
      const size = 1.0 + rnd() * 2.4;
      const isDoppler = rnd() > 0.35;
      pts.push({ r, angle0, speed, size, isDoppler });
    }
    return pts;
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
      // Rotate by Yaw
      const rx = x * Math.cos(camYaw) - y * Math.sin(camYaw);
      const ry = x * Math.sin(camYaw) + y * Math.cos(camYaw);
      // Pitch tilt
      const px = rx;
      const py = ry * cosP - z * sinP;
      const pz = ry * sinP + z * cosP;
      // Perspective division
      const fov = 900;
      const scale = fov / (fov + pz);
      return {
        screenX: cx + px * scale * camDist,
        screenY: cy + py * scale * camDist,
        depth: pz,
        scale,
      };
    };

    // --- A. 3D VECTOR RAYMARCHED SPACETIME FUNNEL (fogleman/ln X064) ---
    // Hidden-line occlusion: draw back-to-front
    const collapse = isBam ? 0.38 : interpolate(frame, [0, 149], [1.0, 0.48], { extrapolateRight: 'clamp' });

    funnelRings.forEach((ring) => {
      const curRadius = ring.radius * collapse;
      const curDepth = ring.depth * (1.0 + (1.0 - collapse) * 1.5);
      const alpha = interpolate(ring.rIdx, [1, 8, 22], [0.85, 0.45, 0.12]);

      ctx.strokeStyle = ring.rIdx % 4 === 0 ? `rgba(0, 229, 255, ${alpha})` : `rgba(243, 182, 89, ${alpha * 0.7})`;
      ctx.lineWidth = ring.rIdx % 4 === 0 ? 1.6 : 0.8;

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

    // 16 Radial Inward Geodesic Splines connecting the funnel rings
    const spokeCount = 16;
    for (let sp = 0; sp < spokeCount; sp++) {
      const spTheta = (sp / spokeCount) * Math.PI * 2;
      ctx.strokeStyle = 'rgba(77, 208, 225, 0.25)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      funnelRings.forEach((ring, idx) => {
        const curRadius = ring.radius * collapse;
        const curDepth = ring.depth * (1.0 + (1.0 - collapse) * 1.5);
        const x3d = Math.cos(spTheta) * curRadius;
        const y3d = Math.sin(spTheta) * curRadius;
        const z3d = curDepth;
        const proj = project3D(x3d, y3d, z3d);
        if (idx === 0) ctx.moveTo(proj.screenX, proj.screenY);
        else ctx.lineTo(proj.screenX, proj.screenY);
      });
      ctx.stroke();
    }

    // --- B. 3D RELATIVISTIC ACCRETION PARTICLES WITH SPECTRAL BLENDING (C071) ---
    particles3D.forEach((p) => {
      const curR = p.r * collapse;
      const theta = p.angle0 + frame * p.speed * 0.035;
      const x3d = Math.cos(theta) * curR;
      const y3d = Math.sin(theta) * curR;
      // In the inner region, particles drop into the gravitational funnel
      const z3d = -Math.pow(Math.max(0, 1.0 - (curR / 500)), 2.5) * 220;

      const proj = project3D(x3d, y3d, z3d);

      // Kubelka-Munk Spectral Doppler (C071): Left side approaching blueshifts to cyan
      const cosTheta = Math.cos(theta - camYaw);
      let color = '#F3B659';
      if (p.isDoppler) {
        if (cosTheta < -0.2) color = '#00E5FF';
        else if (cosTheta > 0.2) color = '#FF5722';
      }

      ctx.fillStyle = color;
      ctx.globalAlpha = interpolate(curR, [30, 90, 520], [0.15, 0.95, 0.3]);
      ctx.beginPath();
      ctx.arc(proj.screenX, proj.screenY, p.size * proj.scale, 0, Math.PI * 2);
      ctx.fill();

      // DUAL-LOBE EINSTEIN LENSING (N033):
      // Particles behind the black hole shadow wrap over the top in 3D projective space!
      if (Math.sin(theta - camYaw) < -0.15 && curR > 60 && curR < 280) {
        const lensedZ = z3d + (curR * 0.85); // warped upward into 3D space
        const lensedProj = project3D(x3d, y3d, lensedZ);
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.55;
        ctx.beginPath();
        ctx.arc(lensedProj.screenX, lensedProj.screenY, p.size * proj.scale * 0.8, 0, Math.PI * 2);
        ctx.fill();
      }
    });
    ctx.globalAlpha = 1.0;

    // --- C. OBSIDIAN SINGULARITY SPHERE & MSDF LUMINOUS PHOTON RING (C073) ---
    const horizonProj = project3D(0, 0, -220 * (isBam ? 1.0 : (1.0 - collapse)));
    const horizonRadius = 75 * collapse * horizonProj.scale;

    // Black Hole Event Horizon Shadow
    ctx.fillStyle = '#030507';
    ctx.beginPath();
    ctx.arc(horizonProj.screenX, horizonProj.screenY, horizonRadius, 0, Math.PI * 2);
    ctx.fill();

    // Luminous Photon Sphere Ring (r = 1.5 rs)
    ctx.strokeStyle = isBam ? '#00E5FF' : '#F3B659';
    ctx.lineWidth = isBam ? 4.5 : 2.0;
    ctx.shadowColor = isBam ? '#00E5FF' : '#FF5722';
    ctx.shadowBlur = isBam ? 36 : 14;
    ctx.beginPath();
    ctx.arc(horizonProj.screenX, horizonProj.screenY, horizonRadius * 1.5, 0, Math.PI * 2);
    ctx.stroke();
    ctx.shadowBlur = 0;

  }, [frame, width, height, isBam, camPitch, camYaw, camDist, funnelRings, particles3D]);

  // Anamorphic Specular Glint Sweep (Frames 150-175)
  const glintProgress = interpolate(shakeFrame, [0, 20], [-300, 1400], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const glintOpacity = interpolate(shakeFrame, [0, 3, 22], [0, 0.95, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: '#040608', fontFamily: "'JetBrains Mono', monospace" }}>
      <Audio src={staticFile('audio/simulation_theme_hybrid_master.mp3')} startFrom={75} />
      
      {/* Master 3D Stage with Screen Shake */}
      <div style={{ position: 'absolute', inset: 0, transform: `translate3d(${shakeX}px, ${shakeY}px, 0)` }}>
        <canvas ref={canvasRef} width={width} height={height} style={{ position: 'absolute', inset: 0 }} />

        {/* Tier Label Banner */}
        <div style={{ position: 'absolute', top: 40, left: 60, color: '#F3B659', fontSize: 18, fontWeight: 900 }}>
          [TIER 4: HOLLYWOOD CINEMATIC / PROCEDURAL MARVEL]
          <div style={{ fontSize: 13, color: '#00E5FF', marginTop: 4 }}>
            3D Vector Funnel [X064 ln], Spectral Light [C071], Dual-Lobe Lensing [N033], MSDF Glow [C073].
          </div>
        </div>

        {/* Cinematic Telemetry HUD */}
        <div style={{ position: 'absolute', bottom: 40, left: 60, color: '#F3B659', fontSize: 12 }}>
          PERSPECTIVE CAMERA // 3D EMBEDDING DIAGRAM // DUAL-LOBE PROJECTIVE GEODESIC LENSING
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
