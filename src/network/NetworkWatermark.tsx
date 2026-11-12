import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';

export interface NetworkWatermarkProps {
  showTitle?: string;
  episodeCode?: string;
}

export const NetworkWatermark: React.FC<NetworkWatermarkProps> = ({
  showTitle = 'BROADCAST',
  episodeCode = 'EP-001',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Seconds timecode calculation
  const seconds = Math.floor(frame / fps);
  const milliseconds = Math.floor(((frame % fps) / fps) * 100);
  const timecode = `TC ${String(seconds).padStart(2, '0')}:${String(milliseconds).padStart(2, '0')}`;

  // Pulse animation (1Hz)
  const isPulsing = (frame % fps) < fps / 2;

  return (
    <div
      style={{
        position: 'absolute',
        top: '40px',
        left: '50px',
        right: '50px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 900,
        pointerEvents: 'none',
        fontFamily: 'monospace',
      }}
    >
      {/* Left: Station & Show Identity */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: isPulsing ? '#00F0FF' : 'rgba(0, 240, 255, 0.3)',
            boxShadow: isPulsing ? '0 0 6px #00F0FF' : 'none',
          }}
        />
        <span
          style={{
            fontSize: '14px',
            fontWeight: 700,
            color: 'rgba(255, 255, 255, 0.7)',
            letterSpacing: '0.2em',
          }}
        >
          TETRADIC // {showTitle.toUpperCase()}
        </span>
      </div>

      {/* Right: Telemetry & Episode Code */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <span
          style={{
            fontSize: '12px',
            color: 'rgba(255, 255, 255, 0.4)',
            letterSpacing: '0.15em',
          }}
        >
          {episodeCode}
        </span>
        <span
          style={{
            fontSize: '12px',
            color: '#00F0FF',
            letterSpacing: '0.1em',
            padding: '2px 8px',
            border: '1px solid rgba(0, 240, 255, 0.3)',
            borderRadius: '3px',
          }}
        >
          {timecode}
        </span>
      </div>
    </div>
  );
};
