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

export const SimulationTitleB_VelocitySwarm: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isVertical = height > width;
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // -------------------------------------------------------------
  // 1. ACT TIMELINE DEFINITION (360 Frames @ 30 FPS = 12.0s)
  // Act 1: Laminar Flow Baseline (F0 - F75 / 0.0s - 2.5s)
  // Act 2: Turbulent Vortex Shear (F75 - F225 / 2.5s - 7.5s)
  // Act 3: Supersonic Shock BAM & Text Lock (F225 / 7.50s)
  // Act 4: Boundary Streamline Hero Hold (F225 - F360 / 4.5s)
  // -------------------------------------------------------------
  const isBam = frame >= 225;
  const shakeFrame = Math.max(0, frame - 225);

  // -------------------------------------------------------------
  // 2. CAMERA CHOREOGRAPHY: Tectonic recoil on Frame 225
  // -------------------------------------------------------------
  const baseScale = interpolate(frame, [0, 220, 225, 360], [1.0, 1.035, 1.0, 1.035], {
    extrapolateRight: 'clamp',
  });

  const snapSpring = spring({
    frame: shakeFrame,
    fps,
    config: { damping: 13, stiffness: 190, mass: 1.1 },
  });

  const shakeIntensity = interpolate(shakeFrame, [0, 4, 18], [15, 7, 0], {
    extrapolateRight: 'clamp',
  });
  const shakeX = Math.sin(shakeFrame * 1.9) * shakeIntensity;
  const shakeY = Math.cos(shakeFrame * 2.3) * (shakeIntensity * 0.7);

  // -------------------------------------------------------------
  // 3. ARGUS CTO SUITE: 8,000 Curl Noise RK4 Swarm Particles
  // -------------------------------------------------------------
  const particles = useMemo(() => {
    const count = 8000;
    const arr = [];
    let seed = 1337;
    const rnd = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };

    for (let i = 0; i < count; i++) {
      const x0 = rnd() * 1920;
      const y0 = rnd() * 1080;
      const speed = 1.8 + rnd() * 2.5;
      const length = 4 + rnd() * 8;
      const streamId = i % 5;
      arr.push({ x0, y0, speed, length, streamId });
    }
    return arr;
  }, []);

  // -------------------------------------------------------------
  // 4. CANVAS RENDER LOOP: Analytical Curl Field & Motion Trails
  // -------------------------------------------------------------
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    const cx = width / 2;
    const cy = height / 2;

    // Turbulence intensity factor tau(t)
    const turbulence = isBam
      ? 0.15 + 0.05 * Math.sin(frame * 0.05)
      : interpolate(frame, [75, 224], [0.05, 1.0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });

    // Supersonic shockwave radius
    const shockRadius = isBam ? interpolate(shakeFrame, [0, 24], [0, isVertical ? 650 : 950]) : 0;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      // Base laminar motion from left to right
      let px = (p.x0 + frame * p.speed * 4.2) % width;
      let py = p.y0;

      // Distance from center vortex
      const dx = px - cx;
      const dy = py - cy;
      const dist = Math.sqrt(dx * dx + dy * dy) + 1e-4;

      // If shockwave has passed this particle, push it radially outward
      if (isBam && shockRadius > 0 && dist < shockRadius + 120) {
        const shockPush = interpolate(dist, [shockRadius - 120, shockRadius], [40, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        px += (dx / dist) * shockPush;
        py += (dy / dist) * shockPush;
      }

      // Analytical curl noise vortex: v_theta = gamma / (2 * pi * r)
      if (turbulence > 0.08) {
        const angle = Math.atan2(dy, dx);
        const vortexPull = (1.0 / Math.pow(Math.max(40, dist), 0.75)) * 140 * turbulence;
        const swirlAngle = angle + vortexPull;
        const warpedR = Math.max(30, dist - (turbulence * 45 * Math.sin(frame * 0.08 + i)));

        px = cx + Math.cos(swirlAngle) * warpedR;
        py = cy + Math.sin(swirlAngle) * (warpedR * (isVertical ? 0.75 : 0.55));
      }

      // Strain-based color mapping:
      // Low strain -> Cyan (#4DD0E1), High strain -> Gold (#F3B659), Critical -> Orange (#E65A28)
      let color = '#4DD0E1';
      if (turbulence > 0.3 && dist < 420) {
        color = dist < 180 ? '#E65A28' : '#F3B659';
      }

      const alpha = interpolate(dist, [0, 80, isVertical ? 500 : 850], [0.2, 0.9, 0.25], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });

      ctx.fillStyle = color;
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.arc(px, py, 1.8, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1.0;
  }, [frame, width, height, isVertical, particles, isBam, shakeFrame]);

  // -------------------------------------------------------------
  // 5. ARGUS 4-LAYER BAM EFFECTS SUITE
  // -------------------------------------------------------------
  const radialSparks = useMemo(() => {
    const count = 48;
    const sparks = [];
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * 2 * Math.PI + (Math.sin(i * 4.3) * 0.2);
      const speed = 30 + (Math.sin(i * 8.7) * 0.5 + 0.5) * 16;
      const size = (i % 4 === 0) ? 4.8 : (i % 2 === 0) ? 3.2 : 2.0;
      const color = (i % 3 === 0) ? '#E65A28' : (i % 2 === 0) ? '#4DD0E1' : '#F3B659';
      sparks.push({ angle, speed, size, color, id: i });
    }
    return sparks;
  }, []);

  const glintProgress = interpolate(shakeFrame, [0, 20], [-300, isVertical ? 1000 : 1400], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const glintOpacity = interpolate(shakeFrame, [0, 3, 22], [0, 0.95, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const chromaticOffset = interpolate(shakeFrame, [0, 2, 12], [0, 12, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const shockwaveRadius = interpolate(shakeFrame, [0, 24], [0, isVertical ? 650 : 920], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const shockwaveOpacity = interpolate(shakeFrame, [0, 4, 24], [0, 0.85, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const clampSqueeze = interpolate(shakeFrame, [0, 3, 14], [0, -7, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // -------------------------------------------------------------
  // 6. THOTH PRE-BAM TELEMETRY & 14 DOTTED SLOTS
  // -------------------------------------------------------------
  const titleLetters = "THE SIMULATION".split("");
  const laserX = interpolate(frame, [15, 215], [-20, isVertical ? 720 : 1380], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#0A0D0F',
        fontFamily: "'JetBrains Mono', 'Montserrat', monospace",
        color: '#F3B659',
        overflow: 'hidden',
      }}
    >
      {/* 🎵 AUDIO TRACK: Theme B Kinetic Cascade */}
      <Audio
        src={staticFile('audio/simulation_theme_B_kinetic_cascade.mp3')}
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
        {/* VELOCITY FIELD CANVAS */}
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

        {/* THOTH HUD TELEMETRY OVERLAY */}
        <div
          style={{
            position: 'absolute',
            top: isVertical ? 80 : 54,
            left: isVertical ? 40 : 80,
            right: isVertical ? 40 : 80,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: isVertical ? 12 : 14,
            fontWeight: 800,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: '#4DD0E1',
            opacity: interpolate(frame, [0, 30, 220, 230], [0, 0.85, 0.85, 0.45]),
          }}
        >
          <span>REYNOLDS: Re={interpolate(frame, [0, 224], [42, 142000], { extrapolateRight: 'clamp' }).toFixed(0)}</span>
          <span style={{ color: frame >= 180 ? '#E65A28' : '#F3B659' }}>
            {frame >= 225 ? 'SHEAR: CRITICAL SHOCK DETONATED' : frame >= 180 ? 'VORTICITY: KELVIN-HELMHOLTZ' : 'FLOW: LAMINAR STEADY'}
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
          {/* PRE-BAM CAD GUIDELINES & 14 DOTTED CHARACTER SLOTS */}
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

              <circle
                cx={laserX}
                cy={isVertical ? 120 : 140}
                r={4}
                fill="#E65A28"
                filter="drop-shadow(0 0 8px #E65A28)"
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
                boxShadow: '0 0 20px 5px rgba(77, 208, 225, 0.9), 0 0 45px 12px rgba(243, 182, 89, 0.7)',
                opacity: glintOpacity,
                transform: 'translateY(-50%)',
                pointerEvents: 'none',
                zIndex: 4,
              }}
            />
          )}

          {/* ACT 4 (FRAME 225+): THE 3D DIMENSIONAL BAM */}
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
                  ${chromaticOffset}px 0 0 rgba(230, 90, 40, 0.85),
                  -${chromaticOffset}px 0 0 rgba(77, 208, 225, 0.85),
                  1px 1px 0 #B88934,
                  2px 2px 0 #9E7328,
                  3px 3px 0 #7D591B,
                  4px 4px 0 #5E4110,
                  5px 5px 0 #3D2908,
                  6px 6px 22px rgba(0, 0, 0, 0.95),
                  0 0 55px rgba(243, 182, 89, 0.5)
                `,
                filter: 'drop-shadow(0 15px 30px rgba(0, 0, 0, 0.95))',
                zIndex: 3,
              }}
            >
              THE SIMULATION
            </h1>
          )}

          {/* SUBTITLE */}
          {isBam && (
            <div
              style={{
                marginTop: isVertical ? 16 : 22,
                fontSize: isVertical ? 14 : 18,
                fontWeight: 800,
                letterSpacing: '0.32em',
                textTransform: 'uppercase',
                color: '#4DD0E1',
                opacity: interpolate(shakeFrame, [10, 30], [0, 0.85], { extrapolateRight: 'clamp' }),
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
            <div style={{ position: 'absolute', top: 0, left: 0, width: 24, height: 24, borderTop: '3px solid #E65A28', borderLeft: '3px solid #E65A28' }} />
            <div style={{ position: 'absolute', top: 0, right: 0, width: 24, height: 24, borderTop: '3px solid #E65A28', borderRight: '3px solid #E65A28' }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, width: 24, height: 24, borderBottom: '3px solid #E65A28', borderLeft: '3px solid #E65A28' }} />
            <div style={{ position: 'absolute', bottom: 0, right: 0, width: 24, height: 24, borderBottom: '3px solid #E65A28', borderRight: '3px solid #E65A28' }} />
          </div>
        </div>

        {/* ARGUS LAYER 1: 48 RADIAL KINETIC DATA SPARKS */}
        {isBam && shakeFrame <= 45 && (
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            {radialSparks.map((spark) => {
              const dragDist = spark.speed * (1 - Math.exp(-shakeFrame / 8)) * 14;
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

        {/* ARGUS LAYER 3: CHROMATIC ABERRATION DISPERSION SHOCKWAVE */}
        {isBam && shakeFrame <= 24 && (
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: shockwaveRadius * 2,
              height: shockwaveRadius * 2,
              borderRadius: '50%',
              border: '2px solid rgba(230, 90, 40, 0.8)',
              boxShadow: '0 0 30px 4px rgba(77, 208, 225, 0.6), inset 0 0 20px rgba(243, 182, 89, 0.4)',
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
