import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { MobileAppProvider } from './src/context/MobileAppContext';
import { RootNavigator } from './src/navigation/RootNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <MobileAppProvider>
        <NavigationContainer>
          <RootNavigator />
          <StatusBar style="dark" />
        </NavigationContainer>
      </MobileAppProvider>
    </SafeAreaProvider>
  );
}

