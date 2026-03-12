# MVP Gaps: Missing Topics

Concerns entirely absent from the current MVP plan that should be addressed in future iterations.

---

## Testing Strategy
The plan contains no mention of testing at any level:
- **Unit tests**: Framework selection (Vitest, Jest), coverage targets
- **Integration tests**: API mocking strategy, database test fixtures
- **E2E tests**: Browser automation (Playwright, Cypress), critical user flows to cover
- **CI gating**: Whether tests block merges or deployments

## Performance Budgets
No performance targets are defined:
- Bundle size limits (initial load, lazy-loaded chunks)
- Time-to-interactive targets
- Animation frame rate expectations (especially for apartment visualization)
- API response time SLAs

## Analytics / Telemetry
No observability or usage tracking planned:
- Event tracking for key user actions (clock-in, apartment visits, NPC interactions)
- Error reporting and alerting (e.g., Sentry)
- Usage funnels to understand drop-off points

## Onboarding / Tutorial
No first-run experience:
- How does a new user understand the apartment metaphor?
- Is there a guided walkthrough or tooltip tour?
- What happens on first clock-in when there's no history?

## Settings / Preferences
No user-facing configuration:
- Theme preferences (light/dark mode)
- Notification settings
- API key management UI
- Account settings (display name, avatar, etc.)

## Data Export / Deletion
No data portability or compliance features:
- Export user data (time logs, apartment state, personality profiles)
- Delete account and associated data
- GDPR / privacy compliance if serving EU users

## API Cost Projections
No cost modeling for Claude API usage:
- Estimated tokens per personality generation
- Estimated tokens per NPC dialogue exchange
- Monthly cost projections at various user counts
- Cost optimization strategies (caching, prompt compression)

## Step 7 Scope Splitting
Step 7 ("Polish, Deployment & Launch") bundles too many concerns:
- **Recommendation**: Split into separate steps:
  - Step 7a: Visual polish and UX refinements
  - Step 7b: Deployment infrastructure and CI/CD
  - Step 7c: Launch checklist and go-live tasks
- Each sub-step should have its own acceptance criteria and can be independently prioritized if time is constrained
