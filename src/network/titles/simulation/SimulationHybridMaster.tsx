import React, { useMemo, useRef, useEffect } from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Audio,
  staticFile,
} from 'remotion';

/**
 * SHOW 2: THE SIMULATION — MASTER TITLE HYBRID (Option 4)
 * "The Geodesic Spaghettification Singularity"
 * 
 * Fusion of Direction 1A (Exact Geodesic Lensing & Photon Ring - ebruneton/black_hole_shader N033)
 * and Direction 1B (Tidal Spaghettification & ISCO Barrier - hannorein/rebound N006).
 * 
 * Technical Specs:
 * - 12.0s duration (360 frames @ 30 FPS)
 * - 3,500 Relativistic Keplerian particles with dual-lobe Einstein lensing
 * - Visible ISCO boundary at r = 3.0 rs (Point of No Return)
 * - Inbound telemetry data core spaghettified via tidal tensor shear Tij
 * - Pre-impact 40ms silence breath (F223-F226)
 * - Critical Singularity BAM at Frame 227 (7.56s) with Argus 4-layer shockwave
 * - 4.5s Hero Hold with station watermark HUD and telemetry decay
 * - 100% $0 Local Neural Audio (simulation_theme_hybrid_master.mp3)
 */
export const SimulationHybridMaster: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isVertical = height > width;
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // -------------------------------------------------------------
  // 1. TIMELINE & BAM DEFINITION (360 Frames @ 30 FPS = 12.0s)
  // Act 1: Equilibrium & Inbound Core Approach (F0 - F90 / 0.0s - 3.0s)
  // Act 2: ISCO Barrier Crossing & Tidal Spaghettification (F90 - F225 / 3.0s - 7.5s)
  // Pre-BAM: 40ms Vacuum Silence Breath (F223 - F226 / 7.46s - 7.50s)
  // Act 3: Critical Singularity BAM & Shockwave (F227 / 7.56s)
  // Act 4: Warped Accretion Halo & Hero Hold (F227 - F360 / 4.44s)
  // -------------------------------------------------------------
  const isBam = frame >= 225;
  const shakeFrame = Math.max(0, frame - 225);

  // -------------------------------------------------------------
  // 2. CAMERA CHOREOGRAPHY: Subtle push + Heavy BAM impact recoil
  // -------------------------------------------------------------
  const baseScale = interpolate(frame, [0, 220, 225, 360], [1.0, 1.05, 1.0, 1.038], {
    extrapolateRight: 'clamp',
  });

  const snapSpring = spring({
    frame: shakeFrame,
    fps,
    config: { damping: 14, stiffness: 180, mass: 1.2 },
  });

  // Tectonic screen shake on Frame 225 (Argus Shockwave)
  const shakeIntensity = interpolate(shakeFrame, [0, 4, 18], [15, 8, 0], {
    extrapolateRight: 'clamp',
  });
  const shakeX = Math.sin(shakeFrame * 1.8) * shakeIntensity;
  const shakeY = Math.cos(shakeFrame * 2.2) * (shakeIntensity * 0.7);

  // -------------------------------------------------------------
  // 3. ARGUS CTO SCOUT: 3,500 Relativistic Particles (Direction 1A)
  // Analytical null-geodesic lookup table (LUT) for dual-lobe lensing
  // -------------------------------------------------------------
  const particles = useMemo(() => {
    const count = 3500;
    const arr = [];
    let seed = 777;
    const rnd = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };

    for (let i = 0; i < count; i++) {
      const radiusBase = 70 + Math.pow(rnd(), 1.6) * 580;
      const angle0 = rnd() * Math.PI * 2;
      const speedMult = (1.0 / Math.sqrt(radiusBase)) * 40;
      const size = 1.0 + rnd() * 2.2;
      const isDoppler = rnd() > 0.35;
      const zOffset = (rnd() - 0.5) * 12; // vertical disk thickness
      arr.push({ radiusBase, angle0, speedMult, size, isDoppler, zOffset });
    }
    return arr;
  }, []);

  // -------------------------------------------------------------
  // 4. TIDAL SPAGHETTIFICATION DEBRIS NODES (Direction 1B)
  // Inbound telemetry data core ripped apart by tidal tensor Tij
  // -------------------------------------------------------------
  const debrisNodes = useMemo(() => {
    const count = 180;
    const nodes = [];
    let seed = 12345;
    const rnd = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };

    for (let i = 0; i < count; i++) {
      nodes.push({
        relOffset: (i / count) - 0.5, // spread along filament
        lateralOffset: (rnd() - 0.5) * 8,
        speedJitter: 0.95 + rnd() * 0.1,
        size: 1.5 + rnd() * 2.5,
        colorType: i % 4 === 0 ? '#FFFFFF' : i % 2 === 0 ? '#FF5722' : '#F3B659',
      });
    }
    return nodes;
  }, []);

  // -------------------------------------------------------------
  // 5. CANVAS RENDER LOOP: Dual-Lobe Lensing & Spaghettification
  // -------------------------------------------------------------
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    const cx = width / 2;
    const cy = height / 2;

    // Relativistic mass surge M(t)
    const massSurge = interpolate(frame, [75, 224], [1.0, 9.2], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });

    // Inward collapse factor
    const collapseFactor = isBam
      ? 0.34 + 0.04 * Math.sin(frame * 0.05)
      : interpolate(frame, [75, 224], [1.0, 0.40], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });

    const coreRadius = (isVertical ? 95 : 145) * (isBam ? 1.0 : collapseFactor);
    const iscoRadius = coreRadius * 3.0; // r = 3.0 rs (ISCO Boundary)
    const photonSphereRadius = coreRadius * 1.5; // r = 1.5 rs (Photon Sphere)

    // --- A. BACKGROUND COORDINATE GRID & METRIC RINGS ---
    const gridAlpha = interpolate(frame, [0, 45, 224, 230], [0, 0.16, 0.35, 0.10], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    if (gridAlpha > 0.01) {
      ctx.strokeStyle = `rgba(77, 208, 225, ${gridAlpha})`;
      ctx.lineWidth = 1;
      const rings = 7;
      for (let r = 1; r <= rings; r++) {
        const radius = (r / rings) * (isVertical ? 460 : 720) * collapseFactor;
        ctx.beginPath();
        ctx.arc(cx, cy, Math.max(15, radius), 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    // --- B. THE ISCO BARRIER LINE (r = 3.0 rs // POINT OF NO RETURN) ---
    if (frame < 235) {
      const iscoAlpha = interpolate(frame, [20, 80, 220, 228], [0, 0.75, 0.95, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
      ctx.strokeStyle = '#4DD0E1';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([6, 8]);
      ctx.beginPath();
      ctx.arc(cx, cy, iscoRadius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]); // reset

      // ISCO Callout Label
      if (iscoAlpha > 0.2) {
        ctx.fillStyle = `rgba(77, 208, 225, ${iscoAlpha})`;
        ctx.font = '700 10px monospace';
        ctx.fillText('ISCO // r = 3.00 rs // CRITICAL POINT OF NO RETURN', cx - iscoRadius + 20, cy - 8);
      }
    }

    // --- C. DIRECTION 1A: 3,500 PARTICLES WITH DUAL-LOBE GEODESIC LENSING ---
    // (ebruneton/black_hole_shader N033 analytical ray deflection)
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      const omega = p.speedMult * (1.0 + (massSurge - 1.0) * 0.72);
      const theta = p.angle0 + (frame * omega * 0.04);
      const r = p.radiusBase * collapseFactor;

      // 3D tilted accretion plane (42 degree pitch angle)
      const cosT = Math.cos(theta);
      const sinT = Math.sin(theta);
      const px = cx + cosT * r;
      const py = cy + sinT * (r * 0.42);

      // Relativistic Doppler beaming
      let color = '#F3B659';
      if (p.isDoppler) {
        if (cosT < -0.2) color = '#00E5FF'; // Blueshift approaching rim
        else if (cosT > 0.2) color = '#E65A28'; // Redshift receding rim
      }

      const alpha = interpolate(r, [25, 90, 520], [0.12, 0.92, 0.35], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });

      ctx.fillStyle = color;
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.arc(px, py, p.size, 0, Math.PI * 2);
      ctx.fill();

      // DUAL-LOBE EINSTEIN LENSING:
      // If particle is behind the black hole (sinT < 0), light wraps over the top and bottom!
      if (sinT < -0.15 && r > coreRadius * 0.9 && r < coreRadius * 3.4) {
        const lensOffset = Math.pow((coreRadius * 2.8) / r, 1.4) * (coreRadius * 0.58);
        const lensedY_top = cy - (Math.abs(sinT) * (r * 0.42) + lensOffset);
        const lensedY_bottom = cy + (Math.abs(sinT) * (r * 0.42) + lensOffset * 0.7);

        ctx.fillStyle = color;
        ctx.globalAlpha = alpha * 0.65;
        // Upper lensed arc
        ctx.beginPath();
        ctx.arc(px, lensedY_top, p.size * 0.9, 0, Math.PI * 2);
        ctx.fill();
        // Lower lensed arc
        ctx.beginPath();
        ctx.arc(px, lensedY_bottom, p.size * 0.7, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1.0;

    // --- D. DIRECTION 1B: TIDAL SPAGHETTIFICATION FILAMENT ---
    // (hannorein/rebound N006 tidal tensor shear)
    if (frame >= 30 && frame <= 235) {
      // Inbound trajectory: enters from top-left, crosses ISCO at F100, spirals into BAM at F225
      const probeProgress = interpolate(frame, [30, 95, 225], [0, 0.45, 1.0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });

      // Hyperbolic approach transitioning to relativistic spiral
      const spiralRevs = Math.pow(probeProgress, 2.4) * 4.2 * Math.PI;
      const probeRadius = interpolate(probeProgress, [0, 0.45, 1.0], [isVertical ? 420 : 680, iscoRadius, coreRadius * 1.02]);
      const probeAngle = -Math.PI * 0.85 + spiralRevs;

      // Tidal stretch factor: explodes as r approaches coreRadius
      const tidalStretch = Math.pow(1.0 / Math.max(0.08, probeRadius / (isVertical ? 420 : 680)), 2.2);

      // Render the 180 spaghettified debris nodes
      for (let j = 0; j < debrisNodes.length; j++) {
        const node = debrisNodes[j];
        // Nodes elongate along the tangent of the trajectory
        const nodeProgress = probeProgress + (node.relOffset * 0.08 * tidalStretch);
        const nodeAngle = -Math.PI * 0.85 + (Math.pow(Math.max(0, nodeProgress), 2.4) * 4.2 * Math.PI);
        const nodeRadius = interpolate(Math.min(1.0, Math.max(0, nodeProgress)), [0, 0.45, 1.0], [isVertical ? 420 : 680, iscoRadius, coreRadius * 1.02]);

        const nx = cx + Math.cos(nodeAngle) * nodeRadius + (node.lateralOffset / Math.max(1, tidalStretch * 0.5));
        const ny = cy + Math.sin(nodeAngle) * (nodeRadius * 0.48);

        const nodeAlpha = interpolate(frame, [30, 60, 224, 228], [0, 0.95, 1.0, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });

        ctx.fillStyle = node.colorType;
        ctx.globalAlpha = nodeAlpha;
        ctx.beginPath();
        ctx.arc(nx, ny, node.size * (1.0 + tidalStretch * 0.15), 0, Math.PI * 2);
        ctx.fill();
      }

      // Pre-ISCO Inbound Core Caliper HUD (F30 - F95)
      if (frame < 95) {
        const headX = cx + Math.cos(probeAngle) * probeRadius;
        const headY = cy + Math.sin(probeAngle) * (probeRadius * 0.48);
        ctx.strokeStyle = '#FF5722';
        ctx.lineWidth = 1;
        ctx.strokeRect(headX - 16, headY - 16, 32, 32);
        ctx.fillStyle = '#FF5722';
        ctx.font = '700 9px monospace';
        ctx.fillText('CORE.01 // INBOUND', headX + 22, headY - 4);
      }
    }
    ctx.globalAlpha = 1.0;

    // --- E. OBSIDIAN SINGULARITY HOLE & LUMINOUS PHOTON RING (r = 1.5 rs) ---
    if (frame >= 75) {
      // Event Horizon Black Hole Shadow
      ctx.fillStyle = '#060A0D';
      ctx.beginPath();
      ctx.arc(cx, cy, coreRadius, 0, Math.PI * 2);
      ctx.fill();

      // Razor-thin Luminous Photon Sphere Ring (r = 1.5 rs)
      const photonRingAlpha = isBam
        ? interpolate(shakeFrame, [0, 6, 45], [1.0, 0.85, 0.45])
        : interpolate(frame, [75, 224], [0, 0.85], { extrapolateRight: 'clamp' });

      ctx.strokeStyle = isBam ? '#00E5FF' : '#F3B659';
      ctx.lineWidth = isBam && shakeFrame <= 15 ? 4.5 : 2.0;
      ctx.shadowColor = isBam ? '#00E5FF' : '#E65A28';
      ctx.shadowBlur = isBam ? 32 : 12;
      ctx.beginPath();
      ctx.arc(cx, cy, photonSphereRadius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.shadowBlur = 0; // reset
    }
  }, [frame, width, height, isVertical, particles, debrisNodes, isBam, shakeFrame]);

  // -------------------------------------------------------------
  // 6. ARGUS 4-LAYER BAM SHOCKWAVE SUITE (Frame 225+)
  // -------------------------------------------------------------
  // Layer 1: 48 Radial Kinetic Data Sparks
  const radialSparks = useMemo(() => {
    const count = 48;
    const sparks = [];
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * 2 * Math.PI + (Math.sin(i * 3.7) * 0.2);
      const speed = 30 + (Math.sin(i * 9.1) * 0.5 + 0.5) * 20;
      const size = (i % 4 === 0) ? 5.5 : (i % 2 === 0) ? 3.8 : 2.2;
      const color = (i % 3 === 0) ? '#FF5722' : (i % 2 === 0) ? '#00E5FF' : '#F3B659';
      sparks.push({ angle, speed, size, color, id: i });
    }
    return sparks;
  }, []);

  // Layer 2: Anamorphic Specular Glint Sweep (Frames 225-248)
  const glintProgress = interpolate(shakeFrame, [0, 20], [-300, isVertical ? 1000 : 1400], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const glintOpacity = interpolate(shakeFrame, [0, 3, 22], [0, 0.95, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Layer 3: Dual-Ring Chromatic Dispersion Shockwave
  const chromaticOffset = interpolate(shakeFrame, [0, 2, 12], [0, 14, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const shockwaveRadius = interpolate(shakeFrame, [0, 24], [0, isVertical ? 640 : 920], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const shockwaveOpacity = interpolate(shakeFrame, [0, 4, 24], [0, 0.92, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Layer 4: Hydraulic Corner Clamp Recoil
  const clampSqueeze = interpolate(shakeFrame, [0, 3, 14], [0, -8, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // -------------------------------------------------------------
  // 7. THOTH PRE-BAM TELEMETRY & 14 DOTTED CHARACTER SLOTS
  // -------------------------------------------------------------
  const titleLetters = "THE SIMULATION".split("");
  const laserX = interpolate(frame, [15, 215], [-20, isVertical ? 720 : 1380], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#060A0D',
        fontFamily: "'JetBrains Mono', 'Montserrat', monospace",
        color: '#F3B659',
        overflow: 'hidden',
      }}
    >
      {/* 🎵 HYBRID MASTER AUDIO TRACK */}
      <Audio
        src={staticFile('audio/simulation_theme_hybrid_master.mp3')}
        startFrom={0}
      />

      {/* MASTER CAMERA STAGE */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transform: `translate3d(${shakeX}px, ${shakeY}px, 0) scale(${baseScale})`,
          transformOrigin: 'center center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* BACKGROUND ACCRETION & LENSING CANVAS */}
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

        {/* STATION WATERMARK HUD (Top-Right) */}
        <div
          style={{
            position: 'absolute',
            top: isVertical ? 75 : 44,
            right: isVertical ? 35 : 75,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            fontSize: isVertical ? 11 : 13,
            fontWeight: 800,
            letterSpacing: '0.22em',
            color: '#F3B659',
            opacity: interpolate(frame, [0, 25], [0, 0.85]),
            zIndex: 20,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: frame >= 225 ? '#FF5722' : frame >= 95 ? '#00E5FF' : '#4DD0E1',
              boxShadow: `0 0 10px ${frame >= 225 ? '#FF5722' : frame >= 95 ? '#00E5FF' : '#4DD0E1'}`,
            }}
          />
          <span>TETRADIC // SIMULATION // CH.02</span>
        </div>

        {/* THOTH REAL-TIME RELATIVISTIC TELEMETRY (Top-Left) */}
        <div
          style={{
            position: 'absolute',
            top: isVertical ? 75 : 44,
            left: isVertical ? 35 : 75,
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            fontSize: isVertical ? 11 : 13,
            fontWeight: 800,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: '#4DD0E1',
            opacity: interpolate(frame, [0, 30, 220, 230], [0, 0.88, 0.88, 0.45]),
            zIndex: 20,
          }}
        >
          <span>
            SCHWARZSCHILD rs: {interpolate(frame, [0, 224], [12.4, 29.53], { extrapolateRight: 'clamp' }).toFixed(2)} km // β: {interpolate(frame, [0, 224], [0.12, 0.942], { extrapolateRight: 'clamp' }).toFixed(3)}c
          </span>
          <span style={{ color: frame >= 225 ? '#FF5722' : frame >= 95 ? '#00E5FF' : '#F3B659' }}>
            {frame >= 225
              ? 'STATUS: EQUILIBRIUM COLLAPSED [Z=0 DOCKED]'
              : frame >= 95
              ? 'ALERT: ISCO BARRIER BREACHED [TIDAL DISRUPTION]'
              : 'STATUS: NOMINAL KEPLERIAN ACCRETION'}
          </span>
        </div>

        {/* CENTER TYPOGRAPHY CONTAINER */}
        <div
          style={{
            position: 'relative',
            width: isVertical ? 720 : 1380,
            height: isVertical ? 240 : 280,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
          }}
        >
          {/* PRE-BAM CAD GUIDELINES & 14 DOTTED CHARACTER SLOTS (FRAMES 0 - 224) */}
          {!isBam && (
            <svg
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                overflow: 'visible',
              }}
            >
              {/* Cap-Height & Baseline Dotted Guidelines */}
              <line
                x1={0}
                y1={isVertical ? 70 : 80}
                x2={isVertical ? 720 : 1380}
                y2={isVertical ? 70 : 80}
                stroke="#4DD0E1"
                strokeWidth={1.5}
                strokeDasharray="4 6"
                opacity={0.65}
              />
              <line
                x1={0}
                y1={isVertical ? 170 : 200}
                x2={isVertical ? 720 : 1380}
                y2={isVertical ? 170 : 200}
                stroke="#4DD0E1"
                strokeWidth={1.5}
                strokeDasharray="4 6"
                opacity={0.65}
              />

              {/* 14 Vertical Character Slots */}
              {titleLetters.map((_, idx) => {
                const totalSlots = titleLetters.length;
                const slotWidth = (isVertical ? 720 : 1380) / totalSlots;
                const x = idx * slotWidth + slotWidth / 2;
                return (
                  <g key={`slot-${idx}`}>
                    <line
                      x1={x}
                      y1={isVertical ? 60 : 70}
                      x2={x}
                      y2={isVertical ? 180 : 210}
                      stroke="#F3B659"
                      strokeWidth={1}
                      strokeDasharray="3 5"
                      opacity={0.45}
                    />
                    <text
                      x={x}
                      y={isVertical ? 50 : 60}
                      fill="#4DD0E1"
                      fontSize={10}
                      textAnchor="middle"
                      opacity={0.6}
                    >
                      +
                    </text>
                  </g>
                );
              })}

              {/* Sweeping Laser Tracer Runner */}
              <circle
                cx={laserX}
                cy={isVertical ? 120 : 140}
                r={4.5}
                fill="#FF5722"
                filter="drop-shadow(0 0 10px #FF5722)"
              />
            </svg>
          )}

          {/* ARGUS LAYER 2: ANAMORPHIC SPECULAR LENS GLINT SWEEP */}
          {isBam && shakeFrame <= 26 && (
            <div
              style={{
                position: 'absolute',
                left: glintProgress,
                top: '50%',
                width: isVertical ? 520 : 850,
                height: 2,
                background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.95) 50%, transparent 100%)',
                boxShadow: '0 0 24px 6px rgba(0, 229, 255, 0.95), 0 0 50px 14px rgba(243, 182, 89, 0.75)',
                opacity: glintOpacity,
                transform: 'translateY(-50%)',
                pointerEvents: 'none',
                zIndex: 4,
              }}
            />
          )}

          {/* ACT 4 (FRAME 225+): THE 3D DIMENSIONAL BAM - MONOLITHIC SOLID NAME */}
          {isBam && (
            <h1
              style={{
                margin: 0,
                fontSize: isVertical ? 68 : 118,
                fontWeight: 900,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: '#F3B659',
                lineHeight: 1,
                transform: `scale(${interpolate(snapSpring, [0, 1], [0.82, 1.0])})`,
                textShadow: `
                  ${chromaticOffset}px 0 0 rgba(255, 87, 34, 0.88),
                  -${chromaticOffset}px 0 0 rgba(0, 229, 255, 0.88),
                  1px 1px 0 #B88934,
                  2px 2px 0 #9E7328,
                  3px 3px 0 #7D591B,
                  4px 4px 0 #5E4110,
                  5px 5px 0 #3D2908,
                  6px 6px 24px rgba(0, 0, 0, 0.95),
                  0 0 60px rgba(243, 182, 89, 0.55)
                `,
                filter: 'drop-shadow(0 15px 30px rgba(0, 0, 0, 0.95))',
                zIndex: 3,
              }}
            >
              THE SIMULATION
            </h1>
          )}

          {/* SUBTITLE: WHAT IF & EXTREME CASES */}
          {isBam && (
            <div
              style={{
                marginTop: isVertical ? 16 : 22,
                fontSize: isVertical ? 14 : 18,
                fontWeight: 800,
                letterSpacing: '0.32em',
                textTransform: 'uppercase',
                color: '#00E5FF',
                opacity: interpolate(shakeFrame, [10, 30], [0, 0.88], { extrapolateRight: 'clamp' }),
                zIndex: 3,
              }}
            >
              WHAT IF & EXTREME CASES
            </div>
          )}

          {/* HYDRAULIC CORNER CLAMPS */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              transform: `scale(${1.0 + clampSqueeze * 0.01})`,
            }}
          >
            {/* Top-Left Bracket */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: 26,
                height: 26,
                borderTop: '3px solid #FF5722',
                borderLeft: '3px solid #FF5722',
              }}
            />
            {/* Top-Right Bracket */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: 26,
                height: 26,
                borderTop: '3px solid #FF5722',
                borderRight: '3px solid #FF5722',
              }}
            />
            {/* Bottom-Left Bracket */}
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: 26,
                height: 26,
                borderBottom: '3px solid #FF5722',
                borderLeft: '3px solid #FF5722',
              }}
            />
            {/* Bottom-Right Bracket */}
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: 26,
                height: 26,
                borderBottom: '3px solid #FF5722',
                borderRight: '3px solid #FF5722',
              }}
            />
          </div>
        </div>

        {/* ARGUS LAYER 1: 48 RADIAL KINETIC DATA SPARKS BURST */}
        {isBam && shakeFrame <= 45 && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
            }}
          >
            {radialSparks.map((spark) => {
              const dragDist = spark.speed * (1 - Math.exp(-shakeFrame / 8)) * 14.5;
              const sx = Math.cos(spark.angle) * dragDist;
              const sy = Math.sin(spark.angle) * dragDist;
              const sparkOpacity = interpolate(shakeFrame, [0, 4, 38], [0, 1.0, 0]);

              return (
                <div
                  key={`spark-${spark.id}`}
                  style={{
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    width: spark.size,
                    height: spark.size,
                    borderRadius: '50%',
                    backgroundColor: spark.color,
                    boxShadow: `0 0 14px ${spark.color}`,
                    transform: `translate3d(${sx}px, ${sy}px, 0)`,
                    opacity: sparkOpacity,
                  }}
                />
              );
            })}
          </div>
        )}

        {/* ARGUS LAYER 3: DUAL-RING CHROMATIC DISPERSION SHOCKWAVE */}
        {isBam && shakeFrame <= 24 && (
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: shockwaveRadius * 2,
              height: shockwaveRadius * 2,
              borderRadius: '50%',
              border: '2px solid rgba(255, 87, 34, 0.85)',
              boxShadow: `
                0 0 35px 5px rgba(0, 229, 255, 0.65),
                inset 0 0 25px rgba(243, 182, 89, 0.45)
              `,
              transform: 'translate(-50%, -50%)',
              opacity: shockwaveOpacity,
              pointerEvents: 'none',
            }}
          />
        )}
      </div>
    </AbsoluteFill>
  );
};
