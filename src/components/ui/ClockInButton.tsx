import { useState, useEffect, useCallback } from 'react';
import { useGameStore } from '../../store/gameStore';
import { useDailyStore } from '../../store/dailyStore';
import { useGoalStore } from '../../store/goalStore';
import { assignDaily } from '../../lib/api';
import { shouldShowFridayReview } from '../../lib/friday-check';

export default function ClockInButton() {
  const shiftActive = useGameStore((s) => s.shiftActive);
  const currentScreen = useGameStore((s) => s.currentScreen);
  const clockIn = useGameStore((s) => s.clockIn);
  const setScreen = useGameStore((s) => s.setScreen);
  const streak = useGameStore((s) => s.streak);
  const [hovered, setHovered] = useState(false);

  const dailyStore = useDailyStore;
  const assignments = useDailyStore((s) => s.assignments);
  const currentDate = useDailyStore((s) => s.currentDate);
  const shiftHistory = useDailyStore((s) => s.shiftHistory);
  const reviewHistory = useDailyStore((s) => s.reviewHistory);

  const doAssign = useCallback(async () => {
    const goalState = useGoalStore.getState();
    const queuedTasks = goalState.taskPool.filter(
      (t) => t.status === 'queued' || t.status === 'rolled'
    );

    if (queuedTasks.length === 0) return;

    dailyStore.getState().setIsAssigning(true);
    dailyStore.getState().setAssignError(null);

    // Build yesterday's completion from shift history
    const lastRecord = shiftHistory[0];
    const yesterdayCompletion = lastRecord
      ? { assigned: lastRecord.tasksAssigned, completed: lastRecord.tasksCompleted }
      : undefined;

    try {
      const result = await assignDaily({
        pool: queuedTasks.map((t) => ({
          id: t.id,
          title: t.title,
          category: t.category,
          estimatedDuration: t.estimatedDuration,
          rollCount: t.rollCount,
        })),
        streak,
        yesterdayCompletion,
      });
      dailyStore.getState().setAssignments(result.assignedTaskIds, result.managerMessage);
    } catch (err) {
      dailyStore.getState().setIsAssigning(false);
      dailyStore.getState().setAssignError(
        err instanceof Error ? err.message : 'Failed to assign tasks'
      );
    }
  }, [streak, shiftHistory, dailyStore]);

  // Listen for retry events from ManagerBriefing
  useEffect(() => {
    const handler = () => doAssign();
    window.addEventListener('mecorp-retry-assign', handler);
    return () => window.removeEventListener('mecorp-retry-assign', handler);
  }, [doAssign]);

  // Listen for resume-clockin event after Friday review dismissal
  useEffect(() => {
    const handler = () => doAssign();
    window.addEventListener('mecorp-resume-clockin', handler);
    return () => window.removeEventListener('mecorp-resume-clockin', handler);
  }, [doAssign]);

  const handleClick = async () => {
    if (shiftActive) {
      // Clock out → trigger daily store clock out flow
      dailyStore.getState().triggerClockOut();
    } else {
      // If in apartment, transition to office first
      if (currentScreen === 'apartment') {
        setScreen('office');
      }

      // Clock in
      clockIn();

      // Guard day change
      dailyStore.getState().guardDayChange();

      const today = new Date().toLocaleDateString('en-CA');
      const hasExistingAssignments = currentDate === today && assignments.length > 0;

      if (hasExistingAssignments) {
        // Same-day re-clock-in: resume existing assignments, no new API call
        return;
      }

      // Set clock-in time
      useDailyStore.setState({ clockInTime: Date.now(), currentDate: today });

      // Friday review intercept
      if (shouldShowFridayReview(reviewHistory, shiftHistory)) {
        setScreen('meeting');
        dailyStore.getState().triggerFridayReview();
        return; // doAssign happens after review dismissal via mecorp-resume-clockin event
      }

      await doAssign();
    }
  };

  return (
    <button
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'absolute',
        bottom: '16px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: hovered ? '#2a2d4a' : '#1a1c2c',
        border: '3px solid #f7d87c',
        padding: '10px 24px',
        fontSize: '10px',
        color: '#f7d87c',
        fontFamily: "'Press Start 2P', monospace",
        cursor: 'pointer',
        zIndex: 10,
        lineHeight: 1,
        userSelect: 'none',
        whiteSpace: 'nowrap',
        transition: 'background-color 150ms ease-in-out',
        imageRendering: 'pixelated',
      }}
    >
      {shiftActive ? 'CLOCK OUT' : 'CLOCK IN'}
    </button>
  );
}
