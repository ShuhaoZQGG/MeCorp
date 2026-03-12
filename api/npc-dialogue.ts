import type { VercelRequest, VercelResponse } from '@vercel/node';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';

type AuthResult = { userId: string; error?: never } | { userId?: never; error: string };

async function verifyAuth(req: VercelRequest): Promise<AuthResult> {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return { error: 'Missing or malformed Authorization header' };
  }
  const token = authHeader.slice(7);
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
  if (!supabaseUrl || !supabaseServiceKey) {
    return { error: `Server config missing: ${!supabaseUrl ? 'SUPABASE_URL' : ''} ${!supabaseServiceKey ? 'SUPABASE_SERVICE_KEY' : ''}`.trim() };
  }
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) {
    return { error: `Token validation failed: ${error?.message ?? 'no user returned'}` };
  }
  return { userId: user.id };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const auth = await verifyAuth(req);
  if (auth.error) {
    return res.status(401).json({ error: auth.error });
  }

  const { reputation, streak, level, completionRate, daysActive } = req.body ?? {};
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY not configured' });
  }

  const client = new Anthropic({ apiKey });

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: `You are generating dialogue for 4 office NPCs in MeCorp, a pixel-art gamified productivity app. Each NPC has a distinct personality:

1. SUNNY (supportive) - Cheerful, encouraging, always sees the bright side
2. BLAIR (concerned) - Data-driven, analytical, worries about metrics
3. SPIKE (competitive) - Boastful rival, always comparing themselves to the player
4. THE BOSS (manager) - Corporate authority figure, cares about results

Generate 2-3 short dialogue lines per NPC based on the player's stats. Keep each line under 80 characters. Lines should feel like brief office water-cooler chat.

Return ONLY a JSON object with this structure:
{"supportive": ["line1", "line2"], "concerned": ["line1", "line2"], "competitive": ["line1", "line2"], "manager": ["line1", "line2"]}
No other text.`,
      messages: [{
        role: 'user',
        content: `Player stats: Reputation ${reputation ?? 50}/100, Streak ${streak ?? 0} days, Level ${level ?? 1}, Completion rate ${completionRate ?? 0}%, Active for ${daysActive ?? 0} days`,
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
    return res.status(200).json(parsed);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return res.status(500).json({ error: message });
  }
}
