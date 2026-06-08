import { useState, useEffect, useCallback } from 'react';
import { WeightEntry } from '../types';
import { progressService } from '../services/progressService';

export function useWeightLog(uid: string | null): {
  entries: WeightEntry[];
  loading: boolean;
  reload: () => void;
} {
  const [entries, setEntries] = useState<WeightEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [tick,    setTick]    = useState(0);

  useEffect(() => {
    if (!uid) { setEntries([]); setLoading(false); return; }
    setLoading(true);
    progressService.getWeightHistory(uid).then((data) => {
      setEntries(data);
      setLoading(false);
    });
  }, [uid, tick]);

  const reload = useCallback(() => setTick((t) => t + 1), []);
  return { entries, loading, reload };
}
