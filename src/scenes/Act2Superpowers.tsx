import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, Sequence, interpolate, spring } from 'remotion';
import { SleekText, BackgroundGrid } from '../components/SleekText';
import { COLORS } from '../Composition';

const SuperpowerSlide: React.FC<{
  number: string;
  title1: string;
  title2?: string;
}> = ({ number, title1, title2 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Scale the giant number in the background
  const scaleNumber = interpolate(
    spring({ frame, fps, config: { damping: 200 } }),
    [0, 1],
    [0.8, 1.2]
  );
  
  const opacityNumber = interpolate(frame, [0, 15, 90, 105], [0, 0.1, 0.1, 0]);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center' }}>
      <BackgroundGrid />
      
      {/* Giant Number in Background */}
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', zIndex: 1 }}>
        <div style={{
          fontSize: '1200px',
          fontWeight: 900,
          color: COLORS.accent,
          opacity: opacityNumber,
          transform: `scale(${scaleNumber})`,
          lineHeight: 1,
        }}>
          {number}
        </div>
      </AbsoluteFill>
      
      {/* Foreground Typography */}
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'flex-start', paddingLeft: '100px', zIndex: 2 }}>
        <SleekText text={`POWER // ${number}`} delay={0} fontSize={40} color={COLORS.accent} style={{ marginBottom: '40px' }} />
        <SleekText text={title1} delay={10} fontSize={100} />
        {title2 && <SleekText text={title2} delay={20} fontSize={100} color="rgba(255,255,255,0.8)" />}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const Act2Superpowers: React.FC = () => {
  // Total duration: 630 frames
  // 5 superpowers = ~126 frames each
  const duration = 126;

  return (
    <AbsoluteFill>
      <Sequence from={0} durationInFrames={duration}>
        <SuperpowerSlide number="01" title1="RETENTION" title2="ARCHITECTURE" />
      </Sequence>
      
      <Sequence from={duration} durationInFrames={duration}>
        <SuperpowerSlide number="02" title1="AUDITORY" title2="RHYTHM" />
      </Sequence>
      
      <Sequence from={duration * 2} durationInFrames={duration}>
        <SuperpowerSlide number="03" title1="HIGH-END" title2="MOTION FX" />
      </Sequence>

      <Sequence from={duration * 3} durationInFrames={duration}>
        <SuperpowerSlide number="04" title1="FILM" title2="EMULATION" />
      </Sequence>

      <Sequence from={duration * 4} durationInFrames={duration}>
        <SuperpowerSlide number="05" title1="VISUAL" title2="STORYTELLING" />
      </Sequence>
    </AbsoluteFill>
  );
};
