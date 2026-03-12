import { create } from 'zustand';
import type { Goal, PoolTask, PoolTaskStatus, EstimatedDuration, TaskCategory, TaskSource } from './types';
import { syncManager } from '../lib/sync';
import { toDbGoal, toDbTask } from '../lib/supabase-types';
import { getCurrentUserId } from '../lib/auth-context';

interface GoalState {
  goals: Goal[];
  taskPool: PoolTask[];
  _skipSync: boolean;

  addGoal: (goal: Omit<Goal, 'id' | 'tasks' | 'createdAt' | 'active'>) => string;
  updateGoal: (id: string, updates: Partial<Pick<Goal, 'title' | 'category' | 'description' | 'timeframe' | 'priority'>>) => void;
  archiveGoal: (id: string) => void;
  deleteGoal: (id: string) => void;
  addTasksToPool: (goalId: string, tasks: Array<{ title: string; estimatedDuration: EstimatedDuration }>) => void;
  updatePoolTask: (taskId: string, updates: Partial<Pick<PoolTask, 'title' | 'estimatedDuration' | 'status' | 'assignedDate' | 'completedAt'>>) => void;
  removePoolTask: (taskId: string) => void;
  addManualPoolTask: (goalId: string, title: string, category: TaskCategory, estimatedDuration: EstimatedDuration) => void;
  addIngestedTasks: (tasks: Array<{ id: string; title: string; category: TaskCategory; estimatedDuration: EstimatedDuration; source: TaskSource }>) => void;
}

export const useGoalStore = create<GoalState>()(
  (set, get) => ({
    goals: [],
    taskPool: [],
    _skipSync: false,

    addGoal: (goalData) => {
      const id = crypto.randomUUID();
      const goal: Goal = {
        ...goalData,
        id,
        tasks: [],
        createdAt: Date.now(),
        active: true,
      };
      set((state) => ({
        goals: [...state.goals, goal],
      }));

      // Sync
      const userId = getCurrentUserId();
      if (userId && !get()._skipSync) {
        syncManager.enqueue({
          table: 'goals',
          type: 'insert',
          id,
          data: toDbGoal(goal, userId),
        });
      }
      return id;
    },

    updateGoal: (id, updates) => {
      set((state) => ({
        goals: state.goals.map((g) =>
          g.id === id ? { ...g, ...updates } : g
        ),
      }));

      const userId = getCurrentUserId();
      if (userId && !get()._skipSync) {
        const goal = get().goals.find((g) => g.id === id);
        if (goal) {
          syncManager.enqueue({
            table: 'goals',
            type: 'upsert',
            id,
            data: toDbGoal(goal, userId),
          });
        }
      }
    },

    archiveGoal: (id) => {
      set((state) => ({
        goals: state.goals.map((g) =>
          g.id === id ? { ...g, active: false } : g
        ),
      }));

      const userId = getCurrentUserId();
      if (userId && !get()._skipSync) {
        const goal = get().goals.find((g) => g.id === id);
        if (goal) {
          syncManager.enqueue({
            table: 'goals',
            type: 'upsert',
            id,
            data: toDbGoal(goal, userId),
          });
        }
      }
    },

    deleteGoal: (id) => {
      const tasksToDelete = get().taskPool.filter((t) => t.goalId === id);
      set((state) => ({
        goals: state.goals.filter((g) => g.id !== id),
        taskPool: state.taskPool.filter((t) => t.goalId !== id),
      }));

      const userId = getCurrentUserId();
      if (userId && !get()._skipSync) {
        // Delete tasks first (cascade should handle, but be explicit)
        tasksToDelete.forEach((t) => {
          syncManager.enqueue({
            table: 'tasks',
            type: 'delete',
            id: t.id,
            data: { id: t.id },
          });
        });
        syncManager.enqueue({
          table: 'goals',
          type: 'delete',
          id,
          data: { id },
        });
      }
    },

    addTasksToPool: (goalId, tasks) => {
      const goal = get().goals.find((g) => g.id === goalId);
      if (!goal) return;

      const poolTasks: PoolTask[] = tasks.map((t) => ({
        id: crypto.randomUUID(),
        title: t.title,
        category: goal.category,
        goalId,
        estimatedDuration: t.estimatedDuration,
        status: 'queued' as PoolTaskStatus,
        createdAt: Date.now(),
      }));

      set((state) => ({
        goals: state.goals.map((g) =>
          g.id === goalId ? { ...g, tasks: [...g.tasks, ...poolTasks] } : g
        ),
        taskPool: [...state.taskPool, ...poolTasks],
      }));

      // Sync
      const userId = getCurrentUserId();
      if (userId && !get()._skipSync) {
        poolTasks.forEach((pt) => {
          syncManager.enqueue({
            table: 'tasks',
            type: 'insert',
            id: pt.id,
            data: toDbTask(pt, userId),
          });
        });
      }
    },

    updatePoolTask: (taskId, updates) => {
      set((state) => ({
        taskPool: state.taskPool.map((t) =>
          t.id === taskId ? { ...t, ...updates } : t
        ),
        goals: state.goals.map((g) => ({
          ...g,
          tasks: g.tasks.map((t) =>
            t.id === taskId ? { ...t, ...updates } : t
          ),
        })),
      }));

      // Sync
      const userId = getCurrentUserId();
      if (userId && !get()._skipSync) {
        const task = get().taskPool.find((t) => t.id === taskId);
        if (task) {
          syncManager.enqueue({
            table: 'tasks',
            type: 'upsert',
            id: taskId,
            data: toDbTask(task, userId),
          });
        }
      }
    },

    removePoolTask: (taskId) => {
      set((state) => ({
        taskPool: state.taskPool.filter((t) => t.id !== taskId),
        goals: state.goals.map((g) => ({
          ...g,
          tasks: g.tasks.filter((t) => t.id !== taskId),
        })),
      }));

      const userId = getCurrentUserId();
      if (userId && !get()._skipSync) {
        syncManager.enqueue({
          table: 'tasks',
          type: 'delete',
          id: taskId,
          data: { id: taskId },
        });
      }
    },

    addManualPoolTask: (goalId, title, category, estimatedDuration) => {
      const poolTask: PoolTask = {
        id: crypto.randomUUID(),
        title,
        category,
        goalId,
        estimatedDuration,
        status: 'queued',
        createdAt: Date.now(),
      };

      set((state) => ({
        goals: state.goals.map((g) =>
          g.id === goalId ? { ...g, tasks: [...g.tasks, poolTask] } : g
        ),
        taskPool: [...state.taskPool, poolTask],
      }));

      const userId = getCurrentUserId();
      if (userId && !get()._skipSync) {
        syncManager.enqueue({
          table: 'tasks',
          type: 'insert',
          id: poolTask.id,
          data: toDbTask(poolTask, userId),
        });
      }
    },

    addIngestedTasks: (tasks) => {
      const poolTasks: PoolTask[] = tasks.map((t) => ({
        id: t.id,
        title: t.title,
        category: t.category,
        goalId: '',
        estimatedDuration: t.estimatedDuration,
        status: 'queued' as PoolTaskStatus,
        createdAt: Date.now(),
        source: t.source,
      }));

      set((state) => ({
        taskPool: [...state.taskPool, ...poolTasks],
      }));
    },
  })
);
