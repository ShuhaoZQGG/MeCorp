import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { hydrateFromSupabase } from '../lib/hydrate';
import { migrateLocalStorage } from '../lib/migrate-local';
import { setCurrentUserId } from '../lib/auth-context';
import type { User, Session } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
  migrating: boolean;

  initialize: () => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  session: null,
  loading: true,
  error: null,
  migrating: false,

  // ---------------------------------------------------------------------------
  // initialize
  // Called once on app mount to restore an existing session and wire up the
  // auth state change listener.
  // ---------------------------------------------------------------------------
  initialize: async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session?.user) {
      setCurrentUserId(session.user.id);
      set({ user: session.user, session, loading: false });

      const migrated = await migrateLocalStorage(session.user.id);
      if (!migrated) {
        await hydrateFromSupabase(session.user.id);
      }

      const { startSyncSubscriptions } = await import('./syncSubscriptions');
      startSyncSubscriptions(session.user.id);
    } else {
      set({ loading: false });
    }

    supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (event === 'SIGNED_OUT') {
        setCurrentUserId(null);
        set({ user: null, session: null });
      } else if (newSession?.user) {
        setCurrentUserId(newSession.user.id);
        set({ user: newSession.user, session: newSession });
      }
    });
  },

  // ---------------------------------------------------------------------------
  // signUp
  // ---------------------------------------------------------------------------
  signUp: async (email, password, displayName) => {
    set({ error: null, loading: true });

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { display_name: displayName } },
    });

    if (error) {
      set({ error: error.message, loading: false });
      return;
    }

    if (data.user) {
      setCurrentUserId(data.user.id);
      set({ user: data.user, session: data.session, loading: false });

      set({ migrating: true });
      const migrated = await migrateLocalStorage(data.user.id);
      set({ migrating: false });

      if (!migrated) {
        await hydrateFromSupabase(data.user.id);
      }

      const { startSyncSubscriptions } = await import('./syncSubscriptions');
      startSyncSubscriptions(data.user.id);
    }
  },

  // ---------------------------------------------------------------------------
  // signIn
  // ---------------------------------------------------------------------------
  signIn: async (email, password) => {
    set({ error: null, loading: true });

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      set({ error: error.message, loading: false });
      return;
    }

    if (data.user) {
      setCurrentUserId(data.user.id);
      set({ user: data.user, session: data.session });

      set({ migrating: true });
      const migrated = await migrateLocalStorage(data.user.id);
      set({ migrating: false });

      if (!migrated) {
        await hydrateFromSupabase(data.user.id);
      }

      set({ loading: false });

      const { startSyncSubscriptions } = await import('./syncSubscriptions');
      startSyncSubscriptions(data.user.id);
    }
  },

  // ---------------------------------------------------------------------------
  // signOut
  // ---------------------------------------------------------------------------
  signOut: async () => {
    await supabase.auth.signOut();
    setCurrentUserId(null);

    // Reset all stores to their initial state so stale data is not shown if
    // another user signs in during the same browser session.
    const { useGameStore } = await import('./gameStore');
    const { useGoalStore } = await import('./goalStore');
    const { useDailyStore } = await import('./dailyStore');

    useGameStore.setState({
      tasks: [],
      xp: 0,
      xpToNextLevel: 100,
      gold: 0,
      level: 1,
      shiftActive: false,
      streak: 0,
      lastShiftDate: null,
      currentScreen: 'office',
      todayXpEarned: 0,
      todayGoldEarned: 0,
      currentStreakStart: null,
    });

    useGoalStore.setState({ goals: [], taskPool: [] });

    useDailyStore.setState({
      currentDate: new Date().toLocaleDateString('en-CA'),
      assignments: [],
      managerMessage: '',
      shiftHistory: [],
      showManagerBriefing: false,
      showClockOutSummary: false,
      showProofDialog: null,
      clockInTime: null,
      isAssigning: false,
      assignError: null,
    });

    set({ user: null, session: null, loading: false, error: null });
  },
}));
