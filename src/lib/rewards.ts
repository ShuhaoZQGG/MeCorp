import type { EstimatedDuration } from '../store/types';

export function getDifficultyMultiplier(duration: EstimatedDuration): number {
  switch (duration) {
    case '15min': return 1;
    case '30min': return 2;
    case '1hr': return 4;
    case '2hr': return 7;
    default: return 1;
  }
}

export function getStreakMultiplier(streak: number): number {
  if (streak >= 2) {
    return Math.min(1 + (streak - 1) * 0.1, 2);
  }
  return 1;
}

export function calculateTaskReward(
  duration: EstimatedDuration,
  streak: number,
  hasProof: boolean
): { xp: number; gold: number } {
  const baseXp = 25;
  const baseGold = 10;
  const diffMult = getDifficultyMultiplier(duration);
  const streakMult = getStreakMultiplier(streak);

  if (!hasProof) {
    return {
      xp: Math.round(baseXp * diffMult * 0.25),
      gold: 0,
    };
  }

  return {
    xp: Math.round(baseXp * diffMult),
    gold: Math.round(baseGold * diffMult * streakMult),
  };
}
