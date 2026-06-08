import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainNavigator from './MainNavigator';
import FoodSearchScreen from '../screens/main/FoodSearchScreen';
import ExercisePickerScreen from '../screens/main/ExercisePickerScreen';
import { MealType } from '../types';

export type MainStackParamList = {
  Tabs: undefined;
  FoodSearch: { mealType: MealType; date: string };
  ExercisePicker: { date: string; sessionId: string | null };
};

const Stack = createNativeStackNavigator<MainStackParamList>();

export default function MainStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={MainNavigator} />
      <Stack.Screen
        name="FoodSearch"
        component={FoodSearchScreen}
        options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
      />
      <Stack.Screen
        name="ExercisePicker"
        component={ExercisePickerScreen}
        options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
      />
    </Stack.Navigator>
  );
}
