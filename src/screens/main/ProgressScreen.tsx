import { useState, useMemo } from 'react';
import {
  StyleSheet, View, Text, ScrollView, TouchableOpacity,
  Modal, TextInput, ActivityIndicator, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Circle, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';
import { Colors, Fonts, FontSizes, Spacing, Gradients } from '../../constants';
import AppHeader from '../../components/AppHeader';
import { MuscleIcon, DumbbellIcon, BoltIcon, PlusIcon } from '../../components/Icon';
import { useAuth } from '../../hooks/useAuth';
import { useWeightLog } from '../../hooks/useWeightLog';
import { useWorkoutStats } from '../../hooks/useWorkoutStats';
import { useWeeklyActivity } from '../../hooks/useWeeklyActivity';
import { progressService } from '../../services/progressService';

// SVG chart canvas size
const CW = 300;
const CH = 92;

function fmtDate(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function fmtKcal(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : `${n}`;
}

export default function ProgressScreen() {
  const { user }                                      = useAuth();
  const { entries, loading: wLoading, reload }        = useWeightLog(user?.uid ?? null);
  const { totalWorkouts, currentStreak,
          estimatedKcalBurned, loading: sLoading }    = useWorkoutStats(user?.uid ?? null);
  const { days, completedCount }                      = useWeeklyActivity(user?.uid ?? null);

  // Weight log modal
  const [modalVisible, setModalVisible] = useState(false);
  const [weightInput,  setWeightInput]  = useState('');
  const [saving,       setSaving]       = useState(false);

  const handleLogWeight = async () => {
    if (!user || !weightInput.trim()) return;
    const kg = parseFloat(weightInput.replace(',', '.'));
    if (isNaN(kg) || kg < 20 || kg > 300) return;
    setSaving(true);
    await progressService.addWeightEntry(user.uid, kg);
    setSaving(false);
    setModalVisible(false);
    setWeightInput('');
    reload();
  };

  // Weight chart geometry
  const { linePath, areaPath, lastPt, chartLabels, latestWeight, weightDelta } =
    useMemo(() => {
      if (entries.length < 2) {
        return { linePath: '', areaPath: '', lastPt: [0, 0] as [number, number], chartLabels: [] as string[], latestWeight: entries[0]?.weightKg ?? null, weightDelta: null };
      }

      const values = entries.map((e) => e.weightKg);
      const lo     = Math.min(...values) - 0.5;
      const hi     = Math.max(...values) + 0.5;
      const range  = hi - lo || 1;

      const pts: [number, number][] = entries.map((e, i) => [
        (i / (entries.length - 1)) * CW,
        CH - ((e.weightKg - lo) / range) * CH,
      ]);

      const line  = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');
      const area  = `${line} L${CW} ${CH} L0 ${CH} Z`;
      const delta = entries[entries.length - 1].weightKg - entries[0].weightKg;

      return {
        linePath:    line,
        areaPath:    area,
        lastPt:      pts[pts.length - 1],
        chartLabels: entries.map((e) => fmtDate(e.date)),
        latestWeight: entries[entries.length - 1].weightKg,
        weightDelta: delta,
      };
    }, [entries]);

  const hasChart = entries.length >= 2;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <AppHeader
          title="Progress"
          right={
            <View style={styles.datePill}>
              <Text style={styles.datePillText}>This month</Text>
            </View>
          }
        />

        {/* Weight trend card */}
        <View style={styles.chartCard}>
          <View style={styles.chartTop}>
            <View>
              <Text style={styles.chartTitle}>Weight</Text>
              <Text style={styles.chartSub}>
                {latestWeight != null ? `Current · ${latestWeight} kg` : 'No entries yet'}
              </Text>
            </View>
            <View style={styles.chartTopRight}>
              {weightDelta != null && (
                <Text style={[styles.delta, { color: weightDelta >= 0 ? Colors.green : Colors.pink }]}>
                  {weightDelta >= 0 ? '▲' : '▼'} {Math.abs(weightDelta).toFixed(1)} kg
                </Text>
              )}
              <TouchableOpacity
                style={styles.logWeightBtn}
                activeOpacity={0.8}
                onPress={() => setModalVisible(true)}
              >
                <PlusIcon size={14} color={Colors.white} />
                <Text style={styles.logWeightText}>Log</Text>
              </TouchableOpacity>
            </View>
          </View>

          {wLoading ? (
            <View style={styles.chartPlaceholder}>
              <ActivityIndicator color={Colors.pink} />
            </View>
          ) : hasChart ? (
            <>
              <Svg viewBox={`0 0 ${CW} ${CH}`} preserveAspectRatio="none" style={styles.svg}>
                <Defs>
                  <SvgLinearGradient id="lcstroke" x1="0" y1="0" x2="1" y2="0">
                    <Stop offset="0" stopColor={Colors.pink} />
                    <Stop offset="1" stopColor={Colors.purple} />
                  </SvgLinearGradient>
                  <SvgLinearGradient id="lcfill" x1="0" y1="0" x2="0" y2="1">
                    <Stop offset="0" stopColor="rgba(234,78,255,0.35)" />
                    <Stop offset="1" stopColor="rgba(81,0,255,0)" />
                  </SvgLinearGradient>
                </Defs>
                <Path d={areaPath} fill="url(#lcfill)" />
                <Path d={linePath} fill="none" stroke="url(#lcstroke)" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
                <Circle cx={lastPt[0]} cy={lastPt[1]} r={5} fill={Colors.white} stroke={Colors.pink} strokeWidth={3} />
              </Svg>
              <View style={styles.weekLabels}>
                {chartLabels.map((l, i) => (
                  <Text key={i} style={styles.weekLabel}>{l}</Text>
                ))}
              </View>
            </>
          ) : (
            <View style={styles.chartPlaceholder}>
              <Text style={styles.placeholderText}>
                {entries.length === 0
                  ? 'Tap "Log" to record your first weight entry'
                  : 'Log one more entry to see your trend'}
              </Text>
            </View>
          )}
        </View>

        {/* Headline stats */}
        <View style={styles.statsRow}>
          {sLoading ? (
            <View style={styles.statsLoading}><ActivityIndicator color={Colors.pink} /></View>
          ) : (
            [
              { value: `${totalWorkouts}`,               label: 'Workouts'   },
              { value: `${currentStreak}`,               label: 'Day streak' },
              { value: fmtKcal(estimatedKcalBurned),     label: 'kcal burned' },
            ].map((s, i, arr) => (
              <View key={s.label} style={[styles.statCell, i === arr.length - 1 && styles.statCellLast]}>
                <Text style={styles.statValue}>{s.value}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            ))
          )}
        </View>

        {/* Weekly activity */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>This week</Text>
          <Text style={styles.sectionMore}>{completedCount} / 7</Text>
        </View>
        <View style={styles.chartCard}>
          <View style={styles.chartTop}>
            <View>
              <Text style={styles.chartTitle}>Weekly activity</Text>
              <Text style={styles.chartSub}>{completedCount} of 7 workouts done</Text>
            </View>
            <Text style={[styles.delta, { color: Colors.green }]}>
              {completedCount > 0 ? `${completedCount} ✓` : '—'}
            </Text>
          </View>
          <View style={styles.barsRow}>
            {days.map((day, i) => (
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
            {days.map((day, i) => (
              <Text key={i} style={styles.dayLabel}>{day.dayLabel}</Text>
            ))}
          </View>
        </View>

        {/* Personal records */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Personal records</Text>
          <Text style={styles.sectionMore}>All</Text>
        </View>
        <View style={styles.recordsList}>
          {[
            { Icon: MuscleIcon,   title: 'Bench Press', sub: 'Track with workouts', value: '— kg' },
            { Icon: DumbbellIcon, title: 'Deadlift',    sub: 'Track with workouts', value: '— kg' },
            { Icon: BoltIcon,     title: 'Squat',       sub: 'Track with workouts', value: '— kg' },
          ].map((r) => (
            <View key={r.title} style={styles.recordRow}>
              <LinearGradient
                colors={Gradients.primary.colors}
                start={Gradients.primary.start}
                end={Gradients.primary.end}
                style={styles.recordThumb}
              >
                <r.Icon size={22} color={Colors.white} />
              </LinearGradient>
              <View style={styles.recordText}>
                <Text style={styles.recordTitle}>{r.title}</Text>
                <Text style={styles.recordSub}>{r.sub}</Text>
              </View>
              <Text style={styles.recordValue}>{r.value}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Log Weight Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={() => setModalVisible(false)}
          />
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Log Weight</Text>
            <Text style={styles.modalSub}>Enter today's weight in kg</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="e.g. 72.5"
              placeholderTextColor={Colors.textTertiary}
              value={weightInput}
              onChangeText={setWeightInput}
              keyboardType="decimal-pad"
              autoFocus
              returnKeyType="done"
              onSubmitEditing={handleLogWeight}
            />
            <TouchableOpacity
              style={[styles.modalBtn, (!weightInput.trim() || saving) && styles.modalBtnDisabled]}
              activeOpacity={0.85}
              onPress={handleLogWeight}
              disabled={!weightInput.trim() || saving}
            >
              {saving ? (
                <ActivityIndicator color={Colors.white} />
              ) : (
                <Text style={styles.modalBtnText}>Save</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalCancel} onPress={() => setModalVisible(false)}>
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingHorizontal: Spacing.screenHorizontalApp, paddingTop: 16, paddingBottom: Spacing.tabBarOffset },
  datePill: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Colors.surface, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 99 },
  datePillText: { fontFamily: Fonts.body, fontSize: FontSizes.label, fontWeight: '600', color: Colors.white },
  // Chart card
  chartCard:    { backgroundColor: Colors.surface, borderRadius: Spacing.cardRadius, padding: 18, marginBottom: 14 },
  chartTop:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  chartTopRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  chartTitle:   { fontFamily: Fonts.body, fontSize: 15, fontWeight: '700', color: Colors.white },
  chartSub:     { fontFamily: Fonts.body, fontSize: FontSizes.label, color: Colors.textSecondary, marginTop: 3 },
  delta:        { fontFamily: Fonts.body, fontSize: FontSizes.label, fontWeight: '700', color: Colors.green },
  logWeightBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Colors.pink, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 99 },
  logWeightText:{ fontFamily: Fonts.body, fontSize: 12, fontWeight: '700', color: Colors.white },
  svg:          { width: '100%', height: 96, overflow: 'visible' },
  weekLabels:   { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  weekLabel:    { fontFamily: Fonts.body, fontSize: FontSizes.labelSmall, color: Colors.textTertiary },
  chartPlaceholder: { height: 96, alignItems: 'center', justifyContent: 'center' },
  placeholderText:  { fontFamily: Fonts.body, fontSize: FontSizes.label, color: Colors.textTertiary, textAlign: 'center', lineHeight: 20 },
  // Stats row
  statsRow:     { flexDirection: 'row', backgroundColor: Colors.surface, borderRadius: Spacing.cardRadius, marginBottom: 14, overflow: 'hidden' },
  statsLoading: { flex: 1, height: 80, alignItems: 'center', justifyContent: 'center' },
  statCell:     { flex: 1, alignItems: 'center', paddingVertical: 18, gap: 4, borderRightWidth: 1, borderRightColor: Colors.border },
  statCellLast: { borderRightWidth: 0 },
  statValue:    { fontFamily: Fonts.display, fontSize: 24, color: Colors.white },
  statLabel:    { fontFamily: Fonts.body, fontSize: FontSizes.label, color: Colors.textSecondary },
  // Section
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle:  { fontFamily: Fonts.body, fontSize: 16, fontWeight: '700', color: Colors.white },
  sectionMore:   { fontFamily: Fonts.body, fontSize: FontSizes.label, color: Colors.textSecondary },
  // Weekly bars
  barsRow:  { flexDirection: 'row', alignItems: 'flex-end', height: 72, gap: 6 },
  bar:      { flex: 1, borderRadius: 4, backgroundColor: Colors.surfaceRaised },
  barActive:{ backgroundColor: Colors.pink },
  dayLabels:{ flexDirection: 'row', marginTop: 8, gap: 6 },
  dayLabel: { flex: 1, textAlign: 'center', fontFamily: Fonts.body, fontSize: FontSizes.labelSmall, color: Colors.textTertiary },
  // Records
  recordsList:  { gap: 10 },
  recordRow:    { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, borderRadius: 16, padding: 14, gap: 14 },
  recordThumb:  { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  recordText:   { flex: 1, gap: 3 },
  recordTitle:  { fontFamily: Fonts.body, fontSize: 15, fontWeight: '700', color: Colors.white },
  recordSub:    { fontFamily: Fonts.body, fontSize: FontSizes.label, color: Colors.textSecondary },
  recordValue:  { fontFamily: Fonts.display, fontSize: 20, color: Colors.white },
  // Modal
  modalOverlay: { flex: 1, justifyContent: 'flex-end' },
  modalBackdrop:{ ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.6)' },
  modalSheet:   { backgroundColor: Colors.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40, alignItems: 'center' },
  modalHandle:  { width: 40, height: 4, borderRadius: 2, backgroundColor: Colors.border, marginBottom: 20 },
  modalTitle:   { fontFamily: Fonts.display, fontSize: 22, color: Colors.white, marginBottom: 6 },
  modalSub:     { fontFamily: Fonts.body, fontSize: FontSizes.label, color: Colors.textSecondary, marginBottom: 24 },
  modalInput:   { width: '100%', backgroundColor: Colors.surfaceRaised, borderRadius: 14, paddingHorizontal: 18, paddingVertical: 16, fontFamily: Fonts.body, fontSize: 28, color: Colors.white, textAlign: 'center', marginBottom: 20 },
  modalBtn:     { width: '100%', backgroundColor: Colors.pink, borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginBottom: 10 },
  modalBtnDisabled: { opacity: 0.45 },
  modalBtnText: { fontFamily: Fonts.body, fontSize: 16, fontWeight: '700', color: Colors.white },
  modalCancel:  { paddingVertical: 10 },
  modalCancelText: { fontFamily: Fonts.body, fontSize: FontSizes.body, color: Colors.textSecondary },
});
