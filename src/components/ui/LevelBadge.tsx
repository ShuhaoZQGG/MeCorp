import { useGameStore } from '../../store/gameStore';

export default function LevelBadge() {
  const level = useGameStore((s) => s.level);

  return (
    <span
      style={{
        fontSize: '8px',
        color: '#f7d87c',
        border: '2px solid #4a5568',
        background: '#1a1c2c',
        padding: '2px 4px',
        lineHeight: 1,
        userSelect: 'none',
        whiteSpace: 'nowrap',
        display: 'inline-block',
      }}
    >
      Lv.{level}
    </span>
  );
}
