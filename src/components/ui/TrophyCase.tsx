import { ACHIEVEMENT_CATALOG } from '../../lib/achievement-catalog';
import { useAchievementStore } from '../../store/achievementStore';

const PIXEL_FONT = "'Press Start 2P', monospace";

interface Props {
  onClose: () => void;
}

export default function TrophyCase({ onClose }: Props) {
  const unlockedIds = useAchievementStore((s) => s.unlockedIds);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(0,0,0,0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 55,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#1a1c2c',
          border: '3px solid #f7d87c',
          padding: '12px',
          width: '320px',
          maxHeight: '80%',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span
            style={{
              fontSize: '8px',
              fontFamily: PIXEL_FONT,
              color: '#f7d87c',
            }}
          >
            TROPHY CASE
          </span>
          <span
            onClick={onClose}
            style={{
              fontSize: '8px',
              fontFamily: PIXEL_FONT,
              color: '#e76f51',
              cursor: 'pointer',
            }}
          >
            X
          </span>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '6px',
          }}
        >
          {ACHIEVEMENT_CATALOG.map((def) => {
            const unlocked = unlockedIds.has(def.id);
            return (
              <div
                key={def.id}
                style={{
                  background: unlocked ? '#2a2d4a' : '#1a1a1a',
                  border: `2px solid ${unlocked ? '#f7d87c' : '#333'}`,
                  padding: '6px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '3px',
                  opacity: unlocked ? 1 : 0.4,
                }}
              >
                <div style={{ fontSize: '14px' }}>
                  {unlocked ? def.icon : '❓'}
                </div>
                <div
                  style={{
                    fontSize: '4px',
                    fontFamily: PIXEL_FONT,
                    color: unlocked ? '#f5e6c8' : '#555',
                    textAlign: 'center',
                  }}
                >
                  {unlocked ? def.title : '???'}
                </div>
                {unlocked && (
                  <div
                    style={{
                      fontSize: '3px',
                      fontFamily: PIXEL_FONT,
                      color: '#888',
                      textAlign: 'center',
                    }}
                  >
                    {def.description}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
