import { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation';
import { Colors, Fonts, FontSizes, Spacing, Gradients } from '../../constants';
import { onboardingStore } from '../../utils/onboardingStore';
import TopNav from '../../components/TopNav';
import GradientButton from '../../components/GradientButton';
import { FlameIcon, MuscleIcon, HeartIcon, CheckIcon } from '../../components/Icon';
import { ActivityLevel } from '../../types';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Goal'>;
};

type GoalKey = 'lose' | 'gain' | 'fit';

const GOAL_OPTIONS: { key: GoalKey; icon: React.ReactNode; title: string; subtitle: string }[] = [
  { key: 'lose', icon: <FlameIcon  size={26} color={Colors.white} />, title: 'Lose Weight',  subtitle: 'Burn fat with a calorie deficit'  },
  { key: 'gain', icon: <MuscleIcon size={26} color={Colors.white} />, title: 'Gain Muscle',  subtitle: 'Build strength and lean mass'     },
  { key: 'fit',  icon: <HeartIcon  size={26} color={Colors.white} />, title: 'Keep Fit',     subtitle: 'Maintain a healthy, active body'  },
];

const ACTIVITY_OPTIONS: { key: ActivityLevel; title: string; subtitle: string }[] = [
  { key: 'sedentary', title: 'Sedentary', subtitle: 'Desk job, little movement'  },
  { key: 'light',     title: 'Light',     subtitle: '1–3 workouts per week'      },
  { key: 'moderate',  title: 'Moderate',  subtitle: '3–5 workouts per week'      },
  { key: 'active',    title: 'Active',    subtitle: '6–7 workouts per week'      },
];

function GoalRow({
  icon, title, subtitle, selected, onPress,
}: { icon: React.ReactNode; title: string; subtitle: string; selected: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity style={[styles.option, selected && styles.optionSelected]} onPress={onPress} activeOpacity={0.85}>
      {selected ? (
        <LinearGradient colors={Gradients.primary.colors} start={Gradients.primary.start} end={Gradients.primary.end} style={styles.iconChipGrad}>
          {icon}
        </LinearGradient>
      ) : (
        <View style={styles.iconChipPlain}>{icon}</View>
      )}
      <View style={styles.optionText}>
        <Text style={styles.optionTitle}>{title}</Text>
        <Text style={styles.optionSub}>{subtitle}</Text>
      </View>
      {selected ? (
        <LinearGradient colors={Gradients.primary.colors} start={Gradients.primary.start} end={Gradients.primary.end} style={styles.radioGrad}>
          <CheckIcon size={13} color={Colors.white} />
        </LinearGradient>
      ) : (
        <View style={styles.radioEmpty} />
      )}
    </TouchableOpacity>
  );
}

export default function GoalScreen({ navigation }: Props) {
  const [selectedGoal,     setSelectedGoal]     = useState<GoalKey>('gain');
  const [selectedActivity, setSelectedActivity] = useState<ActivityLevel>('moderate');

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.body}>
        <TopNav step={4} onBack={() => navigation.goBack()} />

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {/* Goal */}
          <Text style={styles.headline}>What's{'\n'}your goal?</Text>
          <Text style={styles.sub}>Pick one — you can change it anytime.</Text>
          <View style={styles.options}>
            {GOAL_OPTIONS.map((o) => (
              <GoalRow
                key={o.key}
                icon={o.icon}
                title={o.title}
                subtitle={o.subtitle}
                selected={selectedGoal === o.key}
                onPress={() => setSelectedGoal(o.key)}
              />
            ))}
          </View>

          {/* Activity level */}
          <Text style={styles.sectionTitle}>Activity level</Text>
          <Text style={styles.sectionSub}>How active are you on a typical week?</Text>
          <View style={styles.activityGrid}>
            {ACTIVITY_OPTIONS.map((o) => (
              <TouchableOpacity
                key={o.key}
                style={[styles.activityChip, selectedActivity === o.key && styles.activityChipActive]}
                onPress={() => setSelectedActivity(o.key)}
                activeOpacity={0.8}
              >
                <Text style={[styles.activityTitle, selectedActivity === o.key && styles.activityTitleActive]}>
                  {o.title}
                </Text>
                <Text style={styles.activitySub}>{o.subtitle}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <GradientButton
            label="Create my plan"
            onPress={() => {
              onboardingStore.goal          = selectedGoal;
              onboardingStore.activityLevel = selectedActivity;
              navigation.navigate('Done');
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: Colors.background },
  body:   { flex: 1, paddingHorizontal: Spacing.screenHorizontalOnboarding, paddingTop: 8 },
  scroll: { paddingBottom: 12 },
  footer: { paddingBottom: 20, paddingTop: 24 },
  headline: {
    fontFamily: Fonts.display, fontSize: FontSizes.onboardingHeadline,
    color: Colors.white, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 10,
  },
  sub: { fontFamily: Fonts.body, fontSize: FontSizes.body, color: Colors.textSecondary, marginBottom: 28 },
  options: { gap: 14, marginBottom: 36 },
  option: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.surface, borderRadius: Spacing.cardRadius,
    padding: 18, gap: 16, borderWidth: 2, borderColor: 'transparent',
  },
  optionSelected: { backgroundColor: Colors.surfaceRaised, borderColor: Colors.pink },
  iconChipGrad:   { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
  iconChipPlain:  { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.surfaceRaised },
  optionText:     { flex: 1, gap: 4 },
  optionTitle:    { fontFamily: Fonts.body, fontSize: FontSizes.body, fontWeight: '700', color: Colors.white },
  optionSub:      { fontFamily: Fonts.body, fontSize: FontSizes.label, color: Colors.textSecondary },
  radioGrad:      { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  radioEmpty:     { width: 28, height: 28, borderRadius: 14, borderWidth: 2, borderColor: Colors.border },
  // Activity level
  sectionTitle: { fontFamily: Fonts.body, fontSize: 16, fontWeight: '700', color: Colors.white, marginBottom: 6 },
  sectionSub:   { fontFamily: Fonts.body, fontSize: FontSizes.label, color: Colors.textSecondary, marginBottom: 16 },
  activityGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 12 },
  activityChip: {
    width: '47.5%', backgroundColor: Colors.surface, borderRadius: 14,
    padding: 16, borderWidth: 1.5, borderColor: 'transparent', gap: 4,
  },
  activityChipActive: { borderColor: Colors.pink, backgroundColor: Colors.surfaceRaised },
  activityTitle:      { fontFamily: Fonts.body, fontSize: 14, fontWeight: '700', color: Colors.textSecondary },
  activityTitleActive:{ color: Colors.pink },
  activitySub:        { fontFamily: Fonts.body, fontSize: 11, color: Colors.textTertiary },
});
