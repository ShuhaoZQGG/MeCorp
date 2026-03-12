import { create } from 'zustand';
import type { PurchasedItem, ItemSlot, ShopItem } from './types';
import { syncManager } from '../lib/sync';
import { toDbPurchasedItem } from '../lib/supabase-types';
import { getCurrentUserId } from '../lib/auth-context';
import { useGameStore } from './gameStore';

interface ShopState {
  purchasedItems: PurchasedItem[];
  _skipSync: boolean;

  purchaseItem: (item: ShopItem) => boolean;
  toggleEquipped: (itemId: string) => void;
  hasItem: (itemId: string) => boolean;
  getEquippedForSlot: (slot: ItemSlot) => PurchasedItem | undefined;
  canAfford: (item: ShopItem) => boolean;
  meetsRequirements: (item: ShopItem) => boolean;
}

export const useShopStore = create<ShopState>()(
  (set, get) => ({
    purchasedItems: [],
    _skipSync: false,

    purchaseItem: (item) => {
      const state = get();
      if (state.hasItem(item.id)) return false;
      if (!state.canAfford(item)) return false;
      if (!state.meetsRequirements(item)) return false;

      // Deduct gold
      useGameStore.setState((s) => ({ gold: s.gold - item.costGold }));

      const purchased: PurchasedItem = {
        id: crypto.randomUUID(),
        itemId: item.id,
        slot: item.slot,
        purchasedAt: Date.now(),
        equipped: true,
      };

      // Unequip any existing item in same slot, then add the new purchase
      set((s) => ({
        purchasedItems: [
          ...s.purchasedItems.map((p) =>
            p.slot === item.slot && p.equipped ? { ...p, equipped: false } : p
          ),
          purchased,
        ],
      }));

      // Sync
      const userId = getCurrentUserId();
      if (userId && !get()._skipSync) {
        syncManager.enqueue({
          table: 'purchased_items',
          type: 'insert',
          id: purchased.id,
          data: toDbPurchasedItem(purchased, userId),
        });
        // Also sync unequipped items in the same slot
        get().purchasedItems.forEach((p) => {
          if (p.slot === item.slot && p.id !== purchased.id && !p.equipped) {
            syncManager.enqueue({
              table: 'purchased_items',
              type: 'upsert',
              id: p.id,
              data: toDbPurchasedItem(p, userId),
            });
          }
        });
      }

      return true;
    },

    toggleEquipped: (itemId) => {
      const item = get().purchasedItems.find((p) => p.itemId === itemId);
      if (!item) return;

      set((s) => ({
        purchasedItems: s.purchasedItems.map((p) => {
          if (p.itemId === itemId) return { ...p, equipped: !p.equipped };
          // Unequip others in same slot if we are equipping this one
          if (p.slot === item.slot && !item.equipped) return { ...p, equipped: false };
          return p;
        }),
      }));

      const userId = getCurrentUserId();
      if (userId && !get()._skipSync) {
        get().purchasedItems
          .filter((p) => p.slot === item.slot)
          .forEach((p) => {
            syncManager.enqueue({
              table: 'purchased_items',
              type: 'upsert',
              id: p.id,
              data: toDbPurchasedItem(p, userId),
            });
          });
      }
    },

    hasItem: (itemId) => get().purchasedItems.some((p) => p.itemId === itemId),

    getEquippedForSlot: (slot) =>
      get().purchasedItems.find((p) => p.slot === slot && p.equipped),

    canAfford: (item) => useGameStore.getState().gold >= item.costGold,

    meetsRequirements: (item) => {
      const game = useGameStore.getState();
      if (game.level < item.requiredLevel) return false;
      const cond = item.unlockCondition;
      if (cond.type === 'streak' && cond.value !== undefined && game.streak < cond.value) return false;
      if (cond.type === 'reputation' && cond.value !== undefined && game.reputation < cond.value) return false;
      if (cond.type === 'level' && cond.value !== undefined && game.level < cond.value) return false;
      return true;
    },
  })
);
