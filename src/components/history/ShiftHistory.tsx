import { useGameStore } from '../../store/gameStore';
import { useDailyStore } from '../../store/dailyStore';

export default function ShiftHistory() {
  const setScreen = useGameStore((s) => s.setScreen);
  const shiftHistory = useDailyStore((s) => s.shiftHistory);

  const pixelFont = "'Press Start 2P', monospace";

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: '#1a1c2c',
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column',
        animation: 'slide-in-right 300ms ease-out',
        imageRendering: 'pixelated',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '12px 16px',
          borderBottom: '2px solid #4a5568',
          gap: '12px',
          flexShrink: 0,
        }}
      >
        <span
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
        </span>
        <span
          style={{
            fontSize: '10px',
            fontFamily: pixelFont,
            color: '#f0f0f0',
            userSelect: 'none',
          }}
        >
          SHIFT HISTORY
        </span>
      </div>

      {/* Content */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '12px 16px',
          scrollbarWidth: 'thin',
          scrollbarColor: '#4a5568 #1a1c2c',
        }}
      >
        {shiftHistory.length === 0 ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '200px',
            }}
          >
            <span
              style={{
                fontSize: '8px',
                fontFamily: pixelFont,
                color: '#4a5568',
                userSelect: 'none',
              }}
            >
              NO SHIFTS YET
            </span>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {shiftHistory.map((record, idx) => {
              const completionPct = record.tasksAssigned > 0
                ? Math.round((record.tasksCompleted / record.tasksAssigned) * 100)
                : 0;
              return (
                <div
                  key={idx}
                  style={{
                    background: '#2a2d4a',
                    border: '2px solid #4a5568',
                    padding: '10px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                  }}
                >
                  {/* Date header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '7px', fontFamily: pixelFont, color: '#f7d87c', userSelect: 'none' }}>
                      {record.date}
                    </span>
                    <span style={{ fontSize: '6px', fontFamily: pixelFont, color: '#e76f51', userSelect: 'none' }}>
                      STREAK: {record.streak}
                    </span>
                  </div>

                  {/* Stats row */}
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '6px', fontFamily: pixelFont, color: '#38b764', userSelect: 'none' }}>
                      TASKS: {record.tasksCompleted}/{record.tasksAssigned} ({completionPct}%)
                    </span>
                    <span style={{ fontSize: '6px', fontFamily: pixelFont, color: '#f7d87c', userSelect: 'none' }}>
                      GOLD: +{record.goldEarned}
                    </span>
                    <span style={{ fontSize: '6px', fontFamily: pixelFont, color: '#9b5de5', userSelect: 'none' }}>
                      XP: +{record.xpEarned}
                    </span>
                  </div>

                  {record.managerNote && (
                    <span style={{ fontSize: '5px', fontFamily: pixelFont, color: '#8b8b8b', userSelect: 'none', lineHeight: 1.4 }}>
                      "{record.managerNote}"
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
