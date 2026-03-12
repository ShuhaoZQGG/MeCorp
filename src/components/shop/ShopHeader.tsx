import { useGameStore } from '../../store/gameStore';

export default function ShopHeader() {
  const gold = useGameStore((s) => s.gold);
  const setScreen = useGameStore((s) => s.setScreen);
  const pixelFont = "'Press Start 2P', monospace";

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        borderBottom: '2px solid #f7d87c',
      }}
    >
      <div
        onClick={() => setScreen('office')}
        style={{
          fontSize: '8px',
          fontFamily: pixelFont,
          color: '#f7d87c',
          cursor: 'pointer',
          userSelect: 'none',
        }}
      >
        ← BACK
      </div>
      <div
        style={{
          fontSize: '10px',
          fontFamily: pixelFont,
          color: '#f7d87c',
          userSelect: 'none',
        }}
      >
        SHOP
      </div>
      <div
        style={{
          fontSize: '8px',
          fontFamily: pixelFont,
          color: '#f7d87c',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
        }}
      >
        <span style={{ color: '#ffd700' }}>●</span>
        {gold}G
      </div>
    </div>
  );
}
