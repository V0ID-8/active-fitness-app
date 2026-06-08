import {
  collection, addDoc, getDocs, doc, getDoc, updateDoc,
  query, where, orderBy, limit, serverTimestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { WorkoutSession } from '../types';

const sessionsCol = (uid: string) =>
  collection(db, 'users', uid, 'workoutSessions');

const sessionDoc = (uid: string, sessionId: string) =>
  doc(db, 'users', uid, 'workoutSessions', sessionId);

export const workoutService = {
  async logWorkoutSession(
    uid: string,
    session: Omit<WorkoutSession, 'id' | 'createdAt'>,
  ): Promise<string> {
    const ref = await addDoc(sessionsCol(uid), {
      ...session,
      createdAt: serverTimestamp(),
    });
    return ref.id;
  },

  async getTodaysSession(uid: string, date: string): Promise<WorkoutSession | null> {
    const snap = await getDocs(
      query(sessionsCol(uid), where('date', '==', date), limit(1)),
    );
    if (snap.empty) return null;
    const d = snap.docs[0];
    return { id: d.id, ...(d.data() as Omit<WorkoutSession, 'id'>) };
  },

  async markExerciseComplete(
    uid: string,
    sessionId: string,
    exerciseIndex: number,
    completed: boolean,
  ): Promise<void> {
    const ref  = sessionDoc(uid, sessionId);
    const snap = await getDoc(ref);
    if (!snap.exists()) return;
    const data = snap.data() as WorkoutSession;
    const updated = data.exercises.map((ex, i) =>
      i === exerciseIndex ? { ...ex, completed } : ex,
    );
    await updateDoc(ref, { exercises: updated });
  },

  async markSessionComplete(uid: string, sessionId: string): Promise<void> {
    await updateDoc(sessionDoc(uid, sessionId), { completed: true });
  },

  async addExercisesToSession(
    uid: string,
    sessionId: string,
    newEntries: WorkoutSession['exercises'],
  ): Promise<void> {
    const ref  = sessionDoc(uid, sessionId);
    const snap = await getDoc(ref);
    if (!snap.exists()) return;
    const data = snap.data() as WorkoutSession;
    await updateDoc(ref, { exercises: [...data.exercises, ...newEntries] });
  },

  async getWorkoutHistory(uid: string, limitCount = 20): Promise<WorkoutSession[]> {
    const snap = await getDocs(
      query(sessionsCol(uid), orderBy('createdAt', 'desc'), limit(limitCount)),
    );
    return snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<WorkoutSession, 'id'>),
    }));
  },
};
