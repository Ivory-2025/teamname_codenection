import '@/global.css';
import { Platform } from 'react-native';

export const Colors = {
  light: {
    // Canvas & Cards
    background: '#F9F9FB',        // Primary screen background
    card: '#FFFFFF',              // Elevated cards, sheets, modals
    backgroundElement: '#F3F3F5', // Inputs, inactive chips, nested containers
    backgroundSelected: '#111111',// Selected state / active pill background
    
    // Typography
    text: '#0D0D0E',              // Main headings, titles, key numbers
    textSecondary: '#636366',     // Subtitles, transit times, metadata[cite: 1]
    textTertiary: '#AEAEB2',      // Placeholders, inactive tab icons
    textInverse: '#FFFFFF',       // Text on dark buttons / active pills
    
    // Borders & Accents
    border: '#E5E5EA',            // 0.5pt subtle hairline dividers & card borders
    tint: '#111111',              // Onyx primary accent & active tab indicators
    alert: '#C84037',             // Delays, attraction closures, SOS triggers[cite: 1]
    rating: '#C29B38',            // Google star ratings & verified badges[cite: 1]
  },
  dark: {
    background: '#000000',
    card: '#1C1C1E',
    backgroundElement: '#2C2C2E',
    backgroundSelected: '#FFFFFF',
    text: '#FFFFFF',
    textSecondary: '#8E8E93',
    textTertiary: '#48484A',
    textInverse: '#000000',
    border: '#38383A',
    tint: '#FFFFFF',
    alert: '#FF453A',
    rating: '#FFD60A',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 12,
  four: 16,
  five: 24,
  six: 32,
} as const;

export const Radius = {
  button: 12,
  input: 12,
  card: 16,
  sheet: 24,
  pill: 9999,
} as const;

export const Border = {
  hairline: 0.5,
  accent: 3,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;