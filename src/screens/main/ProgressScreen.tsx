import { View, Text } from 'react-native';
import { Colors, Fonts } from '../../constants';

export default function ProgressScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontFamily: Fonts.body, color: Colors.textSecondary }}>
        Progress — coming in Step 11
      </Text>
    </View>
  );
}
