import {
  collection, getDocs, writeBatch, doc, limit, query,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { exercises } from '../data/exercises';
import { getTodaysPlan, DayPlan } from '../utils/workoutPlan';
import { Goal } from '../types';

export const exerciseService = {
  /**
   * Writes the local exercises array to Firestore once.
   * Checks if the collection is already populated before writing.
   */
  async seedExercises(): Promise<void> {
    const snap = await getDocs(query(collection(db, 'exercises'), limit(1)));
    if (!snap.empty) return; // already seeded

    const batch = writeBatch(db);
    exercises.forEach((exercise) => {
      batch.set(doc(db, 'exercises', exercise.id), exercise);
    });
    await batch.commit();
  },

  /**
   * Returns today's workout plan for the given goal.
   * Resolves from the local exercises array — no Firestore read needed.
   */
  getTodaysWorkout(goal: Goal): DayPlan {
    return getTodaysPlan(goal);
  },
};
