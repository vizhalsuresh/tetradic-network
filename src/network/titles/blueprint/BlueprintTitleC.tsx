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

export const BlueprintTitleC: React.FC<BlueprintTitleProps> = ({
  aspectRatio = '16:9',
  episodeCode = 'BP-001',
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isVertical = aspectRatio === '9:16' || height > width;

  // 1. Oscilloscope Flatline to Audio Waveform
  const wavePoints = React.useMemo(() => {
    const pts: string[] = [];
    const count = 80;
    const w = width;
    for (let i = 0; i <= count; i++) {
      const x = (i / count) * w;
      const progress = i / count;
      // Envelope dampens edges
      const envelope = Math.sin(progress * Math.PI);
      const wave = Math.sin(i * 0.4 + frame * 0.3) * 45 * envelope;
      pts.push(`${x.toFixed(1)},${(height / 2 + wave).toFixed(1)}`);
    }
    return `M ${pts.join(' L ')}`;
  }, [frame, width, height]);

  // Waveform fades out as typography slams in
  const waveOpacity = interpolate(frame, [0, 18, 32], [0, 1, 0], {
    extrapolateRight: 'clamp',
  });

  // 2. High-Velocity Grid Scroll
  const gridOffsetY = (frame * 18) % 60;

  // 3. Kinetic Typography Slam
  const titleSpring = spring({
    frame: frame - 25,
    fps,
    config: { damping: 11, stiffness: 160, mass: 0.7 },
  });

  const titleScale = interpolate(titleSpring, [0, 1], [1.35, 1]);
  const titleOpacity = interpolate(frame, [25, 32], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // 4. Vertical Laser Scanline Sweep
  const scanlineProgress = interpolate(frame, [40, 75], [-0.1, 1.1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // 5. Digital telemetry counters cycling in real-time
  const bitstream = ((frame * 1337) % 9999).toString().padStart(4, '0');
  const latency = (0.42 + (frame % 5) * 0.01).toFixed(2);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#051D17',
        backgroundImage: 'radial-gradient(circle at 50% 50%, #0A4335 0%, #03120E 100%)',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: "'JetBrains Mono', monospace",
        color: '#F3B659',
        overflow: 'hidden',
      }}
    >
      {/* High-Velocity Logarithmic Scrolling Blueprint Grid */}
      <div
        style={{
          position: 'absolute',
          inset: -100,
          backgroundImage: `
            linear-gradient(to right, rgba(243, 182, 89, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(243, 182, 89, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          transform: `translateY(${gridOffsetY}px)`,
          opacity: interpolate(frame, [15, 35], [0, 0.7]),
        }}
      />

      {/* Oscilloscope Frequency Waveform (Phase 1) */}
      <svg
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          opacity: waveOpacity,
        }}
      >
        <path
          d={wavePoints}
          fill="none"
          stroke="#E65A28"
          strokeWidth="3"
          strokeLinecap="round"
          style={{
            filter: 'drop-shadow(0 0 12px #E65A28)',
          }}
        />
      </svg>

      {/* Top Telemetry Header */}
      <div
        style={{
          position: 'absolute',
          top: 50,
          left: 60,
          right: 60,
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: isVertical ? 14 : 16,
          fontWeight: 700,
          letterSpacing: '0.25em',
          color: 'rgba(243, 182, 89, 0.7)',
          opacity: interpolate(frame, [10, 25], [0, 1]),
        }}
      >
        <span>SIGNAL_ANALYZER // OSCILLOSCOPE_LOCK</span>
        <span>LATENCY: {latency}MS</span>
        <span>STREAM_ID: #{bitstream}</span>
      </div>

      {/* Main Kinetic Typography Container */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `scale(${titleScale})`,
          opacity: titleOpacity,
        }}
      >
        {/* Accent Orange Header Pill */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 12,
            padding: '6px 18px',
            backgroundColor: '#E65A28',
            color: '#FFFFFF',
            fontSize: isVertical ? 14 : 17,
            fontWeight: 800,
            letterSpacing: '0.3em',
            borderRadius: 2,
            marginBottom: 20,
            boxShadow: '0 0 25px rgba(230, 90, 40, 0.5)',
          }}
        >
          <span>SHOW 01</span>
          <span>•</span>
          <span>SYSTEM ARCHITECTURE</span>
        </div>

        {/* Hero Title: THE BLUEPRINT */}
        <div
          style={{
            position: 'relative',
            fontSize: isVertical ? 72 : 124,
            fontWeight: 900,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            textAlign: 'center',
            lineHeight: 0.95,
            color: '#F3B659',
            textShadow: '0 0 45px rgba(243, 182, 89, 0.5)',
          }}
        >
          THE BLUEPRINT

          {/* Vertical Laser Scanline Sweeping Across Text */}
          <div
            style={{
              position: 'absolute',
              top: -20,
              bottom: -20,
              left: `${scanlineProgress * 100}%`,
              width: 3,
              backgroundColor: '#E65A28',
              boxShadow: '0 0 20px #E65A28, 0 0 40px #E65A28',
              opacity: scanlineProgress > 0 && scanlineProgress < 1 ? 1 : 0,
            }}
          />
        </div>

        {/* Lower Telemetry & Meta Box */}
        <div
          style={{
            marginTop: 28,
            display: 'flex',
            alignItems: 'center',
            gap: 20,
            fontSize: isVertical ? 14 : 18,
            fontWeight: 700,
            letterSpacing: '0.22em',
            color: 'rgba(243, 182, 89, 0.9)',
          }}
        >
          <span style={{ color: '#E65A28' }}>[{episodeCode}]</span>
          <span>DECONSTRUCTED HARDWARE</span>
          <span style={{ color: 'rgba(224, 247, 250, 0.4)' }}>//</span>
          <span>ZERO STOCK FOOTAGE</span>
        </div>
      </div>

      {/* Bottom Coordinate Bar */}
      <div
        style={{
          position: 'absolute',
          bottom: 50,
          left: 60,
          right: 60,
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: 13,
          fontWeight: 600,
          letterSpacing: '0.25em',
          color: 'rgba(243, 182, 89, 0.5)',
          opacity: interpolate(frame, [20, 35], [0, 1]),
        }}
      >
        <span>COORD: 51.5074° N, 0.1278° W</span>
        <span>FPS: 30.00 // RESOLUTION: 1920x1080</span>
        <span>TETRADIC BROADCAST NETWORK</span>
      </div>
    </AbsoluteFill>
  );
};
