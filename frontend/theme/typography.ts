// Nova Q7 Ultra Titan v6 PLATINUM EDITION
// Premium Typography System 2026-2027

export const Typography = {
  // Premium font families (using system fonts with fallbacks)
  // For custom fonts, use expo-google-fonts or expo-font
  fontFamily: {
    // Primary title font (SF Pro Display alternative)
    title: 'System',
    // Secondary title (Neue Montreal alternative)
    titleSecondary: 'System',
    // Body font (Inter alternative - using system)
    body: 'System',
    // Numeric font (JetBrains Mono alternative - using monospace)
    numeric: Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' }),
    // Logo font (Gilroy alternative)
    logo: 'System',
    // Accent font (Satoshi alternative)
    accent: 'System',
  },
  
  // Font sizes - Platinum scale
  fontSize: {
    micro: 10,
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    huge: 40,
    massive: 48,
    ultra: 64,
  },
  
  // Font weights - Platinum system
  fontWeight: {
    thin: '200' as const,
    light: '300' as const,
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    heavy: '800' as const,
    black: '900' as const,
  },
  
  // Line heights - Enhanced
  lineHeight: {
    compressed: 1.1,
    tight: 1.2,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.75,
    loose: 2.0,
  },
  
  // Letter spacing - Platinum precision
  letterSpacing: {
    tighter: -0.8,
    tight: -0.4,
    normal: 0,
    wide: 0.4,
    wider: 0.8,
    widest: 1.6,
  },
};
