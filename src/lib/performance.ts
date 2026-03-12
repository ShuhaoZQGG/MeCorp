// =============================================================================
// Performance helpers
//
// Calculates display tiers based on recent shift completion rates.
// Used to determine which apartment background variant to show the player.
// =============================================================================

import type { ShiftRecord } from '../store/types';

/** Visual tier for the player's apartment / home scene. */
export type ApartmentTier = 'good' | 'neutral' | 'poor';

/**
 * Derives the apartment tier from the player's last 5 completed shifts.
 *
 * Thresholds (based on average task completion rate across the last 5 shifts):
 *   >= 70%  →  'good'
 *   >= 40%  →  'neutral'
 *   <  40%  →  'poor'
 *
 * @param recentShifts - All shift records, ordered most-recent-first.
 *                       Only the first 5 entries are examined.
 */
export function calculateApartmentTier(recentShifts: ShiftRecord[]): ApartmentTier {
  if (recentShifts.length === 0) return 'neutral';

  const last5 = recentShifts.slice(0, 5);
  const totalAssigned = last5.reduce((sum, s) => sum + s.tasksAssigned, 0);

  if (totalAssigned === 0) return 'neutral';

  const totalCompleted = last5.reduce((sum, s) => sum + s.tasksCompleted, 0);
  const avgCompletionRate = totalCompleted / totalAssigned;

  if (avgCompletionRate >= 0.7) return 'good';
  if (avgCompletionRate >= 0.4) return 'neutral';
  return 'poor';
}
