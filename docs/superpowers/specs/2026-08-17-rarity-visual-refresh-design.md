# Rarity Visual Refresh Design

## Context

The classic-card readability pass (merged in [PR #5](https://github.com/Fredd93/fred-portfolio-tcg/pull/5)) fixed contrast and the stage-pill sizing bug, but the user's follow-up feedback was that the cards now read fine but "look stale" — the visual differentiation between rarity tiers doesn't match real Pokemon TCG conventions. The user supplied ten reference card images spanning all five rarity tiers used in this project (common/basic, holo, reverse holo, IR, SIR) and asked for a coordinated pass across all of them, grounded in those references rather than invented freely (per standing preference — see memory `feedback_pokemon_authenticity`).

This spec was developed through an iterative visual-companion session: two rounds of mockups were shown in-browser and the user picked a direction for each, described below. It covers `src/styles/card.css` only — no markup or component changes, no changes to card content/data.

## Decisions, grounded in reference images

### 1. Classic frame (common / holo / reverse-holo) — metallic border, not type-colored

**Current:** `.tcg-card{background:linear-gradient(155deg, var(--type-color), #14151f 78%)}` — the outer border fades from the project's type color to near-black. This was the first direction proposed and shown to the user (mockups A/B/C), but a second batch of reference images (Pikachu promo, Pikachu #37, Litleo, Fennekin) corrected this: **every one of those cards uses a neutral silver→grey/black metallic gradient border, regardless of Pokemon type.** Type identity shows up only in small accents — an energy-color pip, or a faint colored wash bleeding from a corner behind the name (visible on the Litleo reference) — never as the frame's base color.

**Decision (confirmed: user picked D2):**
- Replace the outer border gradient for `rarity-common`, `rarity-holo`, and `rarity-reverseholo` cards with a neutral metallic gradient: `linear-gradient(155deg,#e8e8ec,#a4a4ac 45%,#5c5c64 78%,#2b2b30)`.
- Add a faint radial corner wash using the project's `--type-color`, positioned behind the name/HP row only (top-right, roughly the top 22% height / right 60% width of the face), at low opacity (~.25) — echoing the Litleo reference without tinting the frame itself.
- The art panel border (`.art{border:2px solid #d8cca0}`) and the `.bottom` panel are unchanged from the readability pass — only the outer card border and the new corner wash are new.
- IR/SIR/SSIR (full-art layout) are unaffected by this — see section 4.

### 2. Holo (non-reverse) — no change

**Confirmed with the user directly:** the Munkidori reference's shine is confined to the artwork panel, matching the already-implemented `.rarity-holo` behavior (`art-shine`, `.art{border...}`, shine visible only over `.art`). This tier needs no changes.

### 3. Reverse holo — shine now covers the whole face, including the art

**Current:** `.rarity-reverseholo .art{z-index:4}` deliberately elevates the art above `.holo-shine` (z-index 3) so the shine excludes the artwork — this was the textbook "reverse" convention implemented in a prior session.

**Decision (confirmed with the user against the Ho-Oh / Chien-Pao / Xerneas references):** those cards show the holographic shine crossing the artwork too, not stopping at its edge. Update reverse holo to shine across the entire card face, art included:
- Delete the `.rarity-reverseholo .art{z-index:4}` rule so `.holo-shine` (already `position:absolute;inset:0`) naturally covers the art along with everything else.
- No other reverse-holo rule changes — `.holo-shine`'s existing hover/tilt-driven opacity mechanic (`.tcg-card:hover .holo-shine, .tcg-card.tilting .holo-shine{opacity:.5}`) stays as-is for this tier.

### 4. IR / SIR / SSIR — escalating shine and gold treatment

**Current:** all three full-art tiers share identical `.layout-fullart` styling. They're differentiated only by the outer `.tcg-card` background gradient (SIR: gold→purple, SSIR: gold→amber→near-black) and a larger name font on SSIR. No shine effect is applied to any of them (though nothing currently disables `.holo-shine` for these tiers either, so they already inherit the generic `.tcg-card:hover{opacity:.5}` shine as an unintended side effect — this spec makes that intentional and tier-specific).

**Decision (confirmed: user picked the proposed escalation, "A"):**

| Tier | Border | Shine (base / hover-max opacity) | Name treatment | Extra |
|---|---|---|---|---|
| IR | Thin gold border: `.rarity-ir .tcg-card{background:linear-gradient(155deg,#caa858,#5a4a1c 60%,#14151f)}` | `.holo-shine` base `.12`, hover/tilt max `.25` | Unchanged (cream `#f4efe0`, no foil) | — |
| SIR | Existing gold→purple `.tcg-card` background (unchanged) | `.holo-shine` base `.18`, hover/tilt max `.6` | Gold-foil gradient text: `background:linear-gradient(180deg,#fff6da,var(--gold));background-clip:text;color:transparent;text-shadow:0 1px 0 rgba(0,0,0,.3)` | — |
| SSIR | Existing gold→amber→black `.tcg-card` background (unchanged) | `.holo-shine` base `.25`, hover/tilt max `.75` | Same gold-foil treatment as SIR (font-size already 17.5px, unchanged) | Outer glow added to `.tcg-card` box-shadow: `0 0 20px -2px var(--gold)` alongside the existing shadow values |

Also apply thinner outer padding to all three full-art tiers (`padding:4px` instead of the shared `.tcg-card{padding:9px}`) — matches the minimal-border look of real full-art/SIR cards (Xerneas, Pikachu ex, Mega Gengar ex references) and reads as more "gorgeous" per the user's framing, versus the current sizeable dark padding that no reference card exhibits at this rarity.

**Implementation note on shine layering:** the base (non-hover) opacity values above are new — currently `.holo-shine` is fully invisible (`opacity:0`) until hover/tilt. Giving full-art tiers a small resting opacity keeps them from looking flat in a static gallery grid (matching the visibly-holographic look of the reference cards even in still photos), while the existing hover/tilt mechanic still provides the brighter interactive highlight. This needs selectors specific enough to win over the generic `.tcg-card:hover .holo-shine{opacity:.5}` rule (e.g. chaining `.tcg-card.rarity-sir:hover .holo-shine`).

## Out of scope

- No changes to card content, data, or the classic-layout attack/flavor/footer text treatment (already fixed in PR #5).
- No changes to `common` rarity — it already has no shine, matching the plain Charmander/Fennekin-style references.
- No changes to the pack-opening flow's `pull-thumb` rarity border colors (`src/styles/pack.css`) — out of scope for this pass, which is about the card face itself.
- No new SVG/image assets — everything here is CSS gradients, radial washes, and the existing `.holo-shine`/`.art-shine` machinery.

## Testing

Visual check in the dev server across all six rarities (`common`, `holo`, `reverseholo`, `ir`, `sir`, `ssir`) on `#/gallery`:
- Classic tiers: confirm the metallic border replaces the type-color gradient, and a faint corner wash in the project's type color is visible behind the name on common/holo/reverse-holo cards.
- Holo: confirm no visual change (shine still confined to art on hover/tilt).
- Reverse holo: confirm the shine now crosses the artwork on hover/tilt, not just the surrounding face.
- IR/SIR/SSIR: confirm visibly escalating shine intensity at rest and on hover, gold-foil name text on SIR/SSIR only, and the SSIR outer glow.
