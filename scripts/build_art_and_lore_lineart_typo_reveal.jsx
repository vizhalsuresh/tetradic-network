/**
 * ORBIT BROADCAST NETWORK — 100% CODE-RENDERED 3D CINEMATOGRAPHY
 * Project: The Art and Lore Studio — Line-Art to Typo Master Reveal
 * Reference: Pinterest Tutorial by Aress (AE Trim Paths + Inertial Bounce Expression)
 * 
 * Directives:
 *   1. Pacing & Length: Expanded 10.0-second cinematic master composition.
 *   2. Pinterest Technique:
 *      - Shape layers with Trim Paths (Start & End) animated that sweep across the screen.
 *      - Words ("THE", "ART", "AND", "LORE", "STUDIO") drop and bounce into place
 *        using the exact After Effects inertial bounce decay expression.
 *   3. 3D Logo Integration:
 *      - Line-art streaks expand into 3D concentric celestial orbital rings.
 *      - Speed-ramp camera whip elevates and pulls back into 3D space.
 *      - 13 pure white geometric vector sections (with white eye) dock majestically into place.
 *   4. Monochromatic Purity: 100% pure white (#ffffff) linework on obsidian cosmic void. Zero blue eye.
 */

(function () {
    writeLn("=== Building 'The Art and Lore Studio' Line-Art to Typo Master Reveal (10.0s) ===");

    var projectPath = "/home/revenant/Projects/video/out/cinematic_3d_reveal/art_and_lore_lineart_typo.ecproj";
    var sectionsDir = "/home/revenant/Projects/video/out/cinematic_3d_reveal/sections/";
    var assetsDir = "/home/revenant/Projects/video/out/logo_animation/assets/";

    // 1. Create Master 3D Composition (1920x1080 @ 30 FPS, 10.0s = 300 frames)
    var comp = app.project.items.addComp("Art_And_Lore_LineArt_Typo_Reveal", 1920, 1080, 1.0, 10.0, 30);
    writeLn("Created Comp: " + comp.name + " (Duration: 10.0s)");

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
    var bgSolid = comp.layers.addSolid([0.024, 0.035, 0.067], "BG_ObsidianDeep", 1920, 1080, 1.0, 10.0);
    bgSolid.startTime = 0.0;
    bgSolid.inPoint = 0.0;
    bgSolid.outPoint = 10.0;

    // 3. Layer 2: 10-Second Cosmic Space Dust Atmosphere
    var spaceDustItem = app.project.importFile(new ImportOptions(new File(assetsDir + "pass4_space_dust_10s.mp4")));
    var dustLayer = comp.layers.add(spaceDustItem);
    dustLayer.name = "Ambient_MilkyWay_Dust";
    dustLayer.blendingMode = BlendingMode.SCREEN;
    getProp(dustLayer, "Position").setValue([960, 540]);
    getProp(dustLayer, "Opacity").setValue(80);

    // 4. Layer 3: 10-Second Synchronized 48kHz Stereo Audio Score
    var audioItem = app.project.importFile(new ImportOptions(new File(assetsDir + "audio_score_10s.wav")));
    var audioLayer = comp.layers.add(audioItem);
    audioLayer.name = "Audio_Score_Stereo";
    audioLayer.startTime = 0.0;
    audioLayer.outPoint = 10.0;

    // 5. 3D Studio Lighting Rig
    var keyLight = comp.layers.addLight("Key_Light", [960, 480]);
    getProp(keyLight, "Position").setValue([1600, 200, -1600]);
    getProp(keyLight, "Color").setValue([1.0, 1.0, 1.0, 1.0]);
    getProp(keyLight, "Intensity").setValue(115.0);

    var fillLight = comp.layers.addLight("Fill_Light", [960, 480]);
    getProp(fillLight, "Position").setValue([300, 650, -800]);
    getProp(fillLight, "Color").setValue([0.90, 0.94, 1.0, 1.0]);
    getProp(fillLight, "Intensity").setValue(80.0);

    var ambLight = comp.layers.addLight("Ambient_Fill", [960, 480]);
    getProp(ambLight, "Position").setValue([960, 480, -1000]);
    getProp(ambLight, "Color").setValue([0.88, 0.90, 0.98, 1.0]);
    getProp(ambLight, "Intensity").setValue(95.0);

    // 6. Layer 4: Cinematic 10-Second 3D Camera
    // Moves from typography close-up -> expansive speed-ramp 3D orbit -> majestic emblem lock
    var cam = comp.layers.addCamera("Cinematic_Master_Camera", [960, 540]);
    cam.startTime = 0.0;
    cam.outPoint = 10.0;

    var camPOI = getProp(cam, "Point of Interest");
    camPOI.setValueAtTime(0.0, [960, 540, 0]);  // Focused on typography in Act 1
    camPOI.setValueAtTime(4.0, [960, 540, 0]);
    camPOI.setValueAtTime(5.8, [960, 440, 0]);  // Shifts up to emblem center in Act 2/3
    camPOI.setValueAtTime(10.0, [960, 440, 0]);
    applyEasyEase(camPOI, 2, 85.0, 0.0);
    applyEasyEase(camPOI, 3, 85.0, 0.0);

    var camPos = getProp(cam, "Position");
    // Trajectory:
    // t=0.0s: [960, 540, -1800]  -> Typo focal view
    // t=3.6s: [960, 540, -1900]  -> Gentle slow drift as words complete bounce
    // t=4.4s: [3800, 480, -600]  -> Speed-ramp whip outward into extreme 3D oblique perspective
    // t=5.8s: [1800, 450, -2100] -> Orbital arc fanning open the 3D logo slices
    // t=7.5s: [960, 440, -2500]  -> Slow-motion deceleration & docking into hero view
    // t=10.0s: [960, 440, -2450] -> Grand micro-dolly hold
    camPos.setValueAtTime(0.0, [960, 540, -1800]);
    camPos.setValueAtTime(3.6, [960, 540, -1900]);
    camPos.setValueAtTime(4.4, [3800, 480, -600]);
    camPos.setValueAtTime(5.8, [1800, 450, -2100]);
    camPos.setValueAtTime(7.5, [960, 440, -2500]);
    camPos.setValueAtTime(10.0, [960, 440, -2450]);

    applyEasyEase(camPos, 1, 60.0, 0.0);
    applyEasyEase(camPos, 2, 85.0, 0.0);
    applyEasyEase(camPos, 3, 80.0, 0.0);
    applyEasyEase(camPos, 4, 85.0, 0.0);
    applyEasyEase(camPos, 5, 90.0, 0.0);
    applyEasyEase(camPos, 6, 50.0, 0.0);

    // 7. Pinterest Line-Art Trim-Paths Write-On Curves (Forming the Typography)
    // 4 Animated Stroke Trails that sweep across and trigger the word drop-ins
    var lineConfigs = [
        { name: "Line_01_Upper_Lead", radius: 520, stroke: 2.8, startT: 0.6, endT: 1.8, rotZ: 15, yOffset: -80 },
        { name: "Line_02_Main_Ribbon", radius: 780, stroke: 3.2, startT: 1.2, endT: 2.5, rotZ: -25, yOffset: 0 },
        { name: "Line_03_Lower_Sweep", radius: 640, stroke: 2.4, startT: 1.8, endT: 3.1, rotZ: 40, yOffset: 70 },
        { name: "Line_04_Accent_Ring", radius: 950, stroke: 1.8, startT: 2.4, endT: 3.8, rotZ: -50, yOffset: 30 }
    ];

    for (var l = 0; l < lineConfigs.length; l++) {
        var lc = lineConfigs[l];
        var sLayer = comp.layers.addShape();
        sLayer.name = lc.name;
        sLayer.threeDLayer = true;
        sLayer.startTime = 0.0;
        sLayer.outPoint = 9.8;

        getProp(sLayer, "Position").setValue([960, 540 + lc.yOffset, 0]);
        getProp(sLayer, "Rotation").setValue(lc.rotZ);

        var sContents = sLayer.property("Contents");
        var sGroup = sContents.addProperty("ADBE Vector Group");
        var sGroupContents = sGroup.property("Contents");

        var sEllipse = sGroupContents.addProperty("ADBE Vector Shape - Ellipse");
        sEllipse.property("Size").setValue([lc.radius, lc.radius * 0.65]);

        var sStroke = sGroupContents.addProperty("ADBE Vector Graphic - Stroke");
        sStroke.property("Color").setValue([1.0, 1.0, 1.0, 0.9]);
        sStroke.property("Stroke Width").setValue(lc.stroke);

        var sTrim = sGroupContents.addProperty("ADBE Vector Filter - Trim");
        var tStart = sTrim.property("Start");
        var tEnd = sTrim.property("End");

        tStart.setValueAtTime(lc.startT + 0.35, 0);
        tStart.setValueAtTime(lc.endT, 100);
        applyEasyEase(tStart, 1, 80.0, 0.0);
        applyEasyEase(tStart, 2, 85.0, 0.0);

        tEnd.setValueAtTime(lc.startT, 0);
        tEnd.setValueAtTime(lc.endT - 0.25, 100);
        applyEasyEase(tEnd, 1, 80.0, 0.0);
        applyEasyEase(tEnd, 2, 85.0, 0.0);

        writeLn("Created Pinterest Trim-Paths Line-Art Trail: " + lc.name);
    }

    // 8. Pinterest Inertial Bounce Decay Expression for Word Drop-Ins
    // Exact mathematical formula from the Aress tutorial (sec_56.png)
    var bounceExpr = 
        "amp = 0.04; freq = 2.2; decay = 5.0;\n" +
        "n = 0;\n" +
        "if (numKeys > 0) {\n" +
        "    n = nearestKey(time).index;\n" +
        "    if (key(n).time > time) { n--; }\n" +
        "}\n" +
        "if (n == 0) { t = 0; } else { t = time - key(n).time; }\n" +
        "if (n > 0) {\n" +
        "    v = velocityAtTime(key(n).time - thisComp.frameDuration / 10);\n" +
        "    value + v * amp * Math.sin(freq * t * 2 * Math.PI) / Math.exp(decay * t);\n" +
        "} else { value; }";

    // 9. Kinetic Typography Layers (Forming from the line sweeps)
    // Centered layout for "THE ART AND LORE STUDIO"
    // Words are revealed sequentially as each line sweep passes through
    var words = [
        { text: "THE", inT: 1.0, dropStart: 0.8, x: 740, y: 890, size: 36 },
        { text: "ART", inT: 1.6, dropStart: 1.4, x: 840, y: 890, size: 36 },
        { text: "AND", inT: 1.9, dropStart: 1.7, x: 940, y: 890, size: 36 },
        { text: "LORE", inT: 2.3, dropStart: 2.1, x: 1045, y: 890, size: 36 },
        { text: "STUDIO", inT: 2.7, dropStart: 2.5, x: 860, y: 945, size: 40 }
    ];

    for (var w = 0; w < words.length; w++) {
        var wd = words[w];
        var wLayer = comp.layers.addText(wd.text);
        wLayer.name = "Typo_Word_" + wd.text;
        wLayer.threeDLayer = true;
        wLayer.startTime = 0.0;
        wLayer.inPoint = wd.dropStart;
        wLayer.outPoint = 9.8;

        getProp(wLayer, "Scale").setValue([wd.size, wd.size]);

        var wPos = getProp(wLayer, "Position");
        // Drops from 60px above into target position with bounce
        wPos.setValueAtTime(wd.dropStart, [wd.x, wd.y - 65, 0]);
        wPos.setValueAtTime(wd.inT, [wd.x, wd.y, 0]);
        applyEasyEase(wPos, 1, 75.0, 0.0);
        applyEasyEase(wPos, 2, 85.0, 0.0);

        // Attach After Effects Inertial Bounce Decay Expression
        try {
            wPos.expression = bounceExpr;
            wPos.expressionEnabled = true;
        } catch (e) {}

        var wOp = getProp(wLayer, "Opacity");
        wOp.setValueAtTime(wd.dropStart, 0);
        wOp.setValueAtTime(wd.inT, 100);
        applyEasyEase(wOp, 1, 75.0, 0.0);
        applyEasyEase(wOp, 2, 75.0, 0.0);

        writeLn("Added Typo Word: '" + wd.text + "' with Pinterest Inertial Bounce at t=" + wd.inT + "s");
    }

    // 10. Subtitle Typography ("CINEMATIC STORYTELLING & PROCEDURAL ART")
    var subText = comp.layers.addText("CINEMATIC STORYTELLING & PROCEDURAL ART");
    subText.name = "Typo_Subtitle";
    subText.threeDLayer = true;
    subText.startTime = 0.0;
    subText.inPoint = 3.2;
    subText.outPoint = 9.8;
    getProp(subText, "Position").setValue([725, 995, 0]);
    getProp(subText, "Scale").setValue([16, 16]);

    var subOp = getProp(subText, "Opacity");
    subOp.setValueAtTime(3.2, 0);
    subOp.setValueAtTime(4.0, 85);
    applyEasyEase(subOp, 1, 80.0, 0.0);
    applyEasyEase(subOp, 2, 80.0, 0.0);

    // 11. Celestial 3D Orbital Write-On Arcs (Transition from typo to 3D space)
    var celestialRings = [
        { radius: 680, stroke: 2.2, startT: 3.8, endT: 5.2, rotZ: 30 },
        { radius: 880, stroke: 1.8, startT: 4.1, endT: 5.6, rotZ: -45 },
        { radius: 1100, stroke: 1.4, startT: 4.4, endT: 6.0, rotZ: 60 }
    ];

    for (var cIdx = 0; cIdx < celestialRings.length; cIdx++) {
        var cr = celestialRings[cIdx];
        var cLayer = comp.layers.addShape();
        cLayer.name = "Celestial_3D_Ring_" + (cIdx + 1);
        cLayer.threeDLayer = true;
        cLayer.startTime = 0.0;
        cLayer.outPoint = 9.8;

        getProp(cLayer, "Position").setValue([960, 440, 0]);
        getProp(cLayer, "Rotation").setValue(cr.rotZ);

        var cContents = cLayer.property("Contents");
        var cGroup = cContents.addProperty("ADBE Vector Group");
        var cGroupContents = cGroup.property("Contents");

        var cEllipse = cGroupContents.addProperty("ADBE Vector Shape - Ellipse");
        cEllipse.property("Size").setValue([cr.radius, cr.radius]);

        var cStroke = cGroupContents.addProperty("ADBE Vector Graphic - Stroke");
        cStroke.property("Color").setValue([1.0, 1.0, 1.0, 0.8]);
        cStroke.property("Stroke Width").setValue(cr.stroke);

        var cTrim = cGroupContents.addProperty("ADBE Vector Filter - Trim");
        var cStart = cTrim.property("Start");
        var cEnd = cTrim.property("End");

        cStart.setValueAtTime(cr.startT + 0.4, 0);
        cStart.setValueAtTime(cr.endT, 100);
        applyEasyEase(cStart, 1, 80.0, 0.0);
        applyEasyEase(cStart, 2, 85.0, 0.0);

        cEnd.setValueAtTime(cr.startT, 0);
        cEnd.setValueAtTime(cr.endT - 0.25, 100);
        applyEasyEase(cEnd, 1, 80.0, 0.0);
        applyEasyEase(cEnd, 2, 85.0, 0.0);

        writeLn("Created Celestial 3D Orbital Write-On Ring [" + (cIdx + 1) + "/3]");
    }

    // 12. 13 Pure White Native SVG 3D Emblem Layers
    // Emblem rests above typography at [960, 440, 0]
    // Suspended across 4,200px Z corridor (Z = -1800 to +2400)
    // Docks into place between 5.0s and 7.5s
    var sectionConfigs = [
        { file: "12_south_diamonds.svg", name: "Sec_12_South_Diamonds", customAnchor: false, initZ: 2400, settleStart: 5.0, settleEnd: 7.2 },
        { file: "13_east_corners.svg", name: "Sec_13_East_Corners", customAnchor: false, initZ: 2100, settleStart: 5.0, settleEnd: 7.2 },
        { file: "05_top_chambers.svg", name: "Sec_05_Top_Chambers", customAnchor: false, initZ: 1800, settleStart: 5.1, settleEnd: 7.3 },
        { file: "11_east_waves.svg", name: "Sec_11_East_Waves", customAnchor: false, initZ: 1500, settleStart: 5.1, settleEnd: 7.1 },
        { file: "09_southwest_leaf.svg", name: "Sec_09_Southwest_Leaf", customAnchor: false, initZ: 1200, settleStart: 5.2, settleEnd: 7.2 },
        { file: "08_west_star.svg", name: "Sec_08_West_Star", customAnchor: false, initZ: 900, settleStart: 5.2, settleEnd: 7.1 },
        { file: "06_west_arc.svg", name: "Sec_06_West_Arc", customAnchor: false, initZ: 600, settleStart: 5.3, settleEnd: 7.1 },
        { file: "10_southwest_pill.svg", name: "Sec_10_Southwest_Pill", customAnchor: false, initZ: 300, settleStart: 5.3, settleEnd: 7.0 },
        { file: "07_west_diamonds.svg", name: "Sec_07_West_Diamonds", customAnchor: false, initZ: -100, settleStart: 5.4, settleEnd: 7.0 },
        { file: "01_bird_body.svg", name: "Sec_01_Bird_Body", customAnchor: false, initZ: -500, settleStart: 5.2, settleEnd: 7.2 },
        {
            file: "04_astrolabe_inner.svg",
            name: "Sec_04_Astrolabe_Inner",
            customAnchor: true,
            anchor: [486.5, 259.5, 0],
            restPos: [1063.5, 332.5, 0],
            initZ: -900,
            initZRot: -240.0,
            settleStart: 5.0,
            settleEnd: 7.4
        },
        {
            file: "03_astrolabe_outer.svg",
            name: "Sec_03_Astrolabe_Outer",
            customAnchor: true,
            anchor: [486.5, 259.5, 0],
            restPos: [1063.5, 332.5, 0],
            initZ: -1400,
            initZRot: 360.0,
            settleStart: 5.0,
            settleEnd: 7.4
        },
        {
            file: "02_bird_eye.svg",
            name: "Sec_02_Bird_Eye", // PURE WHITE monochrome eye
            customAnchor: true,
            anchor: [202, 265, 0],
            restPos: [779, 338, 0],
            initZ: -1800,
            settleStart: 5.4,
            settleEnd: 7.1
        }
    ];

    for (var i = 0; i < sectionConfigs.length; i++) {
        var sc = sectionConfigs[i];
        var sItem = app.project.importFile(new ImportOptions(new File(sectionsDir + sc.file)));
        var sLayer = comp.layers.add(sItem);
        sLayer.name = sc.name;
        sLayer.collapseTransformation = true; // Infinite vector mathematical sharpness
        sLayer.threeDLayer = true;
        sLayer.blendingMode = BlendingMode.NORMAL;
        sLayer.startTime = 0.0;
        sLayer.outPoint = 9.8;

        var emblemRestPos = sc.customAnchor ? sc.restPos : [960, 440, 0];
        var emblemInitPos = sc.customAnchor ? 
            [sc.restPos[0], sc.restPos[1], sc.initZ] : 
            [960, 440, sc.initZ];

        if (sc.customAnchor) {
            getProp(sLayer, "Anchor Point").setValue(sc.anchor);
        }

        var slPos = getProp(sLayer, "Position");
        slPos.setValueAtTime(0.0, emblemInitPos);
        slPos.setValueAtTime(sc.settleStart, emblemInitPos);
        slPos.setValueAtTime(sc.settleEnd, emblemRestPos);

        // Cushioned slow-mo docking ease (88% influence)
        applyEasyEase(slPos, 2, 75.0, 0.0);
        applyEasyEase(slPos, 3, 88.0, 0.0);

        if (sc.initZRot) {
            var slZRot = getProp(sLayer, "Rotation");
            slZRot.setValueAtTime(0.0, sc.initZRot);
            slZRot.setValueAtTime(sc.settleStart, sc.initZRot);
            slZRot.setValueAtTime(sc.settleEnd, 0.0);
            applyEasyEase(slZRot, 2, 75.0, 0.0);
            applyEasyEase(slZRot, 3, 88.0, 0.0);
        }

        // Fade in as the 3D transition begins
        var slOp = getProp(sLayer, "Opacity");
        slOp.setValueAtTime(0.0, 0);
        slOp.setValueAtTime(4.2, 0);
        slOp.setValueAtTime(5.0, 100);
        slOp.setValueAtTime(9.2, 100);
        slOp.setValueAtTime(9.8, 0);

        writeLn("Added 3D Vector Emblem Layer [" + (i + 1) + "/13]: " + sc.name);
    }

    // 13. Save Project
    app.project.save(new File(projectPath));
    writeLn("=== SUCCESS: Master Project Saved to " + projectPath + " ===");
})();
