// Nova Q7 Ultra Titan v6 PLATINUM EDITION
// Platinum Motion Engine v3 - 120fps Animation System

export const AnimationConfig = {
  // Motion engine settings
  fps: 120,
  engine: 'platinum_motion_engine_v3',
  
  // Spring physics
  spring: {
    stiffness: 220,
    damping: 23,
    mass: 0.85,
  },
  
  // Premium spring presets
  springPresets: {
    ultraSmooth: {
      stiffness: 180,
      damping: 28,
      mass: 1.0,
    },
    snappy: {
      stiffness: 300,
      damping: 20,
      mass: 0.6,
    },
    bouncy: {
      stiffness: 250,
      damping: 15,
      mass: 0.7,
    },
    smooth: {
      stiffness: 200,
      damping: 25,
      mass: 0.9,
    },
  },
  
  // Timing functions
  timing: {
    ultraFast: 150,
    fast: 250,
    medium: 350,
    slow: 500,
    verySlow: 750,
  },
  
  // Easing functions
  easing: {
    default: [0.4, 0.0, 0.2, 1],
    emphasized: [0.0, 0.0, 0.2, 1],
    decelerated: [0.0, 0.0, 0.2, 1],
    accelerated: [0.4, 0.0, 1, 1],
    sharp: [0.4, 0.0, 0.6, 1],
  },
  
  // Animation effects
  effects: {
    neonGlow: true,
    aiEnergyPulse: true,
    parallaxDepth: true,
    tilt3D: true,
    cardScaleIn: true,
    buttonMicroBounce: true,
    screenFadeSlide: true,
    hologramSpin: true,
  },
  
  // Scale transformations
  scale: {
    press: 0.96,
    hover: 1.02,
    active: 0.98,
  },
  
  // Opacity transitions
  opacity: {
    hidden: 0,
    visible: 1,
    dimmed: 0.7,
    subtle: 0.4,
  },
  
  // Translate distances
  translate: {
    small: 8,
    medium: 16,
    large: 32,
    huge: 64,
  },
  
  // Rotation angles
  rotate: {
    subtle: '2deg',
    medium: '5deg',
    strong: '10deg',
    full: '360deg',
  },
};

// Preset animations
export const Animations = {
  // Fade animations
  fadeIn: {
    duration: AnimationConfig.timing.medium,
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
  fadeOut: {
    duration: AnimationConfig.timing.medium,
    from: { opacity: 1 },
    to: { opacity: 0 },
  },
  
  // Scale animations
  scaleIn: {
    duration: AnimationConfig.timing.fast,
    from: { transform: [{ scale: 0.9 }], opacity: 0 },
    to: { transform: [{ scale: 1 }], opacity: 1 },
  },
  scaleOut: {
    duration: AnimationConfig.timing.fast,
    from: { transform: [{ scale: 1 }], opacity: 1 },
    to: { transform: [{ scale: 0.9 }], opacity: 0 },
  },
  
  // Slide animations
  slideInUp: {
    duration: AnimationConfig.timing.medium,
    from: { transform: [{ translateY: 50 }], opacity: 0 },
    to: { transform: [{ translateY: 0 }], opacity: 1 },
  },
  slideInDown: {
    duration: AnimationConfig.timing.medium,
    from: { transform: [{ translateY: -50 }], opacity: 0 },
    to: { transform: [{ translateY: 0 }], opacity: 1 },
  },
  slideInLeft: {
    duration: AnimationConfig.timing.medium,
    from: { transform: [{ translateX: -50 }], opacity: 0 },
    to: { transform: [{ translateX: 0 }], opacity: 1 },
  },
  slideInRight: {
    duration: AnimationConfig.timing.medium,
    from: { transform: [{ translateX: 50 }], opacity: 0 },
    to: { transform: [{ translateX: 0 }], opacity: 1 },
  },
  
  // Bounce animation
  bounce: {
    duration: AnimationConfig.timing.fast,
    from: { transform: [{ scale: 1 }] },
    to: { transform: [{ scale: 0.96 }] },
  },
  
  // Glow pulse (for neon effects)
  glowPulse: {
    duration: 2000,
    loop: true,
    from: { opacity: 0.6 },
    to: { opacity: 1 },
  },
  
  // Rotation
  rotate360: {
    duration: 2000,
    loop: true,
    from: { transform: [{ rotate: '0deg' }] },
    to: { transform: [{ rotate: '360deg' }] },
  },
  
  // Hologram shimmer
  hologramShimmer: {
    duration: 3000,
    loop: true,
    from: { opacity: 0.7 },
    to: { opacity: 1 },
  },
};
