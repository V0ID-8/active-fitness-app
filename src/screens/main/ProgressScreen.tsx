import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, {
  Path, Circle, Defs,
  LinearGradient as SvgLinearGradient, Stop,
} from 'react-native-svg';
import { Colors, Fonts, FontSizes, Spacing, Gradients } from '../../constants';
import AppHeader from '../../components/AppHeader';
import { CaretDownIcon } from '../../components/Icon';

// Weight data and chart geometry
const WDATA = [68.6, 69.3, 70.1, 70.6, 71.3, 72.0];
const CW = 300, CH = 92, LO = 67.6, HI = 72.8;

const pts = WDATA.map((v, i) => [
  (i / (WDATA.length - 1)) * CW,
  CH - ((v - LO) / (HI - LO)) * CH,
]);
const linePath = pts
  .map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`)
  .join(' ');
const areaPath = `${linePath} L${CW} ${CH} L0 ${CH} Z`;
const lastPt = pts[pts.length - 1];

const WEEK_LABELS = ['Wk1', 'Wk2', 'Wk3', 'Wk4', 'Wk5', 'Now'];

export default function ProgressScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <AppHeader
          title="Progress"
          right={
            <TouchableOpacity style={styles.datePill} activeOpacity={0.8}>
              <Text style={styles.datePillText}>This month</Text>
              <CaretDownIcon size={14} color={Colors.textSecondary} />
            </TouchableOpacity>
          }
        />

        {/* Weight trend card */}
        <View style={styles.chartCard}>
          <View style={styles.chartTop}>
            <View>
              <Text style={styles.chartTitle}>Weight</Text>
              <Text style={styles.chartSub}>Current · 72.0 kg</Text>
            </View>
            <Text style={styles.delta}>▲ 1.8 kg</Text>
          </View>

          {/* SVG line chart — gradient stroke + gradient area fill */}
          <Svg
            viewBox={`0 0 ${CW} ${CH}`}
            preserveAspectRatio="none"
            style={styles.svg}
          >
            <Defs>
              {/* Horizontal gradient for the line stroke */}
              <SvgLinearGradient id="lcstroke" x1="0" y1="0" x2="1" y2="0">
                <Stop offset="0" stopColor={Colors.pink} />
                <Stop offset="1" stopColor={Colors.purple} />
              </SvgLinearGradient>
              {/* Vertical gradient for the area fill */}
              <SvgLinearGradient id="lcfill" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor="rgba(234,78,255,0.35)" />
                <Stop offset="1" stopColor="rgba(81,0,255,0)" />
              </SvgLinearGradient>
            </Defs>
            {/* Filled area under the line */}
            <Path d={areaPath} fill="url(#lcfill)" />
            {/* Gradient stroke line */}
            <Path
              d={linePath}
              fill="none"
              stroke="url(#lcstroke)"
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Dot at latest data point */}
            <Circle
              cx={lastPt[0]}
              cy={lastPt[1]}
              r={5}
              fill={Colors.white}
              stroke={Colors.pink}
              strokeWidth={3}
            />
          </Svg>

          {/* Week labels */}
          <View style={styles.weekLabels}>
            {WEEK_LABELS.map((l) => (
              <Text key={l} style={styles.weekLabel}>{l}</Text>
            ))}
          </View>
        </View>

        {/* Headline stats */}
        <View style={styles.statsRow}>
          {[
            { value: '48',  label: 'Workouts'   },
            { value: '12',  label: 'Day streak'  },
            { value: '18k', label: 'kcal burned' },
          ].map((s) => (
            <View key={s.label} style={styles.statCell}>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
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
    fontWeight: '600',
    color: Colors.white,
  },
  // Chart card
  chartCard: {
    backgroundColor: Colors.surface,
    borderRadius: Spacing.cardRadius,
    padding: 18,
    marginBottom: 14,
  },
  chartTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  chartTitle: {
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
  delta: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.label,
    fontWeight: '700',
    color: Colors.green,
  },
  svg: {
    width: '100%',
    height: 96,
    overflow: 'visible',
  },
  weekLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  weekLabel: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.labelSmall,
    color: Colors.textTertiary,
  },
  // Stats row
  statsRow: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: Spacing.cardRadius,
    marginBottom: 14,
    overflow: 'hidden',
  },
  statCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 18,
    gap: 4,
    borderRightWidth: 1,
    borderRightColor: Colors.border,
  },
  statValue: {
    fontFamily: Fonts.display,
    fontSize: 24,
    color: Colors.white,
  },
  statLabel: {
    fontFamily: Fonts.body,
    fontSize: FontSizes.label,
    color: Colors.textSecondary,
  },
});