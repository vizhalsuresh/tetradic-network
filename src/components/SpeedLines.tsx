import React from 'react';
import { useCurrentFrame } from 'remotion';

interface SpeedLinesProps {
  color?: string;
  count?: number;
  direction?: 'horizontal' | 'radial';
  opacity?: number;
}

export const SpeedLines: React.FC<SpeedLinesProps> = ({
  color = '#0A0A0C',
  count = 24,
  direction = 'horizontal',
  opacity = 0.25,
}) => {
  const frame = useCurrentFrame();

  if (direction === 'radial') {
    return (
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          opacity,
          overflow: 'hidden',
          zIndex: 5,
        }}
      >
        <svg width="100%" height="100%" viewBox="0 0 1080 1920">
          {Array.from({ length: count }).map((_, i) => {
            const angle = (i / count) * 360 + (frame * 5) % 15;
            const length = 400 + ((frame * 20 + i * 50) % 300);
            return (
              <line
                key={i}
                x1={540 + Math.cos((angle * Math.PI) / 180) * 800}
                y1={960 + Math.sin((angle * Math.PI) / 180) * 800}
                x2={540 + Math.cos((angle * Math.PI) / 180) * (800 - length)}
                y2={960 + Math.sin((angle * Math.PI) / 180) * (800 - length)}
                stroke={color}
                strokeWidth={4 + (i % 5) * 2}
                strokeLinecap="round"
              />
            );
          })}
        </svg>
      </div>
    );
  }

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        opacity,
        overflow: 'hidden',
        zIndex: 5,
      }}
    >
      <svg width="100%" height="100%" viewBox="0 0 1080 1920">
        {Array.from({ length: count }).map((_, i) => {
          const y = (i * (1920 / count) + frame * 30) % 1920;
          const length = 200 + ((i * 73 + frame * 40) % 500);
          const x = ((i * 137 + frame * 50) % 1080) - length / 2;
          return (
            <line
              key={i}
              x1={x}
              y1={y}
              x2={x + length}
              y2={y}
              stroke={color}
              strokeWidth={3 + (i % 4) * 2}
              strokeLinecap="round"
            />
          );
        })}
      </svg>
    </div>
  );
};
