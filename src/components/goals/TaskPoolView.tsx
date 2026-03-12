import { useState } from 'react';
import type { PoolTask, EstimatedDuration } from '../../store/types';
import { useGoalStore } from '../../store/goalStore';

const DURATION_LABELS: Record<EstimatedDuration, string> = {
  '15min': '15m',
  '30min': '30m',
  '1hr': '1h',
  '2hr': '2h',
};

const DURATION_COLORS: Record<EstimatedDuration, string> = {
  '15min': '#38b764',
  '30min': '#457b9d',
  '1hr': '#f4a261',
  '2hr': '#e76f51',
};

const STATUS_SECTIONS: Array<{ status: PoolTask['status']; label: string }> = [
  { status: 'queued', label: 'QUEUED' },
  { status: 'assigned', label: 'ASSIGNED' },
  { status: 'completed', label: 'DONE' },
];

interface TaskPoolViewProps {
  goalId: string;
  tasks: PoolTask[];
}

export default function TaskPoolView({ goalId, tasks }: TaskPoolViewProps) {
  const removePoolTask = useGoalStore((s) => s.removePoolTask);
  const updatePoolTask = useGoalStore((s) => s.updatePoolTask);
  const addManualPoolTask = useGoalStore((s) => s.addManualPoolTask);
  const goal = useGoalStore((s) => s.goals.find((g) => g.id === goalId));

  const [newTitle, setNewTitle] = useState('');
  const [newDuration, setNewDuration] = useState<EstimatedDuration>('30min');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const handleAdd = () => {
    const trimmed = newTitle.trim();
    if (!trimmed || !goal) return;
    addManualPoolTask(goalId, trimmed, goal.category, newDuration);
    setNewTitle('');
  };

  const startEdit = (task: PoolTask) => {
    setEditingId(task.id);
    setEditTitle(task.title);
  };

  const saveEdit = (taskId: string) => {
    const trimmed = editTitle.trim();
    if (trimmed) {
      updatePoolTask(taskId, { title: trimmed });
    }
    setEditingId(null);
  };

  return (
    <div style={{ marginTop: '6px' }}>
      {STATUS_SECTIONS.map(({ status, label }) => {
        const sectionTasks = tasks.filter((t) => t.status === status);
        if (sectionTasks.length === 0) return null;

        return (
          <div key={status} style={{ marginBottom: '6px' }}>
            <div
              style={{
                fontSize: '5px',
                fontFamily: "'Press Start 2P', monospace",
                color: '#8b8b8b',
                marginBottom: '3px',
                userSelect: 'none',
              }}
            >
              {label} ({sectionTasks.length})
            </div>

            {sectionTasks.map((task) => (
              <div
                key={task.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '2px 4px',
                  marginBottom: '2px',
                  background: 'rgba(255,255,255,0.05)',
                  borderLeft: `2px solid ${DURATION_COLORS[task.estimatedDuration]}`,
                }}
              >
                {/* Duration badge */}
                <span
                  style={{
                    fontSize: '5px',
                    fontFamily: "'Press Start 2P', monospace",
                    color: DURATION_COLORS[task.estimatedDuration],
                    flexShrink: 0,
                    width: '20px',
                    userSelect: 'none',
                  }}
                >
                  {DURATION_LABELS[task.estimatedDuration]}
                </span>

                {/* Title or edit input */}
                {editingId === task.id ? (
                  <input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveEdit(task.id);
                      if (e.key === 'Escape') setEditingId(null);
                    }}
                    onBlur={() => saveEdit(task.id)}
                    autoFocus
                    style={{
                      flex: 1,
                      fontSize: '6px',
                      fontFamily: "'Press Start 2P', monospace",
                      color: '#f0f0f0',
                      background: 'rgba(255,255,255,0.1)',
                      border: '1px solid #457b9d',
                      outline: 'none',
                      padding: '1px 3px',
                      minWidth: 0,
                    }}
                  />
                ) : (
                  <span
                    style={{
                      flex: 1,
                      fontSize: '6px',
                      fontFamily: "'Press Start 2P', monospace",
                      color: status === 'completed' ? '#666' : '#f0f0f0',
                      textDecoration: status === 'completed' ? 'line-through' : 'none',
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                      minWidth: 0,
                    }}
                  >
                    {task.title}
                  </span>
                )}

                {/* Actions for queued tasks */}
                {status === 'queued' && editingId !== task.id && (
                  <>
                    <span
                      onClick={() => startEdit(task)}
                      style={{
                        fontSize: '6px',
                        color: '#457b9d',
                        cursor: 'pointer',
                        userSelect: 'none',
                      }}
                    >
                      ✎
                    </span>
                    <span
                      onClick={() => removePoolTask(task.id)}
                      style={{
                        fontSize: '6px',
                        color: '#e76f51',
                        cursor: 'pointer',
                        userSelect: 'none',
                      }}
                    >
                      ✕
                    </span>
                  </>
                )}
              </div>
            ))}
          </div>
        );
      })}

      {/* Manual add task */}
      <div
        style={{
          display: 'flex',
          gap: '4px',
          marginTop: '6px',
          alignItems: 'center',
        }}
      >
        <select
          value={newDuration}
          onChange={(e) => setNewDuration(e.target.value as EstimatedDuration)}
          style={{
            fontSize: '5px',
            fontFamily: "'Press Start 2P', monospace",
            background: '#2a2c3c',
            color: '#f0f0f0',
            border: '1px solid #4a5568',
            padding: '2px',
            width: '40px',
          }}
        >
          <option value="15min">15m</option>
          <option value="30min">30m</option>
          <option value="1hr">1h</option>
          <option value="2hr">2h</option>
        </select>

        <input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleAdd();
          }}
          placeholder="Add task..."
          style={{
            flex: 1,
            fontSize: '6px',
            fontFamily: "'Press Start 2P', monospace",
            color: '#f0f0f0',
            background: 'transparent',
            border: 'none',
            borderBottom: '1px solid #4a5568',
            outline: 'none',
            padding: '2px 0',
            minWidth: 0,
          }}
        />

        <span
          onClick={handleAdd}
          style={{
            fontSize: '7px',
            color: '#38b764',
            cursor: 'pointer',
            userSelect: 'none',
          }}
        >
          +
        </span>
      </div>
    </div>
  );
}
