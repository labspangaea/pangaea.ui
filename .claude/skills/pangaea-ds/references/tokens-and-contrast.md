# Tokens & contrast — the AA-critical reference

The palette source of truth is `packages/tokens/src/tokens.scss`, which emits CSS custom properties
under `.rv-page` (light) and `[data-rv-theme="dark"] .rv-page` (dark). Components must be driven by
these `var(--rv-*)` tokens — a token-driven rule gets dark mode for free; a hard-coded literal needs
a `[data-rv-theme="dark"]` twin.

## Palette (verified values)

| token | light | dark |
|---|---|---|
| `--rv-bg` | `#ffffff` | `#0e1626` |
| `--rv-bg-alt` | `#f4f8fd` | `#131e34` |
| `--rv-bg-tint` | `#eaf3fd` | `#18233f` |
| `--rv-ink` | `#203150` | `#eef3fb` |
| `--rv-ink-2` | `#46566f` | `#b3c0d6` |
| `--rv-ink-3` | `#5f6e88` | `#8493ac` |
| `--rv-brand` | `#203150` | `#34507e` |
| `--rv-accent` | `#3fa9f5` | `#4fb0f6` |
| `--rv-accent-ink` | `#1568b4` | `#7cc4fa` |
| `--rv-accent-soft` | `#e7f2fe` | `#16273f` |
| `--rv-line` | `rgba(32,49,80,.10)` | `rgba(255,255,255,.10)` |
| `--rv-line-2` | `rgba(32,49,80,.16)` | `rgba(255,255,255,.18)` |
| `--rv-focus` | `var(--rv-accent-ink)` | `var(--rv-accent)` |

Only two brand hex exist: navy `#203150` and electric blue `#3fa9f5`. `#1568b4` is the **accessible**
blue derived for text use. Status hues (green `#157a4f`-ish, red `#c0392b`) are semantic-only.

## The one rule that prevents most contrast bugs

**Blue text and meaning-carrying glyphs use `--rv-accent-ink`, never `--rv-accent`.**

- `--rv-accent` `#3fa9f5` on white = **2.56:1** → FAILS AA for text/non-text.
- `--rv-accent-ink` `#1568b4` on white = **5.72:1** → PASS. On `--rv-accent-soft` = 5.05:1.
- White **on** `--rv-accent-ink` = 5.72:1 → use accent-ink for solid blue fills with white text.
  In dark theme accent-ink is light (`#7cc4fa`), so flip the text dark, e.g.
  `[data-rv-theme="dark"] .rv-page .rv-chip--solid { background: var(--rv-accent-ink); color: #07101f; }`
  (≈8–10:1) — mirror the `.rv-btn--blue` dark flip in `packages/button/src/styles.css`.

Use `--rv-accent` only where it's a **fill / track / border** that already clears 3:1 (e.g. a
gradient bar, a focus ring in dark, a featured card ring). The focus ring is tokenized as
`--rv-focus` (accent-ink in light = 5.36:1 on the panel; accent in dark = 7.03:1).

## Other verified facts worth not re-deriving

- Body/heading ink is strong: `--rv-ink` 12.99:1, `--rv-ink-2` 7.44:1 (light). `--rv-ink-3` clears
  AA on every surface it's used as text (≥4.84:1) — thin but passing; don't drop it lower.
- Semantic panels (callout, dodont, compare) are fully dual-themed and AA in both themes — when you
  add a status variant, give it both a light and a `[data-rv-theme="dark"]` value.
- `--rv-accent-soft` `#e7f2fe` (light) / `#16273f` (dark) is the soft-blue tile/panel fill. Pair it
  with `--rv-accent-ink` text/glyphs (5.05:1), not `--rv-accent`.
- Don't hard-code a literal that already equals a token (`#1568b4`, `#e7f2fe`, their dark values) —
  use the token so it stays in sync and carries dark automatically.

## When you change a color

1. Identify the text/background pair and compute the WCAG ratio in **both** themes.
2. Body needs ≥4.5:1; large text (≥18px or bold ≥14px) and non-text (icons, borders, focus) ≥3:1.
3. If it's even close, move toward the ink end — light gray "for elegance" is the #1 reason these
   designs become hard to read.
