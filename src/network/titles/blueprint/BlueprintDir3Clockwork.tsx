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

export const BlueprintDir3Clockwork: React.FC<BlueprintTitleProps> = ({
  aspectRatio = '16:9',
  episodeCode = 'BP-001',
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isVertical = aspectRatio === '9:16' || height > width;

  // Caliper slide animation
  const caliperSlide = spring({
    frame: frame - 20,
    fps,
    config: { damping: 15, stiffness: 70 },
  });

  const caliperMM = (interpolate(caliperSlide, [0, 1], [150.0, 42.18])).toFixed(2);

  // Synchronized gear rotations
  const gear1Rot = frame * 1.8;
  const gear2Rot = -frame * 1.8 * (24 / 16); // Gear ratio 16:24
  const gear3Rot = frame * 1.8 * (24 / 32);  // Gear ratio 32:24

  // Snap lock impact
  const snap = spring({
    frame: frame - 125,
    fps,
    config: { damping: 12, stiffness: 120 },
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#030A08',
        backgroundImage: 'radial-gradient(circle at 50% 50%, #0B493A 0%, #010503 100%)',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: "'JetBrains Mono', monospace",
        color: '#F3B659',
        overflow: 'hidden',
      }}
    >
      <Audio src={staticFile('audio/blueprint_acoustic_ident.mp3')} />

      {/* Background Interlocking Clockwork Gears (SVG) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.28,
          pointerEvents: 'none',
        }}
      >
        {/* Main Drive Gear 1 (24 Teeth) */}
        <svg
          style={{
            position: 'absolute',
            left: isVertical ? '10%' : '20%',
            top: isVertical ? '22%' : '18%',
            width: 320,
            height: 320,
            transform: `rotate(${gear1Rot}deg)`,
          }}
          viewBox="0 0 200 200"
        >
          <circle cx="100" cy="100" r="80" fill="none" stroke="#F3B659" strokeWidth="6" strokeDasharray="10 8" />
          <circle cx="100" cy="100" r="50" fill="none" stroke="#E65A28" strokeWidth="3" />
          <line x1="100" y1="20" x2="100" y2="180" stroke="#F3B659" strokeWidth="4" />
          <line x1="20" y1="100" x2="180" y2="100" stroke="#F3B659" strokeWidth="4" />
        </svg>

        {/* Meshed Pinion Gear 2 (16 Teeth) */}
        <svg
          style={{
            position: 'absolute',
            left: isVertical ? '50%' : '38%',
            top: isVertical ? '35%' : '32%',
            width: 220,
            height: 220,
            transform: `rotate(${gear2Rot}deg)`,
          }}
          viewBox="0 0 200 200"
        >
          <circle cx="100" cy="100" r="70" fill="none" stroke="#4DD0E1" strokeWidth="5" strokeDasharray="8 6" />
          <circle cx="100" cy="100" r="35" fill="none" stroke="#E65A28" strokeWidth="3" />
          <line x1="100" y1="30" x2="100" y2="170" stroke="#4DD0E1" strokeWidth="3" />
          <line x1="30" y1="100" x2="170" y2="100" stroke="#4DD0E1" strokeWidth="3" />
        </svg>
      </div>

      {/* Vernier Caliper Precision Measurement Bar (Top) */}
      <div
        style={{
          position: 'absolute',
          top: isVertical ? 140 : 180,
          display: 'flex',
          alignItems: 'center',
          gap: 20,
          backgroundColor: 'rgba(11, 73, 58, 0.65)',
          padding: '10px 24px',
          border: '1px solid #4DD0E1',
          borderRadius: 4,
          boxShadow: '0 0 20px rgba(0, 0, 0, 0.8)',
        }}
      >
        <div style={{ fontSize: 13, color: '#4DD0E1', letterSpacing: '0.2em' }}>VERNIER CALIPER // MITUTOYO SPEC:</div>
        <div style={{ fontSize: 18, fontWeight: 800, color: '#E65A28' }}>{caliperMM} mm</div>
      </div>

      {/* Hero Typography Container */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          textAlign: 'center',
          padding: isVertical ? '40px 10px' : '50px 30px',
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
          // MECHANICAL CLOCKWORK DYNAMICS //
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
            textShadow: '0 0 35px rgba(243, 182, 89, 0.5), 0 5px 25px rgba(0, 0, 0, 0.9)',
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
          <span> GEAR MESH // HIGH-PRECISION TOLERANCE</span>
        </div>
      </div>

      {/* Hydraulic Clamping Brackets (Left & Right) */}
      <div
        style={{
          position: 'absolute',
          left: interpolate(caliperSlide, [0, 1], [40, isVertical ? 60 : 180]),
          width: 8,
          height: 160,
          backgroundColor: '#E65A28',
          boxShadow: '0 0 15px #E65A28',
        }}
      />
      <div
        style={{
          position: 'absolute',
          right: interpolate(caliperSlide, [0, 1], [40, isVertical ? 60 : 180]),
          width: 8,
          height: 160,
          backgroundColor: '#E65A28',
          boxShadow: '0 0 15px #E65A28',
        }}
      />
    </AbsoluteFill>
  );
};
