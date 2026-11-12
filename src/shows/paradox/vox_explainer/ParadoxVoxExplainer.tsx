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

// 18 Beats Data & Measured Durations from vo_durations.json (Total: 202.08s / 3.37 min)
const BEATS = [
  {
    id: 1,
    duration: 15.6,
    caption: "10,000 ANGRY PH.D.S",
    narration:
      "In September 1990, the woman with the highest recorded IQ in the world told a million Americans they were mathematically illiterate. Nearly ten thousand people wrote furious letters telling her she was wrong, including almost a thousand PhD mathematicians. They were the ones who were wrong.",
  },
  {
    id: 2,
    duration: 10.63,
    caption: "LET'S MAKE A DEAL",
    narration:
      "To see why your own brain refuses to accept mathematical reality, you have to step onto the illuminated stage of a 1970s television game show: Let's Make a Deal.",
  },
  {
    id: 3,
    duration: 10.75,
    caption: "3 DOORS // 1 CAR",
    narration:
      "You are standing in front of three closed doors. Behind one door is a brand-new, gleaming sports car. Behind the other two doors are live goats.",
  },
  {
    id: 4,
    duration: 11.5,
    caption: "DOOR 1: 33% // DOORS 2&3: 67%",
    narration:
      "You choose Door Number One. Your mathematical chance of picking the sports car right now is exactly one out of three, or thirty-three percent.",
  },
  {
    id: 5,
    duration: 9.98,
    caption: "GOAT REVEALED",
    narration:
      "Now, the charismatic host, Monty Hall, who knows what is behind every single door, walks over to the remaining doors and opens Door Number Three, revealing a bleating goat.",
  },
  {
    id: 6,
    duration: 9.46,
    caption: "DO YOU SWITCH?",
    narration:
      "Two closed doors remain on stage: your original Door Number One, and Door Number Two. Monty looks at you with a sly smile and asks the million-dollar question: Do you want to switch to Door Number Two?",
  },
  {
    id: 7,
    duration: 9.05,
    caption: "THE 50/50 TRAP",
    narration:
      "What does your gut tell you? Nearly every human being on the planet says the exact same thing: it doesn't matter. There are two closed doors left, one car and one goat, so the odds must be fifty-fifty.",
  },
  {
    id: 8,
    duration: 9.84,
    caption: "STAY: 33% // SWITCH: 67%",
    narration:
      "But that intuition is completely, spectacularly false. If you switch to Door Number Two, your probability of winning jumps from thirty-three percent to sixty-six percent. Switching doubles your odds.",
  },
  {
    id: 9,
    duration: 12.67,
    caption: "'YOU BLEW IT!'",
    narration:
      "When Marilyn vos Savant published this solution in Parade magazine, she was ridiculed by university professors. One mathematician from George Mason University wrote: You blew it, and you blew it big! There is enough mathematical illiteracy without the world's highest IQ helping.",
  },
  {
    id: 10,
    duration: 11.98,
    caption: "NOT A RANDOM ACTION",
    narration:
      "Another professor wrote: May I suggest that after the disastrous error you made, you seek professional counseling. Yet when computers ran Monte Carlo simulations of one million games, switching won precisely sixty-six point six percent of the time.",
  },
  {
    id: 11,
    duration: 12.34,
    caption: "1,000 DOORS",
    narration:
      "So why is switching so overwhelmingly favorable? The secret lies in a concept that human brains are terrible at processing: conditional probability and the conservation of information.",
  },
  {
    id: 12,
    duration: 11.18,
    caption: "998 GOATS REVEALED",
    narration:
      "When you picked Door Number One, you isolated thirty-three percent of the probability into your choice. That means the other two doors together held sixty-six percent of the probability.",
  },
  {
    id: 13,
    duration: 12.17,
    caption: "PROBABILITY FUNNEL: 99.9%",
    narration:
      "To see this clearly, imagine a game with one thousand doors instead of three. You pick Door Number One. Your odds of picking the car on the first try are one in a thousand.",
  },
  {
    id: 14,
    duration: 13.1,
    caption: "EQUIPARTITION FALLACY",
    narration:
      "Now Monty walks across the stage and opens nine hundred and ninety-eight other doors, revealing nine hundred and ninety-eight goats, leaving only your Door Number One and Door Number Seven Hundred and Seventy-Seven.",
  },
  {
    id: 15,
    duration: 10.51,
    caption: "LOSS AVERSION BIAS",
    narration:
      "Do you switch? Suddenly, your intuition screams: YES! Because you know Monty had to deliberately avoid the car across all those doors. All that probability was concentrated into Door Seven Hundred and Seventy-Seven.",
  },
  {
    id: 16,
    duration: 10.61,
    caption: "THE BLIND HOST TWIST",
    narration:
      "The three-door game is mathematically identical. Monty is not opening a door at random. His choice is constrained by knowledge, and that knowledge funnels the entire sixty-six percent probability directly onto the unpicked door.",
  },
  {
    id: 17,
    duration: 10.03,
    caption: "INFORMATION IS REALITY",
    narration:
      "Cognitive scientists call the mistake we make the false symmetry trap. The human brain sees two physical objects and lazily assumes equal probabilities, blinding itself to the asymmetric history of how we got there.",
  },
  {
    id: 18,
    duration: 10.68,
    caption: "ALWAYS SWITCH",
    narration:
      "Our brains did not evolve to calculate Bayesian probability; they evolved to spot predators in the grass. Intuition tells us the world is fifty-fifty. But the math knows the world remembers where the goats are hiding.",
  },
];

export const PARADOX_VOX_DURATION_FRAMES = BEATS.reduce(
  (acc, b) => acc + Math.round(b.duration * 30),
  0
);

export const ParadoxVoxExplainer: React.FC = () => {
  return (
    <div style={{ position: "relative", width: 1920, height: 1080 }}>
      {/* Background Music ducked underneath voiceover */}
      <Audio
        src={staticFile("vox_explainer/paradox_audio/music.mp3")}
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
              <ParadoxBeatScene
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

const ParadoxBeatScene: React.FC<{
  beat: (typeof BEATS)[0];
  durationFrames: number;
}> = ({ beat, durationFrames }) => {
  const frame = useCurrentFrame();

  const scale = interpolate(frame, [0, durationFrames], [1.0, 1.04], {
    extrapolateRight: "clamp",
  });

  return (
    <VoxPaperFrame accentColor="#F3B659" theme="paradox">
      <Audio
        src={staticFile(
          `vox_explainer/paradox_audio/vo/beat_${String(beat.id).padStart(
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
        <ParadoxVisualIllustration beatId={beat.id} />
      </div>

      {beat.caption && (
        <VoxStatCallout
          text={beat.caption}
          accentColor="#F3B659"
          theme="paradox"
        />
      )}

      <VoxSubtitleBurner
        narration={beat.narration}
        durationFrames={durationFrames}
        accentColor="#F3B659"
      />
    </VoxPaperFrame>
  );
};

const ParadoxVisualIllustration: React.FC<{ beatId: number }> = ({
  beatId,
}) => {
  const frame = useCurrentFrame();

  switch (beatId) {
    case 3: // Three doors on stage
    case 6: // Door 1 vs Door 2
    case 7: // 50/50 intuition
    case 8: // Switching doubles odds
      return (
        <VoxStickerCutout width={980} height={520} tiltDeg={-0.5}>
          <svg viewBox="0 0 980 520" width="100%" height="100%">
            <rect width="980" height="520" fill="#11141B" />
            {/* Door 1 */}
            <rect
              x="120"
              y="110"
              width="200"
              height="330"
              rx="8"
              fill="#1F2633"
              stroke="#F3B659"
              strokeWidth="4"
            />
            <circle cx="290" cy="275" r="10" fill="#F3B659" />
            <text
              x="220"
              y="220"
              fill="#FFFFFF"
              fontFamily="sans-serif"
              fontSize="44"
              fontWeight="900"
              textAnchor="middle"
            >
              1
            </text>
            <text
              x="220"
              y="390"
              fill="#F3B659"
              fontFamily="monospace"
              fontSize="20"
              fontWeight="bold"
              textAnchor="middle"
            >
              33.3%
            </text>

            {/* Door 2 */}
            <rect
              x="390"
              y="110"
              width="200"
              height="330"
              rx="8"
              fill="#261E14"
              stroke="#F3B659"
              strokeWidth="5"
              filter="drop-shadow(0 0 16px rgba(243,182,89,0.35))"
            />
            <circle cx="560" cy="275" r="10" fill="#F3B659" />
            <text
              x="490"
              y="220"
              fill="#FFFFFF"
              fontFamily="sans-serif"
              fontSize="44"
              fontWeight="900"
              textAnchor="middle"
            >
              2
            </text>
            <text
              x="490"
              y="390"
              fill="#F3B659"
              fontFamily="monospace"
              fontSize="24"
              fontWeight="900"
              textAnchor="middle"
            >
              66.7%
            </text>

            {/* Door 3 (Opened revealing Goat) */}
            <rect
              x="660"
              y="110"
              width="200"
              height="330"
              rx="8"
              fill="#181C24"
              stroke="#64748B"
              strokeWidth="3"
            />
            <line
              x1="660"
              y1="110"
              x2="860"
              y2="440"
              stroke="#EF4444"
              strokeWidth="3"
              strokeDasharray="8 6"
            />
            <text
              x="760"
              y="220"
              fill="#94A3B8"
              fontFamily="sans-serif"
              fontSize="44"
              fontWeight="900"
              textAnchor="middle"
            >
              3
            </text>
            <text
              x="760"
              y="390"
              fill="#EF4444"
              fontFamily="monospace"
              fontSize="20"
              fontWeight="bold"
              textAnchor="middle"
            >
              GOAT [0%]
            </text>
          </svg>
        </VoxStickerCutout>
      );

    case 10: // 1,000,000 Monte Carlo Simulation Graph
      return (
        <VoxStickerCutout width={920} height={500} tiltDeg={1}>
          <svg viewBox="0 0 920 500" width="100%" height="100%">
            <rect width="920" height="500" fill="#0C1017" />
            {/* Terminal Graph Axes */}
            <line
              x1="120"
              y1="400"
              x2="820"
              y2="400"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="2"
            />
            <line
              x1="120"
              y1="100"
              x2="120"
              y2="400"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="2"
            />
            {/* Bar: Stay (33.3%) */}
            <rect
              x="240"
              y="240"
              width="160"
              height="160"
              fill="#475569"
              rx="6"
            />
            <text
              x="320"
              y="220"
              fill="#FFFFFF"
              fontFamily="monospace"
              fontSize="22"
              fontWeight="bold"
              textAnchor="middle"
            >
              STAY: 33.3%
            </text>
            {/* Bar: Switch (66.7%) */}
            <rect
              x="520"
              y="120"
              width="160"
              height="280"
              fill="#F3B659"
              rx="6"
              filter="drop-shadow(0 0 16px rgba(243,182,89,0.4))"
            />
            <text
              x="600"
              y="100"
              fill="#F3B659"
              fontFamily="monospace"
              fontSize="24"
              fontWeight="900"
              textAnchor="middle"
            >
              SWITCH: 66.7%
            </text>
            <text
              x="120"
              y="450"
              fill="rgba(255,255,255,0.5)"
              fontFamily="monospace"
              fontSize="16"
            >
              N = 1,000,000 ITERATIONS // CONVERGENCE AT 2/3
            </text>
          </svg>
        </VoxStickerCutout>
      );

    default: // Bayesian Information Flow Diagram
      return (
        <VoxStickerCutout width={900} height={500} tiltDeg={-0.5}>
          <svg viewBox="0 0 900 500" width="100%" height="100%">
            <rect width="900" height="500" fill="#121620" />
            <circle
              cx="450"
              cy="250"
              r="170"
              fill="none"
              stroke="#F3B659"
              strokeWidth="3"
              strokeDasharray="10 6"
            />
            <circle cx="340" cy="250" r="80" fill="#1C2433" />
            <circle cx="560" cy="250" r="80" fill="#2E2316" />
            <text
              x="450"
              y="255"
              fill="#F3B659"
              fontFamily="serif"
              fontStyle="italic"
              fontSize="34"
              fontWeight="bold"
              textAnchor="middle"
            >
              P(A | B)
            </text>
            <text
              x="50"
              y="450"
              fill="#F3B659"
              fontFamily="monospace"
              fontSize="18"
              fontWeight="bold"
            >
              BAYESIAN PROBABILITY ENIGMA // BEAT {beatId < 10 ? `0${beatId}` : beatId}
            </text>
          </svg>
        </VoxStickerCutout>
      );
  }
};
