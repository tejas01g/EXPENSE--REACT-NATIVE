import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './src/firebaseConfig';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
// Import GestureHandlerRootView
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import Welcome from './src/Welcome';
import Login from './src/Authentication/Login';
import Signup from './src/Authentication/Signup';
import BottomTabs from './src/Navigation/BottomTabs';

// Add this import at the very top for Android gesture support
import 'react-native-gesture-handler';

GoogleSignin.configure({
  webClientId: "111740839007-6dcip2tbhqvatn5r5nseslm7om54vdur.apps.googleusercontent.com",
});

const Stack = createNativeStackNavigator();

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return unsubscribe; // cleanup
  }, []);

  if (loading) return null; // or splash screen

  return (
    // Wrap everything with GestureHandlerRootView
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {!user ? (
            <>
              <Stack.Screen name="Welcome" component={Welcome} />
              <Stack.Screen name="Login" component={Login} />
              <Stack.Screen name="Signup" component={Signup} />
            </>
          ) : (
            <Stack.Screen name="Main" component={BottomTabs} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

export default App;