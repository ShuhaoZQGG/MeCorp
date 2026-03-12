import { useEffect } from 'react';
import { useAchievementStore } from '../../store/achievementStore';

const PIXEL_FONT = "'Press Start 2P', monospace";

export default function AchievementPopup() {
  const pendingPopups = useAchievementStore((s) => s.pendingPopups);
  const dismissPopup = useAchievementStore((s) => s.dismissPopup);

  const current = pendingPopups[0];

  useEffect(() => {
    if (!current) return;
    const timer = setTimeout(dismissPopup, 3000);
    return () => clearTimeout(timer);
  }, [current, dismissPopup]);

  if (!current) return null;

  return (
    <div
      onClick={dismissPopup}
      style={{
        position: 'absolute',
        top: '60px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 60,
        background: '#1a1c2c',
        border: '3px solid #f7d87c',
        padding: '10px 16px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '4px',
        cursor: 'pointer',
        boxShadow: '0 0 20px rgba(247, 216, 124, 0.3)',
        animation: 'slide-up 300ms ease-out',
      }}
    >
      <div
        style={{
          fontSize: '5px',
          fontFamily: PIXEL_FONT,
          color: '#e76f51',
          letterSpacing: '1px',
        }}
      >
        ACHIEVEMENT UNLOCKED
      </div>
      <div style={{ fontSize: '16px' }}>{current.icon}</div>
      <div
        style={{
          fontSize: '7px',
          fontFamily: PIXEL_FONT,
          color: '#f7d87c',
        }}
      >
        {current.title}
      </div>
      <div
        style={{
          fontSize: '5px',
          fontFamily: PIXEL_FONT,
          color: '#999',
        }}
      >
        {current.description}
      </div>
    </div>
  );
}
