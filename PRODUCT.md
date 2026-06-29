# PRODUCT.md — pangaea.ui

**What it is.** The Pangaea design system: the two-hex blue-on-white `rv-*` system ported verbatim
from pangaea.id, shipped as independently versioned `@labspangaea/ds-*` packages, catalogued by an
Astro **gallery** — a 3-pane Storybook-style component explorer (left menu · center live canvas ·
right Controls + copyable Usage + Info).

**Register:** `product`. The gallery is a tool — a developer sits down to browse a component, drive
its props from exhaustive controls, and copy a usage snippet. The bar is earned familiarity
(Storybook, Figma, Linear): the tool disappears into the task. The *components* it showcases are
brand primitives, but the *surface* being audited/polished is the explorer tool.

**Primary surface:** `apps/gallery` — `src/gallery/Gallery.tsx` (the 3-pane shell, controls,
usage-snippet generator) + `src/gallery/stories.tsx` (the story registry) + `src/styles/app.css`
(`.sb-*` explorer chrome + every component `styles.css` import). Dev server: `npm run gallery`
(currently on :4477). The components live in `packages/*/src/{index.tsx,styles.css}`.

**Brand (committed — identity preservation wins, do not redesign):**
- Two brand hex only: navy `#203150`, electric blue `#3FA9F5`; accessible accent-ink `#1568b4`
  (never plain `#3FA9F5` for text on white — fails AA).
- Surfaces `#FFFFFF` / `#F4F8FD` / `#EAF3FD`; ink `#203150` / `#46566F` / `#5F6E88`.
- Dual theme via `[data-rv-theme="dark"] .rv-page`. All component CSS is driven by `--rv-*` tokens
  from `@labspangaea/ds-tokens`.
- Type: Clash Display (display) / Geist (body) / Geist Mono.

**Non-negotiables.**
- **Zero visual drift** from pangaea.id's `revamp.css` — components ship the proven `rv-*` CSS, not
  a re-authored Tailwind rewrite. Check the live site's CSS before changing a component.
- **WCAG AA** on every text/background pair, both themes.
- Components ship precompiled CSS off `--rv-*` vars (consumable without Tailwind); peer-react only.
- Controls in the gallery stay **exhaustive** (one knob per scalar prop; arrays use JSON controls).

**Out of scope (deferred, documented in the plan):** runtime module federation, the pangaea.id
micro-frontend split, migrating the live site off `revamp.css`.
