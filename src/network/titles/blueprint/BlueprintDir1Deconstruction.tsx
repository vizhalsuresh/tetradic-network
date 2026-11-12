import React from 'react';
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

export const BlueprintDir1Deconstruction: React.FC<BlueprintTitleProps> = ({
  aspectRatio = '16:9',
  episodeCode = 'BP-001',
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isVertical = aspectRatio === '9:16' || height > width;

  // --- 1. SPRING-BASED COMPONENT TRAJECTORIES (Frames 0 -> 126 -> 210) ---
  const assemblySpring = spring({
    frame: frame - 25,
    fps,
    config: { damping: 14, stiffness: 65, mass: 1.1 },
  });

  const snapLockSpring = spring({
    frame: frame - 120,
    fps,
    config: { damping: 12, stiffness: 140, mass: 0.9 },
  });

  // Overall 3D camera crane orbit
  const camRotX = interpolate(assemblySpring, [0, 1], [32 - (frame * 0.04), 0]);
  const camRotY = interpolate(assemblySpring, [0, 1], [-38 + (frame * 0.07), 0]);
  const camRotZ = interpolate(assemblySpring, [0, 1], [12 - (frame * 0.02), 0]);
  const camScale = interpolate(snapLockSpring, [0, 1], [0.88, 1.0]);

  // Recoil screen shake on snap impact (Frames 125-142)
  const shakeFrame = frame - 125;
  const shake = interpolate(shakeFrame, [0, 2, 7, 16], [0, 12, 4, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const shakeX = Math.sin(shakeFrame * 2.1) * shake;
  const shakeY = Math.cos(shakeFrame * 2.7) * shake;

  // Multi-axis physical piece offsets
  const railSlide = interpolate(assemblySpring, [0, 1], [400, 0]);
  const chassisPistonY = interpolate(assemblySpring, [0, 1], [280, 0]);
  const plateZ = interpolate(assemblySpring, [0, 1], [-220, 0]);
  const copperBusX = interpolate(assemblySpring, [0, 1], [-320, 0]);
  const hydraulicClamp = interpolate(snapLockSpring, [0, 1], [60, 0]);

  // Spark burst on impact
  const sparkOpacity = interpolate(shakeFrame, [0, 2, 12], [0, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#020C09',
        backgroundImage: 'radial-gradient(ellipse at 50% 50%, #0B493A 0%, #010604 100%)',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: "'JetBrains Mono', monospace",
        color: '#F3B659',
        overflow: 'hidden',
        perspective: 1600,
      }}
    >
      <Audio src={staticFile('audio/blueprint_acoustic_ident.mp3')} />

      {/* 3D Hardware Assembly Stage */}
      <div
        style={{
          position: 'relative',
          width: isVertical ? 920 : 1380,
          height: isVertical ? 640 : 460,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          transformStyle: 'preserve-3d',
          transform: `
            translate3d(${shakeX}px, ${shakeY}px, 0)
            rotateX(${camRotX}deg)
            rotateY(${camRotY}deg)
            rotateZ(${camRotZ}deg)
            scale(${camScale})
          `,
        }}
      >
        {/* Component 1 & 2: Dual Stainless Steel Optical Guide Rails (Left & Right) */}
        <div
          style={{
            position: 'absolute',
            left: -railSlide - 20,
            top: 20,
            bottom: 20,
            width: 14,
            background: 'linear-gradient(180deg, #A0A5AA 0%, #E8EEF2 50%, #70757A 100%)',
            boxShadow: '0 0 15px rgba(255, 255, 255, 0.3)',
            borderRadius: 7,
            transform: 'translateZ(-40px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            right: -railSlide - 20,
            top: 20,
            bottom: 20,
            width: 14,
            background: 'linear-gradient(180deg, #A0A5AA 0%, #E8EEF2 50%, #70757A 100%)',
            boxShadow: '0 0 15px rgba(255, 255, 255, 0.3)',
            borderRadius: 7,
            transform: 'translateZ(-40px)',
          }}
        />

        {/* Component 3 & 4: Top & Bottom Titanium Exoskeleton Crossbars */}
        <div
          style={{
            position: 'absolute',
            top: -chassisPistonY - 30,
            left: 40,
            right: 40,
            height: 18,
            backgroundColor: '#0F2C24',
            border: '2px solid #F3B659',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0 24px',
            transform: 'translateZ(-80px)',
          }}
        >
          <span style={{ fontSize: 10, color: '#4DD0E1' }}>UPPER_FRAME // PISTON_AXIS_Y // CHASSIS_42</span>
          <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#E65A28' }} />
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: -chassisPistonY - 30,
            left: 40,
            right: 40,
            height: 18,
            backgroundColor: '#0F2C24',
            border: '2px solid #F3B659',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0 24px',
            transform: 'translateZ(-80px)',
          }}
        >
          <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#E65A28' }} />
          <span style={{ fontSize: 10, color: '#4DD0E1' }}>LOWER_CARRIER // TORQUE_SPEC: 140NM</span>
        </div>

        {/* Component 5: Copper High-Density PCB Bus Ribbons */}
        <div
          style={{
            position: 'absolute',
            inset: 10,
            transform: `translate3d(${copperBusX}px, 0, -140px)`,
            pointerEvents: 'none',
          }}
        >
          <svg style={{ width: '100%', height: '100%' }}>
            <line x1="80" y1="90" x2="1300" y2="90" stroke="#E65A28" strokeWidth="2.5" strokeDasharray="16 8" strokeDashoffset={-frame * 3} />
            <line x1="80" y1="370" x2="1300" y2="370" stroke="#4DD0E1" strokeWidth="2" strokeDasharray="12 6" strokeDashoffset={frame * 2.5} />
            <circle cx="280" cy="90" r="7" fill="#E65A28" />
            <circle cx="1100" cy="370" r="7" fill="#4DD0E1" />
          </svg>
        </div>

        {/* Component 6: Translucent Polycarbonate Plate with Engraved Letterforms */}
        <div
          style={{
            position: 'relative',
            width: '92%',
            padding: isVertical ? '40px 20px' : '50px 40px',
            backgroundColor: 'rgba(11, 73, 58, 0.42)',
            border: '2px solid rgba(243, 182, 89, 0.35)',
            boxShadow: '0 30px 90px rgba(0, 0, 0, 0.9)',
            backdropFilter: 'blur(8px)',
            transform: `translateZ(${plateZ}px)`,
            textAlign: 'center',
          }}
        >
          {/* Subtitle tag */}
          <div
            style={{
              fontSize: isVertical ? 15 : 19,
              fontWeight: 800,
              letterSpacing: '0.4em',
              color: '#E65A28',
              marginBottom: 16,
              textTransform: 'uppercase',
            }}
          >
            // SHOW 01: SYSTEM ARCHITECTURE //
          </div>

          {/* Main Title: THE BLUEPRINT with Physical Beveled Edge */}
          <h1
            style={{
              margin: 0,
              fontSize: isVertical ? 68 : 112,
              fontWeight: 900,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: '#F3B659',
              lineHeight: 1,
              textShadow: `
                1px 1px 0 #9E7328,
                2px 2px 0 #7D591B,
                3px 3px 0 #5E4110,
                0 0 45px rgba(243, 182, 89, 0.4)
              `,
            }}
          >
            THE BLUEPRINT
          </h1>

          {/* Metadata telemetry */}
          <div
            style={{
              marginTop: 24,
              fontSize: isVertical ? 13 : 16,
              fontWeight: 700,
              letterSpacing: '0.24em',
              color: 'rgba(243, 182, 89, 0.85)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 16,
            }}
          >
            <span style={{ color: '#E65A28' }}>[{episodeCode}]</span>
            <span>DECONSTRUCTED HARDWARE</span>
            <span style={{ color: 'rgba(224, 247, 250, 0.4)' }}>//</span>
            <span>PHYSICAL ASSEMBLY</span>
          </div>
        </div>

        {/* Component 7: Hydraulic Clamps Locking Inward (4 Corners) */}
        <div style={{ position: 'absolute', top: -hydraulicClamp, left: -hydraulicClamp, width: 36, height: 36, borderTop: '6px solid #E65A28', borderLeft: '6px solid #E65A28' }} />
        <div style={{ position: 'absolute', top: -hydraulicClamp, right: -hydraulicClamp, width: 36, height: 36, borderTop: '6px solid #E65A28', borderRight: '6px solid #E65A28' }} />
        <div style={{ position: 'absolute', bottom: -hydraulicClamp, left: -hydraulicClamp, width: 36, height: 36, borderBottom: '6px solid #E65A28', borderLeft: '6px solid #E65A28' }} />
        <div style={{ position: 'absolute', bottom: -hydraulicClamp, right: -hydraulicClamp, width: 36, height: 36, borderBottom: '6px solid #E65A28', borderRight: '6px solid #E65A28' }} />

        {/* Magnetic Snap Spark Ignition Flash */}
        <div
          style={{
            position: 'absolute',
            inset: -80,
            background: 'radial-gradient(circle, rgba(230, 90, 40, 0.35) 0%, transparent 70%)',
            opacity: sparkOpacity,
            pointerEvents: 'none',
          }}
        />

        {/* Real-time Hardware Telemetry Bar */}
        <div
          style={{
            position: 'absolute',
            bottom: -36,
            left: 20,
            right: 20,
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 12,
            letterSpacing: '0.2em',
            color: '#4DD0E1',
          }}
        >
          <span>CHASSIS_STATUS: {frame < 125 ? 'ASSEMBLING_COMPONENTS...' : '[LOCKED // ALLOCATED]'}</span>
          <span>HYDRAULIC_PRESSURE: {frame < 125 ? '3,420 PSI' : '8,900 PSI [SEALED]'}</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
