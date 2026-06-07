import { Timestamp } from 'firebase/firestore';

// ─── Auth ────────────────────────────────────────────────────────────────────

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
}

// ─── Onboarding / User Profile ───────────────────────────────────────────────

export type Gender = 'male' | 'female';
export type Goal = 'lose' | 'gain' | 'fit';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  gender: Gender;
  age: number;
  heightCm: number;
  weightKg: number;
  goal: Goal;
  activityLevel: ActivityLevel;
  // Calculated at account creation
  bmr: number;
  tdee: number;
  calorieGoal: number;
  proteinGoalG: number;
  carbGoalG: number;
  fatGoalG: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ─── Daily Log ───────────────────────────────────────────────────────────────

export interface MealEntry {
  id: string;
  name: string;
  servingSize: number;
  servingUnit: string;
  kcal: number;
  proteinG: number;
  carbG: number;
  fatG: number;
  loggedAt: Timestamp;
}

export interface DailyLog {
  date: string;
  caloriesEaten: number;
  waterCups: number;
  meals: {
    breakfast: MealEntry[];
    lunch: MealEntry[];
    dinner: MealEntry[];
    snacks: MealEntry[];
  };
  workoutCompleted: boolean;
  workoutSessionId: string | null;
}

// ─── Workout ─────────────────────────────────────────────────────────────────

export interface ExerciseEntry {
  name: string;
  sets: number;
  reps: number;
  weightKg: number | null;
  completed: boolean;
}

export interface WorkoutSession {
  id?: string;
  date: string;
  programName: string;
  exercises: ExerciseEntry[];
  durationMinutes: number;
  completed: boolean;
  createdAt: Timestamp;
}

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: 'chest' | 'back' | 'shoulders' | 'arms' | 'legs' | 'core' | 'cardio';
  equipment: 'bodyweight' | 'dumbbell' | 'barbell' | 'machine' | 'none';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  sets: number;
  repsMin: number;
  repsMax: number;
  restSeconds: number;
  instructions: string;
}

// ─── Weight Log ──────────────────────────────────────────────────────────────

export interface WeightEntry {
  id?: string;
  date: string;
  weightKg: number;
  createdAt: Timestamp;
}

// ─── Food / Nutrition ────────────────────────────────────────────────────────

export interface FoodItem {
  id: string;
  name: string;
  servingSize: number;
  servingUnit: string;
  kcal: number;
  proteinG: number;
  carbG: number;
  fatG: number;
}

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snacks';
