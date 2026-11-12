import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';
import { SleekText, BackgroundGrid } from '../components/SleekText';
import { COLORS } from '../Composition';

export const Act3Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Subtle zoom in
  const scale = interpolate(frame, [0, 240], [1, 1.1]);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.accent, transform: `scale(${scale})` }}>
      <AbsoluteFill style={{ backgroundColor: COLORS.background, opacity: 0.95 }} />
      <BackgroundGrid />

      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', zIndex: 10 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
          <SleekText text="READY TO" delay={15} fontSize={100} />
          <SleekText text="ELEVATE?" delay={30} fontSize={120} color={COLORS.accent} />
          
          <div style={{ marginTop: '100px', overflow: 'hidden' }}>
            <div style={{
              transform: `translateY(${interpolate(spring({ frame: frame - 60, fps, config: { damping: 12 } }), [0, 1], [100, 0])}px)`,
              opacity: interpolate(frame, [60, 75], [0, 1]),
              border: `4px solid ${COLORS.primary}`,
              padding: '20px 60px',
              fontSize: '40px',
              fontWeight: 700,
              color: COLORS.primary,
              letterSpacing: '0.1em',
            }}>
              LET'S BUILD
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
