import { useGameStore } from '../../store/gameStore';

export default function ShiftBadge() {
  const shiftActive = useGameStore((s) => s.shiftActive);

  if (!shiftActive) return null;

  return (
    <div
      className="flex items-center justify-center gap-1"
      style={{ marginTop: '4px' }}
    >
      {/* Pulsing dot */}
      <div
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: '#38b764',
          flexShrink: 0,
          animation: 'pulse-dot 1.5s ease-in-out infinite',
        }}
      />

      {/* Label */}
      <span
        style={{
          fontSize: '6px',
          color: '#38b764',
          lineHeight: 1,
          userSelect: 'none',
          letterSpacing: '0.5px',
        }}
      >
        ON SHIFT
      </span>
    </div>
  );
}
