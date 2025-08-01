import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { BottomTabBar } from '@react-navigation/bottom-tabs';
import LinearGradient from 'react-native-linear-gradient';
import {
  scale,
  verticalScale,
  borderRadius,
  screenDimensions,
} from '../utils/responsive';

const CustomTabBar = (props) => {
  return (
    <View style={styles.wrapper}>
      <LinearGradient
        colors={['rgba(0, 0, 0, 0.95)', 'rgba(0, 0, 0, 0.98)', '#000']}
        style={StyleSheet.absoluteFill}
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
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  tabBar: {
    backgroundColor: 'transparent',
    elevation: 0,
    shadowOpacity: 0,
    borderTopWidth: 0,
  },
  tabBarStyle: {
    backgroundColor: 'transparent',
    paddingBottom: Platform.OS === 'ios' ? verticalScale(20) : verticalScale(10),
    paddingTop: verticalScale(10),
    height: Platform.OS === 'ios' ? verticalScale(90) : verticalScale(70),
    borderTopWidth: 0,
    elevation: 0,
    shadowOpacity: 0,
  },
  tabLabel: {
    fontSize: scale(10),
    fontFamily: 'Montserrat-Regular',
    marginTop: scale(4),
  },
  tabIcon: {
    width: scale(24),
    height: scale(24),
  },
});

export default CustomTabBar;
