export interface VoxBeat {
  id: number;
  narration: string;
  visual: string;
  caption_text: string | null;
  motion: string;
}

export interface VoxBeatTiming {
  id: number;
  file: string;
  duration: number; // in seconds
  caption_text?: string | null;
}

export interface VoxManifest {
  title: string;
  topic: string;
  style_seed: string;
  accent_color: string;
  total_duration?: number;
  beats: VoxBeat[];
}

export interface VoxTimingManifest {
  title: string;
  total_duration: number;
  total_minutes: number;
  beat_count: number;
  beats: VoxBeatTiming[];
}
