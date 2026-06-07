import { View, Text } from 'react-native';
import { Colors, Fonts } from '../../constants';

export default function ProfileScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontFamily: Fonts.body, color: Colors.textSecondary }}>
        Profile — coming in Step 12
      </Text>
    </View>
  );
}