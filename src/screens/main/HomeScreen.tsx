import { useMemo } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Fonts, FontSizes, Spacing, Gradients } from '../../constants';
import {
  DumbbellIcon, PlayIcon,
  FlameIcon, BoltIcon, DropletIcon,
  TrophyIcon, NutritionIcon, BarChartIcon,
} from '../../components/Icon';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../hooks/useAuth';
import { useUserProfile } from '../../hooks/useUserProfile';
import { useDailyLog } from '../../hooks/useDailyLog';
import { useWeeklyActivity } from '../../hooks/useWeeklyActivity';
import { exerciseService } from '../../services/exerciseService';

// Today's date in YYYY-MM-DD format
const TODAY = new Date().toISOString().split('T')[0];

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function HomeScreen() {
  const navigation                     = useNavigation<any>();
  const { user }                      = useAuth();
  const { profile, loading: profLoad } = useUserProfile(user?.uid ?? null);
  const { log, loading: logLoad }      = useDailyLog(user?.uid ?? null, TODAY);
  const { days, completedCount, loading: activityLoad } = useWeeklyActivity(user?.uid ?? null);

  // Today's workout plan — derived from profile.goal, falls back to 'fit'
  const todaysPlan = useMemo(
    () => exerciseService.getTodaysWorkout(profile?.goal ?? 'fit'),
    [profile?.goal],
  );

  // Protein eaten = sum across all logged meals
  const proteinEaten = useMemo(() => {
    if (!log) return 0;
    return Object.values(log.meals)
      .flat()
      .reduce((sum, entry) => sum + (entry.proteinG ?? 0), 0);
  }, [log]);

  const firstName   = profile?.displayName?.split(' ')[0] ?? '—';
  const avatarLetter = firstName !== '—' ? firstName[0].toUpperCase() : 'A';
  const calorieGoal  = profile?.calorieGoal ?? 0;
  const proteinGoal  = profile?.proteinGoalG ?? 0;

  const isLoading = profLoad || logLoad;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{avatarLetter}</Text>
          </View>
          <View style={styles.greet}>
            <Text style={styles.greetSmall}>{getGreeting()}</Text>
            <Text style={styles.greetName}>{profile?.displayName ?? '—'}</Text>
          </View>
        </View>

        {/* Hero card */}
        <LinearGradient
          colors={Gradients.primary.colors}
          start={Gradients.primary.start}
          end={Gradients.primary.end}
          style={styles.hero}
        >
          <View style={styles.heroDeco} pointerEvents="none">
            <DumbbellIcon size={130} color="rgba(255,255,255,0.12)" />
          </View>

          <Text style={styles.heroEyebrow}>
            {todaysPlan.isRestDay
              ? 'Today · Rest Day'
              : `Today · ${todaysPlan.workoutType}`}
          </Text>
          <Text style={styles.heroTitle}>
            {todaysPlan.isRestDay ? 'Rest &\nRecover.' : 'No excuses.\nJust progress.'}
          </Text>

          {!todaysPlan.isRestDay && (
            <TouchableOpacity style={styles.heroBtn} activeOpacity={0.85} onPress={() => navigation.navigate('Workouts')}>
              <PlayIcon size={15} color={Colors.purple} />
              <Text style={styles.heroBtnText}>Start workout</Text>
            </TouchableOpacity>
          )}
        </LinearGradient>

        {/* Quick stats */}
        {isLoading ? (
          <View style={styles.statsLoading}>
            <ActivityIndicator color={Colors.pink} />
          </View>
        ) : (
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <FlameIcon size={18} color={Colors.pink} />
              <Text style={styles.statBig}>
                {log.caloriesEaten.toLocaleString()}
                <Text style={styles.statUnit}> kcal</Text>
              </Text>
              <Text style={styles.statCap}>
                of {calorieGoal.toLocaleString()} goal
              </Text>
            </View>
            <View style={styles.statCard}>
              <BoltIcon size={18} color={Colors.purple} />
              <Text style={styles.statBig}>
                {Math.round(proteinEaten)}
                <Text style={styles.statUnit}> g</Text>
              </Text>
              <Text style={styles.statCap}>of {proteinGoal}g protein</Text>
            </View>
            <View style={styles.statCard}>
              <DropletIcon size={18} color={Colors.green} />
              <Text style={styles.statBig}>
                {log.waterCups}
                <Text style={styles.statUnit}> /8</Text>
              </Text>
              <Text style={styles.statCap}>cups water</Text>
            </View>
          </View>
        )}

        {/* Today's plan */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today's plan</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Workouts')}>
            <Text style={styles.sectionMore}>See all</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.planCard}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('Workouts')}
        >
          <View style={styles.planThumb}>
            <DumbbellIcon size={28} color={Colors.pink} />
          </View>
          <View style={styles.planText}>
            <Text style={styles.planTitle}>
              {todaysPlan.isRestDay ? 'Rest Day' : todaysPlan.programName}
            </Text>
            <Text style={styles.planSub}>
              {todaysPlan.isRestDay
                ? 'Recovery · Take it easy today'
                : `${todaysPlan.estimatedMinutes} min · ${todaysPlan.exercises.length} exercises`}
            </Text>
          </View>
          {!todaysPlan.isRestDay && (
            <View style={styles.planPlay}>
              <PlayIcon size={16} color={Colors.white} />
            </View>
          )}
        </TouchableOpacity>

        {/* Weekly activity chart */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your progress</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Progress')}>
            <Text style={styles.sectionMore}>Details</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.chartCard}>
          <View style={styles.chartTop}>
            <View>
              <Text style={styles.chartLabel}>Weekly activity</Text>
              <Text style={styles.chartSub}>
                {activityLoad ? 'Loading…' : `${completedCount} of 7 workouts done`}
              </Text>
            </View>
            <Text style={styles.chartDelta}>
              {!activityLoad && completedCount > 0 ? `${completedCount} ✓` : '—'}
            </Text>
          </View>
          <View style={styles.barsRow}>
            {activityLoad
              ? Array.from({ length: 7 }).map((_, i) => (
                  <View key={i} style={[styles.bar, { height: 18 }]} />
                ))
              : days.map((day, i) => (
                  <View
                    key={i}
                    style={[
                      styles.bar,
                      { height: (day.barHeight / 100) * 72 },
                      (day.isCompleted || day.isToday) && styles.barActive,
                    ]}
                  />
                ))}
          </View>
          <View style={styles.dayLabels}>
            {activityLoad
              ? ['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                  <Text key={i} style={styles.dayLabel}>{d}</Text>
                ))
              : days.map((day, i) => (
                  <Text key={i} style={styles.dayLabel}>{day.dayLabel}</Text>
                ))}
          </View>
        </View>

        {/* Explore grid */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Explore</Text>
        </View>
        <View style={styles.grid}>
          {[
            { Icon: DumbbellIcon,  label: 'Workouts',  sub: 'Plans for your goal', tab: 'Workouts'  },
            { Icon: NutritionIcon, label: 'Nutrition', sub: 'Calories & protein',  tab: 'Nutrition' },
            { Icon: BarChartIcon,  label: 'Progress',  sub: 'Track your results',  tab: 'Progress'  },
            { Icon: TrophyIcon,    label: 'Profile',   sub: 'Settings & goals',    tab: 'Profile'   },
          ].map((item) => (
            <TouchableOpacity
              key={item.label}
              style={styles.featureCard}
              activeOpacity={0.85}
              onPress={() => navigation.navigate(item.tab)}
            >
              <View style={styles.featureIcon}>
                <item.Icon size={24} color={Colors.pink} />
              </View>
              <Text style={styles.featureLabel}>{item.label}</Text>
              <Text style={styles.featureSub}>{item.sub}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: Colors.background },
  scroll: {
    paddingHorizontal: Spacing.screenHorizontalApp,
    paddingTop: 16,
    paddingBottom: Spacing.tabBarOffset,
  },
  // Header
  header:      { flexDirection: 'row', alignItems: 'center', marginBottom: 22, gap: 12 },
  avatar:      { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.pink, alignItems: 'center', justifyContent: 'center' },
  avatarText:  { fontFamily: Fonts.display, fontSize: 20, color: Colors.white },
  greet:       { flex: 1, gap: 1 },
  greetSmall:  { fontFamily: Fonts.body, fontSize: FontSizes.label, color: Colors.textSecondary },
  greetName:   { fontFamily: Fonts.body, fontSize: 16, fontWeight: '700', color: Colors.white },
  // Hero
  hero:        { borderRadius: Spacing.cardRadius, padding: 22, marginBottom: Spacing.sectionGap, overflow: 'hidden', minHeight: 180, justifyContent: 'flex-end' },
  heroDeco:    { position: 'absolute', top: -10, right: -10 },
  heroEyebrow: { fontFamily: Fonts.body, fontSize: FontSizes.label, color: 'rgba(255,255,255,0.75)', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6 },
  heroTitle:   { fontFamily: Fonts.display, fontSize: 26, color: Colors.white, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 18, lineHeight: 32 },
  heroBtn:     { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: Colors.white, alignSelf: 'flex-start', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 99 },
  heroBtnText: { fontFamily: Fonts.body, fontSize: 14, fontWeight: '700', color: Colors.purple },
  // Stats
  statsLoading: { height: 90, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.sectionGap },
  statsRow:    { flexDirection: 'row', gap: 10, marginBottom: Spacing.sectionGap },
  statCard:    { flex: 1, backgroundColor: Colors.surface, borderRadius: 16, padding: 14, gap: 4, alignItems: 'flex-start' },
  statBig:     { fontFamily: Fonts.display, fontSize: 20, color: Colors.white },
  statUnit:    { fontFamily: Fonts.body, fontSize: 13, color: Colors.textSecondary, fontWeight: '400' },
  statCap:     { fontFamily: Fonts.body, fontSize: 11, color: Colors.textTertiary },
  // Section headers
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle:  { fontFamily: Fonts.body, fontSize: 16, fontWeight: '700', color: Colors.white },
  sectionMore:   { fontFamily: Fonts.body, fontSize: FontSizes.label, color: Colors.textSecondary },
  // Plan card
  planCard:    { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, borderRadius: Spacing.cardRadius, padding: 16, gap: 14, marginBottom: Spacing.sectionGap },
  planThumb:   { width: 52, height: 52, borderRadius: 14, backgroundColor: Colors.surfaceRaised, alignItems: 'center', justifyContent: 'center' },
  planText:    { flex: 1, gap: 4 },
  planTitle:   { fontFamily: Fonts.body, fontSize: 15, fontWeight: '700', color: Colors.white },
  planSub:     { fontFamily: Fonts.body, fontSize: FontSizes.label, color: Colors.textSecondary },
  planPlay:    { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.pink, alignItems: 'center', justifyContent: 'center' },
  // Chart
  chartCard:   { backgroundColor: Colors.surface, borderRadius: Spacing.cardRadius, padding: 18, marginBottom: Spacing.sectionGap },
  chartTop:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 },
  chartLabel:  { fontFamily: Fonts.body, fontSize: 15, fontWeight: '700', color: Colors.white },
  chartSub:    { fontFamily: Fonts.body, fontSize: FontSizes.label, color: Colors.textSecondary, marginTop: 3 },
  chartDelta:  { fontFamily: Fonts.body, fontSize: FontSizes.label, fontWeight: '700', color: Colors.green },
  barsRow:     { flexDirection: 'row', alignItems: 'flex-end', height: 72, gap: 6 },
  bar:         { flex: 1, borderRadius: 4, backgroundColor: Colors.surfaceRaised },
  barActive:   { backgroundColor: Colors.pink },
  dayLabels:   { flexDirection: 'row', marginTop: 8, gap: 6 },
  dayLabel:    { flex: 1, textAlign: 'center', fontFamily: Fonts.body, fontSize: FontSizes.labelSmall, color: Colors.textTertiary },
  // Explore grid
  grid:        { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  featureCard: { width: '47.5%', backgroundColor: Colors.surface, borderRadius: Spacing.cardRadius, padding: 18, gap: 8 },
  featureIcon: { width: 44, height: 44, borderRadius: 12, backgroundColor: Colors.surfaceRaised, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  featureLabel: { fontFamily: Fonts.body, fontSize: 15, fontWeight: '700', color: Colors.white },
  featureSub:  { fontFamily: Fonts.body, fontSize: FontSizes.label, color: Colors.textSecondary },
});
