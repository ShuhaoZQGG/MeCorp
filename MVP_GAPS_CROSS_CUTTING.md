# MVP Gaps: Cross-Cutting Concerns

Gaps that span multiple MVP plan steps and need resolution before or during implementation.

## Routing / Navigation Architecture
- No routing library chosen (e.g., React Router, TanStack Router)
- No defined route structure or URL scheme
- No strategy for deep linking or browser history management

## Error & Loading State Strategy
- No global error boundary plan
- No loading skeleton / spinner conventions
- No retry or fallback UI patterns defined

## Mobile / Responsive Design
- Plan says "desktop-first" but no breakpoint strategy
- No touch interaction considerations
- No plan for mobile-specific layouts or navigation patterns

## TypeScript
- Step 1 does not explicitly decide on TypeScript vs JavaScript
- Should be locked in before any code is written — affects tooling, linting, and all subsequent steps

## Claude API Fallback Architecture (Steps 3–7)
- No strategy for API rate limits, timeouts, or outages
- No graceful degradation when Claude API is unavailable
- No caching layer for repeated or similar prompts
- Affects: personality generation (Step 3), NPC dialogue (Step 6), apartment generation (Step 7)

## Testing Strategy
- No unit testing framework chosen (Vitest, Jest, etc.)
- No integration or E2E testing plan (Playwright, Cypress, etc.)
- No test coverage targets or CI gating

## Performance Budgets
- No bundle size targets
- No render performance benchmarks (e.g., 60fps for animations)
- No API response time expectations

## Analytics / Telemetry
- No event tracking plan
- No error reporting service (Sentry, etc.)
- No usage metrics for understanding user behavior

## Onboarding / Tutorial Flow
- No first-run experience designed
- No guided tour or tooltip walkthrough
- Users may not understand the apartment metaphor without guidance

## Settings / Preferences Screen
- No UI for user preferences (theme, notification settings, etc.)
- No way to manage API keys or account settings from within the app

## Data Export / Deletion (GDPR)
- No mechanism for users to export their data
- No account deletion or data purge flow
- Relevant if any user data is stored server-side (Step 5: Supabase)
