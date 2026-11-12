// ORBIT Broadcast Network - EffectCraft Master Logo Animation Builder
// Composition: Logo_Animation_Master (1920x1080 @ 30 FPS, 6.0s)
// High-End Broadcast Packaging & Celestial Astrolabe Motion Design

(function() {
    writeLn("=== Building Celestial Astrolabe Logo Animation in EffectCraft ===");

    var projectPath = "/home/revenant/Projects/video/out/logo_animation/logo_animation.ecproj";
    var assetsDir = "/home/revenant/Projects/video/out/logo_animation/assets/";

    // 1. Create Master Composition (1920x1080, 1.0 PAR, 6.0s duration, 30fps)
    var comp = app.project.items.addComp("Logo_Animation_Master", 1920, 1080, 1.0, 6.0, 30.0);

    // 2. Import Assets
    var pass1File = new File(assetsDir + "pass1_stroke_write_on.mp4");
    var pass2File = new File(assetsDir + "pass2_wheel_spin.mp4");
    var pass3File = new File(assetsDir + "pass3_eye_ignite.mp4");
    var pass4File = new File(assetsDir + "pass4_space_dust.mp4");
    var audioFile = new File(assetsDir + "logo_audio_score.wav");

    var pass1Item = app.project.importFile(new ImportOptions(pass1File));
    var pass2Item = app.project.importFile(new ImportOptions(pass2File));
    var pass3Item = app.project.importFile(new ImportOptions(pass3File));
    var pass4Item = app.project.importFile(new ImportOptions(pass4File));
    var audioItem = app.project.importFile(new ImportOptions(audioFile));

    function getProp(layer, name) {
        return layer.property("Transform").property(name);
    }

    // 3. Layer 1 (Base): Deep Obsidian Slate Solid (Sanzo Wada #253 [0.024, 0.035, 0.055])
    var bgSolid = comp.layers.addSolid([0.024, 0.035, 0.055], "BG_ObsidianDeep", 1920, 1080, 1.0, 6.0);

    // 4. Layer 2: Ambient Particle Dust & Sacred Coordinate Grid
    var dustLayer = comp.layers.add(pass4Item);
    dustLayer.name = "Ambient_Space_Dust_Grid";
    dustLayer.startTime = 0.0;
    dustLayer.inPoint = 0.0;
    dustLayer.outPoint = 6.0;
    dustLayer.blendingMode = BlendingMode.SCREEN;
    getProp(dustLayer, "Position").setValue([960, 540]);

    var dustOpacity = getProp(dustLayer, "Opacity");
    dustOpacity.setValueAtTime(0.0, 0);
    dustOpacity.setValueAtTime(0.8, 85);
    dustOpacity.setValueAtTime(5.3, 85);
    dustOpacity.setValueAtTime(6.0, 0);

    // 5. Layer 3: Audio Soundtrack
    var audioLayer = comp.layers.add(audioItem);
    audioLayer.name = "Audio_Score_Stereo";
    audioLayer.startTime = 0.0;
    audioLayer.outPoint = 6.0;

    // 6. Layer 4: Procedural Stroke Write-On (Main Line Construction)
    var writeLayer = comp.layers.add(pass1Item);
    writeLayer.name = "Logo_Stroke_WriteOn";
    writeLayer.startTime = 0.0;
    writeLayer.inPoint = 0.0;
    writeLayer.outPoint = 5.8;
    writeLayer.blendingMode = BlendingMode.SCREEN;
    getProp(writeLayer, "Position").setValue([960, 540]);

    var writeScale = getProp(writeLayer, "Scale");
    writeScale.setValueAtTime(0.0, [97, 97]);
    writeScale.setValueAtTime(3.0, [100, 100]);
    writeScale.setValueAtTime(5.8, [102.5, 102.5]);

    var writeOpacity = getProp(writeLayer, "Opacity");
    writeOpacity.setValueAtTime(0.0, 0);
    writeOpacity.setValueAtTime(0.2, 100);
    writeOpacity.setValueAtTime(5.3, 100);
    writeOpacity.setValueAtTime(5.8, 0);

    // 7. Layer 5: Astrolabe Mechanical Wheel Spin (Counter-Rotation & Alignment)
    var wheelLayer = comp.layers.add(pass2Item);
    wheelLayer.name = "Astrolabe_Mechanical_Wheel";
    wheelLayer.startTime = 0.0;
    wheelLayer.inPoint = 0.6;
    wheelLayer.outPoint = 3.8;
    wheelLayer.blendingMode = BlendingMode.ADD;
    getProp(wheelLayer, "Position").setValue([960, 540]);

    var wheelScale = getProp(wheelLayer, "Scale");
    wheelScale.setValueAtTime(0.6, [98, 98]);
    wheelScale.setValueAtTime(3.8, [100.5, 100.5]);

    var wheelOpacity = getProp(wheelLayer, "Opacity");
    wheelOpacity.setValueAtTime(0.6, 0);
    wheelOpacity.setValueAtTime(1.0, 90);
    wheelOpacity.setValueAtTime(3.2, 90);
    wheelOpacity.setValueAtTime(3.8, 0);

    // 8. Layer 6: Bird Eye Anamorphic Glint & Ignite Pulse
    var eyeLayer = comp.layers.add(pass3Item);
    eyeLayer.name = "Bird_Eye_Anamorphic_Glint";
    eyeLayer.startTime = 0.0;
    eyeLayer.inPoint = 2.15;
    eyeLayer.outPoint = 5.8;
    eyeLayer.blendingMode = BlendingMode.ADD;
    getProp(eyeLayer, "Position").setValue([960, 540]);

    var eyeScale = getProp(eyeLayer, "Scale");
    eyeScale.setValueAtTime(2.15, [99.5, 99.5]);
    eyeScale.setValueAtTime(5.8, [102.5, 102.5]);

    var eyeOpacity = getProp(eyeLayer, "Opacity");
    eyeOpacity.setValueAtTime(2.15, 0);
    eyeOpacity.setValueAtTime(2.25, 100);
    eyeOpacity.setValueAtTime(5.3, 100);
    eyeOpacity.setValueAtTime(5.8, 0);

    // 9. Layer 7: Golden Optical Light Sweep Pass (Active t = 3.2s to 4.8s)
    var sweepLayer = comp.layers.add(pass1Item);
    sweepLayer.name = "Logo_CC_Light_Sweep_Pass";
    sweepLayer.startTime = 0.0;
    sweepLayer.inPoint = 3.2;
    sweepLayer.outPoint = 4.8;
    sweepLayer.blendingMode = BlendingMode.ADD;
    getProp(sweepLayer, "Position").setValue([960, 540]);

    var sweepScale = getProp(sweepLayer, "Scale");
    sweepScale.setValueAtTime(3.2, [100.2, 100.2]);
    sweepScale.setValueAtTime(4.8, [101.5, 101.5]);

    var sweepOpacity = getProp(sweepLayer, "Opacity");
    sweepOpacity.setValueAtTime(3.2, 0);
    sweepOpacity.setValueAtTime(3.5, 90);
    sweepOpacity.setValueAtTime(4.4, 90);
    sweepOpacity.setValueAtTime(4.75, 0);

    // Apply Native EffectCraft Effects to sweepLayer
    var lightSweep = sweepLayer.property("Effects").addProperty("CC Light Sweep");
    lightSweep.property("Direction").setValue(-45.0);
    lightSweep.property("Width").setValue(70.0);
    lightSweep.property("Sweep Intensity").setValue(75.0);
    lightSweep.property("Edge Intensity").setValue(125.0);
    lightSweep.property("Light Color").setValue([1.0, 0.88, 0.55, 1.0]); // Warm champagne gold
    
    // Animate Sweep Center diagonally across screen from top-left completely off bottom-right
    var sweepCenter = lightSweep.property("Center");
    sweepCenter.setValueAtTime(3.2, [-0.25, -0.15]);
    sweepCenter.setValueAtTime(4.5, [1.35, 1.25]);

    var sweepIntensity = lightSweep.property("Sweep Intensity");
    sweepIntensity.setValueAtTime(3.2, 75.0);
    sweepIntensity.setValueAtTime(4.3, 75.0);
    sweepIntensity.setValueAtTime(4.65, 0.0);

    // Add Native Glow Effect to sweepLayer for radiant bloom
    var glow = sweepLayer.property("Effects").addProperty("Glow");
    glow.property("Glow Threshold").setValue(45.0);
    glow.property("Glow Radius").setValue(25.0);
    glow.property("Glow Intensity").setValue(1.3);

    // 10. Layer 8: Impact Flash Solid (Sanzo Wada #253 Radiant Gold)
    var flashSolid = comp.layers.addSolid([0.98, 0.85, 0.45], "Eye_Impact_Flash", 1920, 1080, 1.0, 6.0);
    flashSolid.startTime = 2.15;
    flashSolid.inPoint = 2.15;
    flashSolid.outPoint = 2.50;
    flashSolid.blendingMode = BlendingMode.ADD;

    var flashOpacity = getProp(flashSolid, "Opacity");
    flashOpacity.setValueAtTime(2.15, 0);
    flashOpacity.setValueAtTime(2.20, 25);
    flashOpacity.setValueAtTime(2.45, 0);

    // 11. Layer 9: Main Typography Title ("A S T R O L A B E")
    var titleText = comp.layers.addText("A S T R O L A B E");
    titleText.name = "Typography_Main_Title";
    titleText.startTime = 2.7;
    titleText.inPoint = 2.7;
    titleText.outPoint = 5.8;
    getProp(titleText, "Position").setValue([730, 930]);
    getProp(titleText, "Scale").setValue([48, 48]);

    var titleOpacity = getProp(titleText, "Opacity");
    titleOpacity.setValueAtTime(2.7, 0);
    titleOpacity.setValueAtTime(3.4, 100);
    titleOpacity.setValueAtTime(5.2, 100);
    titleOpacity.setValueAtTime(5.8, 0);

    // 12. Layer 10: Subtitle / Identity Telemetry
    var subtitleText = comp.layers.addText("CELESTIAL CHRONOMETER  //  ORBIT BROADCAST NETWORK");
    subtitleText.name = "Typography_Subtitle";
    subtitleText.startTime = 2.9;
    subtitleText.inPoint = 2.9;
    subtitleText.outPoint = 5.7;
    getProp(subtitleText, "Position").setValue([670, 975]);
    getProp(subtitleText, "Scale").setValue([22, 22]);

    var subOpacity = getProp(subtitleText, "Opacity");
    subOpacity.setValueAtTime(2.9, 0);
    subOpacity.setValueAtTime(3.6, 85);
    subOpacity.setValueAtTime(5.2, 85);
    subOpacity.setValueAtTime(5.7, 0);

    // 13. Layer 11: Top Telemetry Header
    var headerText = comp.layers.addText("// LOGO ID: ASTROLABE-01 // RADIAL GEOMETRY // 100% CODE RENDERED");
    headerText.name = "Typography_Header_Telemetry";
    headerText.startTime = 0.4;
    headerText.inPoint = 0.4;
    headerText.outPoint = 5.8;
    getProp(headerText, "Position").setValue([620, 75]);
    getProp(headerText, "Scale").setValue([22, 22]);

    var headerOpacity = getProp(headerText, "Opacity");
    headerOpacity.setValueAtTime(0.4, 0);
    headerOpacity.setValueAtTime(1.0, 70);
    headerOpacity.setValueAtTime(5.2, 70);
    headerOpacity.setValueAtTime(5.8, 0);

    // 14. Save Project File
    app.project.save(new File(projectPath));
    writeLn("=== Successfully Built and Saved EffectCraft Project to: " + projectPath + " ===");
})();
