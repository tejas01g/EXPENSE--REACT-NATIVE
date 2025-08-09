import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { View, Text, StyleSheet } from 'react-native';
import { scale, verticalScale, spacing, navigationDimensions } from '../utils/responsive';

import Home from '../Home';
import Expense from '../Expense';
import Add from '../Add';
import Analytics from '../Analytics';
import Profile from '../Profile';
import CustomTabBar from '../components/CustomTabBar';

const Tab = createBottomTabNavigator();

// Enhanced Custom Icon Component with animations
const CustomTabIcon = ({ route, focused, color, size }) => {
  let iconName;
  let iconColor = focused ? '#00e0ff' : '#666';
  let iconSize = focused ? navigationDimensions.activeIconSize : navigationDimensions.iconSize;

  // Enhanced icon mapping with better visual hierarchy
  switch (route.name) {
    case 'Home':
      iconName = focused ? 'home' : 'home-outline';
      iconColor = focused ? '#00e0ff' : '#888';
      break;
    case 'Expense':
      iconName = focused ? 'wallet' : 'wallet-outline';
      iconColor = focused ? '#00e0ff' : '#888';
      break;
    case 'Add':
      iconName = focused ? 'add-circle' : 'add-circle-outline';
      iconSize = focused ? navigationDimensions.activeIconSize + scale(4) : navigationDimensions.iconSize + scale(2);
      iconColor = focused ? '#00e0ff' : '#888';
      break;
    case 'Analytics':
      iconName = focused ? 'bar-chart' : 'bar-chart-outline';
      iconColor = focused ? '#00e0ff' : '#888';
      break;
    case 'Profile':
      iconName = focused ? 'person-circle' : 'person-circle-outline';
      iconColor = focused ? '#00e0ff' : '#888';
      break;
    default:
      iconName = 'help-outline';
  }

  return (
    <View style={[styles.iconContainer, focused && styles.activeIconContainer]}>
      <View style={[styles.iconWrapper, focused && styles.activeIconWrapper]}>
        <Ionicons 
          name={iconName} 
          size={iconSize} 
          color={iconColor} 
          style={[styles.icon, focused && styles.activeIcon]}
        />
      </View>
      {focused && (
        <>
          <View style={styles.activeIndicator} />
          <View style={styles.activeGlow} />
        </>
      )}
    </View>
  );
};

const BottomTabs = () => {
  const renderTabIcon = ({ route, focused, color, size }) => (
    <CustomTabIcon 
      route={route} 
      focused={focused} 
      color={color} 
      size={size} 
    />
  );

  const renderTabLabel = ({ route, focused, color }) => (
    <Text style={[
      styles.tabLabel, 
      focused ? styles.activeTabLabel : styles.inactiveTabLabel
    ]}>
      {route.name}
    </Text>
  );

  const renderTabBar = (props) => <CustomTabBar {...props} />;

  return (
    <Tab.Navigator
      tabBar={renderTabBar}
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#00e0ff',
        tabBarInactiveTintColor: '#666',
        tabBarStyle: {
          backgroundColor: 'transparent',
          borderWidth: 0,
          elevation: 0,
          height: navigationDimensions.height,
          paddingBottom: verticalScale(12),
          paddingTop: verticalScale(10),
        },
        tabBarIcon: ({ focused, color, size }) => renderTabIcon({ route, focused, color, size }),
        tabBarLabel: ({ focused, color }) => renderTabLabel({ route, focused, color }),
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={Home}
        options={{
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen 
        name="Expense" 
        component={Expense}
        options={{
          tabBarLabel: 'Expenses',
        }}
      />
      <Tab.Screen 
        name="Add" 
        component={Add}
        options={{
          tabBarLabel: 'Add',
        }}
      />
      <Tab.Screen 
        name="Analytics" 
        component={Analytics}
        options={{
          tabBarLabel: 'Analytics',
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={Profile}
        options={{
          tabBarLabel: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xs,
    position: 'relative',
    minHeight: verticalScale(50),
  },
  activeIconContainer: {
    transform: [{ scale: 1.05 }],
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xs,
    borderRadius: scale(12),
  },
  activeIconWrapper: {
    backgroundColor: 'rgba(0, 224, 255, 0.1)',
    borderRadius: scale(16),
  },
  icon: {
    marginBottom: spacing.xs,
  },
  activeIcon: {
    shadowColor: '#00e0ff',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -verticalScale(6),
    width: scale(6),
    height: scale(6),
    borderRadius: scale(3),
    backgroundColor: '#00e0ff',
    shadowColor: '#00e0ff',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  activeGlow: {
    position: 'absolute',
    bottom: -verticalScale(8),
    width: scale(12),
    height: scale(12),
    borderRadius: scale(6),
    backgroundColor: 'rgba(0, 224, 255, 0.2)',
  },
  tabLabel: {
    marginTop: spacing.xs,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  activeTabLabel: {
    color: '#00e0ff',
    fontFamily: 'Montserrat-SemiBold',
    fontSize: navigationDimensions.labelSize,
  },
  inactiveTabLabel: {
    color: '#888',
    fontFamily: 'Montserrat-Regular',
    fontSize: navigationDimensions.labelSize - 1,
  },
});

export default BottomTabs;
