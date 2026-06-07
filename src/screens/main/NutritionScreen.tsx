import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';
import { Colors, Fonts, FontSizes, Spacing, Gradients } from '../../constants';
import AppHeader from '../../components/AppHeader';
import {
  CaretDownIcon, DropletIcon, SunriseIcon,
  BowlIcon, CookieIcon, PlusIcon,
} from '../../components/Icon';


// Ring math
const RING_R = 56;
const RING_C = 2 * Math.PI * RING_R;
const FOOD_GOAL = 2300;
const FOOD_EATEN = 1840;
const RING_PCT = FOOD_EATEN / FOOD_GOAL;

const MACROS = [
  { label: 'Protein', value: 120, goal: 150 },
  { label: 'Carbs',   value: 210, goal: 280 },
  { label: 'Fat',     value: 48,  goal: 70  },
];

export default function NutritionScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <AppHeader
          title="Nutrition"
          right={
            <TouchableOpacity style={styles.datePill} activeOpacity={0.8}>
              <Text style={styles.datePillText}>Today</Text>
              <CaretDownIcon size={14} color={Colors.textSecondary} />
            </TouchableOpacity>
          }
        />

        {/* Calorie ring card */}
        <View style={styles.ringCard}>
          {/* SVG ring with gradient stroke */}
          <View style={styles.ringWrap}>
            <Svg width={132} height={132} viewBox="0 0 132 132">
              <Defs>
                <SvgLinearGradient id="ringg" x1="0" y1="0" x2="1" y2="1">
                  <Stop offset="0" stopColor={Colors.pink} />
                  <Stop offset="1" stopColor={Colors.purple} />
                </SvgLinearGradient>
              </Defs>
              {/* Background track */}
              <Circle cx="66" cy="66" r={RING_R} fill="none" stroke="#4A4A4A" strokeWidth={12} />
              {/* Gradient filled arc */}
              <Circle
                cx="66"
                cy="66"
                r={RING_R}
                fill="none"
                stroke="url(#ringg)"
                strokeWidth={12}
                strokeLinecap="round"
                strokeDasharray={RING_C}
                strokeDashoffset={RING_C * (1 - RING_PCT)}
                transform="rotate(-90 66 66)"
              />
            </Svg>
            {/* Center label */}
            <View style={styles.ringCenter}>
              <Text style={styles.ringNum}>460</Text>
              <Text style={styles.ringLabel}>KCAL LEFT</Text>
            </View>
          </View>

          {/* Legend */}
          <View style={styles.ringLegend}>
            {[
              { color: Colors.border,  label: 'Goal',     value: '2,300' },
              { color: Colors.pink,    label: 'Food',     value: '1,840' },
              { color: Colors.purple,  label: 'Exercise', value: '320'   },
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
          {MACROS.map((m, i) => (
            <View key={m.label} style={[styles.macro, i < MACROS.length - 1 && styles.macroDivider]}>
              <View style={styles.macroHeader}>
                <Text style={styles.macroLabel}>{m.label}</Text>
                <Text style={styles.macroValue}>
                  {m.value}
                  <Text style={styles.macroGoal}> / {m.goal}g</Text>
                </Text>
              </View>
              {/* Gradient progress bar */}
              <View style={styles.barTrack}>
                <LinearGradient
                  colors={Gradients.primaryHorizontal.colors}
                  start={Gradients.primaryHorizontal.start}
                  end={Gradients.primaryHorizontal.end}
                  style={[styles.barFill, { width: `${Math.round((m.value / m.goal) * 100)}%` }]}
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
              <Text style={styles.waterSub}>3 of 8 cups</Text>
            </View>
          </View>
          <View style={styles.cups}>
            {Array.from({ length: 8 }).map((_, i) => (
              <View key={i} style={[styles.cup, i < 3 && styles.cupFilled]} />
            ))}
          </View>
        </View>

        {/* Today's meals */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today's meals</Text>
          <Text style={styles.sectionMore}>+ Add</Text>
        </View>
        <View style={styles.mealsList}>
          {[
            { Icon: SunriseIcon, title: 'Breakfast', sub: 'Oatmeal & berries',      kcal: 420,  done: true  },
            { Icon: BowlIcon,    title: 'Lunch',     sub: 'Grilled chicken bowl',   kcal: 720,  done: true  },
            { Icon: BowlIcon,    title: 'Dinner',    sub: 'Add your meal',           kcal: null, done: false },
            { Icon: CookieIcon,  title: 'Snacks',    sub: 'Greek yogurt & nuts',    kcal: 700,  done: true  },
          ].map((meal) => (
            <View key={meal.title} style={[styles.mealRow, meal.done && styles.mealDone]}>
              <View style={[styles.mealIcon, meal.done && styles.mealIconDone]}>
                <meal.Icon size={20} color={meal.done ? Colors.green : Colors.textSecondary} />
              </View>
              <View style={styles.mealText}>
                <Text style={styles.mealTitle}>{meal.title}</Text>
                <Text style={styles.mealSub}>{meal.sub}</Text>
              </View>
              {meal.kcal != null ? (
                <Text style={styles.mealKcal}>
                  {meal.kcal}
                  <Text style={styles.mealKcalUnit}> kcal</Text>
                </Text>
              ) : (
                <TouchableOpacity style={styles.addBtn} activeOpacity={0.8}>
                  <PlusIcon size={16} color={Colors.white} />
                </TouchableOpacity>
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
  datePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 99,
  },
  datePillText: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.label,
    color: Colors.white,
    fontWeight: '600',
  },
  // Ring card
  ringCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Spacing.cardRadius,
    padding: 20,
    marginBottom: 14,
    gap: 20,
  },
  ringWrap: {
    width: 132,
    height: 132,
    position: 'relative',
  },
  ringCenter: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringNum: {
    fontFamily: Fonts.display,
    fontSize: 28,
    color: Colors.white,
  },
  ringLabel: {
    fontFamily: Fonts.body,
    fontSize: 10,
    color: Colors.textSecondary,
    letterSpacing: 0.5,
    marginTop: 2,
  },
  ringLegend: {
    flex: 1,
    gap: 12,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendLabel: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.label,
    color: Colors.textSecondary,
    flex: 1,
  },
  legendValue: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.label,
    fontWeight: '700',
    color: Colors.white,
  },
  // Macros card
  macrosCard: {
    backgroundColor: Colors.surface,
    borderRadius: Spacing.cardRadius,
    padding: 20,
    marginBottom: 14,
    gap: 16,
  },
  macro: {
    gap: 8,
  },
  macroDivider: {
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  macroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  macroLabel: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.body,
    fontWeight: '600',
    color: Colors.white,
  },
  macroValue: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.body,
    fontWeight: '700',
    color: Colors.white,
  },
  macroGoal: {
    fontWeight: '400',
    color: Colors.textSecondary,
  },
  barTrack: {
    height: 6,
    backgroundColor: Colors.surfaceRaised,
    borderRadius: 99,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 99,
  },
  // Water tracker
  waterCard: {
    backgroundColor: Colors.surface,
    borderRadius: Spacing.cardRadius,
    padding: 18,
    marginBottom: 22,
    gap: 14,
  },
  waterInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  waterTitle: {
    fontFamily: Fonts.body,
    fontSize: 15,
    fontWeight: '700',
    color: Colors.white,
  },
  waterSub: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.label,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  cups: {
    flexDirection: 'row',
    gap: 6,
  },
  cup: {
    flex: 1,
    height: 10,
    borderRadius: 99,
    backgroundColor: Colors.surfaceRaised,
  },
  cupFilled: {
    backgroundColor: Colors.green,
  },
  // Meals
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
  mealsList: {
    gap: 10,
  },
  mealRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 14,
    gap: 14,
  },
  mealDone: {
    opacity: 0.85,
  },
  mealIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.surfaceRaised,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mealIconDone: {
    backgroundColor: 'rgba(95,208,138,0.15)',
  },
  mealText: {
    flex: 1,
    gap: 3,
  },
  mealTitle: {
    fontFamily: Fonts.body,
    fontSize: 15,
    fontWeight: '700',
    color: Colors.white,
  },
  mealSub: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.label,
    color: Colors.textSecondary,
  },
  mealKcal: {
    fontFamily: Fonts.body,
    fontSize: 15,
    fontWeight: '700',
    color: Colors.white,
  },
  mealKcalUnit: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.label,
    fontWeight: '400',
    color: Colors.textSecondary,
  },
  addBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.surfaceRaised,
    alignItems: 'center',
    justifyContent: 'center',
  },
});