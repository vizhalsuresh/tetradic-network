import React from "react";
import {
  Audio,
  Series,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  VoxPaperFrame,
  VoxStatCallout,
  VoxStickerCutout,
  VoxSubtitleBurner,
} from "../../../engines/vox";

// 18 Beats Data & Measured Durations from vo_durations.json (Total: 224.92s / 3.75 min)
const BEATS = [
  {
    id: 1,
    duration: 12.43,
    caption: "NEWTON: 1687",
    narration:
      "If you place two rocks in an empty universe, their gravitational dance is eternal, flawless, and mathematically solved down to the microsecond. But add just ONE more pebble, and the most powerful supercomputers on Earth cannot predict where they will be tomorrow.",
  },
  {
    id: 2,
    duration: 9.07,
    caption: "THE THIRD BODY",
    narration:
      "To understand why a simple trio of orbiting stones breaks the foundations of modern physics, you have to go back to 1687 and Isaac Newton.",
  },
  {
    id: 3,
    duration: 13.25,
    caption: "2 BODIES: SOLVED",
    narration:
      "Newton published the Principia Mathematica, giving humanity the universal law of gravitation. For two bodies, like the Earth and the Sun, the math was clean: a perfect closed-form equation that predicts their path forever.",
  },
  {
    id: 4,
    duration: 12.98,
    caption: "NO GENERAL SOLUTION",
    narration:
      "Newton believed the entire cosmos was a clockwork machine that could be solved with the same equations. But when he tried to calculate the motion of three bodies orbiting each other, his math collapsed into an infinite, unsolvable loop.",
  },
  {
    id: 5,
    duration: 11.64,
    caption: "KING'S PRIZE: 1887",
    narration:
      "For two centuries, the greatest mathematical minds in Europe tried and failed to find a general formula for the three-body problem. In 1887, King Oscar II of Sweden offered a gold medal and a royal fortune to whoever could solve it.",
  },
  {
    id: 6,
    duration: 13.61,
    caption: "POINCARÉ'S HORROR",
    narration:
      "A brilliant French mathematician named Henri Poincaré set out to win the prize. But during his calculations, Poincaré made a terrifying discovery: there is no formula. And there never will be.",
  },
  {
    id: 7,
    duration: 15.67,
    caption: "DETERMINISTIC CHAOS",
    narration:
      "What Poincaré uncovered was the birth of chaos theory: extreme sensitivity to initial conditions. If you change the starting position of one star by the width of a single atom, within a million years, the entire system ends in completely different chaos.",
  },
  {
    id: 8,
    duration: 10.03,
    caption: "1 ATOM = CATASTROPHE",
    narration:
      "In a three-body system, gravity doesn't gently shepherd the bodies into predictable paths. Instead, their overlapping gravitational fields tug, twist, and amplify microscopic perturbations exponentially over time.",
  },
  {
    id: 9,
    duration: 13.75,
    caption: "NUMERICAL STEPPING",
    narration:
      "Celestial mechanics calls this non-integrability. Because each body exerts force on the other two simultaneously, their paths become chaotic strange attractors, looping unpredictably through phase space without ever repeating.",
  },
  {
    id: 10,
    duration: 13.27,
    caption: "GRAVITATIONAL SLINGSHOT",
    narration:
      "Watch a computer simulation of three equal-mass stars. For decades, they might perform an intricate figure-eight braid. Then, without warning, one close encounter destabilizes the triad.",
  },
  {
    id: 11,
    duration: 11.76,
    caption: "EJECTION: 1 SURVIVOR",
    narration:
      "One star slingshots outward at hypervelocity, stealing kinetic energy from the system, leaving behind a tightly locked binary pair while the third star wanders the galaxy forever as an outcast rogue.",
  },
  {
    id: 12,
    duration: 12.34,
    caption: "8 PLANETS // N-BODIES",
    narration:
      "You might wonder: our own Solar System has eight planets, hundreds of moons, and thousands of asteroids. If three bodies are chaotic, why hasn't Earth been thrown into deep space?",
  },
  {
    id: 13,
    duration: 12.36,
    caption: "5 MILLION YEAR LIMIT",
    narration:
      "The answer is mass hierarchy. Because the Sun contains ninety-nine point eight percent of all mass in our solar system, every planet essentially experiences a series of decoupled two-body problems, stabilized by vast distances.",
  },
  {
    id: 14,
    duration: 14.74,
    caption: "MERCURY-JUPITER LOCK",
    narration:
      "But here is the chilling truth: our Solar System is not permanently stable. In 2009, supercomputer simulations ran over two thousand possible futures of our planetary orbits across the next five billion years.",
  },
  {
    id: 15,
    duration: 10.99,
    caption: "1% CHANCE OF RUPTURE",
    narration:
      "The simulations revealed a one percent chance of total planetary catastrophe. Mercury, because of its tiny mass and eccentric orbit, can fall into a chaotic orbital resonance with Jupiter's colossal gravitational field.",
  },
  {
    id: 16,
    duration: 12.14,
    caption: "INNER SYSTEM COLLAPSE",
    narration:
      "In that one percent scenario, Mercury's orbit stretches so wildly over billions of years that it crosses Venus, triggering a catastrophic gravitational pinball game that ends with Mercury crashing directly into Earth.",
  },
  {
    id: 17,
    duration: 11.16,
    caption: "THE ILLUSION OF CLOCKWORK",
    narration:
      "We have engineered quantum computers, mapped cosmic background radiation from the dawn of time, and photographed black holes millions of light years away.",
  },
  {
    id: 18,
    duration: 13.73,
    caption: "BORROWED TIME",
    narration:
      "Yet place three simple stones in an empty room, let gravity take hold, and the universe keeps its ultimate secret: deterministic laws do not guarantee a predictable destiny.",
  },
];

export const SIMULATION_VOX_DURATION_FRAMES = BEATS.reduce(
  (acc, b) => acc + Math.round(b.duration * 30),
  0
);

export const SimulationVoxExplainer: React.FC = () => {
  return (
    <div style={{ position: "relative", width: 1920, height: 1080 }}>
      {/* Background Music ducked underneath voiceover */}
      <Audio
        src={staticFile("vox_explainer/simulation_audio/music.mp3")}
        volume={0.16}
      />

      <Series>
        {BEATS.map((beat) => {
          const durationFrames = Math.round(beat.duration * 30);
          return (
            <Series.Sequence
              key={beat.id}
              durationInFrames={durationFrames}
            >
              <SimulationBeatScene
                beat={beat}
                durationFrames={durationFrames}
              />
            </Series.Sequence>
          );
        })}
      </Series>
    </div>
  );
};

const SimulationBeatScene: React.FC<{
  beat: (typeof BEATS)[0];
  durationFrames: number;
}> = ({ beat, durationFrames }) => {
  const frame = useCurrentFrame();

  const scale = interpolate(frame, [0, durationFrames], [1.0, 1.04], {
    extrapolateRight: "clamp",
  });

  return (
    <VoxPaperFrame accentColor="#E65A28" theme="simulation">
      <Audio
        src={staticFile(
          `vox_explainer/simulation_audio/vo/beat_${String(beat.id).padStart(
            2,
            "0"
          )}.mp3`
        )}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          transform: `scale(${scale})`,
        }}
      >
        <SimulationVisualIllustration beatId={beat.id} />
      </div>

      {beat.caption && (
        <VoxStatCallout
          text={beat.caption}
          accentColor="#E65A28"
          theme="simulation"
        />
      )}

      <VoxSubtitleBurner
        narration={beat.narration}
        durationFrames={durationFrames}
        accentColor="#E65A28"
      />
    </VoxPaperFrame>
  );
};

const SimulationVisualIllustration: React.FC<{ beatId: number }> = ({
  beatId,
}) => {
  const frame = useCurrentFrame();

  switch (beatId) {
    case 1: // Three chaotic bodies
    case 10: // Figure 8 orbit
      return (
        <VoxStickerCutout width={940} height={540} tiltDeg={-1}>
          <svg viewBox="0 0 940 540" width="100%" height="100%">
            <rect width="940" height="540" fill="#0B0E14" />
            {/* Chaotic Trajectory Ribbon */}
            <path
              d="M 240 270 C 380 120 560 420 700 270 C 560 120 380 420 240 270 Z"
              stroke="#E65A28"
              strokeWidth="4"
              fill="none"
              strokeDasharray="12 6"
              filter="drop-shadow(0 0 10px rgba(230,90,40,0.6))"
            />
            {/* Three Celestial Spheres */}
            <circle
              cx={470 + Math.sin(frame * 0.08) * 220}
              cy={270 + Math.cos(frame * 0.08) * 110}
              r="22"
              fill="#F3B659"
              filter="drop-shadow(0 0 16px #F3B659)"
            />
            <circle
              cx={470 + Math.sin(frame * 0.08 + (2 * Math.PI) / 3) * 220}
              cy={270 + Math.cos(frame * 0.08 + (2 * Math.PI) / 3) * 110}
              r="22"
              fill="#E65A28"
              filter="drop-shadow(0 0 16px #E65A28)"
            />
            <circle
              cx={470 + Math.sin(frame * 0.08 + (4 * Math.PI) / 3) * 220}
              cy={270 + Math.cos(frame * 0.08 + (4 * Math.PI) / 3) * 110}
              r="22"
              fill="#00E5FF"
              filter="drop-shadow(0 0 16px #00E5FF)"
            />
          </svg>
        </VoxStickerCutout>
      );

    case 3: // Newton's Keplerian 2-body orbit
      return (
        <VoxStickerCutout width={900} height={500} tiltDeg={1}>
          <svg viewBox="0 0 900 500" width="100%" height="100%">
            <rect width="900" height="500" fill="#090E16" />
            <ellipse
              cx="450"
              cy="250"
              rx="280"
              ry="160"
              fill="none"
              stroke="#F3B659"
              strokeWidth="3"
              strokeDasharray="8 6"
            />
            {/* Sun at Focus */}
            <circle
              cx="360"
              cy="250"
              r="34"
              fill="#F3B659"
              filter="drop-shadow(0 0 24px #F3B659)"
            />
            {/* Orbiting Planet */}
            <circle
              cx={450 + Math.cos(frame * 0.05) * 280}
              cy={250 + Math.sin(frame * 0.05) * 160}
              r="16"
              fill="#00E5FF"
              filter="drop-shadow(0 0 12px #00E5FF)"
            />
          </svg>
        </VoxStickerCutout>
      );

    case 15: // Mercury-Jupiter resonance & collision danger
    case 16:
      return (
        <VoxStickerCutout width={920} height={520} tiltDeg={-0.5}>
          <svg viewBox="0 0 920 520" width="100%" height="100%">
            <rect width="920" height="520" fill="#0E0C10" />
            {/* Sun at Center */}
            <circle cx="460" cy="260" r="28" fill="#F3B659" />
            {/* Venus & Earth normal orbits */}
            <circle
              cx="460"
              cy="260"
              r="90"
              fill="none"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="2"
            />
            <circle
              cx="460"
              cy="260"
              r="140"
              fill="none"
              stroke="#00E5FF"
              strokeWidth="2.5"
            />
            {/* Mercury Eccentric Distorted Orbit */}
            <ellipse
              cx="420"
              cy="260"
              rx={190 + Math.sin(frame * 0.1) * 30}
              ry="70"
              fill="none"
              stroke="#E65A28"
              strokeWidth="4"
              strokeDasharray="8 4"
            />
            {/* Collision Crosshair */}
            <circle
              cx="320"
              cy="260"
              r="18"
              fill="none"
              stroke="#E65A28"
              strokeWidth="3"
            />
            <text
              x="260"
              y="225"
              fill="#E65A28"
              fontFamily="monospace"
              fontSize="16"
              fontWeight="bold"
            >
              ORBITAL CROSSING (1% RISK)
            </text>
          </svg>
        </VoxStickerCutout>
      );

    default: // Cosmic Phase Space Manifold
      return (
        <VoxStickerCutout width={900} height={500} tiltDeg={0.5}>
          <svg viewBox="0 0 900 500" width="100%" height="100%">
            <rect width="900" height="500" fill="#0D111A" />
            {/* Phase Space Contours */}
            {Array.from({ length: 8 }).map((_, i) => (
              <ellipse
                key={i}
                cx="450"
                cy="250"
                rx={60 + i * 40}
                ry={30 + i * 22}
                fill="none"
                stroke={i % 2 === 0 ? "#E65A28" : "rgba(255,255,255,0.15)"}
                strokeWidth="2"
                strokeDasharray="6 6"
                transform={`rotate(${i * 12 + frame * 0.1} 450 250)`}
              />
            ))}
            <text
              x="50"
              y="450"
              fill="#E65A28"
              fontFamily="monospace"
              fontSize="18"
              fontWeight="bold"
            >
              CHAOTIC PHASE SPACE MANIFOLD // BEAT {beatId < 10 ? `0${beatId}` : beatId}
            </text>
          </svg>
        </VoxStickerCutout>
      );
  }
};
