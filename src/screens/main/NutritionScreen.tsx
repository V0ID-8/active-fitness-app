import { View, Text } from 'react-native';
import { Colors, Fonts } from '../../constants';

export default function NutritionScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontFamily: Fonts.body, color: Colors.textSecondary }}>
        Nutrition — coming in Step 10
      </Text>
    </View>
  );
}