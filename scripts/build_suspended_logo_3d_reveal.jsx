/**
 * ORBIT BROADCAST NETWORK — 100% CODE-RENDERED 3D CINEMATOGRAPHY
 * Project: Suspended Geometric Logo — Cosmic Side-Sweep Reveal v2
 * 
 * Major Upgrades in v2:
 *   1. Smooth Cubic Bézier Linework: Replaced jagged 1px-step traced contours
 *      with VectorCraft-simplified smooth cubic Bézier splines (eliminating the "chalk" look).
 *   2. Massive 4,200px 3D Z-Depth: Distributed the 13 components across a deep cosmic corridor
 *      (Z = -1800 to Z = +2400) for intense 3D parallax and spatial separation.
 *   3. Professional After Effects Keyframe Easing: Full native Bézier temporal ease
 *      (85% influence exponential S-curve) and spatial auto-bézier smoothing on all camera
 *      and layer position keyframes, delivering a fluid, luxurious cinematic flow with zero choppiness.
 */

(function () {
    writeLn("=== Building Suspended Cosmic Side-Sweep 3D Reveal (v2 Smooth Bezier + 4200px Z-Depth + Easy-Ease) ===");

    var projectPath = "/home/revenant/Projects/video/out/cinematic_3d_reveal/suspended_logo_3d_reveal.ecproj";
    var sectionsDir = "/home/revenant/Projects/video/out/cinematic_3d_reveal/sections/";
    var assetsDir = "/home/revenant/Projects/video/out/logo_animation/assets/";

    // 1. Create Master 3D Composition (1920x1080 @ 30 FPS, 6.0s)
    var comp = app.project.items.addComp("Suspended_Logo_3D_Reveal", 1920, 1080, 1.0, 6.0, 30);
    writeLn("Created Comp: " + comp.name);

    function getProp(layer, name) {
        var p = layer.property(name);
        if (p) return p;
        var t = layer.property("Transform");
        if (t) {
            p = t.property(name);
            if (p) return p;
        }
        var opt = layer.property("Light Options");
        if (opt) {
            p = opt.property(name);
            if (p) return p;
        }
        var mat = layer.property("Material Options");
        if (mat) {
            p = mat.property(name);
            if (p) return p;
        }
        return null;
    }

    /**
     * Apply professional After Effects Easy-Ease curve to any property keyframe
     */
    function applyEasyEase(prop, keyIndex, influence, speed) {
        if (!influence) influence = 85.0;
        if (speed === undefined) speed = 0.0;
        try {
            prop.setInterpolationTypeAtKey(keyIndex, KeyframeInterpolationType.BEZIER, KeyframeInterpolationType.BEZIER);
        } catch (e) {}

        try {
            var numDims = prop.keyInTemporalEase(keyIndex).length;
            var inEases = [];
            var outEases = [];
            for (var d = 0; d < numDims; d++) {
                inEases.push(new KeyframeEase(speed, influence));
                outEases.push(new KeyframeEase(speed, influence));
            }
            prop.setTemporalEaseAtKey(keyIndex, inEases, outEases);
        } catch (e) {}

        if (prop.isSpatial) {
            try {
                prop.setSpatialAutoBezierAtKey(keyIndex, true);
            } catch (e) {}
        }
    }

    // 2. Layer 1: Obsidian Deep Cosmic Void Solid (#060911)
    var bgSolid = comp.layers.addSolid([0.024, 0.035, 0.067], "BG_ObsidianDeep", 1920, 1080, 1.0, 6.0);
    bgSolid.startTime = 0.0;
    bgSolid.inPoint = 0.0;
    bgSolid.outPoint = 6.0;

    // 3. Layer 2: Cosmic Space Dust Atmosphere (Milky Way ambient particles)
    var spaceDustItem = app.project.importFile(new ImportOptions(new File(assetsDir + "pass4_space_dust.mp4")));
    var dustLayer = comp.layers.add(spaceDustItem);
    dustLayer.name = "Ambient_MilkyWay_Dust";
    dustLayer.blendingMode = BlendingMode.SCREEN;
    getProp(dustLayer, "Position").setValue([960, 540]);
    getProp(dustLayer, "Opacity").setValue(80);

    // 4. Layer 3: Synchronized 48kHz Stereo Master Audio Score
    var audioItem = app.project.importFile(new ImportOptions(new File(assetsDir + "logo_audio_score.wav")));
    var audioLayer = comp.layers.add(audioItem);
    audioLayer.name = "Audio_Score_Stereo";
    audioLayer.startTime = 0.0;
    audioLayer.outPoint = 6.0;

    // 5. 3D Lighting Rig (Clean neutral studio fill lighting, zero bloom glow)
    var keyLight = comp.layers.addLight("Key_Light", [960, 480]);
    getProp(keyLight, "Position").setValue([1600, 200, -1500]);
    getProp(keyLight, "Color").setValue([1.0, 0.98, 0.92, 1.0]);
    getProp(keyLight, "Intensity").setValue(105.0);

    var fillLight = comp.layers.addLight("Fill_Light", [960, 480]);
    getProp(fillLight, "Position").setValue([400, 600, -800]);
    getProp(fillLight, "Color").setValue([0.80, 0.88, 1.0, 1.0]);
    getProp(fillLight, "Intensity").setValue(75.0);

    var ambLight = comp.layers.addLight("Ambient_Fill", [960, 480]);
    getProp(ambLight, "Position").setValue([960, 480, -1000]);
    getProp(ambLight, "Color").setValue([0.85, 0.88, 0.95, 1.0]);
    getProp(ambLight, "Intensity").setValue(90.0);

    // 6. Layer 4: Cinematic 3D Two-Node Camera
    // Point of Interest locked rigidly to emblem optical center [960, 480, 0]
    var cam = comp.layers.addCamera("Cinematic_Orbit_Camera", [960, 480]);
    cam.startTime = 0.0;
    cam.outPoint = 6.0;

    var camPOI = getProp(cam, "Point of Interest");
    camPOI.setValue([960, 480, 0]);

    var camPos = getProp(cam, "Position");
    // Trajectory:
    // t=0.0s: [4200, 460, -400]   -> 83.0° extreme side-profile viewing 4200px cosmic string
    // t=1.2s: [3400, 465, -900]   -> 75.2° side pan along the corridor
    // t=2.2s: [2200, 470, -1700]  -> 52.3° sweeping 3D orbital arc
    // t=3.2s: [1350, 475, -2300]  -> 21.0° front-three-quarter convergence
    // t=4.0s: [960, 480, -2500]   -> 0.0° hero lock
    // t=6.0s: [960, 480, -2460]   -> Micro-dolly hold
    camPos.setValueAtTime(0.0, [4200, 460, -400]);
    camPos.setValueAtTime(1.2, [3400, 465, -900]);
    camPos.setValueAtTime(2.2, [2200, 470, -1700]);
    camPos.setValueAtTime(3.2, [1350, 475, -2300]);
    camPos.setValueAtTime(4.0, [960, 480, -2500]);
    camPos.setValueAtTime(6.0, [960, 480, -2460]);

    // Apply Butter-Smooth Easy Ease to all Camera Position Keyframes
    for (var ck = 1; ck <= camPos.numKeys; ck++) {
        applyEasyEase(camPos, ck, 80.0, 0.0);
    }

    // 7. Define 13 Suspended Sections Along the 4,200px Z-Corridor
    // Resting Center: [960, 480, 0]
    // Astrolabe true concentric axle: [486.5, 259.5, 0], resting pos [1063.5, 372.5, 0]
    // Bird eye center: [202, 265, 0], resting pos [779, 378, 0]
    var sectionConfigs = [
        // --- 1. Deepest Cosmic Background Sections (Z = +1400 to +2400) ---
        {
            file: "12_south_diamonds.png",
            name: "Sec_12_South_Diamonds",
            customAnchor: false,
            initZ: 2400,
            settleStart: 1.2,
            settleEnd: 3.8
        },
        {
            file: "13_east_corners.png",
            name: "Sec_13_East_Corners",
            customAnchor: false,
            initZ: 2100,
            settleStart: 1.2,
            settleEnd: 3.8
        },
        {
            file: "05_top_chambers.png",
            name: "Sec_05_Top_Chambers",
            customAnchor: false,
            initZ: 1800,
            settleStart: 1.3,
            settleEnd: 3.9
        },
        {
            file: "11_east_waves.png",
            name: "Sec_11_East_Waves",
            customAnchor: false,
            initZ: 1500,
            settleStart: 1.3,
            settleEnd: 3.7
        },
        {
            file: "09_southwest_leaf.png",
            name: "Sec_09_Southwest_Leaf",
            customAnchor: false,
            initZ: 1200,
            settleStart: 1.4,
            settleEnd: 3.8
        },

        // --- 2. Intermediate Midground Sections (Z = +200 to +900) ---
        {
            file: "08_west_star.png",
            name: "Sec_08_West_Star",
            customAnchor: false,
            initZ: 900,
            settleStart: 1.4,
            settleEnd: 3.7
        },
        {
            file: "06_west_arc.png",
            name: "Sec_06_West_Arc",
            customAnchor: false,
            initZ: 600,
            settleStart: 1.5,
            settleEnd: 3.7
        },
        {
            file: "10_southwest_pill.png",
            name: "Sec_10_Southwest_Pill",
            customAnchor: false,
            initZ: 300,
            settleStart: 1.5,
            settleEnd: 3.6
        },
        {
            file: "07_west_diamonds.png",
            name: "Sec_07_West_Diamonds",
            customAnchor: false,
            initZ: -100,
            settleStart: 1.6,
            settleEnd: 3.6
        },

        // --- 3. Core Hero Foreground Sections (Z = -500 to -1800) ---
        {
            file: "01_bird_body.png",
            name: "Sec_01_Bird_Body",
            customAnchor: false,
            initZ: -500,
            settleStart: 1.5,
            settleEnd: 3.8
        },
        {
            file: "04_astrolabe_inner.png",
            name: "Sec_04_Astrolabe_Inner",
            customAnchor: true,
            anchor: [486.5, 259.5, 0],
            restPos: [1063.5, 372.5, 0],
            initZ: -900,
            initZRot: -180.0, // Multi-revolution counter-rotation along concentric axle
            settleStart: 1.3,
            settleEnd: 3.9
        },
        {
            file: "03_astrolabe_outer.png",
            name: "Sec_03_Astrolabe_Outer",
            customAnchor: true,
            anchor: [486.5, 259.5, 0],
            restPos: [1063.5, 372.5, 0],
            initZ: -1400,
            initZRot: 270.0, // Major gear rotation along concentric axle
            settleStart: 1.3,
            settleEnd: 3.9
        },
        {
            file: "02_bird_eye.png",
            name: "Sec_02_Bird_Eye",
            customAnchor: true,
            anchor: [202, 265, 0],
            restPos: [779, 378, 0],
            initZ: -1800, // Extreme foreground floating charm
            settleStart: 1.6,
            settleEnd: 3.7
        }
    ];

    // 8. Build Suspended 3D Section Layers
    for (var i = 0; i < sectionConfigs.length; i++) {
        var cfg = sectionConfigs[i];
        var item = app.project.importFile(new ImportOptions(new File(sectionsDir + cfg.file)));
        var layer = comp.layers.add(item);
        layer.name = cfg.name;
        layer.threeDLayer = true;
        layer.blendingMode = BlendingMode.NORMAL;
        layer.startTime = 0.0;
        layer.outPoint = 5.8;

        var restPos = cfg.customAnchor ? cfg.restPos : [960, 480, 0];
        var initPos = cfg.customAnchor ? 
            [cfg.restPos[0], cfg.restPos[1], cfg.initZ] : 
            [960, 480, cfg.initZ];

        if (cfg.customAnchor) {
            getProp(layer, "Anchor Point").setValue(cfg.anchor);
        }

        // Z-axis convergence animation: suspended on string -> settles to Z=0
        var lPos = getProp(layer, "Position");
        lPos.setValueAtTime(0.0, initPos);
        lPos.setValueAtTime(cfg.settleStart, initPos);
        lPos.setValueAtTime(cfg.settleEnd, restPos);

        // Apply Easy Ease to convergence: ease out of suspension, cushion smoothly into rest
        applyEasyEase(lPos, 2, 70.0, 0.0);
        applyEasyEase(lPos, 3, 85.0, 0.0);

        // Axle rotation for astrolabe wheels
        if (cfg.initZRot) {
            var lZRot = getProp(layer, "Rotation");
            lZRot.setValueAtTime(0.0, cfg.initZRot);
            lZRot.setValueAtTime(cfg.settleStart, cfg.initZRot);
            lZRot.setValueAtTime(cfg.settleEnd, 0.0);
            applyEasyEase(lZRot, 2, 70.0, 0.0);
            applyEasyEase(lZRot, 3, 85.0, 0.0);
        }

        // Clean graceful fade-out at end of sequence
        var lOp = getProp(layer, "Opacity");
        lOp.setValueAtTime(0.0, 100);
        lOp.setValueAtTime(5.3, 100);
        lOp.setValueAtTime(5.8, 0);

        writeLn("Added Suspended 3D Section [" + (i + 1) + "/13]: " + cfg.name + " (Init Z = " + cfg.initZ + ")");
    }

    // 9. Kinetic Typography: Main Title ("A S T R O L A B E")
    var titleText = comp.layers.addText("A S T R O L A B E");
    titleText.name = "Typography_Main_Title";
    titleText.startTime = 3.6;
    titleText.inPoint = 3.6;
    titleText.outPoint = 5.8;
    getProp(titleText, "Position").setValue([735, 935]);
    getProp(titleText, "Scale").setValue([46, 46]);

    var titleOp = getProp(titleText, "Opacity");
    titleOp.setValueAtTime(3.6, 0);
    titleOp.setValueAtTime(4.2, 100);
    titleOp.setValueAtTime(5.2, 100);
    titleOp.setValueAtTime(5.8, 0);
    applyEasyEase(titleOp, 1, 75.0, 0.0);
    applyEasyEase(titleOp, 2, 75.0, 0.0);

    // 10. Subtitle Typography ("CELESTIAL NAVIGATION SYSTEM")
    var subText = comp.layers.addText("CELESTIAL NAVIGATION SYSTEM");
    subText.name = "Typography_Subtitle";
    subText.startTime = 3.8;
    subText.inPoint = 3.8;
    subText.outPoint = 5.8;
    getProp(subText, "Position").setValue([795, 980]);
    getProp(subText, "Scale").setValue([16, 16]);

    var subOp = getProp(subText, "Opacity");
    subOp.setValueAtTime(3.8, 0);
    subOp.setValueAtTime(4.4, 85);
    subOp.setValueAtTime(5.2, 85);
    subOp.setValueAtTime(5.8, 0);
    applyEasyEase(subOp, 1, 75.0, 0.0);
    applyEasyEase(subOp, 2, 75.0, 0.0);

    // 11. Save Master EffectCraft Project
    app.project.save(new File(projectPath));
    writeLn("=== SUCCESS: Master Project Saved to " + projectPath + " ===");
})();
