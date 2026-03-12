# MVP Plan — Step 1: Project Scaffolding & Pixel Office Scene

## Objective
Build the foundational React project and the single pixel-art office scene that sells the entire PixelCorp concept in under ten seconds. This is Phase 1's visual shell — a static but atmospheric screen that communicates the product instantly.

## Dependencies
None — this is the starting point.

## Tech Stack
- **Build Tool:** Vite (React template)
- **Framework:** React 18+
- **Styling:** Tailwind CSS with custom pixel-art utility classes
- **State:** Zustand (install now, minimal usage in this step)
- **Pixel Art:** CSS sprites / SVG for Phase 1 (Aseprite exports planned for Phase 2+)
- **Hosting:** Vercel (zero-config deploys, preview URLs per branch)

## Deliverables

### 1.1 — Project Initialization
- [ ] Scaffold React + Vite project (`npm create vite@latest`)
- [ ] Install and configure Tailwind CSS
- [ ] Install Zustand
- [ ] Set up folder structure:
  ```
  src/
    assets/         # Sprites, pixel art assets
    components/     # Reusable UI components
    scenes/         # Full-screen scene compositions
    store/          # Zustand stores
    styles/         # Global styles, pixel font imports
  ```
- [ ] Configure Vercel deployment (connect repo, auto-deploy on push)

### 1.2 — Color Palette & Design Tokens
Implement the three-world color system as Tailwind theme extensions:

| World | Key Colors | Tailwind Tokens |
|-------|-----------|-----------------|
| **Work (Office)** | Deep navy, slate grey, monitor green, gold accents | `office-navy`, `office-slate`, `office-green`, `office-gold` |
| **Home (After Work)** | Warm amber, grass green, terracotta, soft sky blue | `home-amber`, `home-green`, `home-terra`, `home-sky` |
| **UI Shell** | Dark `#1a1c2c` base, gold borders, pixel white text | `ui-base`, `ui-gold`, `ui-text` |

- [ ] Extend `tailwind.config.js` with custom colors
- [ ] Import a pixel-style font (e.g., "Press Start 2P" or similar bitmap font from Google Fonts)
- [ ] Set base styles: dark background (`#1a1c2c`), pixel-rendered text

### 1.3 — Pixel Office Environment
Build the static office scene as a composable React component:

- [ ] **Desk** — pixel art desk with monitor, keyboard, coffee mug
- [ ] **Wall** — office wall with "ME Corp." company logo prominently displayed
- [ ] **Window** — showing time-of-day ambiance (static for now; will reflect real time later)
- [ ] **Ambient details** — potted plant, bookshelf, wall clock, cable clutter
- [ ] Scene composed as layered divs or SVG, not canvas (lightweight, no canvas dependency for Phase 1)
- [ ] Scene fills the main viewport area, leaving room for the HUD overlay

### 1.4 — Character Sprite with Idle Animation
- [ ] Design or source a small pixel character sprite (developer at desk)
- [ ] Implement idle animation using CSS sprite sheet animation (`@keyframes` + `steps()`)
- [ ] Character is seated at the desk in default state
- [ ] At least 2 animation frames for idle (subtle breathing/blinking)
- [ ] Character mood/energy state visible (this is visual only in Step 1 — no logic yet)

### 1.5 — Responsive Layout Shell
- [ ] Desktop-first layout (target: 1280×800 minimum)
- [ ] Office scene centered with proportional scaling
- [ ] HUD overlay area reserved (top-right corner for XP/Gold, left side for task list)
- [ ] Layout does not break on common desktop resolutions (1920×1080, 1440×900, 1280×800)

## Acceptance Criteria
- Running `npm run dev` shows the pixel office scene with character animation
- The ME Corp. logo is clearly visible on the office wall
- Color palette matches the vision doc's mood descriptions (professional but alive, not cubicle farm)
- The aesthetic is recognizably Stardew Valley / Story of Seasons — warm, handcrafted, alive
- A pixel font is used for any text on screen
- The scene is built from composable React components, not a single monolithic image
- Deployed to Vercel and accessible via preview URL

## Key References from Vision Doc
- "The office in PixelCorp will have the same warmth as the farmhouse in Harvest Moon: lived-in, personal, reactive."
- "Deep navy, slate grey, monitor green, gold accents — Professional but alive, like a late-night indie studio, not a cubicle farm."
- "Before writing any backend code... build the morning clock-in screen as an interactive React artifact."
- Pixel art style: "16-bit pixel art tradition of the SNES and GBA era"
