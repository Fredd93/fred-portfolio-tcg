# Classic-Layout Card Readability Pass

## Context

The user shared a real Pokemon TCG card (Charmander base card) as the readability
reference and flagged two issues with our classic-layout cards (common / holo /
reverse-holo rarities — `src/styles/card.css`, `.layout-classic` rules):

1. The "BASIC" / "Stage 1" stage-pill badge doesn't wrap tightly around its own
   text the way the reference card's badge does — it looks inconsistent card to
   card.
2. Body text readability is poor — described as "dark grey over orange or most
   colors."

Both were grounded against the live dev server (not guessed) before writing this
spec.

## Root cause 1: stage-pill stretches to match a sibling's width

`.stage-pill` (`src/styles/card.css:44`, mirrored at `:93` for full-art) is a
block-level `<div>` with padding but no explicit width. It sits inside a plain
(non-flex) wrapper `<div>` alongside `.name`. Because it's block-level with
`width:auto`, it fills the wrapper's content width — and that wrapper's width is
driven by whichever child is wider, almost always `.name` (the card title).

Measured live on one card: pill text "Stage 1 · Primary Dev" is 82px wide, but
the pill rendered at 123px — stretched to match the name "Grand Transmission
Auto" directly above it. Different cards have different name lengths, so the
pill's width (and the padding of empty background around the word) varies
card to card. That's the "inconsistency" the user is seeing — it was never
about the pill's own styling, only its unintended width.

**Fix:** make `.stage-pill` size to its own content instead of its container.
`display:inline-block` (or `width:fit-content`) is sufficient — per the user's
choice, no additional alignment/padding changes are needed beyond that.

Applies to both `.layout-classic .stage-pill` and `.layout-fullart .stage-pill`
(same underlying bug in both rule blocks), even though the contrast fix below is
classic-only.

## Root cause 2: body text contrast is measurably weak on the tan bottom panel

Measured actual computed colors on a live classic card against their real
backgrounds (not assumed):

| Element | Color | Background | Contrast | WCAG AA (small text, needs 4.5:1) |
|---|---|---|---|---|
| `.foot` | `#6b6552` | `.bottom` `#e9dcb6` | **4.26:1** | **Fails** |
| `.flavor` | `#5c5745` | `.bottom` `#e9dcb6` | 5.29:1 | Passes, weak |
| `.atk-text` / `.wrr` | `#4a4636` | cream gradient / `.bottom` | 6.9–7.5:1 | Passes |

The `.bottom` panel background (`#e9dcb6`) is a warm tan/gold tone — this is
what reads as "orange" in the user's complaint. Combined with the brownish-grey
text tones and very small font sizes (7.6–9.3px), the result is the "muddy,
hard to read" impression, and the footer line is a genuine accessibility
failure, not just a subjective one.

**Fix:** collapse the current three near-identical muddy tones into two
deliberately darker tiers, applied only to `.layout-classic` (full-art already
uses light text on dark backgrounds and measures fine — out of scope per user
decision):

| Tier | Old color(s) | New color | New contrast on `.bottom` (`#e9dcb6`) |
|---|---|---|---|
| Body (attack text, role/retreat line) | `.atk-text` `#4a4636`, `.wrr` `#4a4636` | `#3d3924` | 8.5:1 |
| Secondary (flavor text) | `.flavor` `#5c5745` | `#3d3924` | 8.5:1 |
| Tertiary (footer, dex line, HP unit label) | `.foot` `#6b6552`, `.dex-line` `#6b6552`, `.hp small` `#6b6552` | `#4a4636` | 6.9:1 |

This is a pure color-value swap on existing selectors in `src/styles/card.css`
— no markup or layout changes, no new selectors.

## Out of scope

- Full-art (IR/SIR/SSIR) text colors — not measured as a problem, left as-is.
- Font sizes, spacing, or any other layout change to classic cards (this pass
  is contrast + pill sizing only, per the user's scoped answers).
- Stage-pill alignment/padding beyond the width fix.

## Testing

Visual check in the dev server: confirm the stage-pill on several cards with
different name lengths now renders at different (correctly-fitted) widths, and
confirm the footer/flavor/attack text on classic cards reads clearly against
both the cream top and tan bottom panel backgrounds.
