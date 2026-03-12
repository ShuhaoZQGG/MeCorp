import type { ItemCategory, ShopItem } from '../../store/types';
import { getItemsByCategory } from '../../lib/item-catalog';
import ShopItemCard from './ShopItemCard';

interface Props {
  category: ItemCategory;
  onSelectItem: (item: ShopItem) => void;
}

export default function ShopItemGrid({ category, onSelectItem }: Props) {
  const items = getItemsByCategory(category);

  return (
    <div
      style={{
        flex: 1,
        overflowY: 'auto',
        padding: '12px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
        gap: '10px',
        alignContent: 'start',
      }}
    >
      {items.map((item) => (
        <ShopItemCard key={item.id} item={item} onSelect={() => onSelectItem(item)} />
      ))}
    </div>
  );
}
