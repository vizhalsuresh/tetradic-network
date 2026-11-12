/**
 * ORBIT BROADCAST NETWORK — 100% CODE-RENDERED 3D CINEMATOGRAPHY
 * Project: The Art and Lore Studio — Master 10-Second Cinematic 3D Reveal
 */

(function () {
    writeLn("=== Building Master 10-Second Cinematic 3D Galaxy Reveal (Perfect Framing) ===");

    var projectPath = "/home/revenant/Projects/video/out/cinematic_3d_reveal/art_and_lore_cinematic_3d_master.ecproj";
    var sectionsDir = "/home/revenant/Projects/video/out/cinematic_3d_reveal/sections/";
    var assetsDir = "/home/revenant/Projects/video/out/logo_animation/assets/";

    // 1. Create Master 3D Composition (1920x1080 @ 30 FPS, 10.0s = 300 frames)
    var comp = app.project.items.addComp("Art_And_Lore_Cinematic_3D_Master", 1920, 1080, 1.0, 10.0, 30);

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

    // 2. Obsidian Deep Void Background Solid (#060911)
    var bgSolid = comp.layers.addSolid([0.024, 0.035, 0.067], "BG_ObsidianDeep", 1920, 1080, 1.0, 10.0);
    bgSolid.startTime = 0.0;
    bgSolid.inPoint = 0.0;
    bgSolid.outPoint = 10.0;

    // 3. Ambient Milky Way Dust Atmosphere
    try {
        var dustFile = new File(assetsDir + "pass4_space_dust_10s.mp4");
        if (dustFile.exists) {
            var dustItem = app.project.importFile(new ImportOptions(dustFile));
            var dustLayer = comp.layers.add(dustItem);
            dustLayer.name = "Ambient_MilkyWay_Dust";
            dustLayer.blendingMode = BlendingMode.SCREEN;
            getProp(dustLayer, "Position").setValue([960, 540]);
            getProp(dustLayer, "Opacity").setValue(90);
        }
    } catch (e) {}

    // 4. Master 10-Second 48kHz Stereo Audio Score
    try {
        var audioFile = new File(assetsDir + "audio_score_10s.wav");
        if (audioFile.exists) {
            var audioItem = app.project.importFile(new ImportOptions(audioFile));
            var audioLayer = comp.layers.add(audioItem);
            audioLayer.name = "Audio_Score_Stereo";
            audioLayer.startTime = 0.0;
            audioLayer.outPoint = 10.0;
        }
    } catch (e) {}

    // 5. 3D Studio Cinematic Lighting Rig
    var keyLight = comp.layers.addLight("Key_Light", [960, 420]);
    getProp(keyLight, "Position").setValue([1800, 150, -1800]);
    getProp(keyLight, "Color").setValue([1.0, 1.0, 1.0, 1.0]);
    getProp(keyLight, "Intensity").setValue(125.0);

    var rimLight = comp.layers.addLight("Rim_Grazing_Light", [960, 420]);
    getProp(rimLight, "Position").setValue([3800, 380, 500]);
    getProp(rimLight, "Color").setValue([0.95, 0.98, 1.0, 1.0]);
    getProp(rimLight, "Intensity").setValue(140.0);

    var ambLight = comp.layers.addLight("Ambient_Fill", [960, 420]);
    getProp(ambLight, "Position").setValue([960, 450, -1000]);
    getProp(ambLight, "Color").setValue([0.90, 0.92, 0.98, 1.0]);
    getProp(ambLight, "Intensity").setValue(95.0);

    // 6. Master 3D Camera Choreography
    // Emblem center: [960, 360], Entire comp focal center: [960, 480]
    var cam = comp.layers.addCamera("Cinematic_Master_Camera", [960, 480]);
    cam.startTime = 0.0;
    cam.outPoint = 10.0;

    var camPOI = getProp(cam, "Point of Interest");
    camPOI.setValueAtTime(0.0, [960, 360, 200]);
    camPOI.setValueAtTime(3.6, [960, 360, 100]);
    camPOI.setValueAtTime(5.4, [960, 480, 0]);
    camPOI.setValueAtTime(10.0, [960, 480, 0]);
    applyEasyEase(camPOI, 1, 60.0, 0.0);
    applyEasyEase(camPOI, 2, 85.0, 0.0);
    applyEasyEase(camPOI, 3, 85.0, 0.0);
    applyEasyEase(camPOI, 4, 40.0, 0.0);

    var camPos = getProp(cam, "Position");
    // Trajectory:
    // t=0.0s: [3600, 350, 800]   -> Extreme side grazing view in the Milky Way
    // t=3.6s: [3100, 380, 300]   -> Slow glide along side axis
    // t=4.5s: [2000, 420, -1500] -> High-velocity orbital whip
    // t=5.4s: [960,  480, -2550] -> Lands in front, cushions into slow-mo
    // t=10.0s: [960, 480, -2500] -> Grand hero hold micro-push
    camPos.setValueAtTime(0.0, [3600, 350, 800]);
    camPos.setValueAtTime(3.6, [3100, 380, 300]);
    camPos.setValueAtTime(4.5, [2000, 420, -1500]);
    camPos.setValueAtTime(5.4, [960, 480, -2550]);
    camPos.setValueAtTime(10.0, [960, 480, -2500]);

    applyEasyEase(camPos, 1, 60.0, 0.0);
    applyEasyEase(camPos, 2, 85.0, 0.0);
    applyEasyEase(camPos, 3, 75.0, 0.0);
    applyEasyEase(camPos, 4, 90.0, 0.0);
    applyEasyEase(camPos, 5, 40.0, 0.0);

    // 7. Celestial 3D Orbital Write-On Rings
    var celestialRings = [
        { radius: 680,  stroke: 2.0, startT: 3.2, endT: 4.8, rotZ: 30 },
        { radius: 900,  stroke: 1.6, startT: 3.6, endT: 5.2, rotZ: -45 },
        { radius: 1150, stroke: 1.2, startT: 4.0, endT: 5.8, rotZ: 60 }
    ];

    for (var cIdx = 0; cIdx < celestialRings.length; cIdx++) {
        var cr = celestialRings[cIdx];
        var cLayer = comp.layers.addShape();
        cLayer.name = "Celestial_Ring_" + (cIdx + 1);
        cLayer.threeDLayer = true;
        cLayer.startTime = 0.0;
        cLayer.outPoint = 9.8;

        getProp(cLayer, "Position").setValue([960, 360, 0]);
        getProp(cLayer, "Rotation").setValue(cr.rotZ);

        var cContents = cLayer.property("Contents");
        var cGroup = cContents.addProperty("ADBE Vector Group");
        var cGroupContents = cGroup.property("Contents");

        var cEllipse = cGroupContents.addProperty("ADBE Vector Shape - Ellipse");
        cEllipse.property("Size").setValue([cr.radius, cr.radius]);

        var cStroke = cGroupContents.addProperty("ADBE Vector Graphic - Stroke");
        cStroke.property("Color").setValue([1.0, 1.0, 1.0, 0.75]);
        cStroke.property("Stroke Width").setValue(cr.stroke);

        var cTrim = cGroupContents.addProperty("ADBE Vector Filter - Trim");
        var cStart = cTrim.property("Start");
        var cEnd = cTrim.property("End");

        cStart.setValueAtTime(cr.startT + 0.35, 0);
        cStart.setValueAtTime(cr.endT, 100);
        applyEasyEase(cStart, 1, 80.0, 0.0);
        applyEasyEase(cStart, 2, 85.0, 0.0);

        cEnd.setValueAtTime(cr.startT, 0);
        cEnd.setValueAtTime(cr.endT - 0.25, 100);
        applyEasyEase(cEnd, 1, 80.0, 0.0);
        applyEasyEase(cEnd, 2, 85.0, 0.0);
    }

    // 8. 13 Pure White Native SVG 3D Emblem Layers
    // Scaled to 70% ([70, 70, 100]), centered at [960, 360, 0]
    // Suspended across 4,400px Z corridor (Z = -2000 to +2400)
    var sectionConfigs = [
        { file: "12_south_diamonds.svg", name: "Sec_12_South_Diamonds", customAnchor: false, initZ: 2400,  settleStart: 5.1, settleEnd: 7.3 },
        { file: "13_east_corners.svg",   name: "Sec_13_East_Corners",   customAnchor: false, initZ: 2000,  settleStart: 5.1, settleEnd: 7.3 },
        { file: "05_top_chambers.svg",   name: "Sec_05_Top_Chambers",   customAnchor: false, initZ: 1600,  settleStart: 5.2, settleEnd: 7.4 },
        { file: "11_east_waves.svg",     name: "Sec_11_East_Waves",     customAnchor: false, initZ: 1200,  settleStart: 5.2, settleEnd: 7.2 },
        { file: "09_southwest_leaf.svg", name: "Sec_09_Southwest_Leaf", customAnchor: false, initZ: 800,   settleStart: 5.3, settleEnd: 7.3 },
        { file: "08_west_star.svg",      name: "Sec_08_West_Star",      customAnchor: false, initZ: 400,   settleStart: 5.3, settleEnd: 7.2 },
        { file: "06_west_arc.svg",       name: "Sec_06_West_Arc",       customAnchor: false, initZ: 100,   settleStart: 5.4, settleEnd: 7.1 },
        { file: "10_southwest_pill.svg", name: "Sec_10_Southwest_Pill", customAnchor: false, initZ: -300,  settleStart: 5.4, settleEnd: 7.1 },
        { file: "07_west_diamonds.svg",  name: "Sec_07_West_Diamonds",  customAnchor: false, initZ: -600,  settleStart: 5.4, settleEnd: 7.1 },
        { file: "01_bird_body.svg",      name: "Sec_01_Bird_Body",      customAnchor: false, initZ: -1000, settleStart: 5.3, settleEnd: 7.3 },
        {
            file: "04_astrolabe_inner.svg",
            name: "Sec_04_Astrolabe_Inner",
            customAnchor: true,
            anchor: [486.5, 259.5, 0],
            restPos: [1063.5, 332.5, 0],
            initZ: -1400,
            initZRot: -270.0,
            settleStart: 5.1,
            settleEnd: 7.5
        },
        {
            file: "03_astrolabe_outer.svg",
            name: "Sec_03_Astrolabe_Outer",
            customAnchor: true,
            anchor: [486.5, 259.5, 0],
            restPos: [1063.5, 332.5, 0],
            initZ: -1700,
            initZRot: 360.0,
            settleStart: 5.1,
            settleEnd: 7.5
        },
        {
            file: "02_bird_eye.svg",
            name: "Sec_02_Bird_Eye", // 100% PURE WHITE monochrome eye
            customAnchor: true,
            anchor: [202, 265, 0],
            restPos: [779, 338, 0],
            initZ: -2000,
            settleStart: 5.4,
            settleEnd: 7.2
        }
    ];

    var emblemCenterY = 360;
    var emblemScale = 0.70;

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

        getProp(sLayer, "Scale").setValue([70, 70, 100]);

        // Rest position calculation scaled by 70% around center [960, 360]
        var rx = sc.customAnchor ? 960 + (sc.restPos[0] - 960) * emblemScale : 960;
        var ry = sc.customAnchor ? emblemCenterY + (sc.restPos[1] - 440) * emblemScale : emblemCenterY;
        var rPos = [rx, ry, 0];
        var iPos = [rx, ry, sc.initZ];

        if (sc.customAnchor) {
            getProp(sLayer, "Anchor Point").setValue(sc.anchor);
        }

        var slPos = getProp(sLayer, "Position");
        slPos.setValueAtTime(0.0, iPos);
        slPos.setValueAtTime(sc.settleStart, iPos);
        slPos.setValueAtTime(sc.settleEnd, rPos);

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

        var slOp = getProp(sLayer, "Opacity");
        slOp.setValueAtTime(0.0, 0);
        slOp.setValueAtTime(0.5, 95);
        slOp.setValueAtTime(9.2, 100);
        slOp.setValueAtTime(9.8, 0);
        applyEasyEase(slOp, 1, 75.0, 0.0);
        applyEasyEase(slOp, 2, 75.0, 0.0);

        writeLn("Added 3D Vector Emblem Layer [" + (i + 1) + "/13]: " + sc.name);
    }

    // 9. Kinetic Center-Justified Typography Below the Emblem
    // Title: "THE ART AND LORE"
    var titleLayer = comp.layers.addText("THE ART AND LORE");
    titleLayer.name = "Typo_Title";
    titleLayer.threeDLayer = true;
    titleLayer.startTime = 0.0;
    titleLayer.inPoint = 6.0;
    titleLayer.outPoint = 9.8;

    var tSt = titleLayer.property("Text").property("Source Text");
    var tTd = tSt.value;
    tTd.justification = ParagraphJustification.CENTER_JUSTIFY;
    tTd.fontSize = 44;
    tTd.tracking = 100;
    tSt.setValue(tTd);

    var tPos = getProp(titleLayer, "Position");
    tPos.setValueAtTime(6.0, [960, 775, 0]);
    tPos.setValueAtTime(7.2, [960, 735, 0]);
    applyEasyEase(tPos, 1, 75.0, 0.0);
    applyEasyEase(tPos, 2, 88.0, 0.0);

    var tOp = getProp(titleLayer, "Opacity");
    tOp.setValueAtTime(6.0, 0);
    tOp.setValueAtTime(7.0, 100);
    applyEasyEase(tOp, 1, 75.0, 0.0);
    applyEasyEase(tOp, 2, 75.0, 0.0);

    // Studio Text: "STUDIO"
    var studioLayer = comp.layers.addText("STUDIO");
    studioLayer.name = "Typo_Studio";
    studioLayer.threeDLayer = true;
    studioLayer.startTime = 0.0;
    studioLayer.inPoint = 6.4;
    studioLayer.outPoint = 9.8;

    var sSt = studioLayer.property("Text").property("Source Text");
    var sTd = sSt.value;
    sTd.justification = ParagraphJustification.CENTER_JUSTIFY;
    sTd.fontSize = 36;
    sTd.tracking = 240;
    sSt.setValue(sTd);

    var sPos = getProp(studioLayer, "Position");
    sPos.setValueAtTime(6.4, [960, 835, 0]);
    sPos.setValueAtTime(7.5, [960, 795, 0]);
    applyEasyEase(sPos, 1, 75.0, 0.0);
    applyEasyEase(sPos, 2, 88.0, 0.0);

    var sOp = getProp(studioLayer, "Opacity");
    sOp.setValueAtTime(6.4, 0);
    sOp.setValueAtTime(7.4, 100);
    applyEasyEase(sOp, 1, 75.0, 0.0);
    applyEasyEase(sOp, 2, 75.0, 0.0);

    // Accent Underline Shape Layer
    var underLayer = comp.layers.addShape();
    underLayer.name = "Typo_Underline";
    underLayer.threeDLayer = true;
    underLayer.startTime = 0.0;
    underLayer.inPoint = 6.8;
    underLayer.outPoint = 9.8;
    getProp(underLayer, "Position").setValue([960, 830, 0]);

    var uContents = underLayer.property("Contents");
    var uGroup = uContents.addProperty("ADBE Vector Group");
    var uGroupContents = uGroup.property("Contents");

    var uRect = uGroupContents.addProperty("ADBE Vector Shape - Rect");
    uRect.property("Size").setValue([480, 2]);

    var uStroke = uGroupContents.addProperty("ADBE Vector Graphic - Stroke");
    uStroke.property("Color").setValue([1.0, 1.0, 1.0, 0.85]);
    uStroke.property("Stroke Width").setValue(1.6);

    var uTrim = uGroupContents.addProperty("ADBE Vector Filter - Trim");
    var uStart = uTrim.property("Start");
    var uEnd = uTrim.property("End");

    uEnd.setValueAtTime(6.8, 0);
    uEnd.setValueAtTime(7.7, 100);
    applyEasyEase(uEnd, 1, 80.0, 0.0);
    applyEasyEase(uEnd, 2, 85.0, 0.0);

    // Subtitle: "CINEMATIC STORYTELLING & PROCEDURAL ART"
    var subLayer = comp.layers.addText("CINEMATIC STORYTELLING & PROCEDURAL ART");
    subLayer.name = "Typo_Subtitle";
    subLayer.threeDLayer = true;
    subLayer.startTime = 0.0;
    subLayer.inPoint = 7.3;
    subLayer.outPoint = 9.8;

    var subSt = subLayer.property("Text").property("Source Text");
    var subTd = subSt.value;
    subTd.justification = ParagraphJustification.CENTER_JUSTIFY;
    subTd.fontSize = 15;
    subTd.tracking = 160;
    subSt.setValue(subTd);

    getProp(subLayer, "Position").setValue([960, 858, 0]);

    var subOp = getProp(subLayer, "Opacity");
    subOp.setValueAtTime(7.3, 0);
    subOp.setValueAtTime(8.0, 85);
    applyEasyEase(subOp, 1, 80.0, 0.0);
    applyEasyEase(subOp, 2, 80.0, 0.0);

    // 10. Save Project
    app.project.save(new File(projectPath));
    writeLn("=== SUCCESS: Master 3D Project Saved to " + projectPath + " ===");
})();
