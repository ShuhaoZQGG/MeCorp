# MVP Plan — Step 2: Clock-In Screen & Task HUD

## Objective
Transform the static office scene into an interactive clock-in experience with a game-style task list, reward animations, and XP/Gold HUD. This completes Phase 1 — the single screen that sells the entire concept. Someone seeing this should immediately say "I want to use this."

## Dependencies
- **Step 1:** Project scaffolding, pixel office scene, character sprite, color palette

## Tech Stack (additions to Step 1)
- **State:** Zustand store for tasks, XP, Gold, shift status
- **Animation:** CSS keyframes + transitions for reward effects

## Deliverables

### 2.1 — Zustand Game State Store
- [ ] Create `src/store/gameStore.ts` with:
  ```
  {
    tasks: Task[]           // { id, title, completed, category }
    xp: number
    gold: number
    level: number
    shiftActive: boolean
    streak: number
  }
  ```
- [ ] Actions: `clockIn()`, `clockOut()`, `completeTask(id)`, `addTask(title, category)`
- [ ] XP/Gold reward logic: each completed task grants a base Gold amount + XP
- [ ] Local-only persistence (no backend) — `localStorage` via Zustand middleware

### 2.2 — Task List as Game UI Element
The task list must feel like an in-game element, not a productivity app widget:

- [ ] Render as a **clipboard or memo pad** pinned to the office scene (not a sidebar todo list)
- [ ] Each task shows: title, category icon, completion checkbox styled as pixel art
- [ ] Visual grouping by category if multiple categories present
- [ ] Tasks are manually entered for Phase 1 (simple input field within the game UI)
- [ ] Completing a task triggers the reward animation (see 2.4) before marking it done
- [ ] Completed tasks show a pixel checkmark / strikethrough effect

### 2.3 — XP Bar & Gold Counter (Pokemon HUD Style)
- [ ] **XP Bar:** Horizontal bar in top-right area, fills left-to-right, shows current XP / XP-to-next-level
- [ ] **Gold Counter:** Coin icon + number, updates with animation on earn
- [ ] **Level Badge:** Current level displayed next to XP bar
- [ ] Styled after Pokemon's in-battle HUD: small, unobtrusive, clean pixel borders
- [ ] Gold counter uses the `office-gold` accent color
- [ ] HUD overlays the office scene without obscuring the character

### 2.4 — Clock-In Button & Shift Animation
- [ ] **Clock-In Button:** Prominent, styled as a pixel-art button (gold border, dark background)
- [ ] On clock-in:
  - Character sits up from slouched/idle pose
  - Monitor screen turns on (glow effect)
  - Task memo/clipboard slides into view
  - Subtle ambient change (office brightens slightly)
- [ ] Shift status indicator visible (e.g., "ON SHIFT" badge or clock icon)
- [ ] Button text changes to "Clock Out" when shift is active

### 2.5 — Task Completion Reward Animations
- [ ] **Coin Spin:** Small gold coin sprite animates (spin + float up) when Gold is earned
- [ ] **XP Flash:** XP bar flashes/pulses briefly when XP is added, then fills smoothly
- [ ] **Task Check Effect:** Satisfying visual feedback on the task itself (glow, stamp, pixel sparkle)
- [ ] Animations are quick (300-500ms) — rewarding but not blocking workflow
- [ ] Sound effects are optional / deferred (visual feedback is priority)

### 2.6 — Office Environment Reactivity (Basic)
- [ ] Plants perk up slightly as tasks are completed (CSS class swap)
- [ ] Monitor glow brightens with momentum (more tasks done = brighter)
- [ ] These are subtle atmospheric shifts, not dramatic changes

## Acceptance Criteria
- Clock-In button triggers a visible shift-start animation sequence
- Tasks render as an in-game clipboard/memo, not as a standard web form
- Completing a task shows coin spin + XP flash animations
- XP bar and Gold counter update correctly and are styled like a Pokemon HUD
- All state persists in localStorage (refresh doesn't lose data)
- The overall experience feels like a game, not a productivity tool in costume
- "Checking off a task feels rewarding, not administrative" (from vision doc)
- The ME Corp. employment framing is visible and clear without explanation

## Key References from Vision Doc
- "Task list rendered as a game UI element (not a todo app list)"
- "XP bar + Gold counter in Pokemon HUD style"
- "Clock-In button triggers the shift start animation — character sits up, monitor turns on"
- "Completing a task shows a small reward pop (coin spin, XP flash) before the task is checked off"
- "Stardew Valley's HUD design (small, unobtrusive stat bars in the corner) inspires how XP and Gold are shown"
- Definition of Done: "You can show someone the screen and they immediately say 'I want to use this'"
