# MVP Plan — Step 4: Daily Loop — AI Assignment, Proofs & Clock-Out

## Objective
Complete the daily productivity loop: AI-powered morning task assignment, proof-of-completion submission, and an animated end-of-day summary. This makes PixelCorp a tool you'd actually use for a full week. This finishes the core of Phase 2.

## Dependencies
- **Step 3:** Goal system, task pool, Claude API integration, category balancing logic

## Tech Stack (additions)
- **AI:** Claude API for daily task selection/ordering (reuses the serverless proxy from Step 3)

## Deliverables

### 4.1 — AI Morning Task Assignment
- [ ] Create serverless API route (`/api/assign-daily`) that:
  - Receives: full task pool, category weights, yesterday's completion data
  - Calls Claude API to select and order today's tasks (typically 4-8 tasks)
  - Balances across categories using the weights from Step 3
  - Accounts for yesterday's completion rate (if low, lighter load; if high, maintain or increase)
  - Returns an ordered list of today's assigned tasks
- [ ] Morning assignment triggers automatically on clock-in
- [ ] "Manager" presents the daily task list with a brief AI-generated message (e.g., "Heavy marketing day — let's clear the backlog")
- [ ] Player can swap/defer individual tasks before starting (drag to reorder, or "defer to tomorrow")
- [ ] Assigned tasks move from `queued` → `assigned` status in the pool

### 4.2 — Proof Submission UI
- [ ] When completing a task, a **proof field** opens before the task is marked done:
  - **Text note** — free-form description of what was done
  - **URL** — link to the work (PR, deployed page, published post, etc.)
  - **Screenshot** — file upload or paste from clipboard
- [ ] Proof is required for Gold reward — no proof = no Gold (XP still partial)
- [ ] Proof UI is lightweight and quick — should not feel like filing a report
- [ ] Styled as an in-game dialog box (pixel borders, game font)
- [ ] Proof data stored per task:
  ```
  {
    taskId, type: 'note' | 'url' | 'screenshot',
    content: string,      // text, URL, or base64/blob reference
    submittedAt
  }
  ```

### 4.3 — Gold & XP Earning Logic (Refined)
- [ ] **With proof:** Full Gold + Full XP for the task
- [ ] **Without proof:** No Gold, partial XP (25%)
- [ ] **Task difficulty multiplier:** Longer estimated tasks earn more (15min = 1x, 30min = 2x, 1hr = 4x, 2hr = 7x)
- [ ] **Streak bonus:** Consecutive full-shift days multiply Gold by streak factor (day 2 = 1.1x, day 3 = 1.2x, ..., capped at 2x)
- [ ] **Partial shift:** Proportional rewards based on completion percentage
- [ ] Level-up thresholds: XP required per level increases gradually

### 4.4 — End-of-Day Clock-Out Screen
- [ ] Triggered by clicking "Clock Out" button
- [ ] Animated summary sequence:
  1. Character stands up from desk, stretches
  2. Summary card slides in with:
     - Tasks completed vs assigned (e.g., "5/7 tasks completed")
     - Gold earned today (with coin animation tallying up)
     - XP earned today (bar fills to new position)
     - Current streak status
  3. Brief AI-generated performance note (e.g., "Solid day. Marketing tasks cleared for the first time this week.")
  4. Incomplete tasks noted with "Rolling to tomorrow" message
- [ ] Transition: character walks out of office → scene fades (apartment scene comes in Step 5)

### 4.5 — Incomplete Task Handling
- [ ] Incomplete tasks at clock-out → status changes to `rolled`
- [ ] Rolled tasks re-enter the pool as high-priority for tomorrow
- [ ] A task can only roll twice before being flagged for review ("This task has been deferred 3 times")
- [ ] No punishment — just no Gold earned and atmospheric consequences (future steps)

### 4.6 — Shift History
- [ ] Store daily shift records:
  ```
  {
    date, clockInTime, clockOutTime,
    tasksAssigned: number, tasksCompleted: number,
    goldEarned: number, xpEarned: number,
    streak: number
  }
  ```
- [ ] Basic history view accessible from the UI (list of past shifts with stats)
- [ ] This data feeds into the Friday review in Step 6

## Acceptance Criteria
- On clock-in, AI selects and presents a balanced daily task list from the pool
- Tasks can be reordered or deferred before starting work
- Completing a task requires proof submission (note, URL, or screenshot)
- Gold is only awarded when proof is provided
- Clock-out triggers an animated summary with correct Gold/XP tallies
- Incomplete tasks roll to the next day's pool
- Streak tracking works correctly across consecutive full-shift days
- The daily loop feels like a game shift, not a project management ceremony

## Key References from Vision Doc
- "Each morning, the 'manager' selects today's tasks from the pool, balanced across your goal categories"
- "Checking off a task opens a lightweight proof field — a text note, a URL, a screenshot. No proof, no Gold."
- "End-of-day clock-out screen: animated summary of shift performance. Completed count, Gold earned, XP gained."
- "Daily Assignment: Each morning, Claude selects and orders today's tasks from the queue, balancing categories and effort, taking into account yesterday's completion rate."
- Reward withholding: "Missing tasks does not subtract from what you have — it simply means you do not gain."
