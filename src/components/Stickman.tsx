import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export type StickmanPose =
  | 'slouched'
  | 'slide_in'
  | 'hero_landing'
  | 'pulling_rope'
  | 'dj_sound'
  | 'drawing_stylus'
  | 'color_roller'
  | 'leaping'
  | 'confident_point';

interface StickmanProps {
  pose: StickmanPose;
  color?: string;
  beanieColor?: string;
  shirtColor?: string;
  scale?: number;
  flipX?: boolean;
  hasHeadphones?: boolean;
}

export const Stickman: React.FC<StickmanProps> = ({
  pose,
  color = '#0A0A0C',
  beanieColor = '#FF3333',
  shirtColor = '#FFCC00',
  scale = 1,
  flipX = false,
  hasHeadphones = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Subtle breathing / idle motion
  const bobbing = Math.sin((frame / fps) * 8) * 4;
  const kickBob = Math.sin((frame / fps) * 16) * 6;

  return (
    <div
      style={{
        transform: `scale(${scale}) ${flipX ? 'scaleX(-1)' : ''}`,
        transformOrigin: 'center bottom',
        display: 'inline-block',
      }}
    >
      <svg
        width="300"
        height="400"
        viewBox="0 0 300 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: 'visible' }}
      >
        <defs>
          <filter id="glow-stylus" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* ================= POSE 1: SLOUCHED (Tired Commodity Editor) ================= */}
        {pose === 'slouched' && (
          <g transform={`translate(0, ${bobbing * 0.5})`}>
            {/* Slouched Torso */}
            <path
              d="M 120 180 Q 150 220 130 280"
              stroke={color}
              strokeWidth="10"
              strokeLinecap="round"
            />
            {/* Limp Arms on Keyboard */}
            <path
              d="M 130 200 Q 170 230 190 270"
              stroke={color}
              strokeWidth="9"
              strokeLinecap="round"
            />
            {/* Legs on Chair */}
            <path
              d="M 130 280 L 110 370 L 80 370"
              stroke={color}
              strokeWidth="10"
              strokeLinecap="round"
            />
            <path
              d="M 130 280 L 140 370 L 170 370"
              stroke={color}
              strokeWidth="10"
              strokeLinecap="round"
            />
            {/* Slumped Head (no beanie, messy) */}
            <circle cx="105" cy="140" r="30" stroke={color} strokeWidth="9" fill="#FFF" />
            {/* Sleepy / Overwhelmed eyes */}
            <path d="M 95 135 L 115 135" stroke={color} strokeWidth="5" strokeLinecap="round" />
            <path d="M 100 152 Q 108 145 116 152" stroke={color} strokeWidth="4" strokeLinecap="round" />
            {/* Sweat drop */}
            <path
              d="M 140 120 Q 150 125 145 135 Q 140 140 135 135 Q 130 125 140 120 Z"
              fill="#00BFFF"
            />
          </g>
        )}

        {/* ================= POSE 2: SLIDE IN / SPRINTING ================= */}
        {pose === 'slide_in' && (
          <g transform={`translate(0, ${kickBob})`}>
            {/* Leaning Torso with Yellow T-Shirt */}
            <path
              d="M 180 160 L 130 250"
              stroke={color}
              strokeWidth="12"
              strokeLinecap="round"
            />
            {/* Stylized T-Shirt Fill */}
            <polygon points="160,165 195,160 145,245 125,245" fill={shirtColor} stroke={color} strokeWidth="6" />

            {/* Back Leg */}
            <path
              d="M 130 250 L 80 290 L 50 340"
              stroke={color}
              strokeWidth="11"
              strokeLinecap="round"
            />
            {/* Front Leg sliding */}
            <path
              d="M 130 250 L 190 285 L 240 340 L 260 345"
              stroke={color}
              strokeWidth="11"
              strokeLinecap="round"
            />

            {/* Trailing Arm */}
            <path
              d="M 170 175 L 110 200 L 70 180"
              stroke={color}
              strokeWidth="9"
              strokeLinecap="round"
            />
            {/* Forward Arm with Glowing Laser Stylus */}
            <path
              d="M 170 175 L 220 200 L 265 170"
              stroke={color}
              strokeWidth="10"
              strokeLinecap="round"
            />
            {/* Laser Stylus */}
            <line
              x1="260"
              y1="175"
              x2="295"
              y2="150"
              stroke="#00FF66"
              strokeWidth="8"
              strokeLinecap="round"
              filter="url(#glow-stylus)"
            />

            {/* Head & Signature Red Beanie */}
            <circle cx="195" cy="115" r="30" stroke={color} strokeWidth="9" fill="#FFF" />
            <path
              d="M 170 115 C 170 85, 225 85, 225 115 Z"
              fill={beanieColor}
              stroke={color}
              strokeWidth="7"
            />
            <rect x="168" y="112" width="58" height="10" rx="4" fill={beanieColor} stroke={color} strokeWidth="4" />
          </g>
        )}

        {/* ================= POSE 3: HERO LANDING (Epic Outro) ================= */}
        {pose === 'hero_landing' && (
          <g>
            {/* Torso hunkered down */}
            <path
              d="M 150 200 L 150 270"
              stroke={color}
              strokeWidth="12"
              strokeLinecap="round"
            />
            {/* T-Shirt */}
            <rect x="135" y="200" width="30" height="60" rx="6" fill={shirtColor} stroke={color} strokeWidth="6" />

            {/* Left Hand planted on ground */}
            <path
              d="M 145 210 L 95 240 L 95 350 L 80 350"
              stroke={color}
              strokeWidth="11"
              strokeLinecap="round"
            />
            {/* Right Arm cocked back */}
            <path
              d="M 155 210 L 210 230 L 230 190"
              stroke={color}
              strokeWidth="10"
              strokeLinecap="round"
            />

            {/* Left Leg bent deep */}
            <path
              d="M 150 270 L 105 300 L 105 350 L 90 350"
              stroke={color}
              strokeWidth="11"
              strokeLinecap="round"
            />
            {/* Right Leg stretched outward */}
            <path
              d="M 150 270 L 200 300 L 250 350 L 270 350"
              stroke={color}
              strokeWidth="11"
              strokeLinecap="round"
            />

            {/* Head Looking Up at Viewer */}
            <circle cx="150" cy="140" r="32" stroke={color} strokeWidth="9" fill="#FFF" />
            {/* Red Beanie */}
            <path
              d="M 122 135 C 122 95, 178 95, 178 135 Z"
              fill={beanieColor}
              stroke={color}
              strokeWidth="7"
            />
            <rect x="120" y="132" width="60" height="12" rx="5" fill={beanieColor} stroke={color} strokeWidth="5" />

            {/* Confident Dot Eyes */}
            <circle cx="140" cy="145" r="4" fill={color} />
            <circle cx="160" cy="145" r="4" fill={color} />
          </g>
        )}

        {/* ================= POSE 4: PULLING ROPE (Retention Curve) ================= */}
        {pose === 'pulling_rope' && (
          <g transform={`translate(0, ${bobbing})`}>
            {/* Torso leaning back hard */}
            <path
              d="M 120 190 L 165 270"
              stroke={color}
              strokeWidth="12"
              strokeLinecap="round"
            />
            <polygon points="105,190 135,185 180,265 155,270" fill={shirtColor} stroke={color} strokeWidth="6" />

            {/* Front Leg braced forward */}
            <path
              d="M 165 270 L 205 310 L 225 365 L 245 365"
              stroke={color}
              strokeWidth="11"
              strokeLinecap="round"
            />
            {/* Back Leg planted backward */}
            <path
              d="M 165 270 L 130 315 L 110 365 L 90 365"
              stroke={color}
              strokeWidth="11"
              strokeLinecap="round"
            />

            {/* Stretched Arms holding rope */}
            <path
              d="M 115 200 L 80 215 L 45 220"
              stroke={color}
              strokeWidth="10"
              strokeLinecap="round"
            />
            <path
              d="M 125 210 L 95 225 L 60 230"
              stroke={color}
              strokeWidth="10"
              strokeLinecap="round"
            />

            {/* The Rope */}
            <path
              d="M 0 215 L 150 235 L 290 270"
              stroke="#00FF66"
              strokeWidth="6"
              strokeDasharray="8 6"
              filter="url(#glow-stylus)"
            />

            {/* Head in Effort */}
            <circle cx="95" cy="145" r="30" stroke={color} strokeWidth="9" fill="#FFF" />
            <path
              d="M 70 140 C 70 105, 122 105, 122 140 Z"
              fill={beanieColor}
              stroke={color}
              strokeWidth="7"
            />
            <rect x="68" y="137" width="56" height="11" rx="4" fill={beanieColor} stroke={color} strokeWidth="5" />
          </g>
        )}

        {/* ================= POSE 5: DJ SOUND / HEADPHONES ================= */}
        {pose === 'dj_sound' && (
          <g transform={`translate(0, ${kickBob})`}>
            {/* Bouncing Torso */}
            <path
              d="M 150 170 L 150 260"
              stroke={color}
              strokeWidth="12"
              strokeLinecap="round"
            />
            <rect x="135" y="170" width="30" height="85" rx="6" fill={shirtColor} stroke={color} strokeWidth="6" />

            {/* Left Arm holding headphone ear cup */}
            <path
              d="M 145 180 L 105 170 L 120 120"
              stroke={color}
              strokeWidth="9"
              strokeLinecap="round"
            />
            {/* Right Arm pumping mixer fader */}
            <path
              d="M 155 185 L 195 210 L 220 280"
              stroke={color}
              strokeWidth="10"
              strokeLinecap="round"
            />

            {/* Rhythmic Legs */}
            <path
              d="M 150 260 L 125 310 L 125 365"
              stroke={color}
              strokeWidth="11"
              strokeLinecap="round"
            />
            <path
              d="M 150 260 L 175 305 L 190 365"
              stroke={color}
              strokeWidth="11"
              strokeLinecap="round"
            />

            {/* Head with Red Beanie */}
            <circle cx="150" cy="115" r="30" stroke={color} strokeWidth="9" fill="#FFF" />
            <path
              d="M 125 110 C 125 75, 175 75, 175 110 Z"
              fill={beanieColor}
              stroke={color}
              strokeWidth="7"
            />
            <rect x="123" y="108" width="54" height="10" rx="4" fill={beanieColor} stroke={color} strokeWidth="5" />

            {/* Giant Studio DJ Headphones */}
            <path
              d="M 115 120 C 115 70, 185 70, 185 120"
              stroke="#0A0A0C"
              strokeWidth="12"
              strokeLinecap="round"
            />
            {/* Headphone ear pads */}
            <rect x="110" y="105" width="16" height="30" rx="8" fill="#FF5500" stroke="#0A0A0C" strokeWidth="4" />
            <rect x="174" y="105" width="16" height="30" rx="8" fill="#FF5500" stroke="#0A0A0C" strokeWidth="4" />
          </g>
        )}

        {/* ================= POSE 6: DRAWING STYLUS (Motion Graphics) ================= */}
        {pose === 'drawing_stylus' && (
          <g transform={`translate(0, ${bobbing})`}>
            {/* Confident dynamic stance */}
            <path d="M 140 170 L 155 260" stroke={color} strokeWidth="12" strokeLinecap="round" />
            <rect x="128" y="170" width="30" height="85" rx="6" fill={shirtColor} stroke={color} strokeWidth="6" />

            {/* Left hand on hip */}
            <path d="M 135 185 L 105 210 L 130 235" stroke={color} strokeWidth="9" strokeLinecap="round" />
            {/* Right hand pointing glowing stylus upward */}
            <path d="M 145 180 L 195 150 L 230 110" stroke={color} strokeWidth="10" strokeLinecap="round" />
            {/* Glowing stylus tip */}
            <line x1="225" y1="115" x2="250" y2="85" stroke="#FFCC00" strokeWidth="8" strokeLinecap="round" filter="url(#glow-stylus)" />

            {/* Legs */}
            <path d="M 155 260 L 125 315 L 115 365" stroke={color} strokeWidth="11" strokeLinecap="round" />
            <path d="M 155 260 L 185 310 L 205 365" stroke={color} strokeWidth="11" strokeLinecap="round" />

            {/* Head & Beanie */}
            <circle cx="135" cy="115" r="30" stroke={color} strokeWidth="9" fill="#FFF" />
            <path d="M 110 110 C 110 75, 160 75, 160 110 Z" fill={beanieColor} stroke={color} strokeWidth="7" />
            <rect x="108" y="107" width="54" height="10" rx="4" fill={beanieColor} stroke={color} strokeWidth="5" />
          </g>
        )}

        {/* ================= POSE 7: CONFIDENT POINT (Outro Call to Action) ================= */}
        {pose === 'confident_point' && (
          <g transform={`translate(0, ${bobbing})`}>
            {/* Upright authoritative posture */}
            <path d="M 150 160 L 150 250" stroke={color} strokeWidth="12" strokeLinecap="round" />
            <rect x="135" y="160" width="30" height="85" rx="6" fill={shirtColor} stroke={color} strokeWidth="6" />

            {/* Left Arm folded */}
            <path d="M 145 180 L 110 205 L 145 220" stroke={color} strokeWidth="9" strokeLinecap="round" />
            {/* Right Arm pointing directly at camera */}
            <path d="M 155 180 L 210 175 L 245 175" stroke={color} strokeWidth="11" strokeLinecap="round" />
            {/* Pointing finger / thumb */}
            <circle cx="250" cy="175" r="10" fill={color} />
            <line x1="250" y1="175" x2="275" y2="175" stroke={color} strokeWidth="8" strokeLinecap="round" />

            {/* Sturdy legs */}
            <path d="M 150 250 L 120 305 L 115 365 L 95 365" stroke={color} strokeWidth="11" strokeLinecap="round" />
            <path d="M 150 250 L 180 305 L 185 365 L 205 365" stroke={color} strokeWidth="11" strokeLinecap="round" />

            {/* Head & Beanie */}
            <circle cx="150" cy="105" r="30" stroke={color} strokeWidth="9" fill="#FFF" />
            <path d="M 125 100 C 125 65, 175 65, 175 100 Z" fill={beanieColor} stroke={color} strokeWidth="7" />
            <rect x="123" y="98" width="54" height="10" rx="4" fill={beanieColor} stroke={color} strokeWidth="5" />
            {/* Confident eyes */}
            <circle cx="143" cy="110" r="4" fill={color} />
            <circle cx="157" cy="110" r="4" fill={color} />
            <path d="M 144 122 Q 150 128 156 122" stroke={color} strokeWidth="4" strokeLinecap="round" />
          </g>
        )}

        {/* Fallback for other poses */}
        {(pose === 'color_roller' || pose === 'leaping') && (
          <g transform={`translate(0, ${kickBob})`}>
            <path d="M 150 170 L 150 260" stroke={color} strokeWidth="12" strokeLinecap="round" />
            <rect x="135" y="170" width="30" height="85" rx="6" fill={shirtColor} stroke={color} strokeWidth="6" />
            <path d="M 145 180 L 100 190 L 80 150" stroke={color} strokeWidth="10" strokeLinecap="round" />
            <path d="M 155 180 L 200 170 L 230 140" stroke={color} strokeWidth="10" strokeLinecap="round" />
            <path d="M 150 260 L 115 300 L 95 345" stroke={color} strokeWidth="11" strokeLinecap="round" />
            <path d="M 150 260 L 185 300 L 215 345" stroke={color} strokeWidth="11" strokeLinecap="round" />
            <circle cx="150" cy="115" r="30" stroke={color} strokeWidth="9" fill="#FFF" />
            <path d="M 125 110 C 125 75, 175 75, 175 110 Z" fill={beanieColor} stroke={color} strokeWidth="7" />
            <rect x="123" y="108" width="54" height="10" rx="4" fill={beanieColor} stroke={color} strokeWidth="5" />
          </g>
        )}
      </svg>
    </div>
  );
};
