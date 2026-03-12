import { useState } from 'react';
import type { Task } from '../../store/types';

const CATEGORY_COLORS: Record<string, string> = {
  work: '#457b9d',
  health: '#38b764',
  learning: '#9b5de5',
  personal: '#f7d87c',
  'side-project': '#e76f51',
  marketing: '#f4a261',
};

interface TaskItemProps {
  task: Task;
  onComplete: (id: string) => void;
}

export default function TaskItem({ task, onComplete }: TaskItemProps) {
  const [animating, setAnimating] = useState(false);

  const handleCheckboxClick = () => {
    if (task.completed) return;
    setAnimating(true);
    setTimeout(() => {
      onComplete(task.id);
      setAnimating(false);
    }, 300);
  };

  const categoryColor = CATEGORY_COLORS[task.category] ?? '#f0f0f0';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: '6px',
        padding: '3px 0',
        animation: animating ? 'task-check 300ms ease-in-out forwards' : 'none',
      }}
    >
      {/* Pixel checkbox */}
      <div
        onClick={handleCheckboxClick}
        style={{
          width: '10px',
          height: '10px',
          border: '2px solid #8b6914',
          flexShrink: 0,
          cursor: task.completed ? 'default' : 'pointer',
          background: task.completed ? '#38b764' : 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          imageRendering: 'pixelated',
        }}
      >
        {task.completed && (
          <div
            style={{
              width: '4px',
              height: '4px',
              background: '#1a1c2c',
              flexShrink: 0,
            }}
          />
        )}
      </div>

      {/* Category dot */}
      <div
        style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: categoryColor,
          flexShrink: 0,
        }}
      />

      {/* Title */}
      <span
        style={{
          fontSize: '7px',
          color: '#2d1f15',
          fontFamily: "'Press Start 2P', monospace",
          lineHeight: 1,
          flex: 1,
          minWidth: 0,
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          textDecoration: task.completed ? 'line-through' : 'none',
          opacity: task.completed ? 0.5 : 1,
          userSelect: 'none',
        }}
      >
        {task.title}
      </span>
    </div>
  );
}
