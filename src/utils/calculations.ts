import { Gender, Goal, ActivityLevel } from '../types';

// ─── BMR — Mifflin-St Jeor Equation ─────────────────────────────────────────
// Source: Mifflin MD, et al. Am J Clin Nutr. 1990;51(2):241-247
// Male:   BMR = (10 × weightKg) + (6.25 × heightCm) − (5 × age) + 5
// Female: BMR = (10 × weightKg) + (6.25 × heightCm) − (5 × age) − 161
export function calculateBMR(
  gender: Gender,
  weightKg: number,
  heightCm: number,
  age: number,
): number {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return Math.round(gender === 'male' ? base + 5 : base - 161);
}

// ─── TDEE — Total Daily Energy Expenditure ───────────────────────────────────
// Multiply BMR by an activity factor that accounts for daily movement.
// Multipliers from the Harris-Benedict activity scale.
const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,    // desk job, little or no exercise
  light:     1.375,  // light exercise 1–3 days/week
  moderate:  1.55,   // moderate exercise 3–5 days/week (default)
  active:    1.725,  // hard exercise 6–7 days/week
};

export function calculateTDEE(bmr: number, activityLevel: ActivityLevel): number {
  return Math.round(bmr * ACTIVITY_MULTIPLIERS[activityLevel]);
}

// ─── Goal-adjusted calorie target ────────────────────────────────────────────
// lose:  TDEE − 500 kcal  → ~0.5 kg/week deficit (safe, sustainable)
// gain:  TDEE + 300 kcal  → lean-bulk surplus (minimises fat gain)
// fit:   TDEE             → maintenance
const GOAL_ADJUSTMENTS: Record<Goal, number> = {
  lose:  -500,
  gain:  +300,
  fit:     0,
};

// ─── Macro split (protein-first approach) ────────────────────────────────────
// Protein targets prioritise muscle retention / growth:
//   lose: 2.2 g/kg  |  gain: 2.0 g/kg  |  fit: 1.8 g/kg
// Fat covers 25 % of calorie goal at 9 kcal/g.
// Carbs fill the remaining calories at 4 kcal/g.
const PROTEIN_RATIOS: Record<Goal, number> = {
  lose: 2.2,
  gain: 2.0,
  fit:  1.8,
};

export interface GoalTargets {
  calorieGoal:  number;
  proteinGoalG: number;
  carbGoalG:    number;
  fatGoalG:     number;
}

export function calculateGoals(
  tdee: number,
  goal: Goal,
  weightKg: number,
): GoalTargets {
  const calorieGoal  = Math.round(tdee + GOAL_ADJUSTMENTS[goal]);
  const proteinGoalG = Math.round(weightKg * PROTEIN_RATIOS[goal]);
  const fatGoalG     = Math.round((calorieGoal * 0.25) / 9);
  const remaining    = calorieGoal - proteinGoalG * 4 - fatGoalG * 9;
  const carbGoalG    = Math.max(0, Math.round(remaining / 4));

  return { calorieGoal, proteinGoalG, carbGoalG, fatGoalG };
}

// ─── Convenience: run the full calculation chain ─────────────────────────────
export function calculateFullProfile(
  gender: Gender,
  weightKg: number,
  heightCm: number,
  age: number,
  activityLevel: ActivityLevel,
  goal: Goal,
): { bmr: number; tdee: number } & GoalTargets {
  const bmr  = calculateBMR(gender, weightKg, heightCm, age);
  const tdee = calculateTDEE(bmr, activityLevel);
  return { bmr, tdee, ...calculateGoals(tdee, goal, weightKg) };
}
