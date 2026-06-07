import { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Fonts, FontSizes, Spacing, Gradients } from '../../constants';
import AppHeader from '../../components/AppHeader';
import { SearchIcon, DumbbellIcon, PlayIcon } from '../../components/Icon';

const CATEGORIES = ['All', 'Strength', 'Cardio', 'HIIT', 'Mobility'];

export default function WorkoutsScreen() {
  const [activeCategory, setActiveCategory] = useState('All');

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <AppHeader
          title="Workouts"
          right={<SearchIcon size={22} color={Colors.white} />}
        />

        {/* Featured hero card */}
        <LinearGradient
          colors={Gradients.primary.colors}
          start={Gradients.primary.start}
          end={Gradients.primary.end}
          style={styles.hero}
        >
          {/* Large faded dumbbell decoration */}
          <View style={styles.heroDeco} pointerEvents="none">
            <DumbbellIcon size={130} color="rgba(255,255,255,0.12)" />
          </View>
          <Text style={styles.heroEyebrow}>Recommended · Gain muscle</Text>
          <Text style={styles.heroTitle}>Upper body{'\n'}strength</Text>
          <TouchableOpacity style={styles.heroBtn} activeOpacity={0.85}>
            <PlayIcon size={15} color={Colors.purple} />
            <Text style={styles.heroBtnText}>Start · 45 min</Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* Horizontally scrollable category chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsContent}
          style={styles.chipsScroll}
        >
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.chip, activeCategory === cat && styles.chipActive]}
              onPress={() => setActiveCategory(cat)}
              activeOpacity={0.8}
            >
              <Text style={[styles.chipText, activeCategory === cat && styles.chipTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
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
    paddingHorizontal: Spacing.screenHorizontalApp,
    paddingTop: 16,
    paddingBottom: Spacing.tabBarOffset,
  },
  hero: {
    borderRadius: Spacing.cardRadius,
    padding: 22,
    marginBottom: 20,
    overflow: 'hidden',
    minHeight: 180,
    justifyContent: 'flex-end',
  },
  heroDeco: {
    position: 'absolute',
    top: -10,
    right: -10,
  },
  heroEyebrow: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.label,
    color: 'rgba(255,255,255,0.75)',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  heroTitle: {
    fontFamily: Fonts.display,
    fontSize: 26,
    color: Colors.white,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 18,
    lineHeight: 32,
  },
  heroBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.white,
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 99,
  },
  heroBtnText: {
    fontFamily: Fonts.body,
    fontSize: 14,
    fontWeight: '700',
    color: Colors.purple,
  },
  chipsScroll: {
    marginBottom: 22,
    marginHorizontal: -Spacing.screenHorizontalApp,
  },
  chipsContent: {
    paddingHorizontal: Spacing.screenHorizontalApp,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 99,
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  chipActive: {
    backgroundColor: Colors.pink,
    borderColor: Colors.pink,
  },
  chipText: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.label,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  chipTextActive: {
    color: Colors.white,
  },
});