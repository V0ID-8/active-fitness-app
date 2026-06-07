import {
  doc, setDoc, getDoc, updateDoc,
  onSnapshot, serverTimestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { UserProfile } from '../types';

type ProfileInput = Omit<UserProfile, 'createdAt' | 'updatedAt'>;

export const userService = {
  async createUserProfile(uid: string, data: Omit<ProfileInput, 'uid'>): Promise<void> {
    await setDoc(doc(db, 'users', uid), {
      ...data,
      uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  },

  async getUserProfile(uid: string): Promise<UserProfile | null> {
    const snap = await getDoc(doc(db, 'users', uid));
    return snap.exists() ? (snap.data() as UserProfile) : null;
  },

  async updateUserProfile(uid: string, data: Partial<ProfileInput>): Promise<void> {
    await updateDoc(doc(db, 'users', uid), {
      ...data,
      updatedAt: serverTimestamp(),
    });
  },

  // Real-time listener — returns an unsubscribe function
  subscribeToProfile(
    uid: string,
    onData: (profile: UserProfile | null) => void,
    onError?: (error: Error) => void,
  ): () => void {
    return onSnapshot(
      doc(db, 'users', uid),
      (snap) => onData(snap.exists() ? (snap.data() as UserProfile) : null),
      (err) => onError?.(err),
    );
  },
};
