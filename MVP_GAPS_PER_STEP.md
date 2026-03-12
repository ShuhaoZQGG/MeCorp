# MVP Gaps: Per-Step Issues

Step-specific gaps identified during the MVP plan review.

---

## Step 1: Project Setup & Base UI
- **TypeScript decision**: Not explicitly stated — should be confirmed before scaffolding
- **CI/CD strategy**: No linting, formatting, or build pipeline defined for day-one automation

## Step 2: Clock-In/Out & Time Tracking
- **Interim clock-out state**: What does the user see after clocking out but before an apartment exists (Steps 3–7 not yet built)? Need a placeholder or "coming soon" state
- **Category seeding**: No predefined time categories listed — who defines the initial set, and can users customize them?

## Step 3: Personality & Vibe Generation (Claude API)
- **Prompt examples**: No sample prompts or prompt templates provided for personality generation
- **API cost estimation**: No projections for per-user or per-session Claude API costs
- **Balancing algorithm**: How are personality traits weighted or bounded? No formula or constraints defined

## Step 4: Apartment Visualization
- **Screenshot storage before Supabase**: Step 5 introduces Supabase, but Step 4 may need image/screenshot persistence — where does it go in the interim?
- **Drag-to-reorder scope**: Is furniture/item rearrangement in scope for MVP? If so, what are the interaction constraints?

## Step 5: Data Persistence (Supabase)
- **localStorage → Supabase migration**: Users may accumulate local data in Steps 1–4 before Supabase lands — need a migration path
- **Offline conflict resolution**: No strategy for conflicts when local and remote data diverge
- **Secrets management**: How are Supabase keys and Claude API keys stored and rotated? No `.env` or vault strategy defined

## Step 6: Social & NPC Interactions
- **Meeting room design specs**: No wireframes or layout specifications for the social/meeting space
- **NPC dialogue cache location**: Where are generated NPC dialogues cached — localStorage, Supabase, or in-memory?
- **Reputation formula**: No defined algorithm for how reputation is calculated or what actions affect it

## Step 7: Polish, Deployment & Launch
- **Placement system scope**: How sophisticated is the furniture/item placement — grid-based, free-form, or fixed slots?
- **API key management complexity**: Users managing their own Claude API keys adds UX friction — no simplification plan
- **Prioritization of sub-deliverables**: Step 7 bundles many tasks (polish, deploy, launch) — no priority order if time runs short
