import React from 'react';
import { loadFont } from '@remotion/google-fonts/Montserrat';
import { Composition } from 'remotion';
import { MainComposition } from './Composition';
import { StationBumper } from './network/StationBumper';
import {
  BlueprintTitleA,
  BlueprintTitleB,
  BlueprintTitleC,
  BlueprintDir1Deconstruction,
  BlueprintDir2Raymarched,
  BlueprintDir3Clockwork,
  BlueprintDir4BlenderComposite,
  BlueprintDir5DraftingTimelapse,
  BlueprintHybridGenesis,
  BlueprintVoxTitle,
} from './network/titles/blueprint';
import {
  SimulationTitleA_Singularity,
  SimulationTitleB_VelocitySwarm,
  SimulationTitleC_QuantumLattice,
  SimulationHybridMaster,
  SimulationVoxTitle,
} from './network/titles/simulation';
import {
  ParadoxVoxTitle,
} from './network/titles/paradox';
import {
  Tier1_NaiveCanvas,
  Tier2_ComputationalGeometry,
  Tier3_ContinuumPhysics,
  Tier4_HollywoodCinematic,
} from './network/titles/simulation/tiers';
import {
  FusionA_VectorFluidVortex,
  FusionB_BioCosmicCollapse,
  FusionC_TopologicalStructuralFailure,
} from './network/titles/simulation/fusions';
import {
  BlueprintVoxExplainer,
  BLUEPRINT_VOX_DURATION_FRAMES,
} from './shows/blueprint/vox_explainer/BlueprintVoxExplainer';
import {
  SimulationVoxExplainer,
  SIMULATION_VOX_DURATION_FRAMES,
} from './shows/simulation/vox_explainer/SimulationVoxExplainer';
import {
  ParadoxVoxExplainer,
  PARADOX_VOX_DURATION_FRAMES,
} from './shows/paradox/vox_explainer/ParadoxVoxExplainer';
import { BP001 } from './shows/blueprint/episodes/BP001/Episode';

// Load a high-end, bold font
loadFont();

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Station Ident & Network Bumpers */}
      <Composition
        id="StationBumper-16x9"
        component={StationBumper}
        durationInFrames={90}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ aspectRatio: '16:9' }}
      />
      <Composition
        id="StationBumper-9x16"
        component={StationBumper}
        durationInFrames={90}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ aspectRatio: '9:16' }}
      />

      {/* Show 1: The Blueprint Title Animation Treatments */}
      <Composition
        id="Blueprint-OptionA-16x9"
        component={BlueprintTitleA}
        durationInFrames={90}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ aspectRatio: '16:9', episodeCode: 'BP-001' }}
      />
      <Composition
        id="Blueprint-OptionA-9x16"
        component={BlueprintTitleA}
        durationInFrames={90}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ aspectRatio: '9:16', episodeCode: 'BP-001' }}
      />
      <Composition
        id="Blueprint-OptionB-16x9"
        component={BlueprintTitleB}
        durationInFrames={210}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ aspectRatio: '16:9', episodeCode: 'BP-001' }}
      />
      <Composition
        id="Blueprint-OptionB-9x16"
        component={BlueprintTitleB}
        durationInFrames={210}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ aspectRatio: '9:16', episodeCode: 'BP-001' }}
      />
      <Composition
        id="Blueprint-OptionC-16x9"
        component={BlueprintTitleC}
        durationInFrames={90}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ aspectRatio: '16:9', episodeCode: 'BP-001' }}
      />
      <Composition
        id="Blueprint-OptionC-9x16"
        component={BlueprintTitleC}
        durationInFrames={90}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ aspectRatio: '9:16', episodeCode: 'BP-001' }}
      />

      {/* Show 1: The Blueprint 5 Transformative Upgraded Directions */}
      <Composition
        id="Blueprint-Dir1-Deconstruction-16x9"
        component={BlueprintDir1Deconstruction}
        durationInFrames={210}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ aspectRatio: '16:9', episodeCode: 'BP-001' }}
      />
      <Composition
        id="Blueprint-Dir1-Deconstruction-9x16"
        component={BlueprintDir1Deconstruction}
        durationInFrames={210}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ aspectRatio: '9:16', episodeCode: 'BP-001' }}
      />
      <Composition
        id="Blueprint-Dir2-Raymarched-16x9"
        component={BlueprintDir2Raymarched}
        durationInFrames={210}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ aspectRatio: '16:9', episodeCode: 'BP-001' }}
      />
      <Composition
        id="Blueprint-Dir2-Raymarched-9x16"
        component={BlueprintDir2Raymarched}
        durationInFrames={210}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ aspectRatio: '9:16', episodeCode: 'BP-001' }}
      />
      <Composition
        id="Blueprint-Dir3-Clockwork-16x9"
        component={BlueprintDir3Clockwork}
        durationInFrames={210}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ aspectRatio: '16:9', episodeCode: 'BP-001' }}
      />
      <Composition
        id="Blueprint-Dir3-Clockwork-9x16"
        component={BlueprintDir3Clockwork}
        durationInFrames={210}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ aspectRatio: '9:16', episodeCode: 'BP-001' }}
      />
      <Composition
        id="Blueprint-Dir4-BlenderComposite-16x9"
        component={BlueprintDir4BlenderComposite}
        durationInFrames={210}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ aspectRatio: '16:9', episodeCode: 'BP-001' }}
      />
      <Composition
        id="Blueprint-Dir4-BlenderComposite-9x16"
        component={BlueprintDir4BlenderComposite}
        durationInFrames={210}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ aspectRatio: '9:16', episodeCode: 'BP-001' }}
      />
      <Composition
        id="Blueprint-Dir5-DraftingTimelapse-16x9"
        component={BlueprintDir5DraftingTimelapse}
        durationInFrames={210}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ aspectRatio: '16:9', episodeCode: 'BP-001' }}
      />
      <Composition
        id="Blueprint-Dir5-DraftingTimelapse-9x16"
        component={BlueprintDir5DraftingTimelapse}
        durationInFrames={210}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ aspectRatio: '9:16', episodeCode: 'BP-001' }}
      />

      {/* Show 1: The Blueprint Master Broadcast Hybrid Title (12.0s Master Cut — 360 frames) */}
      <Composition
        id="Blueprint-Master-Hybrid-16x9"
        component={BlueprintHybridGenesis}
        durationInFrames={360}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ aspectRatio: '16:9', episodeCode: 'BP-001' }}
      />
      <Composition
        id="Blueprint-Master-Hybrid-9x16"
        component={BlueprintHybridGenesis}
        durationInFrames={360}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ aspectRatio: '9:16', episodeCode: 'BP-001' }}
      />

      {/* Show 1: The Blueprint Episodes */}
      <Composition
        id="Blueprint-BP001-16x9"
        component={BP001}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ aspectRatio: '16:9' }}
      />
      <Composition
        id="Blueprint-BP001-9x16"
        component={BP001}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ aspectRatio: '9:16' }}
      />

      {/* Show 2: The Simulation Master Title Animation Suite (Triple-Treatment — 12.0s / 360 frames) */}
      <Composition
        id="Simulation-OptionA-Singularity-16x9"
        component={SimulationTitleA_Singularity}
        durationInFrames={360}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Simulation-OptionA-Singularity-9x16"
        component={SimulationTitleA_Singularity}
        durationInFrames={360}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Simulation-OptionB-VelocitySwarm-16x9"
        component={SimulationTitleB_VelocitySwarm}
        durationInFrames={360}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Simulation-OptionB-VelocitySwarm-9x16"
        component={SimulationTitleB_VelocitySwarm}
        durationInFrames={360}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="Simulation-OptionC-QuantumLattice-16x9"
        component={SimulationTitleC_QuantumLattice}
        durationInFrames={360}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Simulation-OptionC-QuantumLattice-9x16"
        component={SimulationTitleC_QuantumLattice}
        durationInFrames={360}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* Show 2: The Simulation Master Title — Flagship Hybrid (Option 4: Geodesic Spaghettification) */}
      <Composition
        id="Simulation-HybridMaster-16x9"
        component={SimulationHybridMaster}
        durationInFrames={360}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Simulation-HybridMaster-9x16"
        component={SimulationHybridMaster}
        durationInFrames={360}
        fps={30}
        width={1080}
        height={1920}
      />

      {/* 4-TIER SOPHISTICATION COMPARATIVE SUITE (8.0s / 240 frames @ 30 FPS) */}
      <Composition
        id="Simulation-Tier1-NaiveCanvas"
        component={Tier1_NaiveCanvas}
        durationInFrames={240}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Simulation-Tier2-ComputationalGeometry"
        component={Tier2_ComputationalGeometry}
        durationInFrames={240}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Simulation-Tier3-ContinuumPhysics"
        component={Tier3_ContinuumPhysics}
        durationInFrames={240}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Simulation-Tier4-HollywoodCinematic"
        component={Tier4_HollywoodCinematic}
        durationInFrames={240}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* MULTI-REPO FUSION SHOWCASE (8.0s / 240 frames @ 30 FPS) */}
      <Composition
        id="Simulation-FusionA-VectorFluidVortex"
        component={FusionA_VectorFluidVortex}
        durationInFrames={240}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Simulation-FusionB-BioCosmicCollapse"
        component={FusionB_BioCosmicCollapse}
        durationInFrames={240}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Simulation-FusionC-TopologicalStructuralFailure"
        component={FusionC_TopologicalStructuralFailure}
        durationInFrames={240}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* 3-MINUTE VOX EXPLAINER FILMS (100% LOCAL DETERMINISTIC RENDER) */}
      <Composition
        id="Blueprint-VoxExplainer-DeepOcean"
        component={BlueprintVoxExplainer}
        durationInFrames={BLUEPRINT_VOX_DURATION_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Simulation-VoxExplainer-ThreeBody"
        component={SimulationVoxExplainer}
        durationInFrames={SIMULATION_VOX_DURATION_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Paradox-VoxExplainer-MontyHall"
        component={ParadoxVoxExplainer}
        durationInFrames={PARADOX_VOX_DURATION_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* VOX EXPLAINER TITLE ANIMATIONS (12.0s / 360 FRAMES @ 30 FPS) */}
      <Composition
        id="Blueprint-VoxTitle"
        component={BlueprintVoxTitle}
        durationInFrames={360}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ aspectRatio: '16:9', episodeCode: 'BP-001' }}
      />
      <Composition
        id="Blueprint-VoxTitle-9x16"
        component={BlueprintVoxTitle}
        durationInFrames={360}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ aspectRatio: '9:16', episodeCode: 'BP-001' }}
      />
      <Composition
        id="Simulation-VoxTitle"
        component={SimulationVoxTitle}
        durationInFrames={360}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ aspectRatio: '16:9', episodeCode: 'SIM-001' }}
      />
      <Composition
        id="Simulation-VoxTitle-9x16"
        component={SimulationVoxTitle}
        durationInFrames={360}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ aspectRatio: '9:16', episodeCode: 'SIM-001' }}
      />
      <Composition
        id="Paradox-VoxTitle"
        component={ParadoxVoxTitle}
        durationInFrames={360}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ aspectRatio: '16:9', episodeCode: 'PDX-001' }}
      />
      <Composition
        id="Paradox-VoxTitle-9x16"
        component={ParadoxVoxTitle}
        durationInFrames={360}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ aspectRatio: '9:16', episodeCode: 'PDX-001' }}
      />

      {/* Legacy / Pilot Visual Reel */}
      <Composition
        id="CreativeArchitectReel"
        component={MainComposition}
        durationInFrames={1050}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};

