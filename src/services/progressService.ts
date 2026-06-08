import {
  collection, addDoc, getDocs, query,
  orderBy, limit, Timestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { WeightEntry } from '../types';

const weightCol   = (uid: string) => collection(db, 'users', uid, 'weightLog');
const sessionsCol = (uid: string) => collection(db, 'users', uid, 'workoutSessions');
const logsCol     = (uid: string) => collection(db, 'users', uid, 'dailyLogs');

export const progressService = {
  async addWeightEntry(uid: string, weightKg: number): Promise<void> {
    const date = new Date().toISOString().split('T')[0];
    await addDoc(weightCol(uid), { date, weightKg, createdAt: Timestamp.now() });
  },

  async getWeightHistory(uid: string, limitN = 10): Promise<WeightEntry[]> {
    const snap = await getDocs(
      query(weightCol(uid), orderBy('date', 'asc'), limit(limitN)),
    );
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as WeightEntry));
  },

  async getWorkoutStats(uid: string): Promise<{
    totalWorkouts: number;
    currentStreak: number;
    estimatedKcalBurned: number;
  }> {
    // Total completed sessions
    const sessSnap = await getDocs(query(sessionsCol(uid)));
    const totalWorkouts = sessSnap.docs.filter((d) => d.data().completed).length;

    // Last 30 daily logs for streak
    const logsSnap = await getDocs(
      query(logsCol(uid), orderBy('date', 'desc'), limit(30)),
    );
    const completedDates = new Set(
      logsSnap.docs
        .filter((d) => d.data().workoutCompleted)
        .map((d) => d.data().date as string),
    );

    // Count consecutive days backward from today (or yesterday)
    const today = new Date().toISOString().split('T')[0];
    const prevDay = (dateStr: string) => {
      const d = new Date(dateStr + 'T12:00:00');
      d.setDate(d.getDate() - 1);
      return d.toISOString().split('T')[0];
    };

    let cursor  = completedDates.has(today) ? today : prevDay(today);
    let streak  = 0;
    while (completedDates.has(cursor)) {
      streak++;
      cursor = prevDay(cursor);
    }

    return {
      totalWorkouts,
      currentStreak:       streak,
      estimatedKcalBurned: totalWorkouts * 320,
    };
  },
};
