import { useState, useEffect } from 'react';
import { useDailyStore } from '../../store/dailyStore';
import { useGoalStore } from '../../store/goalStore';
import { useGameStore } from '../../store/gameStore';

const STREAK_MILESTONES = [3, 7, 14, 30];

export default function ClockOutSummary() {
  const show = useDailyStore((s) => s.showClockOutSummary);
  const assignments = useDailyStore((s) => s.assignments);
  const dismissClockOut = useDailyStore((s) => s.dismissClockOut);
  const shiftHistory = useDailyStore((s) => s.shiftHistory);
  const taskPool = useGoalStore((s) => s.taskPool);
  const streak = useGameStore((s) => s.streak);

  const [animProgress, setAnimProgress] = useState(0);

  useEffect(() => {
    if (!show) { setAnimProgress(0); return; }
    const start = Date.now();
    const duration = 1500;
    const tick = () => {
      const elapsed = Date.now() - start;
      const p = Math.min(elapsed / duration, 1);
      setAnimProgress(p);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [show]);

  if (!show) return null;

  const latestRecord = shiftHistory[0];
  if (!latestRecord) return null;

  const completed = latestRecord.tasksCompleted;
  const assigned = latestRecord.tasksAssigned;
  const totalGold = latestRecord.goldEarned;
  const totalXp = latestRecord.xpEarned;
  const completionRate = assigned > 0 ? completed / assigned : 0;

  const incompleteAssignments = assignments.filter((a) => !a.completed);

  let performanceNote = 'Good work today!';
  if (completionRate >= 0.8) performanceNote = 'Solid shift! Keep this up.';
  else if (completionRate >= 0.5) performanceNote = 'Decent progress. Tomorrow will be better.';
  else if (completionRate > 0) performanceNote = "Tough day — tomorrow's lighter.";
  else if (assigned > 0) performanceNote = 'Rest up. Fresh start tomorrow.';

  const streakMilestone = STREAK_MILESTONES.includes(streak) ? streak : null;

  const animVal = (target: number) => Math.round(target * animProgress);
  const pixelFont = "'Press Start 2P', monospace";

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.75)',
        zIndex: 60,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        paddingBottom: '40px',
        animation: 'fade-in 300ms ease-out',
      }}
    >
      <div
        style={{
          width: '300px',
          background: '#1a1c2c',
          border: '4px solid #f7d87c',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          imageRendering: 'pixelated',
          animation: 'slide-up 400ms ease-out',
        }}
      >
        {/* Header */}
        <div
          style={{
            fontSize: '9px',
            fontFamily: pixelFont,
            color: '#f7d87c',
            textAlign: 'center',
            userSelect: 'none',
          }}
        >
          SHIFT COMPLETE
        </div>

        {/* Streak milestone celebration */}
        {streakMilestone && (
          <div
            style={{
              fontSize: '7px',
              fontFamily: pixelFont,
              color: '#f7d87c',
              textAlign: 'center',
              userSelect: 'none',
              animation: 'pop 500ms ease',
              textShadow: '0 0 8px rgba(247, 216, 124, 0.6)',
            }}
          >
            STREAK MILESTONE: {streakMilestone} DAYS!
          </div>
        )}

        {/* Stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '7px', fontFamily: pixelFont, color: '#f0f0f0', userSelect: 'none' }}>
              TASKS
            </span>
            <span
              style={{
                fontSize: '7px',
                fontFamily: pixelFont,
                color: '#38b764',
                userSelect: 'none',
                animation: animProgress >= 1 ? 'count-pulse 300ms ease' : 'none',
              }}
            >
              {animVal(completed)}/{assigned}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '7px', fontFamily: pixelFont, color: '#f0f0f0', userSelect: 'none' }}>
              GOLD
            </span>
            <span
              style={{
                fontSize: '7px',
                fontFamily: pixelFont,
                color: '#f7d87c',
                userSelect: 'none',
                animation: animProgress >= 1 ? 'count-pulse 300ms ease' : 'none',
              }}
            >
              +{animVal(totalGold)}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '7px', fontFamily: pixelFont, color: '#f0f0f0', userSelect: 'none' }}>
              XP
            </span>
            <span
              style={{
                fontSize: '7px',
                fontFamily: pixelFont,
                color: '#9b5de5',
                userSelect: 'none',
                animation: animProgress >= 1 ? 'count-pulse 300ms ease' : 'none',
              }}
            >
              +{animVal(totalXp)}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '7px', fontFamily: pixelFont, color: '#f0f0f0', userSelect: 'none' }}>
              STREAK
            </span>
            <span style={{ fontSize: '7px', fontFamily: pixelFont, color: '#e76f51', userSelect: 'none' }}>
              {streak} days
            </span>
          </div>
        </div>

        {/* Performance note */}
        <div
          style={{
            fontSize: '6px',
            fontFamily: pixelFont,
            color: '#f4a261',
            textAlign: 'center',
            lineHeight: 1.6,
            userSelect: 'none',
          }}
        >
          {performanceNote}
        </div>

        {/* Incomplete tasks rolling */}
        {incompleteAssignments.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
            <span style={{ fontSize: '6px', fontFamily: pixelFont, color: '#8b8b8b', userSelect: 'none' }}>
              Rolling to tomorrow:
            </span>
            {incompleteAssignments.map((a) => {
              const pt = taskPool.find((t) => t.id === a.taskId);
              if (!pt) return null;
              const needsAttention = (pt.rollCount ?? 0) >= 3;
              return (
                <div key={a.taskId} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ fontSize: '5px', color: '#8b8b8b', userSelect: 'none' }}>→</span>
                  <span
                    style={{
                      fontSize: '5px',
                      fontFamily: pixelFont,
                      color: needsAttention ? '#e76f51' : '#8b8b8b',
                      userSelect: 'none',
                      flex: 1,
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {pt.title}
                    {needsAttention && ' ⚠ NEEDS ATTENTION'}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Done button */}
        <button
          onClick={dismissClockOut}
          style={{
            fontSize: '8px',
            fontFamily: pixelFont,
            color: '#1a1c2c',
            background: '#f7d87c',
            border: '3px solid #c4a83c',
            padding: '8px 16px',
            cursor: 'pointer',
            alignSelf: 'center',
          }}
        >
          DONE
        </button>
      </div>
    </div>
  );
}
