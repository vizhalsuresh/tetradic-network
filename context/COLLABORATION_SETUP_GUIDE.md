# TETRADIC NETWORK — Multi-Showrunner Collaboration Architecture

> **Guide for Co-Showrunners**: How two creative producers work seamlessly together using Antigravity, Git, and the Cybernetic Studio Pantheon without conflicts.

---

## 1. Why Our Architecture Makes Collaboration Effortless

Unlike traditional AI setups that rely on ephemeral chat histories or proprietary cloud dashboards, **TETRADIC NETWORK is 100% file-backed**:

1. **Deterministic AI Alignment (`AGENTS.md`)**:
   - The moment your co-Showrunner opens this repository in Antigravity, their AI reads `AGENTS.md` on Turn 1.
   - It instantly adopts the exact same Pantheon (ORBIT, THOTH, CALLIOPE, ARGUS, ORPHEUS, HERMES), the 5-Point Quality Gate, the Law of 62, and studio aesthetic rules.
2. **Bundled Agent Skills (`.agents/skills/`)**:
   - All custom AI skills (`channel-cto`, `orbit-network`, `voice-director`, `music-director`, `script-architect`, `sunday-chronicler`) are committed in the repository. Your partner gets identical agent capabilities with zero manual configuration.
3. **Decoupled Show Folders**:
   - Each show lives in its own isolated directory structure:
     - `src/shows/blueprint/` & `content/blueprint/`
     - `src/shows/simulation/` & `content/simulation/`
     - `src/shows/paradox/` & `content/paradox/`
     - `src/shows/network-reel/` & `context/chronicles/`

---

## 2. The Two Best Working Methods

### Method 1: The "Show Domain Split" (Recommended / Zero Conflicts)
You and your co-Showrunner divide ownership of the broadcast containers:
- **Showrunner A**: Owns **The Blueprint** (Show 1) + **The Simulation** (Show 2).
- **Showrunner B**: Owns **The Paradox** (Show 3) + **The Network Reel** (Sunday Devlog / Behind the Code).

**Why this works best**:
- Because you are touching different folders (`src/shows/blueprint` vs `src/shows/paradox`), you can both push and pull to Git daily with **zero merge conflicts**.
- Each Showrunner acts as the Executive Producer for their shows, guiding their Antigravity agent in their own tone.

---

### Method 2: The "Weekly Sprint & Sunday Merge Ritual"
If you both want to contribute to the same show or collaborate dynamically:
1. **Monday–Saturday (Isolated Sprints)**:
   - Showrunner A works on branch: `git checkout -b showrunner-alpha`
   - Showrunner B works on branch: `git checkout -b showrunner-beta`
2. **Sunday Network Sync**:
   - Both push their branches and merge into `main`:
     ```bash
     git checkout main
     git pull origin main
     git merge showrunner-alpha
     git merge showrunner-beta
     git push origin main
     ```
3. **HERMES Sunday Devlog Ingestion**:
   - HERMES (Sunday Chronicler agent) inspects the weekly Git commits across both branches and automatically updates `context/chronicles/WEEK_XX.md`.
   - The combined work of both Showrunners becomes the content for Sunday's broadcast show: *The Network Reel*!

---

## 3. Co-Showrunner 3-Step Onboarding

### Step 1: Clone the Private Repository
```bash
git clone <your-private-github-or-gitlab-repo-url> tetradic-network
cd tetradic-network
```

### Step 2: Run the 1-Click Environment Setup
Run the automated onboarding script to install Remotion, audio dependencies, and verify the toolchain:
```bash
chmod +x scripts/setup_collaborator.sh
./scripts/setup_collaborator.sh
```

### Step 3: Open in Antigravity
1. Launch Antigravity.
2. Open the `tetradic-network` folder.
3. Start a chat. On Turn 1, Antigravity reads `AGENTS.md`, boots the Pantheon, and says:
   *"ORBIT and the Studio Pantheon online. Ready for production."*

---

## 4. Git Hygiene Rules (What to Commit vs. What to Ignore)

| Tracked in Git (Shared) | Ignored in Git (Local Only) |
| :--- | :--- |
| Remotion code (`src/`) | Rendered video files (`out/*.mp4`, `out/*.png`) |
| Scripts & tools (`scripts/`) | `node_modules/` |
| Agent skills (`.agents/skills/`) | Heavy neural model checkpoints (`models/`, `~/.cache/`) |
| Show specifications (`context/shows/`) | OS-specific temp files (`.DS_Store`, `thumbs.db`) |
| Scripts & metadata (`content/`) | Large local video editing caches |
| AI memories (`context/preferences/`, `context/STATE.md`) | Local `.env` credentials (`credentials/youtube_token.json`) |

---

## 5. Dual-Showrunner Taste Calibration

In `context/preferences/SHOWRUNNER_TASTE_PROFILE.md`:
- **Section 1 (Network Invariants)**: Shared ironclad rules (Law of 62, $0 local tools, no generative AI video, deterministic code).
- **Section 2 (Showrunner A Profile)**: Preferences, pacing, and favorite visual motifs for Showrunner A.
- **Section 3 (Showrunner B Profile)**: Preferences, pacing, and favorite visual motifs for Showrunner B.

Whenever either of you prompts Antigravity, prefixing or signing off with your name allows the agents to tailor their directorial tone directly to you!
