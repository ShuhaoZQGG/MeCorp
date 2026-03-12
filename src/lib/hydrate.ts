// =============================================================================
// hydrateFromSupabase
//
// Fetches all user data from Supabase in a single parallel batch, reconstructs
// the nested Goal+PoolTask structure, and populates the Zustand stores.
//
// The `_skipSync` flag is set on each store before writing so that the
// syncSubscriptions middleware does not immediately queue the hydrated data
// back to Supabase in an infinite loop.  The flag is cleared after one tick.
// =============================================================================

import { supabase } from './supabase';
import { fromDbGoal, fromDbTask, fromDbShift, fromDbPlayerState, fromDbReview, fromDbPurchasedItem, fromDbAchievement } from './supabase-types';
import type { Goal, UnlockedAchievement } from '../store/types';

export async function hydrateFromSupabase(userId: string): Promise<void> {
  const [goalsRes, tasksRes, shiftsRes, playerRes, reviewsRes, purchasedItemsRes, achievementsRes] = await Promise.all([
    supabase.from('goals').select('*').eq('user_id', userId),
    supabase.from('tasks').select('*').eq('user_id', userId),
    supabase
      .from('shifts')
      .select('*')
      .eq('user_id', userId)
      .order('clock_out_time', { ascending: false }),
    supabase.from('player_state').select('*').eq('user_id', userId).single(),
    supabase
      .from('reviews')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false }),
    supabase.from('purchased_items').select('*').eq('user_id', userId),
    supabase.from('achievements').select('*').eq('user_id', userId),
  ]);

  const dbGoals = goalsRes.data ?? [];
  const dbTasks = tasksRes.data ?? [];
  const dbShifts = shiftsRes.data ?? [];
  const dbReviews = reviewsRes.data ?? [];
  const dbPurchasedItems = purchasedItemsRes.data ?? [];
  const dbAchievements = achievementsRes.data ?? [];

  // Reconstruct goals with their nested task arrays.
  const goals: Goal[] = dbGoals.map((g) => {
    const goalBase = fromDbGoal(g);
    const goalTasks = dbTasks
      .filter((t) => t.goal_id === g.id)
      .map(fromDbTask);
    return { ...goalBase, tasks: goalTasks } as Goal;
  });

  // Flat task pool used by goalStore.
  const taskPool = dbTasks.map(fromDbTask);

  // Shift history ordered most-recent-first (matching the order query above).
  const shiftHistory = dbShifts.map(fromDbShift);

  // Review history ordered most-recent-first.
  const reviewHistory = dbReviews.map(fromDbReview);

  const { useGameStore } = await import('../store/gameStore');
  const { useGoalStore } = await import('../store/goalStore');
  const { useDailyStore } = await import('../store/dailyStore');
  const { useShopStore } = await import('../store/shopStore');
  const { useAchievementStore } = await import('../store/achievementStore');

  // Signal that the following setState calls should not trigger sync writes.
  useGameStore.setState({ _skipSync: true });
  useGoalStore.setState({ _skipSync: true });
  useDailyStore.setState({ _skipSync: true });
  useShopStore.setState({ _skipSync: true });
  useAchievementStore.setState({ _skipSync: true });

  if (playerRes.data) {
    const playerState = fromDbPlayerState(playerRes.data);
    useGameStore.setState({ ...playerState, _skipSync: true });
  }

  useGoalStore.setState({ goals, taskPool, _skipSync: true });
  useDailyStore.setState({ shiftHistory, reviewHistory, _skipSync: true });

  // Hydrate shop
  const purchasedItems = dbPurchasedItems.map(fromDbPurchasedItem);
  useShopStore.setState({ purchasedItems, _skipSync: true });

  // Hydrate achievements
  const unlocked: UnlockedAchievement[] = dbAchievements.map(fromDbAchievement);
  const unlockedIds = new Set(unlocked.map((a) => a.achievementId));
  useAchievementStore.setState({ unlocked, unlockedIds, _skipSync: true });

  // Clear the skip flag on the next tick so normal sync resumes.
  setTimeout(() => {
    useGameStore.setState({ _skipSync: false });
    useGoalStore.setState({ _skipSync: false });
    useDailyStore.setState({ _skipSync: false });
    useShopStore.setState({ _skipSync: false });
    useAchievementStore.setState({ _skipSync: false });
  }, 0);
}
