# pangaea.ui — Pangaea Design System

The Pangaea two-hex blue-on-white system (navy `#203150` + electric blue `#3FA9F5`, on
white, dual-theme) — shipped as **independently versioned `@pangaea/ds-*` packages** with an
Astro **gallery** that catalogs them. Tokens are ported verbatim from
[`pangaea.id`](../pangaea.id) (`DESIGN.md` / `revamp.css`), so there is zero visual drift from
the live site.

Modeled structurally on the Kanvo gallery (Astro + Tailwind v4 + SCSS tokens), extended with
**per-component versioning** (Changesets) that Kanvo doesn't have.

## Topology — one repo, many packages, one registry

```
pangaea.ui/
  packages/
    tokens/    @pangaea/ds-tokens   SCSS token source → CSS vars (light+dark) + Tailwind v4 preset + self-hosted fonts
    button/    @pangaea/ds-button   pill button, 3 variants, press feedback
    card/      @pangaea/ds-card     hairline border, soft shadow, hover lift
    section/   @pangaea/ds-section  Container · Section · Grid · Kicker · H1/H2 · Lead · SectionHead · heroAccent()
    chart/     @pangaea/ds-chart    theme-aware Chart.js wrapper (reads --rv-* live)
  apps/
    gallery/   @pangaea/gallery     the /gallery catalog (Astro island; not published)
```

Each component is its **own package with its own version**, all published to **one** registry
(`@pangaea` on GitHub Packages). This is the standard per-component-versioning shape (Radix/MUI/
Chakra) — not a repo-per-component polyrepo, and not one monolithic package.

## Federation-ready, federation-not-built (deliberate)

Per-component versioning is ~90% of the way to module federation, so the packages are built to
keep that door open at near-zero cost — but **no federation machinery is built** (YAGNI):

- `react`/`react-dom` are **peerDependencies** in every package (→ future `shared: { react: singleton }`).
- **Tokens are their own package** (`@pangaea/ds-tokens`) that components depend on (→ the future MF shared singleton).
- Each package is **isolated ESM** with a clean barrel `exports` (→ that list is the future `exposes:`).
- CSS ships as a **plain `styles.css`** per package (not imported in JS) — consumable by the
  non-Tailwind `pangaea.id` today, and self-contained for a future remote.

When (if) a component needs runtime federation later, it's bolt-on: add `@module-federation/vite`
+ `exposes`, stand up a resolver (DIY `versions.json` + `semver`, or Zephyr). **Caveat:** runtime
MF is client-side → crawler-blind, so it's for app-like islands, never the prerendered SEO pages.
See the plan for the full exploration.

## Commands

```bash
npm install            # install the workspace (npm workspaces — no pnpm needed)
npm run build:pkgs     # build the 5 ds-* packages (sass for tokens, tsc for components)
npm run gallery        # astro dev → http://localhost:4321/gallery  (the catalog, #Chart etc.)
npm run build          # build packages + the gallery (static)
```

> Toolchain note: the plan named pnpm, but this environment ships only npm — which does
> workspaces + Changesets fine, so the repo uses **npm workspaces**. Swap to pnpm later by
> adding `pnpm-workspace.yaml` and changing `"*"` internal deps to `workspace:*`.

> CSS note (a deliberate ponytail simplification): components ship the **proven `rv-*` CSS**
> off the `--rv-*` tokens (zero visual drift, AA-safe, consumable without Tailwind). Tailwind v4
> is adopted at the **gallery + `@pangaea/ds-tokens/theme.css` preset** layer — the
> "adopt Kanvo stack" choice, without re-authoring a working AA-critical system as utility soup.

## Release flow (per-component publishing)

1. Edit a `packages/<comp>`.
2. `npm run changeset` → declare which package(s) bumped + semver level + a changelog line.
3. Merge to `main` → CI (`.github/workflows/release.yml`) opens a **"Version Packages"** PR that
   bumps **only the changed** packages + writes changelogs (Changesets).
4. Merge that PR → CI **publishes only the changed packages** to GitHub Packages (`@pangaea`).
5. Consumers pin a range (`"@pangaea/ds-button": "^1.2.0"`). A Renovate bump PR + the consumer's
   device-matrix CI gate it → auto-merge on green → redeploy. **Automatic, but gated** — never
   ungated-to-prod.

## How `pangaea.id` consumes it (later)

`apps/labs` adds an `.npmrc` (`@pangaea:registry=…github`) + the `@pangaea/ds-*` deps it uses,
imports them at **build time**, and `vite-react-ssg` prerenders them → HTML stays complete for
crawlers, CSP stays clean, deploy stays static (the SEO-safe model). `revamp.css` is then
progressively replaced (the `--rv-*` names are kept, so migration is mechanical).

## Components (37 + tokens)

Site-gap blocks ported faithfully from the live site (`revamp.css`): `ds-stat` (proof/metric) ·
`ds-pillar` · `ds-points` · `ds-dodont` (green/red) · `ds-compare` · `ds-checklist` ·
`ds-references` (Cite/Sources) · `ds-table` · `ds-archflow`.

Core:

`ds-tokens` · `ds-button` · `ds-card` · `ds-section` (+ `heroAccent`) · `ds-chart` ·
`ds-navbar` · `ds-badge` (accent/solid/success/warning/red/soon) · `ds-callout` · `ds-quote` ·
`ds-field` (Input/Textarea/Select/Checkbox/Radio) · `ds-toggle` (Switch/LangToggle/ThemeToggle) ·
`ds-tabs` · `ds-pagination` (numbered + `PaginationNav` URL pager) · `ds-accordion` · `ds-code` ·
`ds-tooltip` · `ds-modal` (native `<dialog>`) · `ds-progress` · `ds-avatar` · `ds-filedropzone` ·
`ds-hero` · `ds-testimonial` · `ds-cta` · `ds-social` · `ds-pricing` · `ds-stepper`
(horizontal/vertical timeline) · `ds-teamcard` · `ds-logowall` · `ds-plugincard`.

## Gallery (Storybook-style explorer)

`apps/gallery` is a **3-pane component explorer** (no Storybook dependency — built in the Astro
React island): **left** = grouped component menu · **center** = isolated live canvas (dotted
backdrop) · **right** = **Controls** (an *exhaustive* knob per scalar prop) + a **copyable Usage**
snippet that updates from the controls + an **Info** panel. Light/dark toggle + EN/ID in the
toolbar; deep-links via `#<component>`. Each story declares its controls in
`src/gallery/stories.tsx` — keep them exhaustive when you add a component.

## Status

- 23 packages build clean (`npm run build:pkgs`). Gallery builds static (`npm run build`).
- Playwright-validated: 3-pane explorer, controls reactive (variant→canvas+usage), light **and**
  dark, responsive (desktop 3-pane → tablet 2-pane → mobile chip menu), **0 console errors, 0
  overflow** at 1440 and 390.
- Static impeccable audit: **17/20** (A11y 3 · Perf 3 · Theming 4 · Responsive 3 · Anti-patterns 4).
- Wave 2 (queued): social icons, pricing block, client/partner/plugin/team card variants,
  timeline/stepper (horizontal + vertical).
- Before first publish: `git init` is done — set the `@pangaea` GitHub Packages registry +
  `NODE_AUTH_TOKEN` in CI, then `npm run changeset` for the initial `0.1.0` release.
