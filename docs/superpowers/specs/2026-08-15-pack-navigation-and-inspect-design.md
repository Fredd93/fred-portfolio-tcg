# Pack-opening navigation + inspect — design

## Problem

The pack-opening flow (`src/views/PackOpeningView.jsx`) is currently strictly
linear and read-only:

- Once a card is flipped and you click "Next card →", there's no way back to
  a card you already revealed — the only way to see it again is to finish
  the whole pack and look at the flattened `#/pack/done` summary grid (icons
  + names only, no stats).
- A revealed card can't be inspected further mid-pack. The full project
  detail — attacks, weakness/resistance, flavor text, the "View repo" link
  — only exists in `CardModal`, which today only opens from the gallery
  (`GalleryView.jsx`). There's no way to open it while still inside the
  pack-opening flow.

## Goals

- Let the user revisit any card they've already revealed during the current
  pack-opening session, via on-screen arrow buttons and the keyboard
  (`ArrowLeft` / `ArrowRight`).
- Let the user open the existing project detail modal on a revealed card
  without leaving the pack flow.
- Do this without touching the URL grammar established in
  `docs/superpowers/specs/2026-08-14-hash-routing-design.md` — every pull
  position already has a stable `#/pack/<n>` URL; this feature is about
  moving between positions that are already addressable, not adding new
  addressable states.

## Non-goals

- No new URL route shapes. Arrow navigation reuses the existing
  `navigate('#/pack/<n>')` call already used by "Next card →".
- No forward-skipping past cards that haven't been flipped yet. Reaching a
  brand-new card still requires the deliberate Flip → Next click flow — the
  reveal suspense is intentional and this feature doesn't undercut it.
- No inspect modal for supporter/energy pull items — they already show all
  their information on the compact card face. Only project-kind pulls open
  `CardModal`.
- No sitewide keyboard-focus audit. Only the new interactive elements this
  feature introduces (the two arrow buttons, and revealed cards becoming
  clickable) get visible `:focus-visible` styling.
- The pack-inspect modal's open/closed state is not part of the URL. It's a
  transient overlay on whichever pull is already showing at the current
  `#/pack/<n>` — unlike the gallery's modal (which needed a deep link so a
  specific project could be shared), there's no case here for linking
  directly to "pull 3, modal open" as distinct from "pull 3".

## Behavior

**Furthest-reached tracking:** a new piece of local state in
`PackOpeningView`, `highestReached` — the highest pull index revealed this
pack-opening session (i.e., since the pack was last opened or reset).
Initialized to the current `cursor` on mount, bumped whenever `pull`
advances past it, reset to `0` whenever `resetPack()` navigates back to
`#/pack`. This is local component state, not routed — the plan's existing
5-shape grammar already makes every position addressable; this is purely an
in-session bound on how far forward the arrow controls will go.

**Left arrow:** enabled whenever `cursor > 0`; navigates to
`#/pack/${cursor - 1}`.

**Right arrow:** enabled only while `cursor < highestReached` (i.e.,
revisiting a card already seen this session); navigates to
`#/pack/${cursor + 1}`. Disabled — not hidden, so the control row doesn't
shift width — once `cursor === highestReached` (the frontier). Reaching a
new card still requires Flip → Next, unchanged from today.

**Keyboard:** `ArrowLeft` / `ArrowRight` keydown perform the same navigation
as the on-screen buttons, active only while `stage === 'revealing'`. No
effect during `closed`, `opening`, or `done` stages. Both arrow keys call
`event.preventDefault()` when they act, to avoid interfering with page
scroll; when disabled (at either boundary) they no-op without
preventing default.

**Revisit rendering:** navigating to an already-revealed pull index shows
the card already flipped immediately — no replay of the flip animation.
`FlipCard`'s `flipped` prop is already driven by `PackOpeningView`'s local
`flipped` state, which currently resets to `false` on every `pull` change
(`useEffect(() => setFlipped(false), [pull])` in the existing code). That
reset needs to become conditional: `flipped` should initialize to `true`
when navigating to an index `< highestReached` (already seen), and `false`
when navigating to the new frontier (`cursor === highestReached`, not yet
flipped this visit).

**Click-to-inspect:** once a project-kind card is flipped
(`item.kind === 'project' && flipped`), clicking it opens `CardModal` with
that pull's `item.data` as the `project` prop — the same component and
props shape `GalleryView` already uses. Closing the modal (via the existing
`✕` button or backdrop click) just closes it locally; it does not call
`navigate(...)`, since there's no route change involved. Non-project pulls
(supporter/energy) and not-yet-flipped cards keep today's behavior:
clicking a not-yet-flipped card still flips it (existing `FlipCard` `onClick`
behavior, unchanged); clicking a flipped non-project card does nothing, as
today.

## Architecture

**`src/views/PackOpeningView.jsx`** (modified):
- Add `highestReached` state (`useState`, initialized from `cursor`) and the
  effect that bumps it as `pull` advances, plus the reset in `resetPack()`.
- Change the `flipped`-reset effect to set `flipped` based on whether the
  new `cursor` is below `highestReached` (already seen → `true`) or at the
  frontier (→ `false`), instead of unconditionally `false`.
- Add `prevPull()` / `nextPull()` handlers wired to two new arrow buttons
  rendered alongside the existing `reveal-controls` row, and to a
  `keydown` listener (added/removed via `useEffect`, scoped to
  `stage === 'revealing'`).
- Add local `inspecting` boolean state (or store the inspected project
  directly) to control a `CardModal` rendered in the `revealing` stage.

**`src/components/FlipCard.jsx`** (modified):
- Currently `onClick={() => !flipped && onReveal?.()}` only handles the
  not-yet-flipped case. Add a second branch: when already flipped and the
  item is project-kind, call a new `onInspect?.()` callback instead of
  no-op. `PackOpeningView` passes this through to open its local `CardModal`
  state.

**`src/components/CardModal.jsx`** (unchanged): reused as-is. It already
takes `{ project, onClose }`; `PackOpeningView` supplies its own `onClose`
that clears local state instead of calling `navigate`.

**New CSS** (`src/styles/pack.css`): two arrow-button styles (reusing the
existing `.pack-btn` visual language where sensible) with disabled-state
styling and a `:focus-visible` ring, plus a `:focus-visible` ring on the
now-conditionally-clickable card face.

## Error handling / edge cases

- `highestReached` can never legitimately be less than `cursor` on mount —
  if a user deep-links directly to `#/pack/7` without having pulled 0-6
  this session, `highestReached` still initializes to `7` (the current
  cursor), so the left arrow correctly lets them browse backward through
  0-6 even though they didn't "earn" that view through the flip flow. This
  is intentional and consistent with the existing routing spec's stance
  that any `#/pack/<n>` is already directly and freely accessible by URL —
  arrow-left is not a stronger access control than the URL bar already is.
- If `pull` becomes `'done'` (pack finished) while `highestReached` is set,
  no special handling is needed — the `done` stage doesn't render arrow
  controls at all, and `resetPack()` (the only path back to `revealing`
  from `done` is via "Open another pack") resets `highestReached` to `0`.
- Rapid arrow-key repeat (holding the key down) is bounded by the existing
  `cursor`/`highestReached` comparison on every keydown — each press
  re-evaluates against current props, so it can't overshoot the frontier or
  go below `0`.

## Testing

No automated test framework exists in this repo (consistent with the prior
routing feature). Verification is `npm run build` per task plus a manual
QA pass covering: arrow buttons enable/disable correctly at both
boundaries; keyboard arrows perform the same moves; revisiting a prior pull
shows it pre-flipped with no animation replay; clicking a flipped project
card opens the modal with correct content; closing that modal does not
change the URL; supporter/energy cards remain non-clickable once flipped;
`highestReached` resets correctly on "Open another pack".
