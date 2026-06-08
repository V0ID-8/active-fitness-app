import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  StyleSheet, View, Text, ScrollView, TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Timestamp } from 'firebase/firestore';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Colors, Fonts, FontSizes, Spacing, Gradients } from '../../constants';
import AppHeader from '../../components/AppHeader';
import {
  DumbbellIcon, PlayIcon, PlusIcon,
  MuscleIcon, FlameIcon, HeartIcon, BoltIcon, CheckIcon,
} from '../../components/Icon';
import { useAuth } from '../../hooks/useAuth';
import { useUserProfile } from '../../hooks/useUserProfile';
import { exerciseService } from '../../services/exerciseService';
import { workoutService } from '../../services/workoutService';
import { dailyLogService } from '../../services/dailyLogService';
import { WorkoutSession, Exercise } from '../../types';

const TODAY = new Date().toISOString().split('T')[0];

function ExerciseIcon({ ex, size = 24, color = Colors.textSecondary }: { ex: Exercise; size?: number; color?: string }) {
  const g = ex.muscleGroup;
  if (g === 'cardio')                   return <FlameIcon    size={size} color={color} />;
  if (g === 'core')                     return <BoltIcon     size={size} color={color} />;
  if (g === 'back' || g === 'legs')     return <DumbbellIcon size={size} color={color} />;
  return <MuscleIcon size={size} color={color} />;
}

export default function WorkoutsScreen() {
  const navigation  = useNavigation<any>();
  const { user }    = useAuth();
  const { profile } = useUserProfile(user?.uid ?? null);

  const todaysPlan = useMemo(
    () => exerciseService.getTodaysWorkout(profile?.goal ?? 'fit'),
    [profile?.goal],
  );

  const [session,       setSession]       = useState<WorkoutSession | null>(null);
  const [exercisesDone, setExercisesDone] = useState<boolean[]>([]);
  const [sessionLoaded, setSessionLoaded] = useState(false);
  const [isStarting,    setIsStarting]    = useState(false);
  const [isFinishing,   setIsFinishing]   = useState(false);

  // Reload session whenever the screen comes into focus (e.g. after returning from ExercisePicker)
  const loadSession = useCallback(async () => {
    if (!user) return;
    const s = await workoutService.getTodaysSession(user.uid, TODAY);
    setSession(s);
    setExercisesDone(s ? s.exercises.map((ex) => ex.completed) : []);
    setSessionLoaded(true);
  }, [user]);

  useFocusEffect(useCallback(() => { loadSession(); }, [loadSession]));

  // Sync exercisesDone length when plan changes and no session yet
  useEffect(() => {
    if (!sessionLoaded || session) return;
    setExercisesDone(todaysPlan.exercises.map(() => false));
  }, [sessionLoaded, session, todaysPlan]);

  const isCompleted = session?.completed === true;
  const isStarted   = session !== null && !isCompleted;
  const doneCount   = exercisesDone.filter(Boolean).length;

  // Current exercise list: session exercises take priority over auto-plan
  const displayExercises = session?.exercises ?? [];

  const handleStart = async () => {
    if (!user || isStarting || todaysPlan.isRestDay) return;
    setIsStarting(true);
    const entries = todaysPlan.exercises.map((ex) => ({
      name: ex.name, sets: ex.sets, reps: ex.repsMax, weightKg: null, completed: false,
    }));
    const sessionId = await workoutService.logWorkoutSession(user.uid, {
      date: TODAY, programName: todaysPlan.programName,
      exercises: entries, durationMinutes: todaysPlan.estimatedMinutes, completed: false,
    });
    const newSession: WorkoutSession = {
      id: sessionId, date: TODAY, programName: todaysPlan.programName,
      exercises: entries, durationMinutes: todaysPlan.estimatedMinutes,
      completed: false, createdAt: Timestamp.now(),
    };
    setSession(newSession);
    setExercisesDone(entries.map(() => false));
    setIsStarting(false);
  };

  const handleToggle = async (index: number) => {
    if (!user || !session?.id || isCompleted) return;
    const newVal = !exercisesDone[index];
    setExercisesDone((prev) => prev.map((d, i) => (i === index ? newVal : d)));
    await workoutService.markExerciseComplete(user.uid, session.id, index, newVal);
  };

  const handleFinish = async () => {
    if (!user || !session?.id || isFinishing) return;
    setIsFinishing(true);
    await workoutService.markSessionComplete(user.uid, session.id);
    await dailyLogService.markWorkoutComplete(user.uid, TODAY, session.id);
    setSession((prev) => prev ? { ...prev, completed: true } : null);
    setIsFinishing(false);
  };

  const goToPicker = () => {
    navigation.navigate('ExercisePicker', { date: TODAY, sessionId: session?.id ?? null });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <AppHeader title="Workouts" />

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

          {isCompleted && (
            <View style={styles.completedBadge}>
              <CheckIcon size={12} color={Colors.white} />
              <Text style={styles.completedBadgeText}>Completed</Text>
            </View>
          )}
          {isStarted && (
            <View style={styles.inProgressBadge}>
              <Text style={styles.inProgressBadgeText}>
                In Progress · {doneCount}/{displayExercises.length}
              </Text>
            </View>
          )}

          <Text style={styles.heroEyebrow}>
            {todaysPlan.isRestDay ? 'Today · Rest Day' : `Today · ${todaysPlan.workoutType}`}
          </Text>
          <Text style={styles.heroTitle}>
            {session
              ? session.programName
              : todaysPlan.isRestDay ? 'Rest &\nRecover.' : todaysPlan.programName}
          </Text>

          {!todaysPlan.isRestDay && !isStarted && !isCompleted && (
            <TouchableOpacity style={styles.heroBtn} activeOpacity={0.85} onPress={handleStart} disabled={isStarting}>
              {isStarting
                ? <ActivityIndicator size="small" color={Colors.purple} />
                : <><PlayIcon size={15} color={Colors.purple} /><Text style={styles.heroBtnText}>Start · {todaysPlan.estimatedMinutes} min</Text></>
              }
            </TouchableOpacity>
          )}
          {isStarted && (
            <TouchableOpacity style={styles.finishBtn} activeOpacity={0.85} onPress={handleFinish} disabled={isFinishing}>
              {isFinishing
                ? <ActivityIndicator size="small" color={Colors.white} />
                : <Text style={styles.finishBtnText}>Finish Workout</Text>
              }
            </TouchableOpacity>
          )}
        </LinearGradient>

        {/* Exercises section */}
        {!todaysPlan.isRestDay ? (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                {session ? `Exercises · ${doneCount}/${displayExercises.length} done` : "Today's exercises"}
              </Text>
              <TouchableOpacity style={styles.addExBtn} onPress={goToPicker} activeOpacity={0.8}>
                <PlusIcon size={14} color={Colors.white} />
                <Text style={styles.addExText}>Add</Text>
              </TouchableOpacity>
            </View>

            {!sessionLoaded ? (
              <View style={styles.loadingRow}>
                <ActivityIndicator color={Colors.pink} />
              </View>
            ) : displayExercises.length > 0 ? (
              <View style={styles.list}>
                {displayExercises.map((entry, i) => {
                  const done = exercisesDone[i] ?? false;
                  return (
                    <View key={`${entry.name}-${i}`} style={[styles.row, done && styles.rowDone]}>
                      <View style={[styles.rowThumb, done && styles.rowThumbDone]}>
                        <DumbbellIcon size={22} color={done ? Colors.white : Colors.textSecondary} />
                      </View>
                      <View style={styles.rowText}>
                        <Text style={[styles.rowTitle, done && styles.rowTitleDone]}>{entry.name}</Text>
                        <Text style={styles.rowSub}>
                          {entry.sets} sets · {entry.reps} reps
                          {entry.weightKg ? ` · ${entry.weightKg} kg` : ''}
                        </Text>
                      </View>
                      <TouchableOpacity onPress={() => handleToggle(i)} disabled={isCompleted} activeOpacity={0.8}>
                        {done ? (
                          <LinearGradient
                            colors={Gradients.primary.colors}
                            start={Gradients.primary.start}
                            end={Gradients.primary.end}
                            style={styles.actionCircle}
                          >
                            <CheckIcon size={13} color={Colors.white} />
                          </LinearGradient>
                        ) : (
                          <View style={[styles.actionCircle, !isStarted && styles.actionCircleLocked]}>
                            <PlayIcon size={13} color={isStarted ? Colors.white : Colors.textTertiary} />
                          </View>
                        )}
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>
            ) : (
              /* No session yet — show today's auto plan as preview */
              <View style={styles.list}>
                {todaysPlan.exercises.map((ex) => (
                  <View key={ex.id} style={styles.row}>
                    <View style={styles.rowThumb}>
                      <ExerciseIcon ex={ex} size={22} />
                    </View>
                    <View style={styles.rowText}>
                      <Text style={styles.rowTitle}>{ex.name}</Text>
                      <Text style={styles.rowSub}>
                        {ex.sets} sets · {ex.repsMin}–{ex.repsMax} reps · {ex.restSeconds}s rest
                      </Text>
                    </View>
                    <View style={[styles.actionCircle, styles.actionCircleLocked]}>
                      <PlayIcon size={13} color={Colors.textTertiary} />
                    </View>
                  </View>
                ))}
              </View>
            )}
          </>
        ) : (
          <View style={styles.restCard}>
            <HeartIcon size={32} color={Colors.pink} />
            <Text style={styles.restTitle}>Rest & Recover</Text>
            <Text style={styles.restSub}>
              Your muscles grow during recovery. Take today off and come back stronger tomorrow.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingHorizontal: Spacing.screenHorizontalApp, paddingTop: 16, paddingBottom: Spacing.tabBarOffset },
  // Hero
  hero:        { borderRadius: Spacing.cardRadius, padding: 22, marginBottom: 24, overflow: 'hidden', minHeight: 180, justifyContent: 'flex-end' },
  heroDeco:    { position: 'absolute', top: -10, right: -10 },
  heroEyebrow: { fontFamily: Fonts.body, fontSize: FontSizes.label, color: 'rgba(255,255,255,0.75)', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6 },
  heroTitle:   { fontFamily: Fonts.display, fontSize: 24, color: Colors.white, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 18, lineHeight: 30 },
  heroBtn:     { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: Colors.white, alignSelf: 'flex-start', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 99 },
  heroBtnText: { fontFamily: Fonts.body, fontSize: 14, fontWeight: '700', color: Colors.purple },
  finishBtn:   { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.2)', alignSelf: 'flex-start', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 99, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.5)' },
  finishBtnText: { fontFamily: Fonts.body, fontSize: 14, fontWeight: '700', color: Colors.white },
  completedBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: Colors.green, alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 99, marginBottom: 10 },
  completedBadgeText: { fontFamily: Fonts.body, fontSize: 12, fontWeight: '700', color: Colors.white },
  inProgressBadge: { backgroundColor: 'rgba(255,255,255,0.2)', alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 99, marginBottom: 10 },
  inProgressBadgeText: { fontFamily: Fonts.body, fontSize: 12, fontWeight: '600', color: Colors.white },
  // Section header
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  sectionTitle:  { fontFamily: Fonts.body, fontSize: 16, fontWeight: '700', color: Colors.white },
  addExBtn:      { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: Colors.pink, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 99 },
  addExText:     { fontFamily: Fonts.body, fontSize: 13, fontWeight: '700', color: Colors.white },
  // Exercise list
  loadingRow:  { height: 80, alignItems: 'center', justifyContent: 'center' },
  list:        { gap: 10, marginBottom: Spacing.sectionGap },
  row:         { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, borderRadius: 16, padding: 14, gap: 14 },
  rowDone:     { opacity: 0.7 },
  rowThumb:    { width: 48, height: 48, borderRadius: 12, backgroundColor: Colors.surfaceRaised, alignItems: 'center', justifyContent: 'center' },
  rowThumbDone:{ backgroundColor: Colors.pink },
  rowText:     { flex: 1, gap: 3 },
  rowTitle:    { fontFamily: Fonts.body, fontSize: 15, fontWeight: '700', color: Colors.white },
  rowTitleDone:{ textDecorationLine: 'line-through', color: Colors.textSecondary },
  rowSub:      { fontFamily: Fonts.body, fontSize: FontSizes.label, color: Colors.textSecondary },
  actionCircle:       { width: 34, height: 34, borderRadius: 17, backgroundColor: Colors.surfaceRaised, alignItems: 'center', justifyContent: 'center' },
  actionCircleLocked: { backgroundColor: Colors.surfaceRaised },
  // Rest day
  restCard:  { backgroundColor: Colors.surface, borderRadius: Spacing.cardRadius, padding: 28, alignItems: 'center', gap: 12, marginTop: 8 },
  restTitle: { fontFamily: Fonts.display, fontSize: 22, color: Colors.white },
  restSub:   { fontFamily: Fonts.body, fontSize: FontSizes.body, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22 },
});
