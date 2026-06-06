import { View, Text } from 'react-native';
import { Colors, Fonts } from '../../constants';

// Placeholder — replaced in Step 6
export default function GoalScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontFamily: Fonts.body, color: Colors.textSecondary }}>
        Goal Screen — coming in Step 6
      </Text>
    </View>
  );
}