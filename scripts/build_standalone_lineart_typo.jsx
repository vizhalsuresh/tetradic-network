/**
 * ORBIT BROADCAST NETWORK
 * Project: The Art and Lore Studio — Standalone Kinetic Line-Art Typography Reveal
 * Reference: Pinterest Tutorial by Aress (AE Trim Paths + Inertial Bounce Expression)
 */

(function () {
    writeLn("=== Building Refined Standalone Line-Art Typography Reveal (7.5s) ===");

    var projectPath = "/home/revenant/Projects/video/out/cinematic_3d_reveal/art_and_lore_lineart_typo_standalone.ecproj";
    var assetsDir = "/home/revenant/Projects/video/out/logo_animation/assets/";

    // 1. Create Composition (1920x1080 @ 30 FPS, 7.5s = 225 frames)
    var comp = app.project.items.addComp("Art_And_Lore_Typo_LineArt_Standalone", 1920, 1080, 1.0, 7.5, 30);

    function getProp(layer, name) {
        var p = layer.property(name);
        if (p) return p;
        var t = layer.property("Transform");
        if (t) {
            p = t.property(name);
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
    }

    // 2. Obsidian Deep Void Background Solid (#060911)
    var bgSolid = comp.layers.addSolid([0.024, 0.035, 0.067], "BG_ObsidianDeep", 1920, 1080, 1.0, 7.5);
    bgSolid.startTime = 0.0;
    bgSolid.inPoint = 0.0;
    bgSolid.outPoint = 7.5;

    // 3. Ambient Dust Overlay
    try {
        var dustFile = new File(assetsDir + "pass4_space_dust_10s.mp4");
        if (dustFile.exists) {
            var dustItem = app.project.importFile(new ImportOptions(dustFile));
            var dustLayer = comp.layers.add(dustItem);
            dustLayer.name = "Ambient_Dust";
            dustLayer.blendingMode = BlendingMode.SCREEN;
            getProp(dustLayer, "Position").setValue([960, 540]);
            getProp(dustLayer, "Opacity").setValue(65);
        }
    } catch (e) {}

    // 4. Stereo Audio Score
    try {
        var audioFile = new File(assetsDir + "audio_score_10s.wav");
        if (audioFile.exists) {
            var audioItem = app.project.importFile(new ImportOptions(audioFile));
            var audioLayer = comp.layers.add(audioItem);
            audioLayer.name = "Audio_Score";
            audioLayer.startTime = 0.0;
            audioLayer.outPoint = 7.5;
        }
    } catch (e) {}

    // 5. Pinterest Inertial Bounce Decay Expression
    var bounceExpr = 
        "amp = 0.045; freq = 2.4; decay = 5.2;\n" +
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

    // 6. Typographic Layout Configuration with Exact Centering
    var words = [
        { text: "THE",    centerX: 734,  y: 490, fontSize: 52, tracking: 80,  dropT: 0.7, inT: 1.05, arcRadius: 360, arcRot: 30 },
        { text: "ART",    centerX: 868,  y: 490, fontSize: 52, tracking: 80,  dropT: 1.3, inT: 1.65, arcRadius: 420, arcRot: -40 },
        { text: "AND",    centerX: 1007, y: 490, fontSize: 52, tracking: 80,  dropT: 1.9, inT: 2.25, arcRadius: 390, arcRot: 45 },
        { text: "LORE",   centerX: 1165, y: 490, fontSize: 52, tracking: 80,  dropT: 2.5, inT: 2.85, arcRadius: 450, arcRot: -25 },
        { text: "STUDIO", centerX: 960,  y: 575, fontSize: 44, tracking: 220, dropT: 3.2, inT: 3.60, arcRadius: 720, arcRot: 0 }
    ];

    // Build paired Shape Layer Line Trails & Center-Justified Word Typography
    for (var i = 0; i < words.length; i++) {
        var w = words[i];

        // --- A. Paired Sweeping Line Trail ---
        var sLayer = comp.layers.addShape();
        sLayer.name = "Trail_Line_" + w.text;
        sLayer.startTime = 0.0;
        sLayer.outPoint = 7.5;

        getProp(sLayer, "Position").setValue([w.centerX, w.y]);
        getProp(sLayer, "Rotation").setValue(w.arcRot);

        var sContents = sLayer.property("Contents");
        var sGroup = sContents.addProperty("ADBE Vector Group");
        var sGroupContents = sGroup.property("Contents");

        var sEllipse = sGroupContents.addProperty("ADBE Vector Shape - Ellipse");
        sEllipse.property("Size").setValue([w.arcRadius, w.arcRadius * 0.58]);

        var sStroke = sGroupContents.addProperty("ADBE Vector Graphic - Stroke");
        sStroke.property("Color").setValue([1.0, 1.0, 1.0, 0.95]);
        sStroke.property("Stroke Width").setValue(3.0);

        var sTrim = sGroupContents.addProperty("ADBE Vector Filter - Trim");
        var tStart = sTrim.property("Start");
        var tEnd = sTrim.property("End");

        var trailStartT = w.dropT - 0.45;
        var trailEndT = w.inT + 0.15;

        // End property animates 0% -> 100% (drawing stroke)
        tEnd.setValueAtTime(trailStartT, 0);
        tEnd.setValueAtTime(w.inT, 100);
        applyEasyEase(tEnd, 1, 80.0, 0.0);
        applyEasyEase(tEnd, 2, 85.0, 0.0);

        // Start property animates 0% -> 100% (trimming off the tail)
        tStart.setValueAtTime(trailStartT + 0.32, 0);
        tStart.setValueAtTime(trailEndT, 100);
        applyEasyEase(tStart, 1, 80.0, 0.0);
        applyEasyEase(tStart, 2, 85.0, 0.0);

        // --- B. Center-Justified Word Typography Layer ---
        var tLayer = comp.layers.addText(w.text);
        tLayer.name = "Word_" + w.text;
        tLayer.startTime = 0.0;
        tLayer.inPoint = w.dropT;
        tLayer.outPoint = 7.5;

        var st = tLayer.property("Text").property("Source Text");
        var td = st.value;
        td.justification = ParagraphJustification.CENTER_JUSTIFY;
        td.fontSize = w.fontSize;
        td.tracking = w.tracking;
        st.setValue(td);

        var tPos = getProp(tLayer, "Position");
        // Drops down 65px with spring-like snap
        tPos.setValueAtTime(w.dropT, [w.centerX, w.y - 65]);
        tPos.setValueAtTime(w.inT, [w.centerX, w.y]);
        applyEasyEase(tPos, 1, 75.0, 0.0);
        applyEasyEase(tPos, 2, 88.0, 0.0);

        // Attach inertial bounce expression
        try {
            tPos.expression = bounceExpr;
            tPos.expressionEnabled = true;
        } catch (e) {}

        var tRot = getProp(tLayer, "Rotation");
        var rotInit = (i % 2 === 0) ? -12 : 12;
        tRot.setValueAtTime(w.dropT, rotInit);
        tRot.setValueAtTime(w.inT, 0);
        applyEasyEase(tRot, 1, 75.0, 0.0);
        applyEasyEase(tRot, 2, 85.0, 0.0);

        var tOp = getProp(tLayer, "Opacity");
        tOp.setValueAtTime(w.dropT, 0);
        tOp.setValueAtTime(w.inT, 100);
        applyEasyEase(tOp, 1, 75.0, 0.0);
        applyEasyEase(tOp, 2, 80.0, 0.0);

        writeLn("Added Word '" + w.text + "' at Center X=" + w.centerX + ", Y=" + w.y);
    }

    // 7. Elegant Decorative Underline Write-On (Centered at 960)
    var underlineLayer = comp.layers.addShape();
    underlineLayer.name = "Accent_Underline";
    underlineLayer.startTime = 0.0;
    underlineLayer.outPoint = 7.5;
    getProp(underlineLayer, "Position").setValue([960, 620]);

    var uContents = underlineLayer.property("Contents");
    var uGroup = uContents.addProperty("ADBE Vector Group");
    var uGroupContents = uGroup.property("Contents");

    var uRect = uGroupContents.addProperty("ADBE Vector Shape - Rect");
    uRect.property("Size").setValue([560, 2]);

    var uStroke = uGroupContents.addProperty("ADBE Vector Graphic - Stroke");
    uStroke.property("Color").setValue([1.0, 1.0, 1.0, 0.85]);
    uStroke.property("Stroke Width").setValue(1.8);

    var uTrim = uGroupContents.addProperty("ADBE Vector Filter - Trim");
    var uStart = uTrim.property("Start");
    var uEnd = uTrim.property("End");

    uEnd.setValueAtTime(3.6, 0);
    uEnd.setValueAtTime(4.4, 100);
    applyEasyEase(uEnd, 1, 80.0, 0.0);
    applyEasyEase(uEnd, 2, 85.0, 0.0);

    // 8. Subtle Subtitle "CINEMATIC STORYTELLING & PROCEDURAL ART" (Centered at 960)
    var subLayer = comp.layers.addText("CINEMATIC STORYTELLING & PROCEDURAL ART");
    subLayer.name = "Subtitle";
    subLayer.startTime = 0.0;
    subLayer.inPoint = 4.2;
    subLayer.outPoint = 7.5;

    var subSt = subLayer.property("Text").property("Source Text");
    var subTd = subSt.value;
    subTd.justification = ParagraphJustification.CENTER_JUSTIFY;
    subTd.fontSize = 18;
    subTd.tracking = 160;
    subSt.setValue(subTd);

    getProp(subLayer, "Position").setValue([960, 655]);

    var subOp = getProp(subLayer, "Opacity");
    subOp.setValueAtTime(4.2, 0);
    subOp.setValueAtTime(5.0, 85);
    applyEasyEase(subOp, 1, 80.0, 0.0);
    applyEasyEase(subOp, 2, 80.0, 0.0);

    // 9. Save Standalone Typography Project
    app.project.save(new File(projectPath));
    writeLn("=== SUCCESS: Saved Standalone Typo Project to " + projectPath + " ===");
})();
