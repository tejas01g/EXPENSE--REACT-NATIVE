import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { BottomTabBar } from '@react-navigation/bottom-tabs';
import LinearGradient from 'react-native-linear-gradient';
import {
  scale,
  verticalScale,
  navigationDimensions,
} from '../utils/responsive';

const CustomTabBar = (props) => {
  return (
    <View style={styles.wrapper}>
      {/* Enhanced gradient background */}
      <LinearGradient
        colors={[
          'rgba(0, 0, 0, 0.95)', 
          'rgba(0, 0, 0, 0.98)', 
          'rgba(0, 0, 0, 0.99)',
          '#000'
        ]}
        style={StyleSheet.absoluteFill}
      />
      
      {/* Subtle top border with gradient */}
      <LinearGradient
        colors={['rgba(0, 224, 255, 0.3)', 'rgba(0, 224, 255, 0.1)', 'transparent']}
        style={styles.topBorder}
      />
      
      <BottomTabBar 
        {...props} 
        style={styles.tabBar}
        tabBarOptions={{
          style: styles.tabBarStyle,
          activeTintColor: '#00e0ff',
          inactiveTintColor: '#666',
          labelStyle: styles.tabLabel,
          iconStyle: styles.tabIcon,
        }}
      />
      
      {/* Bottom safety area for iOS */}
      {Platform.OS === 'ios' && (
        <View style={styles.safetyArea} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
    borderTopWidth: 0,
  },
  topBorder: {
    height: 1,
    width: '100%',
  },
  tabBar: {
    backgroundColor: 'transparent',
    elevation: 0,
    shadowOpacity: 0,
    borderTopWidth: 0,
  },
  tabBarStyle: {
    backgroundColor: 'transparent',
    paddingBottom: Platform.OS === 'ios' ? verticalScale(25) : verticalScale(15),
    paddingTop: verticalScale(12),
    height: navigationDimensions.height,
    borderTopWidth: 0,
    elevation: 0,
    shadowOpacity: 0,
    // Add subtle shadow for depth
    shadowColor: '#00e0ff',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowRadius: 8,
  },
  tabLabel: {
    fontSize: navigationDimensions.labelSize,
    fontFamily: 'Montserrat-Regular',
    marginTop: scale(4),
    fontWeight: '500',
  },
  tabIcon: {
    width: navigationDimensions.iconSize,
    height: navigationDimensions.iconSize,
  },
  safetyArea: {
    height: Platform.OS === 'ios' ? 20 : 0,
    backgroundColor: '#000',
  },
});

export default CustomTabBar;
