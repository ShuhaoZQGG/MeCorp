import { useState, useRef } from 'react';
import type { TaskCategory } from '../../store/types';

const CATEGORIES: TaskCategory[] = ['work', 'health', 'learning', 'personal', 'side-project', 'marketing'];

const CATEGORY_COLORS: Record<TaskCategory, string> = {
  work: '#457b9d',
  health: '#38b764',
  learning: '#9b5de5',
  personal: '#f7d87c',
  'side-project': '#e76f51',
  marketing: '#f4a261',
};

interface TaskInputProps {
  onAdd: (title: string, category: TaskCategory) => void;
}

export default function TaskInput({ onAdd }: TaskInputProps) {
  const [selected, setSelected] = useState<TaskCategory>('work');
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const trimmed = value.trim();
      if (!trimmed) return;
      onAdd(trimmed, selected);
      setValue('');
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        width: '100%',
      }}
    >
      {/* Category selector */}
      <div style={{ display: 'flex', flexDirection: 'row', gap: '4px' }}>
        {CATEGORIES.map((cat) => (
          <div
            key={cat}
            onClick={() => setSelected(cat)}
            title={cat}
            style={{
              width: '10px',
              height: '10px',
              background: CATEGORY_COLORS[cat],
              border: selected === cat ? '2px solid #ffffff' : '2px solid transparent',
              cursor: 'pointer',
              flexShrink: 0,
              imageRendering: 'pixelated',
            }}
          />
        ))}
      </div>

      {/* Text input */}
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="New task..."
        style={{
          width: '100%',
          background: '#f5e6c8',
          color: '#2d1f15',
          border: 'none',
          borderBottom: '1px solid #8b6914',
          outline: 'none',
          fontSize: '7px',
          fontFamily: "'Press Start 2P', monospace",
          lineHeight: 1,
          padding: '3px 0',
        }}
      />
    </div>
  );
}
