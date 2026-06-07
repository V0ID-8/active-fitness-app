import { useCallback } from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts, Anton_400Regular } from '@expo-google-fonts/anton';
import { InclusiveSans_400Regular } from '@expo-google-fonts/inclusive-sans';
import * as ExpoSplashScreen from 'expo-splash-screen';
import RootNavigator from './src/navigation';
import MainNavigator from './src/navigation/MainNavigator';
import { useAuth } from './src/hooks/useAuth';

// Keep the native splash screen visible while fonts and auth state load
ExpoSplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = useFonts({
    Anton_400Regular,
    InclusiveSans_400Regular,
  });

  const { user, loading: authLoading } = useAuth();

  const onLayout = useCallback(async () => {
    if (fontsLoaded && !authLoading) {
      await ExpoSplashScreen.hideAsync();
    }
  }, [fontsLoaded, authLoading]);

  // Wait for fonts AND Firebase auth state before rendering
  if (!fontsLoaded || authLoading) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <View style={{ flex: 1 }} onLayout={onLayout}>
        <NavigationContainer>
          {user ? <MainNavigator /> : <RootNavigator />}
        </NavigationContainer>
      </View>
    </SafeAreaProvider>
  );
}
