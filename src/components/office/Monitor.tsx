import { useGameStore } from '../../store/gameStore';
import { useShopStore } from '../../store/shopStore';

export default function Monitor() {
  const shiftActive = useGameStore((s) => s.shiftActive);
  const completedCount = useGameStore((s) => s.tasks.filter((t) => t.completed).length);
  const monitorUpgradeEquipped = useShopStore((s) => s.getEquippedForSlot('monitor-upgrade'));
  const monitorWidth = monitorUpgradeEquipped ? 180 : 140;

  // Momentum: more completed tasks = brighter glow
  const glowBase = shiftActive ? 0.3 : 0.1;
  const glowBoost = Math.min(completedCount * 0.03, 0.3);
  const glowIntensity = glowBase + glowBoost;
  const screenOpacity = shiftActive ? 1 : 0.3;

  return (
    <div
      className="absolute"
      style={{
        bottom: '136px',
        left: '50%',
        transform: 'translateX(-50%)',
      }}
    >
      {/* Monitor body */}
      <div
        style={{
          width: monitorWidth + 'px',
          height: '100px',
          background: '#2a2d4a',
          border: '4px solid #1a1c2c',
          borderRadius: '4px',
          position: 'relative',
          boxShadow: shiftActive
            ? `0 0 ${8 + completedCount * 2}px ${2 + completedCount}px rgba(56, 183, 100, ${glowIntensity})`
            : 'none',
          animation: shiftActive ? 'monitor-glow 3s ease-in-out infinite' : 'none',
          transition: 'box-shadow 500ms ease',
        }}
      >
        {/* Screen */}
        <div
          style={{
            position: 'absolute',
            inset: '4px',
            background: 'linear-gradient(180deg, #0a2a1a 0%, #0d3320 100%)',
            borderRadius: '2px',
            overflow: 'hidden',
            opacity: screenOpacity,
            transition: 'opacity 400ms ease',
          }}
        >
          {/* Terminal lines */}
          {[12, 24, 36, 48, 60].map((y, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                top: y + 'px',
                left: '6px',
                height: '4px',
                width: [60, 45, 70, 35, 50][i] + '%',
                background: i === 4 ? '#38b764' : 'rgba(56, 183, 100, 0.4)',
                borderRadius: '1px',
              }}
            />
          ))}
          {/* Blinking cursor */}
          <div
            style={{
              position: 'absolute',
              bottom: '12px',
              left: '6px',
              width: '6px',
              height: '8px',
              background: '#38b764',
              animation: shiftActive ? 'blink-cursor 1s steps(1) infinite' : 'none',
              opacity: shiftActive ? 1 : 0,
              transition: 'opacity 300ms ease',
            }}
          />
          {/* Screen glare */}
          <div
            style={{
              position: 'absolute',
              top: '4px',
              right: '4px',
              width: '12px',
              height: '12px',
              background: 'rgba(255,255,255,0.05)',
              borderRadius: '50%',
            }}
          />
        </div>
      </div>
      {/* Monitor stand */}
      <div
        style={{
          width: '20px',
          height: '16px',
          background: '#1a1c2c',
          margin: '0 auto',
        }}
      />
      {/* Monitor base */}
      <div
        style={{
          width: '48px',
          height: '6px',
          background: '#1a1c2c',
          margin: '0 auto',
          borderRadius: '0 0 2px 2px',
        }}
      />
    </div>
  );
}
