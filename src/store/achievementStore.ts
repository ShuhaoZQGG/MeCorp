import { create } from 'zustand';
import type { AchievementDef, AchievementContext, UnlockedAchievement } from './types';
import { ACHIEVEMENT_CATALOG } from '../lib/achievement-catalog';
import { syncManager } from '../lib/sync';
import { toDbAchievement } from '../lib/supabase-types';
import { getCurrentUserId } from '../lib/auth-context';

interface AchievementState {
  unlockedIds: Set<string>;
  unlocked: UnlockedAchievement[];
  pendingPopups: AchievementDef[];
  _skipSync: boolean;

  checkAndUnlock: (ctx: AchievementContext) => void;
  dismissPopup: () => void;
}

export const useAchievementStore = create<AchievementState>()(
  (set, get) => ({
    unlockedIds: new Set<string>(),
    unlocked: [],
    pendingPopups: [],
    _skipSync: false,

    checkAndUnlock: (ctx) => {
      const state = get();
      const newUnlocks: { def: AchievementDef; record: UnlockedAchievement }[] = [];

      for (const def of ACHIEVEMENT_CATALOG) {
        if (state.unlockedIds.has(def.id)) continue;
        if (def.condition(ctx)) {
          const record: UnlockedAchievement = {
            achievementId: def.id,
            unlockedAt: Date.now(),
          };
          newUnlocks.push({ def, record });
        }
      }

      if (newUnlocks.length === 0) return;

      const newIds = new Set(state.unlockedIds);
      newUnlocks.forEach(({ def }) => newIds.add(def.id));

      set({
        unlockedIds: newIds,
        unlocked: [...state.unlocked, ...newUnlocks.map((u) => u.record)],
        pendingPopups: [...state.pendingPopups, ...newUnlocks.map((u) => u.def)],
      });

      // Sync to Supabase
      const userId = getCurrentUserId();
      if (userId && !get()._skipSync) {
        newUnlocks.forEach(({ record }) => {
          syncManager.enqueue({
            table: 'achievements',
            type: 'insert',
            data: {
              ...toDbAchievement(record, userId),
              id: crypto.randomUUID(),
            },
          });
        });
      }
    },

    dismissPopup: () => {
      set((s) => ({
        pendingPopups: s.pendingPopups.slice(1),
      }));
    },
  })
);
