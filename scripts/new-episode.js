#!/usr/bin/env node

/**
 * Episode Scaffolder for ORBIT Broadcast Network
 * Usage: node scripts/new-episode.js --show=blueprint --id=BP-002 --title="The Global GPS Lattice"
 */

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2).reduce((acc, arg) => {
  const [key, val] = arg.replace(/^--/, '').split('=');
  acc[key] = val || true;
  return acc;
}, {});

const validShows = ['blueprint', 'simulation', 'paradox', 'network-reel'];
const show = (args.show || 'blueprint').toLowerCase();
const episodeId = args.id || 'EP-001';
const title = args.title || 'Untitled Episode';

if (!validShows.includes(show)) {
  console.error(`Invalid show. Must be one of: ${validShows.join(', ')}`);
  process.exit(1);
}

const showDir = path.join(__dirname, '..', 'src', 'shows', show, 'episodes', episodeId);
const contentDir = path.join(__dirname, '..', 'content', show, episodeId);

fs.mkdirSync(showDir, { recursive: true });
fs.mkdirSync(contentDir, { recursive: true });

// 1. Content Script Template
const scriptContent = `# ${episodeId}: ${title}
Show: ${show}
Status: In Scripting

## High-CTR Hook (0:00 - 0:30)
[Arresting narrative paradox or systemic disruption]

## Act 1: The Hidden Machinery (0:30 - 2:00)
[Deconstruct the baseline system]

## Act 2: The Escalation / Failure Point (2:00 - 5:00)
[What breaks or defies intuition]

## Act 3: The Epiphany (5:00 - End)
[Philosophical conclusion + station handoff]
`;

fs.writeFileSync(path.join(contentDir, 'script.md'), scriptContent);

// 2. Episode Code Template
const episodeContent = `import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { NetworkWatermark } from '../../../../network/NetworkWatermark';
import { SHOW_PALETTES } from '../../../../engines/colors';

export interface EpisodeProps {
  aspectRatio?: '16:9' | '9:16';
}

export const ${episodeId.replace(/[^a-zA-Z0-9]/g, '')}: React.FC<EpisodeProps> = ({
  aspectRatio = '16:9',
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const palette = SHOW_PALETTES.${show.replace(/-([a-z])/g, (_, c) => c.toUpperCase())} || SHOW_PALETTES.blueprint;

  return (
    <AbsoluteFill style={{ backgroundColor: palette.background }}>
      <NetworkWatermark showTitle="${show}" episodeCode="${episodeId}" />
      
      {/* Episode Content Rendered in Code */}
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        <h1 style={{ color: palette.primary, fontSize: '64px', letterSpacing: '0.1em' }}>
          ${title.toUpperCase()}
        </h1>
        <p style={{ color: palette.accent, fontSize: '24px', letterSpacing: '0.2em' }}>
          ${episodeId} // 100% CODE-RENDERED
        </p>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
`;

fs.writeFileSync(path.join(showDir, 'Episode.tsx'), episodeContent);

console.log(`\nSuccessfully scaffolded ${episodeId}: "${title}"!`);
console.log(`Content Brief : ${path.relative(process.cwd(), path.join(contentDir, 'script.md'))}`);
console.log(`Remotion Scene: ${path.relative(process.cwd(), path.join(showDir, 'Episode.tsx'))}`);
console.log(`\nPreview in Remotion: npm run dev\n`);
