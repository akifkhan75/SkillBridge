// ============================================================
// SkillBridge Premium Design System — Theme Tokens
// Dark-first design with glassmorphism and gradient accents
// ============================================================

export const colors = {
  // ── Dark Mode ────────────────────────────────────────────
  dark: {
    background: '#0A0A1A',
    surface: '#1A1A2E',
    surfaceElevated: '#252540',
    surfaceGlass: 'rgba(26, 26, 46, 0.85)',
    primary: '#7C3AED',
    primaryLight: '#A78BFA',
    secondary: '#06B6D4',
    secondaryLight: '#22D3EE',
    accent: '#F59E0B',
    accentLight: '#FBBF24',
    success: '#10B981',
    successLight: '#34D399',
    error: '#EF4444',
    errorLight: '#F87171',
    warning: '#F59E0B',
    textPrimary: '#F1F5F9',
    textSecondary: '#94A3B8',
    textTertiary: '#64748B',
    textInverse: '#0F172A',
    border: 'rgba(255, 255, 255, 0.08)',
    borderLight: 'rgba(255, 255, 255, 0.15)',
    overlay: 'rgba(0, 0, 0, 0.6)',
    shadow: 'rgba(0, 0, 0, 0.3)',
    cardGradientStart: '#1E1E3F',
    cardGradientEnd: '#16162E',
    tabBar: '#12122A',
    statusBar: '#0A0A1A',
  },

  // ── Light Mode ───────────────────────────────────────────
  light: {
    background: '#F8F9FE',
    surface: '#FFFFFF',
    surfaceElevated: '#F0F0FF',
    surfaceGlass: 'rgba(255, 255, 255, 0.85)',
    primary: '#7C3AED',
    primaryLight: '#C4B5FD',
    secondary: '#0891B2',
    secondaryLight: '#67E8F9',
    accent: '#D97706',
    accentLight: '#FCD34D',
    success: '#059669',
    successLight: '#6EE7B7',
    error: '#DC2626',
    errorLight: '#FCA5A5',
    warning: '#D97706',
    textPrimary: '#0F172A',
    textSecondary: '#64748B',
    textTertiary: '#94A3B8',
    textInverse: '#F1F5F9',
    border: 'rgba(0, 0, 0, 0.06)',
    borderLight: 'rgba(0, 0, 0, 0.1)',
    overlay: 'rgba(0, 0, 0, 0.4)',
    shadow: 'rgba(0, 0, 0, 0.08)',
    cardGradientStart: '#FFFFFF',
    cardGradientEnd: '#F5F3FF',
    tabBar: '#FFFFFF',
    statusBar: '#F8F9FE',
  },

  // ── Category Colors ──────────────────────────────────────
  category: {
    plumbing: '#3B82F6',
    electrical: '#EAB308',
    salon: '#EC4899',
    carServices: '#475569',
    carpentry: '#F97316',
    painting: '#A855F7',
    cleaning: '#22C55E',
    hvac: '#14B8A6',
    generalHandyman: '#6B7280',
    mechanics: '#EF4444',
    other: '#8B5CF6',
  },

  // ── Gradients ────────────────────────────────────────────
  gradients: {
    primary: ['#7C3AED', '#4F46E5'],
    secondary: ['#06B6D4', '#0EA5E9'],
    accent: ['#F59E0B', '#EF4444'],
    success: ['#10B981', '#059669'],
    dark: ['#1A1A2E', '#0A0A1A'],
    card: ['#252540', '#1A1A2E'],
    premium: ['#7C3AED', '#EC4899'],
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
  '6xl': 64,
};

export const borderRadius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 18,
  '2xl': 24,
  full: 9999,
};

export const fontSize = {
  xs: 11,
  sm: 13,
  base: 15,
  lg: 17,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
  '5xl': 48,
};

export const fontWeight = {
  normal: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  glow: (color: string) => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  }),
};

export type ThemeMode = 'dark' | 'light';
export type ThemeColors = typeof colors.dark;

export const getTheme = (mode: ThemeMode) => ({
  colors: colors[mode],
  spacing,
  borderRadius,
  fontSize,
  fontWeight,
  shadows,
  gradients: colors.gradients,
  categoryColors: colors.category,
});

export type Theme = ReturnType<typeof getTheme>;
