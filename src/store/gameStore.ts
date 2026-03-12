import { create } from 'zustand';
import type { TaskCategory, Task } from './types';
import { useAchievementStore } from './achievementStore';
import { buildAchievementContext } from '../lib/achievement-helpers';

export type { TaskCategory, Task } from './types';

export type Screen = 'office' | 'goals' | 'history' | 'apartment' | 'meeting' | 'shop';

interface GameState {
  tasks: Task[];
  xp: number;
  xpToNextLevel: number;
  gold: number;
  level: number;
  shiftActive: boolean;
  streak: number;
  lastShiftDate: string | null;
  currentStreakStart: string | null;
  currentScreen: Screen;
  todayXpEarned: number;
  todayGoldEarned: number;
  reputation: number;
  _skipSync: boolean;

  clockIn: () => void;
  clockOut: () => void;
  addTask: (title: string, category: TaskCategory) => void;
  completeTask: (id: string) => void;
  removeTask: (id: string) => void;
  setScreen: (screen: Screen) => void;
  addRewards: (xp: number, gold: number) => void;
  updateReputation: (delta: number) => void;
}

const getLocalDate = () => new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD

const getYesterday = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toLocaleDateString('en-CA');
};

export const useGameStore = create<GameState>()(
  (set, get) => ({
    tasks: [],
    xp: 0,
    xpToNextLevel: 100,
    gold: 0,
    level: 1,
    shiftActive: false,
    streak: 0,
    lastShiftDate: null,
    currentStreakStart: null,
    currentScreen: 'office' as Screen,
    todayXpEarned: 0,
    todayGoldEarned: 0,
    reputation: 50,
    _skipSync: false,

    clockIn: () => {
      const today = getLocalDate();
      const { lastShiftDate, streak, currentStreakStart } = get();
      let newStreak = 1;
      let newStreakStart: string | null = today;
      if (lastShiftDate === getYesterday()) {
        newStreak = streak + 1;
        newStreakStart = currentStreakStart || today;
      } else if (lastShiftDate === today) {
        newStreak = streak;
        newStreakStart = currentStreakStart;
      }
      set({
        shiftActive: true,
        streak: newStreak,
        lastShiftDate: today,
        currentStreakStart: newStreakStart,
        todayXpEarned: 0,
        todayGoldEarned: 0,
      });

      // Check achievements after clock-in (streak may have updated)
      setTimeout(() => {
        useAchievementStore.getState().checkAndUnlock(buildAchievementContext());
      }, 0);
    },

    clockOut: () => set({ shiftActive: false }),

    addTask: (title, category) =>
      set((state) => ({
        tasks: [
          ...state.tasks,
          {
            id: crypto.randomUUID(),
            title,
            category,
            completed: false,
          },
        ],
      })),

    completeTask: (id) =>
      set((state) => {
        const task = state.tasks.find((t) => t.id === id);
        if (!task || task.completed) return state;

        const baseXp = 25;
        const baseGold = 10;
        let newXp = state.xp + baseXp;
        let newLevel = state.level;
        let newXpToNext = state.xpToNextLevel;

        while (newXp >= newXpToNext) {
          newXp -= newXpToNext;
          newLevel += 1;
          newXpToNext = 100 * newLevel;
        }

        return {
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, completed: true, completedAt: Date.now() } : t
          ),
          xp: newXp,
          xpToNextLevel: newXpToNext,
          gold: state.gold + baseGold,
          level: newLevel,
        };
      }),

    removeTask: (id) =>
      set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== id),
      })),

    setScreen: (screen) => set({ currentScreen: screen }),

    updateReputation: (delta) =>
      set((state) => ({
        reputation: Math.max(0, Math.min(100, state.reputation + delta)),
      })),

    addRewards: (xpAmount, goldAmount) => {
      set((state) => {
        let newXp = state.xp + xpAmount;
        let newLevel = state.level;
        let newXpToNext = state.xpToNextLevel;

        while (newXp >= newXpToNext) {
          newXp -= newXpToNext;
          newLevel += 1;
          newXpToNext = 100 * newLevel;
        }

        return {
          xp: newXp,
          xpToNextLevel: newXpToNext,
          gold: state.gold + goldAmount,
          level: newLevel,
          todayXpEarned: state.todayXpEarned + xpAmount,
          todayGoldEarned: state.todayGoldEarned + goldAmount,
        };
      });

      // Check achievements after rewards (level may have increased)
      setTimeout(() => {
        useAchievementStore.getState().checkAndUnlock(buildAchievementContext());
      }, 0);
    },
  })
);
