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

export interface SimulationVoxTitleProps {
  aspectRatio?: '16:9' | '9:16';
  episodeCode?: string;
}

export const SimulationVoxTitle: React.FC<SimulationVoxTitleProps> = ({
  aspectRatio = '16:9',
  episodeCode = 'SIM-001',
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isVertical = aspectRatio === '9:16' || height > width;

  const orange = '#E65A28';
  const gold = '#F3B659';
  const voText =
    'What happens when you push physical reality past its breaking point? Let us run the simulation.';

  // 1. VO Hook Duration & Silence Breath
  // VO runs from frame 15 to frame 180 (~5.5s). Frame 220-225 is 40ms silence breath.
  // Frame 225 is the 3D BAM title detonation!
  const bamFrame = 225;
  const isPreBam = frame < bamFrame;
  const postBamFrame = Math.max(0, frame - bamFrame);

  // 2. Entrance Springs for Editorial Cutouts
  const stickerSpring1 = spring({
    frame: frame - 12,
    fps,
    config: { damping: 14, stiffness: 140 },
  });
  const stickerSpring2 = spring({
    frame: frame - 28,
    fps,
    config: { damping: 14, stiffness: 140 },
  });
  const stickerSpring3 = spring({
    frame: frame - 42,
    fps,
    config: { damping: 14, stiffness: 140 },
  });

  // 3. Pre-BAM Event Horizon Guide Sweep
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

  const shockwaveScale = interpolate(postBamFrame, [0, 26], [0.8, 2.5], {
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
      const angle = (i / 44) * Math.PI * 2 + (i % 3) * 0.25;
      const speed = 290 + (i % 7) * 90;
      const size = 6 + (i % 5) * 4;
      const color = i % 3 === 0 ? orange : i % 3 === 1 ? gold : '#FFFFFF';
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
      {/* 1. Voiceover Hook (Calliope af_sarah) */}
      <Audio
        src={staticFile('audio/vox_titles/vo_simulation_title.mp3')}
        startFrom={0}
        volume={(f) => {
          if (f < 15) return 0;
          if (f > 185) return 0;
          return 1.0;
        }}
      />

      {/* 2. Hollywood Master Score (Felt Grand Piano + Bronze Harmonics + Cello Bloom) */}
      <Audio
        src={staticFile('audio/simulation_theme_hybrid_master.mp3')}
        startFrom={0}
        volume={(f) => {
          if (f < 15) return 0.65;
          if (f < 185) return 0.42; // Ducked under voiceover
          if (f >= 220 && f < 225) return 0.0; // 40ms silence breath
          if (f >= 225) {
            const t = (f - 225) / 30;
            return 0.88 * Math.exp(-t / 2.8);
          }
          return 0.65;
        }}
      />

      {/* --- MAIN VOX EDITORIAL PAPER FRAME --- */}
      <VoxPaperFrame accentColor={orange} theme="simulation">
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
              {episodeCode} // DYNAMIC STRESS TEST
            </div>
          </div>

          {/* Kinetic Stat Badge (Top-Right) */}
          <VoxStatCallout
            text="SINGULARITY // r = 3.0rs"
            accentColor={orange}
            theme="simulation"
            top={75}
            right={48}
          />

          {/* --- EDITORIAL CUTOUT 1: Black Hole Accretion Funnel (Left) --- */}
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
              tiltDeg={3.8}
              parallaxSpeed={0.9}
            >
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: '#0D1219',
                  position: 'relative',
                  padding: 24,
                  boxSizing: 'border-box',
                }}
              >
                {/* Polar Coordinates Grid */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: `
                      radial-gradient(circle, rgba(230, 90, 40, 0.15) 1px, transparent 1px)
                    `,
                    backgroundSize: '20px 20px',
                  }}
                />

                <svg
                  viewBox="0 0 400 380"
                  style={{ width: '100%', height: '100%', position: 'relative' }}
                >
                  {/* Outer Gravitational Lensing Rings */}
                  {[140, 110, 80, 50].map((r, rIdx) => (
                    <circle
                      key={rIdx}
                      cx="200"
                      cy="190"
                      r={r}
                      fill="none"
                      stroke={rIdx === 0 ? orange : rIdx === 1 ? gold : 'rgba(255,255,255,0.2)'}
                      strokeWidth={rIdx === 0 ? '3' : '1.5'}
                      strokeDasharray={rIdx % 2 === 1 ? '5 5' : 'none'}
                    />
                  ))}

                  {/* Accretion Disk Swirling Rays */}
                  {Array.from({ length: 16 }).map((_, i) => {
                    const baseAng = (i / 16) * Math.PI * 2;
                    const spiralAng = baseAng + (frame * 0.04);
                    const r1 = 45;
                    const r2 = 145;
                    return (
                      <path
                        key={i}
                        d={`M ${200 + r1 * Math.cos(spiralAng)} ${190 + r1 * Math.sin(spiralAng)} Q ${200 + 100 * Math.cos(spiralAng + 0.4)} ${190 + 100 * Math.sin(spiralAng + 0.4)} ${200 + r2 * Math.cos(spiralAng + 0.9)} ${190 + r2 * Math.sin(spiralAng + 0.9)}`}
                        fill="none"
                        stroke={i % 2 === 0 ? orange : 'rgba(243, 182, 89, 0.6)'}
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    );
                  })}

                  {/* Center Schwarzschild Event Horizon Void */}
                  <circle cx="200" cy="190" r="42" fill="#000000" stroke="#FFFFFF" strokeWidth="2.5" />
                  <circle cx="200" cy="190" r="34" fill="#000000" />

                  <text
                    x="200"
                    y="350"
                    textAnchor="middle"
                    fill="#ECEFF4"
                    fontFamily="'JetBrains Mono', monospace"
                    fontSize="13"
                    fontWeight="800"
                    letterSpacing="1.5"
                  >
                    FIG 01.4 // SCHWARZSCHILD NULL GEODESIC
                  </text>
                </svg>

                {/* Neon Orange Washi Tape */}
                <div
                  style={{
                    position: 'absolute',
                    top: -10,
                    right: 30,
                    width: 90,
                    height: 24,
                    backgroundColor: 'rgba(230, 90, 40, 0.85)',
                    transform: 'rotate(-5deg)',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                  }}
                />
              </div>
            </VoxStickerCutout>
          </div>

          {/* --- EDITORIAL CUTOUT 2: Chaotic 3-Body Trajectories (Right) --- */}
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
              tiltDeg={-3.2}
              parallaxSpeed={1.1}
            >
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: '#0D1219',
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
                  {/* Chaotic Orbital Path Curves */}
                  {[-1, 0, 1].map((bodyIdx) => {
                    const t = frame * 0.04 + bodyIdx * 2.1;
                    const bx = 210 + Math.sin(t * 1.3) * 110 + Math.cos(t * 0.7) * 40;
                    const by = 165 + Math.cos(t * 1.1) * 75 + Math.sin(t * 0.5) * 35;
                    const col = bodyIdx === -1 ? orange : bodyIdx === 0 ? gold : '#FFFFFF';

                    return (
                      <g key={bodyIdx}>
                        {/* Trailing Tail Curve */}
                        <circle
                          cx={bx}
                          cy={by}
                          r={bodyIdx === -1 ? 14 : 10}
                          fill={col}
                          stroke="#000000"
                          strokeWidth="2"
                        />
                        <line
                          x1={210}
                          y1={165}
                          x2={bx}
                          y2={by}
                          stroke={col}
                          strokeWidth="1.5"
                          strokeDasharray="4 4"
                          opacity="0.6"
                        />
                      </g>
                    );
                  })}

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
                    FIG 02.7 // REBOUND N-BODY TIDAL SHEAR
                  </text>
                </svg>

                {/* Tape strip */}
                <div
                  style={{
                    position: 'absolute',
                    top: -10,
                    left: 40,
                    width: 85,
                    height: 22,
                    backgroundColor: 'rgba(243, 182, 89, 0.85)',
                    transform: 'rotate(7deg)',
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
              transform: `translateX(-50%) scale(${stickerSpring3}) rotate(1deg)`,
              zIndex: 25,
            }}
          >
            <div
              style={{
                padding: '8px 24px',
                backgroundColor: '#161E2E',
                border: '3px solid #FFFFFF',
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
                  backgroundColor: orange,
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
                CRITICAL COLLAPSE MATRIX // SIMULATION 02
              </span>
            </div>
          </div>

          {/* --- PRE-BAM DOTTED EVENT HORIZON TRACER LINES (Frames 160 -> 224) --- */}
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
              <div
                style={{
                  width: `${guideSweep * 85}%`,
                  height: 2,
                  backgroundImage: `linear-gradient(to right, ${orange} 50%, transparent 50%)`,
                  backgroundSize: '16px 2px',
                  opacity: 0.9,
                }}
              />
              <div
                style={{
                  display: 'flex',
                  gap: 22,
                  marginTop: 18,
                  opacity: guideSweep,
                }}
              >
                {'THE SIMULATION'.split('').map((char, cIdx) => (
                  <div
                    key={cIdx}
                    style={{
                      width: 36,
                      height: 54,
                      border: `1.5px dashed ${orange}`,
                      borderRadius: 4,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 12,
                      color: 'rgba(230, 90, 40, 0.7)',
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
                  width: 950,
                  height: 320,
                  borderRadius: '50%',
                  border: `4px solid ${orange}`,
                  transform: `scale(${shockwaveScale})`,
                  opacity: shockwaveOpacity,
                  filter: 'blur(2px)',
                }}
              />

              {/* Monolithic Vox Sticker Title Container */}
              <div
                style={{
                  transform: `scale(${titleSpring}) rotate(1.2deg)`,
                  filter:
                    'drop-shadow(0 24px 48px rgba(0,0,0,0.8)) drop-shadow(0 10px 20px rgba(230, 90, 40, 0.45))',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    padding: '24px 64px',
                    borderRadius: 12,
                    border: '6px solid #090D12',
                    display: 'inline-block',
                    boxShadow: '16px 18px 0px #E65A28, 22px 24px 0px #090D12',
                  }}
                >
                  <h1
                    style={{
                      margin: 0,
                      fontFamily: "'Montserrat', 'Inter', sans-serif",
                      fontSize: isVertical ? 72 : 108,
                      fontWeight: 900,
                      letterSpacing: 4.0,
                      textTransform: 'uppercase',
                      color: '#090D12',
                      lineHeight: 1.0,
                    }}
                  >
                    THE SIMULATION
                  </h1>
                </div>

                <div
                  style={{
                    marginTop: 24,
                    display: 'inline-block',
                    padding: '10px 32px',
                    backgroundColor: '#E65A28',
                    borderRadius: 6,
                    transform: 'rotate(-1.5deg)',
                    boxShadow: '0 6px 16px rgba(0,0,0,0.4)',
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 22,
                      fontWeight: 900,
                      letterSpacing: 3.5,
                      color: '#FFFFFF',
                      textTransform: 'uppercase',
                    }}
                  >
                    // EXTREME EXPERIMENTS //
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Synchronized Vox Subtitle Burner (Frames 15 -> 185) */}
          {frame >= 15 && frame <= 185 && (
            <VoxSubtitleBurner
              narration={voText}
              durationFrames={170}
              accentColor={orange}
            />
          )}
        </div>
      </VoxPaperFrame>
    </AbsoluteFill>
  );
};
