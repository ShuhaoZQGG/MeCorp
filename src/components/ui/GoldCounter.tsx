import { useState, useEffect, useRef } from 'react';
import { useGameStore } from '../../store/gameStore';

export default function GoldCounter() {
  const gold = useGameStore((s) => s.gold);
  const prevGoldRef = useRef(gold);
  const [popNumber, setPopNumber] = useState(false);
  const [spinCoin, setSpinCoin] = useState(false);

  useEffect(() => {
    if (gold > prevGoldRef.current) {
      // Trigger both animations; re-mount trick via double setState
      setPopNumber(false);
      setSpinCoin(false);
      // Let React flush the removal before re-adding
      const raf = requestAnimationFrame(() => {
        setPopNumber(true);
        setSpinCoin(true);
        const timer = setTimeout(() => {
          setPopNumber(false);
          setSpinCoin(false);
        }, 400);
        prevGoldRef.current = gold;
        return () => clearTimeout(timer);
      });
      return () => cancelAnimationFrame(raf);
    }
    prevGoldRef.current = gold;
  }, [gold]);

  return (
    <div className="flex items-center gap-1">
      {/* Coin icon */}
      <div
        style={{
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          background: '#f7d87c',
          boxShadow: 'inset 0 0 0 1px #c4a44e',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          animation: spinCoin ? 'coin-spin 400ms ease-out forwards' : 'none',
        }}
      >
        <span
          style={{
            fontSize: '5px',
            color: '#1a1c2c',
            fontFamily: "'Press Start 2P', monospace",
            lineHeight: 1,
            userSelect: 'none',
          }}
        >
          G
        </span>
      </div>

      {/* Gold amount */}
      <span
        style={{
          fontSize: '8px',
          color: '#f7d87c',
          lineHeight: 1,
          userSelect: 'none',
          display: 'inline-block',
          animation: popNumber ? 'pop 300ms ease-out forwards' : 'none',
        }}
      >
        {gold}
      </span>
    </div>
  );
}
