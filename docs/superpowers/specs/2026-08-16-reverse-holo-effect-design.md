# Reverse holo effect + touch-drag tilt — design

## Problem

`Card.jsx`/`card.css` renders a single `.holo-shine` overlay that covers
the entire `.tcg-face`, shown on hover for every non-common rarity
(`.rarity-common .holo-shine{display:none}` is the only exclusion). This
means Holo Rare and Reverse Holo currently render an identical shine
effect — there is no visual distinction between the two rarities, even
though they're meant to look different.

Separately, the existing tilt/shine interaction (`Card.jsx`'s
`handleMove`/`handleLeave`) is driven entirely by `onMouseMove` —
touch devices get no tilt and no shine reveal at all, since CSS `:hover`
doesn't reliably fire on tap-and-hold across mobile browsers.

## Goals

- Give Holo Rare and Reverse Holo visually distinct shine behavior,
  matching the real TCG convention: regular holo foil sits **only on the
  illustration**; reverse holo foil sits **on everything except the
  illustration** (frame, text, background shimmer; the art itself stays
  flat).
- Add cheap touch-drag tracking so the same tilt/shine interaction works
  on touch devices by dragging a finger across the card, reusing the
  existing hover-driven mechanism rather than building something new.

## Non-goals

- No gyroscope/device-tilt support (`DeviceOrientationEvent`) — that
  requires permission prompts (notably on iOS) and materially more
  implementation and testing surface than the "cheap" bar the user set
  for this pass. Explicitly deferred, along with the rest of true
  mobile/responsive work, to the later mobile/dynamic design pass.
- No new shine gradient, color palette, or animation timing — both
  rarities reuse the exact shimmer gradient already defined in
  `.holo-shine` (`linear-gradient(115deg, transparent 25%, #ffe07a 38%,
  #ff9ecb 46%, #9ecbff 54%, #9effc7 62%, transparent 75%)`). Only *where*
  the shine is visible changes, not its appearance.
- No change to IR/SIR/SSIR (full-art) cards' shine — those already show
  the whole-card shine, which is authentic for full-art rares (the whole
  card *is* the illustration in that tier), and no full-art card has an
  `.art` element to reason about anyway. Out of scope for this pass.
- No change to `.rarity-common` (unchanged — no shine, as today).

## Behavior

**Holo Rare** (`rarity: 'holo'` — classic layout only): the shine is
confined to the `.art` element (the illustration window) instead of the
whole card face. The existing whole-card `.holo-shine` is hidden for this
rarity; a new overlay, scoped to `.art`, takes its place — same gradient,
same hover-driven positioning, just a smaller box.

**Reverse Holo** (`rarity: 'reverseholo'` — classic layout only, currently
only Grand Transmission Auto): the existing whole-card `.holo-shine` stays
as-is, but `.art` is raised above it in paint order (`.art` already has an
opaque background, so this doesn't require any new visual element) — the
shine remains visible across the frame, text areas, and background, but
is occluded exactly where the illustration sits, giving the authentic
"foil everywhere except the art" look with no new DOM, no pixel-measured
clip paths, and no risk of drifting if `.art`'s size/position changes
later (the occlusion is relative, not hardcoded).

**Touch-drag tracking**: the tilt logic currently lives in one function,
`handleMove`, driven by `onMouseMove`'s `clientX`/`clientY`. It's
refactored into a shared "update tilt for this point" function called by
both the existing mouse handler and a new touch handler
(`onTouchMove`, reading `e.touches[0].clientX/clientY`), plus
`onTouchEnd`/`onTouchCancel` resetting the tilt the same way
`onMouseLeave` already does. Since CSS `:hover` doesn't reliably reflect
an active touch-drag, the touch handlers also toggle a `.tilting` class
on the card element for the duration of the touch, and the shine-reveal
CSS rules gain `.tilting` as an alternate trigger alongside the existing
`:hover` — additive only, no change to desktop hover behavior.
`touchmove` on the card calls `preventDefault()` so dragging a finger
across a card tilts it rather than scrolling the page underneath it.

## Architecture

**`src/components/Card.jsx`** (modified):
- `handleMove` is split into a shared `updateTilt(clientX, clientY)` used
  by both `handleMouseMove` (renamed from `handleMove`, unpacks
  `e.clientX`/`e.clientY`) and a new `handleTouchMove` (unpacks
  `e.touches[0].clientX/clientY`, no-ops if there's no active touch).
- New `handleTouchStart`/`handleTouchMove` add a `tilting` class to the
  card's className (or toggle it via a small piece of local state);
  `handleTouchEnd`/`handleTouchCancel` remove it and reset the tilt
  transform via the existing `handleLeave` logic.
- The card's outer element gains `onTouchMove`, `onTouchEnd`,
  `onTouchCancel` handlers alongside the existing `onMouseMove`/
  `onMouseLeave`.
- `CardFace`'s `.art` render (classic layout only) gains a nested overlay
  element for the holo-confined shine.

**`src/styles/card.css`** (modified):
- `.layout-classic .art` gains `position:relative` (needed for both the
  new nested art-shine overlay and the reverse-holo z-index occlusion).
- New `.art-shine` rule: same shimmer gradient/positioning logic as
  `.holo-shine`, sized to fill `.art` (`position:absolute;inset:0`),
  hidden by default (`display:none`), shown only under `.rarity-holo`.
- `.rarity-holo .holo-shine{display:none;}` — the whole-card shine is
  suppressed for Holo Rare now that `.art-shine` replaces it.
- `.rarity-reverseholo .art{z-index:4;}` — raises the illustration above
  the existing whole-card `.holo-shine`'s `z-index:3`, occluding the shine
  over the art's own rectangle without any new element or measurement.
- The existing `.tcg-card:hover .holo-shine{opacity:.5;}` rule (and the
  new art-shine equivalent) gain `.tcg-card.tilting` as an alternate
  selector, e.g. `.tcg-card:hover .holo-shine, .tcg-card.tilting
  .holo-shine{opacity:.5;}`.

## Testing

No automated test framework exists in this repo (consistent with prior
features). Verification is `npm run build` plus a manual QA pass: Holo
Rare cards show shine confined to the illustration only (not the text
frame); Reverse Holo (Grand Transmission Auto) shows shine across the
frame/text but not over the illustration; Common cards show no shine
(unchanged); full-art (IR/SIR/SSIR) cards' whole-card shine is unchanged;
touch-drag on a mobile viewport (or the browser's touch-emulation mode)
tilts the card and reveals the appropriate shine the same way mouse hover
does; touch-drag on a card doesn't scroll the page.
