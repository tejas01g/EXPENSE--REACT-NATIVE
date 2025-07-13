import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Welcome from './src/Welcome';
import Home from './src/Home';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Profile from './src/Profile';
import BottomTabs from './src/Navigation/BottomTabs';
import Login from './src/Authentication/Login';
import Signup from './src/Authentication/Signup';
// import { create } from 'react-native/types_generated/Libraries/ReactNative/ReactFabricPublicInstance/ReactNativeAttributePayload'

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Welcome" component={Welcome} />
        <Stack.Screen name ='Login' component={Login}/>
        <Stack.Screen name ='Signup' component={Signup}/>
        <Stack.Screen name="Main" component={BottomTabs} />
        {/* <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Profile" component={Profile} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
