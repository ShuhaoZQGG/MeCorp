import type { ShopItem } from '../../store/types';
import { useShopStore } from '../../store/shopStore';
import ShopItemPreview from './ShopItemPreview';

interface Props {
  item: ShopItem;
  onClose: () => void;
}

export default function PurchaseConfirmDialog({ item, onClose }: Props) {
  const purchaseItem = useShopStore((s) => s.purchaseItem);
  const canAfford = useShopStore((s) => s.canAfford(item));
  const pixelFont = "'Press Start 2P', monospace";

  const handleBuy = () => {
    purchaseItem(item);
    onClose();
  };

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(0,0,0,0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 55,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#1a1c2c',
          border: '3px solid #f7d87c',
          padding: '16px',
          maxWidth: '200px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <div style={{ width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ShopItemPreview itemId={item.id} />
        </div>
        <div style={{ fontSize: '7px', fontFamily: pixelFont, color: '#f5e6c8', textAlign: 'center' }}>{item.name}</div>
        <div style={{ fontSize: '5px', fontFamily: pixelFont, color: '#999', textAlign: 'center' }}>{item.description}</div>
        <div style={{ fontSize: '8px', fontFamily: pixelFont, color: '#f7d87c' }}>{item.costGold}G</div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={handleBuy}
            disabled={!canAfford}
            style={{
              fontSize: '6px',
              fontFamily: pixelFont,
              padding: '6px 12px',
              background: canAfford ? '#38b764' : '#444',
              color: canAfford ? '#fff' : '#888',
              border: 'none',
              cursor: canAfford ? 'pointer' : 'default',
            }}
          >
            BUY
          </button>
          <button
            onClick={onClose}
            style={{
              fontSize: '6px',
              fontFamily: pixelFont,
              padding: '6px 12px',
              background: '#4a2e0a',
              color: '#f5e6c8',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            CANCEL
          </button>
        </div>
      </div>
    </div>
  );
}
