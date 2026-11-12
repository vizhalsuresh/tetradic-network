import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

export interface BlueprintTitleProps {
  aspectRatio?: '16:9' | '9:16';
  episodeCode?: string;
}

export const BlueprintTitleA: React.FC<BlueprintTitleProps> = ({
  aspectRatio = '16:9',
  episodeCode = 'BP-001',
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isVertical = aspectRatio === '9:16' || height > width;

  // 1. Grid Expansion Spring
  const gridSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 100, mass: 0.8 },
  });

  // 2. Caliper Horizontal Sweep
  const caliperProgress = interpolate(frame, [15, 55], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // 3. Stroke Path Draw to Solid Fill
  const strokeProgress = interpolate(frame, [20, 50], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const fillOpacity = interpolate(frame, [45, 65], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // 4. Hydraulic Orange Corner Brackets Snap
  const bracketSpring = spring({
    frame: frame - 50,
    fps,
    config: { damping: 11, stiffness: 180, mass: 0.6 },
  });

  // 5. Telemetry & Subtext Fade
  const telemetryOpacity = interpolate(frame, [10, 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const subtextSpring = spring({
    frame: frame - 55,
    fps,
    config: { damping: 12, stiffness: 140 },
  });

  // Dynamic telemetry counters
  const coordX = (interpolate(frame, [0, 90], [120.4, 840.8]) + (frame % 3) * 0.1).toFixed(2);
  const coordY = (interpolate(frame, [0, 90], [45.1, 520.3]) + (frame % 2) * 0.1).toFixed(2);

  const containerWidth = isVertical ? 920 : 1380;
  const containerHeight = isVertical ? 640 : 420;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#06251E',
        backgroundImage: 'radial-gradient(circle at 50% 50%, #0B493A 0%, #041713 100%)',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: "'JetBrains Mono', monospace",
        color: '#F3B659',
        overflow: 'hidden',
      }}
    >
      {/* Background CAD Isometric Grid */}
      <div
        style={{
          position: 'absolute',
          inset: -200,
          backgroundImage: `
            linear-gradient(to right, rgba(224, 247, 250, 0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(224, 247, 250, 0.04) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          transform: `scale(${interpolate(gridSpring, [0, 1], [0.8, 1])})`,
          opacity: interpolate(gridSpring, [0, 1], [0, 0.8]),
        }}
      />

      {/* Outer Telemetry Bounds */}
      <div
        style={{
          position: 'absolute',
          top: 60,
          left: 80,
          right: 80,
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: isVertical ? 14 : 16,
          fontWeight: 700,
          letterSpacing: '0.2em',
          color: 'rgba(243, 182, 89, 0.6)',
          opacity: telemetryOpacity,
        }}
      >
        <span>SYS.CAD // TELEMETRY: ACTIVE</span>
        <span>X:{coordX} Y:{coordY}</span>
        <span>SPEC: ARCH_DECONSTRUCT</span>
      </div>

      {/* Main Central Blueprint Assembly Container */}
      <div
        style={{
          position: 'relative',
          width: containerWidth,
          height: containerHeight,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {/* Dimension Caliper Lines (Top Ruler) */}
        <div
          style={{
            position: 'absolute',
            top: -24,
            left: 0,
            right: 0,
            display: 'flex',
            alignItems: 'center',
            opacity: interpolate(frame, [25, 40], [0, 0.7]),
          }}
        >
          <div style={{ width: 1, height: 16, backgroundColor: '#4DD0E1' }} />
          <div style={{ flex: 1, height: 1, backgroundColor: 'rgba(77, 208, 225, 0.4)' }} />
          <span style={{ padding: '0 12px', fontSize: 13, color: '#4DD0E1', letterSpacing: '0.15em' }}>
            DIM: {Math.round(interpolate(caliperProgress, [0, 1], [0, 1420]))}MM
          </span>
          <div style={{ flex: 1, height: 1, backgroundColor: 'rgba(77, 208, 225, 0.4)' }} />
          <div style={{ width: 1, height: 16, backgroundColor: '#4DD0E1' }} />
        </div>

        {/* Outer Wireframe Boundary Box */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            border: '1px solid rgba(224, 247, 250, 0.15)',
            backgroundColor: 'rgba(11, 73, 58, 0.25)',
            boxShadow: 'inset 0 0 40px rgba(4, 23, 19, 0.5)',
          }}
        />

        {/* 4 Invariant Accent Orange (#E65A28) Hydraulic Brackets */}
        {/* Top-Left */}
        <div
          style={{
            position: 'absolute',
            top: -3,
            left: -3,
            width: 32,
            height: 32,
            borderTop: '4px solid #E65A28',
            borderLeft: '4px solid #E65A28',
            transform: `scale(${bracketSpring})`,
          }}
        />
        {/* Top-Right */}
        <div
          style={{
            position: 'absolute',
            top: -3,
            right: -3,
            width: 32,
            height: 32,
            borderTop: '4px solid #E65A28',
            borderRight: '4px solid #E65A28',
            transform: `scale(${bracketSpring})`,
          }}
        />
        {/* Bottom-Left */}
        <div
          style={{
            position: 'absolute',
            bottom: -3,
            left: -3,
            width: 32,
            height: 32,
            borderBottom: '4px solid #E65A28',
            borderLeft: '4px solid #E65A28',
            transform: `scale(${bracketSpring})`,
          }}
        />
        {/* Bottom-Right */}
        <div
          style={{
            position: 'absolute',
            bottom: -3,
            right: -3,
            width: 32,
            height: 32,
            borderBottom: '4px solid #E65A28',
            borderRight: '4px solid #E65A28',
            transform: `scale(${bracketSpring})`,
          }}
        />

        {/* Scanning Laser Beam Line */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: `${caliperProgress * 100}%`,
            width: 2,
            backgroundColor: '#E65A28',
            boxShadow: '0 0 16px #E65A28, 0 0 32px #E65A28',
            opacity: caliperProgress > 0 && caliperProgress < 1 ? 1 : 0,
            zIndex: 10,
          }}
        />

        {/* Show Sub-Header Tag */}
        <div
          style={{
            fontSize: isVertical ? 16 : 20,
            fontWeight: 800,
            letterSpacing: '0.35em',
            color: '#E65A28',
            marginBottom: isVertical ? 16 : 22,
            opacity: interpolate(frame, [15, 30], [0, 1]),
            transform: `translateY(${interpolate(frame, [15, 30], [10, 0])}px)`,
          }}
        >
          // SHOW 01 : ARCHITECTURAL TELEMETRY //
        </div>

        {/* Main Title: THE BLUEPRINT */}
        <div
          style={{
            position: 'relative',
            fontSize: isVertical ? 64 : 108,
            fontWeight: 900,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            textAlign: 'center',
            lineHeight: 1,
          }}
        >
          {/* Wireframe Stroke Layer */}
          <span
            style={{
              position: 'relative',
              display: 'inline-block',
              WebkitTextStroke: '2px #F3B659',
              color: 'transparent',
              opacity: 1 - fillOpacity * 0.4,
            }}
          >
            THE BLUEPRINT
          </span>

          {/* Solid Gold Fill Layer with Glow */}
          <span
            style={{
              position: 'absolute',
              inset: 0,
              color: '#F3B659',
              opacity: fillOpacity,
              textShadow: '0 0 30px rgba(243, 182, 89, 0.45)',
            }}
          >
            THE BLUEPRINT
          </span>
        </div>

        {/* Sub-Telemetry & Pacing Tag */}
        <div
          style={{
            marginTop: isVertical ? 20 : 28,
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            fontSize: isVertical ? 14 : 17,
            fontWeight: 700,
            letterSpacing: '0.25em',
            color: 'rgba(243, 182, 89, 0.85)',
            opacity: subtextSpring,
            transform: `translateY(${interpolate(subtextSpring, [0, 1], [15, 0])}px)`,
          }}
        >
          <span style={{ color: '#E65A28' }}>[{episodeCode}]</span>
          <span>HOW SYSTEMS WORK</span>
          <span style={{ color: 'rgba(224, 247, 250, 0.4)' }}>//</span>
          <span>DECONSTRUCTED CAD</span>
        </div>
      </div>

      {/* Bottom Station Anchor */}
      <div
        style={{
          position: 'absolute',
          bottom: 50,
          fontSize: 13,
          letterSpacing: '0.3em',
          color: 'rgba(243, 182, 89, 0.45)',
          opacity: telemetryOpacity,
        }}
      >
        TETRADIC BROADCAST NETWORK • DETERMINISTIC CODE CAMERA
      </div>
    </AbsoluteFill>
  );
};
