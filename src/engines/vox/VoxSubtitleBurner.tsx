import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";

interface VoxSubtitleBurnerProps {
  narration: string;
  durationFrames: number;
  accentColor: string;
}

export const VoxSubtitleBurner: React.FC<VoxSubtitleBurnerProps> = ({
  narration,
  durationFrames,
  accentColor,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Split narration into clause chunks (approx 6-10 words per chunk)
  const words = narration.split(" ");
  const chunkSize = 8;
  const chunks: string[] = [];
  for (let i = 0; i < words.length; i += chunkSize) {
    chunks.push(words.slice(i, i + chunkSize).join(" "));
  }

  // Calculate which chunk is active based on frame progress
  const progress = Math.min(1, Math.max(0, frame / Math.max(1, durationFrames)));
  const currentChunkIndex = Math.min(
    chunks.length - 1,
    Math.floor(progress * chunks.length)
  );
  const activeText = chunks[currentChunkIndex] || "";

  // Subtle bounce on chunk transition
  const chunkFrame = frame % Math.max(1, Math.floor(durationFrames / chunks.length));
  const chunkScale = interpolate(chunkFrame, [0, 4], [0.96, 1.0], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        bottom: 50,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 100,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          padding: "12px 28px",
          backgroundColor: "rgba(0, 0, 0, 0.78)",
          borderRadius: 8,
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
          textAlign: "center",
          transform: `scale(${chunkScale})`,
        }}
      >
        <span
          style={{
            fontFamily: "'Inter', 'Montserrat', -apple-system, sans-serif",
            fontSize: 34,
            fontWeight: 800,
            lineHeight: 1.35,
            color: "#FFFFFF",
            letterSpacing: 0.5,
            textShadow: "0 2px 4px rgba(0,0,0,0.8)",
          }}
        >
          {activeText}
        </span>
      </div>
    </div>
  );
};
