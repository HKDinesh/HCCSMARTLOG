import React, { useEffect } from 'react';
import { Alert, Platform } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import StaffLogin from './src/component/StaffLogin';
import LoginPage from './src/component/LoginPage';
import StaffCode from './src/component/StaffCode';
import Absentlist from './src/component/Absentlist';

const Stack = createStackNavigator();

const App = () => {
  useEffect(() => {
    const requestPermissionAndToken = async () => {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        const token = await messaging().getToken();
        console.log('FCM Token:', token);
        // You can save this token to your DB if needed
      }
    };

    // Foreground notifications
    const unsubscribeForeground = messaging().onMessage(async remoteMessage => {
      Alert.alert('HCC SMARTLOG', remoteMessage.notification?.body || 'No message');
    });

    // Background & quit state handling (Android only)
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in background!', remoteMessage);
    });

    requestPermissionAndToken();

    return () => {
      unsubscribeForeground(); // Clean up the listener on unmount
    };
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="HCC Trichy">
          <Stack.Screen name="HCC Trichy" component={LoginPage} options={{ headerShown: false }} />
          <Stack.Screen
            name="StaffUser"
            component={StaffCode}
            options={{
              title: 'Staff Profile',
              gestureEnabled: false,
              headerLeft: () => null
            }}
          />
          <Stack.Screen name="Student" component={StaffLogin} />
          <Stack.Screen name="Absent" component={Absentlist} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

export default App;
