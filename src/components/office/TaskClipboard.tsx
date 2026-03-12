import { useGameStore } from '../../store/gameStore';
import { useDailyStore } from '../../store/dailyStore';
import { useGoalStore } from '../../store/goalStore';
import type { TaskCategory } from '../../store/types';
import TaskItem from './TaskItem';
import TaskInput from './TaskInput';
import AssignedTaskItem from './AssignedTaskItem';

const CATEGORIES: TaskCategory[] = ['work', 'health', 'learning', 'personal', 'side-project', 'marketing'];

const CATEGORY_COLORS: Record<TaskCategory, string> = {
  work: '#457b9d',
  health: '#38b764',
  learning: '#9b5de5',
  personal: '#f7d87c',
  'side-project': '#e76f51',
  marketing: '#f4a261',
};

const CATEGORY_LABELS: Record<TaskCategory, string> = {
  work: 'WORK',
  health: 'HEALTH',
  learning: 'LEARN',
  personal: 'SELF',
  'side-project': 'SIDE',
  marketing: 'MKTG',
};

export default function TaskClipboard() {
  const shiftActive = useGameStore((s) => s.shiftActive);
  const tasks = useGameStore((s) => s.tasks);
  const completeTask = useGameStore((s) => s.completeTask);
  const addTask = useGameStore((s) => s.addTask);

  const assignments = useDailyStore((s) => s.assignments);
  const openProofDialog = useDailyStore((s) => s.openProofDialog);
  const taskPool = useGoalStore((s) => s.taskPool);

  const incompleteTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);
  const hasAssignments = assignments.length > 0;

  const completedCount = assignments.filter((a) => a.completed).length;

  return (
    <div
      style={{
        position: 'absolute',
        left: '20px',
        top: '140px',
        width: '200px',
        maxHeight: hasAssignments ? '380px' : '300px',
        background: '#f5e6c8',
        border: '3px solid #8b6914',
        padding: '14px 8px 8px 8px',
        display: 'flex',
        flexDirection: 'column',
        gap: '0px',
        zIndex: 20,
        animation: shiftActive ? 'slide-in-left 400ms ease-out forwards' : 'none',
        transform: shiftActive ? undefined : 'translateX(-110%)',
        transition: shiftActive ? 'none' : 'transform 400ms ease-in',
        imageRendering: 'pixelated',
      }}
    >
      {/* Clipboard clip at top center */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '40px',
          height: '8px',
          background: '#5a3a10',
          borderRadius: '0 0 2px 2px',
        }}
      />

      {/* Title */}
      <div
        style={{
          fontSize: '7px',
          color: '#2d1f15',
          fontFamily: "'Press Start 2P', monospace",
          lineHeight: 1,
          marginBottom: '6px',
          userSelect: 'none',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <span>{hasAssignments ? "TODAY'S TASKS" : 'TASKS'}</span>
        {hasAssignments && (
          <span style={{ color: '#38b764' }}>
            {completedCount}/{assignments.length}
          </span>
        )}
      </div>

      {/* Task list area */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          maxHeight: hasAssignments ? '260px' : '200px',
          scrollbarWidth: 'thin',
          scrollbarColor: '#8b6914 #f5e6c8',
        }}
      >
        {/* Assigned pool tasks (if any) */}
        {hasAssignments && (
          <>
            {assignments.map((a) => {
              const pt = taskPool.find((t) => t.id === a.taskId);
              if (!pt) return null;
              return (
                <AssignedTaskItem
                  key={a.taskId}
                  assignment={a}
                  poolTask={pt}
                  onCheckboxClick={openProofDialog}
                />
              );
            })}

            {/* Divider between assigned and quick tasks */}
            <div
              style={{
                borderTop: '2px dashed rgba(139, 105, 20, 0.4)',
                margin: '6px 0',
              }}
            />
            <div
              style={{
                fontSize: '6px',
                color: '#8b6914',
                fontFamily: "'Press Start 2P', monospace",
                lineHeight: 1,
                marginBottom: '4px',
                userSelect: 'none',
              }}
            >
              QUICK TASKS
            </div>
          </>
        )}

        {/* Incomplete tasks grouped by category */}
        {CATEGORIES.map((cat) => {
          const catTasks = incompleteTasks.filter((t) => t.category === cat);
          if (catTasks.length === 0) return null;
          return (
            <div key={cat} style={{ marginBottom: '4px' }}>
              {/* Category header */}
              <div
                style={{
                  fontSize: '6px',
                  color: CATEGORY_COLORS[cat],
                  fontFamily: "'Press Start 2P', monospace",
                  lineHeight: 1,
                  marginBottom: '2px',
                  userSelect: 'none',
                  letterSpacing: '0.5px',
                }}
              >
                {CATEGORY_LABELS[cat]}
              </div>
              {catTasks.map((task) => (
                <TaskItem key={task.id} task={task} onComplete={completeTask} />
              ))}
            </div>
          );
        })}

        {/* Divider before completed tasks */}
        {completedTasks.length > 0 && (
          <div
            style={{
              borderTop: '1px solid rgba(139, 105, 20, 0.3)',
              margin: '4px 0',
            }}
          />
        )}

        {/* Completed tasks */}
        {completedTasks.map((task) => (
          <TaskItem key={task.id} task={task} onComplete={completeTask} />
        ))}
      </div>

      {/* Task input at bottom */}
      <div style={{ marginTop: '6px', borderTop: '1px solid #8b6914', paddingTop: '6px' }}>
        <TaskInput onAdd={addTask} />
      </div>
    </div>
  );
}
