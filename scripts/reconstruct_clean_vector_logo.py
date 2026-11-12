import math
import cv2
import numpy as np

def generate_clean_logo_svg(out_svg_path):
    """
    Constructs a 100% mathematically uniform vector SVG of The Art and Lore Studio logo.
    Every stroke has uniform thickness (stroke-width: 11px, outer frame: 14px).
    Zero auto-trace jitter. Pure geometric primitives (lines, circles, arcs, polygons).
    """
    sw = 10.5        # Uniform internal line stroke-width
    sw_outer = 13.5  # Dense, clean outer frame stroke-width
    col = "#ffffff"  # Pure white monochrome
    
    # Canvas dimensions matching original reference (766 x 734)
    # Outer frame: x=73, y=68, w=632, h=612
    fx, fy, fw, fh = 73, 68, 632, 612
    
    svg = []
    svg.append('<?xml version="1.0" encoding="UTF-8"?>')
    svg.append(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 766 734" width="766" height="734">')
    svg.append('  <title>The Art and Lore Studio — Master Mathematical Vector Emblem</title>')
    svg.append('  <rect width="766" height="734" fill="#060911" />')
    
    # Common group style for uniform stroke
    svg.append(f'  <g id="master_geometric_emblem" stroke="{col}" stroke-width="{sw}" stroke-linecap="round" stroke-linejoin="round" fill="none">')
    
    # -------------------------------------------------------------------------
    # 1. Outer Box & Corner Frame Accents
    # -------------------------------------------------------------------------
    svg.append('    <!-- 01: Outer Frame -->')
    svg.append(f'    <rect id="frame_box" x="{fx}" y="{fy}" width="{fw}" height="{fh}" stroke-width="{sw_outer}" rx="3" />')
    
    # Top-right corner right-triangle frame
    # Hypotenuse runs from (fx+fw - 145, fy) to (fx+fw, fy + 145) -> (560, 68) to (705, 213)
    svg.append('    <!-- 02: Top Right Corner Triangle & Solid Accent -->')
    svg.append(f'    <path d="M {fx+fw-130} {fy} L {fx+fw} {fy+130}" />')
    # Solid black corner block
    svg.append(f'    <rect x="{fx+fw-48}" y="{fy}" width="48" height="48" fill="{col}" stroke="none" />')
    
    # Bottom-right corner accent
    svg.append('    <!-- 03: Bottom Right Corner Triangle Accent -->')
    svg.append(f'    <path d="M {fx+fw-72} {fy+fh} L {fx+fw} {fy+fh-72}" />')
    # Inner concentric arch inside corner triangle
    svg.append(f'    <path d="M {fx+fw-145} {fy+fh} L {fx+fw-78} {fy+fh-67} L {fx+fw} {fy+fh-145}" />')
    # Small semi-circle / arch at bottom right
    svg.append(f'    <path d="M {fx+fw-115} {fy+fh} A 22 22 0 0 1 {fx+fw-75} {fy+fh}" />')
    
    # -------------------------------------------------------------------------
    # 2. Astrolabe (Concentric Circles & Gear Spokes at (486, 260))
    # -------------------------------------------------------------------------
    acx, acy = 486.0, 259.5
    svg.append('    <!-- 04: Astrolabe Concentric Wheels & Cardinal Diamonds -->')
    # Bullseye center
    svg.append(f'    <circle id="astrolabe_bullseye_fill" cx="{acx}" cy="{acy}" r="8" fill="{col}" stroke="none" />')
    svg.append(f'    <circle id="astrolabe_ring_0" cx="{acx}" cy="{acy}" r="22" />')
    svg.append(f'    <circle id="astrolabe_ring_1" cx="{acx}" cy="{acy}" r="55" />')
    svg.append(f'    <circle id="astrolabe_ring_2" cx="{acx}" cy="{acy}" r="82" />')
    
    # 4 Diamonds at cardinal positions on Ring 2 (R=82)
    for angle_deg in [0, 90, 180, 270]:
        rad = math.radians(angle_deg)
        dx = acx + 82 * math.cos(rad)
        dy = acy + 82 * math.sin(rad)
        # Diamond of side ~16
        ds = 9.0
        svg.append(f'    <polygon points="{dx},{dy-ds} {dx+ds},{dy} {dx},{dy+ds} {dx-ds},{dy}" fill="{col}" stroke="none" />')
        svg.append(f'    <polygon points="{dx},{dy-ds} {dx+ds},{dy} {dx},{dy+ds} {dx-ds},{dy}" fill="none" stroke="#060911" stroke-width="3" />')
    
    # Inner and outer gear circles
    r_gear_in = 120.0
    r_gear_out = 162.0
    svg.append(f'    <circle id="astrolabe_gear_in" cx="{acx}" cy="{acy}" r="{r_gear_in}" />')
    svg.append(f'    <circle id="astrolabe_gear_out" cx="{acx}" cy="{acy}" r="{r_gear_out}" />')
    
    # Radial Gear Teeth (Spokes) between R=120 and R=162
    # The gear spans from angle ~ -135 deg to ~ 90 deg (clipped by diagonal beam)
    num_spokes = 32
    for s_idx in range(num_spokes):
        s_deg = s_idx * (360.0 / num_spokes)
        # Only draw spokes in the visible upper-right wedge
        if 280 <= s_deg or s_deg <= 135:
            s_rad = math.radians(s_deg)
            x1 = acx + r_gear_in * math.cos(s_rad)
            y1 = acy + r_gear_in * math.sin(s_rad)
            x2 = acx + r_gear_out * math.cos(s_rad)
            y2 = acy + r_gear_out * math.sin(s_rad)
            svg.append(f'    <line x1="{x1:.1f}" y1="{y1:.1f}" x2="{x2:.1f}" y2="{y2:.1f}" />')
            
    # Outermost Astrolabe Perimeter Arc (R=198)
    svg.append(f'    <path d="M {acx - 170} {acy - 100} A 198 198 0 0 1 {acx + 195} {acy + 35}" />')
    
    # -------------------------------------------------------------------------
    # 3. Diagonal Dividing Beam (45-degree angle across the composition)
    # -------------------------------------------------------------------------
    # Parallel lines running from bird neck to lower right
    # Upper edge of beam:
    svg.append('    <!-- 05: Diagonal Divider Beam -->')
    svg.append(f'    <line x1="265" y1="230" x2="635" y2="600" />')
    # Lower edge of beam: offset by ~38px perpendicular (dx=27, dy=27)
    svg.append(f'    <line x1="292" y1="257" x2="600" y2="565" />')
    # Beam end cap at lower right:
    svg.append(f'    <line x1="600" y1="565" x2="635" y2="600" />')
    
    # 3 Diamonds along the diagonal beam center
    # Beam center line: x1=278.5, y1=243.5 -> step along (1, 1) direction
    for d_step in [120, 165, 210]:
        d_cx = 278.5 + d_step + 60
        d_cy = 243.5 + d_step + 60
        dds = 11.0
        svg.append(f'    <polygon points="{d_cx},{d_cy-dds} {d_cx+dds},{d_cy} {d_cx},{d_cy+dds} {d_cx-dds},{d_cy}" />')
        # Center dot inside diamond
        svg.append(f'    <circle cx="{d_cx}" cy="{d_cy}" r="3" fill="{col}" stroke="none" />')
        
    # -------------------------------------------------------------------------
    # 4. Bird Profile (Head, Beak, Eye, Body Tracks)
    # -------------------------------------------------------------------------
    svg.append('    <!-- 06: Bird Geometry -->')
    # Beak: solid triangle pointing left
    svg.append(f'    <polygon points="144,265 178,252 178,278" fill="{col}" stroke="none" />')
    
    # Eye: outer circle + solid pupil
    bcx, bcy = 202.0, 265.5
    svg.append(f'    <circle cx="{bcx}" cy="{bcy}" r="17" />')
    svg.append(f'    <circle cx="{bcx}" cy="{bcy}" r="5.5" fill="{col}" stroke="none" />')
    
    # Head dome: arc from beak top (178, 252) over the head to neck junction (265, 230)
    svg.append(f'    <path d="M 178 252 C 178 215 225 210 265 230" />')
    # Neck / Chest horizontal divider:
    svg.append(f'    <line x1="178" y1="310" x2="265" y2="310" />')
    # Chin curve from beak bottom (178, 278) to chest (178, 310)
    svg.append(f'    <line x1="178" y1="278" x2="178" y2="310" />')
    # Lower throat arc:
    svg.append(f'    <path d="M 178 310 C 178 370 215 448 290 448" />')
    
    # Concentric U-tracks for Bird Wing / Body:
    # Track 1 (Outer track):
    # Runs horizontally from (265, 348) to (435, 348), loops radius 40 to (435, 428), runs left to (255, 428)
    svg.append(f'    <path d="M 265 348 L 430 348 A 40 40 0 0 1 430 428 L 265 428" />')
    # Track 2 (Middle track):
    svg.append(f'    <path d="M 265 362 L 430 362 A 26 26 0 0 1 430 414 L 265 414" />')
    # Track 3 (Inner track):
    svg.append(f'    <path d="M 265 376 L 430 376 A 12 12 0 0 1 430 400 L 265 400" />')
    
    # -------------------------------------------------------------------------
    # 5. West Semicircular Fan (Left Edge)
    # -------------------------------------------------------------------------
    svg.append('    <!-- 07: West Semicircular Fan -->')
    w_cx, w_cy = 73.0, 320.0
    # Concentric arcs
    svg.append(f'    <path d="M {w_cx} {w_cy-115} A 115 115 0 0 1 {w_cx} {w_cy+115}" />')
    svg.append(f'    <path d="M {w_cx} {w_cy-80} A 80 80 0 0 1 {w_cx} {w_cy+80}" />')
    svg.append(f'    <path d="M {w_cx} {w_cy-45} A 45 45 0 0 1 {w_cx} {w_cy+45}" />')
    # Radial teeth between R=80 and R=115
    for w_deg in range(-75, 80, 15):
        w_rad = math.radians(w_deg)
        wx1 = w_cx + 80 * math.cos(w_rad)
        wy1 = w_cy + 80 * math.sin(w_rad)
        wx2 = w_cx + 115 * math.cos(w_rad)
        wy2 = w_cy + 115 * math.sin(w_rad)
        svg.append(f'    <line x1="{wx1:.1f}" y1="{wy1:.1f}" x2="{wx2:.1f}" y2="{wy2:.1f}" />')
        
    # -------------------------------------------------------------------------
    # 6. Top-Left Corner Shields & Diagonal Hatching
    # -------------------------------------------------------------------------
    svg.append('    <!-- 08: Top Left Corner Shields -->')
    # Corner quadrant leaf:
    # Runs from (73, 68+115) to (73+115, 68) with arc
    svg.append(f'    <path d="M {fx} {fy+115} A 115 115 0 0 0 {fx+115} {fy} L {fx} {fy} Z" />')
    # 5 parallel diagonal hatching lines inside corner leaf (slope = -1):
    for h_off in [25, 45, 65, 85, 105]:
        svg.append(f'    <line x1="{fx+h_off}" y1="{fy}" x2="{fx}" y2="{fy+h_off}" />')
        
    # Central Shield at Top (between corner leaf and astrolabe):
    # Centered at X=240, from Y=68 to Y=180
    sh_x = 240.0
    svg.append(f'    <path d="M {sh_x-60} {fy} L {sh_x+60} {fy} C {sh_x+60} {fy+110} {sh_x} {fy+145} {sh_x} {fy+145} C {sh_x} {fy+145} {sh_x-60} {fy+110} {sh_x-60} {fy} Z" />')
    # Vertical centerline dividing the shield
    svg.append(f'    <line x1="{sh_x}" y1="{fy}" x2="{sh_x}" y2="{fy+145}" />')
    # Diagonal hatching in right half of shield:
    for sh_h in range(20, 130, 20):
        # Line from center line down-right
        svg.append(f'    <line x1="{sh_x}" y1="{fy+sh_h}" x2="{sh_x+min(55, 140-sh_h)}" y2="{fy+sh_h+min(55, 140-sh_h)}" />')
        
    # Nested Diamond between Shields and Bird:
    nd_x, nd_y = 150.0, 200.0
    nd_s1, nd_s2 = 28.0, 14.0
    svg.append(f'    <polygon points="{nd_x},{nd_y-nd_s1} {nd_x+nd_s1},{nd_y} {nd_x},{nd_y+nd_s1} {nd_x-nd_s1},{nd_y}" />')
    svg.append(f'    <polygon points="{nd_x},{nd_y-nd_s2} {nd_x+nd_s2},{nd_y} {nd_x},{nd_y+nd_s2} {nd_x-nd_s2},{nd_y}" />')
    
    # -------------------------------------------------------------------------
    # 7. Southwest Quadrant (4-Point Star, Pill, Striped Leaf)
    # -------------------------------------------------------------------------
    svg.append('    <!-- 09: Southwest Features -->')
    # Southwest vertical pill / arch:
    pill_x, pill_y = fx, 475.0
    pill_w, pill_h = 55.0, 195.0
    svg.append(f'    <path d="M {pill_x} {pill_y+pill_h} L {pill_x+pill_w} {pill_y+pill_h} L {pill_x+pill_w} {pill_y+pill_w} A {pill_w} {pill_w} 0 0 0 {pill_x} {pill_y} Z" />')
    # 3 Diamond glyphs stacked vertically in the pill
    for p_idx, p_dy in enumerate([55, 105, 155]):
        p_cx = pill_x + pill_w / 2.0
        p_cy = pill_y + p_dy
        p_ds = 8.0
        svg.append(f'    <polygon points="{p_cx},{p_cy-p_ds} {p_cx+p_ds},{p_cy} {p_cx},{p_cy+p_ds} {p_cx-p_ds},{p_cy}" />')
        
    # 4-Point Concave Star:
    st_cx, st_cy = 155.0, 485.0
    st_r_outer = 58.0
    st_r_inner = 18.0
    # Draw 4-point concave star with smooth cubic Beziers or lines
    star_path = f"M {st_cx} {st_cy-st_r_outer} Q {st_cx} {st_cy} {st_cx+st_r_outer} {st_cy} Q {st_cx} {st_cy} {st_cx} {st_cy+st_r_outer} Q {st_cx} {st_cy} {st_cx-st_r_outer} {st_cy} Q {st_cx} {st_cy} {st_cx} {st_cy-st_r_outer}"
    svg.append(f'    <path d="{star_path}" />')
    # Vertical centerline inside star
    svg.append(f'    <line x1="{st_cx}" y1="{st_cy-st_r_outer+10}" x2="{st_cx}" y2="{st_cy+st_r_outer-10}" />')
    # 3 curved stripes on left half
    for st_off in [12, 24, 36]:
        svg.append(f'    <path d="M {st_cx} {st_cy-st_off} Q {st_cx-st_off} {st_cy} {st_cx} {st_cy+st_off}" />')
    # Diamond on right half of star
    svg.append(f'    <polygon points="{st_cx+18},{st_cy-7} {st_cx+25},{st_cy} {st_cx+18},{st_cy+7} {st_cx+11},{st_cy}" />')
    
    # Striped Leaf / Petal next to star:
    # Runs from (215, 665) to (270, 500)
    leaf_p = "M 235 665 C 190 610 205 530 270 500 C 275 580 260 635 235 665 Z"
    svg.append(f'    <path d="{leaf_p}" />')
    # Diagonal divider through leaf
    svg.append(f'    <line x1="235" y1="665" x2="270" y2="500" />')
    # Parallel stripes in left half:
    for lf_y in range(530, 650, 18):
        svg.append(f'    <line x1="210" y1="{lf_y}" x2="{210 + (lf_y-500)*0.35:.1f}" y2="{lf_y-12}" />')
        
    # -------------------------------------------------------------------------
    # 8. Southeast Quadrant (Checkerboard Grid & Wave/Scallop Fans)
    # -------------------------------------------------------------------------
    svg.append('    <!-- 10: Southeast Checkerboard Grid & Waves -->')
    # Checkerboard grid of diamonds:
    # 3x3 diagonal grid centered around (390, 560)
    grid_cx, grid_cy = 380.0, 560.0
    sq_size = 32.0
    for row in range(-2, 3):
        for col in range(-2, 3):
            if abs(row) + abs(col) <= 2:
                # Rotate by 45 degrees
                gx = grid_cx + (col - row) * (sq_size * 0.707)
                gy = grid_cy + (col + row) * (sq_size * 0.707)
                # Diamond square
                d_pts = f"{gx},{gy-sq_size*0.707:.1f} {gx+sq_size*0.707:.1f},{gy} {gx},{gy+sq_size*0.707:.1f} {gx-sq_size*0.707:.1f},{gy}"
                svg.append(f'    <polygon points="{d_pts}" />')
                # Alternate squares have an inner nested diamond
                if (row + col) % 2 == 0:
                    in_s = sq_size * 0.38
                    in_pts = f"{gx},{gy-in_s*0.707:.1f} {gx+in_s*0.707:.1f},{gy} {gx},{gy+in_s*0.707:.1f} {gx-in_s*0.707:.1f},{gy}"
                    svg.append(f'    <polygon points="{in_pts}" />')

    # Japanese Seigaiha / Scallop Waves in East Triangle:
    # Triangle region from (560, 450) to (fx+fw, 450) down to (fx+fw, 600)
    # Set of concentric arcs
    for wave_x in [580, 625, 670]:
        for wave_y in [430, 485, 540]:
            if wave_x + wave_y < 1250:
                svg.append(f'    <path d="M {wave_x-22} {wave_y} A 22 22 0 0 1 {wave_x+22} {wave_y}" />')
                svg.append(f'    <path d="M {wave_x-14} {wave_y} A 14 14 0 0 1 {wave_x+14} {wave_y}" />')
                svg.append(f'    <path d="M {wave_x-6} {wave_y} A 6 6 0 0 1 {wave_x+6} {wave_y}" />')

    svg.append('  </g>')
    svg.append('</svg>')
    
    with open(out_svg_path, "w") as f:
        f.write("\n".join(svg))
    print(f"Successfully generated clean mathematical SVG: {out_svg_path}")

if __name__ == "__main__":
    generate_clean_logo_svg("/home/revenant/Projects/video/out/cinematic_3d_reveal/art_and_lore_pristine_master.svg")
