import React from 'react';

interface ComicPanelProps {
  children: React.ReactNode;
  borderWidth?: number;
  borderColor?: string;
  backgroundColor?: string;
  tiltDeg?: number;
  width?: string | number;
  height?: string | number;
  style?: React.CSSProperties;
  badge?: string;
}

export const ComicPanel: React.FC<ComicPanelProps> = ({
  children,
  borderWidth = 8,
  borderColor = '#0A0A0C',
  backgroundColor = '#FFFFFF',
  tiltDeg = 0,
  width = '100%',
  height = '100%',
  style = {},
  badge,
}) => {
  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
        backgroundColor,
        border: `${borderWidth}px solid ${borderColor}`,
        borderRadius: 16,
        transform: `rotate(${tiltDeg}deg)`,
        boxShadow: '12px 14px 0px #0A0A0C',
        overflow: 'hidden',
        boxSizing: 'border-box',
        ...style,
      }}
    >
      {/* Optional Top Left Comic Issue / Chapter Badge */}
      {badge && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            backgroundColor: '#FF3333',
            color: '#FFFFFF',
            fontFamily: 'Impact, Arial Black, sans-serif',
            fontSize: 22,
            letterSpacing: '1px',
            padding: '6px 18px',
            borderRight: `${borderWidth}px solid ${borderColor}`,
            borderBottom: `${borderWidth}px solid ${borderColor}`,
            zIndex: 30,
            textTransform: 'uppercase',
          }}
        >
          {badge}
        </div>
      )}

      {/* Comic Halftone / Dot Grid subtle overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'radial-gradient(#0A0A0C 1.5px, transparent 1.5px)',
          backgroundSize: '20px 20px',
          opacity: 0.04,
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      <div style={{ position: 'relative', width: '100%', height: '100%', zIndex: 2 }}>
        {children}
      </div>
    </div>
  );
};
