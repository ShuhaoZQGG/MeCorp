import { useState } from 'react';
import type { Goal } from '../../store/types';
import { useGoalStore } from '../../store/goalStore';
import CategoryIcon from './CategoryIcon';
import TaskPoolView from './TaskPoolView';

const PRIORITY_COLORS: Record<string, string> = {
  high: '#e76f51',
  medium: '#f4a261',
  low: '#457b9d',
};

const PRIORITY_LABELS: Record<string, string> = {
  high: 'H',
  medium: 'M',
  low: 'L',
};

interface GoalCardProps {
  goal: Goal;
  onRedecompose: (goal: Goal) => void;
}

export default function GoalCard({ goal, onRedecompose }: GoalCardProps) {
  const archiveGoal = useGoalStore((s) => s.archiveGoal);
  const deleteGoal = useGoalStore((s) => s.deleteGoal);
  const [expanded, setExpanded] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const queuedCount = goal.tasks.filter((t) => t.status === 'queued').length;
  const totalCount = goal.tasks.length;
  const completedCount = goal.tasks.filter((t) => t.status === 'completed').length;
  const depthPercent = totalCount > 0 ? (queuedCount / totalCount) * 100 : 0;

  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.05)',
        border: '2px solid #4a5568',
        padding: '8px',
        animation: 'fade-in 300ms ease',
      }}
    >
      {/* Header row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          marginBottom: '6px',
          cursor: 'pointer',
        }}
        onClick={() => setExpanded(!expanded)}
      >
        <CategoryIcon category={goal.category} size={10} />

        <span
          style={{
            flex: 1,
            fontSize: '7px',
            fontFamily: "'Press Start 2P', monospace",
            color: '#f0f0f0',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            minWidth: 0,
          }}
        >
          {goal.title}
        </span>

        {/* Priority badge */}
        <span
          style={{
            fontSize: '6px',
            fontFamily: "'Press Start 2P', monospace",
            color: PRIORITY_COLORS[goal.priority],
            border: `1px solid ${PRIORITY_COLORS[goal.priority]}`,
            padding: '1px 3px',
            flexShrink: 0,
            userSelect: 'none',
          }}
        >
          {PRIORITY_LABELS[goal.priority]}
        </span>

        {/* Expand indicator */}
        <span
          style={{
            fontSize: '6px',
            color: '#8b8b8b',
            userSelect: 'none',
          }}
        >
          {expanded ? '▼' : '▶'}
        </span>
      </div>

      {/* Task pool depth bar */}
      <div
        style={{
          height: '4px',
          background: '#2a2c3c',
          marginBottom: expanded ? '6px' : '0',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${depthPercent}%`,
            background: '#38b764',
            transition: 'width 300ms ease',
          }}
        />
      </div>

      {/* Stats line */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          fontSize: '5px',
          fontFamily: "'Press Start 2P', monospace",
          color: '#8b8b8b',
          marginTop: '4px',
        }}
      >
        <span>{queuedCount} queued</span>
        <span>{completedCount}/{totalCount} done</span>
      </div>

      {/* Expanded section */}
      {expanded && (
        <div style={{ marginTop: '6px' }}>
          {/* Description */}
          {goal.description && (
            <div
              style={{
                fontSize: '6px',
                fontFamily: "'Press Start 2P', monospace",
                color: '#aaa',
                marginBottom: '6px',
                lineHeight: 1.4,
              }}
            >
              {goal.description}
            </div>
          )}

          {/* Action buttons */}
          <div
            style={{
              display: 'flex',
              gap: '6px',
              marginBottom: '6px',
              flexWrap: 'wrap',
            }}
          >
            <button
              onClick={(e) => { e.stopPropagation(); onRedecompose(goal); }}
              style={{
                fontSize: '5px',
                fontFamily: "'Press Start 2P', monospace",
                color: '#9b5de5',
                background: 'rgba(155,93,229,0.1)',
                border: '1px solid #9b5de5',
                padding: '2px 6px',
                cursor: 'pointer',
              }}
            >
              RE-DECOMPOSE
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); archiveGoal(goal.id); }}
              style={{
                fontSize: '5px',
                fontFamily: "'Press Start 2P', monospace",
                color: '#f4a261',
                background: 'rgba(244,162,97,0.1)',
                border: '1px solid #f4a261',
                padding: '2px 6px',
                cursor: 'pointer',
              }}
            >
              ARCHIVE
            </button>

            {!confirmDelete ? (
              <button
                onClick={(e) => { e.stopPropagation(); setConfirmDelete(true); }}
                style={{
                  fontSize: '5px',
                  fontFamily: "'Press Start 2P', monospace",
                  color: '#e76f51',
                  background: 'rgba(231,111,81,0.1)',
                  border: '1px solid #e76f51',
                  padding: '2px 6px',
                  cursor: 'pointer',
                }}
              >
                DELETE
              </button>
            ) : (
              <button
                onClick={(e) => { e.stopPropagation(); deleteGoal(goal.id); }}
                onBlur={() => setConfirmDelete(false)}
                style={{
                  fontSize: '5px',
                  fontFamily: "'Press Start 2P', monospace",
                  color: '#fff',
                  background: '#e76f51',
                  border: '1px solid #e76f51',
                  padding: '2px 6px',
                  cursor: 'pointer',
                }}
              >
                CONFIRM?
              </button>
            )}
          </div>

          {/* Task pool */}
          <TaskPoolView goalId={goal.id} tasks={goal.tasks} />
        </div>
      )}
    </div>
  );
}
