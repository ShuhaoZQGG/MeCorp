import { useState, useEffect, useRef } from 'react';
import { useGameStore } from '../../store/gameStore';

interface RewardItem {
  key: string;
  type: 'gold' | 'xp';
  amount: number;
  offsetX: number;
  offsetY: number;
}

export default function RewardAnimation() {
  const gold = useGameStore((s) => s.gold);
  const xp = useGameStore((s) => s.xp);
  const prevGoldRef = useRef(gold);
  const prevXpRef = useRef(xp);
  const [rewards, setRewards] = useState<RewardItem[]>([]);

  useEffect(() => {
    if (gold > prevGoldRef.current) {
      const amount = gold - prevGoldRef.current;
      const key = `gold-${Date.now()}-${Math.random()}`;
      const offsetX = Math.round((Math.random() - 0.5) * 40);
      const offsetY = Math.round((Math.random() - 0.5) * 40);
      setRewards((prev) => [
        ...prev,
        { key, type: 'gold', amount, offsetX, offsetY },
      ]);
    }
    prevGoldRef.current = gold;
  }, [gold]);

  useEffect(() => {
    if (xp > prevXpRef.current) {
      const amount = xp - prevXpRef.current;
      const key = `xp-${Date.now()}-${Math.random()}`;
      const offsetX = Math.round((Math.random() - 0.5) * 40);
      const offsetY = Math.round((Math.random() - 0.5) * 40);
      setRewards((prev) => [
        ...prev,
        { key, type: 'xp', amount, offsetX, offsetY },
      ]);
    }
    prevXpRef.current = xp;
  }, [xp]);

  const removeReward = (key: string) => {
    setRewards((prev) => prev.filter((r) => r.key !== key));
  };

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 50,
        pointerEvents: 'none',
      }}
    >
      {rewards.map((reward) => {
        const left = `calc(50% + ${reward.offsetX}px)`;
        const top = `calc(40% + ${reward.offsetY}px)`;

        if (reward.type === 'gold') {
          return (
            <div
              key={reward.key}
              style={{
                position: 'absolute',
                left,
                top,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: '4px',
                transform: 'translate(-50%, -50%)',
              }}
            >
              {/* Gold coin */}
              <div
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: '#f7d87c',
                  boxShadow: 'inset 0 0 0 1px #c4a44e',
                  flexShrink: 0,
                  animation: 'coin-spin 600ms ease-out forwards',
                }}
                onAnimationEnd={() => removeReward(reward.key)}
              />
              {/* Gold text */}
              <span
                style={{
                  fontSize: '7px',
                  color: '#f7d87c',
                  fontFamily: "'Press Start 2P', monospace",
                  lineHeight: 1,
                  userSelect: 'none',
                  whiteSpace: 'nowrap',
                  animation: 'float-up 600ms ease-out forwards',
                }}
              >
                +{reward.amount}G
              </span>
            </div>
          );
        }

        // XP reward
        return (
          <span
            key={reward.key}
            style={{
              position: 'absolute',
              left,
              top,
              fontSize: '7px',
              color: '#38b764',
              fontFamily: "'Press Start 2P', monospace",
              lineHeight: 1,
              userSelect: 'none',
              whiteSpace: 'nowrap',
              transform: 'translate(-50%, -50%)',
              animation: 'float-up 600ms ease-out forwards',
            }}
            onAnimationEnd={() => removeReward(reward.key)}
          >
            +{reward.amount}XP
          </span>
        );
      })}
    </div>
  );
}
