# Hash-based routing / deep links — design

## Problem

The whole app lives in a single in-memory `view` state (`App.jsx`), plus local
state inside `PackOpeningView` (pull cursor, flip/stage) and `GalleryView`
(active card modal). There is exactly one URL for the entire site. Consequences:

- No way to link someone straight to a specific project card (e.g. "look at
  my Jericho card") — they always land on the pack-opening intro.
- Refresh or browser back/forward always resets to the initial pack-closed
  state; there's no way to navigate "back" out of the gallery or a modal.

This is now live on GitHub Pages (a static host with no server-side rewrite
support), which rules out clean-path routing without a 404-redirect hack.

## Goals

- Every meaningful screen state gets its own shareable, bookmarkable,
  refresh-safe URL.
- Browser back/forward works naturally.
- No new dependency — the route surface is small (5 route shapes).

## Non-goals

- Whether an individual card is currently *flipped* mid-reveal is not part
  of the URL — it's ephemeral interaction state, reset on navigation to a
  pull. This preserves the "tap to flip" reveal gesture even when a pull
  index is loaded directly from a URL.
- Hover-tilt transform state (`Card.jsx`) stays local component state —
  never bookmarkable, not relevant here.

## URL grammar

Hash-based, since GitHub Pages serves everything from one `index.html` and
hash changes never hit the server:

| Hash                  | Meaning                                                              |
|------------------------|-----------------------------------------------------------------------|
| `` / `#` / `#/`         | Pack view, unopened (`stage: 'closed'`)                              |
| `#/pack`                | Same as above                                                         |
| `#/pack/<n>`             | Pack opened, currently on pull index `n` (0-based), unflipped        |
| `#/pack/done`            | Pack finished — full pull summary shown                              |
| `#/gallery`              | Full collection view, no modal open                                  |
| `#/gallery/<cardId>`     | Full collection view with that project's `CardModal` open            |

Invalid/out-of-range values (bad `cardId`, `n` outside `[0, total)`) fall
back to that view's default (`#/pack` or `#/gallery` respectively) rather
than erroring.

## Architecture

**New: `src/hooks/useHashRoute.js`**

A small hook, no dependency:

- Parses `window.location.hash` into a plain route object:
  `{ view: 'pack' | 'gallery', pull: number | 'done' | null, card: string | null }`
- Subscribes to the native `hashchange` event so browser back/forward and
  manual URL edits update the parsed route (cleans up listener on unmount).
- Exposes `navigate(hash: string)` which does `window.location.hash = hash`
  — assigning to `location.hash` natively pushes a new history entry, so
  back/forward "just work" without any manual history-stack management.

**`App.jsx`**

Becomes the single owner of routing:
- Calls `useHashRoute()`.
- Renders `PackOpeningView` or `GalleryView` based on `route.view`.
- Passes the relevant slice of route state down as props, plus a `navigate`
  callback (or the tab buttons call `navigate('#/pack')` / `navigate('#/gallery')`
  directly — implementation detail for the plan step).

**`PackOpeningView.jsx`**

- `cursor` is now derived from `route.pull` (`null` → closed / not yet
  opened; a number → that pull; `'done'` → summary stage) instead of local
  `useState`.
- `flipped` stays local `useState` — resets to `false` whenever `route.pull`
  changes.
- `openPack()`, `next()`, `resetPack()` call `navigate(...)` with the new
  hash instead of local setters. The existing `opening` transition (the
  750ms tear-open animation) stays local transient state — it's not a
  distinct addressable route, just an animation beat before landing on
  `#/pack/0`.

**`GalleryView.jsx`**

- `active` project is derived from `route.card` (look up in `PROJECTS` by
  id) instead of local `useState`.
- `Card` `onClick` calls `navigate('#/gallery/' + project.id)`.
- `CardModal`'s `onClose` calls `navigate('#/gallery')`.

## Error handling

- Unknown `cardId` in `#/gallery/<cardId>`: `useHashRoute` resolves `card`
  to `null` if the id isn't found in `PROJECTS` at parse time, so the modal
  simply doesn't open (no crash, no visible error).
- `pull` index outside `[0, total)`: clamped to `null` (closed) by the hook,
  since `PACK_ORDER`'s length is fixed and known at parse time.

## Testing

- Manual verification in the browser (no existing test suite in this repo):
  navigate each route shape directly via URL bar, confirm correct render;
  confirm back/forward between pack ↔ gallery ↔ modal-open behaves as
  expected; confirm invalid hashes (`#/gallery/nonsense`, `#/pack/999`)
  fall back gracefully instead of erroring.
