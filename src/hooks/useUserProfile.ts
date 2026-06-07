import { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { userService } from '../services/userService';

interface ProfileState {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
}

export function useUserProfile(uid: string | null): ProfileState {
  const [state, setState] = useState<ProfileState>({
    profile: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!uid) {
      setState({ profile: null, loading: false, error: null });
      return;
    }

    setState((s) => ({ ...s, loading: true }));

    const unsubscribe = userService.subscribeToProfile(
      uid,
      (profile) => setState({ profile, loading: false, error: null }),
      (err)     => setState({ profile: null, loading: false, error: err.message }),
    );

    return unsubscribe;
  }, [uid]);

  return state;
}
