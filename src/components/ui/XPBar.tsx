import { useState, useEffect, useRef } from 'react';
import { useGameStore } from '../../store/gameStore';

export default function XPBar() {
  const xp = useGameStore((s) => s.xp);
  const xpToNextLevel = useGameStore((s) => s.xpToNextLevel);
  const prevXpRef = useRef(xp);
  const [flashing, setFlashing] = useState(false);

  useEffect(() => {
    if (xp > prevXpRef.current) {
      setFlashing(true);
      const timer = setTimeout(() => setFlashing(false), 300);
      prevXpRef.current = xp;
      return () => clearTimeout(timer);
    }
    prevXpRef.current = xp;
  }, [xp]);

  const fillPct = xpToNextLevel > 0 ? (xp / xpToNextLevel) * 100 : 0;

  return (
    <div className="flex items-center gap-1">
      {/* "XP" label */}
      <span
        style={{
          fontSize: '6px',
          color: '#f0f0f0',
          letterSpacing: '0.5px',
          lineHeight: 1,
          userSelect: 'none',
        }}
      >
        XP
      </span>

      {/* Track */}
      <div
        style={{
          position: 'relative',
          width: '140px',
          height: '12px',
          background: '#1a1c2c',
          border: '2px solid #4a5568',
          overflow: 'hidden',
        }}
      >
        {/* Fill */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            width: `${fillPct}%`,
            background: '#38b764',
            transition: 'width 400ms ease-out',
          }}
        />

        {/* Flash overlay */}
        {flashing && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(255, 255, 255, 0.6)',
              animation: 'xp-flash 300ms ease-out forwards',
              pointerEvents: 'none',
            }}
          />
        )}
      </div>
    </div>
  );
}
