import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screens/onboarding/SplashScreen';
import CreateAccountScreen from '../screens/onboarding/CreateAccountScreen';
import GenderScreen from '../screens/onboarding/GenderScreen';

// All screen names declared upfront — screens are added to the navigator as they are built
export type RootStackParamList = {
  Splash: undefined;
  CreateAccount: undefined;
  Gender: undefined;
  AboutYou: undefined;
  Goal: undefined;
  Done: undefined;
  Home: undefined;
  Nutrition: undefined;
  Workouts: undefined;
  Progress: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="CreateAccount" component={CreateAccountScreen} />
      <Stack.Screen name="Gender" component={GenderScreen} />
    </Stack.Navigator>
  );
}