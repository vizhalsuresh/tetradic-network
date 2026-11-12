import React from "react";
import { interpolate, useCurrentFrame } from "remotion";

interface VoxStickerCutoutProps {
  children: React.ReactNode;
  width?: number | string;
  height?: number | string;
  tiltDeg?: number;
  parallaxSpeed?: number;
  style?: React.CSSProperties;
}

export const VoxStickerCutout: React.FC<VoxStickerCutoutProps> = ({
  children,
  width,
  height,
  tiltDeg = -1.5,
  parallaxSpeed = 1.0,
  style,
}) => {
  const frame = useCurrentFrame();

  // Subtle natural floating drift
  const driftY = interpolate(
    Math.sin((frame * 0.04) * parallaxSpeed),
    [-1, 1],
    [-4, 4]
  );
  const driftX = interpolate(
    Math.cos((frame * 0.03) * parallaxSpeed),
    [-1, 1],
    [-3, 3]
  );

  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        transform: `translate(${driftX}px, ${driftY}px) rotate(${tiltDeg}deg)`,
        transition: "transform 0.1s ease-out",
        filter: "drop-shadow(0 14px 28px rgba(0,0,0,0.32)) drop-shadow(0 4px 10px rgba(0,0,0,0.2))",
        ...style,
      }}
    >
      <div
        style={{
          borderRadius: 8,
          border: "4px solid #FFFFFF",
          overflow: "hidden",
          backgroundColor: "#FFFFFF",
          boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.1)",
        }}
      >
        {children}
      </div>
    </div>
  );
};
