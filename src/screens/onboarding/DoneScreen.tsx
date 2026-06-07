import { useState } from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Fonts, FontSizes, Spacing, Gradients } from '../../constants';
import GradientButton from '../../components/GradientButton';
import { CheckIcon, FlameIcon, BoltIcon, MuscleIcon } from '../../components/Icon';
import { authService, getAuthErrorMessage } from '../../services/authService';
import { userService } from '../../services/userService';
import { onboardingStore } from '../../utils/onboardingStore';
import { calculateFullProfile } from '../../utils/calculations';
import { Goal } from '../../types';

const GOAL_LABELS: Record<Goal, string> = {
  lose: 'Lose Weight',
  gain: 'Gain Muscle',
  fit:  'Keep Fit',
};

export default function DoneScreen() {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  // Calculate real targets from the data collected in onboarding
  const calc = calculateFullProfile(
    onboardingStore.gender,
    onboardingStore.weightKg,
    onboardingStore.heightCm,
    onboardingStore.age,
    onboardingStore.activityLevel,
    onboardingStore.goal,
  );

  const summary = [
    {
      Icon:  FlameIcon,
      label: 'Goal',
      value: GOAL_LABELS[onboardingStore.goal],
    },
    {
      Icon:  BoltIcon,
      label: 'Daily calories',
      value: `${calc.calorieGoal.toLocaleString()} kcal`,
    },
    {
      Icon:  MuscleIcon,
      label: 'Protein target',
      value: `${calc.proteinGoalG} g / day`,
    },
  ];

  async function handleStart() {
    setError('');
    setLoading(true);
    try {
      const user = await authService.signUp(
        onboardingStore.email,
        onboardingStore.password,
        onboardingStore.displayName || 'Active User',
      );

      await userService.createUserProfile(user.uid, {
        email:          onboardingStore.email,
        displayName:    onboardingStore.displayName || 'Active User',
        gender:         onboardingStore.gender,
        age:            onboardingStore.age,
        heightCm:       onboardingStore.heightCm,
        weightKg:       onboardingStore.weightKg,
        goal:           onboardingStore.goal,
        activityLevel:  onboardingStore.activityLevel,
        bmr:            calc.bmr,
        tdee:           calc.tdee,
        calorieGoal:    calc.calorieGoal,
        proteinGoalG:   calc.proteinGoalG,
        carbGoalG:      calc.carbGoalG,
        fatGoalG:       calc.fatGoalG,
      });
      // Firebase auth state change → App.tsx switches to MainNavigator automatically
    } catch (e: any) {
      setError(getAuthErrorMessage(e.code));
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.body}>

        {/* Hero */}
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

        <Text style={styles.headline}>You're{'\n'}all set.</Text>
        <Text style={styles.sub}>
          Your personalised plan is ready. Time to get to work.
        </Text>

        {/* Real calculated summary */}
        <View style={styles.summaryBox}>
          {summary.map(({ Icon, label, value }, i) => (
            <View
              key={label}
              style={[styles.summaryRow, i === summary.length - 1 && styles.summaryRowLast]}
            >
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
