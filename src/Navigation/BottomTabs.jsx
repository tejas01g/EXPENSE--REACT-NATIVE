import { View, Text } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons';
import React from 'react'
import Home from '../Home';
import Expense from '../Expense';
import Add from '../Add';
import Analytics from '../Analytics';
import Profile from '../Profile';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();
const BottomTabs = () => {
  return (
    <Tab.Navigator
    screenOptions = {({route}) => ({
        headerShown:false,
        tabBarActiveTintColor: '#4caf50',
        tabBarInactiveTintColor: 'gray',
        tabBarIcon: ({ color, size}) => {
            let iconName;
            if(route.name === 'Home') iconName = 'home-outline';
            else if (route.name === 'Expense') iconName = 'wallet-outline';
            else if (route.name === 'Add') iconName = 'add-circle-outline';
            else if (route.name === 'Analytics') iconName = 'bar-chart-outline';
            else if (route.name === 'Profile') iconName = 'person-outline';

            return <Ionicons name={iconName} size={22} color= {color} />;
            
        },
        
    })}
    >

        <Tab.Screen name = 'Home' component ={Home}/>
        <Tab.Screen name = 'Expense' component ={Expense}/>
        <Tab.Screen name = 'Add' component ={Add}/>
        <Tab.Screen name = 'Analytics' component ={Analytics}/>
        <Tab.Screen name = 'Profile' component ={Profile}/>
    </Tab.Navigator>
  );
};

export default BottomTabs;