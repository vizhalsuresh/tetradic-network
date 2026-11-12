import React, { useMemo } from 'react';
import {
  AbsoluteFill,
  Audio,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { VoxPaperFrame } from '../../../engines/vox/VoxPaperFrame';
import { VoxStickerCutout } from '../../../engines/vox/VoxStickerCutout';
import { VoxStatCallout } from '../../../engines/vox/VoxStatCallout';
import { VoxSubtitleBurner } from '../../../engines/vox/VoxSubtitleBurner';

export interface ParadoxVoxTitleProps {
  aspectRatio?: '16:9' | '9:16';
  episodeCode?: string;
}

export const ParadoxVoxTitle: React.FC<ParadoxVoxTitleProps> = ({
  aspectRatio = '16:9',
  episodeCode = 'PDX-001',
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isVertical = aspectRatio === '9:16' || height > width;

  const gold = '#F3B659';
  const acid = '#FEE180';
  const voText =
    'Your intuition is an evolutionary illusion. When intuition meets mathematical logic, reality breaks.';

  // 1. VO Hook Duration & Silence Breath
  // VO runs from frame 15 to frame 195 (~6.0s). Frame 220-225 is 40ms silence breath.
  // Frame 225 is the 3D BAM title detonation!
  const bamFrame = 225;
  const isPreBam = frame < bamFrame;
  const postBamFrame = Math.max(0, frame - bamFrame);

  // 2. Entrance Springs for Editorial Cutouts
  const stickerSpring1 = spring({
    frame: frame - 10,
    fps,
    config: { damping: 14, stiffness: 140 },
  });
  const stickerSpring2 = spring({
    frame: frame - 26,
    fps,
    config: { damping: 14, stiffness: 140 },
  });
  const stickerSpring3 = spring({
    frame: frame - 40,
    fps,
    config: { damping: 14, stiffness: 140 },
  });

  // 3. Pre-BAM Dotted Guide Sweep
  const guideSweep = interpolate(frame, [170, 222], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // 4. BAM Title Detonation Springs & Shockwave
  const titleSpring = spring({
    frame: postBamFrame,
    fps,
    config: { damping: 12, mass: 0.55, stiffness: 220 },
  });

  const shockwaveScale = interpolate(postBamFrame, [0, 26], [0.8, 2.4], {
    extrapolateRight: 'clamp',
  });
  const shockwaveOpacity = interpolate(postBamFrame, [0, 4, 26], [0, 0.95, 0], {
    extrapolateRight: 'clamp',
  });

  // Camera Micro-Drift
  const camScale = interpolate(frame, [0, 360], [1.0, 1.03], {
    extrapolateRight: 'clamp',
  });

  // 5. Radial Kinetic Sparks at Frame 225
  const sparks = useMemo(() => {
    return Array.from({ length: 44 }).map((_, i) => {
      const angle = (i / 44) * Math.PI * 2 + (i % 3) * 0.22;
      const speed = 280 + (i % 7) * 90;
      const size = 6 + (i % 5) * 4;
      const color = i % 3 === 0 ? gold : i % 3 === 1 ? acid : '#FFFFFF';
      return { angle, speed, size, color };
    });
  }, []);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#080B10',
        overflow: 'hidden',
        fontFamily: "'Inter', 'Montserrat', sans-serif",
      }}
    >
      {/* --- AUDIO PIPELINE --- */}
      {/* 1. Voiceover Hook (Calliope af_sarah) */}
      <Audio
        src={staticFile('audio/vox_titles/vo_paradox_title.mp3')}
        startFrom={0}
        volume={(f) => {
          if (f < 15) return 0;
          if (f > 205) return 0;
          return 1.0;
        }}
      />

      {/* 2. Hollywood Master Score (Film Noir Piano Cm9 + Tactile Foley + Authentic Cello) */}
      <Audio
        src={staticFile('audio/paradox_theme_master_12s.mp3')}
        startFrom={0}
        volume={(f) => {
          if (f < 15) return 0.65;
          if (f < 205) return 0.42; // Ducked under voiceover
          if (f >= 220 && f < 225) return 0.0; // 40ms silence breath
          if (f >= 225) {
            const t = (f - 225) / 30;
            return 0.88 * Math.exp(-t / 2.8);
          }
          return 0.65;
        }}
      />

      {/* --- MAIN VOX EDITORIAL PAPER FRAME --- */}
      <VoxPaperFrame accentColor={gold} theme="paradox">
        <div
          style={{
            position: 'absolute',
            inset: 0,
            transform: `scale(${camScale})`,
            transformOrigin: 'center center',
          }}
        >
          {/* Top Metadata Header Ribbon */}
          <div
            style={{
              position: 'absolute',
              top: 24,
              right: 36,
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              zIndex: 30,
            }}
          >
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 13,
                fontWeight: 800,
                letterSpacing: 2.0,
                padding: '6px 14px',
                backgroundColor: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: 4,
                color: '#ECEFF4',
              }}
            >
              {episodeCode} // COGNITIVE ANOMALY
            </div>
          </div>

          {/* Kinetic Stat Badge (Top-Right) */}
          <VoxStatCallout
            text="PROBABILITY // 66.7%"
            accentColor={gold}
            theme="paradox"
            top={75}
            right={48}
          />

          {/* --- EDITORIAL CUTOUT 1: Monty Hall Three Doors & Penrose Triangle (Left) --- */}
          <div
            style={{
              position: 'absolute',
              left: isVertical ? 60 : 140,
              top: isVertical ? 220 : 160,
              transform: `scale(${stickerSpring1})`,
              zIndex: 20,
            }}
          >
            <VoxStickerCutout
              width={isVertical ? 380 : 440}
              height={isVertical ? 360 : 420}
              tiltDeg={-3.8}
              parallaxSpeed={0.85}
            >
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: '#0E141D',
                  position: 'relative',
                  padding: 24,
                  boxSizing: 'border-box',
                }}
              >
                {/* Vintage Graph Grid */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: `
                      linear-gradient(to right, rgba(243, 182, 89, 0.1) 1px, transparent 1px),
                      linear-gradient(to bottom, rgba(243, 182, 89, 0.1) 1px, transparent 1px)
                    `,
                    backgroundSize: '22px 22px',
                  }}
                />

                <svg
                  viewBox="0 0 400 380"
                  style={{ width: '100%', height: '100%', position: 'relative' }}
                >
                  {/* Three Monty Hall Doors */}
                  {[0, 1, 2].map((doorIdx) => {
                    const dx = 50 + doorIdx * 115;
                    const isSelected = doorIdx === 1;
                    const isOpen = doorIdx === 2;
                    const strokeCol = isSelected ? gold : isOpen ? 'rgba(255,255,255,0.3)' : '#FFFFFF';

                    return (
                      <g key={doorIdx}>
                        {/* Door Frame */}
                        <rect
                          x={dx}
                          y={80}
                          width={75}
                          height={140}
                          fill={isOpen ? '#05070A' : '#141C28'}
                          stroke={strokeCol}
                          strokeWidth={isSelected ? '3' : '1.8'}
                          rx="4"
                        />
                        {/* Door Number */}
                        <text
                          x={dx + 37.5}
                          y={130}
                          textAnchor="middle"
                          fill={strokeCol}
                          fontFamily="'JetBrains Mono', monospace"
                          fontSize="22"
                          fontWeight="900"
                        >
                          0{doorIdx + 1}
                        </text>
                        {/* Probability Badge */}
                        <text
                          x={dx + 37.5}
                          y={190}
                          textAnchor="middle"
                          fill={isSelected ? gold : 'rgba(255,255,255,0.6)'}
                          fontFamily="'JetBrains Mono', monospace"
                          fontSize="13"
                          fontWeight="800"
                        >
                          {doorIdx === 0 ? '33.3%' : doorIdx === 1 ? '66.7%' : 'GOAT'}
                        </text>
                      </g>
                    );
                  })}

                  {/* Penrose Impossible Triangle Linework Below Doors */}
                  <path
                    d="M 130 250 L 270 250 L 200 330 Z"
                    fill="none"
                    stroke={gold}
                    strokeWidth="2.5"
                    strokeDasharray="6 3"
                  />
                  <circle cx="200" cy="275" r="16" fill="none" stroke="#FFFFFF" strokeWidth="2" />

                  <text
                    x="200"
                    y="360"
                    textAnchor="middle"
                    fill="#ECEFF4"
                    fontFamily="'JetBrains Mono', monospace"
                    fontSize="13"
                    fontWeight="800"
                    letterSpacing="1.5"
                  >
                    FIG 01.3 // BAYESIAN PARADOX SHIFT
                  </text>
                </svg>

                {/* Khaki Gold Washi Tape Accent */}
                <div
                  style={{
                    position: 'absolute',
                    top: -10,
                    right: 35,
                    width: 90,
                    height: 24,
                    backgroundColor: 'rgba(243, 182, 89, 0.85)',
                    transform: 'rotate(6deg)',
                  }}
                />
              </div>
            </VoxStickerCutout>
          </div>

          {/* --- EDITORIAL CUTOUT 2: Necker Cube & Decision Matrix (Right) --- */}
          <div
            style={{
              position: 'absolute',
              right: isVertical ? 60 : 130,
              top: isVertical ? 580 : 180,
              transform: `scale(${stickerSpring2})`,
              zIndex: 20,
            }}
          >
            <VoxStickerCutout
              width={isVertical ? 380 : 460}
              height={isVertical ? 360 : 400}
              tiltDeg={3.2}
              parallaxSpeed={1.15}
            >
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: '#0E141D',
                  position: 'relative',
                  padding: 24,
                  boxSizing: 'border-box',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: `
                      linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                      linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
                    `,
                    backgroundSize: '20px 20px',
                  }}
                />

                <svg
                  viewBox="0 0 420 360"
                  style={{ width: '100%', height: '100%', position: 'relative' }}
                >
                  {/* Rotating 3D Necker Optical Illusion Wireframe */}
                  <g
                    transform={`translate(210, 160) rotate(${frame * 0.4})`}
                  >
                    {/* Front Square */}
                    <rect
                      x="-60"
                      y="-60"
                      width="120"
                      height="120"
                      fill="none"
                      stroke={gold}
                      strokeWidth="2.5"
                    />
                    {/* Back Square (Offset) */}
                    <rect
                      x="-30"
                      y="-30"
                      width="120"
                      height="120"
                      fill="none"
                      stroke="rgba(255,255,255,0.7)"
                      strokeWidth="2"
                      strokeDasharray="4 3"
                    />
                    {/* Connecting Edges */}
                    <line x1="-60" y1="-60" x2="-30" y2="-30" stroke="#FFFFFF" strokeWidth="2" />
                    <line x1="60" y1="-60" x2="90" y2="-30" stroke="#FFFFFF" strokeWidth="2" />
                    <line x1="-60" y1="60" x2="-30" y2="90" stroke="#FFFFFF" strokeWidth="2" />
                    <line x1="60" y1="60" x2="90" y2="90" stroke="#FFFFFF" strokeWidth="2" />
                  </g>

                  <text
                    x="210"
                    y="330"
                    textAnchor="middle"
                    fill="#ECEFF4"
                    fontFamily="'JetBrains Mono', monospace"
                    fontSize="13"
                    fontWeight="800"
                    letterSpacing="1.2"
                  >
                    FIG 02.8 // BISTABLE PERCEPTION MATRIX
                  </text>
                </svg>

                {/* Acid Lemon Tape */}
                <div
                  style={{
                    position: 'absolute',
                    top: -10,
                    left: 30,
                    width: 80,
                    height: 22,
                    backgroundColor: 'rgba(254, 225, 128, 0.85)',
                    transform: 'rotate(-5deg)',
                  }}
                />
              </div>
            </VoxStickerCutout>
          </div>

          {/* --- EDITORIAL CUTOUT 3: Status Tag (Center Top) --- */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: 100,
              transform: `translateX(-50%) scale(${stickerSpring3}) rotate(-1deg)`,
              zIndex: 25,
            }}
          >
            <div
              style={{
                padding: '8px 24px',
                backgroundColor: '#141C28',
                border: '3px solid #F3B659',
                borderRadius: 4,
                boxShadow: '0 8px 20px rgba(0,0,0,0.6)',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  backgroundColor: gold,
                }}
              />
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 14,
                  fontWeight: 900,
                  letterSpacing: 2.0,
                  color: '#FFFFFF',
                }}
              >
                LOGICAL SINGULARITY // PARADOX 03
              </span>
            </div>
          </div>

          {/* --- PRE-BAM DOTTED PARADOX TRACER LINES (Frames 170 -> 224) --- */}
          {isPreBam && frame >= 170 && (
            <div
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: 480,
                height: 120,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                pointerEvents: 'none',
                zIndex: 40,
              }}
            >
              <div
                style={{
                  width: `${guideSweep * 80}%`,
                  height: 2,
                  backgroundImage: `linear-gradient(to right, ${gold} 50%, transparent 50%)`,
                  backgroundSize: '16px 2px',
                  opacity: 0.9,
                }}
              />
              <div
                style={{
                  display: 'flex',
                  gap: 24,
                  marginTop: 18,
                  opacity: guideSweep,
                }}
              >
                {'THE PARADOX'.split('').map((char, cIdx) => (
                  <div
                    key={cIdx}
                    style={{
                      width: 40,
                      height: 54,
                      border: `1.5px dashed ${gold}`,
                      borderRadius: 4,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 12,
                      color: 'rgba(243, 182, 89, 0.7)',
                    }}
                  >
                    {cIdx + 1}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* --- FRAME 225: THE 3D BAM TITLE DETONATION --- */}
          {!isPreBam && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 60,
                pointerEvents: 'none',
              }}
            >
              {/* Radial Kinetic Sparks */}
              {sparks.map((s, idx) => {
                const dist = interpolate(
                  postBamFrame,
                  [0, 28],
                  [0, s.speed],
                  { extrapolateRight: 'clamp' }
                );
                const sparkOpacity = interpolate(
                  postBamFrame,
                  [0, 5, 28],
                  [0, 1, 0],
                  { extrapolateRight: 'clamp' }
                );
                const sx = dist * Math.cos(s.angle);
                const sy = dist * Math.sin(s.angle);
                return (
                  <div
                    key={idx}
                    style={{
                      position: 'absolute',
                      left: '50%',
                      top: '50%',
                      width: s.size,
                      height: s.size,
                      backgroundColor: s.color,
                      transform: `translate(${sx}px, ${sy}px) rotate(${s.angle * 45}deg)`,
                      opacity: sparkOpacity,
                      borderRadius: idx % 2 === 0 ? '50%' : 2,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.6)',
                    }}
                  />
                );
              })}

              {/* Shockwave Ring */}
              <div
                style={{
                  position: 'absolute',
                  width: 920,
                  height: 310,
                  borderRadius: '50%',
                  border: `4px solid ${gold}`,
                  transform: `scale(${shockwaveScale})`,
                  opacity: shockwaveOpacity,
                  filter: 'blur(2px)',
                }}
              />

              {/* Monolithic Vox Sticker Title Container */}
              <div
                style={{
                  transform: `scale(${titleSpring}) rotate(-1.2deg)`,
                  filter:
                    'drop-shadow(0 24px 48px rgba(0,0,0,0.8)) drop-shadow(0 10px 20px rgba(243, 182, 89, 0.45))',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    padding: '24px 64px',
                    borderRadius: 12,
                    border: '6px solid #080B10',
                    display: 'inline-block',
                    boxShadow: '16px 18px 0px #F3B659, 22px 24px 0px #080B10',
                  }}
                >
                  <h1
                    style={{
                      margin: 0,
                      fontFamily: "'Montserrat', 'Inter', sans-serif",
                      fontSize: isVertical ? 76 : 112,
                      fontWeight: 900,
                      letterSpacing: 4.0,
                      textTransform: 'uppercase',
                      color: '#080B10',
                      lineHeight: 1.0,
                    }}
                  >
                    THE PARADOX
                  </h1>
                </div>

                <div
                  style={{
                    marginTop: 24,
                    display: 'inline-block',
                    padding: '10px 32px',
                    backgroundColor: '#F3B659',
                    borderRadius: 6,
                    transform: 'rotate(1.5deg)',
                    boxShadow: '0 6px 16px rgba(0,0,0,0.4)',
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 22,
                      fontWeight: 900,
                      letterSpacing: 3.5,
                      color: '#080B10',
                      textTransform: 'uppercase',
                    }}
                  >
                    // WHY REALITY BREAKS //
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Synchronized Vox Subtitle Burner (Frames 15 -> 205) */}
          {frame >= 15 && frame <= 210 && (
            <VoxSubtitleBurner
              narration={voText}
              durationFrames={190}
              accentColor={gold}
            />
          )}
        </div>
      </VoxPaperFrame>
    </AbsoluteFill>
  );
};
