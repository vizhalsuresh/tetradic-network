// ORBIT Broadcast Network - EffectCraft Master Composition Builder
// Episode/Ident: ORBIT-IDENT-01 (6.0s @ 30 FPS, 1920x1080)
// High-End Broadcast Packaging & Telemetry Layout

(function() {
    writeLn("=== Building ORBIT Master Broadcast Ident in EffectCraft ===");

    var projectPath = "/home/revenant/Projects/video/out/effectcraft_test/orbit_ident.ecproj";
    var assetsDir = "/home/revenant/Projects/video/out/effectcraft_test/assets/";

    // 1. Create Master Composition (1920x1080, 1.0 PAR, 6.0s duration, 30fps)
    var comp = app.project.items.addComp("ORBIT_Station_Ident", 1920, 1080, 1.0, 6.0, 30.0);

    // 2. Import Assets
    var bumperFile = new File(assetsDir + "remotion_station_bumper.mp4");
    var blenderFile = new File(assetsDir + "blender_orbit_wireframe.mp4");
    var anidoodleFile = new File(assetsDir + "anidoodle_blueprint.mp4");
    var audioFile = new File(assetsDir + "orbit_ident_audio.wav");

    var bumperItem = app.project.importFile(new ImportOptions(bumperFile));
    var blenderItem = app.project.importFile(new ImportOptions(blenderFile));
    var anidoodleItem = app.project.importFile(new ImportOptions(anidoodleFile));
    var audioItem = app.project.importFile(new ImportOptions(audioFile));

    function getProp(layer, name) {
        return layer.property("Transform").property(name);
    }

    // 3. Layer 1 (Base): Deep Background Solid (Sanzo Wada #253 Slate Blue [0.06, 0.08, 0.10])
    var bgSolid = comp.layers.addSolid([0.06, 0.08, 0.10], "BG_SlateDark", 1920, 1080, 1.0, 6.0);

    // 4. Layer 2: Audio Soundtrack
    var audioLayer = comp.layers.add(audioItem);
    audioLayer.name = "Audio_Score_Stereo";
    audioLayer.startTime = 0.0;
    audioLayer.outPoint = 6.0;

    // 5. Layer 3: Blender 3D Procedural Orbit Wireframe (Add blend mode, centered)
    var wireLayer = comp.layers.add(blenderItem);
    wireLayer.name = "Blender_3D_Orbit_Wireframe";
    wireLayer.startTime = 0.0;
    wireLayer.inPoint = 0.0;
    wireLayer.outPoint = 6.0;
    wireLayer.blendingMode = BlendingMode.ADD;
    getProp(wireLayer, "Position").setValue([960, 540]);

    var wireScale = getProp(wireLayer, "Scale");
    wireScale.setValueAtTime(0.0, [75, 75]);
    wireScale.setValueAtTime(2.0, [105, 105]);
    wireScale.setValueAtTime(6.0, [118, 118]);

    var wireOpacity = getProp(wireLayer, "Opacity");
    wireOpacity.setValueAtTime(0.0, 0);
    wireOpacity.setValueAtTime(0.4, 90);
    wireOpacity.setValueAtTime(5.2, 90);
    wireOpacity.setValueAtTime(6.0, 0);

    // 6. Layer 4: Anidoodle Technical Blueprint PiP (Left Telemetry Monitor)
    var aniLayer = comp.layers.add(anidoodleItem);
    aniLayer.name = "Anidoodle_Schematic_PiP";
    aniLayer.startTime = 0.2;
    aniLayer.inPoint = 0.2;
    aniLayer.outPoint = 4.8;
    aniLayer.blendingMode = BlendingMode.SCREEN;
    getProp(aniLayer, "Position").setValue([300, 540]);
    getProp(aniLayer, "Scale").setValue([70, 70]);
    
    var aniOpacity = getProp(aniLayer, "Opacity");
    aniOpacity.setValueAtTime(0.2, 0);
    aniOpacity.setValueAtTime(0.6, 70);
    aniOpacity.setValueAtTime(4.2, 70);
    aniOpacity.setValueAtTime(4.8, 0);

    // 7. Layer 5: Remotion Station Bumper Plate (Centered Master Ident)
    var bumperLayer = comp.layers.add(bumperItem);
    bumperLayer.name = "Remotion_Station_Bumper";
    bumperLayer.startTime = 1.4;
    bumperLayer.inPoint = 1.4;
    bumperLayer.outPoint = 5.2;
    bumperLayer.blendingMode = BlendingMode.SCREEN;
    getProp(bumperLayer, "Position").setValue([960, 540]);

    var bumperOpacity = getProp(bumperLayer, "Opacity");
    bumperOpacity.setValueAtTime(1.4, 0);
    bumperOpacity.setValueAtTime(1.8, 100);
    bumperOpacity.setValueAtTime(4.8, 100);
    bumperOpacity.setValueAtTime(5.2, 0);

    // 8. Layer 6: Impact Flash (Sanzo Wada Lemon Yellow)
    var flashSolid = comp.layers.addSolid([0.97, 0.93, 0.26], "Impact_Flash_Yellow", 1920, 1080, 1.0, 6.0);
    flashSolid.startTime = 1.95;
    flashSolid.inPoint = 1.95;
    flashSolid.outPoint = 2.4;
    flashSolid.blendingMode = BlendingMode.ADD;

    var flashOpacity = getProp(flashSolid, "Opacity");
    flashOpacity.setValueAtTime(1.95, 0);
    flashOpacity.setValueAtTime(2.0, 30);
    flashOpacity.setValueAtTime(2.3, 0);

    // 9. Layer 7: Telemetry Top Left Bar
    var telemetryText = comp.layers.addText("// SYS.ID: ORBIT-IDENT-01 // LAT: 37.7749° N // LON: 122.4194° W // RES: 1080P");
    telemetryText.name = "HUD_Top_Left";
    telemetryText.startTime = 0.2;
    telemetryText.inPoint = 0.2;
    telemetryText.outPoint = 5.8;
    getProp(telemetryText, "Position").setValue([170, 75]);
    getProp(telemetryText, "Scale").setValue([34, 34]);
    var telemOpacity = getProp(telemetryText, "Opacity");
    telemOpacity.setValueAtTime(0.2, 0);
    telemOpacity.setValueAtTime(0.6, 80);
    telemOpacity.setValueAtTime(5.2, 80);
    telemOpacity.setValueAtTime(5.8, 0);

    // 10. Layer 8: Top Right Broadcast Status & Channel
    var chanText = comp.layers.addText("CH-01 // BROADCAST LIVE [●]");
    chanText.name = "HUD_Top_Right";
    chanText.startTime = 0.3;
    chanText.inPoint = 0.3;
    chanText.outPoint = 5.8;
    getProp(chanText, "Position").setValue([1480, 75]);
    getProp(chanText, "Scale").setValue([34, 34]);
    var chanOpacity = getProp(chanText, "Opacity");
    chanOpacity.setValueAtTime(0.3, 0);
    chanOpacity.setValueAtTime(0.7, 90);
    chanOpacity.setValueAtTime(5.2, 90);
    chanOpacity.setValueAtTime(5.8, 0);

    // 11. Layer 9: Right Telemetry Data Block
    var rightDataText = comp.layers.addText("VFX ENGINE: EFFECTCRAFT 0.4.0\nFRAMEWORK: REMOTION 4.0\nCORE: REACT 19 + BLENDER 4.2\nCOLOR: SANZO WADA #253\nFPS: 30.00 DETERMINISTIC");
    rightDataText.name = "HUD_Right_DataBlock";
    rightDataText.startTime = 0.5;
    rightDataText.inPoint = 0.5;
    rightDataText.outPoint = 5.6;
    getProp(rightDataText, "Position").setValue([1520, 480]);
    getProp(rightDataText, "Scale").setValue([28, 28]);
    var rightDataOpacity = getProp(rightDataText, "Opacity");
    rightDataOpacity.setValueAtTime(0.5, 0);
    rightDataOpacity.setValueAtTime(0.9, 75);
    rightDataOpacity.setValueAtTime(5.1, 75);
    rightDataOpacity.setValueAtTime(5.6, 0);

    // 12. Layer 10: Left PiP Label
    var pipLabel = comp.layers.addText("[ SCHEMATIC PASS: ANIDOODLE-04 ]");
    pipLabel.name = "HUD_Left_PiP_Label";
    pipLabel.startTime = 0.4;
    pipLabel.inPoint = 0.4;
    pipLabel.outPoint = 4.8;
    getProp(pipLabel, "Position").setValue([180, 800]);
    getProp(pipLabel, "Scale").setValue([26, 26]);
    var pipLabelOpacity = getProp(pipLabel, "Opacity");
    pipLabelOpacity.setValueAtTime(0.4, 0);
    pipLabelOpacity.setValueAtTime(0.8, 70);
    pipLabelOpacity.setValueAtTime(4.2, 70);
    pipLabelOpacity.setValueAtTime(4.8, 0);

    // 13. Layer 11: Network Motto Footer (Centered)
    var mottoText = comp.layers.addText("WE DON'T RECORD REALITY. WE RENDER IMAGINATION.");
    mottoText.name = "HUD_Footer_Motto";
    mottoText.startTime = 2.0;
    mottoText.inPoint = 2.0;
    mottoText.outPoint = 5.7;
    getProp(mottoText, "Position").setValue([480, 1010]);
    getProp(mottoText, "Scale").setValue([34, 34]);
    var mottoOpacity = getProp(mottoText, "Opacity");
    mottoOpacity.setValueAtTime(2.0, 0);
    mottoOpacity.setValueAtTime(2.5, 90);
    mottoOpacity.setValueAtTime(5.2, 90);
    mottoOpacity.setValueAtTime(5.7, 0);

    // 14. Save Project File
    app.project.save(new File(projectPath));
    writeLn("=== Successfully Saved Production Project to: " + projectPath + " ===");
})();
