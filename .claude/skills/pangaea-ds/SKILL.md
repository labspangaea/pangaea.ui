---
name: pangaea-ds
description: >-
  Workflow for building, auditing, and polishing components inside the pangaea.ui design-system repo
  — the rv-* two-hex blue-on-white system shipped as @labspangaea/ds-* packages with an Astro gallery.
  Use this whenever you add or change a @labspangaea/ds-* component, author or edit a gallery story in
  apps/gallery, run a drift / audit / polish pass on the system, touch any packages/*/src/styles.css
  or packages/tokens/src/tokens.scss, or the work involves the --rv-* tokens, WCAG AA contrast, the
  JSON array controls, or the parallel-agent audit→polish→re-audit loop in this repo. It enforces
  what's easy to get wrong here: zero visual drift from pangaea.id's revamp.css, exhaustive gallery
  controls (arrays as JSON), accent-ink token discipline for AA, and the Emil-Kowalski motion
  conventions. Reach for it even when the user just says "add a component", "fix the styles", "audit
  the gallery", or "make it match the site" — as long as they mean the @labspangaea/ds-* packages or the
  gallery. Do NOT use it for editing the live pangaea.id site itself (apps/labs marketing pages), for
  building a brand-new or unrelated design system, for the Kanvo gallery, or for generic
  CSS / contrast / Storybook / animation questions outside this repo.
---

# pangaea.ui design system

This repo is a **faithful port** of pangaea.id's live `.rv-*` design system into independently
versioned `@labspangaea/ds-*` packages, catalogued by a Storybook-style Astro gallery. The whole value
proposition is **zero visual drift from the live site** plus **WCAG AA in both themes**. Most
mistakes here come from inventing values instead of porting them, or from skimping on the gallery
controls. This skill is the playbook for not doing that.

Read `CLAUDE.md` for the always-on rules. This skill adds the *step-by-step workflows*. For the
exact token values, contrast pairs, and motion curves, read the reference files (pointers below)
rather than guessing.

## The five disciplines (why this skill exists)

1. **Zero-drift porting.** Components mirror pangaea.id's `revamp.css`. The source of truth is the
   live site, not your intuition. Diffing first is what keeps the DS visually identical to
   production — the moment you guess a padding or a hex, drift starts and compounds.
2. **Exhaustive gallery controls.** Every scalar prop gets a knob; **arrays and objects use the JSON
   object control**, never string concatenation. A half-controlled story is a half-documented
   component — people copy what they can drive.
3. **Token discipline for AA.** Blue *text* and meaning-carrying *glyphs* use `--rv-accent-ink`
   (`#1568b4`), never `--rv-accent` (`#3fa9f5` = 2.56:1 on white, a hard AA fail). This single rule
   prevents most contrast bugs. See `references/tokens-and-contrast.md`.
4. **Audit → polish → re-audit.** Quality is driven in a loop with parallel agents, not a single
   pass. Find issues (severity + file:line + fix), fix in disjoint dirs, then re-verify live.
5. **Motion as craft.** Origin-aware popovers, press feedback on every pressable, touch-safe hover
   gating, reduced-motion everywhere. See `references/motion.md`.

## Workflow A — add or change a component (no drift)

Do these in order. The diff step is not optional; it's the whole point.

1. **Read the source rule first.** Find the matching `.rv-*` rule in pangaea.id
   (`apps/labs/src/styles/revamp.css`, plus the `blocks.tsx` / `journey.tsx` primitives for
   structure). If you don't have the pangaea.id repo handy, ask for it or for the specific CSS — do
   **not** proceed from memory. Diff property-by-property and capture: light values, the
   `[data-rv-theme="dark"]` overrides, every `@media` breakpoint, and pseudo-states
   (`:hover` / `:active` / `:focus-visible`).
2. **Scaffold the package.** `packages/<comp>/` with:
   - `package.json`: `"name": "@labspangaea/ds-<comp>"`, own `version`, `react`+`react-dom` as
     **peerDependencies** (never deps), `"dependencies": { "@labspangaea/ds-tokens": "*" }` if it uses
     tokens, ESM `exports` + `types`, `"sideEffects": ["*.css"]`,
     `"scripts": { "build": "tsc -p tsconfig.json && cp src/styles.css dist/styles.css" }`.
   - `src/index.tsx`: peer-react component, explicit named exports (that barrel list is the future
     federation `exposes:`). No deep relative imports into sibling packages — reference by package
     name only.
   - `src/styles.css`: `.rv-*` classes driven by `var(--rv-*)`. Port the source rule exactly. A
     token-driven rule inherits dark mode for free; a hard-coded literal needs a
     `[data-rv-theme="dark"] .rv-page ...` twin.
   - `tsconfig.json`: extend the repo base.
3. **Honor the token discipline.** Blue text/glyph → `--rv-accent-ink`. `--rv-accent` only for
   fills, tracks, borders that already clear 3:1. Check both themes against
   `references/tokens-and-contrast.md`.
4. **Add the motion** per `references/motion.md` (press feedback, hover gating, reduced-motion).
5. **Write the gallery story** (Workflow B).
6. **Import the CSS:** add `@import "../../../packages/<comp>/src/styles.css";` (match the existing
   pattern) to `apps/gallery/src/styles/app.css`.
7. **Build + typecheck** (Workflow D). Then verify live in the gallery, light **and** dark.

## Workflow B — author a gallery story (exhaustive controls)

Stories live in `apps/gallery/src/gallery/stories.tsx`. Each is
`{ id, name, group, pkg, notes?, controls?, render }`. The `render` signature is
`(args, ctx: { theme, lang }) => ReactNode`.

- **One control per scalar prop.** `text` / `textarea` / `number` / `bool` / `select` for scalars.
- **Arrays and objects use `{ kind: "json", label, def }`** — the JSON object control. Never expose
  an array as a comma-joined string; that's the mistake this repo explicitly moved away from. In
  `render`, guard with `Array.isArray(a.x) ? a.x : []`.
- **No dead controls.** Every knob must visibly change the canvas. If a prop is internal demo state
  (e.g. a controlled `checked`), either wire it through or don't expose it. A control that does
  nothing is worse than no control — it reads as broken.
- **Pick the right group** (Foundations, Actions, Inputs, Data display, Feedback, Navigation,
  Sections, Content) so it lands in the left menu sensibly.
- The right-pane **Usage snippet** is generated from the controls by `usageOf` in `Gallery.tsx` —
  objects serialize as `prop={...}`. Keep prop names real so the copyable snippet is valid.
- If the component has bilingual copy, consume `ctx.lang` (`"en" | "id"`) for the **fixed** strings
  (e.g. action labels) — not for values already exposed as editable text controls, or the toggle
  fights the knob. Add a `notes` line so the EN/ID behavior is discoverable.

## Workflow C — the audit → polish → re-audit loop

This is how quality is driven here. Use parallel agents; keep them in **disjoint file sets** so
edits never collide.

1. **Audit (fan out).** Spawn parallel agents over different concerns — e.g. (a) live a11y +
   interaction on the running gallery, (b) theming/contrast across `packages/*/src/styles.css`,
   (c) responsive + anti-patterns + code quality. **Exactly one agent drives the Playwright
   browser** (the others do static analysis) to avoid contention. Each returns findings as
   *severity (P0–P3) + one-line title + file:line + impact + specific fix*, and verifies before
   reporting (no false positives).
2. **Consolidate + dedup** the findings yourself into one prioritized list.
3. **Polish (fan out).** Spawn fixer agents over **disjoint package dirs** (and take any
   single-file-spanning change — like the gallery shell — yourself to avoid coordination bugs).
   Each agent edits only its dir and builds its own packages.
4. **Re-audit.** Re-run the browser agent (resume it via SendMessage so it keeps the baseline) to
   verify each fix landed (with measured evidence) and nothing regressed. Repeat until the P0/P1/P2
   class is clear; P3s can be a noted backlog.
5. **Build + typecheck after every wave** (Workflow D).

Map findings to fixes with the references: contrast/theming → `tokens-and-contrast.md`;
motion/interaction → `motion.md`.

## Workflow D — verify (always, after any change)

```bash
npm run build:pkgs                                     # all packages (sass tokens + tsc comps)
npm run build                                          # build:pkgs + static gallery
npx tsc --noEmit -p apps/gallery/tsconfig.json         # REQUIRED — see why below
```

**The standalone `tsc --noEmit` is not redundant.** `astro build` uses esbuild, which strips types
**without typechecking** — an implicit-`any` or a wrong prop type passes the build and only `tsc`
catches it. Skipping this is how type bugs ship.

Then verify **live** in the gallery (`npm run gallery`, light **and** dark): 0 console errors, no
overflow at 1440 / 768 / 390, ≥44px touch targets, controls reactive.

## Reference files

- `references/tokens-and-contrast.md` — the full `--rv-*` palette (light + dark values), the
  AA-critical contrast pairs, and the accent-ink rule. Read before touching colors.
- `references/motion.md` — the Emil-Kowalski motion conventions as applied here (ease curve, press
  feedback, origin-aware popovers, hover gating, reduced-motion). Read before touching animation.

## Release & git

Per-component publishing via Changesets → GitHub Packages (`@labspangaea`); `npm run changeset` after a
change. Pushing: origin is `labspangaea/pangaea.ui`, owned by the `gh` account **`labspangaea`** —
a plain push as another account 403s. Use `gh auth switch --user labspangaea` then
`git -c credential.helper='!gh auth git-credential' push`, then switch back. (Full detail in
`CLAUDE.md`.)
