import type {
  Goal,
  PoolTask,
  ShiftRecord,
  TaskCategory,
  GoalCategory,
  GoalPriority,
  EstimatedDuration,
  PoolTaskStatus,
  ProofType,
  ItemSlot,
  TaskSource,
  PurchasedItem,
  UnlockedAchievement,
} from '../store/types';

// =============================================================================
// DB Row Interfaces (snake_case, mirroring the Supabase schema)
// =============================================================================

export interface DbGoal {
  id: string;
  user_id: string;
  title: string;
  category: string;
  description: string;
  timeframe: string;
  priority: string;
  active: boolean;
  created_at: number;
}

export interface DbTask {
  id: string;
  user_id: string;
  goal_id: string | null;
  title: string;
  category: string;
  estimated_duration: string;
  status: string;
  assigned_date: string | null;
  completed_at: number | null;
  roll_count: number;
  created_at: number;
  source: string;
}

export interface DbProof {
  id: string;
  task_id: string;
  user_id: string;
  type: string;
  content: string;
  submitted_at: number;
}

export interface DbShift {
  id: string;
  user_id: string;
  date: string;
  clock_in_time: number;
  clock_out_time: number;
  tasks_assigned: number;
  tasks_completed: number;
  gold_earned: number;
  xp_earned: number;
  streak: number;
  manager_note: string | null;
}

export interface DbPlayerState {
  user_id: string;
  xp: number;
  xp_to_next_level: number;
  gold: number;
  level: number;
  streak: number;
  last_shift_date: string | null;
  current_streak_start: string | null;
  shift_active: boolean;
  reputation: number;
  updated_at: number | null;
}

// =============================================================================
// Converter: Goal
// =============================================================================

/**
 * Converts an app-level Goal to a DB row suitable for upsert.
 * The `tasks` array is intentionally omitted — tasks live in their own table.
 */
export function toDbGoal(goal: Goal, userId: string): DbGoal {
  return {
    id: goal.id,
    user_id: userId,
    title: goal.title,
    category: goal.category,
    description: goal.description,
    timeframe: goal.timeframe,
    priority: goal.priority,
    active: goal.active,
    created_at: goal.createdAt,
  };
}

/**
 * Converts a DB goals row back to an app-level Goal shape, without tasks.
 * Callers are responsible for appending the nested tasks array.
 */
export function fromDbGoal(row: DbGoal): Omit<Goal, 'tasks'> {
  return {
    id: row.id,
    title: row.title,
    category: row.category as GoalCategory,
    description: row.description,
    timeframe: row.timeframe,
    priority: row.priority as GoalPriority,
    active: row.active,
    createdAt: row.created_at,
  };
}

// =============================================================================
// Converter: PoolTask
// =============================================================================

/**
 * Converts an app-level PoolTask to a DB row suitable for upsert.
 */
export function toDbTask(task: PoolTask, userId: string): DbTask {
  return {
    id: task.id,
    user_id: userId,
    goal_id: task.goalId,
    title: task.title,
    category: task.category,
    estimated_duration: task.estimatedDuration,
    status: task.status,
    assigned_date: task.assignedDate ?? null,
    completed_at: task.completedAt ?? null,
    roll_count: task.rollCount ?? 0,
    created_at: task.createdAt,
    source: task.source ?? 'goal',
  };
}

/**
 * Converts a DB tasks row back to an app-level PoolTask.
 */
export function fromDbTask(row: DbTask): PoolTask {
  const task: PoolTask = {
    id: row.id,
    title: row.title,
    category: row.category as TaskCategory,
    goalId: row.goal_id ?? '',
    estimatedDuration: row.estimated_duration as EstimatedDuration,
    status: row.status as PoolTaskStatus,
    createdAt: row.created_at,
  };

  if (row.assigned_date !== null) {
    task.assignedDate = row.assigned_date;
  }
  if (row.completed_at !== null) {
    task.completedAt = row.completed_at;
  }
  if (row.roll_count !== 0) {
    task.rollCount = row.roll_count;
  }
  if (row.source && row.source !== 'goal') {
    task.source = row.source as TaskSource;
  }

  return task;
}

// =============================================================================
// Converter: ShiftRecord
// =============================================================================

/**
 * Converts an app-level ShiftRecord to a DB row shape for insert.
 * The `id` is omitted so callers can supply it (e.g., crypto.randomUUID())
 * or let Supabase generate it via gen_random_uuid().
 */
export function toDbShift(record: ShiftRecord, userId: string): Omit<DbShift, 'id'> {
  return {
    user_id: userId,
    date: record.date,
    clock_in_time: record.clockInTime,
    clock_out_time: record.clockOutTime,
    tasks_assigned: record.tasksAssigned,
    tasks_completed: record.tasksCompleted,
    gold_earned: record.goldEarned,
    xp_earned: record.xpEarned,
    streak: record.streak,
    manager_note: record.managerNote ?? null,
  };
}

/**
 * Converts a DB shifts row back to an app-level ShiftRecord.
 */
export function fromDbShift(row: DbShift): ShiftRecord {
  const record: ShiftRecord = {
    date: row.date,
    clockInTime: row.clock_in_time,
    clockOutTime: row.clock_out_time,
    tasksAssigned: row.tasks_assigned,
    tasksCompleted: row.tasks_completed,
    goldEarned: row.gold_earned,
    xpEarned: row.xp_earned,
    streak: row.streak,
  };

  if (row.manager_note !== null) {
    record.managerNote = row.manager_note;
  }

  return record;
}

// =============================================================================
// Converter: PlayerState
// =============================================================================

/**
 * Shape of the gameStore fields that map to the player_state table.
 * This is a subset of the full GameState — only persisted fields.
 */
export interface PlayerStateFields {
  xp: number;
  xpToNextLevel: number;
  gold: number;
  level: number;
  streak: number;
  lastShiftDate: string | null;
  currentStreakStart: string | null;
  shiftActive: boolean;
  reputation: number;
}

/**
 * Converts relevant gameStore fields to a DB player_state row for upsert.
 */
export function toDbPlayerState(
  state: PlayerStateFields,
  userId: string
): DbPlayerState {
  return {
    user_id: userId,
    xp: state.xp,
    xp_to_next_level: state.xpToNextLevel,
    gold: state.gold,
    level: state.level,
    streak: state.streak,
    last_shift_date: state.lastShiftDate,
    current_streak_start: state.currentStreakStart,
    shift_active: state.shiftActive,
    reputation: state.reputation,
    updated_at: Date.now(),
  };
}

/**
 * Converts a DB player_state row back to a partial gameStore state object.
 * The returned object can be spread directly into useGameStore.setState().
 */
export function fromDbPlayerState(row: DbPlayerState): PlayerStateFields {
  return {
    xp: row.xp,
    xpToNextLevel: row.xp_to_next_level,
    gold: row.gold,
    level: row.level,
    streak: row.streak,
    lastShiftDate: row.last_shift_date,
    currentStreakStart: row.current_streak_start,
    shiftActive: row.shift_active,
    reputation: row.reputation,
  };
}

// =============================================================================
// DB Row Interface + Converters: Review
// =============================================================================

export interface DbReview {
  id: string;
  user_id: string;
  week_start: string;
  week_end: string;
  tasks_completed: number;
  tasks_assigned: number;
  gold_earned: number;
  xp_earned: number;
  star_rating: number;
  narrative: string;
  focus_next_week: string;
  created_at: number;
}

export function toDbReview(review: import('../store/types').WeeklyReview, userId: string): DbReview {
  return {
    id: review.id,
    user_id: userId,
    week_start: review.weekStart,
    week_end: review.weekEnd,
    tasks_completed: review.tasksCompleted,
    tasks_assigned: review.tasksAssigned,
    gold_earned: review.goldEarned,
    xp_earned: review.xpEarned,
    star_rating: review.starRating,
    narrative: review.narrative,
    focus_next_week: review.focusNextWeek,
    created_at: review.createdAt,
  };
}

export function fromDbReview(row: DbReview): import('../store/types').WeeklyReview {
  return {
    id: row.id,
    weekStart: row.week_start,
    weekEnd: row.week_end,
    tasksCompleted: row.tasks_completed,
    tasksAssigned: row.tasks_assigned,
    goldEarned: row.gold_earned,
    xpEarned: row.xp_earned,
    starRating: row.star_rating,
    narrative: row.narrative,
    focusNextWeek: row.focus_next_week,
    createdAt: row.created_at,
  };
}

// Re-export ProofType for convenience in storage helpers
export type { ProofType };

// =============================================================================
// DB Row Interface + Converters: PurchasedItem
// =============================================================================

export interface DbPurchasedItem {
  id: string;
  user_id: string;
  item_id: string;
  slot: string;
  purchased_at: number;
  equipped: boolean;
}

export function toDbPurchasedItem(item: PurchasedItem, userId: string): DbPurchasedItem {
  return {
    id: item.id,
    user_id: userId,
    item_id: item.itemId,
    slot: item.slot,
    purchased_at: item.purchasedAt,
    equipped: item.equipped,
  };
}

export function fromDbPurchasedItem(row: DbPurchasedItem): PurchasedItem {
  return {
    id: row.id,
    itemId: row.item_id,
    slot: row.slot as ItemSlot,
    purchasedAt: row.purchased_at,
    equipped: row.equipped,
  };
}

// =============================================================================
// DB Row Interface + Converters: Achievement
// =============================================================================

export interface DbAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  unlocked_at: number;
}

export function toDbAchievement(achievement: UnlockedAchievement, userId: string): Omit<DbAchievement, 'id'> {
  return {
    user_id: userId,
    achievement_id: achievement.achievementId,
    unlocked_at: achievement.unlockedAt,
  };
}

export function fromDbAchievement(row: DbAchievement): UnlockedAchievement {
  return {
    achievementId: row.achievement_id,
    unlockedAt: row.unlocked_at,
  };
}
