import { useState, useEffect } from 'react';
import { DailyLog } from '../types';
import { dailyLogService, emptyLog } from '../services/dailyLogService';

interface DailyLogState {
  log: DailyLog;
  loading: boolean;
}

export function useDailyLog(uid: string | null, date: string): DailyLogState {
  const [state, setState] = useState<DailyLogState>({
    log: emptyLog(date),
    loading: true,
  });

  useEffect(() => {
    if (!uid) {
      setState({ log: emptyLog(date), loading: false });
      return;
    }

    setState((s) => ({ ...s, loading: true }));

    const unsubscribe = dailyLogService.subscribe(
      uid,
      date,
      (log) => setState({ log, loading: false }),
      ()    => setState({ log: emptyLog(date), loading: false }),
    );

    return unsubscribe;
  }, [uid, date]);

  return state;
}
