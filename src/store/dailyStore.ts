import { create } from 'zustand';
import type { DailyAssignment, ShiftRecord, TaskProof, WeeklyReview } from './types';
import { useGoalStore } from './goalStore';
import { useGameStore } from './gameStore';
import { calculateTaskReward } from '../lib/rewards';
import { calculateReputationDelta, calculateReputationDecay } from '../lib/reputation';
import { syncManager } from '../lib/sync';
import { toDbShift, toDbReview } from '../lib/supabase-types';
import { getCurrentUserId } from '../lib/auth-context';
import { fetchWeeklyReview } from '../lib/api';
import { getMonday, getFriday, getWeekShifts } from '../lib/friday-check';
import { useAchievementStore } from './achievementStore';
import { buildAchievementContext } from '../lib/achievement-helpers';

const getLocalDate = () => new Date().toLocaleDateString('en-CA');

interface DailyState {
  currentDate: string;
  assignments: DailyAssignment[];
  managerMessage: string;
  shiftHistory: ShiftRecord[];
  showManagerBriefing: boolean;
  showClockOutSummary: boolean;
  showProofDialog: string | null;
  clockInTime: number | null;
  isAssigning: boolean;
  assignError: string | null;
  reviewHistory: WeeklyReview[];
  fridayReviewPending: boolean;
  fridayReviewData: WeeklyReview | null;
  isFetchingReview: boolean;
  _skipSync: boolean;

  setAssignments: (taskIds: string[], message: string) => void;
  swapTasks: (indexA: number, indexB: number) => void;
  deferTask: (taskId: string) => void;
  startShift: () => void;
  completeAssignment: (taskId: string, proof?: TaskProof) => void;
  openProofDialog: (taskId: string) => void;
  closeProofDialog: () => void;
  triggerClockOut: () => void;
  dismissClockOut: () => void;
  setIsAssigning: (val: boolean) => void;
  setAssignError: (err: string | null) => void;
  guardDayChange: () => void;
  triggerFridayReview: () => void;
  dismissFridayReview: () => void;
}

export const useDailyStore = create<DailyState>()(
  (set, get) => ({
    currentDate: getLocalDate(),
    assignments: [],
    managerMessage: '',
    shiftHistory: [],
    showManagerBriefing: false,
    showClockOutSummary: false,
    showProofDialog: null,
    clockInTime: null,
    isAssigning: false,
    assignError: null,
    reviewHistory: [],
    fridayReviewPending: false,
    fridayReviewData: null,
    isFetchingReview: false,
    _skipSync: false,

    setAssignments: (taskIds, message) => {
      const assignments: DailyAssignment[] = taskIds.map((taskId, i) => ({
        taskId,
        order: i,
        completed: false,
        xpEarned: 0,
        goldEarned: 0,
      }));
      // Mark pool tasks as assigned
      const goalStore = useGoalStore.getState();
      const today = getLocalDate();
      taskIds.forEach((id) => {
        goalStore.updatePoolTask(id, { status: 'assigned', assignedDate: today });
      });
      set({
        assignments,
        managerMessage: message,
        showManagerBriefing: true,
        isAssigning: false,
        assignError: null,
        currentDate: today,
      });
    },

    swapTasks: (indexA, indexB) =>
      set((state) => {
        const newAssignments = [...state.assignments];
        const temp = newAssignments[indexA];
        newAssignments[indexA] = newAssignments[indexB];
        newAssignments[indexB] = temp;
        // Update order
        return {
          assignments: newAssignments.map((a, i) => ({ ...a, order: i })),
        };
      }),

    deferTask: (taskId) => {
      const goalStore = useGoalStore.getState();
      goalStore.updatePoolTask(taskId, { status: 'queued', assignedDate: undefined });
      set((state) => ({
        assignments: state.assignments
          .filter((a) => a.taskId !== taskId)
          .map((a, i) => ({ ...a, order: i })),
      }));
    },

    startShift: () => set({ showManagerBriefing: false }),

    completeAssignment: (taskId, proof?) => {
      const goalStore = useGoalStore.getState();
      const gameStore = useGameStore.getState();
      const poolTask = goalStore.taskPool.find((t) => t.id === taskId);
      if (!poolTask) return;

      const { xp, gold } = calculateTaskReward(
        poolTask.estimatedDuration,
        gameStore.streak,
        !!proof
      );

      // Update pool task status
      goalStore.updatePoolTask(taskId, { status: 'completed', completedAt: Date.now() });
      // Add rewards
      gameStore.addRewards(xp, gold);

      set((state) => ({
        assignments: state.assignments.map((a) =>
          a.taskId === taskId
            ? { ...a, completed: true, proof, xpEarned: xp, goldEarned: gold }
            : a
        ),
        showProofDialog: null,
      }));

      // Reputation bonus for proof submission
      if (proof) {
        gameStore.updateReputation(1);
      }

      // Check achievements after task completion
      setTimeout(() => {
        useAchievementStore.getState().checkAndUnlock(buildAchievementContext());
      }, 0);

      // Sync proof to Supabase
      const userId = getCurrentUserId();
      if (userId && proof && !get()._skipSync) {
        syncManager.enqueue({
          table: 'proofs',
          type: 'insert',
          data: {
            id: crypto.randomUUID(),
            task_id: taskId,
            user_id: userId,
            type: proof.type,
            content: proof.content,
            submitted_at: proof.submittedAt,
          },
        });
      }
    },

    openProofDialog: (taskId) => set({ showProofDialog: taskId }),
    closeProofDialog: () => set({ showProofDialog: null }),

    triggerClockOut: () => {
      const state = get();
      const goalStore = useGoalStore.getState();
      const gameStore = useGameStore.getState();

      // Roll incomplete tasks
      state.assignments.forEach((a) => {
        if (!a.completed) {
          const poolTask = goalStore.taskPool.find((t) => t.id === a.taskId);
          const newRollCount = ((poolTask?.rollCount) ?? 0) + 1;
          goalStore.updatePoolTask(a.taskId, { status: 'rolled' });
          useGoalStore.setState((s) => ({
            taskPool: s.taskPool.map((t) =>
              t.id === a.taskId ? { ...t, rollCount: newRollCount } : t
            ),
            goals: s.goals.map((g) => ({
              ...g,
              tasks: g.tasks.map((t) =>
                t.id === a.taskId ? { ...t, rollCount: newRollCount } : t
              ),
            })),
          }));
        }
      });

      const totalXp = state.assignments.reduce((s, a) => s + a.xpEarned, 0);
      const totalGold = state.assignments.reduce((s, a) => s + a.goldEarned, 0);
      const completed = state.assignments.filter((a) => a.completed).length;

      const record: ShiftRecord = {
        date: state.currentDate,
        clockInTime: state.clockInTime ?? Date.now(),
        clockOutTime: Date.now(),
        tasksAssigned: state.assignments.length,
        tasksCompleted: completed,
        goldEarned: totalGold,
        xpEarned: totalXp,
        streak: gameStore.streak,
      };

      // Update reputation based on shift performance
      const proofCount = state.assignments.filter((a) => a.completed && a.proof).length;
      const repDelta = calculateReputationDelta(record, proofCount);
      gameStore.updateReputation(repDelta);

      set((s) => ({
        shiftHistory: [record, ...s.shiftHistory],
        showClockOutSummary: true,
      }));

      // Check achievements after clock-out
      setTimeout(() => {
        useAchievementStore.getState().checkAndUnlock(buildAchievementContext());
      }, 0);

      // Sync shift record
      const userId = getCurrentUserId();
      if (userId && !get()._skipSync) {
        syncManager.enqueue({
          table: 'shifts',
          type: 'insert',
          data: {
            ...toDbShift(record, userId),
            id: crypto.randomUUID(),
          },
        });
      }
    },

    dismissClockOut: () => {
      const gameStore = useGameStore.getState();
      gameStore.clockOut();
      set({
        showClockOutSummary: false,
        assignments: [],
        managerMessage: '',
        clockInTime: null,
      });
      // Transition to apartment scene
      gameStore.setScreen('apartment');
    },

    setIsAssigning: (val) => set({ isAssigning: val }),
    setAssignError: (err) => set({ assignError: err }),

    guardDayChange: () => {
      const state = get();
      const today = getLocalDate();

      // Apply reputation decay for missed days
      const gameStore = useGameStore.getState();
      const decay = calculateReputationDecay(gameStore.lastShiftDate);
      if (decay !== 0) {
        gameStore.updateReputation(decay);
      }

      if (state.currentDate !== today && state.assignments.length > 0) {
        // Auto-roll incomplete tasks from previous day
        const goalStore = useGoalStore.getState();
        state.assignments.forEach((a) => {
          if (!a.completed) {
            const poolTask = goalStore.taskPool.find((t) => t.id === a.taskId);
            const newRollCount = ((poolTask?.rollCount) ?? 0) + 1;
            goalStore.updatePoolTask(a.taskId, { status: 'rolled' });
            useGoalStore.setState((s) => ({
              taskPool: s.taskPool.map((t) =>
                t.id === a.taskId ? { ...t, rollCount: newRollCount } : t
              ),
              goals: s.goals.map((g) => ({
                ...g,
                tasks: g.tasks.map((t) =>
                  t.id === a.taskId ? { ...t, rollCount: newRollCount } : t
                ),
              })),
            }));
          }
        });
        set({
          currentDate: today,
          assignments: [],
          managerMessage: '',
          clockInTime: null,
          showManagerBriefing: false,
          showClockOutSummary: false,
          showProofDialog: null,
        });
      }
    },

    triggerFridayReview: () => {
      const state = get();
      const gameStore = useGameStore.getState();
      const now = new Date();
      const weekStart = getMonday(now);
      const weekEnd = getFriday(now);
      const weekShifts = getWeekShifts(state.shiftHistory, weekStart, weekEnd);

      const totalCompleted = weekShifts.reduce((s, r) => s + r.tasksCompleted, 0);
      const totalAssigned = weekShifts.reduce((s, r) => s + r.tasksAssigned, 0);
      const totalGold = weekShifts.reduce((s, r) => s + r.goldEarned, 0);
      const totalXp = weekShifts.reduce((s, r) => s + r.xpEarned, 0);

      set({ isFetchingReview: true, fridayReviewPending: true });

      fetchWeeklyReview({
        totalTasksCompleted: totalCompleted,
        totalTasksAssigned: totalAssigned,
        totalGold,
        totalXp,
        streak: gameStore.streak,
        reputation: gameStore.reputation,
        level: gameStore.level,
      })
        .then((data: { narrative: string; starRating: number; focusNextWeek: string }) => {
          const review: WeeklyReview = {
            id: crypto.randomUUID(),
            weekStart,
            weekEnd,
            tasksCompleted: totalCompleted,
            tasksAssigned: totalAssigned,
            goldEarned: totalGold,
            xpEarned: totalXp,
            starRating: data.starRating,
            narrative: data.narrative,
            focusNextWeek: data.focusNextWeek,
            createdAt: Date.now(),
          };
          set({ fridayReviewData: review, isFetchingReview: false });
        })
        .catch(() => {
          // Generate a basic review on failure
          const completionRate = totalAssigned > 0 ? totalCompleted / totalAssigned : 0;
          const starRating = completionRate >= 0.9 ? 5 : completionRate >= 0.7 ? 4 : completionRate >= 0.5 ? 3 : completionRate >= 0.3 ? 2 : 1;
          const review: WeeklyReview = {
            id: crypto.randomUUID(),
            weekStart,
            weekEnd,
            tasksCompleted: totalCompleted,
            tasksAssigned: totalAssigned,
            goldEarned: totalGold,
            xpEarned: totalXp,
            starRating,
            narrative: 'Another week in the books. Keep pushing forward.',
            focusNextWeek: 'Maintain consistent daily output.',
            createdAt: Date.now(),
          };
          set({ fridayReviewData: review, isFetchingReview: false });
        });
    },

    dismissFridayReview: () => {
      const state = get();
      const review = state.fridayReviewData;
      if (review) {
        // Add to review history
        set((s) => ({
          reviewHistory: [review, ...s.reviewHistory],
          fridayReviewData: null,
          fridayReviewPending: false,
        }));

        // Sync review to Supabase
        const userId = getCurrentUserId();
        if (userId && !get()._skipSync) {
          syncManager.enqueue({
            table: 'reviews',
            type: 'insert',
            data: toDbReview(review, userId),
          });
        }
      } else {
        set({ fridayReviewData: null, fridayReviewPending: false });
      }
    },
  })
);
