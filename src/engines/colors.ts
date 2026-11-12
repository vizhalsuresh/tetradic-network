/**
 * Sanzo Wada Color Integration for ORBIT Broadcast Network
 * Based on Sanzo Wada's 1933 Haishoku Sokan (348 Color Combinations)
 */

export interface BroadcastPalette {
  id: number;
  name: string;
  background: string;
  surface: string;
  primary: string;
  accent: string;
  muted: string;
  grid: string;
}

// Pre-configured authentic Sanzo Wada combinations for our shows
export const SHOW_PALETTES: Record<string, BroadcastPalette> = {
  // Show 1: The Blueprint — Sanzo Wada #164 (Technical Deep Navy & Cyan)
  blueprint: {
    id: 164,
    name: 'Technical Blueprint',
    background: '#080E1A',
    surface: '#121C2F',
    primary: '#F0F4F8',
    accent: '#00F0FF',
    muted: '#6B7C96',
    grid: 'rgba(0, 240, 255, 0.08)',
  },

  // Show 2: The Simulation — Sanzo Wada #248 (Deep Void & Hazard Emerald/Amber)
  simulation: {
    id: 248,
    name: 'Cosmic Void & Hazard',
    background: '#050508',
    surface: '#0F1017',
    primary: '#FFFFFF',
    accent: '#30D158',
    muted: '#7A808C',
    grid: 'rgba(48, 209, 88, 0.08)',
  },

  // Show 3: The Paradox — Sanzo Wada #12 (Sumi Charcoal & Acid Gold)
  paradox: {
    id: 12,
    name: 'Film Noir & Acid Gold',
    background: '#0A0A0C',
    surface: '#18181C',
    primary: '#E5E5EA',
    accent: '#FFD60A',
    muted: '#8E8E93',
    grid: 'rgba(255, 214, 10, 0.06)',
  },

  // Sunday: The Network Reel — Sanzo Wada #88 (IDE Midnight & Electric Lavender)
  networkReel: {
    id: 88,
    name: 'Monolithic Indigo',
    background: '#0A0914',
    surface: '#161426',
    primary: '#FFFFFF',
    accent: '#BF5AF2',
    muted: '#7E7A99',
    grid: 'rgba(191, 90, 242, 0.08)',
  },
};
