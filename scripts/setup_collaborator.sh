#!/usr/bin/env bash
# ==============================================================================
# TETRADIC NETWORK — Co-Showrunner 1-Click Environment Setup Script
# ==============================================================================

set -e

echo "=========================================================="
echo "🎬 TETRADIC NETWORK — Co-Showrunner Workstation Onboarding"
echo "=========================================================="

# 1. Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js is not installed. Please install Node.js (v20+ recommended)."
    exit 1
fi
echo "✅ Node.js detected: $(node -v)"

# 2. Check Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Error: Python 3 is not installed."
    exit 1
fi
echo "✅ Python 3 detected: $(python3 --version)"

# 3. Check FFmpeg
if ! command -v ffmpeg &> /dev/null; then
    echo "⚠️ Warning: FFmpeg is not found in PATH. Remotion video encoding may require it."
else
    echo "✅ FFmpeg detected: $(ffmpeg -version | head -n1)"
fi

# 4. Install Node Dependencies & Agent Skills
echo ""
echo "📦 Installing root Remotion dependencies..."
npm install

echo ""
echo "🧠 Restoring Agent Skills from skills-lock.json..."
npx -y skills experimental_install -y

# 5. Check Audio Directories
echo ""
echo "📁 Verifying audio and output directories..."
mkdir -p public/audio
mkdir -p out
mkdir -p content

# 6. Verify Anidoodle environment if present
if [ -d "anidoodle-art" ]; then
    echo "📦 Installing Anidoodle dependencies..."
    cd anidoodle-art && npm install && cd ..
fi

echo ""
echo "=========================================================="
echo "🎉 ONBOARDING COMPLETE!"
echo "Open this repository folder in Antigravity."
echo "On Turn 1, your AI agent will automatically load AGENTS.md"
echo "and bring the full Cybernetic Studio Pantheon online!"
echo "=========================================================="
