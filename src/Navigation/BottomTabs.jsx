import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Home from '../Home';
import Expense from '../Expense';
import Add from '../Add';
import Analytics from '../Analytics';
import Profile from '../Profile';
import CustomTabBar from '../components/CustomTabBar'; // ✅ import your custom tab bar

const Tab = createBottomTabNavigator();

const BottomTabs = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />} // ✅ use custom tab bar
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#130685ff',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle:{
          backgroundColor:'transparent',
          borderWidth:0,
          elevation:0,
        },
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Home') iconName = 'home-outline';
          else if (route.name === 'Expense') iconName = 'wallet-outline';
          else if (route.name === 'Add') iconName = 'add-circle-outline';
          else if (route.name === 'Analytics') iconName = 'bar-chart-outline';
          else if (route.name === 'Profile') iconName = 'person-outline';

          return <Ionicons name={iconName} size={28} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Expense" component={Expense} />
      <Tab.Screen name="Add" component={Add} />
      <Tab.Screen name="Analytics" component={Analytics} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
};

export default BottomTabs;
