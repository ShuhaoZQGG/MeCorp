import type { ShopItem, ItemCategory, ItemSlot } from '../store/types';

export const ITEM_CATALOG: ShopItem[] = [
  // Office items
  { id: 'desk-lamp', name: 'Desk Lamp', category: 'office', slot: 'desk-lamp', costGold: 50, requiredLevel: 2, description: 'A warm glow for late shifts', unlockCondition: { type: 'none' } },
  { id: 'motivational-poster', name: 'Motivational Poster', category: 'office', slot: 'wall-art', costGold: 75, requiredLevel: 3, description: '"Synergy" in bold letters', unlockCondition: { type: 'none' } },
  { id: 'widescreen-monitor', name: 'Widescreen Monitor', category: 'office', slot: 'monitor-upgrade', costGold: 200, requiredLevel: 5, description: 'Dual-screen productivity', unlockCondition: { type: 'none' } },
  { id: 'gold-trophy', name: 'Gold Trophy', category: 'office', slot: 'bookshelf-item', costGold: 150, requiredLevel: 4, description: 'Employee of the month', unlockCondition: { type: 'streak', value: 7 } },
  { id: 'bonsai', name: 'Bonsai Tree', category: 'office', slot: 'plant-upgrade', costGold: 100, requiredLevel: 3, description: 'Zen desk companion', unlockCondition: { type: 'none' } },
  // Apartment items
  { id: 'cozy-couch', name: 'Cozy Couch', category: 'apartment', slot: 'couch', costGold: 80, requiredLevel: 2, description: 'Perfect for post-shift relaxing', unlockCondition: { type: 'none' } },
  { id: 'retro-tv', name: 'Retro TV', category: 'apartment', slot: 'tv', costGold: 120, requiredLevel: 4, description: '8-bit entertainment system', unlockCondition: { type: 'none' } },
  { id: 'kitchen-upgrade', name: 'Kitchen Upgrade', category: 'apartment', slot: 'kitchen-upgrade', costGold: 180, requiredLevel: 5, description: 'Stainless steel everything', unlockCondition: { type: 'none' } },
  { id: 'pet-bed', name: 'Pet Bed', category: 'apartment', slot: 'pet-bed', costGold: 60, requiredLevel: 2, description: 'A cozy spot for your cat', unlockCondition: { type: 'none' } },
  { id: 'balcony-plants', name: 'Balcony Plants', category: 'apartment', slot: 'balcony-decor', costGold: 250, requiredLevel: 7, description: 'Urban jungle vibes', unlockCondition: { type: 'none' } },
  // Character items
  { id: 'party-hat', name: 'Party Hat', category: 'character', slot: 'hat', costGold: 30, requiredLevel: 1, description: 'Every day is a celebration', unlockCondition: { type: 'none' } },
  { id: 'business-suit', name: 'Business Suit', category: 'character', slot: 'shirt', costGold: 100, requiredLevel: 3, description: 'Dress for the job you want', unlockCondition: { type: 'none' } },
  { id: 'cool-shades', name: 'Cool Shades', category: 'character', slot: 'accessory', costGold: 50, requiredLevel: 2, description: 'The future is bright', unlockCondition: { type: 'none' } },
  { id: 'gold-watch', name: 'Gold Watch', category: 'character', slot: 'accessory', costGold: 200, requiredLevel: 6, description: 'Time is money, literally', unlockCondition: { type: 'reputation', value: 80 } },
  { id: 'power-tie', name: 'Power Tie', category: 'character', slot: 'shirt', costGold: 75, requiredLevel: 3, description: 'Red means business', unlockCondition: { type: 'none' } },
];

export function getItemById(id: string): ShopItem | undefined {
  return ITEM_CATALOG.find((item) => item.id === id);
}

export function getItemsByCategory(category: ItemCategory): ShopItem[] {
  return ITEM_CATALOG.filter((item) => item.category === category);
}

export function getItemsBySlot(slot: ItemSlot): ShopItem[] {
  return ITEM_CATALOG.filter((item) => item.slot === slot);
}
