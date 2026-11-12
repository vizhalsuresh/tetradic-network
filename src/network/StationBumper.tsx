import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

export interface StationBumperProps {
  aspectRatio?: '16:9' | '9:16';
}

export const StationBumper: React.FC<StationBumperProps> = ({
  aspectRatio = '16:9',
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const isVertical = aspectRatio === '9:16' || height > width;

  // Spring animation for core expansion
  const coreScale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 120, mass: 0.8 },
  });

  // Orbital ring rotation
  const ringRotation = interpolate(frame, [0, 90], [0, 180]);
  const ring2Rotation = interpolate(frame, [0, 90], [45, -135]);

  // Flash at start
  const flash = interpolate(frame, [0, 4, 12], [0.8, 1, 0], {
    extrapolateRight: 'clamp',
  });

  // Typography spring reveal
  const textSpring = spring({
    frame: frame - 18,
    fps,
    config: { damping: 14, stiffness: 140 },
  });
  const textTranslateY = interpolate(textSpring, [0, 1], [60, 0]);
  const textOpacity = interpolate(frame, [18, 28], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Telemetry subtext reveal
  const subtextOpacity = interpolate(frame, [35, 45], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const titleSize = isVertical ? 96 : 120;
  const ringRadius = isVertical ? 180 : 220;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#050508',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'Montserrat, sans-serif',
      }}
    >
      {/* Background flash */}
      <AbsoluteFill
        style={{
          backgroundColor: '#00F0FF',
          opacity: flash * 0.15,
          pointerEvents: 'none',
        }}
      />

      {/* Subtle coordinate grid lines */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
          opacity: 0.8,
        }}
      />

      {/* Orbital Ring System (Pure SVG) */}
      <div
        style={{
          position: 'relative',
          width: ringRadius * 2,
          height: ringRadius * 2,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: isVertical ? '80px' : '40px',
        }}
      >
        <svg
          width={ringRadius * 2}
          height={ringRadius * 2}
          viewBox={`0 0 ${ringRadius * 2} ${ringRadius * 2}`}
          style={{ position: 'absolute', transform: `rotate(${ringRotation}deg)` }}
        >
          <circle
            cx={ringRadius}
            cy={ringRadius}
            r={ringRadius * 0.9}
            fill="none"
            stroke="rgba(0, 240, 255, 0.4)"
            strokeWidth="2"
            strokeDasharray="16 12"
          />
          <circle
            cx={ringRadius + ringRadius * 0.9}
            cy={ringRadius}
            r="6"
            fill="#00F0FF"
          />
        </svg>

        <svg
          width={ringRadius * 2}
          height={ringRadius * 2}
          viewBox={`0 0 ${ringRadius * 2} ${ringRadius * 2}`}
          style={{ position: 'absolute', transform: `rotate(${ring2Rotation}deg)` }}
        >
          <circle
            cx={ringRadius}
            cy={ringRadius}
            r={ringRadius * 0.65}
            fill="none"
            stroke="rgba(255, 255, 255, 0.2)"
            strokeWidth="1.5"
            strokeDasharray="6 8"
          />
          <circle
            cx={ringRadius}
            cy={ringRadius - ringRadius * 0.65}
            r="4"
            fill="#FFFFFF"
          />
        </svg>

        {/* Central Core Pulse */}
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: '#00F0FF',
            boxShadow: '0 0 40px #00F0FF, 0 0 80px rgba(0, 240, 255, 0.4)',
            transform: `scale(${coreScale})`,
          }}
        />
      </div>

      {/* Monolithic Typography */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          zIndex: 10,
        }}
      >
        <div style={{ overflow: 'hidden' }}>
          <h1
            style={{
              margin: 0,
              fontSize: `${titleSize}px`,
              fontWeight: 900,
              color: '#FFFFFF',
              letterSpacing: '0.2em',
              transform: `translateY(${textTranslateY}px)`,
              opacity: textOpacity,
              textTransform: 'uppercase',
            }}
          >
            TETRADIC
          </h1>
        </div>

        {/* Telemetry Tagline */}
        <div
          style={{
            marginTop: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            opacity: subtextOpacity,
          }}
        >
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#00F0FF',
              boxShadow: '0 0 8px #00F0FF',
            }}
          />
          <span
            style={{
              fontSize: isVertical ? '20px' : '22px',
              fontWeight: 600,
              color: 'rgba(255, 255, 255, 0.7)',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
            }}
          >
            NETWORK // 100% CODE-RENDERED
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
