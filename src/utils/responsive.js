 
import { Dimensions, PixelRatio, Platform } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Enhanced device detection
export const isSmallDevice = SCREEN_WIDTH < 375; // iPhone SE, small Android
export const isMediumDevice = SCREEN_WIDTH >= 375 && SCREEN_WIDTH < 414; // iPhone 12/13/14, medium Android
export const isLargeDevice = SCREEN_WIDTH >= 414 && SCREEN_WIDTH < 768; // iPhone 12/13/14 Pro Max, large Android
export const isTablet = SCREEN_WIDTH >= 768; // iPad, Android tablets
export const isLargeTablet = SCREEN_WIDTH >= 1024; // iPad Pro

// Enhanced get responsive value function
export const getResponsiveValue = (small, medium, large, tablet) => {
  if (isLargeTablet) return tablet || large;
  if (isTablet) return tablet || large;
  if (isLargeDevice) return large;
  if (isMediumDevice) return medium;
  return small;
};

// Enhanced responsive scaling functions
export const scale = (size) => {
  const newSize = (size * SCREEN_WIDTH) / 414; // Using 414 as base (iPhone 11 Pro Max)
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 1;
  }
};

export const verticalScale = (size) => {
  const newSize = (size * SCREEN_HEIGHT) / 896; // Using 896 as base (iPhone 11 Pro Max)
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

export const moderateScale = (size, factor = 0.5) => {
  return size + (scale(size) - size) * factor;
};

// Enhanced responsive font sizes
export const fontSizes = {
  xs: getResponsiveValue(scale(10), scale(11), scale(12), scale(14)),
  sm: getResponsiveValue(scale(12), scale(13), scale(14), scale(16)),
  base: getResponsiveValue(scale(14), scale(15), scale(16), scale(18)),
  lg: getResponsiveValue(scale(16), scale(17), scale(18), scale(20)),
  xl: getResponsiveValue(scale(18), scale(19), scale(20), scale(22)),
  '2xl': getResponsiveValue(scale(20), scale(22), scale(24), scale(26)),
  '3xl': getResponsiveValue(scale(24), scale(26), scale(28), scale(32)),
  '4xl': getResponsiveValue(scale(28), scale(30), scale(32), scale(36)),
  '5xl': getResponsiveValue(scale(32), scale(34), scale(36), scale(40)),
  '6xl': getResponsiveValue(scale(36), scale(38), scale(40), scale(44)),
};

// Enhanced responsive spacing
export const spacing = {
  xs: getResponsiveValue(scale(4), scale(5), scale(6), scale(8)),
  sm: getResponsiveValue(scale(8), scale(9), scale(10), scale(12)),
  base: getResponsiveValue(scale(12), scale(13), scale(14), scale(16)),
  md: getResponsiveValue(scale(16), scale(17), scale(18), scale(20)),
  lg: getResponsiveValue(scale(20), scale(22), scale(24), scale(28)),
  xl: getResponsiveValue(scale(24), scale(26), scale(28), scale(32)),
  '2xl': getResponsiveValue(scale(32), scale(34), scale(36), scale(40)),
  '3xl': getResponsiveValue(scale(40), scale(42), scale(44), scale(48)),
  '4xl': getResponsiveValue(scale(48), scale(50), scale(52), scale(56)),
  '5xl': getResponsiveValue(scale(56), scale(58), scale(60), scale(64)),
};

// Enhanced responsive padding/margin
export const padding = {
  xs: getResponsiveValue(scale(4), scale(5), scale(6), scale(8)),
  sm: getResponsiveValue(scale(8), scale(9), scale(10), scale(12)),
  base: getResponsiveValue(scale(12), scale(13), scale(14), scale(16)),
  md: getResponsiveValue(scale(16), scale(17), scale(18), scale(20)),
  lg: getResponsiveValue(scale(20), scale(22), scale(24), scale(28)),
  xl: getResponsiveValue(scale(24), scale(26), scale(28), scale(32)),
  '2xl': getResponsiveValue(scale(32), scale(34), scale(36), scale(40)),
  '3xl': getResponsiveValue(scale(40), scale(42), scale(44), scale(48)),
};

// Enhanced responsive border radius
export const borderRadius = {
  sm: getResponsiveValue(scale(4), scale(5), scale(6), scale(8)),
  base: getResponsiveValue(scale(8), scale(9), scale(10), scale(12)),
  md: getResponsiveValue(scale(12), scale(13), scale(14), scale(16)),
  lg: getResponsiveValue(scale(16), scale(17), scale(18), scale(20)),
  xl: getResponsiveValue(scale(20), scale(22), scale(24), scale(28)),
  '2xl': getResponsiveValue(scale(24), scale(26), scale(28), scale(32)),
  '3xl': getResponsiveValue(scale(30), scale(32), scale(34), scale(38)),
  full: getResponsiveValue(scale(50), scale(52), scale(54), scale(60)),
};

// Enhanced screen dimensions
export const screenDimensions = {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
  isSmallDevice,
  isMediumDevice,
  isLargeDevice,
  isTablet,
  isLargeTablet,
};

// Enhanced responsive image sizes
export const imageSizes = {
  xs: getResponsiveValue(scale(24), scale(26), scale(28), scale(32)),
  sm: getResponsiveValue(scale(32), scale(34), scale(36), scale(40)),
  base: getResponsiveValue(scale(40), scale(42), scale(44), scale(48)),
  md: getResponsiveValue(scale(48), scale(50), scale(52), scale(56)),
  lg: getResponsiveValue(scale(56), scale(58), scale(60), scale(64)),
  xl: getResponsiveValue(scale(64), scale(66), scale(68), scale(72)),
  '2xl': getResponsiveValue(scale(80), scale(82), scale(84), scale(88)),
  '3xl': getResponsiveValue(scale(96), scale(98), scale(100), scale(104)),
  profile: getResponsiveValue(scale(120), scale(122), scale(124), scale(128)),
  largeProfile: getResponsiveValue(scale(150), scale(152), scale(154), scale(158)),
};

// Enhanced responsive button sizes
export const buttonSizes = {
  sm: {
    height: getResponsiveValue(scale(36), scale(38), scale(40), scale(44)),
    paddingHorizontal: getResponsiveValue(scale(12), scale(13), scale(14), scale(16)),
    fontSize: fontSizes.sm,
  },
  base: {
    height: getResponsiveValue(scale(44), scale(46), scale(48), scale(52)),
    paddingHorizontal: getResponsiveValue(scale(16), scale(17), scale(18), scale(20)),
    fontSize: fontSizes.base,
  },
  lg: {
    height: getResponsiveValue(scale(52), scale(54), scale(56), scale(60)),
    paddingHorizontal: getResponsiveValue(scale(20), scale(22), scale(24), scale(28)),
    fontSize: fontSizes.lg,
  },
  xl: {
    height: getResponsiveValue(scale(60), scale(62), scale(64), scale(68)),
    paddingHorizontal: getResponsiveValue(scale(24), scale(26), scale(28), scale(32)),
    fontSize: fontSizes.xl,
  },
};

// Enhanced responsive input sizes
export const inputSizes = {
  sm: {
    height: getResponsiveValue(scale(36), scale(38), scale(40), scale(44)),
    fontSize: fontSizes.sm,
    paddingHorizontal: getResponsiveValue(scale(12), scale(13), scale(14), scale(16)),
  },
  base: {
    height: getResponsiveValue(scale(44), scale(46), scale(48), scale(52)),
    fontSize: fontSizes.base,
    paddingHorizontal: getResponsiveValue(scale(16), scale(17), scale(18), scale(20)),
  },
  lg: {
    height: getResponsiveValue(scale(52), scale(54), scale(56), scale(60)),
    fontSize: fontSizes.lg,
    paddingHorizontal: getResponsiveValue(scale(20), scale(22), scale(24), scale(28)),
  },
};

// Enhanced responsive container widths
export const containerWidths = {
  sm: isSmallDevice ? '90%' : '85%',
  base: isSmallDevice ? '95%' : '90%',
  lg: isSmallDevice ? '98%' : '95%',
  full: '100%',
};

// Enhanced responsive chart dimensions
export const chartDimensions = {
  width: SCREEN_WIDTH - getResponsiveValue(scale(32), scale(34), scale(36), scale(40)),
  height: getResponsiveValue(scale(250), scale(270), scale(290), scale(320)),
};

// Enhanced responsive modal dimensions
export const modalDimensions = {
  width: getResponsiveValue(SCREEN_WIDTH * 0.9, SCREEN_WIDTH * 0.85, SCREEN_WIDTH * 0.8, SCREEN_WIDTH * 0.7),
  height: getResponsiveValue(SCREEN_HEIGHT * 0.9, SCREEN_HEIGHT * 0.85, SCREEN_HEIGHT * 0.8, SCREEN_HEIGHT * 0.75),
};

// Enhanced responsive grid columns
export const gridColumns = {
  sm: 1,
  md: isTablet ? 2 : 1,
  lg: isTablet ? 3 : 2,
  xl: isTablet ? 4 : 3,
};

// Enhanced responsive line height
export const lineHeights = {
  tight: 1.2,
  base: 1.4,
  relaxed: 1.6,
  loose: 1.8,
};

// Enhanced responsive letter spacing
export const letterSpacing = {
  tight: -0.5,
  base: 0,
  wide: 0.5,
  wider: 1,
  widest: 2,
};

// New responsive header dimensions
export const headerDimensions = {
  height: getResponsiveValue(verticalScale(80), verticalScale(85), verticalScale(90), verticalScale(100)),
  paddingTop: getResponsiveValue(verticalScale(50), verticalScale(55), verticalScale(60), verticalScale(70)),
  titleSize: getResponsiveValue(fontSizes['3xl'], fontSizes['4xl'], fontSizes['4xl'], fontSizes['5xl']),
  subtitleSize: getResponsiveValue(fontSizes.base, fontSizes.lg, fontSizes.lg, fontSizes.xl),
  profileSize: getResponsiveValue(scale(50), scale(52), scale(54), scale(60)),
};

// New responsive navigation dimensions
export const navigationDimensions = {
  height: getResponsiveValue(verticalScale(75), verticalScale(80), verticalScale(85), verticalScale(95)),
  iconSize: getResponsiveValue(scale(24), scale(26), scale(28), scale(32)),
  activeIconSize: getResponsiveValue(scale(28), scale(30), scale(32), scale(36)),
  labelSize: getResponsiveValue(scale(10), scale(11), scale(12), scale(14)),
}; 