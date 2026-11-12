#!/usr/bin/env python3
"""
Builds the complete clean markdown encyclopedia from content/index-opensource/en.json
and syncs to AppFlowy.
"""

import json
import os
import sys

sys.path.append('/home/revenant/.gemini/antigravity/scratch/instagram-reel-knowledge-engine')
import appflowy_mcp_full as af

EN_PATH = os.path.join(os.path.dirname(__file__), '..', 'content', 'index-opensource', 'en.json')
OUT_MD = os.path.join(os.path.dirname(__file__), '..', 'content', 'index-opensource', 'INDEX_OPENSOURCE_ENCYCLOPEDIA.md')

with open(EN_PATH, 'r', encoding='utf-8') as f:
    data = json.load(f)

projects = data['projects']

# Group projects by principle
grouped = {}
for code, p in projects.items():
    vals = p.get('values', [])
    principle = vals[2] if len(vals) > 2 else 'Other'
    grouped.setdefault(principle, []).append((code, p))

md_lines = [
    '# index.opensource — 412 Creative Code & Procedural Engines Encyclopedia',
    '',
    '> **Archived from**: [indexopensource.com](https://indexopensource.com/) by Hyun (@hyun2xyz).',
    '> **Integrated into**: ORBIT Broadcast Network & Channel CTO Database.',
    '',
    '## Executive Overview',
    '',
    f'This archive contains **{len(projects)} open-source creative technology repositories** categorized by fundamental principles of computation, mathematics, physics, and generative art.',
    'It serves as the permanent technical library for ORBIT Broadcast Network to engineer 100% code-driven cinematic visuals.',
    '',
    '## The 8 Operating Principles',
    ''
]

for principle, plist in grouped.items():
    md_lines.append(f'### {principle} ({len(plist)} Projects)')
    md_lines.append('')
    for code, p in plist[:10]:
        vals = p.get('values', [])
        name = vals[1] if len(vals) > 1 else 'Unnamed'
        concept = vals[4] if len(vals) > 4 else ''
        repo = vals[8] if len(vals) > 8 else ''
        license = vals[9] if len(vals) > 9 else ''
        desc = p.get('description', '')
        repo_link = f'https://github.com/{repo}' if repo else 'N/A'
        md_lines.append(f'- **{name}** (`{code}`) — [{repo}]({repo_link})')
        md_lines.append(f'  - *Concept*: {concept} | *License*: {license}')
        md_lines.append(f'  - *Summary*: {desc}')
    if len(plist) > 10:
        md_lines.append(f'  - *...and {len(plist) - 10} more projects in local CTO database (`.agents/skills/channel-cto/data/index_opensource.db`)*')
    md_lines.append('')

md_lines.extend([
    '---',
    '',
    '## Channel CTO Query Instructions',
    '',
    'All 412 projects are indexed in SQLite with full-text search (FTS5).',
    'To query the database for any episode or visual engine:',
    '',
    '```bash',
    '# Query by episode concept:',
    'python3 .agents/skills/channel-cto/scripts/query_tech.py --recommend "black hole accretion disk raymarching"',
    '',
    '# Filter by show or principle:',
    'python3 .agents/skills/channel-cto/scripts/query_tech.py --show simulation --query "fluid"',
    '```',
    ''
])

clean_md = '\n'.join(md_lines)

with open(OUT_MD, 'w', encoding='utf-8') as f:
    f.write(clean_md)

print(f"Generated clean encyclopedia at {OUT_MD}")

# Update AppFlowy page
workspace_id = 'e5b9af85-dbce-47e7-aeb3-e81a6a6da898'
parent_view_id = '35e6ab10-fea1-42ba-bd97-adf9a1cc9db3'

# Create or update page in AppFlowy
page_id = af.create_page(
    workspace_id=workspace_id,
    parent_view_id=parent_view_id,
    name='index.opensource — 412 Creative Code & Procedural Engines',
    markdown=clean_md
)
print(f"Uploaded clean encyclopedia to AppFlowy. Page ID: {page_id}")
