import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';
import { SleekText, BackgroundGrid } from '../components/SleekText';
import { COLORS } from '../Composition';

export const Act1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Glitch/strobe effect for the accent color background flash
  const bgFlash = interpolate(frame, [0, 5, 10, 15], [0, 1, 0, 0], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      {/* Intense Accent Flash at the start */}
      <AbsoluteFill style={{ backgroundColor: COLORS.accent, opacity: bgFlash }} />
      
      <BackgroundGrid />

      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', zIndex: 10 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
          <SleekText text="THE INDUSTRY" delay={15} fontSize={100} />
          <SleekText text="IS BROKEN" delay={30} fontSize={100} color={COLORS.accent} />
        </div>
      </AbsoluteFill>

      {/* Second wave of text covering it */}
      {frame > 90 && (
        <AbsoluteFill style={{ backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center', zIndex: 20 }}>
          <BackgroundGrid />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
            <SleekText text="EDITORS" delay={90} fontSize={80} color="rgba(255,255,255,0.5)" />
            <SleekText text="ARE DEAD" delay={105} fontSize={80} color="rgba(255,255,255,0.5)" />
            <SleekText text="WELCOME TO" delay={135} fontSize={60} style={{ marginTop: '80px' }} />
            <SleekText text="CREATIVE" delay={150} fontSize={140} color={COLORS.primary} />
            <SleekText text="ARCHITECTURE" delay={160} fontSize={140} color={COLORS.accent} />
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
