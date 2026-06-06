// Design tokens — all colors from the Active app spec

export const Colors = {
  // Backgrounds
  background: '#2C2C2C',
  surface: '#3C3C3C',
  surfaceRaised: '#474747',

  // Borders
  border: '#5E5D5E',

  // Text
  white: '#FFFFFF',
  textSecondary: '#ABABAB',
  textTertiary: '#7F7F7F',

  // Brand
  pink: '#EA4EFF',
  purple: '#5100FF',

  // Status
  green: '#5FD08A',
  danger: '#FF6B6B',

  // Gradients (start and end stops)
  gradientStart: '#EA4EFF',
  gradientEnd: '#5100FF',
};

// Gradient configs ready to use with expo-linear-gradient
export const Gradients = {
  primary: {
    colors: ['#EA4EFF', '#5100FF'] as const,
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  primaryHorizontal: {
    colors: ['#EA4EFF', '#5100FF'] as const,
    start: { x: 0, y: 0 },
    end: { x: 1, y: 0 },
  },
  splash: {
    colors: ['#5100FF', '#EA4EFF'] as const,
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
};