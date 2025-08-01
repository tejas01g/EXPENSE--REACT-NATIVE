import { Dimensions, PixelRatio, Platform } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Base dimensions for iPhone 11 (414 x 896)
const baseWidth = 414;
const baseHeight = 896;

// Responsive scaling functions
export const scale = (size) => {
  const newSize = (size * SCREEN_WIDTH) / baseWidth;
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
};

export const verticalScale = (size) => {
  const newSize = (size * SCREEN_HEIGHT) / baseHeight;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

export const moderateScale = (size, factor = 0.5) => {
  return size + (scale(size) - size) * factor;
};

// Device type detection
export const isSmallDevice = SCREEN_WIDTH < 375;
export const isMediumDevice = SCREEN_WIDTH >= 375 && SCREEN_WIDTH < 414;
export const isLargeDevice = SCREEN_WIDTH >= 414;
export const isTablet = SCREEN_WIDTH >= 768;

// Responsive font sizes
export const fontSizes = {
  xs: scale(10),
  sm: scale(12),
  base: scale(14),
  lg: scale(16),
  xl: scale(18),
  '2xl': scale(20),
  '3xl': scale(24),
  '4xl': scale(28),
  '5xl': scale(32),
  '6xl': scale(36),
};

// Responsive spacing
export const spacing = {
  xs: scale(4),
  sm: scale(8),
  base: scale(12),
  md: scale(16),
  lg: scale(20),
  xl: scale(24),
  '2xl': scale(32),
  '3xl': scale(40),
  '4xl': scale(48),
  '5xl': scale(56),
};

// Responsive padding/margin
export const padding = {
  xs: scale(4),
  sm: scale(8),
  base: scale(12),
  md: scale(16),
  lg: scale(20),
  xl: scale(24),
  '2xl': scale(32),
  '3xl': scale(40),
};

// Responsive border radius
export const borderRadius = {
  sm: scale(4),
  base: scale(8),
  md: scale(12),
  lg: scale(16),
  xl: scale(20),
  '2xl': scale(24),
  '3xl': scale(30),
  full: scale(50),
};

// Screen dimensions
export const screenDimensions = {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
  isSmallDevice,
  isMediumDevice,
  isLargeDevice,
  isTablet,
};

// Responsive image sizes
export const imageSizes = {
  xs: scale(24),
  sm: scale(32),
  base: scale(40),
  md: scale(48),
  lg: scale(56),
  xl: scale(64),
  '2xl': scale(80),
  '3xl': scale(96),
  profile: scale(120),
  largeProfile: scale(150),
};

// Responsive button sizes
export const buttonSizes = {
  sm: {
    height: scale(36),
    paddingHorizontal: scale(12),
    fontSize: fontSizes.sm,
  },
  base: {
    height: scale(44),
    paddingHorizontal: scale(16),
    fontSize: fontSizes.base,
  },
  lg: {
    height: scale(52),
    paddingHorizontal: scale(20),
    fontSize: fontSizes.lg,
  },
  xl: {
    height: scale(60),
    paddingHorizontal: scale(24),
    fontSize: fontSizes.xl,
  },
};

// Responsive input sizes
export const inputSizes = {
  sm: {
    height: scale(36),
    fontSize: fontSizes.sm,
    paddingHorizontal: scale(12),
  },
  base: {
    height: scale(44),
    fontSize: fontSizes.base,
    paddingHorizontal: scale(16),
  },
  lg: {
    height: scale(52),
    fontSize: fontSizes.lg,
    paddingHorizontal: scale(20),
  },
};

// Responsive container widths
export const containerWidths = {
  sm: '85%',
  base: '90%',
  lg: '95%',
  full: '100%',
};

// Responsive chart dimensions
export const chartDimensions = {
  width: SCREEN_WIDTH - scale(32),
  height: isTablet ? scale(300) : scale(250),
};

// Responsive modal dimensions
export const modalDimensions = {
  width: isTablet ? SCREEN_WIDTH * 0.7 : SCREEN_WIDTH * 0.9,
  height: isTablet ? SCREEN_HEIGHT * 0.8 : SCREEN_HEIGHT * 0.9,
};

// Responsive grid columns
export const gridColumns = {
  sm: 1,
  md: 2,
  lg: 3,
  xl: 4,
};

// Get responsive value based on device size
export const getResponsiveValue = (small, medium, large, tablet) => {
  if (isTablet) return tablet || large;
  if (isLargeDevice) return large;
  if (isMediumDevice) return medium;
  return small;
};

// Responsive line height
export const lineHeights = {
  tight: 1.2,
  base: 1.4,
  relaxed: 1.6,
  loose: 1.8,
};

// Responsive letter spacing
export const letterSpacing = {
  tight: -0.5,
  base: 0,
  wide: 0.5,
  wider: 1,
  widest: 2,
}; 