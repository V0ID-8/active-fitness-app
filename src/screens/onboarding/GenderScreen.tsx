import { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation';
import { Colors, Fonts, FontSizes, Spacing, Gradients } from '../../constants';
import { onboardingStore } from '../../utils/onboardingStore';
import TopNav from '../../components/TopNav';
import GradientButton from '../../components/GradientButton';
import { MaleIcon, FemaleIcon } from '../../components/Icon';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Gender'>;
};

type GenderOption = 'male' | 'female';

// A tile that shows a gradient border + gradient icon when selected
function GenderTile({
  label,
  icon,
  selected,
  onPress,
}: {
  label: string;
  icon: React.ReactNode;
  selected: boolean;
  onPress: () => void;
}) {
  if (selected) {
    return (
      <TouchableOpacity style={styles.tileWrapper} onPress={onPress} activeOpacity={0.85}>
        {/* Gradient acts as the 2px border */}
        <LinearGradient
          colors={Gradients.primary.colors}
          start={Gradients.primary.start}
          end={Gradients.primary.end}
          style={styles.tileBorderGrad}
        >
          <View style={styles.tileBodySelected}>
            {/* Gradient icon chip */}
            <LinearGradient
              colors={Gradients.primary.colors}
              start={Gradients.primary.start}
              end={Gradients.primary.end}
              style={styles.iconChipGrad}
            >
              {icon}
            </LinearGradient>
            <Text style={styles.tileLabel}>{label}</Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.tileWrapper} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.tilePlain}>
        <View style={styles.iconChipPlain}>{icon}</View>
        <Text style={styles.tileLabel}>{label}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function GenderScreen({ navigation }: Props) {
  const [selected, setSelected] = useState<GenderOption>('male');

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.body}>
        <TopNav step={2} onBack={() => navigation.goBack()} />

        <Text style={styles.headline}>Choose{'\n'}your gender</Text>
        <Text style={styles.sub}>
          We use this to personalize your calorie and workout plan.
        </Text>

        <View style={styles.tiles}>
          <GenderTile
            label="Male"
            icon={<MaleIcon size={38} color={Colors.white} />}
            selected={selected === 'male'}
            onPress={() => setSelected('male')}
          />
          <GenderTile
            label="Female"
            icon={<FemaleIcon size={38} color={Colors.white} />}
            selected={selected === 'female'}
            onPress={() => setSelected('female')}
          />
        </View>

        <View style={styles.footer}>
          <GradientButton
            label="Continue"
            onPress={() => {
              onboardingStore.gender = selected;
              navigation.navigate('AboutYou');
            }}
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
    marginBottom: 40,
  },
  tiles: {
    flexDirection: 'row',
    gap: 16,
    flex: 1,
  },
  tileWrapper: {
    flex: 1,
  },
  tileBorderGrad: {
    padding: 2,
    borderRadius: 22,
    flex: 1,
  },
  tileBodySelected: {
    backgroundColor: Colors.surfaceRaised,
    borderRadius: 20,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 18,
  },
  tilePlain: {
    backgroundColor: Colors.surface,
    borderRadius: 22,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 18,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  iconChipGrad: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconChipPlain: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surfaceRaised,
  },
  tileLabel: {
    fontFamily: Fonts.body,
    fontSize: 17,
    fontWeight: '600',
    color: Colors.white,
  },
  footer: {
    paddingBottom: 20,
    paddingTop: 24,
  },
});