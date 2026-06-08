import { useState, useEffect } from 'react';
import { dailyLogService } from '../services/dailyLogService';

export interface DayActivity {
  date: string;
  dayLabel: string;    // 'M', 'T', 'W', etc.
  barHeight: number;   // 0–100
  isCompleted: boolean;
  isToday: boolean;
}

const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']; // Sun=0 … Sat=6

function getLast7Dates(): string[] {
  const dates: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().split('T')[0]);
  }
  return dates;
}

export function useWeeklyActivity(uid: string | null): {
  days: DayActivity[];
  completedCount: number;
  loading: boolean;
} {
  const [days, setDays]       = useState<DayActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) { setDays([]); setLoading(false); return; }

    const dates = getLast7Dates();
    const today = new Date().toISOString().split('T')[0];

    dailyLogService.getMany(uid, dates).then((logs) => {
      setDays(
        logs.map((log, i) => {
          const date    = dates[i];
          const jsDay   = new Date(date + 'T12:00:00').getDay(); // avoid TZ offset
          return {
            date,
            dayLabel:    DAY_LABELS[jsDay],
            barHeight:   log.workoutCompleted ? 100 : 18,
            isCompleted: log.workoutCompleted,
            isToday:     date === today,
          };
        }),
      );
      setLoading(false);
    });
  }, [uid]);

  const completedCount = days.filter((d) => d.isCompleted).length;
  return { days, completedCount, loading };
}
