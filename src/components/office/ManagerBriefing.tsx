import { useDailyStore } from '../../store/dailyStore';
import { useGoalStore } from '../../store/goalStore';

const CATEGORY_COLORS: Record<string, string> = {
  work: '#457b9d',
  health: '#38b764',
  learning: '#9b5de5',
  personal: '#f7d87c',
  'side-project': '#e76f51',
  marketing: '#f4a261',
};

const DURATION_LABELS: Record<string, string> = {
  '15min': '15m',
  '30min': '30m',
  '1hr': '1h',
  '2hr': '2h',
};

export default function ManagerBriefing() {
  const show = useDailyStore((s) => s.showManagerBriefing);
  const isAssigning = useDailyStore((s) => s.isAssigning);
  const assignError = useDailyStore((s) => s.assignError);
  const managerMessage = useDailyStore((s) => s.managerMessage);
  const assignments = useDailyStore((s) => s.assignments);
  const swapTasks = useDailyStore((s) => s.swapTasks);
  const deferTask = useDailyStore((s) => s.deferTask);
  const startShift = useDailyStore((s) => s.startShift);
  const taskPool = useGoalStore((s) => s.taskPool);

  if (!show && !isAssigning) return null;

  const getPoolTask = (taskId: string) => taskPool.find((t) => t.id === taskId);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.7)',
        zIndex: 60,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: 'fade-in 300ms ease-out',
      }}
    >
      <div
        style={{
          width: '320px',
          maxHeight: '420px',
          background: '#f5e6c8',
          border: '4px solid #8b6914',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          imageRendering: 'pixelated',
        }}
      >
        {/* Header */}
        <div
          style={{
            fontSize: '9px',
            fontFamily: "'Press Start 2P', monospace",
            color: '#2d1f15',
            textAlign: 'center',
            userSelect: 'none',
          }}
        >
          MORNING BRIEFING
        </div>

        {isAssigning && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px',
              padding: '24px 0',
            }}
          >
            <div
              style={{
                width: '16px',
                height: '16px',
                border: '3px solid #8b6914',
                borderTop: '3px solid transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
              }}
            />
            <span
              style={{
                fontSize: '6px',
                fontFamily: "'Press Start 2P', monospace",
                color: '#5a3a10',
                userSelect: 'none',
              }}
            >
              ASSIGNING TASKS...
            </span>
          </div>
        )}

        {assignError && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
              padding: '16px 0',
            }}
          >
            <span
              style={{
                fontSize: '6px',
                fontFamily: "'Press Start 2P', monospace",
                color: '#e76f51',
                textAlign: 'center',
                userSelect: 'none',
              }}
            >
              {assignError}
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('mecorp-retry-assign'))}
                style={{
                  fontSize: '6px',
                  fontFamily: "'Press Start 2P', monospace",
                  color: '#f5e6c8',
                  background: '#457b9d',
                  border: '2px solid #2d5a7b',
                  padding: '4px 8px',
                  cursor: 'pointer',
                }}
              >
                RETRY
              </button>
              <button
                onClick={() => {
                  useDailyStore.getState().setAssignError(null);
                  useDailyStore.getState().setIsAssigning(false);
                  startShift();
                }}
                style={{
                  fontSize: '6px',
                  fontFamily: "'Press Start 2P', monospace",
                  color: '#5a3a10',
                  background: 'transparent',
                  border: '2px solid #8b6914',
                  padding: '4px 8px',
                  cursor: 'pointer',
                }}
              >
                SKIP
              </button>
            </div>
          </div>
        )}

        {!isAssigning && !assignError && (
          <>
            {/* Manager message */}
            <div
              style={{
                fontSize: '6px',
                fontFamily: "'Press Start 2P', monospace",
                color: '#5a3a10',
                lineHeight: 1.6,
                padding: '6px',
                background: 'rgba(139, 105, 20, 0.1)',
                border: '1px solid rgba(139, 105, 20, 0.3)',
              }}
            >
              {managerMessage}
            </div>

            {/* Task list */}
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                maxHeight: '200px',
                scrollbarWidth: 'thin',
                scrollbarColor: '#8b6914 #f5e6c8',
              }}
            >
              {assignments.map((a, idx) => {
                const pt = getPoolTask(a.taskId);
                if (!pt) return null;
                return (
                  <div
                    key={a.taskId}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '4px',
                      background: 'rgba(139, 105, 20, 0.05)',
                    }}
                  >
                    {/* Order number */}
                    <span
                      style={{
                        fontSize: '6px',
                        fontFamily: "'Press Start 2P', monospace",
                        color: '#8b6914',
                        width: '14px',
                        flexShrink: 0,
                        userSelect: 'none',
                      }}
                    >
                      {idx + 1}.
                    </span>
                    {/* Category dot */}
                    <div
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: CATEGORY_COLORS[pt.category] ?? '#ccc',
                        flexShrink: 0,
                      }}
                    />
                    {/* Title */}
                    <span
                      style={{
                        fontSize: '6px',
                        fontFamily: "'Press Start 2P', monospace",
                        color: '#2d1f15',
                        flex: 1,
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis',
                        lineHeight: 1,
                        userSelect: 'none',
                      }}
                    >
                      {pt.title}
                    </span>
                    {/* Duration badge */}
                    <span
                      style={{
                        fontSize: '5px',
                        fontFamily: "'Press Start 2P', monospace",
                        color: '#f5e6c8',
                        background: CATEGORY_COLORS[pt.category] ?? '#8b6914',
                        padding: '2px 4px',
                        flexShrink: 0,
                        userSelect: 'none',
                      }}
                    >
                      {DURATION_LABELS[pt.estimatedDuration] ?? pt.estimatedDuration}
                    </span>
                    {/* Arrows */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', flexShrink: 0 }}>
                      <span
                        onClick={() => idx > 0 && swapTasks(idx, idx - 1)}
                        style={{
                          fontSize: '5px',
                          cursor: idx > 0 ? 'pointer' : 'default',
                          opacity: idx > 0 ? 1 : 0.3,
                          userSelect: 'none',
                          lineHeight: 1,
                        }}
                      >
                        ▲
                      </span>
                      <span
                        onClick={() => idx < assignments.length - 1 && swapTasks(idx, idx + 1)}
                        style={{
                          fontSize: '5px',
                          cursor: idx < assignments.length - 1 ? 'pointer' : 'default',
                          opacity: idx < assignments.length - 1 ? 1 : 0.3,
                          userSelect: 'none',
                          lineHeight: 1,
                        }}
                      >
                        ▼
                      </span>
                    </div>
                    {/* Defer */}
                    <span
                      onClick={() => deferTask(a.taskId)}
                      style={{
                        fontSize: '5px',
                        fontFamily: "'Press Start 2P', monospace",
                        color: '#e76f51',
                        cursor: 'pointer',
                        userSelect: 'none',
                        flexShrink: 0,
                      }}
                    >
                      DEFER
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Start button */}
            <button
              onClick={startShift}
              style={{
                fontSize: '8px',
                fontFamily: "'Press Start 2P', monospace",
                color: '#1a1c2c',
                background: '#38b764',
                border: '3px solid #2a8a4a',
                padding: '8px 16px',
                cursor: 'pointer',
                alignSelf: 'center',
              }}
            >
              START SHIFT
            </button>
          </>
        )}
      </div>
    </div>
  );
}
