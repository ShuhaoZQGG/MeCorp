import type { Goal, PoolTask, GoalPriority } from '../store/types';

const PRIORITY_WEIGHTS: Record<GoalPriority, number> = {
  high: 3,
  medium: 2,
  low: 1,
};

export function calculateCategoryDistribution(
  goals: Goal[],
  poolTasks: PoolTask[]
): Record<string, number> {
  const activeGoals = goals.filter((g) => g.active);
  const weights: Record<string, number> = {};
  let total = 0;

  for (const goal of activeGoals) {
    const goalTaskCount = poolTasks.filter(
      (t) => t.goalId === goal.id && t.status === 'queued'
    ).length;
    const weight = PRIORITY_WEIGHTS[goal.priority] * Math.max(goalTaskCount, 1);
    weights[goal.category] = (weights[goal.category] || 0) + weight;
    total += weight;
  }

  if (total === 0) return weights;

  const distribution: Record<string, number> = {};
  for (const [cat, weight] of Object.entries(weights)) {
    distribution[cat] = weight / total;
  }
  return distribution;
}

export function isBalanced(distribution: Record<string, number>): boolean {
  for (const weight of Object.values(distribution)) {
    if (weight > 0.6) return false;
  }
  return true;
}
