# Human Flare Visual Pass Design

## Context

A design audit of the current site found it reads as heavily AI-generated/generic. The single biggest tell is emoji-as-iconography (🛰️🌷🌡️🚗 etc. in `src/data/cards.js`), compounded by a "safe AI dark mode" palette, formulaic repeated section-header patterns, uniform flavor-quote copy rhythm across all 12 cards, and zero trace of an actual human — the hero avatar (`src/views/GalleryView.jsx:16`) is a flat letter-monogram, `<span>MF</span>`.

Fred has given explicit high creative freedom for this pass: the goal is new, generated, bespoke content and visuals — not faithful real-world TCG-format replication for its own sake. That said, mascot and reveal concepts should stay recognizably *Pokémon*-themed (game/anime conventions), since that's the vocabulary that makes the site distinctive rather than generic.

This spec covers three independent but complementary pieces of work: illustrated mascots replacing emoji icons, animated full-art scenery extended toward all cards, and a "Who's That Dev?" reveal replacing the flat hero avatar. Developed through an iterative Q&A brainstorming session with Fred; no mockups were produced (text-only session, visual companion was not invoked).

**Environment note:** the task brief referenced `frontend-design`, `svg-illustration`, `svg-animations`, `motion-advanced`, and `gsap-core` skills as potentially useful. None are installed/available in this environment (checked via skill search). The project already depends on `framer-motion` (`^13.1.0`) with no other animation library — this spec builds on framer-motion rather than introducing gsap or another dependency, since nothing here needs more than framer-motion's keyframe/gesture primitives.

## Scope

Three sections, each independently implementable and independently mergeable:

1. **Character art (mascots)** — `src/data/cards.js`, a new `MascotArt` registry component, `src/components/Card.jsx`
2. **Animated card scenery** — `src/components/FullArtScenes.jsx`, `src/styles/card.css`
3. **"Who's That Dev?" reveal** — a new `IntroReveal` component, `src/views/GalleryView.jsx`, `src/styles/layout.css`

All three replace/extend existing systems rather than bolting on new ones: mascots replace the `icon` emoji field, scenery extends the existing `FULLART_SCENES` map, and the reveal replaces the existing hero `.avatar` markup.

Per-project scope: **all 15 project cards** get bespoke mascots and (eventually) full-art scenes. This spec fully designs the **3 flagships** (`jericho`, `tulip`, `impala`) as the foundation — deep, one-off, hand-built — and documents the lighter-weight pattern the other 12 will follow in a later implementation pass. It does not fully design all 12 non-flagship mascots/scenes individually; that's follow-on work using the pattern established here.

## Section 1 — Character Art (Mascots)

### Decision 1.1 — Replace emoji `icon` with bespoke SVG mascots, Pokémon-lineage-inspired

Every project's `icon: '🛰️'`-style field in `src/data/cards.js` is replaced by a `mascot: 'jericho'` key, resolved through a new registry component (`MascotArt`, mirroring the existing `FULLART_SCENES` pattern in `FullArtScenes.jsx`). Mascots are original, hand-built SVG creatures — not licensed Pokémon art — but each is deliberately designed in the visual lineage of a real Pokémon species/family whose established design language matches the project's technical character. This grounds the designs in a recognizable vocabulary instead of inventing a style from nothing, which is what makes them read as "TCG-authentic" rather than generic clip-art mascots.

Art style: **clean vector/flat-illustration** — bold flat shapes, a limited palette per mascot (drawn from the project's existing type color in `TYPES`), crisp outlines. This reads well at small card scale, rigs cleanly into discrete animatable SVG parts (unlike painterly/gradient art), and matches the existing gold/navy premium holo-card look better than a pixel-art tonal swing would.

### Decision 1.2 — The three flagship mascots (fully specified)

| Project | Mascot concept | Pokémon-lineage inspiration | Why |
|---|---|---|---|
| `jericho` | Hex-plated satellite-fox sentinel. Geometric metal-plated body, glowing antenna-ears, dormant/idle posture that only "activates" (ears light, eyes open) on interaction. | Magneton / Electrode — tech-Pokémon built from hard geometric primitives, glowing core details | Matches Jericho's actual flavor text: *"Lives at the periphery until you need it — then it's already listening."* The dormant→activate behavior **is** the character. |
| `tulip` | Tulip-bloom creature with a camera-lens eye at its core; petals double as scanning apertures that iris open/closed. | Bulbasaur/Bellsprout-line plant-Pokémon, crossed with a scanner/detector visual twist (lens iris, not just a flower) | Matches the actual project: an object-detection model (Faster R-CNN, F1 0.86) for tulip disease — the lens-eye makes "detector" literal, not just decorative. |
| `impala` (Severe Weather) | Split-body dual-natured creature — one half warm-toned (fur/scales, ember colors), one half frost-crystal (ice-blue, faceted) — a single creature embodying both extremes it forecasts. | Vulpix / Alolan Vulpix — the real Pokémon precedent for one species having a fire form and an ice form depending on conditions | **Correction from an earlier "storm-hawk" idea considered during brainstorming**: the project actually detects heatwaves *and* cold snaps, not storms (a prior spec already corrected this project's icon from ⛈️ to 🌡️ for the same reason — see `2026-08-18-fullart-illustration-scenes-design.md` Decision 5). The dual heat/cold split is the accurate, more interesting concept, and it's a real Pokémon design convention (regional forms), not an invented gimmick. |

### Decision 1.3 — Animation tiers

Two tiers, matched to the mascot's card tier:

- **Flagships (3):** continuous idle-loop animation (breathing scale, blink, slow particle/detail drift — whatever suits the individual mascot) via framer-motion, plus a distinct **hover/tap "activate" reaction** wired into the card's existing hover/tilt state (`Card.jsx`'s `ref`/tilt handlers already track pointer interaction — the mascot reacts to the same signal, no new event plumbing needed). E.g. Jericho's antenna-ears light up and the ring-pulse in its scene syncs; TulipVision's lens-eye iris snaps into a focused "scanning" state.
- **The other 12 (non-flagship):** a cheaper technique — **2-3 illustrated frames swapped/crossfaded based on tilt angle**, reusing the existing `motionTiltBus` (`src/utils/motionTiltBus.js`) that already drives the card's 3D tilt transform. As the tilt angle crosses defined thresholds, the mascot's active frame swaps, producing a lenticular-card illusion (like a physical trading card that shows a different image depending on viewing angle) without full idle-loop rigging. This was Fred's idea during brainstorming and is the intended answer to "how do 12 more mascots stay cheap to build."

### Decision 1.4 — Non-flagship mascots (pattern, not full spec)

Deferred to a later pass, but the pattern is: same flat-vector style, same "grounded in a real Pokémon-family visual lineage matching the project's technical character" approach as the flagships, loosely coherent within `TYPES` groupings (e.g. `frontend`/`backend` projects lean toward more "domesticated"/utility-creature silhouettes; `hardware`/`devops` lean toward more mechanical ones) but each still individually themed to its own project — not a single reskinned template repeated 12 times. Each will need its own short creative-brief pass (mascot concept + Pokémon-lineage inspiration + 2-3 lenticular frame descriptions) before implementation, following this table's format.

## Section 2 — Animated Card Scenery

### Decision 2.1 — Extend `FullArtScenes.jsx` toward all 15 cards; flagships fully refined now

The existing `FULLART_SCENES` map (`jericho`, `tulip`, `impala`) currently renders static-ish CSS/SVG compositions — motif placement and color are bespoke per project, but nothing moves continuously; motion is limited to card-level shine/tilt already handled by `Card.jsx`. This pass:

1. Refines all 3 existing flagship scenes with **real, continuous motion** (see 2.2), and swaps the embedded emoji spans (`<span className="jericho-house">🏠</span>`, the 🌷 glyphs, etc.) for the new mascot SVGs from Section 1 where the scene's central subject *is* the mascot (the satellite in Jericho's scene, the tulip creatures in TulipVision's scene).
2. Documents — but does not implement — the lighter-weight scene-authoring pattern for the other 12 cards: same `art-bg` container + layered `div`/inline-`svg` structure as the flagships, but with a smaller particle/layer budget (2-4 motion layers instead of 6-10), so extending full-art to the rest of the gallery later doesn't require inventing a new mechanism.

### Decision 2.2 — Flagship scene motion additions

- **Jericho**: the existing 3 concentric "listening" rings (`jericho-ring-1/2/3`) get an actual expanding-ping animation cadence (each ring scales/fades outward on a staggered loop, like a radar sweep) instead of sitting at fixed opacity. The satellite glow shifts subtly with card tilt (parallax) via the existing `--mx`/`--my` custom properties `Card.jsx` already writes on pointer move.
- **TulipVision**: **Pokédex-style scan/lock treatment** for the 3 detection bounding boxes (this was a mid-brainstorm addition from Fred, referencing the anime's "scanning a Pokémon" UI beat — corner-bracket reticle, not a static box):
  - Corner brackets animate inward to "acquire" a tulip, cycling one at a time between the 3 existing confidence tiers (94% / 78% / 52%).
  - A horizontal scan-line sweeps through the frame during each acquisition.
  - On lock, the existing confidence-% label (`R-CNN 94%` etc.) snaps in with a brief flash, holds ~1.5-2s, then the cycle advances to the next tulip.
  - Background/foreground tulip glyphs (now the tulip mascot, per Section 1) get a continuous idle sway independent of the scan cycle, so the scene never looks frozen between scan events.
- **Severe Weather (`impala`)**: existing wind-gust lines (`impala-wind`), shimmer paths (`impala-shimmer`), snowflake/crystal glyphs, and icing textures move from static-position decoration to continuous drift/flicker loops — wind lines slowly translate, shimmer paths pulse opacity, crystals rotate/twinkle gently. The heat/cold split composition itself (Decision 5 of the prior full-art spec) is unchanged.

### Decision 2.3 — Performance budget

"Rich on desktop, reduced on mobile," per Fred's direction:

- Each animated scene layer is gated by `IntersectionObserver` — cards scrolled out of the viewport (or, on the gallery grid, simply far from the visible window) pause their CSS/framer-motion animations rather than running continuously off-screen.
- Below a mobile breakpoint (matching whatever breakpoint `src/styles/layout.css` already uses for its mobile pass — confirm against the `2026-08-19-mobile-dynamic-pass-design.md` spec during implementation), particle/layer counts drop — e.g. TulipVision's ~15 background/foreground tulip glyphs render a reduced count on mobile, matching the pattern the existing full-art spec already uses for varying opacity/size by tier.
- `prefers-reduced-motion: reduce` is respected globally: looping animations (ring pulses, scan sweeps, drift, mascot idle loops) drop to a single static frame; only essential state changes (e.g. the TulipVision lock flash confirming a detection) still play, without the continuous ambient motion around them.

## Section 3 — "Who's That Dev?" Reveal

### Decision 3.1 — Concept: the anime "Who's That Pokémon?" intermission, re-skinned

Rejected an initial sci-fi silhouette-resolves-from-particles concept as off-theme — Fred wants to stay inside the Pokémon game/anime vocabulary rather than reach for a generic sci-fi trope. The chosen concept is the anime's iconic "Who's That Pokémon?" segment: a black silhouette is shown, a caption asks the question, then a beat later the full-color reveal answers it. Applied here as **"Who's That Dev?"**, resolving to a real photo of Fred.

This directly answers the design audit's top complaint (zero trace of a real human — the hero avatar is a flat letter monogram) while staying recognizably on-theme rather than bolting on an unrelated visual language.

### Decision 3.2 — Sequence and timing

New `IntroReveal` component, mounted in `GalleryView.jsx` above/within the existing `.hero` block, replacing the current `<div className="avatar"><span>MF</span></div>`.

1. **Beat 1** — solid black silhouette cutout of Fred (the photo run through a CSS `filter`/mask, not a separate silhouette image asset), centered in the avatar slot, with **"Who's that Dev?"** set in the same chunky anime-caption style as the source bit, styled to the site's existing gold/navy palette.
2. **Beat 2** (~1-1.5s later) — a flip/flash transition reveals the full-color photo in place of the silhouette, with a caption snapping in: **"It's Fred!"** (or his full trainer name, echoing the "Trainer ID" framing already in the hero copy at `GalleryView.jsx:18-19`).
3. **Total runtime ~2-3s**, skippable at any point via click/keypress/tap — skipping jumps straight to the final resolved-photo state.

Built with framer-motion (already a dependency) for the silhouette→color flip and caption pop-in; no new dependency needed. The silhouette is produced via CSS filter/mask on the single photo asset — no separate silhouette image file.

### Decision 3.3 — Trigger and replay

- **First visit in a session**: auto-plays once, gated by a `sessionStorage` flag (e.g. `fredtcg_intro_seen`) so page refresh/in-session navigation doesn't replay it repeatedly.
- **After it resolves**: the hero avatar (now showing Fred's photo) stays clickable, and clicking it replays the same 2-3s sequence on demand — this is the "replayable" behavior Fred asked for, distinct from a one-time-ever animation.
- `prefers-reduced-motion: reduce`: skips the flip animation, silhouette and photo swap instantly with no transition.

### Decision 3.4 — Photo asset (pending)

Fred will supply the actual photo before implementation begins. Recommended framing for implementation to work well against the silhouette mask: head/shoulders crop, reasonably plain/uncluttered background (the silhouette cutout reads cleanest against simple backgrounds — busy backgrounds risk silhouetting extra unwanted shapes). Implementation proceeds with a placeholder image until the real file is provided, then swaps it in as a drop-in asset replacement — no component logic depends on the specific photo.

## Out of scope

- Full mascot + full-art scene design for the 12 non-flagship projects (pattern documented, individual creative briefs deferred to a follow-up pass).
- Any new animation dependency (gsap, lottie, etc.) — framer-motion covers everything specified here.
- Redesigning the section-header pattern, flavor-quote copy rhythm, or overall dark-mode palette flagged elsewhere in the design audit — not part of this spec's three sections.
