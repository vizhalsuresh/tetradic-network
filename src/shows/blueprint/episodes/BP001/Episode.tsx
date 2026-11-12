import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { NetworkWatermark } from '../../../../network/NetworkWatermark';
import { SHOW_PALETTES } from '../../../../engines/colors';

export interface EpisodeProps {
  aspectRatio?: '16:9' | '9:16';
}

export const BP001: React.FC<EpisodeProps> = ({
  aspectRatio = '16:9',
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const palette = SHOW_PALETTES.blueprint || SHOW_PALETTES.blueprint;

  return (
    <AbsoluteFill style={{ backgroundColor: palette.background }}>
      <NetworkWatermark showTitle="blueprint" episodeCode="BP001" />
      
      {/* Episode Content Rendered in Code */}
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        <h1 style={{ color: palette.primary, fontSize: '64px', letterSpacing: '0.1em' }}>
          UNDERSEA INTERNET BACKBONE
        </h1>
        <p style={{ color: palette.accent, fontSize: '24px', letterSpacing: '0.2em' }}>
          BP001 // 100% CODE-RENDERED
        </p>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
