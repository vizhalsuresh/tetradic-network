import React, { useMemo } from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Audio,
  staticFile,
} from 'remotion';

export const SimulationTitleC_QuantumLattice: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isVertical = height > width;

  // -------------------------------------------------------------
  // 1. ACT TIMELINE DEFINITION (360 Frames @ 30 FPS = 12.0s)
  // Act 1: Euclidean Ordered Lattice (F0 - F75 / 0.0s - 2.5s)
  // Act 2: Torsional Shear & Strut Fracture (F75 - F225 / 2.5s - 7.5s)
  // Act 3: Dimensional Snap-Lock BAM (F225 / 7.50s)
  // Act 4: Monolithic Isometric Cage Hero Hold (F225 - F360 / 4.5s)
  // -------------------------------------------------------------
  const isBam = frame >= 225;
  const shakeFrame = Math.max(0, frame - 225);

  // -------------------------------------------------------------
  // 2. CAMERA CHOREOGRAPHY
  // -------------------------------------------------------------
  const baseScale = interpolate(frame, [0, 220, 225, 360], [1.0, 1.035, 1.0, 1.035], {
    extrapolateRight: 'clamp',
  });

  const snapSpring = spring({
    frame: shakeFrame,
    fps,
    config: { damping: 13, stiffness: 200, mass: 1.1 },
  });

  const shakeIntensity = interpolate(shakeFrame, [0, 4, 18], [15, 7, 0], {
    extrapolateRight: 'clamp',
  });
  const shakeX = Math.sin(shakeFrame * 2.1) * shakeIntensity;
  const shakeY = Math.cos(shakeFrame * 1.7) * (shakeIntensity * 0.7);

  // -------------------------------------------------------------
  // 3. ARGUS CTO SUITE: Hexagonal Lattice & Graph Laplacian Struts
  // -------------------------------------------------------------
  const { nodes, edges } = useMemo(() => {
    const cols = isVertical ? 9 : 15;
    const rows = isVertical ? 14 : 9;
    const spacingX = (isVertical ? 900 : 1600) / (cols - 1);
    const spacingY = (isVertical ? 1500 : 900) / (rows - 1);
    const offsetX = (width - (cols - 1) * spacingX) / 2;
    const offsetY = (height - (rows - 1) * spacingY) / 2;

    const nodeList = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = offsetX + c * spacingX + (r % 2 === 1 ? spacingX * 0.5 : 0);
        const y = offsetY + r * spacingY;
        const id = r * cols + c;
        nodeList.push({ id, r, c, x, y });
      }
    }

    const edgeList = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const curr = r * cols + c;
        // Horizontal strut
        if (c < cols - 1) {
          edgeList.push({ from: curr, to: curr + 1, id: `${curr}-${curr + 1}` });
        }
        // Vertical strut
        if (r < rows - 1) {
          edgeList.push({ from: curr, to: curr + cols, id: `${curr}-${curr + cols}` });
        }
        // Diagonal strut (for triangulation)
        if (r < rows - 1 && c < cols - 1) {
          edgeList.push({ from: curr, to: curr + cols + 1, id: `${curr}-${curr + cols + 1}` });
        }
      }
    }

    return { nodes: nodeList, edges: edgeList };
  }, [width, height, isVertical]);

  // Dynamic Torsional Shear & Wave Displacements
  const strainFactor = isBam
    ? 0.0
    : interpolate(frame, [75, 224], [0.0, 1.0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });

  const nodePositions = useMemo(() => {
    return nodes.map((n) => {
      if (isBam) {
        // Collapsed into an isometric framing cage around the center
        const cx = width / 2;
        const cy = height / 2;
        const dx = n.x - cx;
        const dy = n.y - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        // Pull vertices into a rigid perimeter frame
        const lockX = cx + (dx / (dist + 1e-4)) * Math.max(isVertical ? 380 : 720, dist * 0.75);
        const lockY = cy + (dy / (dist + 1e-4)) * Math.max(isVertical ? 150 : 170, dist * 0.65);
        return { ...n, x: lockX, y: lockY };
      }

      // Quantum probability undulation + torsional shear
      const wave = Math.sin((n.x * 0.004) + (n.y * 0.005) - (frame * 0.08)) * 8;
      const shearAngle = strainFactor * 0.35;
      const cx = width / 2;
      const cy = height / 2;
      const relX = n.x - cx;
      const relY = n.y - cy;

      const shearedX = cx + relX * Math.cos(shearAngle) - relY * Math.sin(shearAngle) + (n.r % 2 === 0 ? wave : -wave);
      const shearedY = cy + relX * Math.sin(shearAngle) + relY * Math.cos(shearAngle) + wave;

      return { ...n, x: shearedX, y: shearedY };
    });
  }, [nodes, frame, strainFactor, isBam, width, height, isVertical]);

  // -------------------------------------------------------------
  // 4. ARGUS 4-LAYER BAM EFFECTS SUITE
  // -------------------------------------------------------------
  const radialSparks = useMemo(() => {
    const count = 48;
    const sparks = [];
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * 2 * Math.PI + (Math.sin(i * 3.9) * 0.2);
      const speed = 28 + (Math.sin(i * 8.4) * 0.5 + 0.5) * 18;
      const size = (i % 4 === 0) ? 5.0 : (i % 2 === 0) ? 3.4 : 2.0;
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
  // 5. THOTH PRE-BAM TELEMETRY & DOTTED SLOTS
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
      {/* 🎵 AUDIO TRACK: Theme C Singularity Vacuum */}
      <Audio
        src={staticFile('audio/simulation_theme_C_singularity_vacuum.mp3')}
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
        {/* STRUCTURAL LATTICE SVG */}
        <svg
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
          }}
        >
          {/* Connecting Struts */}
          {edges.map((e) => {
            const n1 = nodePositions[e.from];
            const n2 = nodePositions[e.to];
            if (!n1 || !n2) return null;

            // Fracture logic: At high strain, high-index struts snap
            const isFractured = !isBam && strainFactor > 0.65 && ((e.from + e.to) % 7 === 0);
            if (isFractured) return null;

            let strokeColor = '#4DD0E1';
            if (strainFactor > 0.3) {
              strokeColor = strainFactor > 0.7 ? '#E65A28' : '#F3B659';
            }
            if (isBam) {
              strokeColor = 'rgba(243, 182, 89, 0.4)';
            }

            return (
              <line
                key={e.id}
                x1={n1.x}
                y1={n1.y}
                x2={n2.x}
                y2={n2.y}
                stroke={strokeColor}
                strokeWidth={isBam ? 1.5 : 1.0}
                opacity={isBam ? 0.35 : 0.6}
              />
            );
          })}

          {/* Lattice Node Junctions */}
          {nodePositions.map((n) => (
            <circle
              key={`node-${n.id}`}
              cx={n.x}
              cy={n.y}
              r={isBam ? 2.5 : 2.0}
              fill={isBam ? '#E65A28' : '#4DD0E1'}
              opacity={isBam ? 0.6 : 0.8}
            />
          ))}
        </svg>

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
          <span>LATTICE INTEGRITY: {isBam ? '100% COLLAPSED' : `${(100 - strainFactor * 87.6).toFixed(1)}%`}</span>
          <span style={{ color: frame >= 180 ? '#E65A28' : '#F3B659' }}>
            {frame >= 225 ? 'PHASE: ISOMETRIC CHASSIS LOCKED' : frame >= 180 ? 'VON MISES: CRITICAL YIELD' : 'LATTICE: ELASTIC STABLE'}
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
