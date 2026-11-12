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

// 18 Beats Data & Durations from vo_durations.json
const BEATS = [
  {
    id: 1,
    duration: 17.42,
    caption: "99% UNDERWATER",
    narration:
      "Right now, as you watch this video, your internet connection is not traveling through satellites, orbiting space stations, or an ethereal cloud. Ninety-nine percent of all intercontinental data travels through fragile glass threads lying on the dark floor of the ocean.",
  },
  {
    id: 2,
    duration: 10.15,
    caption: "EST. 1858",
    narration:
      "To understand how our digital civilization survives under thousands of meters of crushing saltwater, you have to go back to the summer of 1858.",
  },
  {
    id: 3,
    duration: 12.43,
    caption: "4,000 KM COPPER",
    narration:
      "An American financier named Cyrus Field attempted the impossible: spooling four thousand kilometers of gutta-percha insulated copper wire across the Atlantic between Ireland and Newfoundland.",
  },
  {
    id: 4,
    duration: 12.77,
    caption: "16 HOURS / 98 WORDS",
    narration:
      "Queen Victoria sent the very first transatlantic telegraph message to President James Buchanan. It took sixteen agonizing hours to transmit just ninety-eight words. Then, three weeks later, the cable burned out and died.",
  },
  {
    id: 5,
    duration: 13.22,
    caption: "ULTRA-PURE SILICA",
    narration:
      "Today, a modern subsea cable doesn't rely on copper wire and Morse code. It uses optical fiber: hair-thin strands of ultra-pure silica glass that bounce laser beams thousands of kilometers using total internal reflection.",
  },
  {
    id: 6,
    duration: 12.7,
    caption: "20 TB/S PER FIBER",
    narration:
      "A single pair of modern fiber strands can carry over twenty terabits per second. That is enough bandwidth to stream three million high-definition movies simultaneously down a tube narrower than a human hair.",
  },
  {
    id: 7,
    duration: 12.14,
    caption: null,
    narration:
      "Yet as light travels through thousands of kilometers of ocean depths, physical reality intervenes. Photons scatter against impurities in the glass. Every seventy kilometers, the light grows faint and begins to die.",
  },
  {
    id: 8,
    duration: 12.7,
    caption: "OPTICAL REPEATERS",
    narration:
      "To keep the signal alive across planetary distances, engineers install optical amplifiers called repeaters: heavy beryllium copper torpedo cylinders spliced directly into the cable along the seabed.",
  },
  {
    id: 9,
    duration: 10.99,
    caption: "ERBIUM AMPLIFICATION",
    narration:
      "Inside each repeater, a coil of silica glass infused with the rare earth element erbium is struck by high-powered pump lasers, exciting the decaying photons and amplifying the light without ever converting it into electricity.",
  },
  {
    id: 10,
    duration: 13.51,
    caption: "10,000 VOLTS DC",
    narration:
      "To power these underwater repeaters across vast ocean basins, the cable carries up to ten thousand volts of direct current through a solid copper conductor sheath spanning trenches eight kilometers deep.",
  },
  {
    id: 11,
    duration: 11.76,
    caption: "CABLE SHIPS",
    narration:
      "How do you manufacture and lay a fragile glass wire across an abyss? Specialized cable ships spend weeks spooling thousands of metric tons of continuous cable into cavernous circular tanks inside their hulls.",
  },
  {
    id: 12,
    duration: 12.02,
    caption: "SEA PLOW BURIAL",
    narration:
      "Near shorelines, where commercial fishing trawlers and cargo ship anchors drag along the seabed, a three-ton submersible sea plow carves a trench two meters into the mud and buries the cable beneath the seabed.",
  },
  {
    id: 13,
    duration: 12.86,
    caption: "800 ATMOSPHERES",
    narration:
      "Out in the deep abyss, where water pressure reaches eight hundred atmospheres and temperatures hover near freezing, the cable simply rests directly on the ocean silt, unarmored, because down there, nothing moves.",
  },
  {
    id: 14,
    duration: 12.65,
    caption: "200 FAULTS / YEAR",
    narration:
      "But that peace is fragile. Around the globe, subsea cables suffer over two hundred severed cuts every single year.",
  },
  {
    id: 15,
    duration: 14.64,
    caption: "CABLE SEVERED",
    narration:
      "Underwater earthquakes, underwater mudslides, and errant dragging anchors can instantly sever multi-terabit arteries, cutting off entire island nations and plunging millions of people into complete offline isolation.",
  },
  {
    id: 16,
    duration: 13.1,
    caption: "DEEP SEA REPAIR",
    narration:
      "When a cable breaks three miles under the North Atlantic, repair ships must deploy robotic grapnels to hook the snapped ends in pitch-black icy waters, haul them to the surface, and splice glass fibers inside cleanrooms on rolling sea swells.",
  },
  {
    id: 17,
    duration: 11.38,
    caption: "1.4 MILLION KM",
    narration:
      "Today, over five hundred active subsea cables weave a 1.4-million-kilometer physical nervous system across our planet, silently routing trillions of dollars in financial transactions and billions of messages every second.",
  },
  {
    id: 18,
    duration: 13.06,
    caption: "THE GLASS BACKBONE",
    narration:
      "We imagine the modern world as an invisible cloud floating weightlessly in the sky. But the internet is not in the sky. The internet is a physical wire resting in the mud, whispered through by light, beneath the weight of an ocean.",
  },
];

// Total frames across all 18 beats
export const BLUEPRINT_VOX_DURATION_FRAMES = BEATS.reduce(
  (acc, b) => acc + Math.round(b.duration * 30),
  0
);

export const BlueprintVoxExplainer: React.FC = () => {
  return (
    <div style={{ position: "relative", width: 1920, height: 1080 }}>
      {/* Background Music ducked underneath voiceover */}
      <Audio
        src={staticFile("vox_explainer/blueprint_audio/music.mp3")}
        volume={0.16}
      />

      {/* Sequential Series of All 18 Beats */}
      <Series>
        {BEATS.map((beat) => {
          const durationFrames = Math.round(beat.duration * 30);
          return (
            <Series.Sequence
              key={beat.id}
              durationInFrames={durationFrames}
            >
              <BlueprintBeatScene
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

// Scene for each individual beat
const BlueprintBeatScene: React.FC<{
  beat: (typeof BEATS)[0];
  durationFrames: number;
}> = ({ beat, durationFrames }) => {
  const frame = useCurrentFrame();

  // Subtle 2D push-in camera motion per beat
  const scale = interpolate(frame, [0, durationFrames], [1.0, 1.04], {
    extrapolateRight: "clamp",
  });

  const panX = interpolate(frame, [0, durationFrames], [0, -15], {
    extrapolateRight: "clamp",
  });

  return (
    <VoxPaperFrame accentColor="#00E5FF" theme="blueprint">
      {/* Voiceover Audio for this beat */}
      <Audio
        src={staticFile(
          `vox_explainer/blueprint_audio/vo/beat_${String(beat.id).padStart(
            2,
            "0"
          )}.mp3`
        )}
      />

      {/* Main Visual Centerpiece with Camera Motion */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          transform: `scale(${scale}) translate(${panX}px, 0px)`,
        }}
      >
        <BlueprintVisualIllustration beatId={beat.id} />
      </div>

      {/* Editorial Kinetic Stat Callout if present */}
      {beat.caption && (
        <VoxStatCallout
          text={beat.caption}
          accentColor="#00E5FF"
          theme="blueprint"
        />
      )}

      {/* Vox-Style Synchronized Burned Subtitles */}
      <VoxSubtitleBurner
        narration={beat.narration}
        durationFrames={durationFrames}
        accentColor="#00E5FF"
      />
    </VoxPaperFrame>
  );
};

// Dedicated SVG / Editorial Collage Illustrations for each beat
const BlueprintVisualIllustration: React.FC<{ beatId: number }> = ({
  beatId,
}) => {
  const frame = useCurrentFrame();

  switch (beatId) {
    case 1: // World map with ocean fiber cables
      return (
        <VoxStickerCutout width={1000} height={560} tiltDeg={-1}>
          <svg viewBox="0 0 1000 560" width="100%" height="100%">
            <rect width="1000" height="560" fill="#0D1E2D" />
            {/* World Continents simplified */}
            <path
              d="M 120 180 Q 220 120 320 200 T 260 400 T 150 350 Z"
              fill="#223C50"
            />
            <path
              d="M 520 140 Q 680 80 820 180 T 780 420 T 560 380 Z"
              fill="#223C50"
            />
            {/* Subsea fiber optic lines pulsing in Electric Cyan */}
            <path
              d="M 280 260 Q 420 310 560 220"
              stroke="#00E5FF"
              strokeWidth="5"
              fill="none"
              strokeDasharray="10 5"
            />
            <path
              d="M 270 340 Q 410 420 620 340"
              stroke="#00E5FF"
              strokeWidth="4"
              fill="none"
              strokeDasharray="8 6"
            />
            <path
              d="M 220 220 Q 50 280 860 260"
              stroke="#F3B659"
              strokeWidth="3"
              fill="none"
              strokeDasharray="12 4"
            />
            <circle cx="280" cy="260" r="8" fill="#00E5FF" />
            <circle cx="560" cy="220" r="8" fill="#00E5FF" />
            <circle cx="270" cy="340" r="8" fill="#00E5FF" />
            <circle cx="620" cy="340" r="8" fill="#00E5FF" />
          </svg>
        </VoxStickerCutout>
      );

    case 5: // Modern optical fiber laser internal reflection
      return (
        <VoxStickerCutout width={940} height={480} tiltDeg={1.5}>
          <svg viewBox="0 0 940 480" width="100%" height="100%">
            <rect width="940" height="480" fill="#131B24" />
            {/* Outer Cladding */}
            <rect
              x="80"
              y="120"
              width="780"
              height="240"
              rx="12"
              fill="#1F2F3E"
              stroke="#2E4A62"
              strokeWidth="3"
            />
            {/* Silica Core */}
            <rect
              x="80"
              y="180"
              width="780"
              height="120"
              fill="#0B2A3A"
              stroke="#00E5FF"
              strokeWidth="2"
            />
            {/* Bouncing laser beam with total internal reflection */}
            <path
              d="M 80 240 L 220 185 L 360 295 L 500 185 L 640 295 L 780 185 L 860 240"
              stroke="#00E5FF"
              strokeWidth="6"
              fill="none"
              filter="drop-shadow(0 0 12px #00E5FF)"
            />
            <circle
              cx={80 + ((frame * 12) % 780)}
              cy={240 + Math.sin(frame * 0.2) * 40}
              r="10"
              fill="#FFFFFF"
              filter="drop-shadow(0 0 16px #00E5FF)"
            />
          </svg>
        </VoxStickerCutout>
      );

    case 8: // Beryllium copper repeater cylinder
    case 10: // 10,000V DC cable cross-section
      return (
        <VoxStickerCutout width={880} height={520} tiltDeg={-1}>
          <svg viewBox="0 0 880 520" width="100%" height="100%">
            <rect width="880" height="520" fill="#0F1722" />
            {/* Concentric Cable Armor Layers */}
            <circle
              cx="440"
              cy="260"
              r="200"
              fill="#1C2836"
              stroke="#3B4F66"
              strokeWidth="4"
            />
            <circle
              cx="440"
              cy="260"
              r="170"
              fill="#253548"
              stroke="#D97706"
              strokeWidth="4"
            />
            <circle
              cx="440"
              cy="260"
              r="135"
              fill="#374151"
              stroke="#9CA3AF"
              strokeWidth="4"
            />
            <circle
              cx="440"
              cy="260"
              r="95"
              fill="#B45309"
              stroke="#F59E0B"
              strokeWidth="4"
            />
            <circle
              cx="440"
              cy="260"
              r="55"
              fill="#064E3B"
              stroke="#00E5FF"
              strokeWidth="4"
            />
            {/* Fiber Cores at center */}
            <circle cx="440" cy="260" r="16" fill="#00E5FF" />
            {/* Technical Callout Lines */}
            <line
              x1="440"
              y1="60"
              x2="680"
              y2="60"
              stroke="#00E5FF"
              strokeWidth="2"
            />
            <text
              x="690"
              y="66"
              fill="#00E5FF"
              fontFamily="monospace"
              fontSize="16"
              fontWeight="bold"
            >
              POLYETHYLENE JACKET
            </text>
            <line
              x1="440"
              y1="125"
              x2="680"
              y2="125"
              stroke="#F59E0B"
              strokeWidth="2"
            />
            <text
              x="690"
              y="131"
              fill="#F59E0B"
              fontFamily="monospace"
              fontSize="16"
              fontWeight="bold"
            >
              COPPER POWER SHEATH (10kV)
            </text>
          </svg>
        </VoxStickerCutout>
      );

    case 17: // 1.4 million km global web
    case 18:
      return (
        <VoxStickerCutout width={960} height={520} tiltDeg={0.5}>
          <svg viewBox="0 0 960 520" width="100%" height="100%">
            <rect width="960" height="520" fill="#0A1118" />
            <circle
              cx="480"
              cy="260"
              r="220"
              fill="#122332"
              stroke="#224058"
              strokeWidth="2"
            />
            {/* Lat/Long Rings */}
            <ellipse
              cx="480"
              cy="260"
              rx="220"
              ry="110"
              fill="none"
              stroke="#1C354A"
              strokeWidth="1.5"
            />
            <ellipse
              cx="480"
              cy="260"
              rx="220"
              ry="50"
              fill="none"
              stroke="#1C354A"
              strokeWidth="1.5"
            />
            <line
              x1="480"
              y1="40"
              x2="480"
              y2="480"
              stroke="#1C354A"
              strokeWidth="1.5"
            />
            {/* Dense glowing planetary web */}
            {Array.from({ length: 18 }).map((_, i) => {
              const a1 = (i * 20 * Math.PI) / 180;
              const a2 = ((i * 20 + 75) * Math.PI) / 180;
              const x1 = 480 + Math.cos(a1) * 210;
              const y1 = 260 + Math.sin(a1) * 105;
              const x2 = 480 + Math.cos(a2) * 210;
              const y2 = 260 + Math.sin(a2) * 105;
              return (
                <path
                  key={i}
                  d={`M ${x1} ${y1} Q 480 260 ${x2} ${y2}`}
                  stroke={i % 2 === 0 ? "#00E5FF" : "#F3B659"}
                  strokeWidth="2.5"
                  fill="none"
                  opacity={0.8}
                />
              );
            })}
          </svg>
        </VoxStickerCutout>
      );

    default: // Editorial diagram with telemetry grid
      return (
        <VoxStickerCutout width={900} height={500} tiltDeg={-0.5}>
          <svg viewBox="0 0 900 500" width="100%" height="100%">
            <rect width="900" height="500" fill="#111B24" />
            <circle
              cx="450"
              cy="250"
              r="160"
              fill="none"
              stroke="#00E5FF"
              strokeWidth="3"
              strokeDasharray="8 6"
            />
            <circle
              cx="450"
              cy="250"
              r="80"
              fill="#1E2F3D"
              stroke="#F3B659"
              strokeWidth="2"
            />
            <circle cx="450" cy="250" r="14" fill="#00E5FF" />
            {/* Telemetry crosshairs */}
            <line
              x1="220"
              y1="250"
              x2="680"
              y2="250"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="1"
            />
            <line
              x1="450"
              y1="60"
              x2="450"
              y2="440"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="1"
            />
            <text
              x="50"
              y="450"
              fill="#00E5FF"
              fontFamily="monospace"
              fontSize="18"
              fontWeight="bold"
            >
              TELEMETRY NODE // BEAT {beatId < 10 ? `0${beatId}` : beatId}
            </text>
          </svg>
        </VoxStickerCutout>
      );
  }
};
