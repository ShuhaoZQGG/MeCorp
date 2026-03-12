import { useState } from 'react';
import LevelBadge from './LevelBadge';
import XPBar from './XPBar';
import GoldCounter from './GoldCounter';
import ShiftBadge from './ShiftBadge';
import { useGameStore } from '../../store/gameStore';
import SettingsModal from '../settings/SettingsModal';

export default function HUD() {
  const streak = useGameStore((s) => s.streak);
  const pixelFont = "'Press Start 2P', monospace";
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div
      className="absolute flex flex-col items-center"
      style={{
        top: '8px',
        right: '8px',
        background: 'rgba(26, 28, 44, 0.85)',
        border: '2px solid #f7d87c',
        padding: '6px 10px',
        zIndex: 10,
      }}
    >
      {/* Main row: LevelBadge | XPBar | GoldCounter */}
      <div
        className="flex items-center"
        style={{ gap: '12px' }}
      >
        <LevelBadge />
        <XPBar />
        <GoldCounter />
      </div>

      {/* ShiftBadge + Streak below, centered */}
      <div className="flex items-center" style={{ gap: '8px' }}>
        <ShiftBadge />
        {streak > 0 && (
          <div
            style={{
              fontSize: '6px',
              fontFamily: pixelFont,
              color: '#e76f51',
              userSelect: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '3px',
              marginTop: '4px',
            }}
          >
            <span style={{ fontSize: '8px' }}>🔥</span>
            <span>{streak}d</span>
          </div>
        )}
      </div>

      {/* Gear icon for settings */}
      <div
        onClick={() => setShowSettings(true)}
        style={{
          position: 'absolute',
          bottom: '-20px',
          right: '0px',
          width: '14px',
          height: '14px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{
          width: '10px',
          height: '10px',
          border: '2px solid #888',
          borderRadius: '50%',
          position: 'relative',
        }}>
          <div style={{ position: 'absolute', top: '-3px', left: '3px', width: '2px', height: '3px', background: '#888' }} />
          <div style={{ position: 'absolute', bottom: '-3px', left: '3px', width: '2px', height: '3px', background: '#888' }} />
          <div style={{ position: 'absolute', left: '-3px', top: '3px', width: '3px', height: '2px', background: '#888' }} />
          <div style={{ position: 'absolute', right: '-3px', top: '3px', width: '3px', height: '2px', background: '#888' }} />
        </div>
      </div>
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </div>
  );
}
