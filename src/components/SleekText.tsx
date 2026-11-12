import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS } from '../Composition';

interface SleekTextProps {
  text: string;
  delay?: number;
  fontSize?: number;
  color?: string;
  style?: React.CSSProperties;
}

export const SleekText: React.FC<SleekTextProps> = ({
  text,
  delay = 0,
  fontSize = 120,
  color = COLORS.primary,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Spring animation for translation (slides up into view)
  const translateY = spring({
    frame: frame - delay,
    fps,
    config: {
      damping: 14,
      stiffness: 150,
      mass: 0.8,
    },
  });

  // Calculate pixel translation from 100% to 0%
  const offset = interpolate(translateY, [0, 1], [150, 0]);
  
  // Spring for tracking/letter-spacing
  const tracking = spring({
    frame: frame - delay - 10, // Starts a bit after translation
    fps,
    config: { damping: 20, stiffness: 100 },
  });
  
  const letterSpacing = interpolate(tracking, [0, 1], [-0.05, 0]); // From condensed to normal

  return (
    <div
      style={{
        overflow: 'hidden',
        display: 'flex',
        ...style,
      }}
    >
      <div
        style={{
          transform: `translateY(${offset}%)`,
          fontSize: `${fontSize}px`,
          fontWeight: 900,
          color,
          lineHeight: 1,
          letterSpacing: `${letterSpacing}em`,
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
        }}
      >
        {text}
      </div>
    </div>
  );
};

export const BackgroundGrid: React.FC = () => {
  const frame = useCurrentFrame();
  const pan = interpolate(frame, [0, 1000], [0, 100]); // Slow pan
  return (
    <div
      style={{
        position: 'absolute',
        top: -500,
        left: -500,
        right: -500,
        bottom: -500,
        backgroundImage: `
          linear-gradient(${COLORS.grid} 2px, transparent 2px),
          linear-gradient(90deg, ${COLORS.grid} 2px, transparent 2px)
        `,
        backgroundSize: '100px 100px',
        transform: `translateY(${pan}px) rotate(15deg)`,
        opacity: 0.5,
        zIndex: 0,
      }}
    />
  );
};
