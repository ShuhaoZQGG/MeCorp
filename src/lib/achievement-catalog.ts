import type { AchievementDef } from '../store/types';

export const ACHIEVEMENT_CATALOG: AchievementDef[] = [
  // Shift
  {
    id: 'new-hire',
    title: 'New Hire',
    description: 'Complete your first shift',
    category: 'shift',
    icon: '🏢',
    condition: (ctx) => ctx.totalShifts >= 1,
  },
  {
    id: 'first-week',
    title: 'First Week',
    description: 'Complete 5 shifts',
    category: 'shift',
    icon: '📅',
    condition: (ctx) => ctx.totalShifts >= 5,
  },
  {
    id: 'veteran',
    title: 'Veteran',
    description: 'Complete 50 shifts',
    category: 'shift',
    icon: '🎖️',
    condition: (ctx) => ctx.totalShifts >= 50,
  },
  {
    id: 'lifer',
    title: 'Lifer',
    description: 'Complete 100 shifts',
    category: 'shift',
    icon: '🏆',
    condition: (ctx) => ctx.totalShifts >= 100,
  },

  // Streak
  {
    id: 'three-day-streak',
    title: 'Hat Trick',
    description: '3 day streak',
    category: 'streak',
    icon: '🔥',
    condition: (ctx) => ctx.streak >= 3,
  },
  {
    id: 'seven-day-streak',
    title: 'One Week Strong',
    description: '7 day streak',
    category: 'streak',
    icon: '🔥',
    condition: (ctx) => ctx.streak >= 7,
  },
  {
    id: 'fourteen-day-streak',
    title: 'Fortnight Force',
    description: '14 day streak',
    category: 'streak',
    icon: '🔥',
    condition: (ctx) => ctx.streak >= 14,
  },
  {
    id: 'thirty-day-streak',
    title: 'Monthly Machine',
    description: '30 day streak',
    category: 'streak',
    icon: '💪',
    condition: (ctx) => ctx.streak >= 30,
  },
  {
    id: 'sixty-day-streak',
    title: 'Relentless',
    description: '60 day streak',
    category: 'streak',
    icon: '⚡',
    condition: (ctx) => ctx.streak >= 60,
  },
  {
    id: 'hundred-day-streak',
    title: 'Unstoppable',
    description: '100 day streak',
    category: 'streak',
    icon: '👑',
    condition: (ctx) => ctx.streak >= 100,
  },

  // Level
  {
    id: 'level-5',
    title: 'Getting Started',
    description: 'Reach level 5',
    category: 'level',
    icon: '⭐',
    condition: (ctx) => ctx.level >= 5,
  },
  {
    id: 'level-10',
    title: 'Double Digits',
    description: 'Reach level 10',
    category: 'level',
    icon: '⭐',
    condition: (ctx) => ctx.level >= 10,
  },
  {
    id: 'level-25',
    title: 'Quarter Century',
    description: 'Reach level 25',
    category: 'level',
    icon: '🌟',
    condition: (ctx) => ctx.level >= 25,
  },
  {
    id: 'level-50',
    title: 'Half Century',
    description: 'Reach level 50',
    category: 'level',
    icon: '💫',
    condition: (ctx) => ctx.level >= 50,
  },

  // Gold
  {
    id: 'gold-100',
    title: 'First Paycheck',
    description: 'Earn 100 gold total',
    category: 'gold',
    icon: '🪙',
    condition: (ctx) => ctx.totalGoldEarned >= 100,
  },
  {
    id: 'gold-500',
    title: 'Saving Up',
    description: 'Earn 500 gold total',
    category: 'gold',
    icon: '💰',
    condition: (ctx) => ctx.totalGoldEarned >= 500,
  },
  {
    id: 'gold-1000',
    title: 'Thousandaire',
    description: 'Earn 1000 gold total',
    category: 'gold',
    icon: '💰',
    condition: (ctx) => ctx.totalGoldEarned >= 1000,
  },
  {
    id: 'gold-5000',
    title: 'Money Machine',
    description: 'Earn 5000 gold total',
    category: 'gold',
    icon: '🏦',
    condition: (ctx) => ctx.totalGoldEarned >= 5000,
  },

  // Tasks
  {
    id: 'task-master',
    title: 'Task Master',
    description: 'Complete 50 tasks in one category',
    category: 'tasks',
    icon: '📋',
    condition: (ctx) =>
      Object.values(ctx.categoryTaskCounts).some((c) => (c ?? 0) >= 50),
  },

  // Special
  {
    id: 'centurion',
    title: 'Centurion',
    description: 'Complete 100 total tasks',
    category: 'special',
    icon: '🌟',
    condition: (ctx) => ctx.totalTasksCompleted >= 100,
  },
];

export function getAchievementById(id: string): AchievementDef | undefined {
  return ACHIEVEMENT_CATALOG.find((a) => a.id === id);
}
