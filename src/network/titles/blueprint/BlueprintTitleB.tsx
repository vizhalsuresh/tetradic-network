import React from 'react';
import {
  AbsoluteFill,
  Audio,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

export interface BlueprintTitleProps {
  aspectRatio?: '16:9' | '9:16';
  episodeCode?: string;
}

export const BlueprintTitleB: React.FC<BlueprintTitleProps> = ({
  aspectRatio = '16:9',
  episodeCode = 'BP-001',
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isVertical = aspectRatio === '9:16' || height > width;

  // --- 1. CAMERA CHOREOGRAPHY (TinySpline Motorized Crane Arc) ---
  // Frame 0-110: Slow cinematic orbital glide
  // Frame 110-145: High-inertia magnetic snap into orthographic 2D
  const snapSpring = spring({
    frame: frame - 105,
    fps,
    config: { damping: 13, stiffness: 85, mass: 1.2 },
  });

  const rotX = interpolate(snapSpring, [0, 1], [36 - (frame * 0.05), 0]);
  const rotY = interpolate(snapSpring, [0, 1], [-26 + (frame * 0.08), 0]);
  const rotZ = interpolate(snapSpring, [0, 1], [8 - (frame * 0.03), 0]);
  const scale = interpolate(snapSpring, [0, 1], [0.84 + (frame * 0.0006), 1.0]);

  // Screen shake on magnetic snap impact (Frame 125-140)
  const shakeFrame = frame - 125;
  const shakeIntensity = interpolate(shakeFrame, [0, 2, 8, 16], [0, 8, 3, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const shakeX = Math.sin(shakeFrame * 1.8) * shakeIntensity;
  const shakeY = Math.cos(shakeFrame * 2.2) * shakeIntensity;

  // --- 2. LAYER SEPARATION (Exploded Assembly) ---
  const layerSpread = spring({
    frame: frame - 10,
    fps,
    config: { damping: 14, stiffness: 70, mass: 1.0 },
  });

  const zBack = interpolate(snapSpring, [0, 1], [-190 * layerSpread, 0]);
  const zCircuits = interpolate(snapSpring, [0, 1], [-80 * layerSpread, 0]);
  const zText = interpolate(snapSpring, [0, 1], [40 * layerSpread, 0]);
  const zHUD = interpolate(snapSpring, [0, 1], [160 * layerSpread, 0]);

  // --- 3. KINOBOKEH DEPTH-OF-FIELD BLUR ---
  // Back chassis is blurred during 3D explosion, snaps to 100% pin-sharp on 2D lock
  const backplaneBlur = interpolate(snapSpring, [0, 0.8, 1], [2.8 * layerSpread, 0.6, 0]);

  // --- 4. RAY OPTICS SPECULAR GLASS REFRACTION ---
  const sheenProgress = interpolate(frame, [25, 95], [-50, 180]);

  // --- 5. GLSL-RANDOM 3D SUSPENDED PARTICLES (24 Nodes) ---
  const particles = React.useMemo(() => {
    const list = [];
    for (let i = 0; i < 24; i++) {
      // Deterministic seeded coordinates
      const x = ((Math.sin(i * 997) * 0.5 + 0.5) * 1200) - 600;
      const y = ((Math.cos(i * 613) * 0.5 + 0.5) * 500) - 250;
      const z = ((Math.sin(i * 389) * 0.5 + 0.5) * 260) - 130;
      const size = (i % 3 === 0) ? 3 : 2;
      const color = (i % 4 === 0) ? '#E65A28' : (i % 2 === 0) ? '#4DD0E1' : '#F3B659';
      list.push({ x, y, z, size, color, id: i });
    }
    return list;
  }, []);

  // --- 6. DYNAMIC Z-CALIPER MEASUREMENT ---
  const currentZSeparation = Math.round(interpolate(snapSpring, [0, 1], [350 * layerSpread, 0]));

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#03120E',
        backgroundImage: 'radial-gradient(circle at 50% 45%, #0B493A 0%, #010806 100%)',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: "'JetBrains Mono', monospace",
        color: '#F3B659',
        overflow: 'hidden',
        perspective: 1500,
      }}
    >
      {/* Orpheus Bespoke Cinematic Audio Score */}
      <Audio src={staticFile('audio/blueprint_theme_8s.mp3')} />

      {/* 3D Transform Stage with Camera Shake */}
      <div
        style={{
          position: 'relative',
          width: isVertical ? 920 : 1380,
          height: isVertical ? 640 : 440,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          transformStyle: 'preserve-3d',
          transform: `
            translate3d(${shakeX}px, ${shakeY}px, 0)
            rotateX(${rotX}deg)
            rotateY(${rotY}deg)
            rotateZ(${rotZ}deg)
            scale(${scale})
          `,
        }}
      >
        {/* Layer 1: Backplane Blueprint Grid (Z: -190px) + KinoBokeh Blur */}
        <div
          style={{
            position: 'absolute',
            inset: -40,
            border: '1px solid rgba(243, 182, 89, 0.18)',
            backgroundColor: 'rgba(11, 73, 58, 0.38)',
            backgroundImage: `
              linear-gradient(to right, rgba(224, 247, 250, 0.09) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(224, 247, 250, 0.09) 1px, transparent 1px)
            `,
            backgroundSize: '32px 32px',
            transform: `translateZ(${zBack}px)`,
            boxShadow: '0 30px 80px rgba(0, 0, 0, 0.8)',
            filter: `blur(${backplaneBlur}px)`,
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 14,
              left: 18,
              fontSize: 12,
              letterSpacing: '0.22em',
              color: 'rgba(224, 247, 250, 0.55)',
            }}
          >
            SYS.CHASSIS // LAYER_01 // AXIAL_PLANE // DEPTH: -190MM
          </div>
        </div>

        {/* Layer 2: Exploded Circuit Bus & Specular Glass Refraction (Z: -80px) */}
        <div
          style={{
            position: 'absolute',
            inset: -10,
            transform: `translateZ(${zCircuits}px)`,
            pointerEvents: 'none',
            overflow: 'hidden',
          }}
        >
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
            {/* Animated Circuit Paths */}
            <path
              d="M 60 50 L 320 50 L 400 120 L 1100 120"
              fill="none"
              stroke="#E65A28"
              strokeWidth="2.5"
              strokeDasharray="10 5"
              strokeDashoffset={-frame * 1.5}
              opacity="0.85"
            />
            <path
              d="M 1320 390 L 1040 390 L 960 320 L 180 320"
              fill="none"
              stroke="#4DD0E1"
              strokeWidth="2"
              strokeDasharray="14 6"
              strokeDashoffset={frame * 1.8}
              opacity="0.8"
            />
            <circle cx="400" cy="120" r="6" fill="#E65A28" style={{ filter: 'drop-shadow(0 0 10px #E65A28)' }} />
            <circle cx="960" cy="320" r="6" fill="#4DD0E1" style={{ filter: 'drop-shadow(0 0 10px #4DD0E1)' }} />
          </svg>

          {/* Ray Optics Specular Light Sheen Sweeping Across Glass */}
          <div
            style={{
              position: 'absolute',
              top: -200,
              bottom: -200,
              width: 140,
              left: `${sheenProgress}%`,
              background: 'linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.02) 40%, rgba(243,182,89,0.22) 50%, rgba(255,255,255,0.04) 60%, transparent 100%)',
              transform: 'skewX(-25deg)',
              pointerEvents: 'none',
            }}
          />
        </div>

        {/* 3D Suspended Micro-Particles Floating Between Layers */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            transformStyle: 'preserve-3d',
            pointerEvents: 'none',
          }}
        >
          {particles.map((p) => {
            const particleZ = interpolate(snapSpring, [0, 1], [p.z * layerSpread, 0]);
            const driftY = Math.sin((frame * 0.05) + p.id) * 12;
            const driftX = Math.cos((frame * 0.04) + p.id) * 8;
            return (
              <div
                key={p.id}
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  width: p.size,
                  height: p.size,
                  borderRadius: '50%',
                  backgroundColor: p.color,
                  boxShadow: `0 0 10px ${p.color}`,
                  transform: `translate3d(${p.x + driftX}px, ${p.y + driftY}px, ${particleZ}px)`,
                  opacity: interpolate(snapSpring, [0, 0.9, 1], [0.8, 0.6, 0.2]),
                }}
              />
            );
          })}
        </div>

        {/* Layer 3: Hero Volumetric Typography (Z: +40px) */}
        <div
          style={{
            position: 'relative',
            transform: `translateZ(${zText}px)`,
            textAlign: 'center',
          }}
        >
          {/* Subtitle tag */}
          <div
            style={{
              fontSize: isVertical ? 16 : 20,
              fontWeight: 800,
              letterSpacing: '0.38em',
              color: '#E65A28',
              marginBottom: 18,
              textTransform: 'uppercase',
              opacity: interpolate(frame, [15, 35], [0, 1]),
            }}
          >
            // SHOW 01: SYSTEM ARCHITECTURE //
          </div>

          {/* Main Title: THE BLUEPRINT with Volumetric 3D Shadow Layers */}
          <h1
            style={{
              margin: 0,
              fontSize: isVertical ? 68 : 116,
              fontWeight: 900,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: '#F3B659',
              lineHeight: 1,
              textShadow: `
                1px 1px 0 #B88934,
                2px 2px 0 #9E7328,
                3px 3px 0 #7D591B,
                4px 4px 0 #5E4110,
                5px 5px 0 #3D2908,
                6px 6px 20px rgba(0, 0, 0, 0.85),
                0 0 50px rgba(243, 182, 89, 0.35)
              `,
            }}
          >
            THE BLUEPRINT
          </h1>

          {/* Footer Metadata */}
          <div
            style={{
              marginTop: 26,
              fontSize: isVertical ? 14 : 17,
              fontWeight: 700,
              letterSpacing: '0.26em',
              color: 'rgba(243, 182, 89, 0.9)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 16,
              opacity: interpolate(frame, [30, 50], [0, 1]),
            }}
          >
            <span style={{ color: '#E65A28' }}>[{episodeCode}]</span>
            <span>DECONSTRUCTED HARDWARE</span>
            <span style={{ color: 'rgba(224, 247, 250, 0.4)' }}>//</span>
            <span>VOLUMETRIC CAD</span>
          </div>
        </div>

        {/* Layer 4: Floating Top HUD Brackets & Dynamic Z-Caliper (Z: +160px) */}
        <div
          style={{
            position: 'absolute',
            inset: -14,
            transform: `translateZ(${zHUD}px)`,
            pointerEvents: 'none',
            border: '2px solid rgba(230, 90, 40, 0.35)',
          }}
        >
          {/* 4 Invariant Accent Orange corner brackets */}
          <div style={{ position: 'absolute', top: -5, left: -5, width: 32, height: 32, borderTop: '5px solid #E65A28', borderLeft: '5px solid #E65A28' }} />
          <div style={{ position: 'absolute', top: -5, right: -5, width: 32, height: 32, borderTop: '5px solid #E65A28', borderRight: '5px solid #E65A28' }} />
          <div style={{ position: 'absolute', bottom: -5, left: -5, width: 32, height: 32, borderBottom: '5px solid #E65A28', borderLeft: '5px solid #E65A28' }} />
          <div style={{ position: 'absolute', bottom: -5, right: -5, width: 32, height: 32, borderBottom: '5px solid #E65A28', borderRight: '5px solid #E65A28' }} />

          {/* Dynamic Real-Time Z-Caliper Readout */}
          <div
            style={{
              position: 'absolute',
              bottom: -32,
              right: 14,
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: '0.22em',
              color: currentZSeparation === 0 ? '#E65A28' : '#4DD0E1',
            }}
          >
            Z_DELTA: {currentZSeparation}MM // {currentZSeparation === 0 ? '[ORTHOGRAPHIC LOCK: ENGAGED]' : 'ALIGNING_CHASSIS...'}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
