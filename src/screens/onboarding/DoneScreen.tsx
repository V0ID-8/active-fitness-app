import { useState } from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Fonts, FontSizes, Spacing, Gradients } from '../../constants';
import GradientButton from '../../components/GradientButton';
import { CheckIcon, FlameIcon, HeartIcon, MuscleIcon } from '../../components/Icon';
import { authService, getAuthErrorMessage } from '../../services/authService';
import { onboardingStore } from '../../utils/onboardingStore';

const SUMMARY = [
  { Icon: FlameIcon,  label: 'Goal',    value: 'Gain Muscle'   },
  { Icon: HeartIcon,  label: 'Fitness', value: 'Intermediate'  },
  { Icon: MuscleIcon, label: 'Plan',    value: '5 days / week' },
];

export default function DoneScreen() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleStart() {
    setError('');
    setLoading(true);
    try {
      await authService.signUp(
        onboardingStore.email,
        onboardingStore.password,
        onboardingStore.displayName || 'Active User',
      );
      // useAuth in App.tsx detects the Firebase auth state change and
      // automatically switches the navigator to MainNavigator — no navigation.reset needed.
    } catch (e: any) {
      setError(getAuthErrorMessage(e.code));
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.body}>

        {/* Hero: gradient ring + check */}
        <View style={styles.heroWrap}>
          <LinearGradient
            colors={Gradients.primary.colors}
            start={Gradients.primary.start}
            end={Gradients.primary.end}
            style={styles.ring}
          >
            <View style={styles.ringInner}>
              <CheckIcon size={38} color={Colors.white} />
            </View>
          </LinearGradient>
        </View>

        {/* Headline */}
        <Text style={styles.headline}>You're{'\n'}all set.</Text>
        <Text style={styles.sub}>
          Your personalised plan is ready. Time to get to work.
        </Text>

        {/* Summary rows */}
        <View style={styles.summaryBox}>
          {SUMMARY.map(({ Icon, label, value }, i) => (
            <View key={label} style={[styles.summaryRow, i === SUMMARY.length - 1 && styles.summaryRowLast]}>
              <View style={styles.summaryIcon}>
                <Icon size={18} color={Colors.pink} />
              </View>
              <Text style={styles.summaryLabel}>{label}</Text>
              <Text style={styles.summaryValue}>{value}</Text>
            </View>
          ))}
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <View style={styles.footer}>
          {loading ? (
            <ActivityIndicator color={Colors.pink} size="large" />
          ) : (
            <GradientButton label="Start my plan" onPress={handleStart} />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  body: {
    flex: 1,
    paddingHorizontal: Spacing.screenHorizontalOnboarding,
    paddingTop: 40,
    paddingBottom: 20,
  },
  heroWrap: {
    alignItems: 'center',
    marginBottom: 36,
  },
  ring: {
    width: 110,
    height: 110,
    borderRadius: 55,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringInner: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: 'rgba(0,0,0,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headline: {
    fontFamily: Fonts.display,
    fontSize: FontSizes.onboardingHeadline,
    color: Colors.white,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  sub: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.body,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: 36,
  },
  summaryBox: {
    backgroundColor: Colors.surface,
    borderRadius: Spacing.cardRadius,
    paddingVertical: 6,
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  summaryRowLast: {
    borderBottomWidth: 0,
  },
  summaryIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.surfaceRaised,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryLabel: {
    flex: 1,
    fontFamily: Fonts.body,
    fontSize: FontSizes.body,
    color: Colors.textSecondary,
  },
  summaryValue: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.body,
    fontWeight: '700',
    color: Colors.white,
  },
  errorText: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.label,
    color: Colors.danger,
    textAlign: 'center',
    marginBottom: 12,
  },
  footer: {
    marginTop: 'auto',
    paddingBottom: 4,
  },
});
