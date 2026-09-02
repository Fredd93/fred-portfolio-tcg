# Jericho Redesign v2 — Design

> **Cycle 2 revision, 2026-09-02.** Cycle 1 of this document was written without ever
> seeing a single piece of real card art — my tools returned page text only. Fred has since
> supplied 18 reference images (`docs/reference/jericho-inspiration/`, see `MANIFEST.md`)
> and I have now looked at every one of them, including the exact Magneton he put next to
> the live card. He also corrected the premise underneath the brief. **Section A below is
> the changelog and is the most important part of this document.**

---

## Section A — What changed in cycle 2, and why

### A.1 The correction

Fred, on what he actually selects for:

> *"I don't have a favorite based on flatness or not. My favorite is based on the aesthetic
> and emotions it evokes — for example the Magnemite looks warm and cute and fuzzy all
> together, literally makes me feel things when I look at it."*

And the target:

> *"the feeling of Jericho being an assistant that helps the user and is always there for
> them should give the reader that emotion"*

**The deliverable is a feeling: warm, devoted companionship.** Something quietly, gladly
there — a dog by the door that looks up when you come home. Not vigilance. Not surveillance.
Not a guard on duty.

Technique is downstream of that and serves it. Taking a felt response, reducing it to
mechanics, and then optimising the mechanics is the process that produced v1. Every
technique in Section 2 has been re-audited against one question — *does this make the card
feel warmer and more affectionate, or is it rigor for its own sake?* — and the audit is
shown, with cuts.

### A.2 The single biggest finding: Fred's favourite is a **Character Rare**

`Magnemite 242/236` (Cosmic Eclipse, 2019) — the card Fred flagged *"gorgeous, perfect
example of story on card"* — is not a cozy Illustration Rare. It is one of Cosmic Eclipse's
**Secret Rare Character Cards**, and the human in it is **Lt. Surge**, confirmed across
multiple listings and by the uniform, rank patch and blond spike in the art itself.

Character Rare is a *named, defined convention*, introduced in Cosmic Eclipse: a card type
"that illustrates the bond between a Pokémon and its Trainer," rendered full-art, with the
Trainer specifically chosen as one known to own that Pokémon (Pikachu/Red, Piplup/Dawn,
Mimikyu/Acerola — and Magnemite/Lt. Surge, who fields Magnemite in his Gym).

**So the target genre is not "cozy interior." It is a portrait of a relationship.** The
subject of the illustration is the bond. That is the correct frame for "an assistant that is
always there for you," and it retroactively confirms §0.1 (the flavor text needs two
characters) while overturning most of how cycle 1 staged them.

### A.3 The changelog

| # | Cycle 1 | Cycle 2 | Why |
|---|---|---|---|
| 1 | Fred = "a dark mass with a warm rim light, no facial detail, small, not the subject" | **Fred is large, lit, and has a visible face.** Right ~45% of the band, head ~30% of band height, cropped at the chest. | Lt. Surge is the largest and most expressive thing in his frame, grinning at the viewer. The warmth *comes from* a visible human visibly happy. §3.4 argues the residual risk and where the emotional load actually sits. |
| 2 | "Unit A is **the sentinel**… three eyes, one open, watching him… **A's eye never closes**" | **All eyes closed at rest, in contented arcs. The ears stay turned toward him.** Eyes open on wake, and blink. | An unblinking eye trained on a person in a dim room is a security camera, not devotion. Kitaoka's Magnemite has a *closed, contented arc* for an eye. Devotion is postural — a sleeping dog with one ear cocked. New thesis line in §6.3. |
| 3 | "Late shift" — dim room, one desk lamp, `#171625` dusk palette | **Late-afternoon sun raking through a window.** Bright, warm, saturated. | Every one of Fred's three flagged cards is bright. Nothing in the 18-image set is dark except two action cards. Cycle 1 diagnosed this exact failure in §0.4 and then reproduced it with better furniture. |
| 4 | Node on a shelf across the room | **Node is on the desk, at Fred's hand, touching a mat he made.** | Kitaoka's Magnemite is *at Lt. Surge's hand*. "Periphery" is attentional, not spatial: it's in arm's reach and not asking for anything. |
| 5 | No story event — a device watching a man | **Fred is mid-repair on one of the units.** Panel open, warm amber light inside, a detached dish-ear and two loose screws on the mat, a screwdriver in his hand. The unit is holding still. The other two hover close, watching their sibling. | This is Kitaoka's card's actual story (Surge caught mid-maintenance, sweaty, grinning) *and* it is literally true of the project (`Stage 2 · In Progress`). You only take something apart on your own desk if you care about it, and holding still for it is trust. |
| 6 | Crosshatch texture via two `<pattern>` defs | **CUT.** Replaced by **halftone dot screens.** | Same cost, same job. Crosshatch reads etched/engraved/serious; halftone reads printed/soft/playful. Fred said "warm and cute and fuzzy." Dots are fuzzy. Sourced to DOM's Deoxys VSTAR GG46/GG70, which fills its whole background with visible dot screens. |
| 7 | "The laptop screen lights up — **this is the story beat**" | **CUT entirely.** | It is generic tech-advertising imagery, it is the most AI-slop moment in cycle 1, and Jericho is *voice*-driven. Showing a screen light up is showing the wrong organ. |
| 8 | Gold hexagon lattice "gilded wallpaper" over the wall plane | **CUT.** Hexagon survives as a **crocheted hexagon-pattern mat** Node rests on. | Hex-lattice-over-everything is the exact generic AI-architecture visual the standing rules ban. A hand-made hex mat is warm, domestic, unmistakably hexagonal, and says "he built this alone." |
| 9 | Shadows hue-shift toward indigo `#3a3560`; indigo-dominant palette | **Shadows shift toward warm environment bounce.** Indigo demoted to the iris ring and the arcs only. | Type colour does not have to dominate an illustration — Kayama's Rotom IR is a Lightning card that is mostly mint, cream and coral. The type is signalled by the frame; the art is free to be the scene. |
| 10 | §1.2 "if Fred declines the layout change" fallback; `[needs layout change]` markers | **Deleted.** | Fred approved it: *"the info on the card should be minimized… only shows full info on the overlay when clicked on."* He notes he asked before. It is firm. |
| 11 | §7.1 "I never saw the Magneton SVP 159 artwork myself" | **Resolved — I have now seen it,** and I can correct my own record. | See §7. |

Everything not in this table is carried forward from cycle 1 substantially intact.

---

## Context

The v1 Jericho pass ("Node" — a glass-orb core with three hex-plated satellite modules,
staged in a dusk room) shipped and was rejected. Fred put the live card next to a physical
**Magneton, SVP 159 (Illustration Rare, illus. Shinji Kanda, Surging Sparks ETB promo,
2024)** and asked: *"the point of the plan was to create from scratch that it has a story…
so where is the story conveyed?"* — and *"I want a dedicated designer not just AI-slop
thrown on a plate and have it called fine dining."*

Jericho (`src/data/cards.js`, id `jericho`) is `rarity: 'hyperrare'` (the deck's top tier),
`type: 'arch'` (`#5a5ec9`, indigo), HP 4108 LOC, flavor: *"Lives at the periphery until you
need it — then it's already listening."* It is the benchmark card: whatever bar it sets
becomes the floor for the other 11.

---

## Section 0 — Why v1 failed

Four failures, in order of severity. Cycle 2 sharpens 0.1 and 0.4; 0.2 and 0.3 stand as written.

### 0.1 There is no "you" in the picture, so "at the periphery" means nothing

The flavor text is a two-character sentence: an assistant, and a person who needs it. v1
drew only the assistant. A room with no one in it is not "the periphery" of anything — it's
just an empty room. The composition had no subject to be peripheral *to*.

**Cycle 2 strengthens this to a genre claim.** The card type whose entire defined purpose is
"the bond between a Pokémon and its Trainer" already exists — Character Rare — and Fred
independently flagged one as his perfect example of story on a card without knowing that's
what it was called. That is the format. Jericho's card is a Character Rare of Fred and Node.

### 0.2 The story is physically hidden by the layout

v1 staged the window, shelf, lamp and rug in the lower two-thirds of the art canvas.
`.layout-fullart .bottom` (`src/styles/card.css:311-314`) paints `rgba(6,6,10,.94)` —
effectively opaque — over that region.

Estimating from the CSS type metrics against Jericho's actual data (3 attacks with 2-3
sentence bodies at 8.8px, a `card-description` paragraph at 9.5px/1.35, 2 language pips,
role/retreat, flavor, footer, 8px padding): the `.bottom` block runs roughly **250px of a
346px-tall card face — about 70%**, with `.top-row` taking a further ~61px. The genuinely
clear art band is on the order of **30-45px, under 13% of the card**. (Approximate: derived
from font metrics, not a measured render. The direction of the number is not in doubt.)

So v1's staging note in `card.css:122-127` ("every element that has to stay legible is
anchored from the top within that surviving band") was written as if the band were usable.
It isn't. There is no illustration in the world that tells a story in a 35px strip.

### 0.3 The mascot is a diagram, not a creature

`JerichoMascot` (`src/components/MascotArt.jsx:17-70`) is 3 hexagon `<polygon>`s with a
uniform 1.3 stroke, 3 rivet circles, 3 stub rects, a circle-clipped orb with 6 flat facets at
2-12% opacity, and 2 dashed quadratic curves for arcs. It has **no face, no eye, no light
source, no line-weight variation, no texture, and no recognizable real-world parts.**

Real Magnemite/Magneton work because their parts are *objects*: per Bulbapedia, Magnemite is
"a gray, spherical metal body" with "a single, large eye," "blue-and-red tipped horseshoe
magnets on each side," and "three Phillips head screws on its body." I can now confirm all
of it visually — on `Magneton_common.jpg` (MEG 046/132, illus. Saboteri) and on Kanda's
SVP 159 the cross-slot screws and red/blue magnet caps are plainly legible even at thumbnail
size. Those specifics are what make it a creature and simultaneously what give the
illustration its surface density, for free.

The lineage choice was right and stays. Magneton's Pokédex line, printed on SVP 159 itself,
is *"They're formed by several Magnemite linked together. They frequently appear when
sunspots flare up."* Three linked units is canon. **The execution, not the lineage, failed.**

### 0.4 The rendering has no light and no texture

The v1 dusk room is `linear-gradient(180deg,#171625,#221f38,#2b2440,#14121d)` plus a soft
radial wash — a dark blue-purple field. v1 is a dark-mode UI panel with furniture drawn on it.

**Cycle 2 makes this concrete with a count.** Across the 18 reference images, the cards that
are *dark* are exactly two — `Electrode_Ultra_Rare.jpg` (GX 48/168, storm sky) and Kanda's
SVP 159 (black scribble field) — and both are **action** cards, where darkness serves
threat. Every card in the set that is *warm* is also *bright*:

- `Magnemite_..._story_on_card.jpg` — a workshop full of orange and amber, a lit halo behind Surge's head.
- `Magnezone_Promo_my_favorite_asthetically.jpg` — teal/mint/cream/lavender, high-key throughout.
- `Rotom_IR.jpg` (DRI 197/182, illus. Taiga Kayama) — a daylit desk of gadgets in mint, coral, cream and warm wood.
- `Rotom_Ultra_Rare.jpg` (LOR 177/196, illus. Yuu Nishida) — an appliance junk-shop bathed in orange and gold.
- `Voltorb_R.jpg` (Hisuian Voltorb GG01/GG70, illus. HYOGONOSUKE) — dappled sunlight on a forest floor.
- `Electrode_Secret_Rare.jpg` (CRE 222/198, illus. Ryo Ueda) — a full gold radial burst.

**There is no warm dark card in Fred's reference set.** Cycle 1 defended a dim room on
craft grounds. That defence does not survive the evidence, and §4 moves to daylight.

---

## Scope

**In scope:** a complete redesign of the Jericho card's illustration — the mascot
(`JerichoMascot`), the scene (`JerichoScene`), their supporting styles, and the full-art text
layout now that it is approved. Plus hover (desktop) and touch-and-hold (mobile) animation.

**Out of scope:**
- The other 11 cards. This sets the bar; applying it is a later pass.
- `CardModal.jsx` design, beyond the fact that overflow copy lands there.
- Implementation mechanics (component structure, CSS selectors, animation plumbing).
- New animation dependencies. Everything here is CSS + inline SVG.
- Changing Jericho's *copy*. §1 changes where some of it is *displayed*, not what it says.

---

## Section 1 — Layout: settled

Fred approved the change: **minimal card face, full detail in the click-through modal.**
No fallback branch, no conditionals.

### 1.1 What real cards actually do — now verified across 23 cards

Measured off Fred's physical cards in `docs/reference/pokemon-cards/`:

| Card | Layout | Illustration coverage | Text treatment |
|---|---|---|---|
| **Arven's Mabosstiff ex**, DRI 139/182, illus. akagi | Full Art ex | **100% full-bleed, zero occlusion** | White text with heavy dark stroke directly on the illustration. Text band ≈22%; bottom W/R/R strip ≈11%, light scrim only. |
| **Gourgeist ex**, CRI 102/086, 5ban Graphics | Full Art ex | **100%, zero occlusion** | Same — the pumpkin body reads clearly behind "Horrifying Rondo." |
| **Cobalion ex**, CRI 064/086 | Regular ex | Art window ≈41%, one unbroken rectangle | Separate holo panel below. |
| **Cinccino ex**, CRI 073/086 | Regular ex | Art window ≈43% — **the tail breaks out and crosses the text panel** | Panel deliberately violated by the art. |

And now across all 18 `jericho-inspiration` images: **every single full-art / IR / SIR / UR /
Secret Rare card in the set puts its text directly on the illustration with a stroke or halo.
Not one has an opaque panel.** The Kayama Rotom IR is the sharpest proof — its attack text
sits over a photographically busy desk of gadgets and is perfectly legible, because Kayama
composed the lower third out of pale, low-contrast objects (a cream keyboard, a white tablet,
light wood) rather than covering it up.

Legibility on a real card is compositional, never architectural:
1. The illustrator composes the lower third lighter and lower-contrast so text sits on it.
2. Text is stroked/haloed, not boxed.
3. There are only **1-2 attacks with 1-2 lines of rules text each.**

Our card currently shows 3 attacks with 2-3 sentence bodies *plus* a description paragraph
*plus* language pips — roughly 4× the text volume of any real card. That is *why* it needs a
70% opaque panel. The panel is a symptom.

### 1.2 The approved layout

1. **Drop the opaque `.bottom` background** to a compositional scrim — a bottom-up gradient
   topping out around `rgba(8,7,14,.45)` — and stroke the text instead. Art edge to edge.
2. **Cut on-card text to real-card density**: at most **2 attacks, one line of body each.**
   The third attack, `description`, `detail` and `languages` move to `CardModal`.
3. **Compose the lower third light and low-contrast** (the Kayama principle) so the scrim can
   be that weak. §4 does this deliberately: the desk surface, the mat and the pale mug all
   live down there.
4. **Resulting vertical budget on a 242×346 face:** top row (transparent gradient, art
   visible) 0-78; **clear art band 78-225 (147px, ~42%)**; text overlay 225-320 (art visible
   behind); footer strip 320-346 (art visible behind). Within a couple of points of
   Mabosstiff ex.

This reverses a scope note in `docs/superpowers/specs/2026-08-18-fullart-illustration-scenes-design.md`.
That was the right call when scenes were background texture; it is the wrong call now that
they carry the story. Naming the reversal so it stays a conscious choice.

---

## Section 2 — Technique, audited against warmth

Ten techniques from cycle 1, each re-asked: *does this make the card feel warmer and more
affectionate, or is it rigor for its own sake?* **One cut, four substantively rewritten, five
kept.** Verdict stated first in every case.

**2.1 — Line-weight hierarchy. KEEP, and push harder.**
Uniform `stroke-width` is the number-one vector-slop tell, and v1 uses 1.3 everywhere. But
this is also the most *warmth*-relevant technique in the list, because a heavy confident
outline is what makes a drawn thing read as friendly and toy-like rather than technical.
Kitaoka's Magnemite has a thick, soft, unbroken contour; Komatsu outlines every pipe and gear;
the Magnezone fan art is nothing *but* bold outline. Three tiers: outer silhouette on the
creature **2.6** (up from cycle 1's 2.2), major internal separations **1.2**, surface detail
**0.6**. And the outline colour is a **warm dark brown-black `#2e2119`**, never neutral grey
or `#000` — Kitaoka's linework is warm, and that is half of why the card feels warm.

**2.2 — Crosshatching. CUT. Replaced by halftone dot screens.**
This is the clearest case of the audit doing real work. Crosshatch is a rigor technique: it
signals etched, engraved, serious, laborious. It does not signal warm, cute or fuzzy. The
replacement costs the same — a single `<pattern>` of dots, reused — and is directly sourced:
**DOM's Deoxys VSTAR GG46/GG70** fills its entire navy and magenta background with visible
halftone dot screens, giving it a soft risograph-print feel. Two dot patterns (fine 1.6px
pitch for the shadow side of objects, coarse 3px for the wall plane), warm-toned, at 8-12%.
Dots read as *printed*, which is a warmth cue on a card, and they blend at thumbnail size
into a soft tone rather than a scratchy one.
*(Kanda's SVP 159 does use visible sketch-hatching on the Magneton bodies, and it is superb —
but on an action card in a black scribble field. It is the right tool for the wrong feeling.)*

**2.3 — Shading. KEEP the three-layer discipline, REWRITE the hue rule and the edge quality.**
Every solid object still gets base + shadow + specular. Two changes:
- **Shadows shift toward the environment's warm bounce (`#8a6a52`), not toward indigo.** On
  Kitaoka's Magnemite the shadow side of a *cool silver* sphere is warm grey-lavender,
  because it's picking up an orange workshop. Cycle 1's indigo shift would have made a warm
  room feel cold at exactly the point where warmth is being built.
- **Cel edges, not airbrush gradients.** The three flagged cards all use hard-edged shadow
  *shapes* with one or two tones, not smooth ramps. This is simpler to author and more
  faithful. (PLANETA Tsuji's Magnezone ex SVI 226/198 is the airbrushed counter-example —
  gorgeous, and not what Fred picked.)
- **Speculars stay hard, and get bigger.** Kitaoka's Magnemite carries a broad soft blowout
  on the upper-left of the sphere *plus* three hard white four-point star glints on the rim.
  A bright glossy highlight is a warmth cue: it makes an object look clean and cared-for.

**2.3b — The sphere recipe (new; answers the `02-sphere-voltorb-electrode` bucket's question).**
v1's core failed to read as a sphere. `Voltorb_RR.jpg` (Voltorb ex ASC 058/217, 5ban Graphics)
gives the four-part answer, and it is worth transcribing literally: **(a)** a broad soft
highlight offset up-left of centre; **(b)** a small hard hotspot inside it; **(c)** a dark
**terminator band** running as a crescent, darker than the shadow that follows it; **(d)** a
bright **bounce rim** along the far lower-right edge, warmer than the base. It is (c) and (d)
together that make it a sphere — v1 had neither. `Electrode_promo.jpg` (Hisuian Electrode V,
SWSH294) adds the fifth: its **wood grain curves to follow the surface**, so any surface
detail on Node's shells (panel seams, screw placement) must curve with the form, not sit flat.

**2.4 — Radial burst array. KEEP the device, RECOLOUR and RESHAPE it.**
Cycle 1 specified 44 thin cool jittered rays firing as a discharge. Wrong register. The two
burst references in Fred's own set are both *warm and celebratory*:
`Magnezone_SIR_fan_art_Best_candidate.png` has a **pastel** burst — pink, butter yellow,
mint, lavender — soft and candy-coloured; `Electrode_Secret_Rare.jpg` has a **gold** one.
Neither is aggressive. Revised: **20-24 wedges** (down from 44, and wider), colour ramping
warm cream `#fdf1d6` at the core to soft peach `#f0b678` and pale mint `#cfe6d8` at the tips,
angular spacing still jittered ±40% of the mean step (evenly spaced rays read as a loading
spinner), whole `<g>` under a radial mask so it fades before the frame edge.
It stays at 0 opacity at rest — you do not put burst lines behind a resting creature — and
fires on wake as **delight**, not discharge.

**2.5 — Electric arcs. KEEP the craft, DEMOTE the role.**
v1's arcs are `stroke-dasharray: 3 3` on quadratic curves — a UML dependency arrow. Real
arcs, as on Kanda's SVP 159 and Electrode GX 48/168: a `<polyline>` with **6-10 sharp
direction reversals**, segment lengths decreasing toward the tip, drawn as two stacked paths
(under-path ~3.5px in colour with `filter: blur(2px)`, over-path ~1.1px near-white), with 2-3
short branch stubs at 30-50°, tapered by filling a polygon rather than stroking a line.
**But arcs are action vocabulary.** On a bond card they cannot be the main event. Reduced to
**two short soft arcs between the units** on wake — a "they're talking to each other" gesture,
not lightning across the frame.

**2.6 — One light source. KEEP the discipline, CHANGE the source.**
Cycle 1: a desk lamp in a dim room. Cycle 2: **late-afternoon sun raking through a window.**
Warm gold `#f7d08a` core, `#e8a33d` falloff, entering low from the upper left. Every object
obeys it: warm rim on the window side, cool soft fill on the other. This keeps the entire
craft benefit of a single committed directional source — which is what separates illustration
from schematic — while being bright, and it is exactly HYOGONOSUKE's device on Hisuian
Voltorb GG01/GG70, where dappled sun through a canopy does all the emotional work.
It also passes the uniqueness audit that the desk lamp fails (§5).

**2.7 — Contact shadows, two-part. KEEP, and it matters more now.**
Two ellipses under every contact point: a small hard dark core at 0.5 directly under it, and a
wider soft one at 0.18 with a blur. One blurred blob reads as a UI drop shadow; the hard core
is what makes an object *sit*. Warmth-relevant now in a way it wasn't in cycle 1, because
Node has come off the shelf and is **touching things** — the mat, the desk, Fred's hand — and
contact shadow is what sells touch.

**2.8 — Atmospheric perspective, three explicit planes. KEEP, strongly — now visually confirmed.**
Cycle 1 asserted this from craft principle. It is directly observable in two of the reference
cards: on Kitaoka's Magnemite the three background Magnemite are drawn in **flat desaturated
grey with no rendering at all** while the foreground one is fully lit and glinting; on
Saboteri's `Magneton_common.jpg` the background Magneton are pale washed grey against a
saturated, outlined foreground. Method: background plane gets a semi-transparent scrim of the
ambient wall tone at **14-18%**; midground untouched; foreground at full saturation with a
slight edge vignette. Three planes, explicitly separated. This is what depth is; it is not a
blur filter.
Warmth payoff: it lets us put **more Node units in the frame as a family** without clutter —
which is precisely what Kitaoka does, and it is quietly one of the tenderest things in his card.

**2.9 — Overlap, always. KEEP.**
No object floats in isolation. Now automatic: Node touches the mat, the mat overlaps the desk
edge, Node overlaps Fred's hand, Fred's shoulder overlaps the pegboard, the foreground mug
crops the desk. v1's Node floated in front of an empty wall, touching nothing.

**2.10 — Grain. KEEP, REFRAME, and it is the first thing to cut if effort runs short.**
One full-frame `<rect>` filled by an `feTurbulence` (`baseFrequency` ~0.8, `numOctaves` 3) at
3-4% with `mix-blend-mode: overlay`. Cycle 1 justified it as "kills the flat digital gradient
tell" — rigor. The honest warmth justification is better: **grain plus halftone together read
as printed card stock**, and a real card is a physical printed object you hold. That is a
warmth cue. But it is the lowest-yield item here and I would drop it before dropping anything
else.

---

## Section 3 — The mascot: Node, rebuilt

Keeps the name, keeps the lineage, throws away the geometry.

| | v1 (rejected) | Cycle 1 | Cycle 2 |
|---|---|---|---|
| Lineage | Magneton / Electrode | Magneton / Magnemite | **Unchanged** |
| Form | Glass orb + 3 abstract hex plates | Three linked steel shells | **Unchanged** |
| Parts | Polygons, rivets, stubs | Dish-ears, Phillips screws, red/blue tips | **Unchanged, plus an openable flank panel** |
| Face | None | Three eyes, one always open, watching | **Three eyes, all closed in contented arcs at rest; the ears do the listening** |
| Register | Wireframe | Sentinel | **Companion** |

### 3.1 The units

Three rounded, slightly flattened steel shells — a river stone, not a sphere; a perfect
circle is the shape v1 already failed with. Unit **A** is the largest and nearest, ~46px
across on a 242px-wide face. Units **B** and **C** are ~0.70 and ~0.55 of A, sitting deeper in
frame, arranged in Magneton's canonical triangle but **tipped off-axis** so it reads as a
resting group rather than a symmetry diagram.

**The three are siblings with different characters**, which is where Jericho's actual
architecture enters as personality instead of as a diagram:
- **A** — the one on the desk, being worked on. Scuffed, warm-toned, slightly worn at the
  edges. This is the local model: it has always been here.
- **B** — cleaner, cooler, floats a little higher, sits fractionally further away. The cloud
  provider. Newer.
- **C** — smallest, closest to A, tucked in near the work. The core.

None of that needs to be legible to a viewer. It just needs to be *true*, because it is what
stops the three from being three copies of one shape.

### 3.2 The ears — the listening organ, and the whole character

In place of Magnemite's horseshoe magnets, each unit carries **two small parabolic dish-ears**
on short gimbals. A satellite dish is the most literal object-language for "listening," and it
maps to the real magnet's silhouette and placement. Inner cone of the left dish **red-tipped**,
the right **blue-tipped** — a direct quote of Magnemite's blue-and-red magnet caps, which is
the detail that makes the lineage legible at a glance (clearly visible on both `Magneton_common.jpg`
and Kanda's SVP 159 even at thumbnail size). Colours drawn from the existing `TYPES` table
(`#c0392b`, `#2b7fd1`) so they sit in the deck's own colour world.

**At rest, every eye is closed and every deployed ear is aimed at Fred.** That is the entire
design in one sentence, and it is the cycle-2 correction made concrete. Devotion is postural,
not ocular. A dog asleep by the door with one ear cocked toward the room is the reference
image, and it says "always there for you" without a single note of surveillance.

### 3.3 Screws, panel, eye

**Screws.** Three Phillips-head screws per unit, placed as on Magnemite — two low, one on the
crown reading as an antenna. Nine screws: nine free specular glints, nine bits of surface
density, nine authentic lineage cues. Each is 4 elements (rim circle, recessed circle, two slot
lines). Two of A's are **loose on the mat**, which is the story.

**The flank panel (new).** A's left flank panel is **open**, hinged down, revealing a warm
amber interior glow (`#f2a93b`) and a suggestion of soft internal components. This answers the
`03-translucent-inner-light` bucket — Deoxys's lit chest core is the nearest available analogue
— and it is the single most Jericho-specific image in the card: an open machine with a warm
light inside it and a human hand next to it.

**The eye.** Per Bulbapedia, "a single, large eye embedded in an iron sphere." Ours has two
states:
- **Rest (default):** a **closed contented arc** — a single confident curved stroke, lifted
  slightly at the outer end. This is exactly how Kitaoka draws his Magnemite's eye on the
  flagged card, and it is the reason that Magnemite looks blissful rather than blank.
- **Woken:** the arc unfolds into a round eye — dark inset socket, a ring iris in `#5a5ec9`
  (the `arch` type colour, arriving as a *character* colour), heavy upper lid, and a small
  **warm catchlight** picked up from the sun. The catchlight is what makes an eye alive; it is
  present on every Magnemite/Magneton/Magnezone eye in all seven cards in bucket 01.

### 3.4 Fred, and the face problem — arguing against the flagged card

Cycle 1 staged Fred as a faceless dark mass. The flagged card does the opposite: Lt. Surge is
roughly **65-70% of the art area**, cropped at the thigh, **grinning directly at the viewer**,
one eye winking, mid-brow-wipe, sweaty. The affection between man and machine *is* the subject,
and the warmth comes from a visible human visibly happy.

**Cycle 1's silhouette does not survive that, and I'm overturning it.** But the honest reason
Kitaoka can put the emotion in a grin is that Kitaoka can *paint* a grin. Hand-authored SVG
cannot reliably, and a bad face is worse than no face. So the resolution is not "face vs. no
face" — it is **relocating the same emotional content to a channel we can actually execute.**

- **Fred is present, lit, faced and large.** Right ~45% of the clear band, three-quarter view,
  head turned down-left toward the work, cropped at mid-chest by the text overlay. Head ~44px
  tall — roughly 30% of the band height, matching Kitaoka's relative scale. A small closed
  smile, eyes down, absorbed. Warm sun rim along his left contour.
- **The emotional load sits in the hand, not the face.** His left hand rests on the desk
  beside A — palm down, fingers relaxed, a small screwdriver held loosely. A hand resting
  next to a small creature is one of the most reliably tender images there is, and a hand is
  far easier to draw convincingly in vector than a face. If exactly one element in this card
  has to be drawn beautifully, it is that hand.
- **Simplify the face like Kayama and Komatsu, not like Kitaoka.** At 44px, a face must be a
  handful of confident marks — hair shape, brow, a dot per eye, one line for the mouth. Both
  Rotom illustrators simplify human-scale detail to near-icons and lose nothing.

**Flagged risk:** this is the highest-execution-risk element in the document. If the face
cannot be made to read warmly at render size, the fallback is *not* the silhouette — it is to
**raise the crop**, cutting Fred at the brow so the frame holds his jaw, mouth, shoulder and
hand. That keeps a human face partly present and moves all expression to the mouth-corner and
the hand, which are the two easiest things here to draw well.

### 3.5 Palette

Warm-dominant, natural, saturated. No invented neon.

| Role | Value |
|---|---|
| Sunbeam core / falloff | `#f7d08a` / `#e8a33d` |
| Wall (sunlit → shade) | `#e8d3b0` → `#b99a78` |
| Desk wood | `#a8703f`, hard specular streak on the near edge |
| Environment shadow (all objects) | `#8a6a52` — warm bounce, never grey, never indigo |
| Node shell base | `#dfe3ea` — cool clean off-white steel |
| Node sun-side reflected warmth | `#f0c89a` |
| Node core shadow | `#8a7f9c` |
| Hard specular | `#f8f9fc` |
| Open-panel interior glow | `#f2a93b` |
| Iris ring (woken) + arcs | `#5a5ec9` (`arch` type colour) |
| Magnet-cone tips | `#c0392b` / `#2b7fd1` (from `TYPES`) |
| Outline | `#2e2119` warm brown-black |

**Node is the coolest, brightest, cleanest thing in a warm room.** That is Kitaoka's exact
device — his silver Magnemite pops out of an orange workshop — and it is why the creature
holds the eye without needing to be the largest thing in frame.

**No gold on the creature.** Bulbapedia's hyper-rare definition is gilded *backgrounds* and
frames; the Pokémon keeps its own coloration. Confirmed visually on `Electrode_Secret_Rare.jpg`,
where the entire background is gold but Electrode keeps its white and blue. Gold treatment is
specified in §5 and lands on the frame and the light, not on Node.

---

## Section 4 — The scene: "Mending, late afternoon"

**One sentence:** *Late sun rakes across Fred's desk; he is mid-repair on one of Node's three
units, panel open and warm inside; it holds still for him with its eyes shut and one ear
turned his way; the other two hover close, watching.*

That is the flavor text staged as a Character Rare, and it is Kitaoka's structure —
person and machine caught in a shared moment of ordinary work — with Fred's actual project in it.

Coordinates on a **242×346** canvas (matching `.tcg-face`), `preserveAspectRatio="xMidYMid slice"`.
Clear art band is **y 78-225**.

### Plane 3 — the room (y 0-190, scrimmed 14-18%, coarse halftone)

- **Window**, x 0-70, y 55-150, cropped by the left edge. Late-afternoon sky: warm gold near
  a low horizon `#f0b86a` → pale warm blue `#a8c4de` at the top. Two soft cloud shapes, a
  distant rooftop line, four muntin bars, a warm sill. Natural, not an invented gradient.
- **The sunbeam** — the card's light source, and it must be visible as an object. A soft-edged
  polygon from the window down-right across the desk, `#f7d08a` at 0.18-0.26, masked. Its job
  is to **land on A's open panel** — the beam and the amber interior meet at the focal point.
- **Pegboard / workbench wall**, x 76-242, y 20-155, warm off-white in the sun, cooling at the
  frame edges (a real wall has a value change across it because something is lighting it).
  Hung and shelved on it: a soldering iron on a stand, a coil of hookup wire, three jars of
  screws, a small trailing plant, a mug of pens, a stack of four books, a rolled cable, a
  printed photo pinned at a slight angle, a roll of tape, a pair of pliers, a small speaker
  grille, a wall calendar with one month's grid.
- **Prop floor: no fewer than 18 discrete named objects** in the background plane. (Cycle 1
  said 24; the Kayama Rotom IR gets its charm from roughly 20, so 18-22 is the honest target
  and 24 was an arbitrary number.) Stated as a checklist so it can be verified rather than
  eyeballed. Real cards of this kind are crowded; v1 had five elements total.

### Plane 2 — the desk and Fred (y 150-280)

- **Desk** from x 0 (off the left edge) to x 210, surface at y ~192, seen slightly from above.
  Warm wood `#a8703f`, hard specular streak along the near edge where the sun catches it.
- **Fred**, x 130-242, cropped at the shoulder by the right frame edge, three-quarter, head at
  roughly **(186, 108)**, ~44px tall, turned down-left toward the work. Visible, simplified
  face; small closed smile; warm sun rim along his left contour. His left forearm comes down
  and left across the desk; **hand at roughly (126, 186)**, palm down, screwdriver held loosely.
- On the desk, low-contrast and pale (deliberately, per §1.2's Kayama principle, so the text
  scrim can stay weak): a closed notebook, a pen, a pale mug with a thin steam wisp, a small
  parts tray, a cable running off the near edge.
- **No laptop, and no screen anywhere in the frame.** Jericho is voice. Cut in cycle 2.

### Plane 1 — Node (foreground, y 100-215)

- **Unit A** sits **on the mat, on the desk, at Fred's hand** — centre at roughly **(86, 178)**,
  ~46px across, tipped ~8° toward him. Eye closed in a contented arc. Left flank panel hinged
  open toward the viewer, warm amber inside, catching the beam. Its right dish-ear is
  **deployed and rotated toward Fred**; its left dish-ear is **detached, lying on the mat**
  beside two loose screws. Contact shadow, two-part, where it meets the mat.
- **The mat** — a **crocheted hexagon-pattern mat**, x 55-128, y 188-214, in warm rust, cream
  and a muted teal, one corner rucked up. Hexagons as something hand-made and domestic. This
  is Jericho's architecture rendered as warmth rather than as a wireframe, and it is the
  element that could not appear on any other card in the deck. (Precedent for a woven mat under
  the gadgets: `Rotom_IR.jpg`.)
- **Units B and C** float close, at roughly (46, 132) and (114, 142), at 0.70 and 0.55 of A,
  drawn one plane back and slightly desaturated per 2.8. Eyes closed. Ears angled down toward
  the work. They are watching their sibling get fixed.
- **Foreground crop:** the near edge of a coffee mug at the extreme lower-left corner, larger,
  softer and darker than everything else, cropped by the frame. Cheap, real depth — sourced to
  the out-of-focus grass blades crossing the lower frame on `Electrode_Ultra_Rare.jpg`
  (GX 48/168).

### Reading order

Window (brightest) → down the beam → onto A's open amber panel → up along Fred's forearm →
his face → back down his gaze to his hand → to A's closed eye → and A's turned ear points back
up to him. **A closed loop, and the loop is the relationship.** That is a composition; v1 had a
scatter of elements with no path through them.

### The still-frame test

**If the motionless frame does not already carry the feeling, the animation is compensating
for a failed illustration.** Cycle 1's still frame was a dark room with a device watching a
silhouette. This one's still frame is a man mending something that trusts him, in late sun.
That test is also why §6.4 pins `prefers-reduced-motion` to the *rest* state rather than to a
half-woken one.

---

## Section 5 — Hyper Rare treatment, and the uniqueness audit

### 5.1 Rarity treatment

Jericho is `hyperrare`, top of the `RARITY` ladder. Grounded in Bulbapedia's definition (gold
backgrounds, gold borders, an additional layer of glitter foil, three gold stars, Pokémon keeps
its own coloration) and now in direct observation of `Electrode_Secret_Rare.jpg` (CRE 222/198,
illus. Ryo Ueda), which is the real thing:

- **The gold is the sun.** The Electrode Secret Rare's entire background is a gold radial
  burst. Rather than pasting gilding on top of a scene, the scene *supplies* it: the window
  and the beam are the card's gold field, warmed further at the window edge.
- **Glitter-foil sparkles, corrected.** Cycle 1 specified 34 sparkles at 1.5-4px. The real
  card has roughly **12-16 LARGE four-point stars** with long thin spikes, some 4-5% of card
  width, a few with faintly coloured cores. Revised: **~14 large four-point stars, concentrated
  inside the sunbeam** where dust genuinely catches light, on staggered 5-9s twinkles. This
  merges the hyper-rare glitter convention with the scene's own physical logic instead of
  scattering sparkles over a background.
- **Gold hex lattice wallpaper: CUT** (see A.3 #8).
- **Frame:** the existing `.tcg-card.rarity-hyperrare` gold frame is fine and stays.
- **`.holo-shine`:** the one legitimate foil technique per the standing rules. Unchanged; keep
  its Jericho-specific 1.05s delay (`card.css:175-177`), which already lands where the wake
  sequence wants it.

**A note on the rainbow rule.** `Electrode_Ultra_Rare_Alt.jpg` (GX 172/168) shows what a real
rainbow rare actually is: a **pale, pearlescent, near-white** rendering with faint prismatic
tinting in the linework. It is nothing like a saturated multi-stop neon gradient. Worth
recording so the standing rule isn't mistakenly read as "no prismatic anything" — real
rainbow-rare treatment is desaturated to the point of being almost white.

### 5.2 Uniqueness audit

Run against Fred's standing question: *would this look at home on any other card in this deck,
or on any generic cozy IR?*

| Element | Verdict | Reasoning |
|---|---|---|
| Desk lamp lighting a dim room | **CUT** | The single most common cozy-IR setup in existence. Cycle 1's most generic choice. |
| Laptop screen lighting up | **CUT** | Generic tech-advertising imagery — and Jericho is voice-driven, so a screen is the wrong organ entirely. |
| Hexagons as a lattice/wireframe/gilded wallpaper | **CUT** | This is the AI-architecture visual the standing rules exist to prevent. |
| Glowing indigo core | **CUT as-is** | "Product with a glowing blue core" is generic AI branding. Recoloured to warm amber and moved inside an open panel. |
| Bookshelf of books | **REPLACED** | Generic cozy. Replaced with a workbench pegboard of tools and parts — Kitaoka's workshop, and true of a solo builder. |
| Sparkles scattered on a background | **CONSTRAINED** | Kept only where physically motivated: dust in the sunbeam. |
| Late raking window sun | **KEEP with a condition** | Common in card art on its own. Earns its place only because the beam's specific job is to land on the open panel. If it lights nothing in particular, it is generic. |
| Person at a desk | **SHARPENED** | Generic alone. Specific once he is mid-repair, screwdriver in hand, on a creature that is holding still. |
| Three linked units | **KEEP** | Lineage-canonical and literally true of the project. |
| Crocheted hexagon mat | **KEEP** | Could not appear on any other card in this deck. Hand-made, domestic, unmistakably hexagonal. |
| Eyes closed, one ear turned toward the human | **KEEP — this is the card** | The entire thesis in one static detail. |
| Open flank panel, loose screws, detached ear, screwdriver | **KEEP — this is the story** | Simultaneously Kitaoka's structure, the project's real status (`Stage 2 · In Progress`), and an act of care. |

---

## Section 6 — Animation

Continuous idle-loop tier (flagship), per house rule 4. All beats hang off state the card
already tracks — `.tcg-card:hover`, `.tcg-card.tilting` (added on `touchstart`, removed on
`touchend`/`touchcancel`), `.scene-paused` for off-screen. No new event plumbing.

### 6.1 Idle loop (always, when in view)

| # | Beat | Detail |
|---|---|---|
| I0 | Sunbeam | Opacity 0.19 ↔ 0.24 over **9s**, with a slow lateral drift of ~1.5px. Something outside is moving. No flicker — sun doesn't flicker; cycle 1's filament flicker goes with the lamp. |
| I1 | Dust motes | **7** circles, r 0.6-1.1, drifting up and left, 14-22s each, staggered, opacity 0.18-0.35, **masked to the inside of the beam only.** Nothing says warm interior faster and nothing is cheaper. Kept verbatim from cycle 1; it was always the best beat in it. |
| I2 | **Ear-flick** | Every ~9s, A's deployed dish rotates **3-4° and settles**, 220ms, ease-out. Nothing else moves. *This is the most important beat in the design.* It is what a sleeping dog's ear does, it says "listening" with zero menace, and it costs one rotate. |
| I3 | Amber interior | The open panel's glow breathes 0.62 ↔ 0.78 over **4s** — a slow heartbeat, not a pulse. |
| I4 | Node float | B and C bob translateY ±1.2px over **7s**, phase-offset by **1.2s** and **2.4s**. **A does not float** — it is resting on the mat, and a thing that is being repaired holds still. |
| I5 | Steam | Mug wisp: animated `d` on a 9s loop, opacity 0.12-0.22. |
| I6 | Sparkles | ~14 large four-point stars twinkle on staggered 5-9s loops, inside the beam. |
| — | Fred | **Does not move.** He is absorbed. Stillness is affordable and vector humans in motion look bad. |

### 6.2 Wake — hover (desktop) / touch-and-hold (mobile). ~1.15s, then holds.

**The beat is: it opens its eyes and looks up at you.** Everything else supports that.

| t (s) | Beat |
|---|---|
| 0.00 | **Ear turn.** A's deployed dish snaps **6° toward the viewer**, 90ms. It heard something before anything lit up. |
| 0.12 | **A's eye opens.** The closed arc unfolds into a round eye over 140ms — iris ring fades in, warm catchlight lands last. |
| 0.22 | **B opens.** 140ms. |
| 0.30 | **C opens.** 140ms. |
| 0.36 | **B and C dish-ears deploy** from folded to 40° out, 180ms, small overshoot (`cubic-bezier(.34,1.4,.64,1)`). Mechanical parts should overshoot; that is what makes them read as sprung. |
| 0.42 | **Amber interior brightens and warms** 0.70 → 0.92, 260ms. |
| 0.50 | **Two short arcs** flick A→C and C→B. 90ms each, `d` swapping between 3 pre-authored jitter variants at 30ms intervals during the strike — that 3-frame jitter is the difference between lightning and a curve. Small. Settle to 0.5 opacity. |
| 0.58 | **Ray burst blooms** — the 20-24 warm/pastel wedges (2.4) scale 0.90 → 1.03 → 1.00 and fade in over 220ms. Delight, not discharge. |
| 0.66 | **Screw glints** — all nine pop a 2-line cross-glint for 80ms each in a **staggered 25ms cascade** travelling left to right, reading as one light sweeping across metal. |
| 0.74 | **The sunbeam brightens** ~15% and widens ~5% over 350ms; the dust motes briefly speed up. The *room* responds, not just the creature. |
| 0.82 | **Fred's hand opens slightly** — fingers lift ~1.5px off the desk toward A, 260ms. He noticed. *(Stretch, optional, higher risk: his mouth-corner lifts by a single 3px path swap. Do the hand first; the hand is the safer and, I think, the more tender of the two.)* |
| 0.95 | **A leans toward him** — the whole unit translates 2px toward his hand and tips 3° further, 300ms ease-out. Body language replaces "watching him." |
| 1.05 | **`.holo-shine` sweep** — existing element, existing 1.05s delay. Already lands exactly here. |
| 1.15 | **Wake-text "Jericho"** fades in (existing `.jericho-wake-text` hook; reposition clear of the new composition — suggest lower-left of the clear band, over the pale desk). |

**Held state:** rays hold at 65% of peak on a slow 3s breathe; the amber glow holds warm; and
**every open eye blinks on a ~3.5s stagger.** A blink is a warmth cue — an eye that never
closes is a camera; an eye that blinks is alive. This is the direct inversion of cycle 1's
thesis, and it is deliberate.

### 6.3 Sleep — pointer leave / touch release. ~1.2s, reverse order, slower

Rays decay 300ms → arcs fade 200ms → A settles back off its lean 350ms → sunbeam returns 800ms
→ B and C's ears fold at 400ms/520ms → **C's eye closes at 560ms, B's at 700ms, A's last at
900ms**, each folding back into the contented arc over 200ms → amber glow settles.

**A's deployed ear stays deployed, and stays turned toward Fred.** It does not fold. That is
the card's thesis and it replaces cycle 1's:

> ~~A's eye never closes.~~
> **The eyes close. The ear stays turned toward him.**

If an implementer ever folds that ear on leave, the card has lost its point.

### 6.4 Mobile / performance / reduced motion

- **Mobile** (existing breakpoint): ray wedges **24 → 14**, dust motes **7 → 3**, sparkles
  **14 → 8**, grain layer dropped, coarse halftone kept (it is one pattern fill and it is
  doing real work at small size). Timings unchanged.
- **Off-screen:** rides the existing `.scene-paused` class from `useInViewAnimation`.
- **`prefers-reduced-motion: reduce`:** pin to the **rest** frame — all eyes closed in their
  arcs, A's ear turned toward Fred, panel open and amber at base, beam at base, no rays, no
  arcs, all loops `animation: none`, no wake transition. Cycle 1 pinned to a half-woken frame
  because rest was emotionally empty. Rest is now the emotionally complete state, so it is the
  correct static frame — which is the strongest single piece of evidence that the register
  change is right. Follows the existing pattern in `card.css:446-450` and `mascot.css:85-91`.

---

## Section 7 — What I could not verify

Stated plainly, per the standing rule.

1. **RESOLVED from cycle 1: I have now seen Magneton SVP 159 directly**
   (`01-magneton-lineage/Magnetron_rare_promo.jpg`). Cycle 1 flagged that the card-database
   blurbs describing its art as "leaning into the Pokémon's magnetic character rather than a
   busy background" were machine-written SEO filler contradicting Fred's eyes-on account, and
   trusted Fred. **Fred was right and the blurbs are wrong.** The background is an extremely
   dense field of black scribble texture, yellow-green crackle, cyan zigzag lightning and a
   full radial flare — one of the busiest backgrounds in the whole reference set. Recording
   this because trusting Fred's eyes over generated card-database copy turned out to be the
   correct call, and it will be again.
2. **Illustrator credits read directly off the card faces in the supplied images** (ground
   truth, printed on the card): Fumie Kitaoka, Shinya Komatsu, Shinji Kanda, Saboteri,
   PLANETA Tsuji, Ryo Ueda, HYOGONOSUKE, 5ban Graphics, DOM, Hasuno, Taiga Kayama, Yoshimi
   Miyoshi, Yuu Nishida. **One discrepancy:** the Magnemite 242/236 card face reads
   "Illus. Fumie Kitaoka"; several web listings render the name "Fumie Kittaka." I have used
   the card face.
3. **The "Character Rare" definition and the Lt. Surge identification** come from Bleeding
   Cool's Cosmic Eclipse series, retail listings, and my own reading of the art. I could not
   find a Bulbapedia article at `Character_rare_card_(TCG)` (404), so this is not sourced to
   Bulbapedia the way the hyper-rare and IR definitions are. The Lt. Surge identification is
   corroborated by multiple independent listings and by the uniform in the art; the "bond
   between a Pokémon and its Trainer" framing is a secondary source.
4. **`Magnezone_SIR_fan_art_Best_candidate.png` is fan art.** It is a taste reference and
   evidence of what Fred likes; it is *not* evidence of official convention. Where I lean on
   it (§2.4, pastel burst) I have paired it with an official card that does the same thing
   (`Electrode_Secret_Rare.jpg`).
5. **The art/text percentages in §1.1** are my own measurements off Fred's angled photographs,
   ±4 points. The v1 coverage figure in §0.2 is computed from CSS font metrics, not a measured
   render.
6. **I have not seen this composition at render size.** The face-size risk in §3.4 (a 44px
   head at 242px card width) is real and is the highest-execution-risk item in the document. I
   have given a fallback crop rather than pretending it is solved.
7. **I did not verify** whether the text-density change breaks anything downstream
   (pack-opening flip card, `CardModal`, mobile layout). That is a plan-pass question.

---

## Out of scope

- Editing any file under `src/**` — this document is the only deliverable.
- Applying this bar to the other 11 cards.
- `CardModal.jsx` design, beyond the fact that overflow copy lands there.
- Rewriting Jericho's attack/description *copy*.
- Implementation mechanics: component decomposition, CSS selectors, whether the ray array is a
  `.map()` or a static asset, animation library choice.
- Any new dependency.

---

## Sources

### Fred's reference images — looked at directly, cycle 2 (`docs/reference/jericho-inspiration/`)

**Flagged by Fred (taste signal, outranks research):**
- `01-magneton-lineage/Magnemite_Ultra_Rare_gorgeous_perfect_example_of_story_on_card.jpg` — Magnemite 242/236, Cosmic Eclipse Secret Rare **Character Card**, illus. Fumie Kitaoka, 2019. Lt. Surge.
- `01-magneton-lineage/Magnezone_Promo_my_favorite_asthetically.jpg` — Magnezone GG18/GG70, Crown Zenith Galarian Gallery, illus. Shinya Komatsu, 2023.
- `01-magneton-lineage/Magnezone_SIR_fan_art_Best_candidate.png` — fan art.

**Also examined:** `Magnetron_rare_promo.jpg` (Magneton SVP 159, Shinji Kanda) ·
`Magneton_common.jpg` (MEG 046/132, Saboteri) · `Magnezone_RR.jpg` (SVI 226/198, PLANETA Tsuji) ·
`Magnezone_Ultra_Rare.jpg` (FLF 101/106, Ryo Ueda) · `Voltorb_R.jpg` (Hisuian Voltorb GG01/GG70,
HYOGONOSUKE) · `Voltorb_RR.jpg` (Voltorb ex ASC 058/217, 5ban Graphics) ·
`Electrode_promo.jpg` (Hisuian Electrode V SWSH294) · `Electrode_Secret_Rare.jpg` (CRE 222/198,
Ryo Ueda) · `Electrode_Ultra_Rare.jpg` (GX 48/168) · `Electrode_Ultra_Rare_Alt.jpg` (GX 172/168) ·
`Deoxys_Ultra_Rare.jpg` (VSTAR GG46/GG70, DOM) · `Espyon_&_Deoxys_Promo.jpg` (SM240, Hasuno) ·
`Rotom_IR.jpg` (DRI 197/182, Taiga Kayama) · `Rotom_SIR_jpg.jpg` (PFL 126/094, Yoshimi Miyoshi) ·
`Rotom_Ultra_Rare.jpg` (LOR 177/196, Yuu Nishida).

### Fred's physical cards (`docs/reference/pokemon-cards/`)

Arven's Mabosstiff ex (DRI 139/182, illus. akagi), Gourgeist ex (CRI 102/086), Cobalion ex
(CRI 064/086), Meowth ex (POR 062/088), Cinccino ex (CRI 073/086).

### Web

- [Magneton · SVP #159 — PkmnCards](https://pkmncards.com/card/magneton-scarlet-violet-promos-svp-159/)
- [Magneton (Surging Sparks 59) — Bulbapedia](https://bulbapedia.bulbagarden.net/wiki/Magneton_(Surging_Sparks_59))
- [Magnemite (Pokémon) — Bulbapedia](https://bulbapedia.bulbagarden.net/wiki/Magnemite_(Pok%C3%A9mon))
- [Illustration rare card (TCG) — Bulbapedia](https://bulbapedia.bulbagarden.net/wiki/Illustration_rare_card_(TCG))
- [Hyper rare card (TCG) — Bulbapedia](https://bulbapedia.bulbagarden.net/wiki/Hyper_rare_card_(TCG))
- [The Secret Rare Character Cards of Pokémon TCG: Cosmic Eclipse — Bleeding Cool](https://bleedingcool.com/games/the-secret-rare-character-cards-of-pokemon-tcg-cosmic-eclipse-part-1/)
- [Top Character Rares of the SWSH Era — Bleeding Cool](https://bleedingcool.com/games/pokemon-tcg-2022-end-of-year-list-top-character-rares-of-swsh-era/)
- [Pokémon TCG Artist Spotlight: Shinya Komatsu — Bleeding Cool](https://bleedingcool.com/games/pokemon-trading-card-game-artist-spotlight-shinya-komatsu/)
- [Magnemite 242/236 (Lt. Surge) Character Rare — Amazon listing](https://www.amazon.com/Pokemon-Magnemite-Cosmic-Eclipse-Character/dp/B0C617P5T1)
- [Art of the Pokémon TCG: Destined Rivals — Pokemon.com](https://www.pokemon.com/us/pokemon-news/art-of-the-pokemon-tcg-scarlet-violet-destined-rivals-expansion)
- [A Look at Paldea Evolved Illustration Rare Cards — Pokemon.com](https://www.pokemon.com/us/pokemon-news/a-look-at-pokemon-tcg-scarlet-violet-paldea-evolved-illustration-rare-cards)
