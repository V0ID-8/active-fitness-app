import {
  doc, getDoc, setDoc, updateDoc, onSnapshot,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { DailyLog } from '../types';

const logRef = (uid: string, date: string) =>
  doc(db, 'users', uid, 'dailyLogs', date);

export function emptyLog(date: string): DailyLog {
  return {
    date,
    caloriesEaten: 0,
    waterCups: 0,
    meals: { breakfast: [], lunch: [], dinner: [], snacks: [] },
    workoutCompleted: false,
    workoutSessionId: null,
  };
}

export const dailyLogService = {
  // Real-time listener for a single day
  subscribe(
    uid: string,
    date: string,
    onData: (log: DailyLog) => void,
    onError?: (e: Error) => void,
  ): () => void {
    return onSnapshot(
      logRef(uid, date),
      (snap) => onData(snap.exists() ? (snap.data() as DailyLog) : emptyLog(date)),
      (err)  => onError?.(err),
    );
  },

  // One-time fetch for multiple days (used by weekly activity chart)
  async getMany(uid: string, dates: string[]): Promise<DailyLog[]> {
    const snaps = await Promise.all(dates.map((d) => getDoc(logRef(uid, d))));
    return snaps.map((snap, i) =>
      snap.exists() ? (snap.data() as DailyLog) : emptyLog(dates[i]),
    );
  },

  async updateWaterCups(uid: string, date: string, cups: number): Promise<void> {
    const ref = logRef(uid, date);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      await updateDoc(ref, { waterCups: cups });
    } else {
      await setDoc(ref, { ...emptyLog(date), waterCups: cups });
    }
  },

  async markWorkoutComplete(uid: string, date: string, sessionId: string): Promise<void> {
    const ref = logRef(uid, date);
    const snap = await getDoc(ref);
    const update = { workoutCompleted: true, workoutSessionId: sessionId };
    if (snap.exists()) {
      await updateDoc(ref, update);
    } else {
      await setDoc(ref, { ...emptyLog(date), ...update });
    }
  },
};
