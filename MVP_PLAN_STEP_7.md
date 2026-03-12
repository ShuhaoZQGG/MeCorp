# MVP Plan — Step 7: Unlockables, Task Ingestion & News Feed

## Objective
Add the collection/reward systems, external task ingestion, and AI-generated company news that make PixelCorp sticky long-term. This completes Phase 3 — the full "world" layer where players want to come back not just to be productive, but to see their world grow.

## Dependencies
- **Step 6:** NPCs, dialogue system, Friday review, reputation system
- **Step 5:** Supabase persistence, apartment scene, Gold/XP systems

## Tech Stack (additions)
- **API:** Public task ingestion endpoint (Vercel serverless)
- **AI:** Claude API for news feed generation (reuses existing proxy)

## Deliverables

### 7.1 — Unlockable Items System
- [ ] **Item catalog** stored in a config/database:
  ```
  items (id, name, type, category, cost_gold, required_level,
         sprite_key, description, unlock_condition)
  ```
- [ ] Item types:
  - **Office furniture:** desk lamp, plant upgrade, monitor upgrade, bookshelf items, wall art
  - **Character outfits:** different shirts, hats, accessories (pixel costume pieces)
  - **Apartment rooms:** additional rooms unlocked at milestones (bedroom upgrade, balcony, home office)
  - **Apartment furniture:** couch, TV, kitchen upgrade, pet bed
- [ ] Items unlock based on:
  - Gold cost (primary)
  - Level requirement (some items require minimum level)
  - Streak milestones (special items at 7, 14, 30 day streaks)
  - Reputation thresholds (hidden unlocks for high reputation)

### 7.2 — Gold-Based Shop / Purchase System
- [ ] **Shop UI:** Pixel-art store interface accessible from office or apartment
- [ ] Browse items by category (office, character, apartment)
- [ ] Each item shows: sprite preview, name, Gold cost, level requirement, locked/unlocked status
- [ ] Purchase flow: confirm dialog → Gold deducted → item added to inventory → placement prompt
- [ ] **Inventory:** View owned items, equip character outfits, place furniture
- [ ] **Placement system (basic):** For furniture, select a valid position in office/apartment scene
  - Simple grid-based placement
  - Items snap to predefined slots (not free-form for MVP)

### 7.3 — Visual Integration of Unlockables
- [ ] Purchased office items appear in the office scene (desk lamp on desk, art on wall)
- [ ] Character outfits change the sprite appearance
- [ ] Apartment furniture/rooms appear in the apartment scene
- [ ] Unlockables are the **visual representation of accumulated effort** — the office and apartment should look noticeably different at level 1 vs level 10

### 7.4 — Task Ingestion Endpoint
- [ ] Create a public API endpoint (`/api/ingest`) that accepts task payloads:
  ```json
  POST /api/ingest
  Authorization: Bearer <user-api-key>
  {
    "source": "github" | "calendar" | "agent" | "manual",
    "tasks": [
      {
        "title": "Review PR #42",
        "category": "Work",
        "estimated_duration": "30min",
        "due_date": "2024-01-15",
        "metadata": { "url": "https://github.com/..." }
      }
    ]
  }
  ```
- [ ] User API key management: generate/revoke keys from settings
- [ ] Ingested tasks enter the task pool with `status: 'queued'`
- [ ] Source tracking: tasks show their origin (GitHub icon, calendar icon, etc.)
- [ ] The morning AI manager sorts through ingested tasks alongside goal-generated ones
- [ ] Rate limiting and validation on the endpoint

### 7.5 — Integration Examples (Documentation)
- [ ] Document how to connect common sources:
  - **GitHub:** Webhook or GitHub Action that posts new issues/PRs assigned to you
  - **Google Calendar:** Zapier/n8n recipe that converts calendar events to tasks
  - **Coding agents:** Any agent/script can POST tasks to the endpoint
  - **Screenshots/manual:** Quick-add via the existing UI
- [ ] Provide example curl commands and payload formats

### 7.6 — AI Company News Feed
- [ ] **News feed UI:** Scrollable ticker or bulletin board in the office scene
- [ ] Create serverless API route (`/api/news`) that:
  - Accepts: player stats (level, recent achievements, completion trends, streaks, total Gold)
  - Calls Claude API to generate 2-3 "company announcements"
  - Announcements reflect real progress in a corporate-humor tone
- [ ] Example announcements:
  - "ME Corp. announces record Q1 productivity — CEO completes 47 tasks in a single week"
  - "HR Department concerned: Employee #001 seen staring at empty task list for third consecutive day"
  - "Breaking: Side Project Division ships first feature; Marketing Division demands credit"
  - "ME Corp. stock price surges after unprecedented 14-day work streak"
- [ ] News refreshes daily or on significant events (level up, streak milestone, etc.)
- [ ] Past announcements viewable in a "Company Archive" or bulletin board

### 7.7 — Achievement / Milestone System
- [ ] Track and celebrate key milestones:
  - First clock-in, first full shift, first week completed
  - Streak milestones: 3, 7, 14, 30, 60, 100 days
  - Level milestones: 5, 10, 25, 50
  - Gold milestones: 100, 500, 1000, 5000 Gold earned lifetime
  - Category milestones: 50 tasks completed in a single category
- [ ] Milestone popup with pixel-art badge/trophy animation
- [ ] Achievements viewable in a trophy case (office wall or apartment shelf)

## Acceptance Criteria
- Shop displays purchasable items with Gold costs and level requirements
- Purchased items visibly appear in office and apartment scenes
- Character outfits change the sprite when equipped
- Task ingestion endpoint accepts external payloads and adds tasks to the pool
- API key auth works for the ingestion endpoint
- AI-generated company news feed displays contextual, humorous announcements
- News reflects actual player data (not generic text)
- Achievement popups trigger at correct milestones
- The game world looks and feels meaningfully different for an active player vs a new player

## Key References from Vision Doc
- "Unlockables: office furniture, character outfits, apartment rooms. Purchased with Gold. Visual representation of accumulated effort."
- "Task ingestion endpoint: a URL that accepts task payloads from calendars, GitHub, coding agents, or screenshots. Tasks enter a queue that the morning manager sorts through."
- "Company news feed: AI-generated company announcements that reflect your real progress — 'ME Corp. announces record Q1 productivity' or 'CEO seen staring at empty task list for third consecutive day.'"
- "Clear progression, visual representation of growth (your character and town evolve), and satisfying collection mechanics. The sense of being on a journey toward something bigger than today's task list." (Pokemon reference)
- Phase 3 goal: "Sticky — you want to come back"
