import { Gfx, PENCIL, type Ctx, type Env } from "./core";
import { type Film } from "./film";
import { camera, lensPx } from "./character/math3";
import { order } from "./character/build";
import { renderMarker } from "./character/render/marker";
import { mira } from "./characters/mira";
import { MIRA_MARKER } from "./characters/mira/palettes";
import { gearToEye, relaxed, reachUp, sitCrate, crouch } from "./characters/mira/poses";

const W = 1080, H = 1920;
const PAL = MIRA_MARKER;

// Frame 0: Camera / Gear to Eye
// Frame 1: Relaxed (Looking at camera)
// Frame 2: Reach Up (Holding something high)
// Frame 3: Sit Crate (Sitting in director chair)
// Frame 4: Crouch (Adjusting low angle)

export const drawPoses = (ctx: Ctx, frame: number, env: Env) => {
  const g = new Gfx(ctx, env, frame, PENCIL);
  ctx.setTransform(env.scale, 0, 0, env.scale, 0, 0);
  // Clear with transparent
  ctx.clearRect(0, 0, W * env.scale, H * env.scale);

  let p;
  let yaw = -20;
  let cam = camera([0, 1.0, 3.0], [0, 1.0, 0], lensPx(35, W), W * 0.5, H * 0.5);

  if (frame === 0) {
    p = gearToEye(yaw);
  } else if (frame === 1) {
    p = relaxed(0);
    cam = camera([0, 1.0, 3.0], [0, 1.0, 0], lensPx(35, W), W * 0.5, H * 0.5);
  } else if (frame === 2) {
    p = reachUp(yaw);
  } else if (frame === 3) {
    p = sitCrate(yaw);
  } else {
    p = crouch(yaw);
  }

  const s = mira.toScene(p, cam);
  renderMarker(g, { ...s, parts: order(s.parts) }, PAL, { weight: 1.1 });
};

export const customPoses: Film = {
  meta: { title: "Custom Poses", W, H, fps: 1, bpm: 60, durationFrames: 5 },
  assets: { images: {} },
  shots: [{ id: "poses", start: 0, end: 5, draw: drawPoses }],
};
