# Mobile / dynamic pass — gyroscope tilt + responsive audit

## Problem

Two prior specs deliberately deferred mobile/dynamic work to "the later
mobile/dynamic design pass":

1. `docs/superpowers/specs/2026-08-16-reverse-holo-effect-design.md`
   (Non-goals) explicitly deferred `DeviceOrientationEvent`-based gyroscope
   tilt — the phone-tilt-to-see-holo-shine effect you get holding a real
   foil card — citing iOS permission-prompt friction and implementation
   surface beyond that pass's "cheap" bar. That pass shipped touch-drag
   tilt only (dragging a finger across a card reuses the existing
   hover-driven tilt/shine mechanism).
2. PR #9's final review flagged, unverified: `.legend-item` is
   `display:flex` with default `flex-wrap:nowrap` on the item's own inline
   content (`src/styles/layout.css:60`), and the Rarity Guide's legend
   lines got noticeably longer in that PR (e.g. `★★ SIR — flagship #2 —
   solo, professional, end to end`). Nobody re-checked a narrow (~375px)
   viewport after the copy grew.

This pass resolves both, plus a general responsive audit of the gallery.

## Research: real TCG holo-tilt conventions

Web holo-card demos (e.g. simeydotme's `pokemon-cards-css`, the reference
implementation most reverse-holo/shine effects online are modeled on) use
a single explicit "enable tilt" tap on touch devices, never a silent
auto-start. This matches the platform constraint: iOS Safari requires
`DeviceOrientationEvent.requestPermission()` to be called from a user
gesture, or the browser silently withholds orientation events. There is no
authentic or technically possible "just works" auto-gyro path on iOS — an
opt-in control is both the authentic convention and the only thing that
works cross-browser.

## Decision

### 1. Gyroscope tilt (opt-in, global toggle)

**Control**: a pill button, `Enable motion tilt`, rendered in `top-nav`
next to the view tabs. Shown only when
`matchMedia('(hover: none) and (pointer: coarse)').matches` — i.e. only on
touch-capable viewports. Never shown on desktop/mouse.

**State**: a `motionTiltEnabled` boolean lifted to `App.jsx`, passed down
through `GalleryView`/`PackOpeningView` to `Card`. Session-only (no
persistence across reloads — matches the "cheap" bar carried over from the
2026-08-16 pass).

**Permission flow** (on tap):
- If `typeof DeviceOrientationEvent.requestPermission === 'function'`
  (iOS Safari): call it. On `'granted'`, attach the listener and flip
  `motionTiltEnabled` to `true`. On `'denied'` or a thrown error, show a
  brief inline message next to the pill ("Motion access denied — using
  touch-drag instead") and leave `motionTiltEnabled` at `false`.
- Otherwise (Android Chrome and any browser without the permission gate):
  attach the `deviceorientation` listener directly and flip
  `motionTiltEnabled` to `true` — no prompt exists to wait for.
- If `window.DeviceOrientationEvent` is undefined entirely (no sensor
  support), the pill still renders (touch-capable viewport) but tapping it
  shows the same denial message immediately without attempting to attach
  a listener.

**Card tilt source switch**: `Card.jsx`'s `updateTilt(clientX, clientY)`
stays as the function that writes `--mx`/`--my` and the `rotateX`/`rotateY`
transform — untouched, so the shine/tilt CSS needs no changes. What feeds
it changes:
- Touch-drag (`handleTouchStart` + the `nativeTouchMove` listener) stays
  exactly as shipped in the 2026-08-16 pass, and remains the active input
  source whenever `motionTiltEnabled` is `false` (the default, and the
  fallback after a permission denial).
- When `motionTiltEnabled` is `true`, a new `deviceorientation` listener
  (attached once at the `App.jsx` level, not per-card — one listener,
  fanned out) computes a synthetic `clientX`/`clientY`-equivalent from
  `event.beta` (front-back tilt, roughly -180..180) and `event.gamma`
  (left-right tilt, roughly -90..90), clamped to a comfortable range
  (e.g. ±20° maps to the same 0-100% range touch-drag already produces),
  and calls the *currently-touched or most-recently-interacted* card's
  `updateTilt`. Simpler alternative, chosen for this pass: apply the
  orientation delta to *all* visible cards' `--mx`/`--my` simultaneously
  (matches the real-world feel of tilting a whole page of cards, and
  avoids needing to track "which card is active" on a touch device where
  there's no hover state to disambiguate).
- While `motionTiltEnabled` is `true`, the touch-drag handlers
  (`onTouchStart`/`nativeTouchMove`) are no-ops (early-return), so the two
  input sources never fight over the same transform.

**Non-goals**: no per-card toggles, no localStorage persistence, no
settings/preferences panel, no fallback animation beyond the one denial
message, no change to desktop mouse-hover tilt.

### 2. Responsive audit (375px / 768px)

**Confirmed fix — Rarity Guide legend** (`src/styles/layout.css:60`):
`.legend-item` is `display:flex`; its content (`● `, `<b>Common</b>`,
` — academic build, supporting role`) is one contiguous run of inline
nodes, which flexbox wraps into a single anonymous flex item. That item's
default `min-width:auto` makes it refuse to shrink below its max-content
width, so on PR #9's longer legend lines the item overflows a 375px
viewport instead of wrapping its text, causing horizontal scroll.

Fix: add `min-width:0;max-width:100%;` to `.legend-item` in
`src/styles/layout.css`. This lets the anonymous inline box shrink and
wrap text normally, and caps it at the `.legend` container's width. No
JSX change.

**Audited, no fix needed** (checked `src/styles/layout.css`,
`src/styles/card.css`, `src/styles/pack.css` against 375px and 768px):
- `.hero`, `.top-nav-inner`, `.type-chart`, `.pull-progress`,
  `.pull-actions` already use `flex-wrap:wrap` or an existing `@media`
  rule and hold up at both breakpoints.
- `.supporter-grid`'s `minmax(300px,1fr)` fits inside a 375px viewport's
  content width (`335px` after `.wrap`'s `20px` side padding).
- `.tcg-card-wrap` is a fixed `260px`; `.grid`'s `flex-wrap:wrap` drops to
  one column on narrow viewports — intentional, not broken.
- `.etb-pack` already has a `max-width:420px` media rule scaling it to
  `88vw`.

If manual QA (see Testing) turns up any other overflow not caught by this
static read, fix it inline as part of this pass rather than deferring
again — but no other issue is expected based on the audit above.

## Architecture

**`src/App.jsx`** (modified):
- New `motionTiltEnabled` state (`useState(false)`).
- New `handleEnableMotionTilt` — runs the permission flow described above,
  sets `motionTiltEnabled`, and on failure sets a
  `motionTiltError` message string (cleared on next tap).
- One `deviceorientation` window listener, added/removed via `useEffect`
  keyed on `motionTiltEnabled`, that computes `(mx, my)` from
  `beta`/`gamma` and calls a new exported helper (see `Card.jsx` below) to
  push the value to every mounted card.
- Passes `motionTiltEnabled` down to `GalleryView`/`PackOpeningView` →
  `Card` as a prop.

**`src/App.jsx`** (the `top-nav` markup lives here, not a separate
component): new pill button next to the view tabs, touch-only (via the
`matchMedia` check above, re-evaluated on mount), wired to
`handleEnableMotionTilt`; renders the denial message inline when
`motionTiltError` is set.

**`src/components/Card.jsx`** (modified):
- Accepts a new `motionTiltEnabled` prop.
- `handleTouchStart` and the `nativeTouchMove` listener early-return when
  `motionTiltEnabled` is `true`.
- Exposes its `updateTilt` via a ref-registry pattern (or a lightweight
  pub/sub) so `App.jsx`'s single `deviceorientation` listener can drive
  all mounted cards without each card owning its own orientation
  listener — avoids N listeners for N cards.

**`src/styles/layout.css`** (modified):
- `.legend-item{min-width:0;max-width:100%;}` added to the existing rule
  at line 60.

## Testing

No automated test framework exists in this repo (consistent with prior
passes). Verification is `npm run build` plus manual QA:

- Resize the browser to 375px and 768px: Rarity Guide legend wraps
  cleanly with no horizontal scroll; spot-check the rest of the gallery
  (hero, grid, supporter cards, energy cards, type chart, footer, pack
  view) for overflow at both widths.
- Enable the browser's touch-emulation mode: the "Enable motion tilt"
  pill appears in `top-nav`; it is absent in normal (mouse) mode.
- Before tapping the pill: dragging a finger across a card still tilts it
  via the existing touch-drag path (unchanged from the 2026-08-16 pass).
- Tap the pill: permission flow runs (or attaches directly, depending on
  emulated platform); tilt input source switches to orientation-driven;
  touch-drag no longer moves the tilt on its own.
- Simulate a permission denial (where the emulator allows it): the inline
  message appears and touch-drag remains active.
- Desktop: pill is absent; mouse-hover tilt is pixel-for-pixel unchanged
  from before this pass.
