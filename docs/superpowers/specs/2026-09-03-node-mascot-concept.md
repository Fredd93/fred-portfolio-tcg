# Node, take three — mascot concept brief

> Consultant pass. This is a proposal document only. No `src/**` was touched to produce it.

## Context

Two prior attempts at Jericho's mascot, Node, have shipped and been rejected.

**v1** (`docs/superpowers/specs/2026-08-22-human-flare-visual-pass-design.md` era) was three
hexagon `<polygon>`s and a clipped glass orb with no face, no eye, no light source — a
wireframe diagram standing in for a creature.

**v2** (current, `docs/superpowers/specs/2026-09-02-jericho-redesign-v2-design.md`, merged as
`df12f12`/`49b6a04`) over-corrected. I read the live component
(`src/components/MascotArt.jsx:34-160`) directly rather than only the spec, and it confirms
Fred's complaint at the code level, not just the eyeball level:

- One shell, one **large centred eye** (`jericho-eye-open`/`jericho-eye-closed`, both
  anchored at `cx=50, cy=52` — dead centre of the 100×100 viewBox).
- Two **parabolic dish "ears" on short gimbals**, at `cx≈9`/`cx≈91`, explicitly commented
  `// ears: parabolic dishes on short gimbals, at the horseshoe magnets' silhouette position`
  — i.e. authored, in the code's own words, at Magnemite's magnet coordinates.
- **Three Phillips screws** in Magnemite's canonical placement (`// crown screw reads as an
  antenna, exactly as Magnemite's does`, `// two low screws, per Magnemite's placement`).

Fred's verdict: *"I know you took inspiration of magnemite but it looks so close to it — the
inspiration was not meant to copy but help brainstorm concept art for our unique original
mascot. So far it all looks like a bunch of polygons mashed together."* He's right — the v2
design document (§0.3, §3.1–3.3) explicitly instructed "the lineage choice was right, the
execution failed" and then specified magnet-position dishes and Magnemite-position screws as
the fix, which is lineage-as-parts-list, not lineage-as-inspiration. That is the thing this
brief replaces.

**What must survive**, unchanged, per the task brief and Fred's own words:

> "the feeling of Jericho being an assistant that helps the user and is always there for them
> should give the reader that emotion" · "the Magnemite looks warm and cute and fuzzy all
> together, literally makes me feel things when I look at it."

Warm, devoted companionship. Not vigilance, not surveillance. At rest, eyes closed, simply
near the person — devotion expressed posturally, not by watching. That constraint is fixed
across all three directions below; only the *creature* changes.

## What I looked at before proposing anything

**Fred's own reference set, opened directly** (`docs/reference/jericho-inspiration/`):
the three flagged cards — Magnemite 242/236 (illus. Fumie Kitaoka, Cosmic Eclipse Character
Rare), Magnezone GG18/GG70 (illus. Shinya Komatsu), Magnezone ex SIR fan art — plus all three
Rotom cards in `04-hex-mechanical/` (Rotom IR DRI 197/182 illus. Taiga Kayama, Rotom V LOR
177/196 illus. Yuu Nishida, Rotom ex PFL 126/094 illus. Yoshimi Miyoshi), both cards in
`02-sphere-voltorb-electrode/` I re-checked (Hisuian Voltorb GG01/GG70 illus. HYOGONOSUKE,
Voltorb ex ASC 058/217), and both cards in `03-translucent-inner-light/` (Deoxys VSTAR
GG46/GG70 illus. DOM, Espeon & Deoxys GX SM240 illus. Hasuno). Also two of Fred's physical
cards (`docs/reference/pokemon-cards/`): Arven's Mabosstiff ex (DRI 139/182, illus. akagi) and
Cinccino ex (CRI 073/086, 5ban Graphics).

**Web research**, textual only (see §6 for what this does and doesn't establish): Bulbapedia
entries for Chimecho, the Solosis/Duosion/Reuniclus line, and Eevee, plus TCG-release coverage
confirming each has been printed as a full-art/illustration-rare card. I could not get an image
model to actually render these card illustrations to me (see §6) — the three directions below
are grounded in each species' *established Pokédex design language and behaviour*, the same
kind of grounding the accepted house-style doc (`2026-08-23-non-flagship-mascots-design.md`)
uses for e.g. Comfey→`haarlem`, Rotom→`selfhost`, Yamask→`servicedesk` — not in having seen
official card renderings of them.

**Deliberate choice:** none of the three directions below uses the Magneton lineage. Fred's
note that v2 "looks so close to it" is a note about *this specific lineage having been executed
as a parts-list*, and the safest way to guarantee a genuinely original silhouette on this
attempt is to start from different source material entirely, chosen for what it says about
Jericho rather than for a shell-and-magnet body plan.

---

## Section 1 — Three directions

### Direction 1 — The Eave-Chime

**Core idea:** a small hand-thrown hanging object that lives at the edge of the room, still
and silent, until it feels you're near — then it swings and gives one glad little sound.

**Form language, from Jericho's own nature:** the flavor text is *"Lives at the periphery
until you need it — then it's already listening."* A wind chime's entire premise, per its
real-world function and per Chimecho's own Pokédex line (*"Its cries echo inside its hollow
body to emerge as beautiful notes"* — confirmed via Bulbapedia), is that it hangs at a literal
periphery — the eaves, just outside the door — dormant until stirred, and it answers with
sound, not sight. That is closer to Jericho's actual flavor text than any lineage in the
current reference set. It is also honest to what Jericho *is*: a voice-in/voice-out system.
There is no camera in this design; there cannot be, because a chime has no eyes that see
outward — only a body that resonates.

**Silhouette:** a soft, slightly lopsided rounded capsule (closer to a hand-thrown ceramic
gourd than a bell — no trumpet-flare, no suction-cup nub) hanging from a single braided fabric
cord tied in a simple overhand knot above it. A small weighted teardrop clapper hangs on its
own short thread, visible through a narrow slot low on the body — this is the "voice organ"
and the second-most emphasized shape in the silhouette after the face. Two small soft fabric
fin-flags (pennant-shaped, not Chimecho's stubby limb-nubs) flank the body at rest-height,
currently limp.

**Face and its focal feature:** two small warm dot-eyes sit in the upper third of the body's
front face — small, not dominant, because the *real* focal object here is the clapper hanging
below, not the eyes. At rest: closed crescents. A single soft curved seam-line stands in for a
mouth.

**Palette:** warm terracotta-clay body, cream underside, rope-tan braided cord, a small
warm brass-brown clapper (a real material colour, not rarity gold), fin-flags in `arch`
indigo `#5a5ec9` as a fabric-dye accent only, eyes warm dark ochre. One small hand-carved hex
bead threaded onto the cord knot — the only hexagon in the design, a single warm hand-made
object, not a lattice.

**Why it feels warm, not technical, in one sentence:** every part of it is a domestic craft
object — clay, braided cord, cloth, a carved bead — hung at an actual threshold, with nothing
on it that reads as circuitry, a screw, or a panel.

---

### Direction 2 — The Twin-Core

**Core idea:** a small soft creature with a translucent parchment skin holding two distinct
inner lights that meet at a stitched centre-seam — dim and separate at rest, and brightest
exactly where they touch when it wakes.

**Form language, from Jericho's own nature:** Jericho runs a local model (LM Studio) *and* a
cloud provider (OpenRouter) behind the same port — "zero changes to `services/`," per the
card's own attack text. The Solosis→Duosion→Reuniclus line's defining trait, per Bulbapedia,
is that these creatures are individually a visible nucleus inside a translucent gel body, and
*"when [they] shake hands, a network forms between their brains, increasing their psychic
power"* — two separate minds joining into one shared capability. That is close to a literal
description of one port serving two providers. This direction keeps that idea — a visible
inner duality that becomes *one thing* at the point of contact — and discards Reuniclus's own
body plan (the green gel colour, the floating three-fingered psychic hand-orbs, the horned
head) entirely.

**Silhouette:** a soft asymmetric drawstring-pouch/paper-lantern shape (not a sphere — the
sphere-as-orb shape is what v1 already failed with, and Node's rejected v2 core is a clipped
circle too), sitting compactly with a slightly flattened base so it visibly rests rather than
floats. A drawstring knot at the top reads as a small topknot. Two low, soft rounded nubs at
the sides (grip points, not arms-with-hands) let it hold the mat's edge. A visible laced seam
runs down the centre front, stitched like hand-sewn fabric, not machined.

**Face and its focal feature:** two small almond eyes sit low, near where the pouch would be
cupped in a hand — intimate placement, not dominant placement, deliberately avoiding a repeat
of v2's single large centred eye. Closed at rest as soft downward crescents. The true focal
feature is the seam and the glow behind it, running the vertical centre of the body.

**Palette:** warm parchment/dusty-cream membrane (translucent paper-lantern quality, not cold
gel-green), left inner glow warm amber `#e8a33d` (local — "has always been here," a direct
carry-over of the one part of v2's palette worth keeping), right inner glow `arch` indigo
`#5a5ec9` (cloud), rope-brown stitching and knot, warm dark-brown eyes.

**Why it feels warm, not technical, in one sentence:** the "dual system" idea is expressed
entirely through soft textile object-language — a drawstring pouch, hand-lacing, a paper
lantern's glow — so the technical fact underneath it (two backends, one interface) never
surfaces as circuitry or hardware.

---

### Direction 3 — The Doorstep

**Core idea:** a small settled companion animal, curled low with its chin near its paws, whose
one big pair of soft ears is already turned toward the door before you've opened it.

**Form language, from Jericho's own nature:** two threads converge here. First, wake-word
listening is most honestly expressed by an actual listening organ with emotional range — ears
that can be relaxed, alert, or turned toward someone, which is a much wider expressive
vocabulary than an eye that opens and shuts. Second, Eevee is specifically the Pokédex's
"Evolution Pokémon" — per Bulbapedia, *"Its irregularly configured DNA is affected by its
surroundings. It evolves if its environment changes"* — the one Pokémon whose entire premise is
a single stable core that adapts differently depending on what it's plugged into. That is a
genuinely apt non-literal metaphor for ports-and-adapters (one core, swappable adapters) that
has nothing to do with Eevee's actual silhouette.

**Silhouette:** a low, curled, rounded quadruped — a soft dome of a back, big soft-tipped ears
as the tallest points, a plume tail tucked around its own haunches, small crossed forepaws.
Settled and low to the ground, weight down — a dog that has already lain down to wait, not one
standing at attention. Ear tips are rounded/mitten-soft (not Eevee's narrow points, not a
sonar-dish shape — that dish shape is exactly what needs to not reappear here). No ruff of
loose fur; instead a **woven-loop collar** strung with a few small hand-carved beads, doing the
"ruff" job with a different material entirely.

**Face and its focal feature:** the ear-bases and brow are the focal feature, set high; warm
downturned eyes are secondary. At rest, eyes closed as soft crescents, but the ear nearest the
viewer carries a faint permanent few-degree cant toward them, even asleep.

**Palette:** warm oat/sand coat, collar woven in rope-tan with a few `arch` indigo `#5a5ec9`
threads (the one place the type colour appears, like a friendship bracelet), soft warm pink-tan
ear interiors, collar beads in muted wood/ceramic tones (never gold, never neon) — one bead is
a small hand-carved hex, the collar's single hexagon reference.

**Why it feels warm, not technical, in one sentence:** it is the most literally an animal of
the three — curled low, physically close to how a real pet settles by a door — and its one
piece of "architecture" content (the swappable-adapter idea) is carried by a hand-strung bead
bracelet, not by hardware.

---

## Section 2 — Animation rig per direction

All three are designed at the **flagship / hyper-rare tier** — continuous idle-loop, animated
inline SVG, per house rule 4 — not the lighter lenticular tilt-swap used for the 9 non-flagship
mascots. `.tcg-card:hover` (desktop) / `.tcg-card.tilting` (mobile touch-and-hold) remains the
trigger, consistent with the existing house pattern.

### Direction 1 — The Eave-Chime

| Part | Rigging | Rest | Wake (on hover) |
|---|---|---|---|
| Cord | Fixed anchor, does not move | Taut, vertical | Unchanged |
| Body/shell | Own pivot at the cord anchor | Hangs still, slight resting tilt | Sways side to side, small pendulum arc |
| Clapper | Independent pivot on its own short thread, faster period than the body | Hangs straight down, motionless | Swings and strikes the inner wall once, then settles into a slower secondary sway |
| Ring-line | Separate element, not tied to geometry — a thin arc that fades in/out | Absent | Blooms softly at the instant of the clapper's strike, fades over ~400ms |
| Left/right fin-flags | Independent pivots at body attachment, phase-offset | Limp | Lift and flutter outward, as if a breeze arrived |
| Eyes | Two independent crescent↔circle morph groups | Closed crescents | Open to small round dots with a catchlight |

**The one detail that carries the devotion:** the clapper's single soft strike-and-settle — it
doesn't clang or ring repeatedly, it gives one glad little sound and calms into a gentle sway,
the difference between "starting to ring" and "an alarm."

### Direction 2 — The Twin-Core

| Part | Rigging | Rest | Wake (on hover) |
|---|---|---|---|
| Outer membrane | Single path, base at the bottom | Flattened base, static | Very slight breath-like swell (~2-3% scale), tips 2-3° toward viewer |
| Left inner glow (amber) | Independent radial-gradient element, own opacity pulse | Dim, breathing slowly, out of phase with the right | Rises to full brightness |
| Right inner glow (indigo) | Same, independent phase | Dim | Rises to full brightness, arriving slightly *after* the left |
| Seam flare | Separate small bright element at the seam's midpoint | Faint | Brightens hardest of anything on the card, timed to land exactly when both glows peak — the "handshake" moment |
| Drawstring knot | Own pivot at its base | Still | Small idle sway, lowest priority |
| Eyes | Two independent crescent↔almond morph groups | Closed crescents | Open to soft dark almonds, one catchlight each |
| Low grip-nubs | Minimal, optional | Static | Small contented squish, lowest priority |

**The one detail that carries the devotion:** the seam flare is not "both glows are on" — it's
timed to be the single brightest instant on the whole card, and it only happens where the two
lights touch. It says the warmth isn't either system alone; it's the moment they meet.

### Direction 3 — The Doorstep

| Part | Rigging | Rest | Wake (on hover) |
|---|---|---|---|
| Body/torso | Mostly static | Curled low, chin near paws | Tiny breathing scale-pulse, lowest priority |
| Head | Group containing both ears + brow + eyes, own pivot at the neck | Down, resting on paws | Lifts a few degrees |
| Near ear | Own pivot at ear-base, nested inside the head group | Relaxed, but with a faint permanent cant toward the viewer even at rest | Snaps upright first (~150-200ms) — "it heard something before anything else moved" |
| Far ear | Own pivot at ear-base | Relaxed | Follows the near ear a beat later |
| Eyes | Independent crescent↔round morph groups | Closed crescents | Open to soft round eyes, one catchlight each |
| Tail | Own pivot at the haunch | Tucked around haunches, still | One soft settle-sway — deliberately *not* a repeating wag, which would read as excited rather than quietly glad |
| Collar beads | ~5-7 near-identical small elements | Still | Sequential glint, left to right, like light sweeping across them |

**The one detail that carries the devotion:** the near ear's permanent resting cant toward the
viewer, even while every eye is shut — the one idea worth keeping from the rejected v2, now on
an actual ear belonging to an actual animal instead of a dish bolted to a magnet body.

---

## Section 3 — Recommendation

**I'd recommend Direction 1, the Eave-Chime**, with Direction 2 as a strong, deliberately
kept runner-up. Reasoning, against the specific criteria in the brief:

**Thematic fit.** Of the three, the chime is the closest literal match to Jericho's own
flavor text — *"lives at the periphery until you need it — then it's already listening"* is
close to a paraphrase of what a wind chime by the door already does, without needing an
extended metaphor to get there. Direction 2 is the most literal match to the *architecture*
(one port, two providers), and Direction 3 is the most literal match to the *emotional target*
in isolation ("a dog by the door"). The chime is the only one of the three where the flavor
text, the technical fact (voice in, voice out — no visual sensing organ at all), and the
emotional target line up on the same object without any one of them being force-fit.

**Silhouette-collision risk, checked against both failure modes.** v1 failed by being too
abstract to read as a creature at all; v2 failed by reading as a specific existing Pokémon.
The chime has no single, ownable "cute hanging bell mascot" anywhere near as recognisable as
Chimecho itself once its defining silhouette markers are removed (see the originality audit
below) — there is comparatively little for a generation pipeline, or a person who knows the
TCG, to converge back onto. Direction 3 carries the opposite and more dangerous risk: "small
quadruped companion, big expressive ears, soft ruff/collar, alert-but-friendly" is *exactly*
Eevee's own template at the level of genre, and Eevee is one of the most heavily-trained,
most-drawn Pokémon there is — an image model asked for "cute companion creature, big ears,
fluffy collar, curled up" is more likely to drift toward Eevee-adjacent output than toward
anything genuinely novel, and it would take unusually disciplined art direction to keep it off
that path. That risk is real enough that I'd flag Direction 3 as needing the tightest brief of
the three if it were chosen, not a first-pass one.

**Generatability and layer-cutting, the criterion the task named specifically.** A hanging
object has almost no self-occlusion by construction — cord above, body in the middle, clapper
below, fins to the sides — which is close to the best-case layout for cutting a single
generated image into independent masks with clean edges. Bells, lanterns and wind chimes are
also common, well-represented training subjects, so "hand-thrown ceramic wind chime with a
small face" is a request an image model is likely to render competently on the first few
attempts, rather than needing heavy correction. Direction 2's twin-glow requirement is the
opposite case: getting a model to render two *distinguishable, independently legible* internal
light sources through one translucent skin — rather than one model instinct blending them into
a single glow, which defeats the entire concept — is a real, specific execution risk I can't
resolve on paper. Direction 3 sits in between: animal anatomy (ears, tail, body) is
well-trained and separates cleanly into layers, but the *output* is the thing most likely to
need the most correction back away from Eevee specifically.

**Where Direction 2 stays live.** It's the direction most directly answering Fred's own
curated `03-translucent-inner-light` bucket, which the manifest calls "Node's exact material,"
and it's the most technically honest read of "one port, two providers." If the chime doesn't
land emotionally once it's actually drawn, I'd go to Direction 2 next, not Direction 3 — the
generation risk is a craft problem to manage, not a silhouette-collision problem to avoid.

---

## Section 4 — Originality audit (Direction 1, the Eave-Chime)

**Nearest real Pokémon: Chimecho** (Wind Chime Pokémon). Per Bulbapedia, Chimecho is "a small,
round Pokémon with a mainly bluish-white body shaped like a fūrin wind chime," with "beady,
yellow eyes," "three stubby limbs," "a horizontal amaranth-coloured pattern," "a long, tag-like
tail ... used to pluck nuts and berries," and "a yellow, globular growth ... connected to the
top of its body, which it uses to hang."

**Why the Eave-Chime is not that, part by part:**

| Feature | Chimecho | Eave-Chime |
|---|---|---|
| Body silhouette | Bell — narrow top, flared trumpet base | Rounded gourd/capsule, no flare at all |
| Hanging mechanism | A fleshy yellow suction-cup nub | A braided fabric cord tied in a knot |
| Limbs | Three visible stubby nubs (two side, one back) | None |
| Tail | A long ribbon-like tag, used to pluck food | None — replaced by an internal clapper on its own short thread, positioned centrally through a slot, not trailing below |
| Body markings | Horizontal amaranth (purple-red) banding | No banding; solid terracotta clay body |
| Colour family | Blue-white with purple-red accent | Terracotta/clay, cream, indigo accent — no blue, no purple |
| Eyes | "Beady, yellow" | Small dark ochre dot-crescents |
| Side elements | None | Two fabric fin-flags — an added element Chimecho has no equivalent of |

What's shared is genus-level, and explicitly permitted by the brief as "deriving principles":
it's round-ish, it hangs from something above, it has a face. None of Chimecho's specific,
*identifying* silhouette markers — the suction-cup nub, the ribbon tail, the limb-nubs, the
bell-flare, the purple banding — survive into the Eave-Chime. A person who knows the TCG
looking at it would reasonably guess "some kind of wind-chime creature" as a genre guess, which
is the correct outcome — not name Chimecho specifically, which is the failure condition.

**Judgment call flagged rather than resolved:** the single carved hex bead on the cord knot is
the design's one hexagon reference, included deliberately as a small warm hand-made object
(consistent with the crocheted mat precedent the standing rules already accept) rather than as
a lattice or a structural motif. I'm confident this reads as intended, but it's the one place
in the design where "hexagon" and "warm object" sit close enough together that it's worth
naming explicitly rather than asserting it's obviously fine.

---

## Section 5 — Out of scope

- Writing or editing any file under `src/**`.
- Final SVG geometry, exact coordinates, exact easing curves, or CSS selector structure — this
  is a concept brief; a design/plan pass translates whichever direction is chosen into
  buildable specifics, the way `2026-09-02-jericho-redesign-v2-design.md` did for the rejected
  attempt.
- The scene/environment Node sits in (desk, room, Fred's presence) — that was designed in
  cycle 2 of the prior spec and nothing here contradicts it; this brief is scoped to the
  creature only, per the task.
- Renaming "Node" — I've kept the name throughout for continuity, though I'd note "Node" reads
  a little more clinical against the chime or doorstep-companion directions than it did against
  a hex-satellite; that's a naming question for Fred, not something I'm resolving here.
- Applying any of this to the other 11 cards.
- Deciding animation plumbing (event listeners, `data-*` attributes, whether frames are
  separate `<g>`s or CSS custom-property driven) — named at the level needed to confirm each
  design is riggable, not specified to implementation.

---

## Section 6 — What I could not verify

Stated plainly, per the standing rule.

1. **I did not see official Chimecho, Solosis/Duosion/Reuniclus, or Eevee TCG card
   illustrations.** `WebFetch` returns page text to me, not rendered images, and none of these
   three species is in Fred's supplied reference folders. My grounding for all three directions
   is Bulbapedia's *physical/behavioural* description of each species (body plan, Pokédex
   flavor text) plus release confirmation that each has been printed as a modern illustration
   card — not direct visual inspection the way I was able to do for the Magneton lineage,
   Rotom, Voltorb/Electrode, and Deoxys/Espeon images, all of which I opened directly via the
   `Read` tool and describe from having actually looked at them. This matters most for Direction
   2 and Direction 3, where I'm reasoning from species *description* rather than species
   *rendering*. Direction 1 leans on the same kind of grounding but the deviation from
   Chimecho's silhouette is large enough (§4) that I'm more confident in it regardless.
2. **I have not rendered any of these three at 46-55px**, the size this needs to survive at on
   the actual card. The relative weighting I've given each focal feature (clapper vs. eyes;
   seam-flare vs. eyes; ears vs. eyes) is a judgment call about what will still read at that
   size, not something I've tested.
3. **Direction 2's core technical bet — that an image model or a hand-authored SVG can keep two
   internal light sources independently legible through one translucent skin, rather than
   blending them into one glow — is an open craft question I've named but not resolved.** It's
   the single biggest unknown in this brief.
4. **The Pokédex-derived claims about Eevee's "Evolution Pokémon" trait and the Solosis line's
   "network forms between their brains" mechanic** are Bulbapedia's paraphrase of in-game flavor
   text, not something I cross-checked against a second source.
5. **I did not open `src/styles/card.css` or `src/styles/mascot.css`** to check current class
   names, animation timing conventions, or whether any of the rigging described in §2 collides
   with existing CSS — that's implementation-adjacent and belongs to a plan pass, not this
   brief, but it means the "own pivot" language in §2 is a design intent, not a verified-buildable
   claim against the current stylesheet.
6. Where I'm asserting *why* something feels warm rather than technical, that's taste, reasoned
   from the technique patterns visible in Fred's flagged cards and physical cards (closed-arc
   eyes on Kitaoka's Magnemite, big ear/tail mass framing a small face on Cinccino ex, simple
   round-eyed grins across all three Rotom illustrators) — not a claim I can independently
   verify the way I can verify a silhouette difference.

---

## Sources

**Opened directly (`Read` tool, this session):**
- `docs/reference/jericho-inspiration/01-magneton-lineage/Magnemite_Ultra_Rare_gorgeous_perfect_example_of_story_on_card.jpg` — Magnemite 242/236, Cosmic Eclipse, illus. Fumie Kitaoka.
- `docs/reference/jericho-inspiration/01-magneton-lineage/Magnezone_Promo_my_favorite_asthetically.jpg` — Magnezone GG18/GG70, illus. Shinya Komatsu.
- `docs/reference/jericho-inspiration/01-magneton-lineage/Magnezone_SIR_fan_art_Best_candidate.png` — fan art.
- `docs/reference/jericho-inspiration/04-hex-mechanical/Rotom_IR.jpg` — DRI 197/182, illus. Taiga Kayama.
- `docs/reference/jericho-inspiration/04-hex-mechanical/Rotom_Ultra_Rare.jpg` — LOR 177/196, illus. Yuu Nishida.
- `docs/reference/jericho-inspiration/04-hex-mechanical/Rotom_SIR_jpg.jpg` — PFL 126/094, illus. Yoshimi Miyoshi.
- `docs/reference/jericho-inspiration/02-sphere-voltorb-electrode/Voltorb_R.jpg` — Hisuian Voltorb GG01/GG70, illus. HYOGONOSUKE.
- `docs/reference/jericho-inspiration/02-sphere-voltorb-electrode/Voltorb_RR.jpg` — Voltorb ex ASC 058/217, illus. 5ban Graphics.
- `docs/reference/jericho-inspiration/03-translucent-inner-light/Deoxys_Ultra_Rare.jpg` — Deoxys VSTAR GG46/GG70, illus. DOM.
- `docs/reference/jericho-inspiration/03-translucent-inner-light/Espyon_&_Deoxys_Promo.jpg` — Espeon & Deoxys GX SM240, illus. Hasuno.
- `docs/reference/pokemon-cards/Mabostiff_EX.jpeg` — Arven's Mabosstiff ex, DRI 139/182, illus. akagi.
- `docs/reference/pokemon-cards/Cinccino_EX.jpeg` — Cinccino ex, CRI 073/086, illus. 5ban Graphics.
- `src/components/MascotArt.jsx` (lines 34-160) — the current shipped `JerichoMascot`, read to confirm the exact point of failure at the code level.
- `src/data/cards.js` — Jericho's roster entry, flavor text, `TYPES`.
- `docs/superpowers/specs/2026-09-02-jericho-redesign-v2-design.md` — full prior cycle, superseded by this document for mascot geometry only.
- `docs/superpowers/specs/2026-08-23-non-flagship-mascots-design.md` — house-style precedent for "real lineage as design-language inspiration, not reskin."
- `docs/reference/jericho-inspiration/MANIFEST.md`, `README.md`.

**Web research (text only — see §6 for the limitation):**
- [Chimecho (Pokémon) — Bulbapedia](https://bulbapedia.bulbagarden.net/wiki/Chimecho_(Pok%C3%A9mon))
- [Reuniclus (Pokémon) — Bulbapedia](https://bulbapedia.bulbagarden.net/wiki/Reuniclus_(Pok%C3%A9mon))
- [Eevee (Pokémon) — Bulbapedia](https://bulbapedia.bulbagarden.net/wiki/Eevee_(Pok%C3%A9mon))
- [Chimecho Cards & Artwork — The Art of Pokémon](https://www.artofpkm.com/pokemon/358/artwork)
- [New Solosis, Duosion, and Reuniclus TCG cards from Black Bolt — Bulbagarden](https://bulbagarden.net/threads/new-solosis-duosion-and-reuniclus-pokemon-tcg-cards-from-black-bolt-revealed.306796/)
- [Reuniclus Cards & Artwork — The Art of Pokémon](https://www.artofpkm.com/pokemon/579)
- [Eevee Cards & Artwork — The Art of Pokémon](https://www.artofpkm.com/pokemon/eevee)
