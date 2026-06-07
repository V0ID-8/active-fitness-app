import { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation';
import { Colors, Fonts, FontSizes, Spacing, Gradients } from '../../constants';
import TopNav from '../../components/TopNav';
import GradientButton from '../../components/GradientButton';
import { FlameIcon, MuscleIcon, HeartIcon, CheckIcon } from '../../components/Icon';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Goal'>;
};

type GoalKey = 'lose' | 'gain' | 'fit';

const OPTIONS: { key: GoalKey; icon: React.ReactNode; title: string; subtitle: string }[] = [
  {
    key: 'lose',
    icon: <FlameIcon size={26} color={Colors.white} />,
    title: 'Lose Weight',
    subtitle: 'Burn fat with a calorie deficit',
  },
  {
    key: 'gain',
    icon: <MuscleIcon size={26} color={Colors.white} />,
    title: 'Gain Muscle',
    subtitle: 'Build strength and lean mass',
  },
  {
    key: 'fit',
    icon: <HeartIcon size={26} color={Colors.white} />,
    title: 'Keep Fit',
    subtitle: 'Maintain a healthy, active body',
  },
];

function OptionRow({
  icon,
  title,
  subtitle,
  selected,
  onPress,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.option, selected && styles.optionSelected]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      {/* Left: gradient icon chip when selected, plain otherwise */}
      {selected ? (
        <LinearGradient
          colors={Gradients.primary.colors}
          start={Gradients.primary.start}
          end={Gradients.primary.end}
          style={styles.iconChipGrad}
        >
          {icon}
        </LinearGradient>
      ) : (
        <View style={styles.iconChipPlain}>{icon}</View>
      )}

      {/* Center: title + subtitle */}
      <View style={styles.optionText}>
        <Text style={styles.optionTitle}>{title}</Text>
        <Text style={styles.optionSub}>{subtitle}</Text>
      </View>

      {/* Right: gradient radio check when selected, empty circle otherwise */}
      {selected ? (
        <LinearGradient
          colors={Gradients.primary.colors}
          start={Gradients.primary.start}
          end={Gradients.primary.end}
          style={styles.radioGrad}
        >
          <CheckIcon size={13} color={Colors.white} />
        </LinearGradient>
      ) : (
        <View style={styles.radioEmpty} />
      )}
    </TouchableOpacity>
  );
}

export default function GoalScreen({ navigation }: Props) {
  const [selected, setSelected] = useState<GoalKey>('gain');

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.body}>
        <TopNav step={4} onBack={() => navigation.goBack()} />

        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.headline}>What's{'\n'}your goal?</Text>
          <Text style={styles.sub}>Pick one — you can change it anytime.</Text>

          <View style={styles.options}>
            {OPTIONS.map((o) => (
              <OptionRow
                key={o.key}
                icon={o.icon}
                title={o.title}
                subtitle={o.subtitle}
                selected={selected === o.key}
                onPress={() => setSelected(o.key)}
              />
            ))}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <GradientButton
            label="Create my plan"
            onPress={() => navigation.navigate('Done')}
          />
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
    paddingTop: 8,
  },
  scroll: {
    paddingBottom: 12,
  },
  footer: {
    paddingBottom: 20,
    paddingTop: 24,
  },
  headline: {
    fontFamily: Fonts.display,
    fontSize: FontSizes.onboardingHeadline,
    color: Colors.white,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  sub: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.body,
    color: Colors.textSecondary,
    marginBottom: 28,
  },
  options: {
    gap: 14,
    marginBottom: 32,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Spacing.cardRadius,
    padding: 18,
    gap: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionSelected: {
    backgroundColor: Colors.surfaceRaised,
    borderColor: Colors.pink,
  },
  iconChipGrad: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconChipPlain: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surfaceRaised,
  },
  optionText: {
    flex: 1,
    gap: 4,
  },
  optionTitle: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.body,
    fontWeight: '700',
    color: Colors.white,
  },
  optionSub: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.label,
    color: Colors.textSecondary,
  },
  radioGrad: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioEmpty: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: Colors.border,
  },
});