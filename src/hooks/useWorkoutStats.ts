import { useState, useEffect } from 'react';
import { progressService } from '../services/progressService';

interface WorkoutStats {
  totalWorkouts: number;
  currentStreak: number;
  estimatedKcalBurned: number;
  loading: boolean;
}

export function useWorkoutStats(uid: string | null): WorkoutStats {
  const [stats, setStats] = useState<WorkoutStats>({
    totalWorkouts: 0, currentStreak: 0, estimatedKcalBurned: 0, loading: true,
  });

  useEffect(() => {
    if (!uid) { setStats((s) => ({ ...s, loading: false })); return; }
    progressService.getWorkoutStats(uid).then((data) =>
      setStats({ ...data, loading: false }),
    );
  }, [uid]);

  return stats;
}
