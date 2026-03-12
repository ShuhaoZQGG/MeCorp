import { useState } from 'react';
import type { Goal } from '../../store/types';
import { useGameStore } from '../../store/gameStore';
import { useGoalStore } from '../../store/goalStore';
import { decomposeGoal } from '../../lib/api';
import GoalCard from './GoalCard';
import GoalForm from './GoalForm';

export default function GoalScreen() {
  const setScreen = useGameStore((s) => s.setScreen);
  const goals = useGoalStore((s) => s.goals);
  const addTasksToPool = useGoalStore((s) => s.addTasksToPool);

  const [showForm, setShowForm] = useState(false);
  const [editGoal, setEditGoal] = useState<Goal | null>(null);
  const [showArchived, setShowArchived] = useState(false);

  const activeGoals = goals.filter((g) => g.active);
  const archivedGoals = goals.filter((g) => !g.active);
  const displayGoals = showArchived ? archivedGoals : activeGoals;

  const handleRedecompose = async (goal: Goal) => {
    try {
      const result = await decomposeGoal({
        title: goal.title,
        category: goal.category,
        description: goal.description || undefined,
        timeframe: goal.timeframe || undefined,
      });
      addTasksToPool(goal.id, result.tasks);
    } catch {
      // Error handled silently — user can retry or add manually
    }
  };

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
          justifyContent: 'space-between',
          padding: '12px 16px',
          borderBottom: '2px solid #4a5568',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span
            onClick={() => setScreen('office')}
            style={{
              fontSize: '8px',
              fontFamily: "'Press Start 2P', monospace",
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
              fontFamily: "'Press Start 2P', monospace",
              color: '#f0f0f0',
              userSelect: 'none',
            }}
          >
            GOAL BOARD
          </span>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {archivedGoals.length > 0 && (
            <span
              onClick={() => setShowArchived(!showArchived)}
              style={{
                fontSize: '6px',
                fontFamily: "'Press Start 2P', monospace",
                color: showArchived ? '#f4a261' : '#8b8b8b',
                cursor: 'pointer',
                userSelect: 'none',
              }}
            >
              {showArchived ? 'ACTIVE' : `ARCHIVE (${archivedGoals.length})`}
            </span>
          )}

          {!showForm && (
            <button
              onClick={() => { setEditGoal(null); setShowForm(true); }}
              style={{
                fontSize: '7px',
                fontFamily: "'Press Start 2P', monospace",
                color: '#1a1c2c',
                background: '#38b764',
                border: 'none',
                padding: '6px 12px',
                cursor: 'pointer',
              }}
            >
              + NEW GOAL
            </button>
          )}
        </div>
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
        {/* Goal form (inline) */}
        {showForm && (
          <div style={{ marginBottom: '12px' }}>
            <GoalForm
              onClose={() => { setShowForm(false); setEditGoal(null); }}
              editGoal={editGoal}
            />
          </div>
        )}

        {/* Goal cards */}
        {displayGoals.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {displayGoals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onRedecompose={handleRedecompose}
              />
            ))}
          </div>
        ) : (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '200px',
              gap: '12px',
            }}
          >
            <span
              style={{
                fontSize: '8px',
                fontFamily: "'Press Start 2P', monospace",
                color: '#4a5568',
                userSelect: 'none',
              }}
            >
              {showArchived ? 'NO ARCHIVED GOALS' : 'NO GOALS YET'}
            </span>
            {!showArchived && !showForm && (
              <span
                style={{
                  fontSize: '6px',
                  fontFamily: "'Press Start 2P', monospace",
                  color: '#4a5568',
                  userSelect: 'none',
                }}
              >
                Click + NEW GOAL to start
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
