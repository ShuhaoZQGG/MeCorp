import type { TaskCategory } from '../../store/types';

const ICON_STYLES: Record<TaskCategory, { color: string; symbol: string }> = {
  work: { color: '#457b9d', symbol: '■' },
  health: { color: '#38b764', symbol: '♥' },
  learning: { color: '#9b5de5', symbol: '▣' },
  personal: { color: '#f7d87c', symbol: '★' },
  'side-project': { color: '#e76f51', symbol: '▲' },
  marketing: { color: '#f4a261', symbol: '◆' },
};

interface CategoryIconProps {
  category: TaskCategory;
  size?: number;
}

export default function CategoryIcon({ category, size = 12 }: CategoryIconProps) {
  const { color, symbol } = ICON_STYLES[category] ?? ICON_STYLES.personal;

  return (
    <span
      style={{
        fontSize: `${size}px`,
        color,
        fontFamily: "'Press Start 2P', monospace",
        lineHeight: 1,
        userSelect: 'none',
      }}
    >
      {symbol}
    </span>
  );
}
