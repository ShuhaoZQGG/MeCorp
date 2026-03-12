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

  const { title, category, description, timeframe } = req.body ?? {};

  if (!title || !category) {
    return res.status(400).json({ error: 'title and category are required' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY not configured' });
  }

  const client = new Anthropic({ apiKey });

  const userPrompt = [
    `Goal: ${title}`,
    `Category: ${category}`,
    description ? `Description: ${description}` : '',
    timeframe ? `Timeframe: ${timeframe}` : '',
  ]
    .filter(Boolean)
    .join('\n');

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system:
        'You are a productivity task planner. Given a goal, decompose it into 5-15 specific, actionable daily tasks. Each task should be concrete and verifiable (not vague). Return ONLY a JSON array with objects containing "title" (string) and "estimatedDuration" (one of: "15min", "30min", "1hr", "2hr"). No other text.',
      messages: [{ role: 'user', content: userPrompt }],
    });

    const textBlock = message.content.find((b) => b.type === 'text');
    if (!textBlock || textBlock.type !== 'text') {
      return res.status(500).json({ error: 'No text response from AI' });
    }

    let raw = textBlock.text.trim();
    // Strip markdown code fences if present
    const fenceMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (fenceMatch) {
      raw = fenceMatch[1].trim();
    }

    const tasks = JSON.parse(raw) as Array<{ title: string; estimatedDuration: string }>;

    if (!Array.isArray(tasks)) {
      return res.status(500).json({ error: 'Invalid response format' });
    }

    const validDurations = ['15min', '30min', '1hr', '2hr'];
    const sanitized = tasks
      .filter((t) => t.title && typeof t.title === 'string')
      .map((t) => ({
        title: t.title,
        estimatedDuration: validDurations.includes(t.estimatedDuration)
          ? t.estimatedDuration
          : '30min',
      }));

    return res.status(200).json({ tasks: sanitized });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return res.status(500).json({ error: message });
  }
}
