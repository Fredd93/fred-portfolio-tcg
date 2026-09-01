# Trainer Card Art Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add two bespoke flat-vector "trainer" illustrations (E-Commerce Manager, ITIL 4 → 5 Transition) to the 2 Supporter cards, rendered above their existing text body in both places Supporter cards appear (gallery Trainer Deck, pack-opening flow), per `docs/superpowers/specs/2026-09-01-trainer-card-art-design.md`.

**Architecture:** A new registry file, `src/components/TrainerArt.jsx`, mirrors `MascotArt.jsx`'s exact contract (`{id}` → component resolver, returns `null` for unknown ids) but stays a separate file/registry since these are human Trainer figures, not creature mascots. Each `SUPPORTERS` entry in `cards.js` gains a `trainerArt` id field. Both Supporter render sites (`GalleryView.jsx`'s `.supporter` block, `PackCard.jsx`'s `SupporterFace`) insert `<TrainerArt id={...} className="supporter-art" />` between their existing header bar and body content — no restructuring of the existing text layout. Static only — no animation, no new JS event wiring (Supporter cards have no tilt/hover mechanism today and this pass doesn't add one).

**Tech Stack:** React 19, plain CSS (`src/styles/layout.css`, `src/styles/card.css`), inline SVG. No test framework in this project — verification is `npm run build` (catches syntax/import errors) plus manual browser check via the dev server.

**Spec:** `docs/superpowers/specs/2026-09-01-trainer-card-art-design.md`

## Global Constraints

- No new npm dependencies — plain inline SVG.
- No tilt/hover animation, no `data-tilt-frame` usage, no `prefers-reduced-motion` override — there is nothing animated to gate (spec Section "Out of scope").
- `CardModal.jsx` is untouched — Supporter cards aren't shown there.
- Both illustrations use the gold/amber "Trainer" palette (`#d9b23c`, `#f4de8e`, `#c99a3a`, `#e6c877`, `#4a3624`/`#6a4c30` hair, `#e8e2c8` glasses, `#7a5c3c` stubble) — not a project `TYPES` color (Supporter entries have no `type` field).
- Both figures share the same personal-likeness cues (dark wavy hair, rectangular glasses, light stubble shading) and the same head/torso construction, per spec Section 1.
- `project.icon`-style fallback pattern is not applicable here — Supporter entries have no prior icon field; `trainerArt` is a new, required field on both entries.

---

## File Structure

| File | Responsibility |
|---|---|
| `src/components/TrainerArt.jsx` (create) | `EcommerceTrainerArt`, `ItilTrainerArt` components + `TRAINER_ART` registry + `TrainerArt({id, className})` resolver. |
| `src/data/cards.js` (modify) | Add `trainerArt: 'ecommerce' \| 'itil'` field to each `SUPPORTERS` entry. |
| `src/views/GalleryView.jsx` (modify) | Import `TrainerArt`; render it inside the `.supporter` block. |
| `src/components/PackCard.jsx` (modify) | Import `TrainerArt`; render it inside `SupporterFace`. |
| `src/styles/layout.css` (modify) | `.supporter-art` band + per-illustration detail classes for the gallery render site. |
| `src/styles/card.css` (modify) | `.pack-supporter .supporter-art` sizing override for the pack-opening render site (its flip card is a different, fixed aspect ratio than the gallery `.supporter` block). |

---

### Task 1: `TrainerArt.jsx` scaffold, both render sites wired, E-Commerce Manager illustration

**Files:**
- Create: `src/components/TrainerArt.jsx`
- Modify: `src/data/cards.js:199` (ecommerce entry)
- Modify: `src/views/GalleryView.jsx`
- Modify: `src/components/PackCard.jsx`
- Modify: `src/styles/layout.css`
- Modify: `src/styles/card.css`

**Interfaces:**
- Produces: `TrainerArt({ id, className })` — resolves `id` (`'ecommerce' | 'itil'`) to the matching SVG component, renders `null` for unknown ids. Exported as default and named `{ TrainerArt }`.
- Produces: `TRAINER_ART` registry map (`{ ecommerce: EcommerceTrainerArt }` after this task; `itil` added in Task 2).
- Produces: `EcommerceTrainerArt({ className })`.
- Consumes (from `cards.js`): `s.trainerArt` in `GalleryView.jsx`, `data.trainerArt` in `PackCard.jsx`.

- [ ] **Step 1: Add the `trainerArt` field to the E-Commerce Manager entry**

In `src/data/cards.js`, find the `ecommerce` entry and change:

```js
  {
    id: 'ecommerce',
    name: 'E-Commerce Manager', sub: 'Middle East Motors · Cairo, Egypt', dates: 'Sept 2012 – Jun 2019 · 7 years',
    text: 'Led the digital transformation of a traditionally offline automotive business — built and ran online sales channels end to end. Grew the online customer base by 39,000 through SEO and social-media strategy. Delivered end-to-end website development, integrated CRM + e-commerce systems, and trained staff on digital sales strategy.',
    rule: 'You may play as many Leadership cards as you like during your turn.',
  },
```

to:

```js
  {
    id: 'ecommerce',
    name: 'E-Commerce Manager', sub: 'Middle East Motors · Cairo, Egypt', dates: 'Sept 2012 – Jun 2019 · 7 years',
    text: 'Led the digital transformation of a traditionally offline automotive business — built and ran online sales channels end to end. Grew the online customer base by 39,000 through SEO and social-media strategy. Delivered end-to-end website development, integrated CRM + e-commerce systems, and trained staff on digital sales strategy.',
    rule: 'You may play as many Leadership cards as you like during your turn.',
    trainerArt: 'ecommerce',
  },
```

- [ ] **Step 2: Create `TrainerArt.jsx` with the E-Commerce Manager illustration**

Create `src/components/TrainerArt.jsx`:

```jsx
// src/components/TrainerArt.jsx
// Bespoke flat-vector "trainer" illustrations for the 2 Supporter cards.
// Kept separate from MascotArt.jsx — these are human Trainer figures, not
// creature mascots. Mirrors MascotArt's { id } -> component resolver
// contract exactly. Static only, no animation.

export function EcommerceTrainerArt({ className = '' }) {
  return (
    <svg
      className={`trainer-art trainer-art-ecommerce ${className}`}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="E-Commerce Manager trainer, standing at a shop counter with a laptop"
    >
      <polygon className="ecom-t-roof" points="15,45 15,30 30,18 45,30 45,45" />
      <path className="ecom-t-torso" d="M40 90 Q40 55 50 55 Q60 55 60 90 Z" />
      <path className="ecom-t-arm" d="M40 65 Q28 68 26 78" />
      <path className="ecom-t-arm" d="M60 65 Q52 72 48 78" />
      <rect className="ecom-t-counter" x="25" y="68" width="50" height="12" rx="1" />
      <rect className="ecom-t-laptop" x="48" y="58" width="14" height="10" rx="1" />
      <line className="ecom-t-laptop-line" x1="50" y1="63" x2="60" y2="63" />
      <circle className="ecom-t-head" cx="50" cy="45" r="11" />
      <path className="ecom-t-hair" d="M38 40 Q40 28 50 26 Q60 28 62 40 Q64 33 59 30 Q54 24 50 25 Q46 24 41 30 Q36 33 38 40Z" />
      <path className="ecom-t-hair-wisp" d="M37 37 q3 -5 5 -2" />
      <path className="ecom-t-hair-wisp" d="M63 37 q-3 -5 -5 -2" />
      <rect className="ecom-t-glasses" x="40" y="44" width="8" height="6" rx="2" />
      <rect className="ecom-t-glasses" x="52" y="44" width="8" height="6" rx="2" />
      <line className="ecom-t-glasses" x1="48" y1="47" x2="52" y2="47" />
      <path className="ecom-t-stubble" d="M45 52 q5 3 10 0" />
    </svg>
  );
}

export const TRAINER_ART = {
  ecommerce: EcommerceTrainerArt,
};

export function TrainerArt({ id, className }) {
  const Art = TRAINER_ART[id];
  return Art ? <Art className={className} /> : null;
}

export default TrainerArt;
```

- [ ] **Step 3: Wire `TrainerArt` into `GalleryView.jsx`'s Supporter block**

In `src/views/GalleryView.jsx`, add the import alongside the existing component imports:

```js
import { TrainerArt } from '../components/TrainerArt.jsx';
```

Replace:

```jsx
            <div className="supporter" key={s.id}>
              <div className="supporter-top"><span>Trainer</span><span>Supporter</span></div>
              <div className="supporter-body">
```

with:

```jsx
            <div className="supporter" key={s.id}>
              <div className="supporter-top"><span>Trainer</span><span>Supporter</span></div>
              <TrainerArt id={s.trainerArt} className="supporter-art" />
              <div className="supporter-body">
```

- [ ] **Step 4: Wire `TrainerArt` into `PackCard.jsx`'s `SupporterFace`**

In `src/components/PackCard.jsx`, add the import:

```js
import { TrainerArt } from './TrainerArt.jsx';
```

Replace:

```jsx
function SupporterFace({ data }) {
  return (
    <div className="pack-supporter">
      <div className="ps-top"><span>Trainer</span><span>Supporter</span></div>
      <div className="ps-body">
```

with:

```jsx
function SupporterFace({ data }) {
  return (
    <div className="pack-supporter">
      <div className="ps-top"><span>Trainer</span><span>Supporter</span></div>
      <TrainerArt id={data.trainerArt} className="supporter-art" />
      <div className="ps-body">
```

- [ ] **Step 5: Add the `.supporter-art` band and E-Commerce styling to `layout.css`**

In `src/styles/layout.css`, append after the existing `.supporter-rule{...}` rule (after the line `.supporter-rule{border-top:1px solid #d9b23c55;padding-top:8px;font-size:10.5px;color:#c9b876;font-style:italic;}`):

```css
/* ---- Trainer card art: shared band ---- */
.supporter-art{
  display:block; width:100%; height:150px;
  background:#241f14;
}
.trainer-art{ width:100%; height:100%; display:block; overflow:visible; }

/* ---- Trainer card art: shared figure construction ---- */
.ecom-t-torso, .itil-t-torso{ fill:rgba(201,154,58,.4); stroke:#f4de8e; stroke-width:1.4; }
.ecom-t-head, .itil-t-head{ fill:#e6c877; stroke:#f4de8e; stroke-width:1.4; }
.ecom-t-hair, .itil-t-hair{ fill:#4a3624; stroke:#6a4c30; stroke-width:1; }
.ecom-t-hair-wisp, .itil-t-hair-wisp{ fill:none; stroke:#4a3624; stroke-width:2; stroke-linecap:round; }
.ecom-t-glasses, .itil-t-glasses{ fill:none; stroke:#e8e2c8; stroke-width:1.6; }
.ecom-t-stubble, .itil-t-stubble{ fill:none; stroke:#7a5c3c; stroke-width:2; stroke-linecap:round; opacity:.7; }
.ecom-t-arm, .itil-t-arm-rest, .itil-t-arm-raised{ fill:none; stroke:#c99a3a; stroke-width:5; stroke-linecap:round; }

/* ---- E-Commerce Manager: shop counter scene ---- */
.ecom-t-roof{ fill:none; stroke:#7a6a3a; stroke-width:1.4; }
.ecom-t-counter{ fill:#3a3320; stroke:#d9b23c; stroke-width:1.4; }
.ecom-t-laptop{ fill:#4a4128; stroke:#f4de8e; stroke-width:1.2; }
.ecom-t-laptop-line{ stroke:#f4de8e; stroke-width:1; }
```

- [ ] **Step 6: Add the pack-opening sizing override to `card.css`**

In `src/styles/card.css`, append after the existing `.pack-supporter .ps-rule{...}` rule:

```css
.pack-supporter .supporter-art{ height:100px; }
```

- [ ] **Step 7: Verify the build compiles**

Run: `npm run build`
Expected: build succeeds with no errors.

- [ ] **Step 8: Verify visually — gallery**

Start the dev server (`npm run dev`), open the gallery view, scroll to the "TRAINER DECK · Experience" section. Confirm the E-Commerce Manager card now shows the shop-counter illustration (gable roofline, standing figure with wavy hair/glasses/stubble, counter, and laptop) above its existing name/text/rule content. Confirm the ITIL card is unaffected (still text-only) — that's expected, it's Task 2.

- [ ] **Step 9: Verify visually — pack opening**

Open the pack-opening flow (from the gallery view's pack-opening entry point) and pull through cards until a Supporter card appears. If it's the E-Commerce Manager card, confirm the same illustration renders at the smaller pack-card size without overflowing its band. If it's the ITIL card, confirm it still renders as text-only (expected until Task 2) with no layout breakage.

- [ ] **Step 10: Commit**

```bash
git add src/components/TrainerArt.jsx src/components/PackCard.jsx src/views/GalleryView.jsx src/styles/layout.css src/styles/card.css src/data/cards.js
git commit -m "feat: add E-Commerce Manager trainer illustration and wire TrainerArt into both Supporter render sites"
```

---

### Task 2: ITIL 4 → 5 Transition illustration

**Files:**
- Modify: `src/components/TrainerArt.jsx`
- Modify: `src/data/cards.js:205` (itil entry)
- Modify: `src/styles/layout.css`

**Interfaces:**
- Produces: `ItilTrainerArt({ className })`, added to `TRAINER_ART` as `itil`.
- Consumes: the `.supporter-art` band, shared figure classes (`*-t-torso`, `*-t-head`, `*-t-hair`, `*-t-hair-wisp`, `*-t-glasses`, `*-t-stubble`), and the `TrainerArt` resolver — all already in place from Task 1. No changes needed to `GalleryView.jsx`, `PackCard.jsx`, or `card.css`; both render sites already look up `TRAINER_ART` by id.

- [ ] **Step 1: Add the `trainerArt` field to the ITIL entry**

In `src/data/cards.js`, change:

```js
  {
    id: 'itil',
    name: 'ITIL 4 → 5 Transition', sub: 'Garden Group', dates: 'Process initiative',
    text: "Guided the organization's shift from ITIL 4 toward ITIL 5 practices — service-management process design, not a line of code, but the same discipline applied to people and workflow.",
    rule: 'This card counts as a Supporter card, not an Item card.',
  },
```

to:

```js
  {
    id: 'itil',
    name: 'ITIL 4 → 5 Transition', sub: 'Garden Group', dates: 'Process initiative',
    text: "Guided the organization's shift from ITIL 4 toward ITIL 5 practices — service-management process design, not a line of code, but the same discipline applied to people and workflow.",
    rule: 'This card counts as a Supporter card, not an Item card.',
    trainerArt: 'itil',
  },
```

- [ ] **Step 2: Add the `ItilTrainerArt` component**

In `src/components/TrainerArt.jsx`, add after `EcommerceTrainerArt`:

```jsx
export function ItilTrainerArt({ className = '' }) {
  return (
    <svg
      className={`trainer-art trainer-art-itil ${className}`}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="ITIL 4 to 5 Transition trainer, mid-presentation gesture"
    >
      <path className="itil-t-torso" d="M40 90 Q40 55 50 55 Q60 55 60 90 Z" />
      <path className="itil-t-arm-rest" d="M40 65 Q35 75 33 85" />
      <path className="itil-t-arm-raised" d="M60 65 Q75 55 82 40" />
      <circle className="itil-t-hand" cx="82" cy="40" r="4" />
      <path className="itil-t-motion-a" d="M86 26 Q94 40 86 54" />
      <path className="itil-t-motion-b" d="M91 20 Q100 40 91 60" />
      <circle className="itil-t-head" cx="50" cy="45" r="11" />
      <path className="itil-t-hair" d="M38 40 Q40 28 50 26 Q60 28 62 40 Q64 33 59 30 Q54 24 50 25 Q46 24 41 30 Q36 33 38 40Z" />
      <path className="itil-t-hair-wisp" d="M37 37 q3 -5 5 -2" />
      <path className="itil-t-hair-wisp" d="M63 37 q-3 -5 -5 -2" />
      <rect className="itil-t-glasses" x="40" y="44" width="8" height="6" rx="2" />
      <rect className="itil-t-glasses" x="52" y="44" width="8" height="6" rx="2" />
      <line className="itil-t-glasses" x1="48" y1="47" x2="52" y2="47" />
      <path className="itil-t-stubble" d="M45 52 q5 3 10 0" />
    </svg>
  );
}
```

Update the registry:

```js
export const TRAINER_ART = {
  ecommerce: EcommerceTrainerArt,
  itil: ItilTrainerArt,
};
```

- [ ] **Step 3: Add ITIL-specific styling**

In `src/styles/layout.css`, append after the E-Commerce-specific block added in Task 1 (`.ecom-t-laptop-line{...}`):

```css
/* ---- ITIL 4 -> 5 Transition: presenting gesture ---- */
.itil-t-hand{ fill:#e6c877; }
.itil-t-motion-a, .itil-t-motion-b{ fill:none; stroke:#f4de8e; stroke-width:1.4; }
.itil-t-motion-a{ opacity:.6; }
.itil-t-motion-b{ opacity:.4; }
```

- [ ] **Step 4: Verify the build compiles**

Run: `npm run build`
Expected: build succeeds with no errors.

- [ ] **Step 5: Verify visually — gallery**

In the dev server, find the ITIL 4 → 5 Transition card in the Trainer Deck section. Confirm the presenting-gesture illustration (raised arm toward the upper-right, motion arcs near the hand, resting arm at the side, same wavy hair/glasses/stubble figure) renders above its text — no whiteboard, no screen prop. Confirm both Supporter cards now show distinct illustrations side by side.

- [ ] **Step 6: Verify visually — pack opening**

In the pack-opening flow, pull through cards until the ITIL Supporter card appears. Confirm its illustration renders correctly at the smaller pack-card size, matching the E-Commerce card's sizing/behavior from Task 1.

- [ ] **Step 7: Commit**

```bash
git add src/components/TrainerArt.jsx src/styles/layout.css src/data/cards.js
git commit -m "feat: add ITIL 4 to 5 Transition trainer illustration"
```

---

### Task 3: Whole-gallery verification pass

**Files:** none (verification only)

- [ ] **Step 1: Verify both Supporter cards together**

In the dev server, view the gallery's Trainer Deck section with both cards visible at once. Confirm: both illustrations render at the same band height and alignment, both use the same gold/amber palette, neither overlaps or clips its text body below, and the shared hair/glasses/stubble construction reads consistently between the two figures.

- [ ] **Step 2: Verify the pack-opening flow end-to-end**

Run the pack-opening flow at least twice (or until both Supporter cards have appeared) to confirm both illustrations render correctly at the pack-card's smaller size, with no layout breakage on the flip-card front/back mechanics.

- [ ] **Step 3: Run a final production build**

Run: `npm run build`
Expected: build succeeds with no errors.
