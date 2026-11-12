import React from "react";
import { interpolate, useCurrentFrame } from "remotion";

interface VoxPaperFrameProps {
  accentColor: string;
  theme?: "blueprint" | "simulation" | "paradox";
  children?: React.ReactNode;
}

export const VoxPaperFrame: React.FC<VoxPaperFrameProps> = ({
  accentColor,
  theme = "blueprint",
  children,
}) => {
  const frame = useCurrentFrame();

  // Subtle breathing camera drift for the collage
  const zoom = interpolate(frame % 300, [0, 300], [1.0, 1.025], {
    extrapolateRight: "clamp",
  });

  const isDark = theme === "simulation" || theme === "paradox";
  const bgBase = isDark ? "#090D12" : "#F4EFE6";
  const paperPanelBg = isDark ? "#101620" : "#FBF8F1";
  const textColor = isDark ? "#ECEFF4" : "#1A202C";
  const gridColor = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";

  return (
    <div
      style={{
        position: "absolute",
        width: 1920,
        height: 1080,
        backgroundColor: bgBase,
        overflow: "hidden",
        fontFamily: "'Inter', 'Montserrat', -apple-system, sans-serif",
      }}
    >
      {/* Halftone SVG Pattern Definition */}
      <svg style={{ position: "absolute", width: 0, height: 0 }}>
        <defs>
          <pattern
            id={`halftone-${theme}`}
            x="0"
            y="0"
            width="16"
            height="16"
            patternUnits="userSpaceOnUse"
          >
            <circle
              cx="8"
              cy="8"
              r="2.2"
              fill={isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)"}
            />
          </pattern>
        </defs>
      </svg>

      {/* Main Editorial Collage Panel (Simulating pinned paper canvas) */}
      <div
        style={{
          position: "absolute",
          left: 48,
          top: 36,
          width: 1824,
          height: 1008,
          backgroundColor: paperPanelBg,
          boxShadow: isDark
            ? "0 20px 50px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.08)"
            : "0 20px 50px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05)",
          transform: `scale(${zoom})`,
          transformOrigin: "center center",
          overflow: "hidden",
        }}
      >
        {/* Halftone Texture Overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(#halftone-${theme})`,
            pointerEvents: "none",
            opacity: 0.85,
          }}
        />

        {/* Editorial Coordinate Grid */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `
              linear-gradient(to right, ${gridColor} 1px, transparent 1px),
              linear-gradient(to bottom, ${gridColor} 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
            opacity: 0.6,
          }}
        />

        {/* Diagonal Washi Tape Strips at Corners */}
        {/* Top-Left Tape */}
        <div
          style={{
            position: "absolute",
            left: -20,
            top: 18,
            width: 110,
            height: 32,
            backgroundColor: isDark
              ? "rgba(230, 220, 200, 0.22)"
              : "rgba(245, 235, 215, 0.75)",
            backdropFilter: "blur(2px)",
            transform: "rotate(-38deg)",
            boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
            zIndex: 10,
          }}
        />
        {/* Top-Right Tape */}
        <div
          style={{
            position: "absolute",
            right: -20,
            top: 18,
            width: 110,
            height: 32,
            backgroundColor: isDark
              ? "rgba(230, 220, 200, 0.22)"
              : "rgba(245, 235, 215, 0.75)",
            backdropFilter: "blur(2px)",
            transform: "rotate(38deg)",
            boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
            zIndex: 10,
          }}
        />

        {/* Flat Geometric Accents (Vox signature style) */}
        <div
          style={{
            position: "absolute",
            top: 24,
            left: 32,
            display: "flex",
            alignItems: "center",
            gap: 12,
            zIndex: 15,
          }}
        >
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: "50%",
              backgroundColor: accentColor,
            }}
          />
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 13,
              fontWeight: 800,
              letterSpacing: 2.5,
              textTransform: "uppercase",
              color: textColor,
              opacity: 0.65,
            }}
          >
            TETRADIC NETWORK // EXPLAINER SERIES
          </div>
        </div>

        {/* Scene Children */}
        {children}
      </div>
    </div>
  );
};
