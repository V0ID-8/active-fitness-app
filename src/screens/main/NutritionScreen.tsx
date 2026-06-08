import { useMemo } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { Colors, Fonts, FontSizes, Spacing, Gradients } from '../../constants';
import AppHeader from '../../components/AppHeader';
import {
  DropletIcon, SunriseIcon,
  BowlIcon, CookieIcon, PlusIcon,
} from '../../components/Icon';
import { useAuth } from '../../hooks/useAuth';
import { useUserProfile } from '../../hooks/useUserProfile';
import { useDailyLog } from '../../hooks/useDailyLog';
import { dailyLogService } from '../../services/dailyLogService';
import { MealType } from '../../types';

const TODAY     = new Date().toISOString().split('T')[0];
const RING_R    = 56;
const RING_C    = 2 * Math.PI * RING_R;

const MEAL_SLOTS: { type: MealType; Icon: any; title: string }[] = [
  { type: 'breakfast', Icon: SunriseIcon, title: 'Breakfast' },
  { type: 'lunch',     Icon: BowlIcon,    title: 'Lunch'     },
  { type: 'dinner',    Icon: BowlIcon,    title: 'Dinner'    },
  { type: 'snacks',    Icon: CookieIcon,  title: 'Snacks'    },
];

export default function NutritionScreen() {
  const navigation            = useNavigation<any>();
  const { user }              = useAuth();
  const { profile }           = useUserProfile(user?.uid ?? null);
  const { log }               = useDailyLog(user?.uid ?? null, TODAY);

  // Ring
  const calorieGoal   = profile?.calorieGoal ?? 1;
  const caloriesEaten = log.caloriesEaten;
  const caloriesLeft  = Math.max(0, calorieGoal - caloriesEaten);
  const ringPct       = Math.min(1, caloriesEaten / (calorieGoal || 1));

  // Macros from all logged entries
  const { proteinEaten, carbEaten, fatEaten } = useMemo(() => {
    const all = Object.values(log.meals).flat();
    return {
      proteinEaten: all.reduce((s, e) => s + e.proteinG, 0),
      carbEaten:    all.reduce((s, e) => s + e.carbG,    0),
      fatEaten:     all.reduce((s, e) => s + e.fatG,     0),
    };
  }, [log.meals]);

  const macros = [
    { label: 'Protein', value: Math.round(proteinEaten), goal: profile?.proteinGoalG ?? 0 },
    { label: 'Carbs',   value: Math.round(carbEaten),    goal: profile?.carbGoalG    ?? 0 },
    { label: 'Fat',     value: Math.round(fatEaten),     goal: profile?.fatGoalG     ?? 0 },
  ];

  // Water
  const handleWaterTap = async (i: number) => {
    if (!user) return;
    const newCups = i + 1 === log.waterCups ? i : i + 1;
    await dailyLogService.updateWaterCups(user.uid, TODAY, newCups);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <AppHeader
          title="Nutrition"
          right={
            <View style={styles.datePill}>
              <Text style={styles.datePillText}>Today</Text>
            </View>
          }
        />

        {/* Calorie ring card */}
        <View style={styles.ringCard}>
          <View style={styles.ringWrap}>
            <Svg width={132} height={132} viewBox="0 0 132 132">
              <Defs>
                <SvgLinearGradient id="ringg" x1="0" y1="0" x2="1" y2="1">
                  <Stop offset="0" stopColor={Colors.pink} />
                  <Stop offset="1" stopColor={Colors.purple} />
                </SvgLinearGradient>
              </Defs>
              <Circle cx="66" cy="66" r={RING_R} fill="none" stroke="#4A4A4A" strokeWidth={12} />
              <Circle
                cx="66" cy="66" r={RING_R}
                fill="none"
                stroke="url(#ringg)"
                strokeWidth={12}
                strokeLinecap="round"
                strokeDasharray={RING_C}
                strokeDashoffset={RING_C * (1 - ringPct)}
                transform="rotate(-90 66 66)"
              />
            </Svg>
            <View style={styles.ringCenter}>
              <Text style={styles.ringNum}>{caloriesLeft.toLocaleString()}</Text>
              <Text style={styles.ringLabel}>KCAL LEFT</Text>
            </View>
          </View>

          <View style={styles.ringLegend}>
            {[
              { color: Colors.border,  label: 'Goal',  value: calorieGoal.toLocaleString()   },
              { color: Colors.pink,    label: 'Food',  value: caloriesEaten.toLocaleString()  },
            ].map((item) => (
              <View key={item.label} style={styles.legendRow}>
                <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                <Text style={styles.legendLabel}>{item.label}</Text>
                <Text style={styles.legendValue}>{item.value}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Macros */}
        <View style={styles.macrosCard}>
          {macros.map((m, i) => (
            <View key={m.label} style={[styles.macro, i < macros.length - 1 && styles.macroDivider]}>
              <View style={styles.macroHeader}>
                <Text style={styles.macroLabel}>{m.label}</Text>
                <Text style={styles.macroValue}>
                  {m.value}
                  <Text style={styles.macroGoal}> / {m.goal}g</Text>
                </Text>
              </View>
              <View style={styles.barTrack}>
                <LinearGradient
                  colors={Gradients.primaryHorizontal.colors}
                  start={Gradients.primaryHorizontal.start}
                  end={Gradients.primaryHorizontal.end}
                  style={[
                    styles.barFill,
                    { width: `${m.goal > 0 ? Math.min(100, Math.round((m.value / m.goal) * 100)) : 0}%` },
                  ]}
                />
              </View>
            </View>
          ))}
        </View>

        {/* Water tracker */}
        <View style={styles.waterCard}>
          <View style={styles.waterInfo}>
            <DropletIcon size={20} color={Colors.green} />
            <View>
              <Text style={styles.waterTitle}>Water</Text>
              <Text style={styles.waterSub}>{log.waterCups} of 8 cups</Text>
            </View>
          </View>
          <View style={styles.cups}>
            {Array.from({ length: 8 }).map((_, i) => (
              <TouchableOpacity
                key={i}
                style={[styles.cup, i < log.waterCups && styles.cupFilled]}
                onPress={() => handleWaterTap(i)}
                activeOpacity={0.7}
              />
            ))}
          </View>
        </View>

        {/* Today's meals */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today's meals</Text>
        </View>
        <View style={styles.mealsList}>
          {MEAL_SLOTS.map((slot) => {
            const entries  = log.meals[slot.type];
            const mealKcal = entries.reduce((s, e) => s + e.kcal, 0);
            const hasMeals = entries.length > 0;
            const subtitle = hasMeals
              ? `${entries.length} item${entries.length > 1 ? 's' : ''} · ${mealKcal} kcal`
              : 'Tap + to add food';

            return (
              <View key={slot.type} style={styles.mealRow}>
                <View style={[styles.mealIcon, hasMeals && styles.mealIconDone]}>
                  <slot.Icon size={20} color={hasMeals ? Colors.green : Colors.textSecondary} />
                </View>
                <View style={styles.mealText}>
                  <Text style={styles.mealTitle}>{slot.title}</Text>
                  <Text style={styles.mealSub}>{subtitle}</Text>
                </View>
                {hasMeals && (
                  <Text style={styles.mealKcal}>
                    {mealKcal}
                    <Text style={styles.mealKcalUnit}> kcal</Text>
                  </Text>
                )}
                <TouchableOpacity
                  style={styles.addBtn}
                  activeOpacity={0.8}
                  onPress={() =>
                    navigation.navigate('FoodSearch', { mealType: slot.type, date: TODAY })
                  }
                >
                  <PlusIcon size={16} color={Colors.white} />
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: {
    paddingHorizontal: Spacing.screenHorizontalApp,
    paddingTop: 16,
    paddingBottom: Spacing.tabBarOffset,
  },
  datePill: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: Colors.surface, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 99,
  },
  datePillText: { fontFamily: Fonts.body, fontSize: FontSizes.label, color: Colors.white, fontWeight: '600' },
  // Ring card
  ringCard:   { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, borderRadius: Spacing.cardRadius, padding: 20, marginBottom: 14, gap: 20 },
  ringWrap:   { width: 132, height: 132, position: 'relative' },
  ringCenter: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' },
  ringNum:    { fontFamily: Fonts.display, fontSize: 28, color: Colors.white },
  ringLabel:  { fontFamily: Fonts.body, fontSize: 10, color: Colors.textSecondary, letterSpacing: 0.5, marginTop: 2 },
  ringLegend: { flex: 1, gap: 12 },
  legendRow:  { flexDirection: 'row', alignItems: 'center', gap: 8 },
  legendDot:  { width: 8, height: 8, borderRadius: 4 },
  legendLabel:{ fontFamily: Fonts.body, fontSize: FontSizes.label, color: Colors.textSecondary, flex: 1 },
  legendValue:{ fontFamily: Fonts.body, fontSize: FontSizes.label, fontWeight: '700', color: Colors.white },
  // Macros
  macrosCard: { backgroundColor: Colors.surface, borderRadius: Spacing.cardRadius, padding: 20, marginBottom: 14, gap: 16 },
  macro:      { gap: 8 },
  macroDivider: { paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: Colors.border },
  macroHeader:{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  macroLabel: { fontFamily: Fonts.body, fontSize: FontSizes.body, fontWeight: '600', color: Colors.white },
  macroValue: { fontFamily: Fonts.body, fontSize: FontSizes.body, fontWeight: '700', color: Colors.white },
  macroGoal:  { fontWeight: '400', color: Colors.textSecondary },
  barTrack:   { height: 6, backgroundColor: Colors.surfaceRaised, borderRadius: 99, overflow: 'hidden' },
  barFill:    { height: '100%', borderRadius: 99 },
  // Water
  waterCard:  { backgroundColor: Colors.surface, borderRadius: Spacing.cardRadius, padding: 18, marginBottom: 22, gap: 14 },
  waterInfo:  { flexDirection: 'row', alignItems: 'center', gap: 10 },
  waterTitle: { fontFamily: Fonts.body, fontSize: 15, fontWeight: '700', color: Colors.white },
  waterSub:   { fontFamily: Fonts.body, fontSize: FontSizes.label, color: Colors.textSecondary, marginTop: 2 },
  cups:       { flexDirection: 'row', gap: 6 },
  cup:        { flex: 1, height: 10, borderRadius: 99, backgroundColor: Colors.surfaceRaised },
  cupFilled:  { backgroundColor: Colors.green },
  // Meals
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle:  { fontFamily: Fonts.body, fontSize: 16, fontWeight: '700', color: Colors.white },
  mealsList:  { gap: 10 },
  mealRow:    { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, borderRadius: 16, padding: 14, gap: 12 },
  mealIcon:   { width: 44, height: 44, borderRadius: 12, backgroundColor: Colors.surfaceRaised, alignItems: 'center', justifyContent: 'center' },
  mealIconDone: { backgroundColor: 'rgba(95,208,138,0.15)' },
  mealText:   { flex: 1, gap: 3 },
  mealTitle:  { fontFamily: Fonts.body, fontSize: 15, fontWeight: '700', color: Colors.white },
  mealSub:    { fontFamily: Fonts.body, fontSize: FontSizes.label, color: Colors.textSecondary },
  mealKcal:   { fontFamily: Fonts.body, fontSize: 14, fontWeight: '700', color: Colors.white },
  mealKcalUnit: { fontFamily: Fonts.body, fontSize: FontSizes.label, fontWeight: '400', color: Colors.textSecondary },
  addBtn:     { width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.surfaceRaised, alignItems: 'center', justifyContent: 'center' },
});
