import {
  collection, addDoc, getDocs, doc, updateDoc,
  query, where, orderBy, limit, serverTimestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { WorkoutSession } from '../types';

const sessionsCol = (uid: string) =>
  collection(db, 'users', uid, 'workoutSessions');

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
    // Read the session, update the specific exercise, write back
    const sessionsSnapshot = await getDocs(
      query(sessionsCol(uid), where('__name__', '==', sessionId), limit(1)),
    );
    if (sessionsSnapshot.empty) return;

    const sessionDoc = sessionsSnapshot.docs[0];
    const data = sessionDoc.data() as WorkoutSession;
    const updated = data.exercises.map((ex, i) =>
      i === exerciseIndex ? { ...ex, completed } : ex,
    );

    await updateDoc(doc(db, 'users', uid, 'workoutSessions', sessionId), {
      exercises: updated,
    });
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
