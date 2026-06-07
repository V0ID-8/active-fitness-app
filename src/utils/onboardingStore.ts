import { Gender, Goal, ActivityLevel } from '../types';

// Lightweight in-memory store that accumulates onboarding answers across screens.
// Written screen-by-screen; read in DoneScreen to create the Firestore profile.
// Cleared on app restart — never persisted to disk.
export const onboardingStore: {
  email: string;
  password: string;
  displayName: string;
  gender: Gender;
  age: number;
  heightCm: number;
  weightKg: number;
  goal: Goal;
  activityLevel: ActivityLevel;
} = {
  email: '',
  password: '',
  displayName: '',
  gender: 'male',
  age: 24,
  heightCm: 170,
  weightKg: 72,
  goal: 'gain',
  activityLevel: 'moderate',
};
