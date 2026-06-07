import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screens/onboarding/SplashScreen';
import CreateAccountScreen from '../screens/onboarding/CreateAccountScreen';
import GenderScreen from '../screens/onboarding/GenderScreen';
import AboutYouScreen from '../screens/onboarding/AboutYouScreen';
import GoalScreen from '../screens/onboarding/GoalScreen';
import DoneScreen from '../screens/onboarding/DoneScreen';
import MainNavigator from './MainNavigator';

export type RootStackParamList = {
  Splash: undefined;
  CreateAccount: undefined;
  Gender: undefined;
  AboutYou: undefined;
  Goal: undefined;
  Done: undefined;
  Home: undefined; // renders the full tab navigator
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
    >
      <Stack.Screen name="Splash"         component={SplashScreen}         />
      <Stack.Screen name="CreateAccount"  component={CreateAccountScreen}  />
      <Stack.Screen name="Gender"         component={GenderScreen}         />
      <Stack.Screen name="AboutYou"       component={AboutYouScreen}       />
      <Stack.Screen name="Goal"           component={GoalScreen}           />
      <Stack.Screen name="Done"           component={DoneScreen}           />
      {/* Home renders the tab navigator — all main app screens live inside it */}
      <Stack.Screen name="Home"           component={MainNavigator}        />
    </Stack.Navigator>
  );
}