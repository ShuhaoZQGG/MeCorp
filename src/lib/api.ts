import type { GoalCategory, EstimatedDuration } from '../store/types';
import { supabase } from './supabase';

interface DecomposeRequest {
  title: string;
  category: GoalCategory;
  description?: string;
  timeframe?: string;
}

interface DecomposeResponse {
  tasks: Array<{ title: string; estimatedDuration: EstimatedDuration }>;
}

interface AssignDailyRequest {
  pool: Array<{ id: string; title: string; category: string; estimatedDuration: string; rollCount?: number }>;
  categoryWeights?: Record<string, number>;
  yesterdayCompletion?: { assigned: number; completed: number };
  streak: number;
}

interface AssignDailyResponse {
  assignedTaskIds: string[];
  managerMessage: string;
}

async function getAuthHeaders(): Promise<Record<string, string>> {
  const { data: { session } } = await supabase.auth.getSession();
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (session?.access_token) {
    headers['Authorization'] = `Bearer ${session.access_token}`;
  }
  return headers;
}

export async function assignDaily(params: AssignDailyRequest): Promise<AssignDailyResponse> {
  const headers = await getAuthHeaders();
  const res = await fetch('/api/assign-daily', {
    method: 'POST',
    headers,
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(data.error || `API error: ${res.status}`);
  }

  return res.json();
}

interface NpcDialogueRequest {
  reputation: number;
  streak: number;
  level: number;
  completionRate: number;
  daysActive: number;
}

type NpcDialogueResponse = Partial<Record<import('../store/types').NpcType, string[]>>;

export async function fetchNpcDialogue(params: NpcDialogueRequest): Promise<NpcDialogueResponse> {
  const headers = await getAuthHeaders();
  const res = await fetch('/api/npc-dialogue', {
    method: 'POST',
    headers,
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(data.error || `API error: ${res.status}`);
  }

  return res.json();
}

interface WeeklyReviewRequest {
  totalTasksCompleted: number;
  totalTasksAssigned: number;
  totalGold: number;
  totalXp: number;
  streak: number;
  reputation: number;
  level: number;
}

interface WeeklyReviewResponse {
  narrative: string;
  starRating: number;
  focusNextWeek: string;
}

export async function fetchWeeklyReview(params: WeeklyReviewRequest): Promise<WeeklyReviewResponse> {
  const headers = await getAuthHeaders();
  const res = await fetch('/api/weekly-review', {
    method: 'POST',
    headers,
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(data.error || `API error: ${res.status}`);
  }

  return res.json();
}

export async function decomposeGoal(goal: DecomposeRequest): Promise<DecomposeResponse> {
  const headers = await getAuthHeaders();
  const res = await fetch('/api/decompose', {
    method: 'POST',
    headers,
    body: JSON.stringify(goal),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(data.error || `API error: ${res.status}`);
  }

  return res.json();
}

export async function generateApiKey(label: string = 'default'): Promise<{ key: string; id: string; prefix: string }> {
  const headers = await getAuthHeaders();
  const res = await fetch('/api/generate-api-key', {
    method: 'POST',
    headers,
    body: JSON.stringify({ label }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(data.error || `API error: ${res.status}`);
  }
  return res.json();
}

export async function revokeApiKey(keyId: string): Promise<void> {
  const headers = await getAuthHeaders();
  const res = await fetch('/api/revoke-api-key', {
    method: 'POST',
    headers,
    body: JSON.stringify({ keyId }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(data.error || `API error: ${res.status}`);
  }
}

export async function listApiKeys(): Promise<import('../store/types').ApiKeyInfo[]> {
  const { supabase } = await import('./supabase');
  const { data, error } = await supabase
    .from('api_keys')
    .select('id, key_prefix, label, created_at, revoked_at, last_used_at')
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map((row: { id: string; key_prefix: string; label: string; created_at: number; revoked_at: number | null; last_used_at: number | null }) => ({
    id: row.id,
    keyPrefix: row.key_prefix,
    label: row.label,
    createdAt: row.created_at,
    revokedAt: row.revoked_at,
    lastUsedAt: row.last_used_at,
  }));
}

export async function fetchNews(): Promise<Array<{ headline: string; body: string }>> {
  const { useGameStore } = await import('../store/gameStore');
  const game = useGameStore.getState();
  const headers = await getAuthHeaders();
  const res = await fetch('/api/news', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      level: game.level,
      streak: game.streak,
      reputation: game.reputation,
      gold: game.gold,
    }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(data.error || `API error: ${res.status}`);
  }

  const json = await res.json();
  return json.items;
}
