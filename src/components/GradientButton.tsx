import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Gradients, Fonts, Spacing, Shadows } from '../constants';

type Props = {
  label: string;
  onPress: () => void;
  style?: ViewStyle;
};

export default function GradientButton({ label, onPress, style }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.88}
      style={[styles.wrapper, style]}
    >
      <LinearGradient
        colors={Gradients.primary.colors}
        start={Gradients.primary.start}
        end={Gradients.primary.end}
        style={styles.gradient}
      >
        <Text style={styles.label}>{label}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: Spacing.buttonRadius,
    ...Shadows.gradientButton,
    width: '100%',
  },
  gradient: {
    height: 60,
    borderRadius: Spacing.buttonRadius,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontFamily: Fonts.body,
    fontSize: 18,
    fontWeight: '700',
    color: Colors.white,
  },
});