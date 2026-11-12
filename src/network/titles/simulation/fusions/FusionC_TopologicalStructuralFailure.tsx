import React, { useMemo, useRef, useEffect } from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Audio,
  staticFile,
} from 'remotion';

/**
 * FUSION C: THE TOPOLOGICAL STRUCTURAL FAILURE
 * Repositories Collided:
 * - [N057] jihoonkim888/PyTopo3D: SIMP Finite-Element Structural Topology Optimization
 * - [N048] pmocz/latticeboltzmann-python: Lattice Boltzmann D2Q9 fluid vorticity & jetting
 * - [C049] orbingol/nurbs-python: Non-Uniform Rational B-Splines (NURBS) fracture boundaries
 * 
 * Visual Experience:
 * A monolithic titanium block is subjected to multi-axial cosmic stress. In real time,
 * material is carved away via topology optimization, leaving skeletal load-bearing struts.
 * At peak strain, the struts fracture along NURBS splines, releasing pressurized fluid jets
 * via Lattice Boltzmann dynamics before locking into the title.
 */
export const FusionC_TopologicalStructuralFailure: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const isBam = frame >= 150;
  const shakeFrame = Math.max(0, frame - 150);

  const snapSpring = spring({
    frame: shakeFrame,
    fps,
    config: { damping: 14, stiffness: 180, mass: 1.2 },
  });

  const shakeIntensity = interpolate(shakeFrame, [0, 4, 18], [16, 8, 0], { extrapolateRight: 'clamp' });
  const shakeX = Math.sin(shakeFrame * 1.8) * shakeIntensity;
  const shakeY = Math.cos(shakeFrame * 2.2) * (shakeIntensity * 0.7);

  // 1. Topology Optimization Skeletal Struts (PyTopo3D N057)
  // Grid of nodes with SIMP relative density rho in [0, 1]
  const topoStruts = useMemo(() => {
    const struts = [];
    const rows = 9;
    const cols = 15;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        // Horizontal strut
        if (c < cols - 1) {
          struts.push({ r1: r, c1: c, r2: r, c2: c + 1, isHoriz: true, id: `h_${r}_${c}` });
        }
        // Vertical strut
        if (r < rows - 1) {
          struts.push({ r1: r, c1: c, r2: r + 1, c2: c, isHoriz: false, id: `v_${r}_${c}` });
        }
        // Diagonal cross-brace
        if (r < rows - 1 && c < cols - 1 && (r + c) % 2 === 0) {
          struts.push({ r1: r, c1: c, r2: r + 1, c2: c + 1, isHoriz: false, id: `d_${r}_${c}` });
        }
      }
    }
    return struts;
  }, []);

  // 2. Lattice Boltzmann Fluid Jets (pmocz/latticeboltzmann-python N048)
  // 60 high-velocity vortex jet particles emanating from fracture seams
  const fluidJets = useMemo(() => {
    const jets = [];
    let seed = 77777;
    const rnd = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };
    for (let i = 0; i < 72; i++) {
      const angle = (i / 72) * Math.PI * 2 + (rnd() - 0.5) * 0.3;
      const speed = 22 + rnd() * 26;
      const size = 2.0 + rnd() * 3.5;
      const vortexSpin = (i % 2 === 0 ? 1 : -1) * (0.04 + rnd() * 0.04);
      jets.push({ angle, speed, size, vortexSpin, id: i });
    }
    return jets;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);
    const cx = width / 2;
    const cy = height / 2;

    const gridW = 900;
    const gridH = 460;
    const originX = cx - gridW / 2;
    const originY = cy - gridH / 2;
    const cols = 15;
    const rows = 9;
    const cellW = gridW / (cols - 1);
    const cellH = gridH / (rows - 1);

    // Stress load escalates from 0 to 149
    const strainLevel = interpolate(frame, [0, 149], [0, 1.0], { extrapolateRight: 'clamp' });
    const isBuckled = frame >= 120;

    // --- ENGINE 1: SIMP TOPOLOGY OPTIMIZATION STRUT CARVING (N057) ---
    // Struts with low strain energy are penalized and carved away; high strain struts thicken!
    topoStruts.forEach((st) => {
      // Analytical strain energy distribution based on cantilever loading
      const midC = (st.c1 + st.c2) / 2;
      const midR = (st.r1 + st.r2) / 2;
      const distFromCenter = Math.sqrt(Math.pow((midC - 7) / 7, 2) + Math.pow((midR - 4) / 4, 2));
      
      // SIMP density formulation: rho = (strain)^p (penalization factor p=3)
      const strainEnergy = Math.max(0.05, 1.0 - distFromCenter * 0.7);
      const simpDensity = Math.pow(strainEnergy, 2.5);

      // If density too low under current optimization step, strut disappears!
      const optCutoff = interpolate(frame, [0, 140], [0, 0.45], { extrapolateRight: 'clamp' });
      if (simpDensity < optCutoff) return; // material carved away!

      // Compute node positions with buckling displacement
      let x1 = originX + st.c1 * cellW;
      let y1 = originY + st.r1 * cellH;
      let x2 = originX + st.c2 * cellW;
      let y2 = originY + st.r2 * cellH;

      // Buckling yield fracture on F120+
      if (isBuckled && !isBam) {
        const buckleAmp = (frame - 120) * 0.8;
        y1 += Math.sin(st.c1 * 1.5 + frame * 0.2) * buckleAmp;
        y2 += Math.cos(st.c2 * 1.5 + frame * 0.2) * buckleAmp;
      }

      // Von Mises stress color grading
      const isYielding = simpDensity > 0.7 && strainLevel > 0.6;
      ctx.strokeStyle = isYielding
        ? (frame >= 120 ? '#FF5722' : '#FFB300') // yield crimson / amber
        : `rgba(77, 208, 225, ${Math.min(1.0, simpDensity + 0.2)})`; // titanium cyan

      ctx.lineWidth = isYielding ? 3.5 : Math.max(1.0, simpDensity * 3.0);

      // Render strut
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      // Highlight high-stress finite element nodes
      if (simpDensity > 0.8) {
        ctx.fillStyle = isYielding ? '#FF5722' : '#00E5FF';
        ctx.beginPath();
        ctx.arc(x1, y1, isYielding ? 4.0 : 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // --- ENGINE 2: LATTICE BOLTZMANN HIGH-PRESSURE FLUID JETS (N048) ---
    // Pressurized fluid escapes from fractured seams on BAM!
    if (isBam && shakeFrame <= 40) {
      fluidJets.forEach((j) => {
        const jetDist = j.speed * (1 - Math.exp(-shakeFrame / 10)) * 14;
        const curAngle = j.angle + shakeFrame * j.vortexSpin; // vortex curl
        const jx = cx + Math.cos(curAngle) * jetDist;
        const jy = cy + Math.sin(curAngle) * (jetDist * 0.55);

        const jetOpacity = interpolate(shakeFrame, [0, 4, 38], [0, 0.95, 0]);

        ctx.fillStyle = j.id % 2 === 0 ? '#00E5FF' : '#FF5722';
        ctx.shadowColor = ctx.fillStyle;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(jx, jy, j.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });
    }

    // --- CAD BOUNDING CALIPERS & YIELD LIMITS ---
    ctx.strokeStyle = '#4DD0E1';
    ctx.lineWidth = 1;
    ctx.strokeRect(originX - 20, originY - 20, gridW + 40, gridH + 40);

    // Callout Readout
    ctx.fillStyle = strainLevel > 0.8 ? '#FF5722' : '#4DD0E1';
    ctx.font = '700 11px monospace';
    ctx.fillText(
      `LOAD: ${(strainLevel * 10).toFixed(2)} GPa // YIELD STRESS: ${isBuckled ? 'CRITICAL BUCKLING FAILURE' : 'NOMINAL FEA'}`,
      originX,
      originY - 30
    );

  }, [frame, width, height, isBam, shakeFrame, topoStruts, fluidJets]);

  // Anamorphic Specular Glint Sweep (Frames 150-175)
  const glintProgress = interpolate(shakeFrame, [0, 20], [-300, 1400], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const glintOpacity = interpolate(shakeFrame, [0, 3, 22], [0, 0.95, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: '#070A0E', fontFamily: "'JetBrains Mono', monospace" }}>
      <Audio src={staticFile('audio/simulation_theme_1B_tidal_spaghettification.mp3')} startFrom={75} />
      
      <div style={{ position: 'absolute', inset: 0, transform: `translate3d(${shakeX}px, ${shakeY}px, 0)` }}>
        <canvas ref={canvasRef} width={width} height={height} style={{ position: 'absolute', inset: 0 }} />

        {/* Fusion Label Banner */}
        <div style={{ position: 'absolute', top: 40, left: 60, color: '#FF7043', fontSize: 18, fontWeight: 900 }}>
          [FUSION C: THE TOPOLOGICAL STRUCTURAL FAILURE]
          <div style={{ fontSize: 13, color: '#00E5FF', marginTop: 4 }}>
            SIMP Topology Optimization [N057] × Lattice Boltzmann Fluid Jets [N048] × NURBS Yield [C049]
          </div>
        </div>

        {/* Telemetry HUD */}
        <div style={{ position: 'absolute', bottom: 40, left: 60, color: '#4DD0E1', fontSize: 12 }}>
          FINITE ELEMENT SIMP CARVING // VON MISES YIELD DISPLACEMENT // D2Q9 VORTEX JETTING
        </div>

        {/* Anamorphic Glint */}
        {isBam && shakeFrame <= 26 && (
          <div style={{
            position: 'absolute',
            left: glintProgress,
            top: '50%',
            width: 850,
            height: 2,
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.95) 50%, transparent 100%)',
            boxShadow: '0 0 24px 6px rgba(255, 87, 34, 0.95), 0 0 50px 14px rgba(0, 229, 255, 0.75)',
            opacity: glintOpacity,
            transform: 'translateY(-50%)',
            pointerEvents: 'none',
          }} />
        )}

        {/* Title */}
        {isBam && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <h1 style={{
              fontSize: 94,
              fontWeight: 900,
              color: '#F3B659',
              margin: 0,
              transform: `scale(${interpolate(snapSpring, [0, 1], [0.82, 1.0])})`,
              textShadow: `
                4px 4px 0 #8B6514,
                8px 8px 30px rgba(0, 0, 0, 0.95),
                0 0 60px rgba(255, 87, 34, 0.6)
              `,
              letterSpacing: '0.16em',
            }}>
              THE SIMULATION
            </h1>
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
