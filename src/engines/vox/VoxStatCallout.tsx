import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";

interface VoxStatCalloutProps {
  text: string;
  accentColor: string;
  theme?: "blueprint" | "simulation" | "paradox";
  top?: number;
  right?: number;
}

export const VoxStatCallout: React.FC<VoxStatCalloutProps> = ({
  text,
  accentColor,
  theme = "blueprint",
  top = 90,
  right = 80,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 180 },
  });

  const scale = entrance;
  const opacity = Math.min(1, entrance * 1.5);

  const isDark = theme === "simulation" || theme === "paradox";
  const bgBadge = isDark ? "#161E2E" : "#FFFFFF";
  const borderBadge = isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.12)";

  return (
    <div
      style={{
        position: "absolute",
        top,
        right,
        transform: `scale(${scale}) rotate(1deg)`,
        opacity,
        zIndex: 50,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          padding: "16px 28px",
          backgroundColor: bgBadge,
          borderRadius: 6,
          border: `3px solid ${borderBadge}`,
          borderLeft: `10px solid ${accentColor}`,
          boxShadow: isDark
            ? "0 18px 40px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.05)"
            : "0 18px 40px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.05)",
        }}
      >
        <span
          style={{
            fontFamily: "'JetBrains Mono', 'Impact', sans-serif",
            fontSize: 28,
            fontWeight: 900,
            letterSpacing: 2.0,
            textTransform: "uppercase",
            color: isDark ? "#FFFFFF" : "#111827",
          }}
        >
          {text}
        </span>
      </div>
    </div>
  );
};
