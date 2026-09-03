# Jericho Redesign v2 — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development
> (recommended) or superpowers:executing-plans to implement this plan task-by-task.
> Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the Jericho card as a Character-Rare-style portrait of the bond between Fred
and his assistant — a bright, warm, densely-propped late-afternoon repair scene — and open the
card face up so the illustration is actually visible.

**Architecture:** Three separable changes. (1) A *content* change in `Card.jsx` that cuts the
full-art face to real-card text density; this is shared by all three full-art scenes and is
also a bug fix — impala and jericho currently overflow `.tcg-face` and lose their footers.
(2) A *treatment* change in `card.css` that replaces the opaque `.bottom` panel with a
compositional scrim, parameterised through CSS custom properties so the two existing dark
scenes keep their light ink while Jericho gets dark-ink-on-pale. (3) A ground-up rewrite of
`JerichoScene` and `JerichoMascot` as hand-authored SVG.

**Tech Stack:** React 19, Vite 8, framer-motion (already present, not used for the scene),
plain CSS animation, inline SVG. **No new dependencies.**

**Spec:** `docs/superpowers/specs/2026-09-02-jericho-redesign-v2-design.md`
Reference images: `docs/reference/jericho-inspiration/` (read `MANIFEST.md` first)

## A note on this plan's form

This plan does not transcribe the final SVG path data. For illustration work that is not a
useful contract — the geometry is discovered at the easel, against a screenshot, not decided in
a document. What this plan *does* pin down exactly: file paths, element inventories, the
coordinate frame, every palette value, every CSS custom property and selector name, animation
timings, and the verification command for each task. Those are the things a second person
needs and the things that go wrong when they drift.

## Global Constraints

- **The deliverable is a feeling**, not a checklist: warm, devoted companionship. Fred's words —
  *"the feeling of Jericho being an assistant that helps the user and is always there for them
  should give the reader that emotion."*
- **The still-frame test governs** (spec §4). If the motionless frame doesn't already carry the
  feeling, the animation is compensating for a failed illustration.
- **Judge against real cards, not against this plan.** A card that satisfies every bullet here
  and looks flat next to `01-magneton-lineage/Magnemite_Ultra_Rare_gorgeous_perfect_example_of_story_on_card.jpg`
  at render size is **not done**. That failure mode is exactly what produced v1.
- No emoji as iconography. No invented neon / dark-SaaS gradients. No full-bleed multi-stop
  gradient backgrounds. `.holo-shine` is the only legitimate foil technique.
- **No gold on the creature.** Real Hyper Rares gild the frame and background; the Pokémon keeps
  its own coloration (confirmed on `Electrode_Secret_Rare.jpg`).
- Respect `prefers-reduced-motion: reduce` and the existing `.scene-paused` off-screen pause.
- No new dependencies. CSS + inline SVG only.
- Card face coordinate frame: **242 × 346**, `preserveAspectRatio="xMidYMid slice"`.
  Clear art band is **y 78–225**.
- Do not change Jericho's copy in `src/data/cards.js`. This plan changes where copy is
  *displayed*, never what it says.

### Palette (spec §3.5) — use these exact values

| Role | Value |
|---|---|
| Sunbeam core / falloff | `#f7d08a` / `#e8a33d` |
| Wall (sunlit → shade) | `#e8d3b0` → `#b99a78` |
| Desk wood | `#a8703f` |
| Environment shadow (all objects) | `#8a6a52` |
| Node shell base | `#dfe3ea` |
| Node sun-side reflected warmth | `#f0c89a` |
| Node core shadow | `#8a7f9c` |
| Hard specular | `#f8f9fc` |
| Open-panel interior glow | `#f2a93b` |
| Iris ring (woken) + arcs | `#5a5ec9` (the `arch` type colour) |
| Magnet-cone tips | `#c0392b` / `#2b7fd1` (from `TYPES`) |
| Outline | `#2e2119` warm brown-black — **never** neutral grey or `#000` |

### Line weight (spec §2.1) — three tiers, no uniform strokes

Outer silhouette on the creature **2.6**, major internal separations **1.2**, surface detail
**0.6**. Uniform `stroke-width` is the number-one vector-slop tell and is what v1 did.

---

## Verification setup (do this first, it is used by every task)

The in-app Browser pane cannot composite frames in this environment, so screenshots come from
headless Brave driven by `puppeteer-core`. This is already set up in the scratchpad:

```bash
node "$SCRATCH/shot.mjs" out.png --freeze --scale=3
```

Flags: `--freeze` kills all animation/transition (this **is** the still-frame test),
`--hover` performs a real mouse hover and waits out the wake sequence, `--mobile` switches to a
390×844 touch viewport, `--sel=<css>` picks the element (default
`.tcg-card.rarity-hyperrare`), `--scale=N` sets deviceScaleFactor.

Set `TCG_URL` to the dev server's actual URL. Start the server with the `dev` config in
`.claude/launch.json` (`autoPort` is on, so read the real port out of `preview_logs` — vite
picks its own port when 5173 is taken, and it is not always the harness-assigned one).

---

## File Structure

| File | Responsibility after this plan |
|---|---|
| `src/components/Card.jsx` | Card shell + **face text density rule** (`FACE_ATTACK_LIMIT`) |
| `src/components/FullArtScenes.jsx` | `JerichoScene` — the illustration, as inline SVG |
| `src/components/MascotArt.jsx` | `JerichoMascot` — Node, as inline SVG, reused at 3 scales |
| `src/styles/card.css` | Full-art layout, scrim + ink custom properties, per-scene overrides |
| `src/styles/mascot.css` | Node's material fills, idle loop, wake/sleep choreography |
| `src/components/CardModal.jsx` | Unchanged — already renders everything moved off the face |

---

## Task 1: Open up the card face

The face currently renders 3 attacks with 2–3 sentence bodies, a description paragraph and
language pips. On Jericho and impala that content is **taller than the card** — `.tcg-face` has
`overflow:hidden`, so `.wrr`, `.flavor` and the `FRED TCG` footer are clipped away entirely and
never render. This task is simultaneously the approved layout change and a bug fix.

**Files:**
- Modify: `src/components/Card.jsx:70-106` (the `.bottom` block)
- Modify: `src/styles/card.css:311-326` (`.layout-fullart .bottom` and its children)
- Verify: `src/components/CardModal.jsx` — **read only, expect no change**

**Interfaces:**
- Produces: `FACE_ATTACK_LIMIT = 2` module constant in `Card.jsx`.
- Produces: CSS custom properties on `.tcg-face.layout-fullart`, consumed by Task 4:
  - `--fa-scrim` — the bottom scrim's peak colour. Default `rgba(6,6,10,.78)`.
  - `--fa-ink` — primary text colour. Default `#f4efe0`.
  - `--fa-ink-dim` — secondary text colour. Default `#c9c6ba`.
  - `--fa-halo` — the text stroke/halo colour. Default `rgba(0,0,0,.55)`.
- Consumes: nothing.

- [ ] **Step 1: Capture the "before" for all three full-art cards**

```bash
node "$SCRATCH/shot.mjs" t1-before-hyper.png --freeze --scale=2
node "$SCRATCH/shot.mjs" t1-before-sir.png   --freeze --scale=2 --sel=".tcg-card.rarity-sir"
node "$SCRATCH/shot.mjs" t1-before-ir.png    --freeze --scale=2 --sel=".tcg-card.rarity-ir"
```

Expected: hyperrare and sir are visibly clipped at the bottom edge mid-sentence; ir fits but
its illustration is a thin band. Keep these three files — Step 6 diffs against them.

- [ ] **Step 2: Cut the face content in `Card.jsx`**

Add near the `FULLART` set at the top of the file:

```jsx
// Real full-art cards carry 1-2 attacks with 1-2 lines of rules text and nothing else;
// everything past that is what forced the old opaque .bottom panel over the illustration.
// The full set still renders in CardModal, which is the click-through detail view.
const FACE_ATTACK_LIMIT = 2;
```

In the `fullArt` branch of `.bottom`, slice the attacks and delete the description and
languages blocks entirely (lines 87-96). The `.wrr`, `.flavor` and `.foot` rows stay.

```jsx
{fullArt && (
  <div className="attacks">
    {project.attacks.slice(0, FACE_ATTACK_LIMIT).map((a) => (
      <div className="attack" key={a.name}>
        <div className="atk-cost">{a.cost.map((c) => <EnergyPip key={c} type={c} />)}</div>
        <div style={{ flex: 1 }}>
          <div className="atk-head">
            <span>{a.name}</span>
            {a.dmg ? <span className="atk-dmg">{a.dmg}</span> : null}
          </div>
          <div className="atk-text">{a.text}</div>
        </div>
      </div>
    ))}
  </div>
)}
```

`languages` is now unused in `CardFace` — remove the `const languages = ...` binding too, or
oxlint will flag it.

- [ ] **Step 3: Clamp attack body copy to one line**

Jericho's attack bodies are 2-3 sentences in the data and the data must not change. Clamp them
in CSS instead, in `card.css`:

```css
.layout-fullart .atk-text{
  font-size:8.8px;color:var(--fa-ink-dim);margin-top:1px;
  display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;
  overflow:hidden;
}
```

Two lines, not one: at 8.8px in a 222px column, one line holds ~45 characters, which truncates
`Hexagonal Enforcement` mid-word and reads as a bug rather than as a summary. Two lines lands
at the same visual weight as the Rotom IR's two-line rules text, which is the reference.

- [ ] **Step 4: Introduce the scrim + ink custom properties**

In `card.css`, on the full-art face rule, and rewrite `.bottom` to consume them:

```css
.tcg-face.layout-fullart{
  background:#0c0d13;color:var(--fa-ink);
  --fa-scrim:rgba(6,6,10,.78);
  --fa-ink:#f4efe0;
  --fa-ink-dim:#c9c6ba;
  --fa-halo:rgba(0,0,0,.55);
}
.layout-fullart .bottom{
  position:relative;z-index:2;margin-top:auto;
  background:linear-gradient(0deg, var(--fa-scrim) 45%, transparent);
  padding:8px 10px 8px;
}
```

Then replace the hard-coded colours in `.atk-text` (`#c9c6ba` → `var(--fa-ink-dim)`),
`.wrr` and `.foot` (`#a9a596` → `var(--fa-ink-dim)`), and `.flavor` (`#c9c6ba` →
`var(--fa-ink-dim)`). Delete the now-dead `.card-description`, `.card-languages` and
`.lang-pip` rules.

Note the default `--fa-scrim` is `.78`, not the spec's `.55`. `.55` is correct for Jericho,
whose lower third is composed pale on purpose; impala and tulip were not composed for it and
would lose their body copy. Jericho drops to `.55` in Task 4 where the composition supports it.

- [ ] **Step 5: Confirm `CardModal` needs no change**

Read `src/components/CardModal.jsx:34-56`. Confirm it maps **all** of `project.attacks`
(unsliced), and renders `role`/`resistance`/`retreat`, `languages`, `description`, `detail`
and `flavor`. It does. Make no edit. This step exists because the spec flagged it as an
unverified downstream risk (§7.7); it is now verified.

- [ ] **Step 6: Verify — all three cards fit, nothing is clipped**

```bash
node "$SCRATCH/shot.mjs" t1-after-hyper.png --freeze --scale=2
node "$SCRATCH/shot.mjs" t1-after-sir.png   --freeze --scale=2 --sel=".tcg-card.rarity-sir"
node "$SCRATCH/shot.mjs" t1-after-ir.png    --freeze --scale=2 --sel=".tcg-card.rarity-ir"
```

Expected on **all three**: the `FRED TCG · NNN/017` footer and the rarity mark are visible at
the bottom edge, the flavor line is complete, and no text is sliced by the card border.
Expected on **impala and tulip specifically**: more of their existing scene is visible than in
the "before" shot, and their text is still light-on-dark and legible. If either dark scene got
*worse*, stop — `--fa-scrim`'s default is wrong.

- [ ] **Step 7: Verify the pack-opening flip card**

The pack flip card renders the same `CardFace` (`PackCard.jsx:30` ← `FlipCard.jsx:41`) inside
`.flip-face.flip-back.tcg-card.rarity-*` at identical size, and `pack.css` never touches
`.tcg-face` internals — so this should carry over 1:1. Confirm rather than assume:

```bash
# open the pack view, reveal a card, then:
node "$SCRATCH/shot.mjs" t1-pack.png --freeze --scale=2 --sel=".flip-face.flip-back"
```

Expected: identical face to `t1-after-*`, footer present.

- [ ] **Step 8: Commit**

```bash
git add src/components/Card.jsx src/styles/card.css
git commit -m "fix(card): cut full-art face to real-card text density

The face rendered 3 attacks with multi-sentence bodies plus a description
paragraph and language pips. On Jericho and impala that content was taller
than .tcg-face, which has overflow:hidden -- so the role/retreat row, the
flavor line and the FRED TCG footer were clipped away and never rendered.

Cut to 2 attacks with 2-line clamped bodies and drop description/languages
from the face; CardModal already rendered all of it and is unchanged. Move
the bottom panel's scrim and ink colours behind custom properties so each
scene can set its own treatment.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

## Task 2: Node — rebuild `JerichoMascot`

Replace the 3-hexagon-and-an-orb diagram with a creature. Lineage stays Magneton/Magnemite;
only the execution changes.

**Files:**
- Modify: `src/components/MascotArt.jsx:17-70` (whole `JerichoMascot` function)
- Modify: `src/styles/mascot.css:14-91` (whole Jericho block)

**Interfaces:**
- Consumes: nothing from Task 1.
- Produces: `<JerichoMascot variant="a" | "b" | "c" className="" />`.
  - `viewBox="0 0 100 100"`, `overflow:visible` (already set by `.mascot`).
  - Root class list: `mascot mascot-jericho jericho-unit jericho-unit-{variant} {className}`.
  - **All ids inside must be suffixed with the variant** (`jericho-clip-a`, `jericho-clip-b`, …).
    Three instances render on one page; duplicate SVG ids silently cross-wire `clipPath`
    and `filter` references and the bug looks like a rendering glitch, not an id collision.
  - Class hooks Task 5 animates: `.jericho-ear-r`, `.jericho-ear-l`, `.jericho-eye-closed`,
    `.jericho-eye-open`, `.jericho-panel-glow`, `.jericho-screw-glint`, `.jericho-body`.

- [ ] **Step 1: Build the shell, with the sphere recipe**

A rounded, slightly flattened steel shell — a river stone, **not** a circle. A perfect circle
is the shape v1 already failed with.

Five elements, in this order, transcribed from `Voltorb_RR.jpg` (spec §2.3b) — (c) and (d) are
what make it read as a sphere and v1 had neither:

1. base fill `#dfe3ea`
2. broad soft highlight offset up-left of centre
3. small hard hotspot `#f8f9fc` inside it
4. **dark terminator band** as a crescent, `#8a7f9c`, *darker than the shadow that follows it*
5. **bounce rim** along the far lower-right edge in `#f0c89a`, warmer than the base

Outline the silhouette at **2.6** in `#2e2119`. Any surface detail must **curve to follow the
form**, per `Electrode_promo.jpg`'s wood grain — panel seams and screw placement do not sit flat.

- [ ] **Step 2: Ears — the listening organ**

Two small parabolic dish-ears on short gimbals, in place of Magnemite's horseshoe magnets, at
the same silhouette position. Inner cone of the left dish red-tipped `#c0392b`, the right blue
`#2b7fd1` — the direct lineage quote, legible at thumbnail size on both `Magneton_common.jpg`
and Kanda's SVP 159.

Group each ear so it rotates about its gimbal: `transform-box:fill-box` + an explicit
`transform-origin` at the gimbal, not the group centre.

- [ ] **Step 3: Eye — two states, both authored, cross-faded**

Author both and toggle opacity; do not morph.

- `.jericho-eye-closed` (**default, opacity 1**) — a single confident curved stroke lifted
  slightly at the outer end. This is exactly how Kitaoka draws it on the flagged card and it is
  why that Magnemite looks blissful rather than blank.
- `.jericho-eye-open` (default opacity 0) — dark inset socket, ring iris in `#5a5ec9`, heavy
  upper lid, and a small **warm catchlight**. The catchlight is what makes an eye alive; it is
  present on every eye across all seven cards in bucket 01.

- [ ] **Step 4: Screws and the flank panel**

Three Phillips-head screws per unit — two low, one on the crown reading as an antenna. Four
elements each (rim circle, recessed circle, two slot lines). Nine screws across three units =
nine free speculars, nine bits of surface density, nine lineage cues.

Variant `a` only: the left flank panel is **hinged open** toward the viewer, showing
`#f2a93b` interior glow and a suggestion of soft internal components. This is the single most
Jericho-specific image on the card — an open machine with a warm light inside and a human hand
beside it.

- [ ] **Step 5: Differentiate the three variants**

Same geometry, different character (spec §3.1). None of this needs to be legible; it needs to
be *true*, because it is what stops the three from being three copies of one shape.

| Variant | Scale | Character |
|---|---|---|
| `a` | 1.00 (~46px on a 242px face) | The local model. Scuffed, warm-toned, worn at the edges. Panel open. On the mat. |
| `b` | 0.70 | The cloud provider. Cleaner, cooler, floats higher, sits further back. |
| `c` | 0.55 | The core. Smallest, tucked in closest to `a`. |

Drive scuffing and temperature from the variant class in `mascot.css` — do not fork the markup.

- [ ] **Step 6: Verify in isolation before wiring the scene**

Temporarily render the three variants large on a blank route, or inspect via the existing card:

```bash
node "$SCRATCH/shot.mjs" t2-node.png --freeze --scale=4 --sel=".jericho-unit-a"
```

Expected: reads as a small metal creature with a face, not as a diagram. Compare against the
Magnemite in `Magneton_common.jpg` at the same size — that one is drawn very simply and still
reads as an animal. If ours doesn't, the line-weight hierarchy (Step 1) is the first suspect.

- [ ] **Step 7: Commit**

```bash
git add src/components/MascotArt.jsx src/styles/mascot.css
git commit -m "feat(jericho): rebuild Node as a creature, not a diagram

Three linked steel shells in the Magneton lineage, with the parts that make
the lineage legible: parabolic dish-ears with red/blue-tipped inner cones,
Phillips-head screws, a hinged flank panel with a warm interior. Eye is a
closed contented arc at rest. Three-tier line weight, warm brown-black
outline, and the four-part sphere recipe (terminator band + bounce rim).

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

## Task 3: The scene — "Mending, late afternoon"

*Late sun rakes across Fred's desk; he is mid-repair on one of Node's three units, panel open
and warm inside; it holds still for him with its eyes shut and one ear turned his way; the other
two hover close, watching.*

**Files:**
- Modify: `src/components/FullArtScenes.jsx:17-37` (whole `JerichoScene`)
- Modify: `src/styles/card.css:106-171` (whole Jericho scene block — the dusk-room rules go)

**Interfaces:**
- Consumes: `<JerichoMascot variant>` from Task 2.
- Produces: `<div class="art-bg scene-jericho">` containing one
  `<svg viewBox="0 0 242 346" preserveAspectRatio="xMidYMid slice">`.
- Produces: class hooks Task 5 animates — `.jericho-beam`, `.jericho-mote`, `.jericho-sparkle`,
  `.jericho-steam`, `.jericho-rays`, `.jericho-arc`, `.jericho-hand`.
- Produces: `.jericho-wake-text` is **kept** (existing hook, existing `.holo-shine` 1.05s sync
  at `card.css:175-177`) but repositioned to the lower-left of the clear band, over the pale desk.

**Three explicit planes, per spec §2.8.** Background gets a semi-transparent scrim of the
ambient wall tone at 14-18%; midground untouched; foreground at full saturation. This is
directly observable on Kitaoka's card (background Magnemite are flat desaturated grey with no
rendering at all) and on `Magneton_common.jpg`. It is what depth is; it is not a blur filter.

- [ ] **Step 1: Plane 3 — the room (y 0-190, scrimmed 14-18%, coarse halftone)**

- **Window**, x 0-70, y 55-150, cropped by the left edge. Warm gold near a low horizon `#f0b86a`
  → pale warm blue `#a8c4de` at top. Two soft clouds, a distant rooftop line, four muntin bars,
  a warm sill.
- **The sunbeam** — the light source, and it must be visible *as an object*. Soft-edged polygon
  from the window down-right across the desk, `#f7d08a` at 0.18-0.26, masked. **Its job is to
  land on unit A's open panel.** If the beam lights nothing in particular it is generic and the
  §5.2 audit fails it.
- **Pegboard wall**, x 76-242, y 20-155. Warm off-white in the sun, cooling at the frame edges —
  a real wall has a value change across it because something is lighting it.
- **Prop floor: no fewer than 18 discrete named objects.** Soldering iron on a stand, coil of
  hookup wire, three jars of screws, a small trailing plant, a mug of pens, a stack of four
  books, a rolled cable, a printed photo pinned at a slight angle, a roll of tape, pliers, a
  small speaker grille, a wall calendar with one month's grid. Count them. v1 had five elements
  total, and the density is where the Kayama/Komatsu charm actually comes from.

- [ ] **Step 2: Halftone dot screens, not crosshatch**

Two `<pattern>` defs of dots — fine 1.6px pitch for the shadow side of objects, coarse 3px for
the wall plane — warm-toned, at 8-12%. Sourced to `Deoxys_Ultra_Rare.jpg` (GG46/GG70, DOM),
which fills its whole background with visible dot screens.

Crosshatch reads etched, engraved, serious. Halftone reads printed, soft, playful. Fred said
"warm and cute and fuzzy." Dots are fuzzy. Same authoring cost.

- [ ] **Step 3: Plane 2 — the desk and Fred**

- **Desk** from x 0 (off the left edge) to x 210, surface at y ~192, seen slightly from above.
  `#a8703f`, hard specular streak along the near edge where the sun catches it.
- **Fred**, x 130-242, cropped at the shoulder by the right frame edge, three-quarter, head at
  ~**(186, 108)**, ~44px tall, turned down-left toward the work. Small closed smile, eyes down,
  absorbed. Warm sun rim along his left contour. Left forearm comes down and left across the
  desk; **hand at ~(126, 186)**, palm down, screwdriver held loosely.
- **Use `src/assets/fred-photo-cutout.png` as drawing reference.** Fred wears glasses and has a
  full beard and moustache, with dark hair receding at the temples. Those are two high-contrast,
  easy-to-draw shapes and they are what will make a 44px vector head read as *him* rather than
  as generic-man. This materially lowers the risk the spec flagged in §3.4/§7.6.
- **The emotional load sits in the hand, not the face.** If exactly one element on this card has
  to be drawn beautifully, it is that hand.
- On the desk, deliberately **pale and low-contrast** so the scrim can stay at `.55` (the Kayama
  principle, §1.2): a closed notebook, a pen, a pale mug with a thin steam wisp, a small parts
  tray, a cable running off the near edge.
- **No laptop and no screen anywhere in the frame.** Jericho is voice. A screen is the wrong organ.

- [ ] **Step 4: Plane 1 — Node, foreground (y 100-215)**

- **Unit A** on the mat, on the desk, **at Fred's hand** — centre ~**(86, 178)**, ~46px across,
  tipped ~8° toward him. Eye closed. Panel hinged open toward the viewer catching the beam.
  Right dish-ear **deployed and rotated toward Fred**; left dish-ear **detached, lying on the
  mat** beside two loose screws. Two-part contact shadow where it meets the mat: a small hard
  dark core at 0.5 directly under it, plus a wider soft one at 0.18 with a blur. One blurred
  blob alone reads as a UI drop shadow; the hard core is what makes an object *sit*.
- **The mat** — a **crocheted hexagon-pattern mat**, x 55-128, y 188-214, in warm rust, cream and
  muted teal, one corner rucked up. Hexagons as something hand-made and domestic. This is
  Jericho's architecture rendered as warmth instead of as a wireframe, and it is the one element
  that could not appear on any other card in the deck.
- **Units B and C** float close at ~(46, 132) and ~(114, 142), one plane back and slightly
  desaturated. Eyes closed, ears angled down toward the work. They are watching their sibling
  get fixed.
- **Foreground crop:** the near edge of a coffee mug at the extreme lower-left, larger, softer
  and darker than everything else, cropped by the frame. Cheap, real depth — sourced to the
  out-of-focus grass blades crossing the lower frame on `Electrode_Ultra_Rare.jpg`.
- **Overlap, always.** Node touches the mat, the mat overlaps the desk edge, Node overlaps
  Fred's hand, his shoulder overlaps the pegboard, the foreground mug crops the desk. v1's Node
  floated in front of an empty wall touching nothing.

- [ ] **Step 5: Hyper Rare treatment — the gold is the sun**

Rather than pasting gilding over a scene, the scene *supplies* it: the window and the beam are
the card's gold field, warmed further at the window edge. Plus **~14 large four-point stars**
with long thin spikes, some 4-5% of card width, a few with faintly coloured cores,
**concentrated inside the sunbeam** where dust genuinely catches light.

Corrected from `Electrode_Secret_Rare.jpg`: the real card has ~12-16 *large* stars, not the 34
small sparkles v1 specified. Constraining them to the beam merges the hyper-rare glitter
convention with the scene's own physical logic.

The existing `.tcg-card.rarity-hyperrare` gold frame is fine and stays. `.holo-shine` unchanged.

- [ ] **Step 6: Grain (cut this first if effort runs short)**

One full-frame `<rect>` filled by an `feTurbulence` (`baseFrequency` ~0.8, `numOctaves` 3) at
3-4% with `mix-blend-mode:overlay`. Grain plus halftone together read as printed card stock,
and a real card is a physical printed object you hold. Lowest-yield item in the whole spec.

- [ ] **Step 7: Set Jericho's scrim and ink**

Now the composition supports it, scope the treatment to this scene only:

```css
.layout-fullart:has(.scene-jericho){
  --fa-scrim:rgba(8,7,14,.55);
  --fa-ink:#241a12;
  --fa-ink-dim:#3d2c1e;
  --fa-halo:rgba(255,248,232,.92);
}
```

**Dark ink with a cream halo, not white ink with a dark stroke.** Every full-art reference in
the set does this — Magnemite, Rotom IR, Rotom V, Electrode SR, Deoxys, Magnezone all set their
attack names and body copy in near-black with a light outline. None is white-on-dark. Our scene
is a bright daylight room, so dark-on-pale is both the authentic and the legible choice.

Apply the halo as a stroke, and keep the top row light — the top of this scene is the shaded
pegboard, exactly as Kitaoka's card is dark at the top where "Magnemite" sits in white:

```css
.layout-fullart:has(.scene-jericho) .bottom{
  paint-order:stroke fill;
  -webkit-text-stroke:2.5px var(--fa-halo);
}
```

`.top-row`'s existing dark gradient and the gold `.name` are unchanged.

- [ ] **Step 8: Verify — the still-frame test, side by side against a real card**

```bash
node "$SCRATCH/shot.mjs" t3-still.png --freeze --scale=3
```

Then open both this and
`docs/reference/jericho-inspiration/01-magneton-lineage/Magnemite_Ultra_Rare_gorgeous_perfect_example_of_story_on_card.jpg`
and ask **"does this look finished next to that?"** — not "does it contain the listed elements?"
Confirming a card matches its spec's bullets is exactly how the last attempt produced a false
"done".

Also verify the reading order actually closes: window → down the beam → onto A's open amber
panel → up Fred's forearm → his face → down his gaze to his hand → to A's closed eye → and A's
turned ear points back up to him. **A closed loop, and the loop is the relationship.**

If it doesn't hold up, say so plainly rather than shipping it.

- [ ] **Step 9: Commit**

```bash
git add src/components/FullArtScenes.jsx src/styles/card.css
git commit -m "feat(jericho): stage the card as a Character Rare of Fred and Node

Replaces the dusk room with 'Mending, late afternoon' -- Fred mid-repair on
one of Node's units, panel open and warm inside, holding still for him.
Bright late sun as the single committed light source, three explicit
atmospheric planes, 18+ background props, halftone dot screens, and the
hyper-rare gilding supplied by the scene's own sunbeam rather than pasted on.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

## Task 4: Animation — idle, wake, sleep

Continuous idle-loop tier. Every beat hangs off state the card already tracks —
`.tcg-card:hover`, `.tcg-card.tilting` (set on `touchstart`, cleared on `touchend`/`touchcancel`
by `Card.jsx:155-160,209-210`), `.scene-paused` for off-screen. **No new event plumbing.**

**Files:**
- Modify: `src/styles/mascot.css` (Jericho block)
- Modify: `src/styles/card.css` (scene animation + the `.scene-paused` and reduced-motion blocks)

**Interfaces:**
- Consumes: every class hook produced by Tasks 2 and 3.

- [ ] **Step 1: Idle loop**

| # | Beat | Detail |
|---|---|---|
| I0 | Sunbeam | Opacity 0.19 ↔ 0.24 over **9s**, ~1.5px lateral drift. **No flicker** — sun doesn't flicker. |
| I1 | Dust motes | **7** circles, r 0.6-1.1, drifting up and left, 14-22s each, staggered, opacity 0.18-0.35, **masked to the inside of the beam only.** |
| I2 | **Ear-flick** | Every ~9s, A's deployed dish rotates **3-4° and settles**, 220ms ease-out. Nothing else moves. **This is the most important beat in the design** — it is what a sleeping dog's ear does, it says "listening" with zero menace, and it costs one rotate. |
| I3 | Amber interior | Panel glow breathes 0.62 ↔ 0.78 over **4s** — a slow heartbeat, not a pulse. |
| I4 | Node float | B and C bob translateY ±1.2px over **7s**, phase-offset **1.2s** / **2.4s**. **A does not float** — it is resting on the mat, and a thing being repaired holds still. |
| I5 | Steam | Mug wisp, animated `d` on a 9s loop, opacity 0.12-0.22. |
| I6 | Sparkles | ~14 four-point stars twinkle on staggered 5-9s loops, inside the beam. |
| — | Fred | **Does not move.** He is absorbed. Vector humans in motion look bad and stillness is affordable. |

- [ ] **Step 2: Wake — `:hover` / `.tilting`. ~1.15s, then holds**

**The beat is: it opens its eyes and looks up at you.** Everything else supports that.

| t (s) | Beat |
|---|---|
| 0.00 | **Ear turn** — A's deployed dish snaps 6° toward the viewer, 90ms. It heard something before anything lit up. |
| 0.12 | **A's eye opens** — closed arc cross-fades to the round eye over 140ms; iris ring in, warm catchlight lands last. |
| 0.22 | **B opens**, 140ms. |
| 0.30 | **C opens**, 140ms. |
| 0.36 | **B and C ears deploy** folded → 40° out, 180ms, small overshoot `cubic-bezier(.34,1.4,.64,1)`. Mechanical parts should overshoot; that is what makes them read as sprung. |
| 0.42 | **Amber interior brightens** 0.70 → 0.92, 260ms. |
| 0.50 | **Two short arcs** flick A→C and C→B, 90ms each, `d` swapping between 3 pre-authored jitter variants at 30ms intervals during the strike. That 3-frame jitter is the difference between lightning and a curve. Settle to 0.5 opacity. |
| 0.58 | **Ray burst blooms** — 20-24 wide wedges, jittered ±40% of the mean angular step (evenly spaced reads as a loading spinner), ramping warm cream `#fdf1d6` at the core → soft peach `#f0b678` → pale mint `#cfe6d8` at the tips, under a radial mask so it fades before the frame edge. Scale 0.90 → 1.03 → 1.00, fade in over 220ms. **Delight, not discharge** — 0 opacity at rest, because you do not put burst lines behind a resting creature. |
| 0.66 | **Screw glints** — all nine pop a 2-line cross-glint for 80ms each in a staggered 25ms cascade travelling left to right, reading as one light sweeping across metal. |
| 0.74 | **The sunbeam brightens** ~15% and widens ~5% over 350ms; motes briefly speed up. The *room* responds, not just the creature. |
| 0.82 | **Fred's hand opens slightly** — fingers lift ~1.5px off the desk toward A, 260ms. He noticed. |
| 0.95 | **A leans toward him** — translates 2px toward his hand and tips 3° further, 300ms ease-out. Body language replaces "watching him." |
| 1.05 | **`.holo-shine` sweep** — existing element, existing 1.05s delay at `card.css:175-177`. Already lands exactly here; do not retime it. |
| 1.15 | **Wake-text "Jericho"** fades in — existing `.jericho-wake-text` hook, repositioned in Task 3. |

**Held state:** rays hold at 65% of peak on a slow 3s breathe; amber holds warm; and **every
open eye blinks on a ~3.5s stagger.** An eye that never closes is a camera; an eye that blinks
is alive.

- [ ] **Step 3: Sleep — pointer leave / touch release. ~1.2s, reverse order, slower**

Rays decay 300ms → arcs fade 200ms → A settles off its lean 350ms → sunbeam returns 800ms →
B and C's ears fold at 400ms/520ms → **C's eye closes at 560ms, B's at 700ms, A's last at
900ms**, each folding back into the contented arc over 200ms → amber settles.

> **A's deployed ear stays deployed, and stays turned toward Fred. It does not fold.**
> The eyes close; the ear stays turned toward him. If an implementer ever folds that ear on
> leave, the card has lost its point.

- [ ] **Step 4: Mobile, off-screen, reduced motion**

- **Mobile** (`@media (max-width:640px)`): ray wedges 24 → 14, dust motes 7 → 3, sparkles
  14 → 8, drop the grain layer, **keep** the coarse halftone (one pattern fill, doing real work
  at small size). Timings unchanged. Note the card is a fixed 260×364 at every breakpoint —
  this is a perf budget, not a layout change.
- **Off-screen:** add every new looping selector to the existing `.tcg-card.scene-paused` block
  at `card.css:440-444`. That block sits after the scene rules on purpose so it wins the
  cascade tie at equal specificity — keep the new selectors inside it, not above it.
- **`prefers-reduced-motion: reduce`:** pin to the **rest** frame — all eyes closed in their
  arcs, A's ear turned toward Fred, panel open and amber at base, beam at base, no rays, no
  arcs, all loops `animation:none`, no wake transition. v1 pinned to a half-woken frame because
  rest was emotionally empty; rest is now the emotionally complete state, which is the single
  strongest piece of evidence that the register change is right. Replace the stale
  `.jericho-wake-text` / `.jericho-lamp-glow` rules at `card.css:447-448` — the lamp is gone.

- [ ] **Step 5: Verify wake, touch, mobile and reduced motion**

```bash
node "$SCRATCH/shot.mjs" t4-wake.png  --hover --scale=3
node "$SCRATCH/shot.mjs" t4-still.png --freeze --scale=3
node "$SCRATCH/shot.mjs" t4-mobile.png --mobile --freeze --scale=3
```

For touch-and-hold, add `.tilting` via `javascript_tool` and screenshot — it must produce the
same wake as `:hover`, since both drive identical selectors.

For reduced motion, relaunch with `--force-prefers-reduced-motion` or set the emulation via CDP,
and confirm the frame equals the **rest** state, not the woken one.

Expected on `t4-wake.png`: three open eyes with catchlights, ears deployed, panel bright, a
warm pastel ray bloom, and A leaning toward Fred's hand.

- [ ] **Step 6: Commit**

```bash
git add src/styles/mascot.css src/styles/card.css
git commit -m "feat(jericho): idle loop, wake and sleep choreography

Idle is a sleeping dog: eyes shut, panel breathing, and an ear that flicks
every ~9s. Wake opens three eyes in sequence and A leans toward Fred's hand;
sleep reverses it -- except A's deployed ear, which stays turned toward him.
Reduced motion pins to the rest frame, which is now the emotionally complete
state rather than an empty one.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

## Task 5: Whole-deck regression pass

**Files:** none expected. This task exists to catch what the shared-CSS change broke.

- [ ] **Step 1: Screenshot every card in the gallery, both layouts**

```bash
node "$SCRATCH/shot.mjs" t5-all.png --freeze --scale=1 --sel=".card-grid"
```

Expected: all 12 cards render, no clipped footers anywhere, classic-layout cards untouched.

- [ ] **Step 2: Confirm the two other full-art scenes did not regress**

Diff `t1-before-sir.png` / `t1-before-ir.png` against fresh captures. Impala and tulip must be
**better** (more scene visible, footer restored) and must still be legible light-on-dark — the
`:has(.scene-jericho)` scoping in Task 3 Step 7 is what keeps their ink light. If either went
dark-on-dark, that selector leaked.

If either needs adjustment, that is in scope. If either would need *redesign*, flag it rather
than half-fixing it.

- [ ] **Step 3: Lint and build**

```bash
npm run lint && npm run build
```

Expected: both clean. `npm run lint` is oxlint and will flag the unused `languages` binding if
Task 1 Step 2 missed it.

- [ ] **Step 4: Commit any fixes, then open the PR**

Push the branch and open a PR directly — no need to ask (standing preference). PR description
ends with `🤖 Generated with [Claude Code](https://claude.com/claude-code)`.

---

## Self-review against the spec

| Spec section | Covered by |
|---|---|
| §1 Layout (drop panel, cut text, Kayama lower third, 42% band) | Task 1; Task 3 Steps 3, 7 |
| §2.1 Line weight | Global Constraints; Task 2 Step 1 |
| §2.2 Halftone, not crosshatch | Task 3 Step 2 |
| §2.3 / §2.3b Shading + sphere recipe | Task 2 Step 1 |
| §2.4 Ray burst, recoloured and reshaped | Task 4 Step 2 (t=0.58) |
| §2.5 Arcs, demoted | Task 4 Step 2 (t=0.50) |
| §2.6 One light source, now the sun | Task 3 Step 1 |
| §2.7 Two-part contact shadows | Task 3 Step 4 |
| §2.8 Three atmospheric planes | Task 3 preamble + Steps 1, 3, 4 |
| §2.9 Overlap | Task 3 Step 4 |
| §2.10 Grain | Task 3 Step 6 |
| §3.1-3.3 Node's units, ears, screws, panel, eye | Task 2 Steps 1-5 |
| §3.4 Fred and the face problem | Task 3 Step 3 (+ the photo-cutout reference, which de-risks it) |
| §3.5 Palette, no gold on the creature | Global Constraints |
| §4 Scene + reading order + still-frame test | Task 3 Steps 1-4, 8 |
| §5.1 Hyper Rare treatment | Task 3 Step 5 |
| §5.2 Uniqueness audit (all CUT items) | Task 3 Steps 1, 3, 4 — dusk lamp, laptop, hex lattice, indigo core, bookshelf all gone |
| §6.1-6.3 Idle / wake / sleep | Task 4 Steps 1-3 |
| §6.4 Mobile / off-screen / reduced motion | Task 4 Step 4 |
| §7.7 Unverified downstream risk | Task 1 Steps 5, 7; Task 5 Step 2 — **all four resolved** |

**Known gap, deliberate:** §2.10 grain is marked droppable by the spec itself and is the first
thing to cut if the frame gets too heavy.
