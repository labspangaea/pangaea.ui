# Motion conventions (Emil Kowalski, as applied here)

Motion in this DS is intentional and restrained. The fundamentals are already enforced system-wide;
when you add or change a component, match them rather than inventing new curves or timings.

## The system defaults (don't deviate without reason)

- **One easing:** `--rv-ease: cubic-bezier(0.22, 0.61, 0.36, 1)` — a clean ease-out. Never use
  `ease-in` (it delays the first frame, the moment the user is watching, so it feels sluggish).
  Never `transition: all` (name the properties).
- **Animate `transform` / `opacity` / color only.** These skip layout+paint (GPU). Animating
  `width`/`height`/`margin` triggers the full pipeline.
- **Durations stay under 300ms** for UI. Button press 90–160ms, tooltips ~125–200ms, dropdowns
  150–250ms, modals/drawers 200–300ms. The switch slide is 150ms; the testimonial entrance 300ms.
- **Every animation has a reduced-motion fallback:** wrap keyframe/transform animations so
  `@media (prefers-reduced-motion: reduce)` drops to `animation: none` (or a crossfade). This is not
  optional — motion can cause sickness, and headless/hidden-tab renders skip transform reveals.

## Press feedback — every pressable

Any pressable (button, tab, pager, segment, icon-button, dot, social link, copy) answers a press:

```css
.thing { transition: transform 0.12s var(--rv-ease); }   /* transform must be IN the transition */
.thing:active { transform: scale(0.96); transition-duration: 0.09s; }   /* fast press, eased not snapped */
```

Keep the scale subtle (0.92 for small icon-buttons, 0.96–0.97 for text controls). If `transform`
isn't in the base `transition`, the press **snaps** instead of easing — add it. The press should
register before the action's result does; that's what makes the UI feel like it's listening.

## Entrances — never from nothing

Enter from `scale(0.96)` (or a small `translateY`) + opacity, **never `scale(0)`** — nothing in the
real world appears from nothing. Tooltip/modal/accordion/testimonial all do this.

## Popovers are origin-aware; modals are not

A popover/tooltip should grow **out of its trigger**, so set `transform-origin` to the edge nearest
the trigger — per placement:

```css
.rv-tooltip--top    .rv-tooltip-pop { transform-origin: bottom center; }
.rv-tooltip--bottom .rv-tooltip-pop { transform-origin: top center; }
.rv-tooltip--left   .rv-tooltip-pop { transform-origin: center right; }
.rv-tooltip--right  .rv-tooltip-pop { transform-origin: center left; }
```

**Modals are the exception** — they're viewport-centered, not anchored, so they keep
`transform-origin: center`. (Note: these placements use the `translate:` property for axis
centering, which is separate from `transform:`, so `transform-origin` won't disturb centering.)

## Hover-lifts must be gated for touch

Touch devices fire `:hover` on tap and the element **stays** hovered — so any hover that *moves* the
element (translate/scale lift) gets stuck. Gate the movement-bearing hover behind:

```css
@media (hover: hover) and (pointer: fine) {
  .rv-card:hover { transform: translateY(-3px); box-shadow: var(--rv-sh-md); }
}
```

Desktop (true hover) is unaffected; touch loses the sticky lift. Color/border-only hovers don't need
gating (they revert on the next tap and don't move anything).

## What's already correct — keep, don't "fix"

- Modal's centered origin, all `scale(0.96)`/`translateY` entrances, the single ease-out curve, the
  fast-release press on `.rv-btn` (scale 0.96 + `transition-duration: 0.09s`), and complete
  reduced-motion coverage. New components should mirror these, not introduce alternatives.

## Optional, not done by default

Strengthening `--rv-ease` to `cubic-bezier(0.23, 1, 0.32, 1)` gives entrances more punch, but it's a
system-wide visual shift — only do it deliberately, not per-component.
