import React from 'react';
import { Sequence, AbsoluteFill } from 'remotion';
import { Act1Hook } from './scenes/Act1Hook';
import { Act2Superpowers } from './scenes/Act2Superpowers';
import { Act3Outro } from './scenes/Act3Outro';

export const COLORS = {
  background: '#09090b', // Deep dark charcoal
  primary: '#ffffff', // Stark white
  accent: '#ff3366', // Electric neon pink/orange
  grid: 'rgba(255,255,255,0.05)',
};

export const MainComposition: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.background,
        fontFamily: 'Montserrat, sans-serif',
      }}
    >
      {/* ACT 1: Disruption Hook (0-6s = 180 frames) */}
      <Sequence from={0} durationInFrames={180}>
        <Act1Hook />
      </Sequence>

      {/* ACT 2: 5 Superpowers (6-27s = 630 frames) */}
      <Sequence from={180} durationInFrames={630}>
        <Act2Superpowers />
      </Sequence>

      {/* ACT 3: Outro (27-35s = 240 frames) */}
      <Sequence from={810} durationInFrames={240}>
        <Act3Outro />
      </Sequence>
    </AbsoluteFill>
  );
};
