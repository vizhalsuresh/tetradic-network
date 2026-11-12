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

export interface BlueprintVoxTitleProps {
  aspectRatio?: '16:9' | '9:16';
  episodeCode?: string;
}

export const BlueprintVoxTitle: React.FC<BlueprintVoxTitleProps> = ({
  aspectRatio = '16:9',
  episodeCode = 'BP-001',
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isVertical = aspectRatio === '9:16' || height > width;

  const cyan = '#00E5FF';
  const voText =
    'Every complex machine in our world is hiding a secret language. This is how it is built.';

  // 1. VO Hook Duration & Silence Breath
  // VO runs from frame 15 to frame 170 (~5.2s). Frame 220-225 is 40ms silence breath.
  // Frame 225 is the 3D BAM title detonation!
  const bamFrame = 225;
  const isPreBam = frame < bamFrame;
  const postBamFrame = Math.max(0, frame - bamFrame);

  // 2. Entrance Spring for Editorial Cutouts
  const stickerSpring1 = spring({
    frame: frame - 10,
    fps,
    config: { damping: 14, stiffness: 140 },
  });
  const stickerSpring2 = spring({
    frame: frame - 25,
    fps,
    config: { damping: 14, stiffness: 140 },
  });
  const stickerSpring3 = spring({
    frame: frame - 40,
    fps,
    config: { damping: 14, stiffness: 140 },
  });

  // 3. Pre-BAM Dotted Guide Lines Sweep (Frames 160 -> 224)
  const guideSweep = interpolate(frame, [160, 220], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // 4. BAM Title Detonation Springs & Shockwave
  const titleSpring = spring({
    frame: postBamFrame,
    fps,
    config: { damping: 12, mass: 0.55, stiffness: 220 },
  });

  const shockwaveScale = interpolate(postBamFrame, [0, 25], [0.8, 2.4], {
    extrapolateRight: 'clamp',
  });
  const shockwaveOpacity = interpolate(postBamFrame, [0, 4, 25], [0, 0.9, 0], {
    extrapolateRight: 'clamp',
  });

  // Camera Micro-Drift
  const camScale = interpolate(frame, [0, 360], [1.0, 1.03], {
    extrapolateRight: 'clamp',
  });

  // 5. Radial Kinetic Sparks at Frame 225
  const sparks = useMemo(() => {
    return Array.from({ length: 42 }).map((_, i) => {
      const angle = (i / 42) * Math.PI * 2 + (i % 3) * 0.2;
      const speed = 280 + (i % 7) * 95;
      const size = 6 + (i % 5) * 4;
      const color = i % 3 === 0 ? cyan : i % 3 === 1 ? '#FFFFFF' : '#111827';
      return { angle, speed, size, color };
    });
  }, []);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#090D12',
        overflow: 'hidden',
        fontFamily: "'Inter', 'Montserrat', sans-serif",
      }}
    >
      {/* --- AUDIO PIPELINE --- */}
      {/* 1. Voiceover Hook (Calliope af_sarah) starting at Frame 15 */}
      <Audio
        src={staticFile('audio/vox_titles/vo_blueprint_title.mp3')}
        startFrom={0}
        volume={(f) => {
          if (f < 15) return 0;
          if (f > 180) return 0;
          return 1.0;
        }}
      />

      {/* 2. Hollywood Master Score (Fingerstyle Guitar + Clockwork + Authentic Cello) */}
      <Audio
        src={staticFile('audio/blueprint_master_guitar_strum_12s.mp3')}
        startFrom={0}
        volume={(f) => {
          // Subtle ducking under VO, silence breath at 220-224, full acoustic bloom on BAM at 225
          if (f < 15) return 0.65;
          if (f < 180) return 0.42; // Ducked under voiceover
          if (f >= 220 && f < 225) return 0.0; // 40ms silence breath
          if (f >= 225) {
            // Natural exponential fade over 4.5s hero hold
            const t = (f - 225) / 30;
            return 0.85 * Math.exp(-t / 2.8);
          }
          return 0.65;
        }}
      />

      {/* --- MAIN VOX EDITORIAL PAPER FRAME --- */}
      <VoxPaperFrame accentColor={cyan} theme="blueprint">
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
                backgroundColor: 'rgba(0,0,0,0.06)',
                border: '1px solid rgba(0,0,0,0.1)',
                borderRadius: 4,
                color: '#2D3748',
              }}
            >
              {episodeCode} // SYSTEM SPECIFICATION
            </div>
          </div>

          {/* Kinetic Stat Badge (Top-Right) */}
          <VoxStatCallout
            text="PRECISION // 0.001mm"
            accentColor={cyan}
            theme="blueprint"
            top={75}
            right={48}
          />

          {/* --- EDITORIAL CUTOUT 1: CAD Drafting Compass (Left) --- */}
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
              tiltDeg={-4.5}
              parallaxSpeed={0.8}
            >
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: '#FFFFFF',
                  position: 'relative',
                  padding: 24,
                  boxSizing: 'border-box',
                }}
              >
                {/* Vintage Cyan Blueprint Grid in Cutout */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: `
                      linear-gradient(to right, rgba(0, 229, 255, 0.12) 1px, transparent 1px),
                      linear-gradient(to bottom, rgba(0, 229, 255, 0.12) 1px, transparent 1px)
                    `,
                    backgroundSize: '24px 24px',
                  }}
                />

                {/* Compass & Arc SVG */}
                <svg
                  viewBox="0 0 400 380"
                  style={{ width: '100%', height: '100%', position: 'relative' }}
                >
                  <circle
                    cx="200"
                    cy="200"
                    r="120"
                    fill="none"
                    stroke={cyan}
                    strokeWidth="2.5"
                    strokeDasharray="6 4"
                  />
                  <circle
                    cx="200"
                    cy="200"
                    r="60"
                    fill="none"
                    stroke="#1A202C"
                    strokeWidth="2"
                  />
                  {/* Rotating Compass Needle */}
                  <line
                    x1="200"
                    y1="200"
                    x2={200 + 110 * Math.cos((frame * 0.02) % (Math.PI * 2))}
                    y2={200 + 110 * Math.sin((frame * 0.02) % (Math.PI * 2))}
                    stroke="#111827"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                  {/* Angle Ticks */}
                  {Array.from({ length: 12 }).map((_, i) => {
                    const ang = (i / 12) * Math.PI * 2;
                    return (
                      <line
                        key={i}
                        x1={200 + 114 * Math.cos(ang)}
                        y1={200 + 114 * Math.sin(ang)}
                        x2={200 + 126 * Math.cos(ang)}
                        y2={200 + 126 * Math.sin(ang)}
                        stroke="#4A5568"
                        strokeWidth="1.5"
                      />
                    );
                  })}
                  <text
                    x="200"
                    y="350"
                    textAnchor="middle"
                    fill="#1A202C"
                    fontFamily="'JetBrains Mono', monospace"
                    fontSize="14"
                    fontWeight="800"
                    letterSpacing="1.5"
                  >
                    FIG 01.1 // RADIUS CALIBRATION
                  </text>
                </svg>

                {/* Pinned Yellow Washi Tape on Cutout */}
                <div
                  style={{
                    position: 'absolute',
                    top: -12,
                    right: 40,
                    width: 90,
                    height: 24,
                    backgroundColor: 'rgba(255, 226, 122, 0.85)',
                    transform: 'rotate(8deg)',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  }}
                />
              </div>
            </VoxStickerCutout>
          </div>

          {/* --- EDITORIAL CUTOUT 2: Planetary Gear Mechanical Schematic (Right) --- */}
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
              parallaxSpeed={1.2}
            >
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: '#FFFFFF',
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
                      linear-gradient(to right, rgba(0, 0, 0, 0.05) 1px, transparent 1px),
                      linear-gradient(to bottom, rgba(0, 0, 0, 0.05) 1px, transparent 1px)
                    `,
                    backgroundSize: '20px 20px',
                  }}
                />

                <svg
                  viewBox="0 0 420 360"
                  style={{ width: '100%', height: '100%', position: 'relative' }}
                >
                  {/* Center Sun Gear */}
                  <g
                    transform={`translate(210, 170) rotate(${frame * 1.5})`}
                  >
                    <circle cx="0" cy="0" r="45" fill="none" stroke="#111827" strokeWidth="3" />
                    {Array.from({ length: 8 }).map((_, i) => (
                      <rect
                        key={i}
                        x="-7"
                        y="-55"
                        width="14"
                        height="20"
                        fill="#111827"
                        transform={`rotate(${(i / 8) * 360})`}
                      />
                    ))}
                  </g>

                  {/* 3 Satellite Planet Gears */}
                  {[0, 120, 240].map((planetAng, pIdx) => {
                    const orbitRadius = 105;
                    const curOrbitAng = (planetAng + frame * 0.6) * (Math.PI / 180);
                    const px = 210 + orbitRadius * Math.cos(curOrbitAng);
                    const py = 170 + orbitRadius * Math.sin(curOrbitAng);
                    return (
                      <g
                        key={pIdx}
                        transform={`translate(${px}, ${py}) rotate(${-frame * 2.2})`}
                      >
                        <circle cx="0" cy="0" r="32" fill="none" stroke={cyan} strokeWidth="2.5" />
                        {Array.from({ length: 6 }).map((_, j) => (
                          <rect
                            key={j}
                            x="-5"
                            y="-40"
                            width="10"
                            height="15"
                            fill={cyan}
                            transform={`rotate(${(j / 6) * 360})`}
                          />
                        ))}
                      </g>
                    );
                  })}

                  <text
                    x="210"
                    y="330"
                    textAnchor="middle"
                    fill="#1A202C"
                    fontFamily="'JetBrains Mono', monospace"
                    fontSize="13"
                    fontWeight="800"
                    letterSpacing="1.2"
                  >
                    FIG 02.4 // TORQUE EPICYCLIC TRAIN
                  </text>
                </svg>

                {/* Pink Washi Tape Accent */}
                <div
                  style={{
                    position: 'absolute',
                    top: -10,
                    left: 30,
                    width: 80,
                    height: 22,
                    backgroundColor: 'rgba(255, 180, 180, 0.8)',
                    transform: 'rotate(-6deg)',
                  }}
                />
              </div>
            </VoxStickerCutout>
          </div>

          {/* --- EDITORIAL CUTOUT 3: Coordinate Tag (Center Top) --- */}
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
                backgroundColor: '#FFFFFF',
                border: '3px solid #111827',
                borderRadius: 4,
                boxShadow: '0 8px 18px rgba(0,0,0,0.15)',
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
                  backgroundColor: cyan,
                }}
              />
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 14,
                  fontWeight: 900,
                  letterSpacing: 2.0,
                  color: '#111827',
                }}
              >
                DOCUMENT ARCHIVE // SECTION 4-A
              </span>
            </div>
          </div>

          {/* --- PRE-BAM DOTTED CAD TRACER LINES (Frames 160 -> 224) --- */}
          {isPreBam && frame >= 160 && (
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
              {/* Dotted Midline */}
              <div
                style={{
                  width: `${guideSweep * 80}%`,
                  height: 2,
                  backgroundImage: `linear-gradient(to right, ${cyan} 50%, transparent 50%)`,
                  backgroundSize: '16px 2px',
                  opacity: 0.85,
                }}
              />
              {/* Slot Dividers for 13 Characters */}
              <div
                style={{
                  display: 'flex',
                  gap: 24,
                  marginTop: 18,
                  opacity: guideSweep,
                }}
              >
                {'THE BLUEPRINT'.split('').map((char, cIdx) => (
                  <div
                    key={cIdx}
                    style={{
                      width: 38,
                      height: 54,
                      border: `1.5px dashed ${cyan}`,
                      borderRadius: 4,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 12,
                      color: 'rgba(0, 229, 255, 0.6)',
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
              {/* Radial Kinetic Paper Sparks */}
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
                      boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                    }}
                  />
                );
              })}

              {/* Anamorphic Cyan Shockwave Ring */}
              <div
                style={{
                  position: 'absolute',
                  width: 900,
                  height: 300,
                  borderRadius: '50%',
                  border: `4px solid ${cyan}`,
                  transform: `scale(${shockwaveScale})`,
                  opacity: shockwaveOpacity,
                  filter: 'blur(2px)',
                }}
              />

              {/* Monolithic Vox Sticker Title Container */}
              <div
                style={{
                  transform: `scale(${titleSpring}) rotate(-1.5deg)`,
                  filter:
                    'drop-shadow(0 20px 40px rgba(0,0,0,0.45)) drop-shadow(0 8px 16px rgba(0, 229, 255, 0.4))',
                  textAlign: 'center',
                }}
              >
                {/* Sticker Cutout White Plate */}
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    padding: '24px 64px',
                    borderRadius: 12,
                    border: '6px solid #111827',
                    display: 'inline-block',
                    boxShadow: '14px 16px 0px #00E5FF, 20px 22px 0px #111827',
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
                      color: '#111827',
                      lineHeight: 1.0,
                    }}
                  >
                    THE BLUEPRINT
                  </h1>
                </div>

                {/* Subtitle Badge Snapped Below */}
                <div
                  style={{
                    marginTop: 24,
                    display: 'inline-block',
                    padding: '10px 32px',
                    backgroundColor: '#111827',
                    borderRadius: 6,
                    transform: 'rotate(1.5deg)',
                    boxShadow: '0 6px 14px rgba(0,0,0,0.25)',
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 22,
                      fontWeight: 900,
                      letterSpacing: 3.5,
                      color: cyan,
                      textTransform: 'uppercase',
                    }}
                  >
                    // HOW SYSTEMS WORK //
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Synchronized Vox Subtitle Burner (Frames 15 -> 180) */}
          {frame >= 15 && frame <= 185 && (
            <VoxSubtitleBurner
              narration={voText}
              durationFrames={165}
              accentColor={cyan}
            />
          )}
        </div>
      </VoxPaperFrame>
    </AbsoluteFill>
  );
};
