import { useState } from 'react';
import type { DailyAssignment, PoolTask } from '../../store/types';

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

interface AssignedTaskItemProps {
  assignment: DailyAssignment;
  poolTask: PoolTask;
  onCheckboxClick: (taskId: string) => void;
}

export default function AssignedTaskItem({ assignment, poolTask, onCheckboxClick }: AssignedTaskItemProps) {
  const [animating, setAnimating] = useState(false);

  const handleClick = () => {
    if (assignment.completed) return;
    setAnimating(true);
    setTimeout(() => {
      onCheckboxClick(assignment.taskId);
      setAnimating(false);
    }, 200);
  };

  const categoryColor = CATEGORY_COLORS[poolTask.category] ?? '#ccc';
  const isRolled = (poolTask.rollCount ?? 0) > 0;
  const needsAttention = (poolTask.rollCount ?? 0) >= 3;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        padding: '3px 0',
        animation: animating ? 'task-check 300ms ease-in-out forwards' : 'none',
      }}
    >
      {/* Checkbox */}
      <div
        onClick={handleClick}
        style={{
          width: '10px',
          height: '10px',
          border: `2px solid ${needsAttention ? '#e76f51' : '#8b6914'}`,
          flexShrink: 0,
          cursor: assignment.completed ? 'default' : 'pointer',
          background: assignment.completed ? '#38b764' : 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          imageRendering: 'pixelated',
        }}
      >
        {assignment.completed && (
          <div style={{ width: '4px', height: '4px', background: '#1a1c2c', flexShrink: 0 }} />
        )}
      </div>

      {/* Category dot */}
      <div
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: categoryColor,
          flexShrink: 0,
        }}
      />

      {/* Title */}
      <span
        style={{
          fontSize: '6px',
          color: needsAttention ? '#e76f51' : '#2d1f15',
          fontFamily: "'Press Start 2P', monospace",
          lineHeight: 1,
          flex: 1,
          minWidth: 0,
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          textDecoration: assignment.completed ? 'line-through' : 'none',
          opacity: assignment.completed ? 0.5 : 1,
          userSelect: 'none',
        }}
      >
        {isRolled && !assignment.completed && '↻ '}
        {poolTask.title}
      </span>

      {/* Duration badge */}
      <span
        style={{
          fontSize: '5px',
          fontFamily: "'Press Start 2P', monospace",
          color: '#f5e6c8',
          background: categoryColor,
          padding: '1px 3px',
          flexShrink: 0,
          userSelect: 'none',
          opacity: assignment.completed ? 0.5 : 1,
        }}
      >
        {DURATION_LABELS[poolTask.estimatedDuration] ?? poolTask.estimatedDuration}
      </span>

      {/* Proof indicator */}
      {assignment.completed && assignment.proof && (
        <span
          style={{
            fontSize: '6px',
            flexShrink: 0,
            userSelect: 'none',
            opacity: 0.7,
          }}
        >
          ✓
        </span>
      )}
    </div>
  );
}
