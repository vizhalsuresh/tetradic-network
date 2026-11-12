#!/usr/bin/env bash
set -e

echo "🎬 ========================================================="
echo "🎬 RENDERING 3-MINUTE VOX EXPLAINER FILMS (100% LOCAL CODE)"
echo "🎬 ========================================================="

mkdir -p out

echo ""
echo "▶️ [1/3] Rendering Show 1: The Blueprint (Deep Ocean Internet Backbone)..."
npx remotion render Blueprint-VoxExplainer-DeepOcean out/blueprint_vox_explainer.mp4 --concurrency=4
cp out/blueprint_vox_explainer.mp4 /home/revenant/.gemini/antigravity/brain/e7c9dc1f-6305-464e-8322-b0b88de2e48b/ || true

echo ""
echo "▶️ [2/3] Rendering Show 2: The Simulation (The Three-Body Catastrophe)..."
npx remotion render Simulation-VoxExplainer-ThreeBody out/simulation_vox_explainer.mp4 --concurrency=4
cp out/simulation_vox_explainer.mp4 /home/revenant/.gemini/antigravity/brain/e7c9dc1f-6305-464e-8322-b0b88de2e48b/ || true

echo ""
echo "▶️ [3/3] Rendering Show 3: The Paradox (The Monty Hall Engine)..."
npx remotion render Paradox-VoxExplainer-MontyHall out/paradox_vox_explainer.mp4 --concurrency=4
cp out/paradox_vox_explainer.mp4 /home/revenant/.gemini/antigravity/brain/e7c9dc1f-6305-464e-8322-b0b88de2e48b/ || true

echo ""
echo "🎉 ALL 3 VOX EXPLAINER FILMS RENDERED SUCCESSFULLY!"
