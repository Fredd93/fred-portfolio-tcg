# Full-Art Illustration Scenes Design

## Context

The rarity visual refresh (merged in [PR #6](https://github.com/Fredd93/fred-portfolio-tcg/pull/6)) escalated the border/shine/gold-foil treatment across the IR/SIR/SSIR full-art tier, but deliberately left the "illustration" itself untouched: it's still a single project emoji blown up to `font-size:150px` and centered on a flat radial gradient (`.layout-fullart .art-bg`, `src/styles/card.css:91-96`). Real full-art/illustration-rare Pokemon cards tell a story through a composed scene — multiple elements, a setting, sometimes a narrative moment — not one oversized emblem. This spec covers building that scene, in code, for the three flagship projects that use the full-art layout.

Developed through an iterative visual-companion session (mockups shown in-browser, refined across several rounds per card). Covers `src/components/Card.jsx` (scene markup) and `src/styles/card.css` (scene styles) only, plus one data field correction in `src/data/cards.js`.

## Scope

The `FULLART` set (`src/components/Card.jsx:5`) currently applies identically to all `ir`/`sir`/`ssir` cards. This spec replaces the generic `.art-bg` for exactly the three projects that hold those rarities today:

| Project id | Rarity | Type | Current icon |
|---|---|---|---|
| `jericho` | ssir | arch | 🛰️ |
| `impala` | sir | ml | ⛈️ → **🌡️** (see Decision 5) |
| `tulip` | ir | ml | 🌷 |

Each gets a bespoke, hand-built scene — not a formula derived from `type`/`rarity`, since two of the three share `type: ml` but need completely different scenery. Implementation should key off `project.id` (e.g. a `scene-jericho` / `scene-impala` / `scene-tulip` class alongside the existing `art-bg` container) rather than type or rarity.

If a future project is promoted into the full-art tier, it falls back to the current generic `art-bg` treatment (icon + radial gradient) until a bespoke scene is designed for it — no new generic-scene fallback is being built as part of this pass.

## Decision 1 — Coded scene, no image assets

Confirmed direction (of three options considered: coded CSS/SVG, commissioned/generated images, or a hybrid): everything is built from CSS gradients, shapes, and inline SVG. No image files are added to `src/` or `public/`, consistent with how the rest of the app already renders (project icons are emoji, not images).

## Decision 2 — Scene tells the story, not one giant icon

Initial mockups floated the existing project emoji at ~150px as the sole content over a new gradient (an "atmospheric scene" background with the icon unchanged). User feedback moved past this: real Pokemon full-art rares convey their subject through several smaller elements arranged in a scene, not one dominant emblem. All three final scenes below drop the single giant centered icon in favor of multiple smaller motif pieces.

## Decision 3 — Jericho scene (SSIR)

Night-sky gradient (`linear-gradient(180deg,#2a2c55 0%,#3a3670 32%,#171a2e 68%,#0a0a10 100%)`), a faint star field (small radial-gradient dots, ~5 positions, opacity ~.7), and a jagged skyline silhouette near the bottom (irregular `clip-path` polygon reading as a circuit/city profile, matching the "arch" type identity).

The satellite (🛰️) sits **centered** at roughly the upper-middle of the scene, inside a stack of 3 concentric rings (radii roughly 22px/36px/50px at the mockup's 220px-wide scale, opacity decreasing outward from ~.6 to ~.22) representing it "listening." A dotted vertical signal line runs from the satellite down to a small house (🏠) sitting on the horizon directly below it, with a soft warm glow behind the house's window. This tells the "ambient assistant listens at the periphery, then responds to the home it watches over" story rather than showing the satellite in isolation. A single faint hex-outline accent (two overlapping diagonal gradient lines forming a hexagon corner) sits lower-left as a quiet architecture/systems cue.

## Decision 4 — TulipVision scene (IR)

Dusk teal-to-near-black gradient (`linear-gradient(180deg,#159487 0%,#0d5a52 35%,#101a22 72%,#0a0a10 100%)`) with faint diagonal furrow lines (`repeating-linear-gradient` at ~100deg, low opacity, masked to fade out toward the top) suggesting a tulip field, and a soft pink radial glow centered in the lower-middle.

The field holds roughly 15 tulip (🌷) glyphs total:
- **~10 small background tulips** scattered at varying size (9–15px at mockup scale) and opacity (.5–.75) across the lower two-thirds, for depth — this is what makes it read as a field rather than a handful of flowers.
- **5 foreground tulips** (16–24px, full opacity) in the middle band.
- **3 of the foreground tulips carry a detection annotation**: a bounding box drawn around them plus a small confidence-score label reading `R-CNN <percent>%`. Three tiers, styled distinctly:
  - High confidence (94%): solid green border (`#7CFFB2`), matching green label chip.
  - Mid confidence (78%): solid amber border (`#ffd166`), matching amber label chip.
  - Low confidence (52%): dashed pink border (`rgba(255,182,214,.55)`), matching translucent pink label chip.

This directly evokes the project's actual best-of-four object-detection result (Faster R-CNN, F1 0.86) rather than a generic tulip illustration — the scene shows the model at work across a real, imperfect field.

## Decision 5 — Severe Weather Alert System scene (SIR)

Mid-brainstorm correction: the project actually detects **heatwaves and cold snaps**, not storms — the original ⛈️ icon and an early lightning-bolt/rain-cloud scene direction were both wrong for the subject. Two changes follow from this:

1. **`src/data/cards.js`**: update the `impala` project's `icon` field from `⛈️` to `🌡️`. This is a data correction, not scoped only to the full-art scene — the icon is reused elsewhere (e.g. shrunk to 42px in classic-layout `.art`), so the fix should apply at the data level, not be special-cased in the full-art component.
2. **Scene**: a hard vertical split down the middle, no horizon strip (unlike the other two scenes, which are top/bottom layered) since the story here is a left/right contrast:
   - **Left (heat) half**: sun-orange to deep-red gradient (`#e6791f` → `#c94a1c`), a glowing sun disc (radial gradient + soft box-shadow bloom) in the upper-left, and 2–3 curved wind-gust lines (thin `stroke`, warm off-white, varying opacity) sweeping across the lower-left suggesting heat-driven wind.
   - **Right (cold) half**: deep frost-blue gradient (`#1d2340` → `#1c3f6b`), a ❄️ snowflake glyph in the upper-right, and a creeping icy-frost texture along the right edge — a translucent light-blue gradient wash plus a repeating horizontal-stripe mask (crystalline/ice-crust look) inset from the card's right border.
   - No central icon; the split scene itself is the entire illustration.

## Decision 6 — Rarity signal stays in the existing border/shine system

Considered whether the scene itself should escalate in richness from IR → SIR → SSIR (e.g. SSIR getting extra detail). Decided against: all three scenes above are built to be equally rich, regardless of tier. The already-built border/shine/gold-foil escalation from PR #6 remains the only rarity signal — keeps each scene's complexity driven by what best tells that project's story, not by an arbitrary tier-based richness budget.

## Implementation notes

- Icon glyphs (🛰️, 🏠, 🌷, ☀️/❄️ where used as literal emoji rather than CSS shapes) keep the existing `filter:drop-shadow(...)` treatment for legibility against the gradients, consistent with the current `.layout-fullart .art-bg span` rule.
- Mockups were built at 220×308px (card face only, no border/padding) against the real card's 260×364px (`.tcg-card-wrap` in `card.css:7-9`, `aspect-ratio:5/7`) — scale positions/sizes proportionally (~1.18×) during implementation rather than copying mockup pixel values verbatim.
- The existing `.layout-fullart .top-row` and `.layout-fullart .bottom` gradient-fade overlays (z-index 2, `card.css:97-116`) sit above the scene and are unchanged — scenes render at/behind z-index 0-1, same stacking as the current `art-bg`.
- No changes to `.holo-shine`, the outer `.tcg-card` border/shine escalation, or gold-foil name treatment (PR #6) — this pass only replaces what's *behind* those layers.

## Out of scope

- No new image/SVG asset files — everything is inline CSS/SVG within the existing component/stylesheet files.
- No generic scene system for future full-art projects — only these three named projects get bespoke scenes; a project newly promoted to `ir`/`sir`/`ssir` falls back to the current generic `art-bg` (icon + radial gradient) until it gets its own design pass.
- No changes to classic-layout cards, the pack-opening flow, or any rarity tier outside IR/SIR/SSIR.
- No changes to card content/copy other than the single `impala.icon` field correction.

## Testing

Visual check in the dev server on `#/gallery`, and in the pack-opening flip flow (`CardFace` is shared between both):
- Jericho: night sky, stars, skyline silhouette, centered satellite + 3 rings, dotted signal line to a glowing house, hex accent — confirm no stray giant icon remains.
- Severe Weather Alert System: confirm the small icon in classic contexts (if any) still resolves via `project.icon` (🌡️) correctly; confirm the full-art scene shows the sun/wind vs snowflake/icy-frost split with a clean vertical divide and no leftover cloud/lightning shapes.
- TulipVision: confirm ~15 tulips total (10 small background + 5 foreground), 3 with R-CNN confidence-labeled boxes in the three distinct styles (green solid/amber solid/pink dashed), field furrow lines and pink glow visible.
- Confirm PR #6's border/shine/gold-foil escalation is visually unaffected — this pass only touches what renders behind it.
