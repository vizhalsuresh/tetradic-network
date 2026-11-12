import { Ctx, Env } from "./core";
import { Film } from "./film";
import { drawMiraComic } from "./miraComic";

const FPS = 30, BPM = 60, DURATION = 900;

export const character: Film = {
  meta: { title: "character", W: 1080, H: 1350, fps: FPS, bpm: BPM, durationFrames: DURATION },
  assets: { images: {} },
  shots: [{ id: "one", start: 0, end: DURATION, draw: drawMiraComic }],
};
