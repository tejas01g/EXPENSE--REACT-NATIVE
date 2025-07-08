import { View, Text } from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';

const Add = () => {
  return (
    <LinearGradient
      colors={['#00008b', '#483d8b', '#9400d3']}
      style={{ flex: 1 }}
    >
      <View>
        <Text>Add</Text>
      </View>
    </LinearGradient>
  );
};

export default Add;
