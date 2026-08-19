# Rarity Guide copy reframe — HP/rarity mismatch resolution

## Problem

Since the content-restructure branch (merged 2026-08-16), HP displays real LOC
(or estimated hours) per project. This means HP no longer tracks the rarity
ladder: Movie Theater Ticketing (Common) shows HP 3129, while Severe Weather
Alert System (SIR flagship) shows HP 650 and TulipVision (IR flagship) shows
HP 2779. Higher-rarity cards can show lower HP than commons.

This was flagged in that branch's final code review and deliberately deferred
to the illustration & rarity-effects design pass, which has now shipped
(PR #7, #8).

## Research: how real Pokémon TCG rarity actually works

In the real game, rarity (Common/Rare/Holo/Full Art/Rainbow/etc.) denotes
**print scarcity and art treatment** — it is not a power stat. A card can be
reprinted as a "Special Illustration Rare" with the exact same HP as its
Common printing; only the artwork and pull rate change. HP/power correlates
with **species and evolution stage** (Basic → Stage 1 → Stage 2), not with
rarity tier.

This means the premise "higher rarity should mean higher HP" is itself the
less-authentic framing. Looking at how this project's rarity tiers were
actually assigned, they already track **ownership, leadership role, and
personal stake** — not size:

- Jericho (SSIR): solo-architected, ongoing personal project
- Severe Weather Alert System (SIR): solo dev, professional internship, end to end
- TulipVision (IR): team capstone, but Fred was team lead / client-facing, on the winning model
- Grand Transmission Auto (Reverse Holo): solo dev, 63/66 commits, highest LOC of all 12 cards — yet only Reverse Holo, not a flagship tier, because rarity isn't about size
- Haarlem Festival / Self-Hosted AI Infra (Holo): shipped solo, or led the design room
- Six Common-tier cards: academic builds, supporting or smaller roles

So the fix is not to force HP to match rarity (which would require inventing
unbacked numbers) — it's to correct the Rarity Guide copy so it stops
implying rarity = size, and instead states plainly what rarity already means
here: role and ownership, on a separate axis from HP.

## Decision

Keep HP as real LOC/hours (`src/data/cards.js`, `Card.jsx`, `CardModal.jsx` —
unchanged). Rewrite the Rarity Guide section copy in
`src/views/GalleryView.jsx` (lines ~38-47) to remove the "bigger the result"
implication and reframe rarity around ownership/role, matching authentic TCG
convention.

### Copy changes

`section-sub` (intro sentence), from:
> "Same as a real booster pack — the higher the tier, the more of the project is actually mine and the bigger the result."

to:
> "Same as a real booster pack — rarity tracks ownership and role, not size. HP is raw project volume, on its own axis; a Common can out-code a flagship."

Legend items (`.legend-item`), from the current six lines to:

- ● **Common** — academic build, supporting role
- ◆ **Holo Rare** — shipped solo, or led the room
- ★ **Reverse Holo** — sole dev, heaviest personal commit share
- ★ **IR** — flagship #3 — team capstone, client-facing lead
- ★★ **SIR** — flagship #2 — solo, professional, end to end
- ★★★ **SSIR** — top flagship — solo-architected, ongoing

No other markup, styling, or component structure changes.

## Out of scope

- `hpMetric` mixing LOC and estimated hours under one HP stat — already
  disambiguated by the `LOC` / `est.` suffix on the card face; not part of
  this pass.
- Any change to HP values, rarity assignments, or card data in `cards.js`.
- Any change to `Card.jsx` / `CardModal.jsx` HP rendering.

## Testing

No test framework in this repo. Verify via `npm run dev` + visual check of
the Rarity Guide section in the browser, and `npm run build` to confirm no
build errors.
