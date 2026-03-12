import type { AchievementContext, TaskCategory } from '../store/types';
import { useGameStore } from '../store/gameStore';
import { useDailyStore } from '../store/dailyStore';
import { useGoalStore } from '../store/goalStore';

export function buildAchievementContext(): AchievementContext {
  const game = useGameStore.getState();
  const daily = useDailyStore.getState();
  const goal = useGoalStore.getState();

  const totalGoldEarned = daily.shiftHistory.reduce((s, r) => s + r.goldEarned, 0);
  const totalTasksCompleted = goal.taskPool.filter((t) => t.status === 'completed').length;
  const totalShifts = daily.shiftHistory.length;

  const categoryTaskCounts: Partial<Record<TaskCategory, number>> = {};
  goal.taskPool
    .filter((t) => t.status === 'completed')
    .forEach((t) => {
      categoryTaskCounts[t.category] = (categoryTaskCounts[t.category] ?? 0) + 1;
    });

  return {
    level: game.level,
    streak: game.streak,
    totalGoldEarned,
    totalTasksCompleted,
    totalShifts,
    categoryTaskCounts,
  };
}
