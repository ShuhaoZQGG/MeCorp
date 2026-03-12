import { useState } from 'react';
import ShopHeader from './ShopHeader';
import ShopCategoryTabs from './ShopCategoryTabs';
import ShopItemGrid from './ShopItemGrid';
import PurchaseConfirmDialog from './PurchaseConfirmDialog';
import type { ItemCategory, ShopItem } from '../../store/types';

export default function ShopScreen() {
  const [activeCategory, setActiveCategory] = useState<ItemCategory>('office');
  const [confirmItem, setConfirmItem] = useState<ShopItem | null>(null);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 50,
        background: '#1a1c2c',
        animation: 'slide-in-right 300ms ease-out',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <ShopHeader />
      <ShopCategoryTabs active={activeCategory} onChange={setActiveCategory} />
      <ShopItemGrid category={activeCategory} onSelectItem={setConfirmItem} />
      {confirmItem && (
        <PurchaseConfirmDialog item={confirmItem} onClose={() => setConfirmItem(null)} />
      )}
    </div>
  );
}
