import { spring, SpringConfig } from 'remotion';

/**
 * Standardized Motion Curves & Springs for ORBIT Broadcast Network
 * Zero linear movements unless simulating constant conveyor motion.
 */

// Exponential deceleration for camera sweeps and fluid reveals
export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

// Snappy mechanical curves for HUD telemetry, tickers, and callout lines
export const EASE_SNAP = [0.25, 1, 0.5, 1] as const;

// Spring configurations
export const SPRINGS: Record<string, Partial<SpringConfig>> = {
  // Snappy, authoritative UI lock-in
  hud: {
    damping: 14,
    stiffness: 150,
    mass: 0.8,
  },
  // Smooth, elegant organic float
  gentle: {
    damping: 24,
    stiffness: 80,
    mass: 1.2,
  },
  // High-tension punchy impact
  impact: {
    damping: 10,
    stiffness: 200,
    mass: 0.6,
  },
  // Camera smooth drift
  camera: {
    damping: 200,
    stiffness: 50,
    mass: 2.0,
  },
};

/**
 * Helper to compute standardized spring transition
 */
export const getSpringProgress = (
  frame: number,
  fps: number,
  delay: number = 0,
  type: keyof typeof SPRINGS = 'hud'
) => {
  return spring({
    frame: frame - delay,
    fps,
    config: SPRINGS[type],
  });
};
