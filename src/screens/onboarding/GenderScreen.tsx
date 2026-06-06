import { View, Text } from 'react-native';
import { Colors, Fonts } from '../../constants';

// Placeholder — replaced in Step 4
export default function GenderScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontFamily: Fonts.body, color: Colors.textSecondary }}>
        Gender Screen — coming in Step 4
      </Text>
    </View>
  );
}