import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import Welcome from './src/Welcome'
import Home from './src/Home'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
// import { create } from 'react-native/types_generated/Libraries/ReactNative/ReactFabricPublicInstance/ReactNativeAttributePayload'

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName = "Welcome" screenOptions = {{headerShown:false}}>
        <Stack.Screen name = 'Welcome' component = {Welcome}/>
        <Stack.Screen name = 'Home' component = {Home}/>
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App

const styles = StyleSheet.create({

})