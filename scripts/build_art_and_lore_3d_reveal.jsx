/**
 * ORBIT BROADCAST NETWORK — 100% CODE-RENDERED 3D CINEMATOGRAPHY
 * Project: The Art and Lore Studio — Speed-Ramp 3D Reveal
 * 
 * Directives:
 *   1. Company Name: "THE ART AND LORE STUDIO"
 *   2. Speed Ramp Rhythm:
 *      - Slow-motion side profile drift (0.0s – 1.6s): floating alongside suspended string in cosmic void.
 *      - Aggressive speed-ramp 3D orbital swoop (1.6s – 2.4s): high-velocity kinetic whip from side to front.
 *      - Slow-motion deceleration & docking (2.4s – 4.2s): time dilates as symbols dock into place with cushioned settle.
 *   3. Color Palette: Full logo is pure WHITE (#ffffff) with ZERO yellow anywhere; Bird Eye is Electric Cyan (#00e5ff).
 *   4. Vector Precision: 100% native SVG vector layers with collapseTransformation = true (zero pixelation).
 *   5. Pinterest Reference Integration: Dynamic 3D line-art trim-paths write-on curves orbiting during the speed ramp.
 */

(function () {
    writeLn("=== Building 'The Art and Lore Studio' Speed-Ramp 3D Reveal ===");

    var projectPath = "/home/revenant/Projects/video/out/cinematic_3d_reveal/suspended_logo_3d_reveal.ecproj";
    var sectionsDir = "/home/revenant/Projects/video/out/cinematic_3d_reveal/sections/";
    var assetsDir = "/home/revenant/Projects/video/out/logo_animation/assets/";

    // 1. Create Master 3D Composition (1920x1080 @ 30 FPS, 6.0s)
    var comp = app.project.items.addComp("Art_And_Lore_3D_Reveal", 1920, 1080, 1.0, 6.0, 30);
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

    // 3. Layer 2: Cosmic Space Dust Atmosphere (Milky Way ambient dust)
    var spaceDustItem = app.project.importFile(new ImportOptions(new File(assetsDir + "pass4_space_dust.mp4")));
    var dustLayer = comp.layers.add(spaceDustItem);
    dustLayer.name = "Ambient_MilkyWay_Dust";
    dustLayer.blendingMode = BlendingMode.SCREEN;
    getProp(dustLayer, "Position").setValue([960, 540]);
    getProp(dustLayer, "Opacity").setValue(75);

    // 4. Layer 3: Synchronized 48kHz Stereo Master Audio Score
    var audioItem = app.project.importFile(new ImportOptions(new File(assetsDir + "logo_audio_score.wav")));
    var audioLayer = comp.layers.add(audioItem);
    audioLayer.name = "Audio_Score_Stereo";
    audioLayer.startTime = 0.0;
    audioLayer.outPoint = 6.0;

    // 5. 3D Studio Lighting Rig (Pure crisp illumination for white vector artwork)
    var keyLight = comp.layers.addLight("Key_Light", [960, 480]);
    getProp(keyLight, "Position").setValue([1600, 200, -1600]);
    getProp(keyLight, "Color").setValue([1.0, 1.0, 1.0, 1.0]);
    getProp(keyLight, "Intensity").setValue(110.0);

    var fillLight = comp.layers.addLight("Fill_Light", [960, 480]);
    getProp(fillLight, "Position").setValue([300, 650, -800]);
    getProp(fillLight, "Color").setValue([0.90, 0.94, 1.0, 1.0]);
    getProp(fillLight, "Intensity").setValue(80.0);

    var ambLight = comp.layers.addLight("Ambient_Fill", [960, 480]);
    getProp(ambLight, "Position").setValue([960, 480, -1000]);
    getProp(ambLight, "Color").setValue([0.88, 0.90, 0.98, 1.0]);
    getProp(ambLight, "Intensity").setValue(95.0);

    // 6. Layer 4: Cinematic Speed-Ramp 3D Two-Node Camera
    var cam = comp.layers.addCamera("SpeedRamp_Cinematic_Camera", [960, 480]);
    cam.startTime = 0.0;
    cam.outPoint = 6.0;

    var camPOI = getProp(cam, "Point of Interest");
    camPOI.setValue([960, 480, 0]);

    var camPos = getProp(cam, "Position");
    // Speed Ramp Keyframes:
    // Key 1: t=0.0s [4500, 460, -250]   -> 86.8° extreme side profile (slow-mo start)
    // Key 2: t=1.6s [3950, 465, -550]   -> 82.0° slow drift ends, ready to whip
    // Key 3: t=2.4s [1500, 475, -2150]  -> 14.1° aggressive speed-ramp whip around orbit (0.8s blast)
    // Key 4: t=4.0s [960, 480, -2500]   -> 0.0° slow-motion deceleration & docking into hero view
    // Key 5: t=6.0s [960, 480, -2460]   -> micro-dolly hold
    camPos.setValueAtTime(0.0, [4500, 460, -250]);
    camPos.setValueAtTime(1.6, [3950, 465, -550]);
    camPos.setValueAtTime(2.4, [1500, 475, -2150]);
    camPos.setValueAtTime(4.0, [960, 480, -2500]);
    camPos.setValueAtTime(6.0, [960, 480, -2460]);

    // Apply Custom Speed Ramp Easing:
    // Key 1: gentle drift out
    applyEasyEase(camPos, 1, 60.0, 0.0);
    // Key 2: accelerate sharply into whip (high out-influence 90%)
    applyEasyEase(camPos, 2, 85.0, 0.0);
    // Key 3: decelerate smoothly into slow-mo settle
    applyEasyEase(camPos, 3, 75.0, 0.0);
    // Key 4: buttery cushion stop into hero lock (90% influence)
    applyEasyEase(camPos, 4, 90.0, 0.0);
    // Key 5: end hold
    applyEasyEase(camPos, 5, 50.0, 0.0);

    // 7. Pinterest-Style 3D Line-Art Trim-Paths Sweeps
    // Animated stroke write-on curves that whip around the 3D center during the speed ramp
    var orbitalRings = [
        { radius: 640, stroke: 2.5, startT: 1.5, endT: 2.7, rotZ: 25 },
        { radius: 820, stroke: 2.0, startT: 1.6, endT: 2.9, rotZ: -35 },
        { radius: 1050, stroke: 1.5, startT: 1.8, endT: 3.2, rotZ: 50 }
    ];

    for (var r = 0; r < orbitalRings.length; r++) {
        var ringCfg = orbitalRings[r];
        var ringLayer = comp.layers.addShape();
        ringLayer.name = "LineArt_Orbital_Sweep_" + (r + 1);
        ringLayer.threeDLayer = true;
        ringLayer.startTime = 0.0;
        ringLayer.outPoint = 5.8;

        getProp(ringLayer, "Position").setValue([960, 480, 0]);
        getProp(ringLayer, "Rotation").setValue(ringCfg.rotZ);

        var rContents = ringLayer.property("Contents");
        var rGroup = rContents.addProperty("ADBE Vector Group");
        var rGroupContents = rGroup.property("Contents");

        var rEllipse = rGroupContents.addProperty("ADBE Vector Shape - Ellipse");
        rEllipse.property("Size").setValue([ringCfg.radius, ringCfg.radius]);

        var rStroke = rGroupContents.addProperty("ADBE Vector Graphic - Stroke");
        rStroke.property("Color").setValue([1.0, 1.0, 1.0, 0.85]);
        rStroke.property("Stroke Width").setValue(ringCfg.stroke);

        var rTrim = rGroupContents.addProperty("ADBE Vector Filter - Trim");
        var trimStart = rTrim.property("Start");
        var trimEnd = rTrim.property("End");

        trimStart.setValueAtTime(ringCfg.startT + 0.3, 0);
        trimStart.setValueAtTime(ringCfg.endT, 100);
        applyEasyEase(trimStart, 1, 80.0, 0.0);
        applyEasyEase(trimStart, 2, 85.0, 0.0);

        trimEnd.setValueAtTime(ringCfg.startT, 0);
        trimEnd.setValueAtTime(ringCfg.endT - 0.2, 100);
        applyEasyEase(trimEnd, 1, 80.0, 0.0);
        applyEasyEase(trimEnd, 2, 85.0, 0.0);

        writeLn("Added Pinterest-style 3D Line-Art Orbital Sweep [" + (r + 1) + "/3]");
    }

    // 8. 13 Suspended Sections Along 4,200px Z-Corridor
    // Imported directly as native SVGs with collapseTransformation = true (pure mathematical vectors!)
    var sectionConfigs = [
        // --- Deepest Cosmic Background (Z = +1400 to +2400) ---
        { file: "12_south_diamonds.svg", name: "Sec_12_South_Diamonds", customAnchor: false, initZ: 2400, settleStart: 1.6, settleEnd: 3.8 },
        { file: "13_east_corners.svg", name: "Sec_13_East_Corners", customAnchor: false, initZ: 2100, settleStart: 1.6, settleEnd: 3.8 },
        { file: "05_top_chambers.svg", name: "Sec_05_Top_Chambers", customAnchor: false, initZ: 1800, settleStart: 1.7, settleEnd: 3.9 },
        { file: "11_east_waves.svg", name: "Sec_11_East_Waves", customAnchor: false, initZ: 1500, settleStart: 1.7, settleEnd: 3.7 },
        { file: "09_southwest_leaf.svg", name: "Sec_09_Southwest_Leaf", customAnchor: false, initZ: 1200, settleStart: 1.8, settleEnd: 3.8 },

        // --- Intermediate Midground (Z = -100 to +900) ---
        { file: "08_west_star.svg", name: "Sec_08_West_Star", customAnchor: false, initZ: 900, settleStart: 1.8, settleEnd: 3.7 },
        { file: "06_west_arc.svg", name: "Sec_06_West_Arc", customAnchor: false, initZ: 600, settleStart: 1.9, settleEnd: 3.7 },
        { file: "10_southwest_pill.svg", name: "Sec_10_Southwest_Pill", customAnchor: false, initZ: 300, settleStart: 1.9, settleEnd: 3.6 },
        { file: "07_west_diamonds.svg", name: "Sec_07_West_Diamonds", customAnchor: false, initZ: -100, settleStart: 2.0, settleEnd: 3.6 },

        // --- Core Hero Foreground (Z = -500 to -1800) ---
        { file: "01_bird_body.svg", name: "Sec_01_Bird_Body", customAnchor: false, initZ: -500, settleStart: 1.8, settleEnd: 3.8 },
        {
            file: "04_astrolabe_inner.svg",
            name: "Sec_04_Astrolabe_Inner",
            customAnchor: true,
            anchor: [486.5, 259.5, 0],
            restPos: [1063.5, 372.5, 0],
            initZ: -900,
            initZRot: -240.0, // Multi-revolution spin along concentric axle
            settleStart: 1.6,
            settleEnd: 4.0
        },
        {
            file: "03_astrolabe_outer.svg",
            name: "Sec_03_Astrolabe_Outer",
            customAnchor: true,
            anchor: [486.5, 259.5, 0],
            restPos: [1063.5, 372.5, 0],
            initZ: -1400,
            initZRot: 360.0, // Full 360° gear rotation along axle
            settleStart: 1.6,
            settleEnd: 4.0
        },
        {
            file: "02_bird_eye.svg",
            name: "Sec_02_Bird_Eye",
            customAnchor: true,
            anchor: [202, 265, 0],
            restPos: [779, 378, 0],
            initZ: -1800, // Extreme foreground floating cyan beacon
            settleStart: 2.0,
            settleEnd: 3.7
        }
    ];

    // 9. Build Native Continuous Vector SVG 3D Layers
    for (var i = 0; i < sectionConfigs.length; i++) {
        var cfg = sectionConfigs[i];
        var item = app.project.importFile(new ImportOptions(new File(sectionsDir + cfg.file)));
        var layer = comp.layers.add(item);
        layer.name = cfg.name;
        layer.collapseTransformation = true; // Infinite vector sharpness at any camera distance!
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

        // Z-axis docking animation:
        // Key 1: t=0.0s (initPos - suspended in slow-mo side drift)
        // Key 2: t=settleStart (initPos - begins rapid speed-ramp flight)
        // Key 3: t=settleEnd (restPos - decelerates smoothly and docks into place)
        var lPos = getProp(layer, "Position");
        lPos.setValueAtTime(0.0, initPos);
        lPos.setValueAtTime(cfg.settleStart, initPos);
        lPos.setValueAtTime(cfg.settleEnd, restPos);

        // Slow motion docking cushion (88% influence into restPos!)
        applyEasyEase(lPos, 2, 75.0, 0.0);
        applyEasyEase(lPos, 3, 88.0, 0.0);

        // Axle rotation for astrolabe wheels
        if (cfg.initZRot) {
            var lZRot = getProp(layer, "Rotation");
            lZRot.setValueAtTime(0.0, cfg.initZRot);
            lZRot.setValueAtTime(cfg.settleStart, cfg.initZRot);
            lZRot.setValueAtTime(cfg.settleEnd, 0.0);
            applyEasyEase(lZRot, 2, 75.0, 0.0);
            applyEasyEase(lZRot, 3, 88.0, 0.0);
        }

        // Graceful fade-out at end of reel
        var lOp = getProp(layer, "Opacity");
        lOp.setValueAtTime(0.0, 100);
        lOp.setValueAtTime(5.3, 100);
        lOp.setValueAtTime(5.8, 0);

        writeLn("Added Native 3D Vector Section [" + (i + 1) + "/13]: " + cfg.name + " (Init Z = " + cfg.initZ + ")");
    }

    // 10. Kinetic Typography: Company Name ("THE ART AND LORE STUDIO")
    var titleText = comp.layers.addText("THE ART AND LORE STUDIO");
    titleText.name = "Typography_Main_Title";
    titleText.startTime = 3.6;
    titleText.inPoint = 3.6;
    titleText.outPoint = 5.8;
    getProp(titleText, "Position").setValue([710, 935]);
    getProp(titleText, "Scale").setValue([42, 42]);

    var titleOp = getProp(titleText, "Opacity");
    titleOp.setValueAtTime(3.6, 0);
    titleOp.setValueAtTime(4.2, 100);
    titleOp.setValueAtTime(5.2, 100);
    titleOp.setValueAtTime(5.8, 0);
    applyEasyEase(titleOp, 1, 80.0, 0.0);
    applyEasyEase(titleOp, 2, 80.0, 0.0);

    // 11. Subtitle Typography ("CINEMATIC STORYTELLING & PROCEDURAL ART")
    var subText = comp.layers.addText("CINEMATIC STORYTELLING & PROCEDURAL ART");
    subText.name = "Typography_Subtitle";
    subText.startTime = 3.9;
    subText.inPoint = 3.9;
    subText.outPoint = 5.8;
    getProp(subText, "Position").setValue([725, 980]);
    getProp(subText, "Scale").setValue([16, 16]);

    var subOp = getProp(subText, "Opacity");
    subOp.setValueAtTime(3.9, 0);
    subOp.setValueAtTime(4.5, 80);
    subOp.setValueAtTime(5.2, 80);
    subOp.setValueAtTime(5.8, 0);
    applyEasyEase(subOp, 1, 80.0, 0.0);
    applyEasyEase(subOp, 2, 80.0, 0.0);

    // 12. Save Master EffectCraft Project
    app.project.save(new File(projectPath));
    writeLn("=== SUCCESS: Master Project Saved to " + projectPath + " ===");
})();
