// =============================================================================
// migrateLocalStorage
//
// One-time migration path: if a user has data stored in the old localStorage-
// only persist keys (mecorp-game, mecorp-goals, mecorp-daily), upload it to
// Supabase, clear the keys, then hydrate the stores from the DB.
//
// Returns true if a migration was performed, false if there was nothing to
// migrate (allowing callers to decide whether to hydrate from Supabase instead).
// =============================================================================

import { supabase } from './supabase';
import { toDbGoal, toDbTask, toDbShift } from './supabase-types';
import type { Goal, PoolTask, ShiftRecord } from '../store/types';

/** Zustand persist wraps stored state as { state: ..., version: ... } */
interface PersistedSlice<T> {
  state: T;
  version?: number;
}

interface StoredGameState {
  xp?: number;
  xpToNextLevel?: number;
  gold?: number;
  level?: number;
  streak?: number;
  lastShiftDate?: string | null;
}

interface StoredGoalsState {
  goals?: Goal[];
}

interface StoredDailyState {
  shiftHistory?: ShiftRecord[];
}

export async function migrateLocalStorage(userId: string): Promise<boolean> {
  const gameRaw = localStorage.getItem('mecorp-game');
  const goalsRaw = localStorage.getItem('mecorp-goals');
  const dailyRaw = localStorage.getItem('mecorp-daily');

  // Nothing to migrate — signal caller to hydrate normally.
  if (!gameRaw && !goalsRaw && !dailyRaw) return false;

  try {
    const gameData: StoredGameState | null = gameRaw
      ? (JSON.parse(gameRaw) as PersistedSlice<StoredGameState>).state
      : null;

    const goalsData: StoredGoalsState | null = goalsRaw
      ? (JSON.parse(goalsRaw) as PersistedSlice<StoredGoalsState>).state
      : null;

    const dailyData: StoredDailyState | null = dailyRaw
      ? (JSON.parse(dailyRaw) as PersistedSlice<StoredDailyState>).state
      : null;

    // -------------------------------------------------------------------------
    // 1. Player state
    // -------------------------------------------------------------------------
    if (gameData) {
      await supabase.from('player_state').upsert({
        user_id: userId,
        xp: gameData.xp ?? 0,
        xp_to_next_level: gameData.xpToNextLevel ?? 100,
        gold: gameData.gold ?? 0,
        level: gameData.level ?? 1,
        streak: gameData.streak ?? 0,
        last_shift_date: gameData.lastShiftDate ?? null,
        current_streak_start: null,
        shift_active: false,
        updated_at: Date.now(),
      });
    }

    // -------------------------------------------------------------------------
    // 2. Goals and tasks
    // -------------------------------------------------------------------------
    if (goalsData?.goals && goalsData.goals.length > 0) {
      for (const goal of goalsData.goals) {
        const dbGoal = toDbGoal(goal, userId);
        await supabase.from('goals').upsert(dbGoal);

        if (goal.tasks && goal.tasks.length > 0) {
          const dbTasks = goal.tasks.map((t: PoolTask) => toDbTask(t, userId));
          await supabase.from('tasks').upsert(dbTasks);
        }
      }
    }

    // -------------------------------------------------------------------------
    // 3. Shift history
    // -------------------------------------------------------------------------
    if (dailyData?.shiftHistory && dailyData.shiftHistory.length > 0) {
      const dbShifts = dailyData.shiftHistory.map((s: ShiftRecord) => ({
        ...toDbShift(s, userId),
        id: crypto.randomUUID(),
      }));

      await supabase.from('shifts').insert(dbShifts);
    }

    // -------------------------------------------------------------------------
    // 4. Clean up old localStorage keys
    // -------------------------------------------------------------------------
    localStorage.removeItem('mecorp-game');
    localStorage.removeItem('mecorp-goals');
    localStorage.removeItem('mecorp-daily');

    // -------------------------------------------------------------------------
    // 5. Hydrate stores from the freshly-populated DB
    // -------------------------------------------------------------------------
    const { hydrateFromSupabase } = await import('./hydrate');
    await hydrateFromSupabase(userId);

    return true;
  } catch (err) {
    console.error('[migrate-local] Migration failed:', err);
    return false;
  }
}
