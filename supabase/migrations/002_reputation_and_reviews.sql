ALTER TABLE player_state ADD COLUMN reputation INT NOT NULL DEFAULT 50;

CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  week_start TEXT NOT NULL,
  week_end TEXT NOT NULL,
  tasks_completed INT NOT NULL DEFAULT 0,
  tasks_assigned INT NOT NULL DEFAULT 0,
  gold_earned INT NOT NULL DEFAULT 0,
  xp_earned INT NOT NULL DEFAULT 0,
  star_rating INT NOT NULL DEFAULT 3,
  narrative TEXT NOT NULL DEFAULT '',
  focus_next_week TEXT NOT NULL DEFAULT '',
  created_at BIGINT NOT NULL
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own reviews"
  ON reviews FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own reviews"
  ON reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_reviews_user_week ON reviews (user_id, week_start);
