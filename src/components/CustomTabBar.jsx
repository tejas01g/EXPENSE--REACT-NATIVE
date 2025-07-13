import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BottomTabBar } from '@react-navigation/bottom-tabs';
import LinearGradient from 'react-native-linear-gradient';

const CustomTabBar = (props) => {
  return (
    <View style={styles.wrapper}>
      {/* <LinearGradient
        colors={['#00008b', '#483d8b', '#9400d3']}
        style={StyleSheet.absoluteFill} // Makes the gradient fill entire wrapper
      /> */}
      
      <BottomTabBar {...props} />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    overflow: 'hidden', // important for Android
    backgroundColor:'black'
  },
});

export default CustomTabBar;
