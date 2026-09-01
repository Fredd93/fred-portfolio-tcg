# Trainer Card Art Design

## Context

Both the flagship "Human Flare Visual Pass" (`docs/superpowers/specs/2026-08-22-human-flare-visual-pass-design.md`) and the "Non-Flagship Mascot Pass" (`docs/superpowers/specs/2026-08-23-non-flagship-mascots-design.md`) explicitly deferred illustrated art for the 2 Supporter-type project cards — E-Commerce Manager and ITIL 4 → 5 Transition, defined in `SUPPORTERS` in `src/data/cards.js`. Both prior specs note that real Pokémon Trainer cards depict the trainer in-role rather than a creature, making this a distinct visual treatment from the project mascots, not a reskin of the mascot pattern.

Unlike the 12 project cards (which all render through `Card.jsx`'s `.tcg-card` structure with a `.art` icon box), the 2 Supporter cards currently render through an entirely separate, simpler component tree with **no illustration slot at all**: a flat text panel with a "Trainer / Supporter" header bar, name, role/date meta, body text, and a rule line. This exists in two places — `GalleryView.jsx`'s `.supporter` block (Trainer Deck section) and `PackCard.jsx`'s `SupporterFace` (pack-opening flow). Neither uses `Card.jsx`, the tilt system, or `MascotArt.jsx`.

Developed through an iterative Q&A brainstorming session with Fred, including a visual-companion mockup of both illustrations (approved as designed below, including a revision pass adding light personal likeness details from reference photos Fred supplied).

## Scope

**In scope:** two bespoke flat-vector SVG "trainer" illustrations — one for E-Commerce Manager, one for ITIL 4 → 5 Transition — added as a new art band inserted above the existing text body in both Supporter render sites (`GalleryView.jsx` and `PackCard.jsx`).

**Out of scope:**
- Any tilt-reactive animation or lenticular frame-swap. Supporter cards have no tilt/hover mechanism today (no `Card.jsx` tilt tracking, no `data-tilt-frame`), and this pass keeps them static — consistent with their current zero-interactivity baseline. No new JS event plumbing.
- `CardModal.jsx` — Supporter cards are not shown there; unaffected.
- Restructuring the Supporter card into a full-art layout (like the flagship project cards). The art is a new band inserted into the existing flat-panel structure, not a redesign of that structure.
- Any new npm dependency — plain inline SVG, same as both mascot passes.
- Photorealistic or literal likeness rendering. The personal details below are light stylized cues within the same flat-vector style as the mascots, not a portrait.

## Section 1 — The two illustrations

Both illustrations are flat-vector inline SVG (`viewBox="0 0 100 100"`-style shapes: polygons, paths, circles, no bitmap assets), matching the construction style of `MascotArt.jsx`'s existing mascots — clean shapes with class-hook-driven fill/stroke, not photorealistic.

**Shared personal-likeness cues** (light touches, not a portrait — pulled from reference photos Fred supplied during brainstorming): dark wavy/curly hair, rectangular glasses, light stubble shading along the jaw. Both figures use the gold/amber "Trainer" palette (`#d9b23c`, `#f4de8e`, `#c99a3a`, `#e6c877`) to match the existing `.supporter-top` header gradient and `.supporter` border — not a project `TYPES` color, since Supporter entries have no `type` field.

| Card | Illustration concept |
|---|---|
| E-Commerce Manager | Trainer figure standing at a shop counter/desk, one hand resting near a small open laptop, a simple storefront-gable shape in the background. Reads as "at their post" — a static, grounded pose. |
| ITIL 4 → 5 Transition | Trainer figure mid-presentation gesture: one arm extended outward/up as if addressing a room, the other arm at rest, with two faint motion-line arcs near the raised hand suggesting mid-speech energy. No whiteboard, no literal screen prop — the pose itself carries the "presenting" read. |

Approved mockup reference (visual-companion session): both figures centered in a ~190px-tall art band, gold-tinted background wash (`#241f14`), sized/positioned consistently between the two cards.

## Section 2 — Component architecture

A new registry file, **`src/components/TrainerArt.jsx`**, kept separate from `MascotArt.jsx` — these are human Trainer figures, not creature mascots, and both prior specs called this out as a categorically distinct treatment. Mirrors `MascotArt.jsx`'s exact contract:

```jsx
export function EcommerceTrainerArt({ className = '' }) { /* ... */ }
export function ItilTrainerArt({ className = '' }) { /* ... */ }

export const TRAINER_ART = {
  ecommerce: EcommerceTrainerArt,
  itil: ItilTrainerArt,
};

export function TrainerArt({ id, className }) {
  const Art = TRAINER_ART[id];
  return Art ? <Art className={className} /> : null;
}

export default TrainerArt;
```

`src/data/cards.js`: each `SUPPORTERS` entry gains a `trainerArt: 'ecommerce' | 'itil'` field alongside its existing fields.

## Section 3 — Integration with the two render sites

Both sites insert the art band in the same structural position — between the existing header bar and the existing body content — with no other markup reordering:

**`GalleryView.jsx`** (`.supporter` block):
```jsx
<div className="supporter" key={s.id}>
  <div className="supporter-top">...</div>
  <TrainerArt id={s.trainerArt} className="supporter-art" />
  <div className="supporter-body">...</div>
</div>
```

**`PackCard.jsx`** (`SupporterFace`):
```jsx
<div className="pack-supporter">
  <div className="ps-top">...</div>
  <TrainerArt id={data.trainerArt} className="supporter-art" />
  <div className="ps-body">...</div>
</div>
```

Both import `TrainerArt` from `../components/TrainerArt.jsx`.

## Section 4 — Styling

New CSS in `src/styles/layout.css`, alongside the existing `.supporter-*` rules (no new stylesheet file needed — this is a small, static addition, unlike the mascot passes' dedicated `mascot.css`):

- `.supporter-art`: fixed-height band (~190px, matching the mockup), gold-tinted background wash, contains the SVG centered and appropriately sized.
- Per-illustration detail classes (hair, glasses, stubble, counter/laptop, presentation-arc details) styled with the shared gold/amber palette listed in Section 1.
- No `@keyframes`, no `prefers-reduced-motion` override needed — there is no animation to gate.

`PackCard.jsx`'s pack-opening flip card reuses the same `.supporter-art` class and `TrainerArt` output, so no separate pack-specific styling is needed beyond confirming it fits the pack card's dimensions (narrower than the gallery `.supporter` card — an implementation-time sizing check, not a design change).

## Out of scope (restated)

- Tilt/hover animation or lenticular frame-swap for these two cards.
- `CardModal.jsx` changes.
- Full-art layout restructuring of Supporter cards.
- New npm dependencies.
- Literal photorealistic likeness.
