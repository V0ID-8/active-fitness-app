import { View, Text } from 'react-native';
import { Colors, Fonts } from '../../constants';

// Placeholder — replaced in Step 5
export default function AboutYouScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontFamily: Fonts.body, color: Colors.textSecondary }}>
        About You Screen — coming in Step 5
      </Text>
    </View>
  );
}