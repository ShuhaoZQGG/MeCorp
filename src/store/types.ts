export type TaskCategory = 'work' | 'health' | 'learning' | 'personal' | 'side-project' | 'marketing';
export type GoalCategory = 'work' | 'side-project' | 'learning' | 'marketing';
export type EstimatedDuration = '15min' | '30min' | '1hr' | '2hr';
export type PoolTaskStatus = 'queued' | 'assigned' | 'completed' | 'rolled';
export type GoalPriority = 'high' | 'medium' | 'low';
export type ApartmentTier = 'good' | 'neutral' | 'poor';

// Task Ingestion
export type TaskSource = 'goal' | 'github' | 'calendar' | 'agent' | 'manual-ingest';

export interface Task {
  id: string;
  title: string;
  category: TaskCategory;
  completed: boolean;
  completedAt?: number;
}

export type ProofType = 'note' | 'url' | 'screenshot';

export interface TaskProof {
  taskId: string;
  type: ProofType;
  content: string;
  submittedAt: number;
}

export interface PoolTask {
  id: string;
  title: string;
  category: TaskCategory;
  goalId: string;
  estimatedDuration: EstimatedDuration;
  status: PoolTaskStatus;
  createdAt: number;
  assignedDate?: string;
  completedAt?: number;
  rollCount?: number;
  source?: TaskSource;
  metadata?: Record<string, string>;
}

export interface DailyAssignment {
  taskId: string;
  order: number;
  completed: boolean;
  proof?: TaskProof;
  xpEarned: number;
  goldEarned: number;
}

export interface ShiftRecord {
  date: string;
  clockInTime: number;
  clockOutTime: number;
  tasksAssigned: number;
  tasksCompleted: number;
  goldEarned: number;
  xpEarned: number;
  streak: number;
  managerNote?: string;
}

export interface Goal {
  id: string;
  title: string;
  category: GoalCategory;
  description: string;
  timeframe: string;
  priority: GoalPriority;
  tasks: PoolTask[];
  createdAt: number;
  active: boolean;
}

export type NpcType = 'supportive' | 'concerned' | 'competitive' | 'manager';
export type ReputationTier = 'high' | 'normal' | 'low' | 'critical';

export interface WeeklyReview {
  id: string;
  weekStart: string;
  weekEnd: string;
  tasksCompleted: number;
  tasksAssigned: number;
  goldEarned: number;
  xpEarned: number;
  starRating: number;
  narrative: string;
  focusNextWeek: string;
  createdAt: number;
}

// Shop
export type ItemCategory = 'office' | 'apartment' | 'character';
export type ItemSlot =
  | 'desk-lamp' | 'wall-art' | 'monitor-upgrade' | 'bookshelf-item' | 'plant-upgrade'
  | 'couch' | 'tv' | 'kitchen-upgrade' | 'pet-bed' | 'balcony-decor'
  | 'hat' | 'shirt' | 'accessory';

export interface UnlockCondition {
  type: 'none' | 'streak' | 'reputation' | 'level';
  value?: number;
}

export interface ShopItem {
  id: string;
  name: string;
  category: ItemCategory;
  slot: ItemSlot;
  costGold: number;
  requiredLevel: number;
  description: string;
  unlockCondition: UnlockCondition;
}

export interface PurchasedItem {
  id: string;
  itemId: string;
  slot: ItemSlot;
  purchasedAt: number;
  equipped: boolean;
}

export interface ApiKeyInfo {
  id: string;
  keyPrefix: string;
  label: string;
  createdAt: number;
  revokedAt: number | null;
  lastUsedAt: number | null;
}

// News
export interface NewsItem {
  id: string;
  headline: string;
  body: string;
  date: string;
}

// Achievements
export type AchievementCategory = 'shift' | 'streak' | 'level' | 'gold' | 'tasks' | 'special';

export interface AchievementContext {
  level: number;
  streak: number;
  totalGoldEarned: number;
  totalTasksCompleted: number;
  totalShifts: number;
  categoryTaskCounts: Partial<Record<TaskCategory, number>>;
}

export interface AchievementDef {
  id: string;
  title: string;
  description: string;
  category: AchievementCategory;
  icon: string;
  condition: (ctx: AchievementContext) => boolean;
}

export interface UnlockedAchievement {
  achievementId: string;
  unlockedAt: number;
}
