import React, { useMemo } from 'react';
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

export const BlueprintHybridGenesis: React.FC<BlueprintTitleProps> = ({
  aspectRatio = '16:9',
  episodeCode = 'BP-001',
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isVertical = aspectRatio === '9:16' || height > width;

  // ========================================================
  // 1. ACT PROGRESSION & CHOREOGRAPHY (12.0s / 360 FRAMES)
  // ========================================================
  // Act 1: Technical Drafting (Frames 0 -> 100)
  const drawProgress = interpolate(frame, [0, 95], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Act 2: Current Surge & 3D Axonometric Lift-Off (Frames 95 -> 165)
  const surgeIntensity = interpolate(frame, [95, 135, 175], [0, 1, 0.25], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const liftSpring = spring({
    frame: frame - 95,
    fps,
    config: { damping: 16, stiffness: 45, mass: 1.2 },
  });

  // Act 3: Exploded Wireframe Matrix in Flight (Frames 155 -> 225)
  const layerSpreadSpring = spring({
    frame: frame - 150,
    fps,
    config: { damping: 15, stiffness: 60, mass: 1.0 },
  });

  // Act 4: Orthographic Snap Lock (The 3D Dimensional BAM at Frame 225)
  const snapSpring = spring({
    frame: frame - 225,
    fps,
    config: { damping: 12, stiffness: 120, mass: 0.95 },
  });

  const isBam = frame >= 225;
  const shakeFrame = frame - 225;

  // ========================================================
  // 2. CAMERA CHOREOGRAPHY & SCREEN SHAKE RECOIL
  // ========================================================
  const rotX = interpolate(liftSpring, [0, 1], [0, 34]) * (1 - snapSpring) - (frame * 0.012 * (1 - snapSpring));
  const rotY = interpolate(liftSpring, [0, 1], [0, -26]) * (1 - snapSpring) + (frame * 0.024 * (1 - snapSpring));
  const rotZ = interpolate(liftSpring, [0, 1], [0, 8]) * (1 - snapSpring);

  // Act 4 Hero Micro-Push: slow push-in during the 4.5s hero hold
  const heroMicroPush = isBam ? interpolate(shakeFrame, [0, 135], [1.0, 1.035]) : 1.0;
  const scale = interpolate(snapSpring, [0, 1], [0.86 + liftSpring * 0.06, 1.0]) * heroMicroPush;

  // Screen shake on magnetic snap impact (Frames 225-250)
  const shakeIntensity = interpolate(shakeFrame, [0, 2, 8, 24], [0, 18, 5, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const shakeX = Math.sin(shakeFrame * 2.2) * shakeIntensity;
  const shakeY = Math.cos(shakeFrame * 2.6) * shakeIntensity;

  // Radial spark shockwave flash on impact
  const sparkFlash = interpolate(shakeFrame, [0, 2, 16], [0, 0.85, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // ========================================================
  // 3. LAYER DEPTH SEPARATION (Z-AXIS)
  // ========================================================
  const zBack = interpolate(snapSpring, [0, 1], [-190 * layerSpreadSpring, 0]);
  const zCircuits = interpolate(snapSpring, [0, 1], [-85 * layerSpreadSpring, 0]);
  const zText = interpolate(snapSpring, [0, 1], [45 * layerSpreadSpring, 0]);
  const zHUD = interpolate(snapSpring, [0, 1], [165 * layerSpreadSpring, 0]);

  // KinoBokeh Depth Blur on Backplane
  const backplaneBlur = interpolate(snapSpring, [0, 0.85, 1], [3.2 * layerSpreadSpring, 0.8, 0]);

  // Ray Optics Specular Glass Sheen Progress (Frames 110 -> 225)
  const sheenProgress = interpolate(frame, [110, 225], [-40, 160]);

  // Dynamic Z-Caliper Separation Readout
  const currentZDelta = Math.round(interpolate(snapSpring, [0, 1], [355 * layerSpreadSpring, 0]));

  // ========================================================
  // 4. SUSPENDED 3D DATA PARTICLES (24 NODES)
  // ========================================================
  const particles = useMemo(() => {
    const list = [];
    for (let i = 0; i < 24; i++) {
      const x = ((Math.sin(i * 997) * 0.5 + 0.5) * 1200) - 600;
      const y = ((Math.cos(i * 613) * 0.5 + 0.5) * 500) - 250;
      const z = ((Math.sin(i * 389) * 0.5 + 0.5) * 280) - 140;
      const size = (i % 3 === 0) ? 3.5 : 2;
      const color = (i % 4 === 0) ? '#E65A28' : (i % 2 === 0) ? '#4DD0E1' : '#F3B659';
      list.push({ x, y, z, size, color, id: i });
    }
    return list;
  }, []);

  // Traveling electrical sparks along circuit traces (Act 2)
  const sparkX = interpolate(frame, [95, 165], [100, 1200]);

  // ========================================================
  // 5. ARGUS CTO SUITE: 48 RADIAL KINETIC DATA SPARKS
  // ========================================================
  const radialSparks = useMemo(() => {
    const count = 48;
    const sparks = [];
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * 2 * Math.PI + (Math.sin(i * 3.7) * 0.2);
      const speed = 26 + (Math.sin(i * 9.1) * 0.5 + 0.5) * 16;
      const size = (i % 4 === 0) ? 4.5 : (i % 2 === 0) ? 3.0 : 2.0;
      const color = (i % 3 === 0) ? '#E65A28' : (i % 2 === 0) ? '#4DD0E1' : '#F3B659';
      sparks.push({ angle, speed, size, color, id: i });
    }
    return sparks;
  }, []);

  // Argus Layer 2: Anamorphic Specular Glint Sweep (Frames 225-248)
  const glintProgress = interpolate(shakeFrame, [0, 20], [-250, isVertical ? 950 : 1350], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const glintOpacity = interpolate(shakeFrame, [0, 3, 22], [0, 0.95, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Argus Layer 3: Chromatic Aberration Dispersion Shockwave (Frames 225-242)
  const chromaticOffset = interpolate(shakeFrame, [0, 2, 12], [0, 10, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const shockwaveRadius = interpolate(shakeFrame, [0, 20], [0, isVertical ? 550 : 800], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const shockwaveOpacity = interpolate(shakeFrame, [0, 4, 20], [0, 0.85, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Argus Layer 4: Hydraulic Clamp Inward Squeeze
  const clampSqueeze = interpolate(shakeFrame, [0, 3, 14], [0, -6, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#020A07',
        backgroundImage: 'radial-gradient(circle at 50% 48%, #0B493A 0%, #010403 100%)',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: "'JetBrains Mono', monospace",
        color: '#F3B659',
        overflow: 'hidden',
        perspective: 1600,
      }}
    >
      {/* Orpheus Master 12.0s Acoustic Guitar Strum Score */}
      <Audio src={staticFile('audio/blueprint_master_guitar_strum_12s.mp3')} />

      {/* Background Architectural Drafting Grid */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(to right, rgba(77, 208, 225, 0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(77, 208, 225, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          opacity: 0.85,
        }}
      />

      {/* Act 1 & 2: Architectural Construction Circles */}
      <svg
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          opacity: interpolate(snapSpring, [0, 1], [0.75, 0.25]),
        }}
      >
        <circle
          cx={width / 2}
          cy={height / 2}
          r={isVertical ? 280 : 360}
          fill="none"
          stroke={surgeIntensity > 0.4 ? '#E65A28' : 'rgba(77, 208, 225, 0.45)'}
          strokeWidth="1.5"
          strokeDasharray="8 6"
          strokeDashoffset={interpolate(drawProgress, [0, 1], [2200, 0])}
        />
        <circle
          cx={width / 2}
          cy={height / 2}
          r={isVertical ? 190 : 230}
          fill="none"
          stroke={surgeIntensity > 0.4 ? '#F3B659' : 'rgba(243, 182, 89, 0.4)'}
          strokeWidth="1.5"
          strokeDasharray="4 4"
          strokeDashoffset={interpolate(drawProgress, [0, 1], [1500, 0])}
        />
      </svg>

      {/* 3D Hardware Assembly Stage with Physical Shake Recoil */}
      <div
        style={{
          position: 'relative',
          width: isVertical ? 920 : 1380,
          height: isVertical ? 640 : 450,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          transformStyle: 'preserve-3d',
          transform: `
            translate3d(${shakeX}px, ${shakeY}px, 0)
            rotateX(${rotX}deg)
            rotateY(${rotY}deg)
            rotateZ(${rotZ}deg)
            scale(${scale})
          `,
        }}
      >
        {/* ======================================================== */}
        {/* LAYER 1: BACKPLANE CHASSIS (Z: -190px) + KINOBOKEH BLUR */}
        {/* ======================================================== */}
        <div
          style={{
            position: 'absolute',
            inset: -40,
            border: '1px solid rgba(243, 182, 89, 0.2)',
            backgroundColor: 'rgba(11, 73, 58, 0.38)',
            backgroundImage: `
              linear-gradient(to right, rgba(224, 247, 250, 0.08) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(224, 247, 250, 0.08) 1px, transparent 1px)
            `,
            backgroundSize: '32px 32px',
            transform: `translateZ(${zBack}px)`,
            boxShadow: '0 30px 80px rgba(0, 0, 0, 0.85)',
            filter: `blur(${backplaneBlur}px)`,
          }}
        />

        {/* ======================================================== */}
        {/* LAYER 2: CIRCUIT BUS & SPECULAR GLASS SHEEN (Z: -85px)  */}
        {/* ======================================================== */}
        <div
          style={{
            position: 'absolute',
            inset: -12,
            transform: `translateZ(${zCircuits}px)`,
            pointerEvents: 'none',
            overflow: 'hidden',
          }}
        >
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
            <path
              d="M 60 50 L 320 50 L 400 120 L 1150 120"
              fill="none"
              stroke="#E65A28"
              strokeWidth="2.5"
              strokeDasharray="12 6"
              strokeDashoffset={-frame * 2.2}
              opacity="0.9"
            />
            <path
              d="M 1320 400 L 1040 400 L 960 330 L 180 330"
              fill="none"
              stroke="#4DD0E1"
              strokeWidth="2"
              strokeDasharray="14 6"
              strokeDashoffset={frame * 2.4}
              opacity="0.85"
            />
            <circle cx="400" cy="120" r="6" fill="#E65A28" style={{ filter: 'drop-shadow(0 0 10px #E65A28)' }} />
            <circle cx="960" cy="330" r="6" fill="#4DD0E1" style={{ filter: 'drop-shadow(0 0 10px #4DD0E1)' }} />

            {/* Act 2: Traveling Electrical Spark */}
            {frame >= 95 && frame <= 165 && (
              <circle
                cx={sparkX}
                cy={120}
                r="7"
                fill="#FFFFFF"
                style={{ filter: 'drop-shadow(0 0 14px #E65A28)' }}
              />
            )}
          </svg>

          {/* Ray Optics Specular Light Sheen */}
          <div
            style={{
              position: 'absolute',
              top: -200,
              bottom: -200,
              width: 150,
              left: `${sheenProgress}%`,
              background: 'linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.02) 40%, rgba(243,182,89,0.24) 50%, rgba(255,255,255,0.05) 60%, transparent 100%)',
              transform: 'skewX(-26deg)',
              pointerEvents: 'none',
            }}
          />
        </div>

        {/* ======================================================== */}
        {/* SUSPENDED 3D DATA PARTICLES IN CORRIDOR                  */}
        {/* ======================================================== */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            transformStyle: 'preserve-3d',
            pointerEvents: 'none',
          }}
        >
          {particles.map((p) => {
            const particleZ = interpolate(snapSpring, [0, 1], [p.z * layerSpreadSpring, 0]);
            const driftY = Math.sin((frame * 0.03) + p.id) * 14;
            const driftX = Math.cos((frame * 0.025) + p.id) * 10;
            return (
              <div
                key={p.id}
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  width: p.size,
                  height: p.size,
                  borderRadius: '50%',
                  backgroundColor: p.color,
                  boxShadow: `0 0 10px ${p.color}`,
                  transform: `translate3d(${p.x + driftX}px, ${p.y + driftY}px, ${particleZ}px)`,
                  opacity: interpolate(snapSpring, [0, 0.9, 1], [0.85, 0.6, 0.2]),
                }}
              />
            );
          })}
        </div>

        {/* ======================================================== */}
        {/* LAYER 3: DOTTED CAD TRACER & HERO 3D BAM TYPOGRAPHY     */}
        {/* ======================================================== */}
        <div
          style={{
            position: 'relative',
            width: isVertical ? 860 : 1260,
            height: isVertical ? 240 : 180,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            transform: `translateZ(${zText}px)`,
            backgroundColor: isBam ? 'rgba(11, 73, 58, 0.65)' : 'rgba(2, 10, 7, 0.25)',
            border: isBam ? '2px solid rgba(243, 182, 89, 0.7)' : '1px dashed rgba(77, 208, 225, 0.4)',
            boxShadow: isBam ? '0 30px 90px rgba(0, 0, 0, 0.95)' : 'none',
            backdropFilter: isBam ? 'blur(8px)' : 'none',
            overflow: 'hidden',
          }}
        >
          {/* ACTS 1 - 3: DOTTED CAD LINES RUNNING THROUGH THE NAME */}
          <svg
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
              opacity: isBam ? interpolate(snapSpring, [0, 1], [0.5, 0.12]) : 1.0,
            }}
          >
            {/* Cap-Height Dotted Line */}
            <line
              x1="20"
              y1={isVertical ? 65 : 45}
              x2={isVertical ? 840 : 1240}
              y2={isVertical ? 65 : 45}
              stroke={surgeIntensity > 0.4 ? '#E65A28' : '#4DD0E1'}
              strokeWidth="1.5"
              strokeDasharray="6 6"
              strokeDashoffset={-frame * 2.2}
              opacity="0.75"
            />

            {/* Midline Dotted Line */}
            <line
              x1="10"
              y1={isVertical ? 120 : 90}
              x2={isVertical ? 850 : 1250}
              y2={isVertical ? 120 : 90}
              stroke={surgeIntensity > 0.4 ? '#F3B659' : '#4DD0E1'}
              strokeWidth="2"
              strokeDasharray="4 4"
              strokeDashoffset={frame * 2.8}
              opacity="0.9"
            />

            {/* Baseline Dotted Line */}
            <line
              x1="20"
              y1={isVertical ? 175 : 135}
              x2={isVertical ? 840 : 1240}
              y2={isVertical ? 175 : 135}
              stroke={surgeIntensity > 0.4 ? '#E65A28' : '#4DD0E1'}
              strokeWidth="1.5"
              strokeDasharray="8 6"
              strokeDashoffset={-frame * 2.4}
              opacity="0.75"
            />

            {/* 13 Vertical Dotted Letter Slot Dividers */}
            {Array.from({ length: 13 }).map((_, i) => {
              const totalWidth = isVertical ? 800 : 1200;
              const slotX = (isVertical ? 30 : 30) + ((i + 0.5) / 13) * totalWidth;
              const topY = isVertical ? 50 : 35;
              const botY = isVertical ? 190 : 145;
              const midY = isVertical ? 120 : 90;

              const tracerProgress = interpolate(frame, [20, 220], [0, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              });
              const isScanned = (i / 13) <= tracerProgress;
              const slotColor = isScanned
                ? (surgeIntensity > 0.4 ? '#E65A28' : '#F3B659')
                : 'rgba(77, 208, 225, 0.35)';

              return (
                <g key={`slot-${i}`}>
                  <line
                    x1={slotX}
                    y1={topY}
                    x2={slotX}
                    y2={botY}
                    stroke={slotColor}
                    strokeWidth="1.2"
                    strokeDasharray="3 3"
                    opacity={isScanned ? 0.85 : 0.3}
                  />
                  <line x1={slotX - 4} y1={midY} x2={slotX + 4} y2={midY} stroke={slotColor} strokeWidth="1.5" />
                  <line x1={slotX} y1={midY - 4} x2={slotX} y2={midY + 4} stroke={slotColor} strokeWidth="1.5" />
                  <line x1={slotX - 3} y1={topY} x2={slotX + 3} y2={topY} stroke={slotColor} strokeWidth="1.2" />
                  <line x1={slotX - 3} y1={botY} x2={slotX + 3} y2={botY} stroke={slotColor} strokeWidth="1.2" />
                </g>
              );
            })}

            {/* Dotted Laser Runner / Scanner (Sweeps through until Frame 225) */}
            {frame < 225 && (
              <g>
                {(() => {
                  const totalWidth = isVertical ? 800 : 1200;
                  const curX = (isVertical ? 30 : 30) + interpolate(frame, [20, 220], [0, totalWidth], {
                    extrapolateLeft: 'clamp',
                    extrapolateRight: 'clamp',
                  });
                  const midY = isVertical ? 120 : 90;
                  const topY = isVertical ? 40 : 25;
                  const botY = isVertical ? 200 : 155;

                  return (
                    <g>
                      <line
                        x1={curX}
                        y1={topY}
                        x2={curX}
                        y2={botY}
                        stroke="#FFFFFF"
                        strokeWidth="2"
                        strokeDasharray="4 2"
                        style={{ filter: 'drop-shadow(0 0 8px #4DD0E1)' }}
                      />
                      <circle
                        cx={curX}
                        cy={midY}
                        r="5.5"
                        fill="#FFFFFF"
                        stroke="#E65A28"
                        strokeWidth="2"
                        style={{ filter: 'drop-shadow(0 0 12px #E65A28)' }}
                      />
                      <line
                        x1={curX - 16}
                        y1={midY}
                        x2={curX + 16}
                        y2={midY}
                        stroke="#FFFFFF"
                        strokeWidth="1.5"
                      />
                    </g>
                  );
                })()}
              </g>
            )}
          </svg>

          {/* ARGUS LAYER 2: ANAMORPHIC SPECULAR LENS GLINT SWEEP */}
          {isBam && shakeFrame <= 26 && (
            <div
              style={{
                position: 'absolute',
                left: glintProgress,
                top: isVertical ? '50%' : '50%',
                width: isVertical ? 500 : 800,
                height: 2,
                background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.85) 50%, transparent 100%)',
                boxShadow: '0 0 18px 4px rgba(77, 208, 225, 0.85), 0 0 40px 10px rgba(243, 182, 89, 0.6)',
                opacity: glintOpacity,
                transform: 'translateY(-50%)',
                pointerEvents: 'none',
                zIndex: 3,
              }}
            />
          )}

          {/* ACT 4 (FRAME 225+): THE 3D DIMENSIONAL BAM - MONOLITHIC SOLID NAME */}
          {isBam && (
            <h1
              style={{
                margin: 0,
                fontSize: isVertical ? 72 : 124,
                fontWeight: 900,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: '#F3B659',
                lineHeight: 1,
                transform: `scale(${interpolate(snapSpring, [0, 1], [0.80, 1.0])})`,
                textShadow: `
                  ${chromaticOffset}px 0 0 rgba(230, 90, 40, 0.8),
                  -${chromaticOffset}px 0 0 rgba(77, 208, 225, 0.8),
                  1px 1px 0 #B88934,
                  2px 2px 0 #9E7328,
                  3px 3px 0 #7D591B,
                  4px 4px 0 #5E4110,
                  5px 5px 0 #3D2908,
                  6px 6px 20px rgba(0, 0, 0, 0.9),
                  0 0 50px rgba(243, 182, 89, 0.45)
                `,
                filter: 'drop-shadow(0 15px 30px rgba(0, 0, 0, 0.9))',
                zIndex: 2,
              }}
            >
              THE BLUEPRINT
            </h1>
          )}
        </div>

        {/* ======================================================== */}
        {/* ARGUS LAYER 1: 48 RADIAL KINETIC DATA SPARKS BURST       */}
        {/* ======================================================== */}
        {isBam && shakeFrame <= 45 && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              transform: `translateZ(${zHUD}px)`,
            }}
          >
            {radialSparks.map((spark) => {
              // Aerodynamic drag physics: dist = v0 * (1 - e^-t/8) * 14
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
                    boxShadow: `0 0 12px ${spark.color}`,
                    transform: `translate3d(${sx}px, ${sy}px, 0)`,
                    opacity: sparkOpacity,
                  }}
                />
              );
            })}
          </div>
        )}

        {/* ======================================================== */}
        {/* ARGUS LAYER 3: CHROMATIC ABERRATION DISPERSION RING      */}
        {/* ======================================================== */}
        {isBam && shakeFrame <= 22 && (
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: shockwaveRadius * 2,
              height: shockwaveRadius * 2,
              borderRadius: '50%',
              border: '2px solid rgba(230, 90, 40, 0.85)',
              boxShadow: '0 0 25px #E65A28, inset 0 0 25px #4DD0E1',
              transform: 'translate(-50%, -50%)',
              opacity: shockwaveOpacity,
              pointerEvents: 'none',
              zIndex: 4,
            }}
          />
        )}

        {/* ======================================================== */}
        {/* LAYER 4: FLOATING HUD CORNER BRACKETS (Z: +165px)        */}
        {/* ======================================================== */}
        <div
          style={{
            position: 'absolute',
            inset: -14 + clampSqueeze,
            transform: `translateZ(${zHUD}px)`,
            pointerEvents: 'none',
            border: '2px solid rgba(230, 90, 40, 0.35)',
            transition: 'inset 0.05s ease',
          }}
        >
          {/* 4 Invariant Accent Orange Corner Hydraulic Brackets */}
          <div style={{ position: 'absolute', top: -5, left: -5, width: 34, height: 34, borderTop: '5px solid #E65A28', borderLeft: '5px solid #E65A28' }} />
          <div style={{ position: 'absolute', top: -5, right: -5, width: 34, height: 34, borderTop: '5px solid #E65A28', borderRight: '5px solid #E65A28' }} />
          <div style={{ position: 'absolute', bottom: -5, left: -5, width: 34, height: 34, borderBottom: '5px solid #E65A28', borderLeft: '5px solid #E65A28' }} />
          <div style={{ position: 'absolute', bottom: -5, right: -5, width: 34, height: 34, borderBottom: '5px solid #E65A28', borderRight: '5px solid #E65A28' }} />
        </div>

        {/* Snap Impact Radial Shockwave Flash */}
        <div
          style={{
            position: 'absolute',
            inset: -100,
            background: 'radial-gradient(circle, rgba(230, 90, 40, 0.45) 0%, transparent 70%)',
            opacity: sparkFlash,
            pointerEvents: 'none',
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
