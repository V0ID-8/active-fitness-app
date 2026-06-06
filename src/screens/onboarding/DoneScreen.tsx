import { View, Text } from 'react-native';
import { Colors, Fonts } from '../../constants';

// Placeholder — replaced in Step 7
export default function DoneScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontFamily: Fonts.body, color: Colors.textSecondary }}>
        All Set Screen — coming in Step 7
      </Text>
    </View>
  );
}