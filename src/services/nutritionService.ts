import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { DailyLog, FoodItem, MealEntry, MealType } from '../types';
import { emptyLog } from './dailyLogService';

const logRef = (uid: string, date: string) =>
  doc(db, 'users', uid, 'dailyLogs', date);

function sumCalories(log: DailyLog): number {
  return Object.values(log.meals).flat().reduce((s, e) => s + e.kcal, 0);
}

export const nutritionService = {
  async addMealEntry(
    uid: string,
    date: string,
    mealType: MealType,
    food: FoodItem,
    multiplier: number = 1,
  ): Promise<void> {
    const ref  = logRef(uid, date);
    const snap = await getDoc(ref);
    const log: DailyLog = snap.exists() ? (snap.data() as DailyLog) : emptyLog(date);

    const entry: MealEntry = {
      id:          `${food.id}-${Date.now()}`,
      name:        food.name,
      servingSize: food.servingSize * multiplier,
      servingUnit: food.servingUnit,
      kcal:        Math.round(food.kcal      * multiplier),
      proteinG:    Math.round(food.proteinG  * multiplier * 10) / 10,
      carbG:       Math.round(food.carbG     * multiplier * 10) / 10,
      fatG:        Math.round(food.fatG      * multiplier * 10) / 10,
      loggedAt:    Timestamp.now(),
    };

    const updated: DailyLog = {
      ...log,
      meals: { ...log.meals, [mealType]: [...log.meals[mealType], entry] },
    };
    updated.caloriesEaten = sumCalories(updated);

    await setDoc(ref, updated);
  },

  async removeMealEntry(
    uid: string,
    date: string,
    mealType: MealType,
    entryId: string,
  ): Promise<void> {
    const ref  = logRef(uid, date);
    const snap = await getDoc(ref);
    if (!snap.exists()) return;

    const log = snap.data() as DailyLog;
    const updated: DailyLog = {
      ...log,
      meals: {
        ...log.meals,
        [mealType]: log.meals[mealType].filter((e) => e.id !== entryId),
      },
    };
    updated.caloriesEaten = sumCalories(updated);

    await setDoc(ref, updated);
  },
};
