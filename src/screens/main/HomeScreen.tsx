import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Fonts, FontSizes, Spacing, Gradients } from '../../constants';
import {
  BellIcon, DumbbellIcon, PlayIcon,
  FlameIcon, BoltIcon, DropletIcon,
  TrophyIcon, NutritionIcon, BarChartIcon,
} from '../../components/Icon';

const BARS = [40, 62, 35, 78, 55, 90, 48];
const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const ACTIVE_BAR = 5;

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Header: avatar + greeting + bell */}
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>A</Text>
          </View>
          <View style={styles.greet}>
            <Text style={styles.greetSmall}>Good morning</Text>
            <Text style={styles.greetName}>Alex Carter</Text>
          </View>
          <View style={styles.bellWrap}>
            <BellIcon size={22} color={Colors.white} />
            {/* Notification dot */}
            <View style={styles.bellDot} />
          </View>
        </View>

        {/* Hero card */}
        <LinearGradient
          colors={Gradients.primary.colors}
          start={Gradients.primary.start}
          end={Gradients.primary.end}
          style={styles.hero}
        >
          {/* Large faded dumbbell icon as decoration */}
          <View style={styles.heroDeco} pointerEvents="none">
            <DumbbellIcon size={130} color="rgba(255,255,255,0.12)" />
          </View>

          <Text style={styles.heroEyebrow}>Today · Upper Body</Text>
          <Text style={styles.heroTitle}>No excuses.{'\n'}Just progress.</Text>

          <TouchableOpacity style={styles.heroBtn} activeOpacity={0.85}>
            <PlayIcon size={15} color={Colors.purple} />
            <Text style={styles.heroBtnText}>Start workout</Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* Quick stats row */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <FlameIcon size={18} color={Colors.pink} />
            <Text style={styles.statBig}>1,840<Text style={styles.statUnit}> kcal</Text></Text>
            <Text style={styles.statCap}>of 2,300 goal</Text>
          </View>
          <View style={styles.statCard}>
            <BoltIcon size={18} color={Colors.purple} />
            <Text style={styles.statBig}>120<Text style={styles.statUnit}> g</Text></Text>
            <Text style={styles.statCap}>protein today</Text>
          </View>
          <View style={styles.statCard}>
            <DropletIcon size={18} color="#5FD08A" />
            <Text style={styles.statBig}>3<Text style={styles.statUnit}> /8</Text></Text>
            <Text style={styles.statCap}>cups water</Text>
          </View>
        </View>

        {/* Today's plan */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today's plan</Text>
          <Text style={styles.sectionMore}>See all</Text>
        </View>
        <TouchableOpacity style={styles.planCard} activeOpacity={0.85}>
          <View style={styles.planThumb}>
            <DumbbellIcon size={28} color={Colors.pink} />
          </View>
          <View style={styles.planText}>
            <Text style={styles.planTitle}>Upper Body Strength</Text>
            <Text style={styles.planSub}>45 min · 6 exercises · Intermediate</Text>
          </View>
          <View style={styles.planPlay}>
            <PlayIcon size={16} color={Colors.white} />
          </View>
        </TouchableOpacity>

        {/* Weekly activity chart */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your progress</Text>
          <Text style={styles.sectionMore}>Details</Text>
        </View>
        <View style={styles.chartCard}>
          <View style={styles.chartTop}>
            <View>
              <Text style={styles.chartLabel}>Weekly activity</Text>
              <Text style={styles.chartSub}>4 of 5 workouts done</Text>
            </View>
            <Text style={styles.chartDelta}>▲ 12%</Text>
          </View>
          <View style={styles.barsRow}>
            {BARS.map((h, i) => (
              <View
                key={i}
                style={[
                  styles.bar,
                  { height: (h / 100) * 72 },
                  i === ACTIVE_BAR && styles.barActive,
                ]}
              />
            ))}
          </View>
          <View style={styles.dayLabels}>
            {DAYS.map((d, i) => (
              <Text key={i} style={styles.dayLabel}>{d}</Text>
            ))}
          </View>
        </View>

        {/* Explore grid */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Explore</Text>
        </View>
        <View style={styles.grid}>
          {[
            { Icon: DumbbellIcon,  label: 'Workouts',     sub: 'Plans for your goal'   },
            { Icon: NutritionIcon, label: 'Nutrition',    sub: 'Calories & protein'    },
            { Icon: BarChartIcon,  label: 'Progress',     sub: 'Track your results'    },
            { Icon: TrophyIcon,    label: 'Achievements', sub: 'Your milestones'       },
          ].map((item) => (
            <TouchableOpacity key={item.label} style={styles.featureCard} activeOpacity={0.85}>
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
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    paddingHorizontal: Spacing.screenHorizontalApp,
    paddingTop: 16,
    paddingBottom: Spacing.tabBarOffset,
  },
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 22,
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.pink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: Fonts.display,
    fontSize: 20,
    color: Colors.white,
  },
  greet: {
    flex: 1,
    gap: 1,
  },
  greetSmall: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.label,
    color: Colors.textSecondary,
  },
  greetName: {
    fontFamily: Fonts.body,
    fontSize: 16,
    fontWeight: '700',
    color: Colors.white,
  },
  bellWrap: {
    position: 'relative',
    padding: 4,
  },
  bellDot: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.pink,
    borderWidth: 1.5,
    borderColor: Colors.background,
  },
  // Hero card
  hero: {
    borderRadius: Spacing.cardRadius,
    padding: 22,
    marginBottom: Spacing.sectionGap,
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
  // Quick stats
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: Spacing.sectionGap,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 14,
    gap: 4,
    alignItems: 'flex-start',
  },
  statBig: {
    fontFamily: Fonts.display,
    fontSize: 20,
    color: Colors.white,
  },
  statUnit: {
    fontFamily: Fonts.body,
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '400',
  },
  statCap: {
    fontFamily: Fonts.body,
    fontSize: 11,
    color: Colors.textTertiary,
  },
  // Section headers
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
  // Plan card
  planCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Spacing.cardRadius,
    padding: 16,
    gap: 14,
    marginBottom: Spacing.sectionGap,
  },
  planThumb: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: Colors.surfaceRaised,
    alignItems: 'center',
    justifyContent: 'center',
  },
  planText: {
    flex: 1,
    gap: 4,
  },
  planTitle: {
    fontFamily: Fonts.body,
    fontSize: 15,
    fontWeight: '700',
    color: Colors.white,
  },
  planSub: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.label,
    color: Colors.textSecondary,
  },
  planPlay: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.pink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Chart
  chartCard: {
    backgroundColor: Colors.surface,
    borderRadius: Spacing.cardRadius,
    padding: 18,
    marginBottom: Spacing.sectionGap,
  },
  chartTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 18,
  },
  chartLabel: {
    fontFamily: Fonts.body,
    fontSize: 15,
    fontWeight: '700',
    color: Colors.white,
  },
  chartSub: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.label,
    color: Colors.textSecondary,
    marginTop: 3,
  },
  chartDelta: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.label,
    fontWeight: '700',
    color: Colors.green,
  },
  barsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 72,
    gap: 6,
  },
  bar: {
    flex: 1,
    borderRadius: 4,
    backgroundColor: Colors.surfaceRaised,
  },
  barActive: {
    backgroundColor: Colors.pink,
  },
  dayLabels: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 6,
  },
  dayLabel: {
    flex: 1,
    textAlign: 'center',
    fontFamily: Fonts.body,
    fontSize: FontSizes.labelSmall,
    color: Colors.textTertiary,
  },
  // Explore grid
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  featureCard: {
    width: '47.5%',
    backgroundColor: Colors.surface,
    borderRadius: Spacing.cardRadius,
    padding: 18,
    gap: 8,
  },
  featureIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.surfaceRaised,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  featureLabel: {
    fontFamily: Fonts.body,
    fontSize: 15,
    fontWeight: '700',
    color: Colors.white,
  },
  featureSub: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.label,
    color: Colors.textSecondary,
  },
});
