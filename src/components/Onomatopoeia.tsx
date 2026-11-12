import React from 'react';
import { spring, useCurrentFrame, useVideoConfig } from 'remotion';

interface OnomatopoeiaProps {
  text: string;
  triggerFrame?: number;
  color?: string;
  bgColor?: string;
  x?: number | string;
  y?: number | string;
  rotation?: number;
  scale?: number;
}

export const Onomatopoeia: React.FC<OnomatopoeiaProps> = ({
  text,
  triggerFrame = 0,
  color = '#FFFFFF',
  bgColor = '#FF3333',
  x = '50%',
  y = '50%',
  rotation = -8,
  scale = 1,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const relFrame = Math.max(0, frame - triggerFrame);
  if (frame < triggerFrame) return null;

  const pop = spring({
    frame: relFrame,
    fps,
    config: {
      damping: 12,
      stiffness: 240,
      mass: 0.7,
    },
  });

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate(-50%, -50%) rotate(${rotation}deg) scale(${pop * scale})`,
        zIndex: 40,
        pointerEvents: 'none',
      }}
    >
      <div style={{ position: 'relative' }}>
        {/* Starburst SVG Behind */}
        <svg
          width="260"
          height="140"
          viewBox="0 0 260 140"
          style={{ overflow: 'visible', filter: 'drop-shadow(6px 8px 0px #0A0A0C)' }}
        >
          <polygon
            points="
              130,0 160,25 210,10 215,45 260,50 240,85 260,115 220,120 205,140 
              160,130 130,140 100,130 55,140 40,120 0,115 20,85 0,50 45,45 50,10 100,25
            "
            fill={bgColor}
            stroke="#0A0A0C"
            strokeWidth="7"
            strokeLinejoin="round"
          />
        </svg>

        {/* Text */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'Impact, Arial Black, sans-serif',
            fontSize: 48,
            color,
            textShadow: '4px 4px 0px #0A0A0C, -2px -2px 0px #0A0A0C',
            letterSpacing: '3px',
            transform: 'rotate(-4deg)',
          }}
        >
          {text}
        </div>
      </div>
    </div>
  );
};
