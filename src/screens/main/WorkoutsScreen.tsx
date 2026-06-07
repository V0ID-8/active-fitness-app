import { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Fonts, FontSizes, Spacing, Gradients } from '../../constants';
import AppHeader from '../../components/AppHeader';
import {
  SearchIcon, DumbbellIcon, PlayIcon, ChevronRightIcon,
  MuscleIcon, FlameIcon, HeartIcon, BoltIcon, CheckIcon,
} from '../../components/Icon';

const CATEGORIES = ['All', 'Strength', 'Cardio', 'HIIT', 'Mobility'];

const PROGRAMS = [
  { Icon: MuscleIcon, title: 'Upper Body Strength', sub: '45 min · 6 exercises · Intermediate' },
  { Icon: FlameIcon,  title: 'Full Body Burn',       sub: '30 min · 8 exercises · Advanced'     },
  { Icon: HeartIcon,  title: 'Core & Mobility',      sub: '20 min · 5 exercises · Beginner'     },
];

const EXERCISES = [
  { Icon: MuscleIcon,   title: 'Push-ups', sub: '3 sets · 15 reps',    done: true  },
  { Icon: DumbbellIcon, title: 'Squats',   sub: '4 sets · 12 reps',    done: true  },
  { Icon: BoltIcon,     title: 'Deadlift', sub: '3 sets · 10 reps',    done: false },
  { Icon: FlameIcon,    title: 'Walking',  sub: '30 min · steady pace', done: false },
];

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

        {/* Featured hero */}
        <LinearGradient
          colors={Gradients.primary.colors}
          start={Gradients.primary.start}
          end={Gradients.primary.end}
          style={styles.hero}
        >
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

        {/* Category chips */}
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

        {/* Programs for you */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Programs for you</Text>
          <Text style={styles.sectionMore}>See all</Text>
        </View>
        <View style={styles.list}>
          {PROGRAMS.map((p) => (
            <TouchableOpacity key={p.title} style={styles.row} activeOpacity={0.85}>
              <View style={styles.rowThumb}>
                <p.Icon size={26} color={Colors.pink} />
              </View>
              <View style={styles.rowText}>
                <Text style={styles.rowTitle}>{p.title}</Text>
                <Text style={styles.rowSub}>{p.sub}</Text>
              </View>
              <ChevronRightIcon size={18} color={Colors.textSecondary} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Today's exercises */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today's exercises</Text>
          <Text style={styles.sectionMore}>4 left</Text>
        </View>
        <View style={styles.list}>
          {EXERCISES.map((ex) => (
            <View key={ex.title} style={[styles.row, ex.done && styles.rowDone]}>
              <View style={[styles.rowThumb, ex.done && styles.rowThumbDone]}>
                <ex.Icon size={24} color={ex.done ? Colors.white : Colors.textSecondary} />
              </View>
              <View style={styles.rowText}>
                <Text style={[styles.rowTitle, ex.done && styles.rowTitleDone]}>
                  {ex.title}
                </Text>
                <Text style={styles.rowSub}>{ex.sub}</Text>
              </View>
              {ex.done ? (
                <LinearGradient
                  colors={Gradients.primary.colors}
                  start={Gradients.primary.start}
                  end={Gradients.primary.end}
                  style={styles.actionCircle}
                >
                  <CheckIcon size={13} color={Colors.white} />
                </LinearGradient>
              ) : (
                <View style={styles.actionCircle}>
                  <PlayIcon size={14} color={Colors.white} />
                </View>
              )}
            </View>
          ))}
        </View>
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: Fonts.body,
    fontSize: 16,
    fontWeight: '700',
    color: Colors.white,
  },
  sectionMore: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.label,
    color: Colors.textSecondary,
  },
  list: {
    gap: 10,
    marginBottom: Spacing.sectionGap,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 14,
    gap: 14,
  },
  rowDone: {
    opacity: 0.7,
  },
  rowThumb: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.surfaceRaised,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowThumbDone: {
    backgroundColor: Colors.pink,
  },
  rowText: {
    flex: 1,
    gap: 3,
  },
  rowTitle: {
    fontFamily: Fonts.body,
    fontSize: 15,
    fontWeight: '700',
    color: Colors.white,
  },
  rowTitleDone: {
    textDecorationLine: 'line-through',
    color: Colors.textSecondary,
  },
  rowSub: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.label,
    color: Colors.textSecondary,
  },
  actionCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.surfaceRaised,
    alignItems: 'center',
    justifyContent: 'center',
  },
});