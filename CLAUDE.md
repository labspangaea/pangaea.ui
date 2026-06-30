# CLAUDE.md — pangaea.ui

The Pangaea design system: the `rv-*` two-hex blue-on-white system ported verbatim from
[pangaea.id](https://www.pangaea.id), shipped as independently versioned `@labspangaea/ds-*` packages
(tokens + 37 components) catalogued by a Storybook-style Astro gallery. Read `README.md` for the
full topology and `PRODUCT.md` for the register/brand contract.

## Non-negotiables (these override convenience)

1. **Zero drift from `revamp.css`.** Components are faithful ports of pangaea.id's live `.rv-*` CSS.
   Before creating or changing a component, **read the live site's CSS first** (pangaea.id's
   `apps/labs/src/styles/revamp.css` + the `blocks.tsx`/`journey.tsx` primitives) and diff
   property-by-property — light **and** dark (`[data-rv-theme="dark"]`), responsive breakpoints, and
   pseudo-states (`:hover`/`:active`/`:focus-visible`). Never assume a value; match the source.
2. **WCAG AA, both themes.** Every text/background pair ≥4.5:1 (≥3:1 large / non-text). Blue **text or
   meaning-carrying glyphs** use `--rv-accent-ink` (`#1568b4`, dark `#7cc4fa`), never plain
   `--rv-accent` (`#3fa9f5` = 2.56:1 on white). `--rv-accent` is for fills/tracks/borders only.
3. **Components ship precompiled `styles.css` off `--rv-*` tokens.** No Tailwind in components (it's
   gallery-only), no CSS-in-JS. A token-driven rule gets dark mode for free; a hard-coded literal
   needs a `[data-rv-theme="dark"]` twin. Prefer the token.
4. **`react`/`react-dom` are `peerDependencies`** in every package — never plain deps.
5. **Gallery controls stay exhaustive.** One knob per scalar prop, never skimmed. **Arrays/objects use
   the JSON object control** (`{ kind: "json" }`), never string concatenation.

## Layout

- `packages/tokens/` — `@labspangaea/ds-tokens`. SCSS source (`src/tokens.scss`) → `dist/tokens.css` (CSS
  vars, light + `[data-rv-theme="dark"] .rv-page` overrides) + `theme.css` (Tailwind v4 preset) +
  self-hosted fonts. **The palette source of truth.**
- `packages/<comp>/` — one component each: `src/index.tsx` (peer-react) + `src/styles.css` (`.rv-*`
  off `--rv-*`). Build = `tsc -p tsconfig.json && cp src/styles.css dist/styles.css`.
- `apps/gallery/` — the Astro/React explorer (not published). `src/gallery/Gallery.tsx` = the 3-pane
  shell (controls, usage-snippet generator, a11y structure); `src/gallery/stories.tsx` = the story
  registry; `src/styles/app.css` = `@import "tailwindcss"` + every package's `styles.css` + `.sb-*`
  chrome. The gallery is the first **consumer** — it proves each package boundary.

## Commands

```bash
npm install                                            # npm workspaces (NOT pnpm — not installed)
npm run build:pkgs                                     # build all packages (sass tokens + tsc comps)
npm run gallery                                        # astro dev → :4321 (gallery at root)
npm run build                                          # build:pkgs + static gallery
npx tsc --noEmit -p apps/gallery/tsconfig.json         # REQUIRED typecheck (see below)
```

**Always run the standalone `tsc --noEmit` after gallery edits.** `astro build` uses esbuild, which
strips types **without** typechecking — implicit-`any` and type errors pass the build but fail `tsc`.

## Adding / changing a component

1. Diff against the live `revamp.css` rule (non-negotiable #1).
2. `packages/<comp>/`: `package.json` (`@labspangaea/ds-<comp>`, peer-react, `exports`, `sideEffects:
   ["*.css"]`), `src/index.tsx`, `src/styles.css`, `tsconfig.json`.
3. Add a story in `stories.tsx` with **exhaustive** controls (JSON for arrays). Group it.
4. Import its `styles.css` in `apps/gallery/src/styles/app.css`.
5. `npm run build:pkgs && npm run build && npx tsc --noEmit -p apps/gallery/tsconfig.json` → all clean.
6. Verify live in the gallery, light **and** dark, ≥44px targets, 0 console errors.

## Motion conventions (Emil Kowalski)

- Single ease-out `--rv-ease: cubic-bezier(0.22,0.61,0.36,1)`. Never `ease-in`, never `transition:
  all`. Animate `transform`/`opacity`/color only.
- Pressables get `:active { transform: scale(0.96–0.97); transition-duration: 0.09s }`.
- Popovers/tooltips are **origin-aware** (`transform-origin` points at the trigger); modals stay
  `center`. Enter from `scale(0.96)`+opacity, never `scale(0)`.
- Movement-hovers (translate/scale lifts) gated behind `@media (hover: hover) and (pointer: fine)` so
  they don't stick on touch.
- Every `@keyframes`/animation has a `@media (prefers-reduced-motion: reduce)` fallback.

## Working style for big passes

- **Spawn parallel agents** over **disjoint package dirs** (no edit conflicts) for audits/fixes; one
  agent owns the Playwright browser (`:4321`/whatever port) to avoid contention.
- Audit → polish → re-audit loop: agents document findings (severity + file:line + fix), fixers edit
  their own dirs, then re-verify live. Build + `tsc --noEmit` after every wave.

## Release & federation

- Per-component publishing via Changesets → GitHub Packages (`@labspangaea`). `npm run changeset` → merge
  → CI bumps + publishes only the changed packages. See `README.md` → Release flow.
- Federation is **deferred but designed-for** (peer-react, isolated ESM, per-package CSS). Don't build
  MF machinery (YAGNI). Runtime MF is crawler-blind → never for the prerendered SEO pages.

## Git / push

Origin is `labspangaea/pangaea.ui`. The repo owner is the `gh` account **`labspangaea`** — a plain
push as `harryosmar` 403s. Push with: `gh auth switch --user labspangaea` then
`git -c credential.helper='!gh auth git-credential' push`, then switch back to `harryosmar`.
