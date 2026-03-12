# MVP Plan — Step 3: Goal System & AI Task Decomposition

## Objective
Replace manual task entry with a structured goal system. Players define their goals across categories, and the Claude API decomposes each goal into actionable daily tasks. This is the first half of Phase 2 — making the app functional for real productivity.

## Dependencies
- **Step 2:** Working task HUD, Zustand game state, XP/Gold system
- **External:** Claude API key (claude-sonnet-4)

## Tech Stack (additions)
- **AI:** Claude API (claude-sonnet-4) via Anthropic SDK
- **Backend:** Lightweight API route (Vercel serverless function or similar) to proxy Claude API calls (keeps API key server-side)

## Deliverables

### 3.1 — Goal Entry Screen
- [ ] New scene/screen: Goal management view (pixel-art themed, not a plain form)
- [ ] Goal fields:
  - **Title** (e.g., "Launch portfolio site")
  - **Category** — selectable from: `Work`, `Side Project`, `Learning`, `Marketing`
  - **Description** (optional, provides context for AI decomposition)
  - **Target timeframe** (optional, e.g., "2 weeks")
- [ ] Category icons in pixel art style (briefcase, rocket, book, megaphone)
- [ ] Support multiple active goals (recommended: 2-4 across categories)
- [ ] Goals stored in Zustand with structure:
  ```
  {
    id, title, category, description, timeframe,
    tasks: Task[],       // AI-generated daily tasks
    createdAt, active
  }
  ```

### 3.2 — Claude API Integration for Task Decomposition
- [ ] Create serverless API route (`/api/decompose`) that:
  - Accepts a goal object (title, category, description, timeframe)
  - Calls Claude API with a structured prompt
  - Returns an array of daily tasks with estimated effort
- [ ] Prompt engineering for decomposition:
  - Input: goal details + category
  - Output: 5-15 concrete, actionable daily tasks
  - Each task includes: title, estimated duration (15min / 30min / 1hr / 2hr), category inheritance
  - Tasks should be specific enough to verify completion (not "work on project" but "write the hero section copy for landing page")
- [ ] Error handling: graceful fallback if API fails (allow manual task creation)
- [ ] Rate limiting awareness: decomposition runs once per goal creation, not continuously

### 3.3 — Task Queue / Pool Management
- [ ] All AI-generated tasks feed into a **task pool** in Zustand
- [ ] Task pool structure:
  ```
  {
    id, title, category, goalId,
    estimatedDuration, status: 'queued' | 'assigned' | 'completed' | 'rolled',
    createdAt, assignedDate?, completedAt?
  }
  ```
- [ ] Pool is the source of truth for daily assignment (Step 4)
- [ ] Tasks can be manually added to the pool alongside AI-generated ones
- [ ] Tasks can be edited or removed from the pool before assignment

### 3.4 — Category Balancing Logic
- [ ] Implement balancing rules so the daily task mix reflects all active goals:
  - No single category should dominate >60% of daily tasks
  - If a player has goals in Work + Marketing + Learning, daily tasks pull from all three
  - Balancing weights can be adjusted per goal (priority slider or simple high/medium/low)
- [ ] Store category weights in Zustand alongside goals
- [ ] This logic is used by the AI daily assignment in Step 4

### 3.5 — Goal Management UI
- [ ] View all active goals with their generated task counts
- [ ] Edit/archive/delete goals
- [ ] "Re-decompose" button to regenerate tasks for a goal (calls Claude API again)
- [ ] Visual indicator of task pool depth per goal (how many tasks remain unassigned)

## Acceptance Criteria
- Player can create a goal with title, category, and description
- Claude API decomposes the goal into 5-15 specific, actionable daily tasks
- Generated tasks appear in the task pool with correct category and estimated duration
- Multiple goals across different categories are supported simultaneously
- Category balancing logic prevents any single category from dominating
- API key is never exposed to the client (server-side proxy only)
- Manual task creation still works alongside AI-generated tasks
- Goal screen maintains the pixel-art game aesthetic

## Key References from Vision Doc
- "Goal entry screen: set your goals across categories (Work, Side Project, Learning, Marketing)"
- "The AI decomposes each goal into a suggested daily task volume"
- "You cannot only get coding tasks — the contract covers marketing too"
- "Task Decomposition: Given a goal and a category, Claude generates a suggested breakdown into daily tasks with estimated effort. This runs once when a goal is set and updates weekly."
- Claude model: `claude-sonnet-4`
