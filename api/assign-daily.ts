import type { VercelRequest, VercelResponse } from '@vercel/node';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';

async function verifyAuth(req: VercelRequest): Promise<string | null> {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) return null;

  const token = authHeader.slice(7);
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
  if (!supabaseUrl || !supabaseServiceKey) return null;

  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return null;
  return user.id;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const userId = await verifyAuth(req);
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { pool, categoryWeights, yesterdayCompletion, streak } = req.body ?? {};

  if (!pool || !Array.isArray(pool) || pool.length === 0) {
    return res.status(400).json({ error: 'pool is required and must be non-empty' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY not configured' });
  }

  const client = new Anthropic({ apiKey });

  const poolSummary = pool
    .map((t: { id: string; title: string; category: string; estimatedDuration: string; rollCount?: number }) =>
      `- [${t.id}] "${t.title}" (${t.category}, ${t.estimatedDuration}${t.rollCount ? `, rolled ${t.rollCount}x` : ''})`
    )
    .join('\n');

  const weightsStr = categoryWeights
    ? Object.entries(categoryWeights).map(([k, v]) => `${k}: ${v}`).join(', ')
    : 'equal';

  const yesterdayStr = yesterdayCompletion
    ? `Yesterday: ${yesterdayCompletion.completed}/${yesterdayCompletion.assigned} tasks completed`
    : 'No data from yesterday';

  const userPrompt = `Available task pool:\n${poolSummary}\n\nCategory weights: ${weightsStr}\n${yesterdayStr}\nCurrent streak: ${streak ?? 0} days`;

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: `You are a productivity manager for MeCorp, a gamified work simulator. Select 4-8 tasks from the pool for today's shift. Rules:
- Balance categories according to the provided weights
- Prioritize rolled tasks (rollCount > 0) — they've been delayed
- Aim for ~4 hours total work time (15min=0.25h, 30min=0.5h, 1hr=1h, 2hr=2h)
- If yesterday's completion was low (<50%), reduce total to ~3 hours
- Return ONLY a JSON object with "taskIds" (array of task ID strings from the pool) and "message" (a short motivational manager briefing, 1-3 sentences, in character as a pixel-art office manager)
No other text.`,
      messages: [{ role: 'user', content: userPrompt }],
    });

    const textBlock = message.content.find((b) => b.type === 'text');
    if (!textBlock || textBlock.type !== 'text') {
      return res.status(500).json({ error: 'No text response from AI' });
    }

    let raw = textBlock.text.trim();
    const fenceMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (fenceMatch) {
      raw = fenceMatch[1].trim();
    }

    const parsed = JSON.parse(raw) as { taskIds: string[]; message: string };

    if (!Array.isArray(parsed.taskIds)) {
      return res.status(500).json({ error: 'Invalid response format' });
    }

    // Validate IDs against input pool
    const validIds = new Set(pool.map((t: { id: string }) => t.id));
    const assignedTaskIds = parsed.taskIds.filter((id: string) => validIds.has(id));

    if (assignedTaskIds.length === 0) {
      return res.status(500).json({ error: 'AI returned no valid task IDs' });
    }

    return res.status(200).json({
      assignedTaskIds,
      managerMessage: parsed.message || 'Time to get to work!',
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return res.status(500).json({ error: message });
  }
}
