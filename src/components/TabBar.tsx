import { TouchableOpacity, StyleSheet, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Gradients, Colors, Fonts } from '../constants';
import {
  HomeIcon, DumbbellIcon, NutritionIcon, BarChartIcon, UserIcon,
} from './Icon';

// Map each tab name to its icon component
const TABS = [
  { name: 'Home',      Icon: HomeIcon,      label: 'Home'      },
  { name: 'Workouts',  Icon: DumbbellIcon,  label: 'Workouts'  },
  { name: 'Nutrition', Icon: NutritionIcon, label: 'Nutrition' },
  { name: 'Progress',  Icon: BarChartIcon,  label: 'Progress'  },
  { name: 'Profile',   Icon: UserIcon,      label: 'Profile'   },
];

export default function TabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <LinearGradient
      colors={Gradients.primaryHorizontal.colors}
      start={Gradients.primaryHorizontal.start}
      end={Gradients.primaryHorizontal.end}
      // Sits 26px above the home indicator / screen edge
      style={[styles.bar, { bottom: 26 + insets.bottom * 0.5 }]}
    >
      {TABS.map((tab, index) => {
        const focused = state.index === index;

        return (
          <TouchableOpacity
            key={tab.name}
            style={styles.tab}
            onPress={() => navigation.navigate(tab.name)}
            activeOpacity={0.75}
          >
            <tab.Icon
              size={23}
              color={focused ? Colors.white : 'rgba(255,255,255,0.45)'}
            />
            <Text style={[styles.label, !focused && styles.labelDim]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    left: 20,
    right: 20,
    height: 66,
    borderRadius: 33,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    // Gradient shadow
    shadowColor: '#810EFF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.55,
    shadowRadius: 20,
    elevation: 16,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    paddingVertical: 6,
  },
  label: {
    fontFamily: Fonts.body,
    fontSize: 10,
    color: Colors.white,
  },
  labelDim: {
    color: 'rgba(255,255,255,0.45)',
  },
});