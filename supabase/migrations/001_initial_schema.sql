-- =============================================================================
-- MeCorp Initial Schema Migration
-- =============================================================================
-- NOTE: The Supabase Storage bucket named "proofs" must be created manually
-- via the Supabase dashboard (Storage > New Bucket > "proofs", public: true)
-- or via the Supabase CLI: supabase storage create-bucket proofs --public
-- =============================================================================

-- ---------------------------------------------------------------------------
-- GOALS
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS goals (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  title       TEXT        NOT NULL,
  category    TEXT        NOT NULL,
  description TEXT        NOT NULL DEFAULT '',
  timeframe   TEXT        NOT NULL DEFAULT '',
  priority    TEXT        NOT NULL DEFAULT 'medium',
  active      BOOLEAN     NOT NULL DEFAULT true,
  created_at  BIGINT      NOT NULL
);

ALTER TABLE goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "goals_select" ON goals
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "goals_insert" ON goals
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "goals_update" ON goals
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "goals_delete" ON goals
  FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_goals_user_active
  ON goals (user_id, active);

-- ---------------------------------------------------------------------------
-- TASKS
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tasks (
  id                 UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id            UUID    NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  goal_id            UUID    NOT NULL REFERENCES goals (id) ON DELETE CASCADE,
  title              TEXT    NOT NULL,
  category           TEXT    NOT NULL,
  estimated_duration TEXT    NOT NULL DEFAULT '30min',
  status             TEXT    NOT NULL DEFAULT 'queued',
  assigned_date      TEXT,
  completed_at       BIGINT,
  roll_count         INT     NOT NULL DEFAULT 0,
  created_at         BIGINT  NOT NULL
);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tasks_select" ON tasks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "tasks_insert" ON tasks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "tasks_update" ON tasks
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "tasks_delete" ON tasks
  FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_tasks_user_status
  ON tasks (user_id, status);

-- ---------------------------------------------------------------------------
-- PROOFS
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS proofs (
  id           UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id      UUID    NOT NULL REFERENCES tasks (id) ON DELETE CASCADE,
  user_id      UUID    NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  type         TEXT    NOT NULL,
  content      TEXT    NOT NULL,
  submitted_at BIGINT  NOT NULL
);

ALTER TABLE proofs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "proofs_select" ON proofs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "proofs_insert" ON proofs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "proofs_update" ON proofs
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "proofs_delete" ON proofs
  FOR DELETE USING (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- SHIFTS
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS shifts (
  id               UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID    NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  date             TEXT    NOT NULL,
  clock_in_time    BIGINT  NOT NULL,
  clock_out_time   BIGINT  NOT NULL,
  tasks_assigned   INT     NOT NULL,
  tasks_completed  INT     NOT NULL,
  gold_earned      INT     NOT NULL DEFAULT 0,
  xp_earned        INT     NOT NULL DEFAULT 0,
  streak           INT     NOT NULL DEFAULT 0,
  manager_note     TEXT
);

ALTER TABLE shifts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "shifts_select" ON shifts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "shifts_insert" ON shifts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "shifts_update" ON shifts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "shifts_delete" ON shifts
  FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_shifts_user_date
  ON shifts (user_id, date);

-- ---------------------------------------------------------------------------
-- PLAYER STATE
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS player_state (
  user_id               UUID     PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  xp                    INT      NOT NULL DEFAULT 0,
  xp_to_next_level      INT      NOT NULL DEFAULT 100,
  gold                  INT      NOT NULL DEFAULT 0,
  level                 INT      NOT NULL DEFAULT 1,
  streak                INT      NOT NULL DEFAULT 0,
  last_shift_date       TEXT,
  current_streak_start  TEXT,
  shift_active          BOOLEAN  NOT NULL DEFAULT false,
  updated_at            BIGINT
);

ALTER TABLE player_state ENABLE ROW LEVEL SECURITY;

CREATE POLICY "player_state_select" ON player_state
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "player_state_insert" ON player_state
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "player_state_update" ON player_state
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "player_state_delete" ON player_state
  FOR DELETE USING (auth.uid() = user_id);
