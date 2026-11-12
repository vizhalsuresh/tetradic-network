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

export const BlueprintDir4BlenderComposite: React.FC<BlueprintTitleProps> = ({
  aspectRatio = '16:9',
  episodeCode = 'BP-001',
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const isVertical = aspectRatio === '9:16' || height > width;

  const pushSpring = spring({
    frame: frame - 15,
    fps,
    config: { damping: 14, stiffness: 80 },
  });

  const scanlineProgress = (frame * 4) % (height + 200);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#020907',
        backgroundImage: 'radial-gradient(circle at 50% 50%, #0B493A 0%, #010403 100%)',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: "'JetBrains Mono', monospace",
        color: '#F3B659',
        overflow: 'hidden',
      }}
    >
      <Audio src={staticFile('audio/blueprint_acoustic_ident.mp3')} />

      {/* 3D Wireframe HUD Telemetry & Vector Reticles */}
      <div
        style={{
          position: 'absolute',
          inset: 40,
          border: '1px solid rgba(243, 182, 89, 0.2)',
          pointerEvents: 'none',
        }}
      >
        {/* Reticles */}
        <div style={{ position: 'absolute', top: 20, left: 20, fontSize: 12, color: '#4DD0E1' }}>
          CAM_PASS: 01 // BLENDER_EEVEE_NEXT // RAYTRACED_CAD
        </div>
        <div style={{ position: 'absolute', top: 20, right: 20, fontSize: 12, color: '#E65A28' }}>
          DEPTH_BUFFER: 32-BIT FLOAT // COORD: [51.4826° N, 0.0077° W]
        </div>

        {/* Dynamic Center Crosshair */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: isVertical ? 400 : 700,
            height: isVertical ? 300 : 380,
            border: '1px dashed rgba(77, 208, 225, 0.35)',
          }}
        />
      </div>

      {/* Moving Horizontal Scanline */}
      <div
        style={{
          position: 'absolute',
          top: scanlineProgress - 100,
          left: 0,
          right: 0,
          height: 3,
          background: 'linear-gradient(90deg, transparent 0%, #4DD0E1 50%, transparent 100%)',
          opacity: 0.65,
          boxShadow: '0 0 15px #4DD0E1',
          pointerEvents: 'none',
        }}
      />

      {/* Monolithic Typography */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          textAlign: 'center',
          transform: `scale(${interpolate(pushSpring, [0, 1], [0.92, 1.0])})`,
        }}
      >
        <div
          style={{
            fontSize: isVertical ? 15 : 19,
            fontWeight: 800,
            letterSpacing: '0.4em',
            color: '#E65A28',
            marginBottom: 16,
            textTransform: 'uppercase',
          }}
        >
          // HYBRID 3D HUD COMPOSITE //
        </div>

        <h1
          style={{
            margin: 0,
            fontSize: isVertical ? 66 : 112,
            fontWeight: 900,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: '#F3B659',
            lineHeight: 1,
            textShadow: '0 0 45px rgba(243, 182, 89, 0.5), 0 10px 40px rgba(0, 0, 0, 0.95)',
          }}
        >
          THE BLUEPRINT
        </h1>

        <div
          style={{
            marginTop: 24,
            fontSize: isVertical ? 13 : 16,
            fontWeight: 700,
            letterSpacing: '0.24em',
            color: 'rgba(243, 182, 89, 0.85)',
          }}
        >
          <span style={{ color: '#E65A28' }}>[{episodeCode}]</span>
          <span> BLENDER 3D PASS // REMOTION VECTOR COMPOSITING</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
