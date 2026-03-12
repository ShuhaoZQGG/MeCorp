import type { ItemCategory } from '../../store/types';

interface Props {
  active: ItemCategory;
  onChange: (cat: ItemCategory) => void;
}

const TABS: { label: string; value: ItemCategory }[] = [
  { label: 'OFFICE', value: 'office' },
  { label: 'APARTMENT', value: 'apartment' },
  { label: 'CHARACTER', value: 'character' },
];

export default function ShopCategoryTabs({ active, onChange }: Props) {
  const pixelFont = "'Press Start 2P', monospace";

  return (
    <div style={{ display: 'flex', borderBottom: '1px solid #2a2d4a' }}>
      {TABS.map((tab) => (
        <div
          key={tab.value}
          onClick={() => onChange(tab.value)}
          style={{
            flex: 1,
            padding: '8px 0',
            textAlign: 'center',
            fontSize: '6px',
            fontFamily: pixelFont,
            color: active === tab.value ? '#f7d87c' : '#666',
            background: active === tab.value ? '#2a2d4a' : 'transparent',
            cursor: 'pointer',
            userSelect: 'none',
            borderBottom: active === tab.value ? '2px solid #f7d87c' : '2px solid transparent',
            transition: 'all 200ms ease',
          }}
        >
          {tab.label}
        </div>
      ))}
    </div>
  );
}
