# MVP Plan — Step 5: Persistence & Apartment Scene

## Objective
Migrate from local-only state to persistent backend storage via Supabase, and build the apartment scene — the reward space players enter after clocking out. This step makes PixelCorp survive across sessions and devices, and introduces the first visual consequence system (apartment reflects performance).

## Dependencies
- **Step 4:** Complete daily loop (clock-in, tasks, proofs, clock-out, shift history)
- **External:** Supabase project (free tier)

## Tech Stack (additions)
- **Database:** Supabase (Auth + Postgres)
- **Auth:** Supabase Auth (email/password or magic link for MVP)
- **Storage:** Supabase Storage for screenshot proofs

## Deliverables

### 5.1 — Supabase Setup
- [ ] Create Supabase project
- [ ] Design Postgres schema:
  ```sql
  -- Users
  users (id, email, display_name, created_at)

  -- Goals
  goals (id, user_id, title, category, description, timeframe, active, created_at)

  -- Tasks
  tasks (id, user_id, goal_id, title, category, estimated_duration,
         status, assigned_date, completed_at, created_at)

  -- Proofs
  proofs (id, task_id, user_id, type, content, submitted_at)

  -- Shifts
  shifts (id, user_id, date, clock_in_time, clock_out_time,
          tasks_assigned, tasks_completed, gold_earned, xp_earned)

  -- Player State
  player_state (user_id, xp, gold, level, streak, current_streak_start,
                apartment_state, updated_at)
  ```
- [ ] Set up Row Level Security (RLS) policies — users can only access their own data
- [ ] Configure Supabase Auth (email/password for MVP)

### 5.2 — Auth Flow
- [ ] Login / signup screen styled in pixel-art game aesthetic
- [ ] "Employment Application" framing for signup (matches the ME Corp. fiction)
- [ ] Session persistence via Supabase auth tokens
- [ ] Protected routes — redirect to login if not authenticated

### 5.3 — State Migration (Zustand → Supabase)
- [ ] Replace localStorage persistence with Supabase sync
- [ ] Zustand remains the client-side state manager (fast reads)
- [ ] Write-through pattern: mutations update Zustand immediately, then sync to Supabase
- [ ] On app load: fetch from Supabase → hydrate Zustand store
- [ ] Handle offline gracefully: queue writes, sync when reconnected (basic)
- [ ] Migrate screenshot proofs to Supabase Storage (blob URLs)

### 5.4 — Apartment Pixel Scene
Build the second core environment — the after-work reward space:

- [ ] **Layout:** Cozy apartment room with bed, window, small kitchen area, bookshelf, rug
- [ ] **Color palette:** Home world colors — warm amber, grass green, terracotta, soft sky blue
- [ ] **Character:** Same sprite, but in casual/home pose (relaxed idle animation)
- [ ] **Window view:** Shows evening/night sky (static for now)
- [ ] Scene is entered automatically after clock-out transition (Step 4.4)
- [ ] Return to office via "Go to Work" / "Clock In" button from apartment

### 5.5 — Apartment Reflects Performance (Stardew-style)
The apartment's visual state changes based on recent performance:

| Performance | Apartment State |
|-------------|----------------|
| **Full shifts, high streak** | Bright lighting, plants thriving, warm glow, tidy room |
| **Partial shifts** | Normal lighting, some items dimmed, neutral state |
| **Missed shifts / low completion** | Dim lighting, wilted plant, cluttered desk, grey tones |

- [ ] Implement as CSS class variations on apartment components
- [ ] Performance score calculated from last 3-5 shifts
- [ ] Transitions between states are gradual (not jarring overnight changes)
- [ ] At least 3 visual tiers (good / neutral / poor)

### 5.6 — Streak Tracking (Enhanced)
- [ ] Streak persists in Supabase `player_state`
- [ ] Streak breaks on a missed day (no clock-in at all)
- [ ] Partial shifts maintain streak but don't extend the bonus multiplier
- [ ] Streak milestones (3, 7, 14, 30 days) could unlock future rewards (noted for Step 7)
- [ ] Streak count visible in the HUD and on the clock-out summary

## Acceptance Criteria
- User can sign up, log in, and see their data persist across browser sessions
- All game state (goals, tasks, proofs, shifts, XP, Gold) syncs to Supabase
- Zustand store hydrates from Supabase on app load
- After clocking out, player transitions to the apartment scene
- Apartment visual state reflects recent performance (at least 3 tiers)
- Apartment uses the warm "home" color palette, distinct from the office
- Screenshot proofs are stored in Supabase Storage
- Row Level Security ensures users only see their own data

## Key References from Vision Doc
- "Persistent state via Supabase: progress survives browser refreshes and sessions"
- "Apartment scene: a second environment you enter after clock-out. Its visual state reflects your recent performance — Stardew-style."
- "Home (After Work): Warm amber, grass green, terracotta, soft sky blue — Cozy, earned, Stardew-style comfort that rewards completing the shift"
- "The world shows consequences through atmosphere, not game-over screens."
- Tech stack: "Supabase — Auth + Postgres, fast to set up, generous free tier for a prototype"
- Reward withholding table: Complete shift → apartment upgrades available; No shift → apartment looks dim
