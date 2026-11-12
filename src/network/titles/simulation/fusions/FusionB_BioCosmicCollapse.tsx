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
 * FUSION B: THE BIO-COSMIC GEODESIC COLLAPSE
 * Repositories Collided:
 * - [X008] chakazul/lenia: Continuous cellular automata morphogenesis (living wavefield)
 * - [N033] ebruneton/black_hole_shader: Schwarzschild null-geodesic raymarching & photon ring
 * - [C071] rvanwijnen/spectral.js: Kubelka-Munk spectral light transport (Bio-Emerald, Cyan, Amber)
 * 
 * Visual Experience:
 * A self-organizing multi-cellular artificial life organism (Lenia) emerges in cosmic space.
 * As spacetime curves, the living cellular membrane is stretched along relativistic geodesics,
 * forming a pulsating biological accretion halo around the black hole before collapsing at BAM.
 */
export const FusionB_BioCosmicCollapse: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const isBam = frame >= 150;
  const shakeFrame = Math.max(0, frame - 150);

  const snapSpring = spring({
    frame: shakeFrame,
    fps,
    config: { damping: 14, stiffness: 180, mass: 1.2 },
  });

  const shakeIntensity = interpolate(shakeFrame, [0, 4, 18], [15, 8, 0], { extrapolateRight: 'clamp' });
  const shakeX = Math.sin(shakeFrame * 1.8) * shakeIntensity;
  const shakeY = Math.cos(shakeFrame * 2.2) * (shakeIntensity * 0.7);

  // 1. Lenia Continuous Cellular Morphogenesis Nodes (chakazul/lenia X008)
  // 360 multi-ringed continuous cellular nodes with continuous growth dynamics
  const leniaCells = useMemo(() => {
    const cells = [];
    let seed = 55555;
    const rnd = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };

    const rings = 6;
    for (let r = 1; r <= rings; r++) {
      const ringRadius = 50 + r * 55;
      const nodesInRing = 24 + r * 16;
      for (let n = 0; n < nodesInRing; n++) {
        const angle = (n / nodesInRing) * Math.PI * 2;
        const phase = rnd() * Math.PI * 2;
        const pulseFreq = 0.04 + rnd() * 0.03;
        cells.push({ ringIdx: r, baseRadius: ringRadius, baseAngle: angle, phase, pulseFreq });
      }
    }
    return cells;
  }, []);

  // 2. Bioluminescent Emission Tendrils (connecting cellular membrane)
  const tendrils = useMemo(() => {
    const list = [];
    for (let i = 0; i < 48; i++) {
      list.push({
        angleOffset: (i / 48) * Math.PI * 2,
        lengthMult: 0.8 + (i % 3) * 0.2,
        waveFreq: 2.5 + (i % 4) * 0.5,
      });
    }
    return list;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);
    const cx = width / 2;
    const cy = height / 2;

    const collapse = isBam ? 0.32 : interpolate(frame, [0, 149], [1.0, 0.42], { extrapolateRight: 'clamp' });
    const coreR = 80 * collapse;

    // --- ENGINE 1: LENIA CONTINUOUS MORPHOGENESIS WAVEFIELD (X008) ---
    // Kernel growth mapping: G(u) creates pulsating biological membrane rings
    const bioPulse = Math.sin(frame * 0.08) * 12;

    // Background Bio-Energy Glow (Kubelka-Munk Spectral Blending C071)
    const bioGrad = ctx.createRadialGradient(cx, cy, 40, cx, cy, 450 * collapse);
    bioGrad.addColorStop(0, 'rgba(0, 230, 118, 0.25)'); // Bio-Emerald
    bioGrad.addColorStop(0.4, 'rgba(0, 229, 255, 0.18)'); // Relativistic Cyan
    bioGrad.addColorStop(0.8, 'rgba(255, 179, 0, 0.08)'); // Luminous Amber
    bioGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = bioGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, 450 * collapse, 0, Math.PI * 2);
    ctx.fill();

    // --- ENGINE 2: SCHWARZSCHILD NULL-GEODESIC LENSING OF BIOLOGICAL CELLS (N033) ---
    // The living cells are optically & physically deflected around the event horizon
    leniaCells.forEach((c) => {
      // Lenia continuous growth pulsation
      const growthWave = Math.sin(frame * c.pulseFreq + c.phase) * 14;
      const r = (c.baseRadius + growthWave + bioPulse) * collapse;
      const angle = c.baseAngle + (frame * 0.02 * (1.0 / Math.sqrt(Math.max(1, r / 100))));

      const px = cx + Math.cos(angle) * r;
      const py = cy + Math.sin(angle) * (r * 0.45); // relativistic tilted plane

      // Relativistic Doppler spectral shift:
      // Approaching rim shifts to brilliant Bio-Cyan (#00E5FF); receding shifts to Bio-Amber (#FFB300)
      const cosA = Math.cos(angle);
      let cellColor = '#00E676'; // baseline emerald
      if (cosA < -0.2) cellColor = '#00E5FF';
      else if (cosA > 0.2) cellColor = '#FFB300';

      ctx.fillStyle = cellColor;
      ctx.shadowColor = cellColor;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(px, py, 2.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Dual-Lobe Geodesic Deflection:
      // Far-side biological cells curve over the top and bottom of the black hole
      if (Math.sin(angle) < -0.15 && r > coreR * 1.1 && r < coreR * 3.2) {
        const lensedY_top = cy - (Math.abs(Math.sin(angle)) * (r * 0.45) + (coreR * 0.6));
        const lensedY_bottom = cy + (Math.abs(Math.sin(angle)) * (r * 0.45) + (coreR * 0.4));

        ctx.fillStyle = cellColor;
        ctx.globalAlpha = 0.55;
        ctx.beginPath(); ctx.arc(px, lensedY_top, 2.0, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(px, lensedY_bottom, 1.8, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = 1.0;
      }
    });

    // --- BIOLUMINESCENT CELLULAR TENDRILS ---
    tendrils.forEach((t) => {
      const angle = t.angleOffset + frame * 0.015;
      ctx.strokeStyle = 'rgba(0, 230, 118, 0.35)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      const steps = 16;
      for (let s = 0; s <= steps; s++) {
        const rad = coreR * 1.5 + (s / steps) * (260 * collapse * t.lengthMult);
        const wAngle = angle + Math.sin(s * 0.6 + frame * 0.1) * 0.15;
        const tx = cx + Math.cos(wAngle) * rad;
        const ty = cy + Math.sin(wAngle) * (rad * 0.45);
        if (s === 0) ctx.moveTo(tx, ty);
        else ctx.lineTo(tx, ty);
      }
      ctx.stroke();
    });

    // --- BAM BIO-COLLAPSE SHOCKWAVE (Frame 150+) ---
    if (isBam && shakeFrame <= 35) {
      const bioShockR = interpolate(shakeFrame, [0, 35], [coreR, 820], { extrapolateRight: 'clamp' });
      const bioOpacity = interpolate(shakeFrame, [0, 4, 35], [0, 0.95, 0]);

      ctx.strokeStyle = `rgba(0, 230, 118, ${bioOpacity})`;
      ctx.lineWidth = interpolate(shakeFrame, [0, 35], [6, 1.5]);
      ctx.shadowColor = '#00E676';
      ctx.shadowBlur = 20;
      ctx.beginPath();
      ctx.ellipse(cx, cy, bioShockR, bioShockR * 0.48, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    // --- BLACK HOLE SHADOW & LUMINOUS BIO-PHOTON RING ---
    ctx.fillStyle = '#020503';
    ctx.beginPath();
    ctx.arc(cx, cy, coreR, 0, Math.PI * 2);
    ctx.fill();

    // Photon Sphere (r = 1.5 rs)
    ctx.strokeStyle = isBam ? '#00E5FF' : '#00E676';
    ctx.lineWidth = isBam ? 4.5 : 2.0;
    ctx.shadowColor = isBam ? '#00E5FF' : '#00E676';
    ctx.shadowBlur = isBam ? 34 : 15;
    ctx.beginPath();
    ctx.arc(cx, cy, coreR * 1.5, 0, Math.PI * 2);
    ctx.stroke();
    ctx.shadowBlur = 0;

  }, [frame, width, height, isBam, shakeFrame, leniaCells, tendrils]);

  // Anamorphic Specular Glint Sweep (Frames 150-175)
  const glintProgress = interpolate(shakeFrame, [0, 20], [-300, 1400], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const glintOpacity = interpolate(shakeFrame, [0, 3, 22], [0, 0.95, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: '#020504', fontFamily: "'JetBrains Mono', monospace" }}>
      <Audio src={staticFile('audio/simulation_theme_1A_geodesic_lensing.mp3')} startFrom={75} />
      
      <div style={{ position: 'absolute', inset: 0, transform: `translate3d(${shakeX}px, ${shakeY}px, 0)` }}>
        <canvas ref={canvasRef} width={width} height={height} style={{ position: 'absolute', inset: 0 }} />

        {/* Fusion Label Banner */}
        <div style={{ position: 'absolute', top: 40, left: 60, color: '#00E676', fontSize: 18, fontWeight: 900 }}>
          [FUSION B: THE BIO-COSMIC GEODESIC COLLAPSE]
          <div style={{ fontSize: 13, color: '#00E5FF', marginTop: 4 }}>
            Continuous Lenia Morphogenesis [X008] × Schwarzschild Geodesic Lensing [N033] × Spectral Light [C071]
          </div>
        </div>

        {/* Telemetry HUD */}
        <div style={{ position: 'absolute', bottom: 40, left: 60, color: '#00E676', fontSize: 12 }}>
          CONTINUOUS CELLULAR KERNEL G(u) // BIO-RELATIVISTIC MEMBRANE SHEAR // PHOTON SPHERE ACCRETION
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
            boxShadow: '0 0 24px 6px rgba(0, 230, 118, 0.95), 0 0 50px 14px rgba(0, 229, 255, 0.75)',
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
              color: '#00E676',
              margin: 0,
              transform: `scale(${interpolate(snapSpring, [0, 1], [0.82, 1.0])})`,
              textShadow: `
                4px 4px 0 #00693E,
                8px 8px 30px rgba(0, 0, 0, 0.95),
                0 0 60px rgba(0, 230, 118, 0.7)
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
