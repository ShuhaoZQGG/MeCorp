-- Purchased items
CREATE TABLE purchased_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  item_id TEXT NOT NULL,
  slot TEXT NOT NULL,
  purchased_at BIGINT NOT NULL,
  equipped BOOLEAN NOT NULL DEFAULT true,
  UNIQUE (user_id, item_id)
);
ALTER TABLE purchased_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "pi_select" ON purchased_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "pi_insert" ON purchased_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "pi_update" ON purchased_items FOR UPDATE USING (auth.uid() = user_id);
CREATE INDEX idx_purchased_items_user ON purchased_items (user_id);

-- API keys for task ingestion
CREATE TABLE api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  key_hash TEXT NOT NULL,
  key_prefix TEXT NOT NULL,
  label TEXT NOT NULL DEFAULT 'default',
  created_at BIGINT NOT NULL,
  revoked_at BIGINT,
  last_used_at BIGINT
);
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ak_select" ON api_keys FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "ak_insert" ON api_keys FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "ak_update" ON api_keys FOR UPDATE USING (auth.uid() = user_id);
CREATE INDEX idx_api_keys_hash ON api_keys (key_hash) WHERE revoked_at IS NULL;

-- Achievements
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  achievement_id TEXT NOT NULL,
  unlocked_at BIGINT NOT NULL,
  UNIQUE(user_id, achievement_id)
);
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ach_select" ON achievements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "ach_insert" ON achievements FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE INDEX idx_achievements_user ON achievements (user_id);

-- Task source tracking + nullable goal_id for ingested tasks
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS source TEXT NOT NULL DEFAULT 'goal';
ALTER TABLE tasks ALTER COLUMN goal_id DROP NOT NULL;
