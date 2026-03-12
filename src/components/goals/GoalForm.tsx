import { useState } from 'react';
import type { GoalCategory, GoalPriority } from '../../store/types';
import { useGoalStore } from '../../store/goalStore';
import { decomposeGoal } from '../../lib/api';

const GOAL_CATEGORIES: Array<{ value: GoalCategory; color: string; label: string }> = [
  { value: 'work', color: '#457b9d', label: 'WORK' },
  { value: 'side-project', color: '#e76f51', label: 'SIDE' },
  { value: 'learning', color: '#9b5de5', label: 'LEARN' },
  { value: 'marketing', color: '#f4a261', label: 'MKTG' },
];

const PRIORITIES: Array<{ value: GoalPriority; color: string; label: string }> = [
  { value: 'high', color: '#e76f51', label: 'H' },
  { value: 'medium', color: '#f4a261', label: 'M' },
  { value: 'low', color: '#457b9d', label: 'L' },
];

interface GoalFormProps {
  onClose: () => void;
  editGoal?: { id: string; title: string; category: GoalCategory; description: string; timeframe: string; priority: GoalPriority } | null;
}

export default function GoalForm({ onClose, editGoal }: GoalFormProps) {
  const addGoal = useGoalStore((s) => s.addGoal);
  const addTasksToPool = useGoalStore((s) => s.addTasksToPool);
  const updateGoal = useGoalStore((s) => s.updateGoal);

  const [title, setTitle] = useState(editGoal?.title ?? '');
  const [category, setCategory] = useState<GoalCategory>(editGoal?.category ?? 'work');
  const [description, setDescription] = useState(editGoal?.description ?? '');
  const [timeframe, setTimeframe] = useState(editGoal?.timeframe ?? '');
  const [priority, setPriority] = useState<GoalPriority>(editGoal?.priority ?? 'medium');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (withAI: boolean) => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    setError(null);

    let goalId: string;
    if (editGoal) {
      updateGoal(editGoal.id, { title: trimmedTitle, category, description, timeframe, priority });
      goalId = editGoal.id;
    } else {
      goalId = addGoal({ title: trimmedTitle, category, description, timeframe, priority });
    }

    if (withAI) {
      setLoading(true);
      try {
        const result = await decomposeGoal({
          title: trimmedTitle,
          category,
          description: description || undefined,
          timeframe: timeframe || undefined,
        });
        addTasksToPool(goalId, result.tasks);
        onClose();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Decomposition failed');
        setLoading(false);
      }
    } else {
      onClose();
    }
  };

  const inputStyle = {
    width: '100%',
    fontSize: '7px',
    fontFamily: "'Press Start 2P', monospace",
    color: '#f0f0f0',
    background: '#2a2c3c',
    border: '2px solid #4a5568',
    outline: 'none',
    padding: '6px',
  } as const;

  return (
    <div
      style={{
        background: '#1a1c2c',
        border: '2px solid #f7d87c',
        padding: '12px',
        animation: 'fade-in 300ms ease',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '10px',
        }}
      >
        <span
          style={{
            fontSize: '8px',
            fontFamily: "'Press Start 2P', monospace",
            color: '#f7d87c',
            userSelect: 'none',
          }}
        >
          {editGoal ? 'EDIT GOAL' : 'NEW GOAL'}
        </span>
        <span
          onClick={onClose}
          style={{
            fontSize: '8px',
            color: '#e76f51',
            cursor: 'pointer',
            userSelect: 'none',
          }}
        >
          ✕
        </span>
      </div>

      {/* Title */}
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Goal title..."
        autoFocus
        style={{ ...inputStyle, marginBottom: '8px' }}
      />

      {/* Category selector */}
      <div style={{ marginBottom: '8px' }}>
        <div
          style={{
            fontSize: '6px',
            fontFamily: "'Press Start 2P', monospace",
            color: '#8b8b8b',
            marginBottom: '4px',
            userSelect: 'none',
          }}
        >
          CATEGORY
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          {GOAL_CATEGORIES.map((cat) => (
            <div
              key={cat.value}
              onClick={() => setCategory(cat.value)}
              style={{
                width: '32px',
                height: '20px',
                background: category === cat.value ? cat.color : 'rgba(255,255,255,0.05)',
                border: `2px solid ${cat.color}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'background 150ms ease',
              }}
            >
              <span
                style={{
                  fontSize: '4px',
                  fontFamily: "'Press Start 2P', monospace",
                  color: category === cat.value ? '#1a1c2c' : cat.color,
                  userSelect: 'none',
                }}
              >
                {cat.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Description */}
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description (optional)..."
        rows={2}
        style={{
          ...inputStyle,
          marginBottom: '8px',
          resize: 'none',
          lineHeight: 1.4,
        }}
      />

      {/* Timeframe */}
      <input
        value={timeframe}
        onChange={(e) => setTimeframe(e.target.value)}
        placeholder="Timeframe (e.g. 2 weeks)..."
        style={{ ...inputStyle, marginBottom: '8px' }}
      />

      {/* Priority */}
      <div style={{ marginBottom: '10px' }}>
        <div
          style={{
            fontSize: '6px',
            fontFamily: "'Press Start 2P', monospace",
            color: '#8b8b8b',
            marginBottom: '4px',
            userSelect: 'none',
          }}
        >
          PRIORITY
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          {PRIORITIES.map((p) => (
            <div
              key={p.value}
              onClick={() => setPriority(p.value)}
              style={{
                width: '24px',
                height: '18px',
                background: priority === p.value ? p.color : 'rgba(255,255,255,0.05)',
                border: `2px solid ${p.color}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'background 150ms ease',
              }}
            >
              <span
                style={{
                  fontSize: '6px',
                  fontFamily: "'Press Start 2P', monospace",
                  color: priority === p.value ? '#1a1c2c' : p.color,
                  userSelect: 'none',
                }}
              >
                {p.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div
          style={{
            fontSize: '6px',
            fontFamily: "'Press Start 2P', monospace",
            color: '#e76f51',
            marginBottom: '8px',
            lineHeight: 1.4,
          }}
        >
          {error}
        </div>
      )}

      {/* Buttons */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <button
          onClick={() => handleSubmit(true)}
          disabled={loading || !title.trim()}
          style={{
            fontSize: '6px',
            fontFamily: "'Press Start 2P', monospace",
            color: loading ? '#8b8b8b' : '#1a1c2c',
            background: loading ? '#4a5568' : '#38b764',
            border: 'none',
            padding: '6px 10px',
            cursor: loading || !title.trim() ? 'default' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          {loading && (
            <span
              style={{
                display: 'inline-block',
                width: '8px',
                height: '8px',
                border: '2px solid #8b8b8b',
                borderTopColor: '#f0f0f0',
                borderRadius: '50%',
                animation: 'spin 600ms linear infinite',
              }}
            />
          )}
          {loading ? 'DECOMPOSING...' : editGoal ? 'SAVE & DECOMPOSE' : 'CREATE & DECOMPOSE'}
        </button>

        <button
          onClick={() => handleSubmit(false)}
          disabled={loading || !title.trim()}
          style={{
            fontSize: '6px',
            fontFamily: "'Press Start 2P', monospace",
            color: '#f0f0f0',
            background: 'transparent',
            border: '1px solid #4a5568',
            padding: '6px 10px',
            cursor: loading || !title.trim() ? 'default' : 'pointer',
          }}
        >
          {editGoal ? 'SAVE' : 'CREATE WITHOUT AI'}
        </button>
      </div>
    </div>
  );
}
