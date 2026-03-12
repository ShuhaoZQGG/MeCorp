import type { ShiftRecord, WeeklyReview } from '../store/types';

function getMonday(date: Date): string {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  return d.toLocaleDateString('en-CA');
}

function getFriday(date: Date): string {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + 5;
  d.setDate(diff);
  return d.toLocaleDateString('en-CA');
}

export function getWeekShifts(
  shiftHistory: ShiftRecord[],
  weekStart: string,
  weekEnd: string
): ShiftRecord[] {
  return shiftHistory.filter((s) => s.date >= weekStart && s.date <= weekEnd);
}

export function shouldShowFridayReview(
  reviewHistory: WeeklyReview[],
  shiftHistory: ShiftRecord[]
): boolean {
  const now = new Date();
  if (now.getDay() !== 5) return false;

  const weekStart = getMonday(now);
  const weekEnd = getFriday(now);

  // Already reviewed this week?
  const alreadyReviewed = reviewHistory.some((r) => r.weekStart === weekStart);
  if (alreadyReviewed) return false;

  // At least 1 shift this week?
  const weekShifts = getWeekShifts(shiftHistory, weekStart, weekEnd);
  return weekShifts.length > 0;
}

export { getMonday, getFriday };
