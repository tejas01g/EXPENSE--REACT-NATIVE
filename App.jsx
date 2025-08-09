import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './src/firebaseConfig';

import Welcome from './src/Welcome';
import Login from './src/Authentication/Login';
import Signup from './src/Authentication/Signup';
import BottomTabs from './src/Navigation/BottomTabs';

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
  );
};

export default App;
