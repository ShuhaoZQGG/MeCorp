# MVP Plan — Step 6: NPCs & Friday Performance Review

## Objective
Bring the pixel world to life with office NPCs who react to your performance, and implement the weekly Friday performance review — a formal meeting scene where your manager-self reviews the week. This is the social/narrative layer that makes PixelCorp feel like a game people talk about, not just a tool. Beginning of Phase 3.

## Dependencies
- **Step 5:** Supabase persistence, apartment scene, streak tracking, shift history data
- **External:** Claude API (reuses existing proxy from Step 3)

## Tech Stack (additions)
- **AI:** Claude API for NPC dialogue generation and Friday review text

## Deliverables

### 6.1 — Office NPC Sprites
- [ ] Design 3-4 NPC coworker sprites:
  - **Supportive colleague** — cheers you on during streaks
  - **Concerned colleague** — notices when you've missed days
  - **Competitive colleague** — references their own (fictional) productivity
  - **Office manager / receptionist** — gives general tips and announcements
- [ ] Each NPC has:
  - Idle animation (2-3 frames, consistent with player sprite style)
  - Fixed position in the office scene (at adjacent desks, break area, etc.)
  - Click/interact hitbox

### 6.2 — Dialogue System
- [ ] Dialogue box component: pixel-bordered text box at bottom of screen (classic RPG style)
- [ ] Text appears with typewriter effect (character by character)
- [ ] Click/spacebar to advance dialogue
- [ ] Support for multi-line dialogue sequences
- [ ] NPC name displayed above dialogue text
- [ ] Dialogue box uses the UI shell palette (`#1a1c2c` base, gold borders, pixel white text)

### 6.3 — Claude API NPC Dialogue Generation
- [ ] Create serverless API route (`/api/npc-dialogue`) that:
  - Accepts: NPC type, player performance context (streak, recent completion rate, level, days active)
  - Calls Claude API with NPC personality prompt + player context
  - Returns 2-4 lines of contextual dialogue
- [ ] NPC dialogue refreshes daily (not on every interaction — cache per day)
- [ ] Personality prompts per NPC type:
  - Supportive: warm, encouraging, references specific achievements
  - Concerned: gentle, caring, notices absences without guilt-tripping
  - Competitive: playful rivalry, fictional productivity brags
  - Manager: professional, tips, occasional company lore
- [ ] Fallback dialogue if API fails (static lines per NPC)

### 6.4 — Reputation System (Hidden Stat)
- [ ] **Reputation** is a hidden numerical stat (0-100) that affects NPC reactions
- [ ] Reputation increases with: completed shifts, streaks, proof submissions
- [ ] Reputation decreases slowly with: missed days, incomplete shifts
- [ ] Reputation thresholds affect dialogue tone:
  | Reputation | NPC Behavior |
  |-----------|-------------|
  | 80-100 | Warm, celebratory, reference your achievements |
  | 50-79 | Friendly, normal office small talk |
  | 20-49 | Concerned, encouraging, gentle nudges |
  | 0-19 | Worried, "haven't seen you around much" |
- [ ] Reputation is passed as context to the Claude API for dialogue generation
- [ ] Stored in Supabase `player_state`

### 6.5 — Friday Performance Review Scene
- [ ] **Meeting room scene:** New pixel environment — conference table, whiteboard, two chairs
- [ ] Triggered on Fridays (or on first clock-in after a full work week)
- [ ] **Review flow:**
  1. Character walks into meeting room
  2. Manager-self (same character sprite in "boss" variant — glasses, tie, or different color) sits across
  3. Weekly summary presented as a formal review document:
     - Days clocked in this week
     - Tasks completed vs assigned (with percentage)
     - Gold earned this week
     - XP gained this week
     - Streak status
     - Best category performance / weakest category
  4. AI-generated review narrative (Claude API):
     - Tone adapts to actual performance (congratulatory, constructive, concerned)
     - References specific accomplishments or gaps
     - Sets tone for next week
  5. Review ends with a "performance rating" (pixel stars: 1-5)
  6. Character exits meeting room → returns to normal office

### 6.6 — Friday Review API
- [ ] Create serverless API route (`/api/weekly-review`) that:
  - Accepts: full week's shift data, task completion details, streak, reputation
  - Calls Claude API with "Friday manager review" prompt
  - Returns: narrative text (3-5 paragraphs), star rating (1-5), one-line "focus for next week"
- [ ] Review data stored in Supabase for history:
  ```
  reviews (id, user_id, week_start, week_end,
           tasks_completed, tasks_assigned, gold_earned, xp_earned,
           star_rating, narrative, focus_next_week, created_at)
  ```

## Acceptance Criteria
- 3-4 NPCs are visible in the office scene with idle animations
- Clicking an NPC triggers a dialogue box with contextual, AI-generated dialogue
- NPC dialogue reflects the player's actual performance (streak, completion rate)
- Reputation stat silently tracks and influences NPC behavior
- On Fridays, a meeting room scene plays with a full weekly review
- Review includes real stats + AI-generated narrative that adapts to performance
- Review tone ranges from congratulatory to constructive based on actual data
- Dialogue system has classic RPG feel (typewriter text, pixel borders, click to advance)

## Key References from Vision Doc
- "Office NPCs: pixel coworkers who comment on your performance. A supportive colleague when you're on a streak. A concerned one when you've missed days. Dialogue generated by Claude API."
- "Friday performance review: your pixel manager-self calls you into the meeting room. A weekly summary rendered as a formal review. Tone and content adapt to your actual performance that week."
- "Reputation: A hidden stat that affects NPC reactions and unlocks company 'events' — team offsites, promotions, special quests."
- "World Narrative: NPC dialogue, Friday review text, and company news feed entries are all generated by Claude with context about the player's actual performance data. This is what makes the world feel alive."
