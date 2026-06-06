import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Svg, { Polyline } from 'react-native-svg';
import { Colors, Fonts } from '../constants';

type Props = {
  step: number;
  total?: number;
  onBack: () => void;
};

export default function TopNav({ step, total = 4, onBack }: Props) {
  return (
    <View style={styles.nav}>
      <TouchableOpacity
        onPress={onBack}
        style={styles.back}
        hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
      >
        <Svg width={17} height={17} viewBox="0 0 24 24" fill="none">
          <Polyline
            points="15 18 9 12 15 6"
            stroke={Colors.white}
            strokeWidth={2.4}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      </TouchableOpacity>

      <View style={styles.segments}>
        {Array.from({ length: total }).map((_, i) => (
          <View key={i} style={[styles.seg, i < step && styles.segActive]} />
        ))}
      </View>

      <Text style={styles.stepLabel}>
        {step}/{total}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 8,
    gap: 12,
  },
  back: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segments: {
    flex: 1,
    flexDirection: 'row',
    gap: 6,
  },
  seg: {
    flex: 1,
    height: 4,
    borderRadius: 99,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  segActive: {
    backgroundColor: Colors.white,
  },
  stepLabel: {
    fontFamily: Fonts.body,
    fontSize: 13,
    color: Colors.textSecondary,
  },
});