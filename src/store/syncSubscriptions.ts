// =============================================================================
// Sync subscriptions
//
// Watches the gameStore for changes to player-state fields and enqueues an
// upsert to the `player_state` Supabase table via the SyncManager.
//
// Call startSyncSubscriptions(userId) once the user is authenticated.
// It replaces any previously registered listener so it is safe to call again
// after a sign-out/sign-in cycle.
// =============================================================================

import { useGameStore } from './gameStore';
import { syncManager } from '../lib/sync';

/** Unsubscribe function returned by the previous subscription, if any. */
let cleanup: (() => void) | null = null;

/**
 * Registers a Zustand subscription on useGameStore that syncs player-state
 * changes to Supabase through the offline queue.
 *
 * The subscription is skipped whenever the `_skipSync` flag is set on the
 * store — this prevents hydration writes from bouncing back to the DB.
 */
export function startSyncSubscriptions(userId: string): void {
  // Tear down any listener from a previous session.
  if (cleanup) {
    cleanup();
    cleanup = null;
  }

  let prevState = useGameStore.getState();

  const unsub = useGameStore.subscribe((state) => {
    // Hydration in progress — do not sync.
    if (state._skipSync) return;

    const changed =
      state.xp !== prevState.xp ||
      state.xpToNextLevel !== prevState.xpToNextLevel ||
      state.gold !== prevState.gold ||
      state.level !== prevState.level ||
      state.streak !== prevState.streak ||
      state.lastShiftDate !== prevState.lastShiftDate ||
      state.shiftActive !== prevState.shiftActive ||
      state.currentStreakStart !== prevState.currentStreakStart ||
      state.reputation !== prevState.reputation;

    if (changed) {
      syncManager.enqueue({
        table: 'player_state',
        type: 'upsert',
        id: userId,
        data: {
          user_id: userId,
          xp: state.xp,
          xp_to_next_level: state.xpToNextLevel,
          gold: state.gold,
          level: state.level,
          streak: state.streak,
          last_shift_date: state.lastShiftDate,
          current_streak_start: state.currentStreakStart,
          shift_active: state.shiftActive,
          reputation: state.reputation,
          updated_at: Date.now(),
        },
      });
    }

    prevState = state;
  });

  cleanup = unsub;
}
