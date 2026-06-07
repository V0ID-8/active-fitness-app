import { View, Text } from 'react-native';
import { Colors, Fonts } from '../../constants';

export default function WorkoutsScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontFamily: Fonts.body, color: Colors.textSecondary }}>
        Workouts — coming in Step 9
      </Text>
    </View>
  );
}