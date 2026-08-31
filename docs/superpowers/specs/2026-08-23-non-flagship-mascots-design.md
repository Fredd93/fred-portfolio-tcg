# Non-Flagship Mascot Pass Design

## Context

The merged "Human Flare Visual Pass" (`docs/superpowers/specs/2026-08-22-human-flare-visual-pass-design.md`) replaced emoji icons with bespoke animated SVG mascots for the 3 flagship full-art projects (Jericho, TulipVision, Severe Weather) and documented — but explicitly did not design — the pattern for the remaining projects: "Full mascot + full-art scene design for the 12 non-flagship projects (pattern documented, individual creative briefs deferred to a follow-up pass)."

That "12" figure in the merged spec was a stale assumption of 15 total project cards. `src/data/cards.js` actually holds **12 total project entries**: 3 flagships + **9** non-flagship (`gta`, `haarlem`, `selfhost`, `somerin`, `souls`, `chapeau`, `greenhouse`, `movie`, `servicedesk`). This spec designs mascots for those 9, following the pattern the flagship spec established (Decision 1.4): same flat-vector style, same "grounded in a real Pokémon-family visual lineage matching the project's technical character" approach, loosely coherent within `TYPES` groupings but each individually themed — not a reskinned template.

Developed through an iterative Q&A brainstorming session with Fred, including a visual-companion review of all 9 mascot concepts (approved as designed below, with one revision to the GTA concept mid-session).

## Scope

**In scope:** bespoke SVG mascots for all 9 non-flagship projects, replacing their emoji `icon` field in the existing classic-layout `.art` box, with a lighter "lenticular" animation tier (2-3 frames swapped by card tilt angle) per the flagship spec's Decision 1.3.

**Out of scope, deferred to a later pass:**
- "Trainer card" illustrated art of Fred in-role, for the 2 Supporter cards (E-Commerce Manager, ITIL 4→5 Transition) — Fred's idea, explicitly wanted but not in this pass. Real Pokémon Trainer cards depict the trainer rather than a creature, so this is a distinct visual treatment from the project mascots, not a variant of them.
- Full-art scene treatment for these 9 projects (they use the classic layout, not full-art — no `FULLART_SCENES` entry needed).
- `CardModal.jsx`'s icon display — unchanged, same as the flagship pass left it unchanged.
- Any new animation dependency — framer-motion/plain CSS covers everything here, same as the flagship pass.

## Section 1 — The 9 mascot concepts

Same rule as the flagships: each is an original creature, not licensed Pokémon art, but deliberately designed in the visual lineage of a real Pokémon species/family whose established design language matches the project's actual function. Palette per mascot draws from the project's `TYPES` color.

| Project | Mascot concept | Pokémon-lineage inspiration | Why |
|---|---|---|---|
| `gta` (Grand Transmission Auto) | Chrome engine-block body, bolted plating, twin exhaust-pipe "whiskers." Two round headlight-eyes track independently — one always aimed at the "storefront," one at the "dashboard." | Varoom/Revavroom (Scarlet/Violet's vehicle-Pokémon family) | Matches the actual project: a car marketplace with one PHP/PDO API backing both a server-rendered site and a Vue SPA. The dual-headlight detail is a literal read of "one API, two frontends" without making the whole design about duality (revised mid-session from an earlier twin-headed-bird concept that leaned too far into the duality idea and not far enough into "car"). |
| `haarlem` (Haarlem Festival) | Decorator creature wearing a string of bunting flags/paper lanterns instead of a flower lei. Always mid-arrangement. | Comfey (decorator Pokémon) | Fred led the Figma design team before building the site — a "decorator" creature captures that design-first role, and bunting/lanterns are literally festival dressing. |
| `selfhost` (Self-Hosted AI Infrastructure) | A ghost-spark fused into a home-server tower rather than floating free. | Rotom (possesses/lives inside an appliance) | "Runs on Fred's own hardware" — Rotom's whole design premise is a spirit inhabiting local equipment instead of existing independently, which is exactly the self-hosted-vs-cloud distinction. |
| `somerin` (Somerin) | Cloud-cotton bird wearing a camp bandana/neckerchief. | Swablu (cotton-cloud bird) | Cloud infrastructure (Azure) crossed with camp-counselor styling — matches both the `cloud` type and the literal camp-activity-management subject matter. |
| `souls` (Souls Within) | Small translucent sprite-ghost, deliberately drawn a little more "pixel-game-character" than the other 8 mascots. | Gastly (small ghost/spirit) | A literal read of the project's own name, and the extra game-character styling nods to this being Fred's own 2D platformer rather than a client/academic build. |
| `chapeau` (Chapeau POS) | Beret-crested parrot perched near the register, crest doubling as the "chapeau" (hat) the project is named for. | Chatot (parrot with a beret-shaped head crest, known for mimicking sounds) | "Chapeau" is French for hat — Chatot's crest already reads as a beret, and its sound-mimicry trait matches a POS register that beeps on every ring-up. |
| `greenhouse` (Greenhouse Automation) | The least-evolved-looking mascot of the set: a small seed creature with a thin wire-vine wrapped around it. | Sunkern (most basic seed Pokémon) | Deliberately basic, matching this card's own Basic-tier common rarity — the wire-vine stands in for the Arduino auto-watering rig without over-complicating the silhouette. |
| `movie` (Movie Theater Ticketing) | A key-ring creature carrying ticket stubs instead of keys, floating near a velvet-rope-colored ribbon. | Klefki (key-ring Pokémon) | An usher/gatekeeper reading of "Seat Select" — Klefki's whole design is "carries a ring of small objects," directly reusable as ticket stubs. |
| `servicedesk` (Service Desk Ticket System) | An archivist ghost holding a small clipboard-shaped plaque instead of a mask, tone deliberately understated next to the louder mascots. | Yamask (carries a mask that is itself a record/plaque of its former self) | Yamask's signature trait — a carried object that *is* a record — maps directly onto a ticket-logging/routing system. |

## Section 2 — Animation tier: lenticular tilt-frame-swap

Each mascot ships as 3 SVG frames (idle / mid-tilt / full-tilt) — cheaper than the flagships' continuous idle-loop + hover-activate treatment, per the flagship spec's Decision 1.3. Per-mascot frame descriptions (illustrative — final poses are an implementation-time judgment call within this concept):

- `gta`: both headlights dim → one flickers on → both lit, exhaust puffing
- `haarlem`: garland loose → straightens/orders itself → lanterns light up
- `selfhost`: dim/dormant → spark flickers inside the tower → fully lit, fan-blur spinning
- `somerin`: grounded/resting → wings half-open → airborne, bandana flapping
- `souls`: translucent/drifting → solidifies slightly → full opaque, eyes bright
- `chapeau`: perched quiet → beak opens → mid-chirp, crest raised
- `greenhouse`: dry/still → wire-vine glows faintly → droplet falls, seed perks up
- `movie`: keys/stubs still → ring spins slightly → one stub pops forward, "torn"
- `servicedesk`: plaque blank → plaque fills with a line → plaque stamped/glowing

### Mechanism

`Card.jsx`'s existing `writeTilt(mx, my)` function — already called from every pointer-move, touch-move, and device-orientation event, unified across desktop and mobile — gains one additional write: a `data-tilt-frame` attribute (`"0"` / `"1"` / `"2"`), derived from tilt magnitude from center (e.g. `Math.hypot` of the existing `rx`/`ry` values against two thresholds). No new event listeners are added; this rides the same call already writing `--mx`/`--my`.

Each mascot's 3 frames render as sibling SVG `<g>` elements (or 3 separate `<svg>`s in a stacked container) inside `MascotArt`'s registry, mirroring the flagship pattern. CSS selects visibility by the card's `data-tilt-frame` value:

```css
[data-tilt-frame="0"] .mascot-frame-1, [data-tilt-frame="0"] .mascot-frame-2 { opacity: 0; }
[data-tilt-frame="1"] .mascot-frame-0, [data-tilt-frame="1"] .mascot-frame-2 { opacity: 0; }
[data-tilt-frame="2"] .mascot-frame-0, [data-tilt-frame="2"] .mascot-frame-1 { opacity: 0; }
```

(Exact selector scoping — e.g. namespaced under `.tcg-card[data-tilt-frame="N"]` — is an implementation detail for the plan.)

`handleLeave()` resets `data-tilt-frame` to `"0"` alongside its existing transform reset, so cards return to their idle frame when the pointer leaves.

### Reduced motion

`prefers-reduced-motion: reduce` pins every card's mascot to frame 0 regardless of tilt state — a CSS override (`[data-tilt-frame] .mascot-frame-1, [data-tilt-frame] .mascot-frame-2 { opacity: 0 !important; }` inside the media query) rather than a JS change, so the tilt-tracking code itself doesn't need reduced-motion branching.

### Off-screen pause

No new mechanism needed — these are discrete opacity swaps triggered by pointer/tilt state, not continuous loops, so there's nothing to pause off-screen. The existing `useInViewAnimation`/`scene-paused` plumbing (added in the flagship pass for the flagships' continuous idle-loop animations) is unaffected and unused by this tier.

## Section 3 — Integration with the existing `.art` icon system

The classic layout's `.art` box (`src/components/Card.jsx`, the `!fullArt` branch) currently renders:

```jsx
<div className="art">
  <span>{project.icon}</span>
  <div className="art-shine" />
</div>
```

This pass 1:1-swaps the `<span>{project.icon}</span>` for the mascot's 3-frame SVG group, in the same box, same size/position — no redesign of the `.art` box itself. `project.icon` fields stay in `cards.js` as a fallback/reference (mirroring how the flagships kept `icon` alongside their new `mascot` field) but are no longer rendered once a project has a `mascot` id.

## Out of scope

- "Trainer card" art of Fred for the 2 Supporter cards — deferred to a future pass.
- Full-art scene treatment for these 9 (classic layout only; no `FULLART_SCENES` work).
- `CardModal.jsx` icon display.
- Any new animation dependency.
