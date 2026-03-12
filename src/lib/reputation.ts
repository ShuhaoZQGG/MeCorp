import type { ShiftRecord } from '../store/types';

export type ReputationTier = 'high' | 'normal' | 'low' | 'critical';

export function calculateReputationDelta(shift: ShiftRecord, proofCount: number): number {
  let delta = 0;
  const rate = shift.tasksAssigned > 0
    ? shift.tasksCompleted / shift.tasksAssigned
    : 0;

  if (rate >= 0.8) delta += 3;
  else if (rate >= 0.5) delta += 1;

  delta += Math.min(proofCount, 3); // cap proof bonus at 3
  if (shift.streak >= 3) delta += 1;

  return delta;
}

export function calculateReputationDecay(lastShiftDate: string | null): number {
  if (!lastShiftDate) return 0;
  const last = new Date(lastShiftDate + 'T00:00:00');
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const daysMissed = Math.floor((now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24)) - 1;
  if (daysMissed <= 1) return 0;
  return Math.max(-10, -(daysMissed - 1) * 2);
}

export function getReputationTier(reputation: number): ReputationTier {
  if (reputation >= 80) return 'high';
  if (reputation >= 50) return 'normal';
  if (reputation >= 20) return 'low';
  return 'critical';
}
