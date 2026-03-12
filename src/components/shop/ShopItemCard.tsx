import type { ShopItem } from '../../store/types';
import { useShopStore } from '../../store/shopStore';
import ShopItemPreview from './ShopItemPreview';

interface Props {
  item: ShopItem;
  onSelect: () => void;
}

export default function ShopItemCard({ item, onSelect }: Props) {
  const hasItem = useShopStore((s) => s.hasItem(item.id));
  const canAfford = useShopStore((s) => s.canAfford(item));
  const meetsReqs = useShopStore((s) => s.meetsRequirements(item));
  const isLocked = !meetsReqs;
  const pixelFont = "'Press Start 2P', monospace";

  return (
    <div
      onClick={!hasItem && !isLocked ? onSelect : undefined}
      style={{
        background: hasItem ? '#1a2a1a' : isLocked ? '#1a1a2a' : '#2a2d4a',
        border: `2px solid ${hasItem ? '#38b764' : isLocked ? '#444' : canAfford ? '#f7d87c' : '#8b6914'}`,
        padding: '8px',
        cursor: hasItem || isLocked ? 'default' : 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '4px',
        transition: 'filter 200ms ease',
        opacity: isLocked ? 0.5 : 1,
      }}
      onMouseEnter={(e) => {
        if (!hasItem && !isLocked) (e.currentTarget as HTMLElement).style.filter = 'brightness(1.2)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.filter = 'brightness(1)';
      }}
    >
      <div style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <ShopItemPreview itemId={item.id} />
      </div>
      <div style={{ fontSize: '5px', fontFamily: pixelFont, color: '#f5e6c8', textAlign: 'center', userSelect: 'none' }}>
        {item.name}
      </div>
      <div style={{ fontSize: '5px', fontFamily: pixelFont, color: '#999', textAlign: 'center', userSelect: 'none', lineHeight: '8px' }}>
        {item.description}
      </div>
      {hasItem ? (
        <div style={{ fontSize: '5px', fontFamily: pixelFont, color: '#38b764', userSelect: 'none' }}>OWNED</div>
      ) : isLocked ? (
        <div style={{ fontSize: '5px', fontFamily: pixelFont, color: '#e76f51', userSelect: 'none' }}>
          {item.unlockCondition.type === 'streak'
            ? `${item.unlockCondition.value ?? '?'}d streak`
            : item.unlockCondition.type === 'reputation'
            ? `${item.unlockCondition.value ?? '?'} rep`
            : `LVL ${item.requiredLevel}`}
        </div>
      ) : (
        <div style={{ fontSize: '6px', fontFamily: pixelFont, color: canAfford ? '#f7d87c' : '#666', userSelect: 'none' }}>
          {item.costGold}G
        </div>
      )}
    </div>
  );
}
