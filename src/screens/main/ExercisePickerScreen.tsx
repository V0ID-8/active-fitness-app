import { useState, useMemo, useCallback } from 'react';
import {
  StyleSheet, View, Text, TextInput, FlatList,
  TouchableOpacity, ScrollView, ActivityIndicator,
  ListRenderItem,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Colors, Fonts, FontSizes, Spacing } from '../../constants';
import { ChevronRightIcon, SearchIcon, CheckIcon, PlusIcon } from '../../components/Icon';
import { exercises } from '../../data/exercises';
import { workoutService } from '../../services/workoutService';
import { useAuth } from '../../hooks/useAuth';
import { Exercise } from '../../types';
import { MainStackParamList } from '../../navigation/MainStackNavigator';

type RouteType = RouteProp<MainStackParamList, 'ExercisePicker'>;

type MuscleGroup = 'chest' | 'back' | 'shoulders' | 'arms' | 'legs' | 'core' | 'cardio';

const GROUPS: { key: string; label: string }[] = [
  { key: 'all',       label: 'All'       },
  { key: 'chest',     label: 'Chest'     },
  { key: 'back',      label: 'Back'      },
  { key: 'shoulders', label: 'Shoulders' },
  { key: 'arms',      label: 'Arms'      },
  { key: 'legs',      label: 'Legs'      },
  { key: 'core',      label: 'Core'      },
  { key: 'cardio',    label: 'Cardio'    },
];

const EQUIPMENT_LABELS: Record<string, string> = {
  bodyweight: 'Bodyweight',
  dumbbell:   'Dumbbell',
  barbell:    'Barbell',
  machine:    'Machine',
  none:       'No equipment',
};

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner:     Colors.green,
  intermediate: '#F5A623',
  advanced:     Colors.pink,
};

export default function ExercisePickerScreen() {
  const navigation        = useNavigation<any>();
  const { params }        = useRoute<RouteType>();
  const { date, sessionId } = params;
  const { user }          = useAuth();

  const [query,       setQuery]       = useState('');
  const [activeGroup, setActiveGroup] = useState('all');
  const [selected,    setSelected]    = useState<Set<string>>(new Set());
  const [adding,      setAdding]      = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return exercises.filter((ex) => {
      const matchesGroup  = activeGroup === 'all' || ex.muscleGroup === activeGroup;
      const matchesSearch = q === '' || ex.name.toLowerCase().includes(q);
      return matchesGroup && matchesSearch;
    });
  }, [query, activeGroup]);

  const toggle = useCallback((id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const handleAdd = async () => {
    if (!user || selected.size === 0 || adding) return;
    setAdding(true);

    const picked = exercises.filter((ex) => selected.has(ex.id));
    const entries = picked.map((ex) => ({
      name:     ex.name,
      sets:     ex.sets,
      reps:     ex.repsMax,
      weightKg: null as number | null,
      completed: false,
    }));

    if (sessionId) {
      await workoutService.addExercisesToSession(user.uid, sessionId, entries);
    } else {
      await workoutService.logWorkoutSession(user.uid, {
        date,
        programName:       'Custom Workout',
        exercises:         entries,
        durationMinutes:   picked.length * 5,
        completed:         false,
      });
    }

    setAdding(false);
    navigation.goBack();
  };

  const renderItem: ListRenderItem<Exercise> = useCallback(
    ({ item }) => {
      const isSelected = selected.has(item.id);
      return (
        <TouchableOpacity
          style={[styles.row, isSelected && styles.rowSelected]}
          activeOpacity={0.75}
          onPress={() => toggle(item.id)}
        >
          <View style={styles.rowInfo}>
            <View style={styles.rowTop}>
              <Text style={styles.rowName} numberOfLines={1}>{item.name}</Text>
              <View style={[styles.diffDot, { backgroundColor: DIFFICULTY_COLORS[item.difficulty] }]} />
            </View>
            <Text style={styles.rowMeta}>
              {item.muscleGroup.charAt(0).toUpperCase() + item.muscleGroup.slice(1)}
              {'  ·  '}
              {item.sets} × {item.repsMin}–{item.repsMax} reps
              {'  ·  '}
              {EQUIPMENT_LABELS[item.equipment]}
            </Text>
          </View>
          <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
            {isSelected && <CheckIcon size={13} color={Colors.white} />}
          </View>
        </TouchableOpacity>
      );
    },
    [selected, toggle],
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ChevronRightIcon size={20} color={Colors.white} />
        </TouchableOpacity>
        <View style={styles.headerTitle}>
          <Text style={styles.title}>Add Exercise</Text>
          <Text style={styles.subtitle}>
            {selected.size > 0 ? `${selected.size} selected` : 'Tap to select'}
          </Text>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchWrap}>
        <SearchIcon size={18} color={Colors.textSecondary} />
        <TextInput
          style={styles.input}
          placeholder="Search exercises…"
          placeholderTextColor={Colors.textTertiary}
          value={query}
          onChangeText={setQuery}
          autoCapitalize="none"
          returnKeyType="search"
        />
      </View>

      {/* Muscle group chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipsContent}
        style={styles.chipsScroll}
      >
        {GROUPS.map((g) => (
          <TouchableOpacity
            key={g.key}
            style={[styles.chip, activeGroup === g.key && styles.chipActive]}
            onPress={() => setActiveGroup(g.key)}
            activeOpacity={0.8}
          >
            <Text style={[styles.chipText, activeGroup === g.key && styles.chipTextActive]}>
              {g.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Exercise list */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <Text style={styles.empty}>No exercises found</Text>
        }
      />

      {/* Sticky add button */}
      {selected.size > 0 && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.addBtn, adding && styles.addBtnDisabled]}
            activeOpacity={0.85}
            onPress={handleAdd}
            disabled={adding}
          >
            {adding ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <>
                <PlusIcon size={18} color={Colors.white} />
                <Text style={styles.addBtnText}>
                  Add {selected.size} exercise{selected.size > 1 ? 's' : ''}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: Colors.background },
  // Header
  header:  { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.screenHorizontalApp, paddingVertical: 14, gap: 14 },
  backBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: Colors.surface, alignItems: 'center', justifyContent: 'center', transform: [{ rotate: '180deg' }] },
  headerTitle: { flex: 1 },
  title:   { fontFamily: Fonts.body, fontSize: 18, fontWeight: '700', color: Colors.white },
  subtitle:{ fontFamily: Fonts.body, fontSize: FontSizes.label, color: Colors.textSecondary, marginTop: 1 },
  // Search
  searchWrap: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: Colors.surface, marginHorizontal: Spacing.screenHorizontalApp, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12, marginBottom: 14 },
  input:      { flex: 1, fontFamily: Fonts.body, fontSize: 15, color: Colors.white },
  // Group chips — fixed height prevents layout shift when active state changes
  chipsScroll:   { marginBottom: 14 },
  chipsContent:  { paddingHorizontal: Spacing.screenHorizontalApp, gap: 8, alignItems: 'center' },
  chip:          { height: 36, paddingHorizontal: 16, borderRadius: 99, backgroundColor: Colors.surface, borderWidth: 1.5, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  chipActive:    { backgroundColor: Colors.pink, borderColor: Colors.pink },
  chipText:      { fontFamily: Fonts.body, fontSize: FontSizes.label, fontWeight: '600', color: Colors.textSecondary, lineHeight: 18 },
  chipTextActive:{ color: Colors.white },
  // List
  list:      { paddingHorizontal: Spacing.screenHorizontalApp, paddingBottom: 20 },
  row:       { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, gap: 14 },
  rowSelected: { opacity: 0.9 },
  rowInfo:   { flex: 1, gap: 4 },
  rowTop:    { flexDirection: 'row', alignItems: 'center', gap: 8 },
  rowName:   { fontFamily: Fonts.body, fontSize: 15, fontWeight: '600', color: Colors.white, flex: 1 },
  diffDot:   { width: 8, height: 8, borderRadius: 4 },
  rowMeta:   { fontFamily: Fonts.body, fontSize: 11, color: Colors.textTertiary },
  checkbox:  { width: 28, height: 28, borderRadius: 8, borderWidth: 1.5, borderColor: Colors.border, backgroundColor: Colors.surface, alignItems: 'center', justifyContent: 'center' },
  checkboxSelected: { backgroundColor: Colors.pink, borderColor: Colors.pink },
  separator: { height: 1, backgroundColor: Colors.border },
  empty:     { fontFamily: Fonts.body, fontSize: FontSizes.body, color: Colors.textSecondary, textAlign: 'center', marginTop: 60 },
  // Footer
  footer:    { paddingHorizontal: Spacing.screenHorizontalApp, paddingVertical: 16, borderTopWidth: 1, borderTopColor: Colors.border, backgroundColor: Colors.background },
  addBtn:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: Colors.pink, borderRadius: 14, paddingVertical: 16 },
  addBtnDisabled: { opacity: 0.5 },
  addBtnText:{ fontFamily: Fonts.body, fontSize: 16, fontWeight: '700', color: Colors.white },
});
