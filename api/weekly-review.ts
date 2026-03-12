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

  const {
    totalTasksCompleted,
    totalTasksAssigned,
    totalGold,
    totalXp,
    streak,
    reputation,
    level,
  } = req.body ?? {};

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY not configured' });
  }

  const client = new Anthropic({ apiKey });

  const completionRate = totalTasksAssigned > 0
    ? Math.round((totalTasksCompleted / totalTasksAssigned) * 100)
    : 0;

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: `You are a pixel-art corporate manager delivering a Friday performance review in MeCorp, a gamified productivity app. You're stern but fair, speaking in a corporate tone with occasional pixel-game references.

Based on the employee's weekly stats, generate a review. Return ONLY a JSON object:
{
  "narrative": "3-5 short paragraphs of review text, separated by \\n\\n",
  "starRating": <1-5 integer based on performance>,
  "focusNextWeek": "one actionable sentence for improvement"
}

Rating guide:
- 5 stars: ≥90% completion, streak ≥5
- 4 stars: ≥70% completion
- 3 stars: ≥50% completion
- 2 stars: ≥30% completion
- 1 star: <30% completion

No other text besides the JSON.`,
      messages: [{
        role: 'user',
        content: `Weekly stats: ${totalTasksCompleted ?? 0}/${totalTasksAssigned ?? 0} tasks completed (${completionRate}%), ${totalGold ?? 0} gold earned, ${totalXp ?? 0} XP earned, streak: ${streak ?? 0}, reputation: ${reputation ?? 50}/100, level: ${level ?? 1}`,
      }],
    });

    const textBlock = message.content.find((b) => b.type === 'text');
    if (!textBlock || textBlock.type !== 'text') {
      return res.status(500).json({ error: 'No text response from AI' });
    }

    let raw = textBlock.text.trim();
    const fenceMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (fenceMatch) raw = fenceMatch[1].trim();

    const parsed = JSON.parse(raw);

    // Validate and clamp star rating
    const starRating = Math.max(1, Math.min(5, Math.round(parsed.starRating ?? 3)));

    return res.status(200).json({
      narrative: parsed.narrative || 'Performance noted. Keep working.',
      starRating,
      focusNextWeek: parsed.focusNextWeek || 'Maintain consistent output.',
    });
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : 'Unknown error';
    return res.status(500).json({ error: errMsg });
  }
}
