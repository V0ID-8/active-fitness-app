import { useState } from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity, ScrollView,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation';
import { Colors, Fonts, FontSizes, Spacing } from '../../constants';
import TopNav from '../../components/TopNav';
import GradientButton from '../../components/GradientButton';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'AboutYou'>;
};

// Reusable stat card wrapper
function StatCard({ children }: { children: React.ReactNode }) {
  return <View style={styles.card}>{children}</View>;
}

export default function AboutYouScreen({ navigation }: Props) {
  const [age, setAge] = useState(24);
  const [height, setHeight] = useState(170);
  const [weight, setWeight] = useState(72);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <TopNav step={3} onBack={() => navigation.goBack()} />

        <Text style={styles.headline}>About you</Text>
        <Text style={styles.sub}>A few details to tailor your plan.</Text>

        {/* Age */}
        <StatCard>
          <View style={styles.statRow}>
            <View>
              <Text style={styles.statLabel}>Age</Text>
              <Text style={styles.statValue}>
                {age}
                <Text style={styles.unit}> years</Text>
              </Text>
            </View>
            <View style={styles.stepper}>
              <TouchableOpacity
                style={styles.stepBtn}
                onPress={() => setAge((a) => Math.max(16, a - 1))}
                activeOpacity={0.75}
              >
                <Text style={styles.stepBtnText}>−</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.stepBtn}
                onPress={() => setAge((a) => Math.min(80, a + 1))}
                activeOpacity={0.75}
              >
                <Text style={styles.stepBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </StatCard>

        {/* Height */}
        <StatCard>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Height</Text>
            <Text style={styles.statValue}>
              {height}
              <Text style={styles.unit}> cm</Text>
            </Text>
          </View>
          <Slider
            style={styles.slider}
            value={height}
            onValueChange={(v) => setHeight(Math.round(v))}
            minimumValue={140}
            maximumValue={200}
            step={1}
            minimumTrackTintColor={Colors.pink}
            maximumTrackTintColor={Colors.border}
            thumbTintColor={Colors.white}
          />
          <View style={styles.ticks}>
            {['140', '160', '180', '200'].map((t) => (
              <Text key={t} style={styles.tick}>{t}</Text>
            ))}
          </View>
        </StatCard>

        {/* Weight */}
        <StatCard>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Weight</Text>
            <Text style={styles.statValue}>
              {weight}
              <Text style={styles.unit}> kg</Text>
            </Text>
          </View>
          <Slider
            style={styles.slider}
            value={weight}
            onValueChange={(v) => setWeight(Math.round(v))}
            minimumValue={40}
            maximumValue={130}
            step={1}
            minimumTrackTintColor={Colors.pink}
            maximumTrackTintColor={Colors.border}
            thumbTintColor={Colors.white}
          />
          <View style={styles.ticks}>
            {['40', '70', '100', '130'].map((t) => (
              <Text key={t} style={styles.tick}>{t}</Text>
            ))}
          </View>
        </StatCard>

        <GradientButton
          label="Continue"
          onPress={() => navigation.navigate('Goal')}
          style={{ marginTop: 8 }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    paddingHorizontal: Spacing.screenHorizontalOnboarding,
    paddingTop: 8,
    paddingBottom: 32,
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
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Spacing.cardRadius,
    padding: 20,
    marginBottom: 14,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statLabel: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.label,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  statValue: {
    fontFamily: Fonts.display,
    fontSize: FontSizes.statNumber,
    color: Colors.white,
  },
  unit: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.body,
    color: Colors.textSecondary,
    fontWeight: '400',
  },
  stepper: {
    flexDirection: 'row',
    gap: 10,
  },
  stepBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surfaceRaised,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBtnText: {
    fontFamily: Fonts.body,
    fontSize: 22,
    color: Colors.white,
    lineHeight: 26,
  },
  slider: {
    width: '100%',
    height: 40,
    marginTop: 8,
  },
  ticks: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  tick: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.labelSmall,
    color: Colors.textTertiary,
  },
});