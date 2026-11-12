import bpy
import math
import os

# Clean up default scene
bpy.ops.wm.read_factory_settings(use_empty=True)

scene = bpy.context.scene
scene.render.engine = 'BLENDER_WORKBENCH'

scene.render.resolution_x = 1920
scene.render.resolution_y = 1080
scene.render.resolution_percentage = 100
scene.render.fps = 30
scene.frame_start = 1
scene.frame_end = 180

# Workbench settings for crisp technical wireframes
scene.display.shading.light = 'FLAT'
scene.display.shading.color_type = 'SINGLE'
scene.display.shading.single_color = (0.97, 0.93, 0.26) # Sanzo Wada Lemon Yellow
scene.display.shading.show_xray = True
scene.display.shading.xray_alpha = 0.8

# Camera setup
cam_data = bpy.data.cameras.new("Camera")
cam_data.lens = 45
cam_obj = bpy.data.objects.new("Camera", cam_data)
scene.collection.objects.link(cam_obj)
scene.camera = cam_obj
cam_obj.location = (0, -11, 4.5)
cam_obj.rotation_euler = (math.radians(68), 0, 0)

# 1. Outer Torus Ring
bpy.ops.mesh.primitive_torus_add(major_radius=4.2, minor_radius=0.03, major_segments=64, minor_segments=8)
outer_ring = bpy.context.active_object
outer_ring.name = "OuterRing"

# 2. Mid Torus Ring (tilted)
bpy.ops.mesh.primitive_torus_add(major_radius=3.3, minor_radius=0.04, major_segments=48, minor_segments=8)
mid_ring = bpy.context.active_object
mid_ring.name = "MidRing"
mid_ring.rotation_euler = (math.radians(35), math.radians(20), 0)

# 3. Inner Geodesic Icosphere with Wireframe
bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=2, radius=2.2)
sphere = bpy.context.active_object
sphere.name = "WireSphere"
mod = sphere.modifiers.new(name="Wireframe", type='WIREFRAME')
mod.thickness = 0.04

# 4. Central Octahedron Core
bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=1, radius=1.1)
core = bpy.context.active_object
core.name = "CoreOcta"
core_mod = core.modifiers.new(name="Wireframe", type='WIREFRAME')
core_mod.thickness = 0.06

# Animation setup (180 frames = 6 seconds @ 30fps)
for f in [1, 180]:
    progress = (f - 1) / 179.0
    
    # Outer ring spin
    outer_ring.rotation_euler = (0, 0, progress * math.tau)
    outer_ring.keyframe_insert(data_path="rotation_euler", frame=f)
    
    # Mid ring counter-spin
    mid_ring.rotation_euler = (
        math.radians(35) + math.sin(progress * math.tau) * 0.2,
        math.radians(20) - progress * math.tau * 1.5,
        progress * math.tau * 0.5
    )
    mid_ring.keyframe_insert(data_path="rotation_euler", frame=f)
    
    # Sphere multi-axis tumble
    sphere.rotation_euler = (
        progress * math.tau * 0.8,
        progress * math.tau * 1.2,
        progress * math.tau * 0.4
    )
    sphere.keyframe_insert(data_path="rotation_euler", frame=f)
    
    # Core rapid counter-rotation
    core.rotation_euler = (
        -progress * math.tau * 2.0,
        progress * math.tau * 1.5,
        -progress * math.tau
    )
    core.keyframe_insert(data_path="rotation_euler", frame=f)

# Set interpolation to linear for smooth continuous loop
for obj in [outer_ring, mid_ring, sphere, core]:
    if obj.animation_data and obj.animation_data.action:
        for fcurve in obj.animation_data.action.fcurves:
            for kfp in fcurve.keyframe_points:
                kfp.interpolation = 'LINEAR'

# Output settings
out_path = "/home/revenant/Projects/video/out/effectcraft_test/assets/blender_orbit_wireframe.mp4"
scene.render.filepath = out_path
scene.render.image_settings.file_format = 'FFMPEG'
scene.render.ffmpeg.format = 'MPEG4'
scene.render.ffmpeg.codec = 'H264'
scene.render.ffmpeg.constant_rate_factor = 'HIGH'
scene.render.ffmpeg.ffmpeg_preset = 'REALTIME'

print("Blender scene setup complete.")
