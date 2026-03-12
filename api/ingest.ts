import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { createHash } from 'crypto';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) return res.status(401).json({ error: 'Missing API key' });

  const rawKey = authHeader.slice(7);
  if (!rawKey.startsWith('mc_')) return res.status(401).json({ error: 'Invalid API key format' });

  const keyHash = createHash('sha256').update(rawKey).digest('hex');

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
  if (!supabaseUrl || !supabaseServiceKey) return res.status(500).json({ error: 'Server misconfigured' });

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  // Look up the key
  const { data: keyRow, error: keyError } = await supabase
    .from('api_keys')
    .select('id, user_id')
    .eq('key_hash', keyHash)
    .is('revoked_at', null)
    .single();

  if (keyError || !keyRow) return res.status(401).json({ error: 'Invalid or revoked API key' });

  // Update last_used_at
  await supabase.from('api_keys').update({ last_used_at: Date.now() }).eq('id', keyRow.id);

  const { source = 'manual-ingest', tasks } = req.body ?? {};

  if (!tasks || !Array.isArray(tasks) || tasks.length === 0) {
    return res.status(400).json({ error: 'tasks array is required' });
  }

  if (tasks.length > 100) {
    return res.status(400).json({ error: 'Maximum 100 tasks per request' });
  }

  const validDurations = ['15min', '30min', '1hr', '2hr'];
  const validCategories = ['work', 'health', 'learning', 'personal', 'side-project', 'marketing'];

  const taskRows = tasks.map((t: { title: string; category?: string; estimatedDuration?: string }) => ({
    user_id: keyRow.user_id,
    goal_id: null,
    title: t.title?.slice(0, 200) || 'Untitled',
    category: validCategories.includes(t.category ?? '') ? t.category : 'work',
    estimated_duration: validDurations.includes(t.estimatedDuration ?? '') ? t.estimatedDuration : '30min',
    status: 'queued',
    assigned_date: null,
    completed_at: null,
    roll_count: 0,
    created_at: Date.now(),
    source,
  }));

  const { data, error } = await supabase.from('tasks').insert(taskRows).select('id');

  if (error) return res.status(500).json({ error: error.message });

  return res.status(200).json({ ingested: data?.length ?? 0, taskIds: data?.map((r: { id: string }) => r.id) });
}
