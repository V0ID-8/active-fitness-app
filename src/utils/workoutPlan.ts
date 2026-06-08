import { Exercise, Goal, UserProfile } from '../types';
import { exercises } from '../data/exercises';

export interface DayPlan {
  dayIndex: number;       // 0 = Monday … 6 = Sunday
  dayName: string;
  workoutType: string;
  programName: string;
  exercises: Exercise[];
  estimatedMinutes: number;
  isRestDay: boolean;
}

// ─── Helper ──────────────────────────────────────────────────────────────────

function pick(ids: string[]): Exercise[] {
  return ids
    .map((id) => exercises.find((e) => e.id === id))
    .filter((e): e is Exercise => e !== undefined);
}

const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// ─── Plan templates ──────────────────────────────────────────────────────────

const REST_DAY: Omit<DayPlan, 'dayIndex' | 'dayName'> = {
  workoutType: 'Rest',
  programName: 'Rest Day',
  exercises: [],
  estimatedMinutes: 0,
  isRestDay: true,
};

const PLANS: Record<Goal, Omit<DayPlan, 'dayIndex' | 'dayName'>[]> = {

  // ── Lose Weight: Cardio + Strength ──────────────────────────────────────────
  lose: [
    {
      workoutType: 'Strength',
      programName: 'Full Body Strength',
      exercises: pick(['barbell-squat', 'barbell-bench-press', 'barbell-row', 'barbell-overhead-press', 'romanian-deadlift', 'plank']),
      estimatedMinutes: 50,
      isRestDay: false,
    },
    {
      workoutType: 'HIIT',
      programName: 'HIIT Cardio',
      exercises: pick(['burpees', 'high-knees', 'jump-squat', 'mountain-climbers', 'jumping-jacks', 'box-jump']),
      estimatedMinutes: 30,
      isRestDay: false,
    },
    {
      workoutType: 'Strength',
      programName: 'Upper Body',
      exercises: pick(['dumbbell-bench-press', 'dumbbell-row', 'dumbbell-shoulder-press', 'barbell-curl', 'tricep-pushdown', 'lateral-raise']),
      estimatedMinutes: 45,
      isRestDay: false,
    },
    { ...REST_DAY },
    {
      workoutType: 'Strength',
      programName: 'Lower Body + Core',
      exercises: pick(['leg-press', 'dumbbell-lunge', 'leg-curl', 'calf-raise', 'russian-twist', 'leg-raise', 'plank']),
      estimatedMinutes: 50,
      isRestDay: false,
    },
    {
      workoutType: 'Cardio',
      programName: 'Steady State Cardio',
      exercises: pick(['jumping-jacks', 'high-knees', 'jump-rope', 'jumping-lunge']),
      estimatedMinutes: 35,
      isRestDay: false,
    },
    { ...REST_DAY },
  ],

  // ── Gain Muscle: Push / Pull / Legs ─────────────────────────────────────────
  gain: [
    {
      workoutType: 'Push',
      programName: 'Push Day',
      exercises: pick(['barbell-bench-press', 'incline-dumbbell-press', 'barbell-overhead-press', 'lateral-raise', 'skull-crusher', 'tricep-pushdown']),
      estimatedMinutes: 55,
      isRestDay: false,
    },
    {
      workoutType: 'Pull',
      programName: 'Pull Day',
      exercises: pick(['pull-up', 'barbell-row', 'lat-pulldown', 'seated-cable-row', 'barbell-curl', 'hammer-curl']),
      estimatedMinutes: 55,
      isRestDay: false,
    },
    {
      workoutType: 'Legs',
      programName: 'Leg Day',
      exercises: pick(['barbell-squat', 'romanian-deadlift', 'leg-press', 'leg-curl', 'calf-raise', 'hip-thrust']),
      estimatedMinutes: 60,
      isRestDay: false,
    },
    { ...REST_DAY },
    {
      workoutType: 'Push',
      programName: 'Push Day (Variation)',
      exercises: pick(['dumbbell-bench-press', 'incline-barbell-press', 'arnold-press', 'cable-chest-fly', 'overhead-tricep-extension', 'close-grip-bench-press']),
      estimatedMinutes: 55,
      isRestDay: false,
    },
    {
      workoutType: 'Pull',
      programName: 'Pull + Arms',
      exercises: pick(['deadlift', 'dumbbell-row', 'face-pull', 'concentration-curl', 'preacher-curl', 'rear-delt-fly']),
      estimatedMinutes: 55,
      isRestDay: false,
    },
    { ...REST_DAY },
  ],

  // ── Keep Fit: Upper / Lower ──────────────────────────────────────────────────
  fit: [
    {
      workoutType: 'Strength',
      programName: 'Upper Body',
      exercises: pick(['dumbbell-bench-press', 'dumbbell-row', 'dumbbell-shoulder-press', 'barbell-curl', 'tricep-pushdown']),
      estimatedMinutes: 40,
      isRestDay: false,
    },
    {
      workoutType: 'Strength',
      programName: 'Lower Body',
      exercises: pick(['goblet-squat', 'dumbbell-lunge', 'leg-curl', 'calf-raise', 'hip-thrust']),
      estimatedMinutes: 40,
      isRestDay: false,
    },
    {
      workoutType: 'Cardio',
      programName: 'Active Recovery',
      exercises: pick(['jumping-jacks', 'high-knees', 'jump-rope', 'mountain-climbers']),
      estimatedMinutes: 25,
      isRestDay: false,
    },
    {
      workoutType: 'Strength',
      programName: 'Full Body',
      exercises: pick(['barbell-squat', 'barbell-bench-press', 'pull-up', 'barbell-overhead-press', 'romanian-deadlift', 'plank']),
      estimatedMinutes: 50,
      isRestDay: false,
    },
    {
      workoutType: 'Cardio',
      programName: 'Cardio + Core',
      exercises: pick(['burpees', 'box-jump', 'russian-twist', 'leg-raise', 'ab-wheel', 'dead-bug']),
      estimatedMinutes: 35,
      isRestDay: false,
    },
    { ...REST_DAY },
    { ...REST_DAY },
  ],
};

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Returns the full 7-day plan for a user based on their goal.
 * dayIndex 0 = Monday, 6 = Sunday.
 */
export function generateWeeklyPlan(goal: Goal): DayPlan[] {
  return PLANS[goal].map((day, i) => ({
    ...day,
    dayIndex: i,
    dayName: DAY_NAMES[i],
  }));
}

/**
 * Returns the plan for today (based on the current day of the week).
 * JS getDay() is 0=Sun…6=Sat → convert to 0=Mon…6=Sun.
 */
export function getTodaysPlan(goal: Goal): DayPlan {
  const jsDay     = new Date().getDay();          // 0 Sun … 6 Sat
  const planIndex = (jsDay + 6) % 7;              // 0 Mon … 6 Sun
  return generateWeeklyPlan(goal)[planIndex];
}
