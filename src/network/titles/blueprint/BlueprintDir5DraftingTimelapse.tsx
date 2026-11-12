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

export const BlueprintDir5DraftingTimelapse: React.FC<BlueprintTitleProps> = ({
  aspectRatio = '16:9',
  episodeCode = 'BP-001',
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isVertical = aspectRatio === '9:16' || height > width;

  // Act 1: Drafting write-on speed (0 -> 90)
  const drawProgress = interpolate(frame, [5, 95], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Act 2: Electrical current surge (90 -> 125)
  const surgeIntensity = interpolate(frame, [90, 115, 126], [0, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Act 3: 3D Monolith Extrusion Lock (120 -> 210)
  const extrusionSpring = spring({
    frame: frame - 120,
    fps,
    config: { damping: 13, stiffness: 110, mass: 1.0 },
  });

  const extScale = interpolate(extrusionSpring, [0, 1], [0.86, 1.0]);
  const ext3DY = interpolate(extrusionSpring, [0, 1], [40, 0]);
  const extShadow = interpolate(extrusionSpring, [0, 1], [0, 30]);

  // Screen shake on extrusion slam
  const shakeFrame = frame - 126;
  const shake = interpolate(shakeFrame, [0, 2, 7, 15], [0, 10, 3, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const shakeX = Math.sin(shakeFrame * 2.3) * shake;
  const shakeY = Math.cos(shakeFrame * 2.5) * shake;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#020B08',
        backgroundImage: 'radial-gradient(circle at 50% 50%, #0B493A 0%, #010604 100%)',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: "'JetBrains Mono', monospace",
        color: '#F3B659',
        overflow: 'hidden',
        perspective: 1400,
      }}
    >
      <Audio src={staticFile('audio/blueprint_acoustic_ident.mp3')} />

      {/* Background Architectural Drafting Grid with Technical Axis */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(to right, rgba(77, 208, 225, 0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(77, 208, 225, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Act 1 & 2: Architectural Construction Lines (SVG Drafting Pass) */}
      <svg
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      >
        {/* Tangent Construction Circles */}
        <circle
          cx={width / 2}
          cy={height / 2}
          r={isVertical ? 260 : 340}
          fill="none"
          stroke={surgeIntensity > 0 ? '#E65A28' : '#4DD0E1'}
          strokeWidth="1.5"
          strokeDasharray="8 6"
          strokeDashoffset={interpolate(drawProgress, [0, 1], [2000, 0])}
          opacity="0.6"
        />
        <circle
          cx={width / 2}
          cy={height / 2}
          r={isVertical ? 180 : 220}
          fill="none"
          stroke={surgeIntensity > 0 ? '#E65A28' : '#F3B659'}
          strokeWidth="1.5"
          strokeDasharray="4 4"
          strokeDashoffset={interpolate(drawProgress, [0, 1], [1500, 0])}
          opacity="0.5"
        />

        {/* 45-degree Alignment Projection Rays */}
        <line
          x1={width / 2 - 500}
          y1={height / 2 - 250}
          x2={width / 2 + 500}
          y2={height / 2 + 250}
          stroke="rgba(77, 208, 225, 0.3)"
          strokeWidth="1"
          strokeDasharray="12 8"
          strokeDashoffset={interpolate(drawProgress, [0, 1], [1000, 0])}
        />
        <line
          x1={width / 2 - 500}
          y1={height / 2 + 250}
          x2={width / 2 + 500}
          y2={height / 2 - 250}
          stroke="rgba(77, 208, 225, 0.3)"
          strokeWidth="1"
          strokeDasharray="12 8"
          strokeDashoffset={interpolate(drawProgress, [0, 1], [1000, 0])}
        />
      </svg>

      {/* Act 3: Extruded Monolith Block Container */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          textAlign: 'center',
          transform: `
            translate3d(${shakeX}px, ${shakeY + ext3DY}px, 0)
            scale(${extScale})
          `,
          backgroundColor: frame >= 120 ? 'rgba(11, 73, 58, 0.55)' : 'transparent',
          padding: isVertical ? '35px 20px' : '45px 50px',
          border: frame >= 120 ? '2px solid #F3B659' : '1px dashed rgba(77, 208, 225, 0.4)',
          boxShadow: `0 ${extShadow}px ${extShadow * 2.5}px rgba(0, 0, 0, 0.95)`,
          transition: 'border 0.2s ease',
        }}
      >
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
          // ARCHITECTURAL DRAFTING //
        </div>

        <h1
          style={{
            margin: 0,
            fontSize: isVertical ? 66 : 112,
            fontWeight: 900,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: '#F3B659',
            lineHeight: 1,
            textShadow: `
              0 0 35px rgba(243, 182, 89, 0.4),
              2px 2px 0 #9E7328,
              4px 4px 0 #5E4110
            `,
          }}
        >
          THE BLUEPRINT
        </h1>

        <div
          style={{
            marginTop: 24,
            fontSize: isVertical ? 13 : 16,
            fontWeight: 700,
            letterSpacing: '0.24em',
            color: 'rgba(243, 182, 89, 0.85)',
          }}
        >
          <span style={{ color: '#E65A28' }}>[{episodeCode}]</span>
          <span> TIMELAPSE SCHEMATIC // EXTRUDED MONOLITH</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
