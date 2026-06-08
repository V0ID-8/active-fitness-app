import { useState, useMemo, useCallback } from 'react';
import {
  StyleSheet, View, Text, TextInput, FlatList,
  TouchableOpacity, ActivityIndicator, ListRenderItem,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Colors, Fonts, FontSizes, Spacing } from '../../constants';
import { ChevronRightIcon, SearchIcon } from '../../components/Icon';
import { FOODS } from '../../data/foods';
import { nutritionService } from '../../services/nutritionService';
import { useAuth } from '../../hooks/useAuth';
import { FoodItem, MealType } from '../../types';
import { MainStackParamList } from '../../navigation/MainStackNavigator';

type RouteType = RouteProp<MainStackParamList, 'FoodSearch'>;

const MEAL_LABELS: Record<MealType, string> = {
  breakfast: 'Breakfast',
  lunch:     'Lunch',
  dinner:    'Dinner',
  snacks:    'Snacks',
};

export default function FoodSearchScreen() {
  const navigation          = useNavigation<any>();
  const { params }          = useRoute<RouteType>();
  const { mealType, date }  = params;
  const { user }            = useAuth();

  const [query,   setQuery]   = useState('');
  const [adding,  setAdding]  = useState<string | null>(null); // food id being added

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q.length === 0 ? FOODS : FOODS.filter((f) => f.name.toLowerCase().includes(q));
  }, [query]);

  const handleAdd = useCallback(
    async (food: FoodItem) => {
      if (!user || adding) return;
      setAdding(food.id);
      try {
        await nutritionService.addMealEntry(user.uid, date, mealType, food);
        navigation.goBack();
      } finally {
        setAdding(null);
      }
    },
    [user, date, mealType, adding, navigation],
  );

  const renderItem: ListRenderItem<FoodItem> = useCallback(
    ({ item }) => {
      const isAdding = adding === item.id;
      return (
        <TouchableOpacity
          style={styles.row}
          activeOpacity={0.75}
          onPress={() => handleAdd(item)}
          disabled={!!adding}
        >
          <View style={styles.rowInfo}>
            <Text style={styles.rowName} numberOfLines={1}>{item.name}</Text>
            <Text style={styles.rowServing}>
              {item.servingSize} {item.servingUnit} · P: {item.proteinG}g  C: {item.carbG}g  F: {item.fatG}g
            </Text>
          </View>
          <View style={styles.rowRight}>
            {isAdding ? (
              <ActivityIndicator size="small" color={Colors.pink} />
            ) : (
              <>
                <Text style={styles.rowKcal}>{item.kcal}</Text>
                <Text style={styles.rowKcalUnit}>kcal</Text>
              </>
            )}
          </View>
        </TouchableOpacity>
      );
    },
    [adding, handleAdd],
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ChevronRightIcon size={20} color={Colors.white} />
        </TouchableOpacity>
        <View style={styles.headerTitle}>
          <Text style={styles.title}>Add Food</Text>
          <Text style={styles.subtitle}>{MEAL_LABELS[mealType]}</Text>
        </View>
      </View>

      {/* Search bar */}
      <View style={styles.searchWrap}>
        <SearchIcon size={18} color={Colors.textSecondary} />
        <TextInput
          style={styles.input}
          placeholder="Search foods…"
          placeholderTextColor={Colors.textTertiary}
          value={query}
          onChangeText={setQuery}
          autoFocus
          autoCapitalize="none"
          returnKeyType="search"
        />
      </View>

      {/* Results */}
      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <Text style={styles.empty}>No foods found for "{query}"</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:       { flex: 1, backgroundColor: Colors.background },
  // Header
  header:     { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.screenHorizontalApp, paddingVertical: 14, gap: 14 },
  backBtn:    { width: 36, height: 36, borderRadius: 10, backgroundColor: Colors.surface, alignItems: 'center', justifyContent: 'center', transform: [{ rotate: '180deg' }] },
  headerTitle: { flex: 1 },
  title:      { fontFamily: Fonts.body, fontSize: 18, fontWeight: '700', color: Colors.white },
  subtitle:   { fontFamily: Fonts.body, fontSize: FontSizes.label, color: Colors.textSecondary, marginTop: 1 },
  // Search
  searchWrap: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: Colors.surface, marginHorizontal: Spacing.screenHorizontalApp, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12, marginBottom: 16 },
  input:      { flex: 1, fontFamily: Fonts.body, fontSize: 15, color: Colors.white },
  // List
  list:       { paddingHorizontal: Spacing.screenHorizontalApp, paddingBottom: 40 },
  row:        { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, gap: 12 },
  rowInfo:    { flex: 1 },
  rowName:    { fontFamily: Fonts.body, fontSize: 15, fontWeight: '600', color: Colors.white, marginBottom: 3 },
  rowServing: { fontFamily: Fonts.body, fontSize: 11, color: Colors.textTertiary },
  rowRight:   { alignItems: 'flex-end', minWidth: 46 },
  rowKcal:    { fontFamily: Fonts.display, fontSize: 18, color: Colors.white },
  rowKcalUnit:{ fontFamily: Fonts.body, fontSize: 11, color: Colors.textSecondary },
  separator:  { height: 1, backgroundColor: Colors.border },
  empty:      { fontFamily: Fonts.body, fontSize: FontSizes.body, color: Colors.textSecondary, textAlign: 'center', marginTop: 60 },
});
