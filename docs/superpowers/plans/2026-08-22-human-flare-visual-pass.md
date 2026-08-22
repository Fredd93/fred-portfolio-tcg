# Human Flare Visual Pass Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace emoji icons with bespoke animated SVG mascots and add real motion to the three flagship full-art card scenes, then add a "Who's That Dev?" reveal replacing the flat letter-monogram hero avatar — per `docs/superpowers/specs/2026-08-22-human-flare-visual-pass-design.md`.

**Architecture:** Mascots are a new SVG component registry (`MascotArt.jsx`) mirroring the existing `FULLART_SCENES` registry pattern in `FullArtScenes.jsx`. Idle-loop and hover-reaction animation is pure CSS (`@keyframes` + `.tcg-card:hover`/`.tilting` selectors), matching how the codebase already drives the holo-shine effect — no new animation library needed for scenes. The reveal is a new standalone component using the project's existing `framer-motion` dependency, mounted once in `GalleryView.jsx`.

**Tech Stack:** React 19, plain CSS (`src/styles/*.css`), `framer-motion` (already a dependency, used only for the reveal), inline SVG. No test framework exists in this project — verification is `npm run build` (catches syntax/import errors) plus manual browser check via the dev server for each task.

## Global Constraints

- No new npm dependencies (spec Decision "no new dependency needed" — framer-motion already covers what's needed).
- Card-by-card build order: Jericho fully done and verified before TulipVision starts; TulipVision fully done and verified before Severe Weather starts. (User's explicit instruction: slower but guarantees quality.)
- Mascots replace the flagship scenes' emoji `<span>` glyphs; the classic-layout `.art` icon (used by the other 12 non-flagship cards) and `CardModal.jsx`'s icon display are unchanged in this pass — out of scope per spec.
- All scene/mascot motion respects `prefers-reduced-motion: reduce` (drop to static single frame).
- Severe Weather's mascot uses the scene's existing heat/cold palette (`#ffb648`/`#e6791f` heat, `#cfe6ff`/`#1c3f6b` cold) — not the generic `ml` type color — per spec Decision 1.2's correction (project detects heatwaves/cold snaps, not storms).
- The reveal's photo asset is a pending asset Fred supplies later; implementation uses a placeholder file so the component works end-to-end today and the real photo drops in as a same-path file swap.

---

## File Structure

| File | Responsibility |
|---|---|
| `src/components/MascotArt.jsx` (create) | Mascot SVG registry: `JerichoMascot`, `TulipMascot`, `ImpalaMascot` components + `MascotArt({ id })` resolver, mirroring `FULLART_SCENES` in `FullArtScenes.jsx`. |
| `src/styles/mascot.css` (create) | Idle-loop keyframes and hover/tilt activation rules for the three mascots. |
| `src/hooks/useInViewAnimation.js` (create) | IntersectionObserver hook — returns a ref and a boolean; consumers add a `scene-paused` class when `false`, pausing CSS animations off-screen. |
| `src/data/cards.js` (modify) | Add `mascot: 'jericho' \| 'tulip' \| 'impala'` field to the three flagship project entries. |
| `src/components/FullArtScenes.jsx` (modify) | Swap each flagship scene's emoji glyph(s) for the matching mascot component; add scene-motion wrapper markup (scan/lock cycle state for TulipVision). |
| `src/styles/card.css` (modify) | Add scene-motion keyframes (ring pulse, scan sweep/lock, wind/shimmer drift, icing flicker) and `prefers-reduced-motion`/`.scene-paused` overrides. |
| `src/components/Card.jsx` (modify) | Apply `useInViewAnimation` to the full-art scene wrapper so off-screen cards pause their animation. |
| `src/components/IntroReveal.jsx` (create) | "Who's That Dev?" silhouette → photo reveal component. |
| `src/assets/fred-photo.jpg` (create, placeholder) | Placeholder photo asset; Fred replaces this file later with the real photo at the same path. |
| `src/views/GalleryView.jsx` (modify) | Mount `IntroReveal`, replace the `<div className="avatar"><span>MF</span></div>` markup. |
| `src/styles/layout.css` (modify) | Reveal styles (silhouette, caption, flip transition, resolved-photo avatar). |
| `src/main.jsx` (modify) | Import `mascot.css`. |

---

### Task 1: Mascot registry scaffold + Jericho mascot (static, no animation)

**Files:**
- Create: `src/components/MascotArt.jsx`
- Modify: `src/data/cards.js:36` (jericho entry)
- Modify: `src/components/FullArtScenes.jsx`

**Interfaces:**
- Produces: `MascotArt({ id, className })` — resolves `id` (`'jericho' | 'tulip' | 'impala'`) to the matching mascot SVG, renders nothing (returns `null`) for unknown ids. Exported as default and named `{ MascotArt }`.
- Produces: `MASCOTS` map (`{ jericho: JerichoMascot, tulip: TulipMascot, impala: ImpalaMascot }`) for later tasks to extend.
- Consumes (from `cards.js`): `project.mascot` field, a string id.

- [ ] **Step 1: Add the `mascot` field to the Jericho project entry**

In `src/data/cards.js`, find the `jericho` entry (starts `id: 'jericho', name: 'Jericho', ...`) and add a `mascot` field next to `icon`:

```js
stage: 'Stage 2 · In Progress', hp: 4108, hpMetric: 'loc', icon: '🛰️', mascot: 'jericho',
```

- [ ] **Step 2: Create the mascot registry file with the Jericho mascot SVG**

Create `src/components/MascotArt.jsx`:

```jsx
// src/components/MascotArt.jsx
// Bespoke SVG mascots for the flagship IR/SIR/SSIR projects, replacing the
// flat project emoji. Mirrors the FULLART_SCENES registry pattern in
// FullArtScenes.jsx. Each mascot is a self-contained <svg> using class
// hooks (no inline style) so mascot.css can drive idle/hover animation.

export function JerichoMascot({ className = '' }) {
  return (
    <svg
      className={`mascot mascot-jericho ${className}`}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Jericho sentinel mascot"
    >
      <polygon className="jericho-m-body" points="50,30 68,40 68,62 50,72 32,62 32,40" />
      <circle className="jericho-m-head" cx="50" cy="24" r="14" />
      <polygon className="jericho-m-ear jericho-m-ear-l" points="38,16 30,2 44,12" />
      <polygon className="jericho-m-ear jericho-m-ear-r" points="62,16 70,2 56,12" />
      <circle className="jericho-m-tip jericho-m-tip-l" cx="31" cy="4" r="2.4" />
      <circle className="jericho-m-tip jericho-m-tip-r" cx="69" cy="4" r="2.4" />
      <circle className="jericho-m-eye jericho-m-eye-l" cx="45" cy="24" r="2" />
      <circle className="jericho-m-eye jericho-m-eye-r" cx="55" cy="24" r="2" />
      <line className="jericho-m-seam" x1="50" y1="30" x2="50" y2="72" />
      <line className="jericho-m-seam" x1="32" y1="40" x2="68" y2="40" />
      <line className="jericho-m-seam" x1="32" y1="62" x2="68" y2="62" />
    </svg>
  );
}

export const MASCOTS = {
  jericho: JerichoMascot,
};

export function MascotArt({ id, className }) {
  const Mascot = MASCOTS[id];
  return Mascot ? <Mascot className={className} /> : null;
}

export default MascotArt;
```

- [ ] **Step 3: Wire the mascot into Jericho's scene, replacing the satellite emoji**

In `src/components/FullArtScenes.jsx`, add the import:

```js
import { JerichoMascot } from './MascotArt.jsx';
```

Replace this line inside `JerichoScene()`:

```jsx
        <span className="jericho-sat">🛰️</span>
```

with:

```jsx
        <JerichoMascot className="jericho-sat" />
```

- [ ] **Step 4: Verify the build compiles**

Run: `npm run build`
Expected: build succeeds with no errors.

- [ ] **Step 5: Verify visually**

Start the dev server (`npm run dev`), open the gallery view, and confirm the Jericho card (SSIR, full-art) shows the new hex-plated fox-sentinel shape in place of the satellite emoji, still centered inside the existing ring stack. It will look static/flat at this stage — that's expected, animation is Task 2.

- [ ] **Step 6: Commit**

```bash
git add src/components/MascotArt.jsx src/components/FullArtScenes.jsx src/data/cards.js
git commit -m "feat: add Jericho sentinel mascot SVG, replacing satellite emoji"
```

---

### Task 2: Jericho mascot idle + hover animation

**Files:**
- Create: `src/styles/mascot.css`
- Modify: `src/main.jsx`

**Interfaces:**
- Consumes: the exact class names produced in Task 1 (`mascot-jericho`, `jericho-m-body`, `jericho-m-head`, `jericho-m-ear`/`jericho-m-ear-l`/`jericho-m-ear-r`, `jericho-m-tip`/`jericho-m-tip-l`/`jericho-m-tip-r`, `jericho-m-eye`, `jericho-m-seam`).
- Consumes: the card's existing hover/tilt state — `.tcg-card:hover` and `.tcg-card.tilting` (set by `Card.jsx`'s existing pointer handlers, no new JS needed).

- [ ] **Step 1: Create `mascot.css` with Jericho's dormant/idle/activate states**

Create `src/styles/mascot.css`:

```css
/* src/styles/mascot.css
   Idle-loop + hover/tilt "activate" animation for flagship mascots.
   Hover/activate reuses the card's existing .tcg-card:hover / .tilting
   state (set by Card.jsx's pointer handlers) — no separate JS wiring. */

.mascot{ overflow:visible; }

/* ---- Jericho: hex-plated satellite-fox sentinel ---- */
.mascot-jericho{
  animation: jericho-m-breathe 4s ease-in-out infinite;
  transform-origin: 50% 60%;
}
@keyframes jericho-m-breathe{
  0%, 100%{ transform: scale(1); }
  50%{ transform: scale(1.03); }
}
.jericho-m-body{ fill: rgba(139,143,224,.28); stroke: rgba(180,183,240,.7); stroke-width: 1.4; }
.jericho-m-head{ fill: rgba(139,143,224,.22); stroke: rgba(180,183,240,.7); stroke-width: 1.4; }
.jericho-m-ear{ fill: rgba(139,143,224,.3); stroke: rgba(180,183,240,.6); stroke-width: 1.2; transform-origin: 50% 100%; }
.jericho-m-seam{ stroke: rgba(180,183,240,.35); stroke-width: 1; }
.jericho-m-tip{ fill: rgba(180,183,240,.4); transition: fill .3s ease, filter .3s ease; }
.jericho-m-eye{ fill: rgba(180,183,240,.35); transition: fill .3s ease, filter .3s ease; }

/* dormant -> activate on hover/tilt */
.tcg-card:hover .jericho-m-tip, .tcg-card.tilting .jericho-m-tip{
  fill: var(--gold); filter: drop-shadow(0 0 4px var(--gold));
}
.tcg-card:hover .jericho-m-eye, .tcg-card.tilting .jericho-m-eye{
  fill: #eaf4ff; filter: drop-shadow(0 0 3px #9ecbff);
}
.tcg-card:hover .jericho-m-ear-l, .tcg-card.tilting .jericho-m-ear-l{ animation: jericho-m-ear-twitch .4s ease; }
.tcg-card:hover .jericho-m-ear-r, .tcg-card.tilting .jericho-m-ear-r{ animation: jericho-m-ear-twitch .4s ease .05s; }
@keyframes jericho-m-ear-twitch{
  0%{ transform: rotate(0deg); }
  40%{ transform: rotate(-6deg); }
  100%{ transform: rotate(0deg); }
}

@media (prefers-reduced-motion: reduce){
  .mascot-jericho{ animation: none; }
  .tcg-card:hover .jericho-m-ear-l, .tcg-card.tilting .jericho-m-ear-l,
  .tcg-card:hover .jericho-m-ear-r, .tcg-card.tilting .jericho-m-ear-r{ animation: none; }
}
```

- [ ] **Step 2: Import the new stylesheet**

In `src/main.jsx`, add after the existing `./styles/card.css` import:

```js
import './styles/mascot.css';
```

- [ ] **Step 3: Verify the build compiles**

Run: `npm run build`
Expected: build succeeds with no errors.

- [ ] **Step 4: Verify visually**

In the dev server, confirm the Jericho mascot gently "breathes" (scales) continuously, and hovering/tilting the card brightens its antenna-tips and eyes with a small ear-twitch. Confirm the dormant (non-hovered) state reads as dim/idle, matching "lives at the periphery until you need it."

- [ ] **Step 5: Commit**

```bash
git add src/styles/mascot.css src/main.jsx
git commit -m "feat: animate Jericho mascot idle breathing and hover activate state"
```

---

### Task 3: Jericho scene motion (ring pulse + tilt parallax)

**Files:**
- Modify: `src/styles/card.css`

**Interfaces:**
- Consumes: existing scene classes `jericho-ring-1`/`jericho-ring-2`/`jericho-ring-3`, `jericho-house-glow`, and the `--mx`/`--my` custom properties already written onto `.tcg-card` by `Card.jsx`'s pointer handlers (`ref.current.style.setProperty('--mx', ...)`).

- [ ] **Step 1: Add ring-pulse keyframes**

In `src/styles/card.css`, replace the existing static ring rules:

```css
.jericho-ring-1{width:50px;height:50px;opacity:.6;}
.jericho-ring-2{width:83px;height:83px;opacity:.4;}
.jericho-ring-3{width:115px;height:115px;opacity:.22;}
```

with animated versions (staggered radar-sweep cadence):

```css
.jericho-ring-1{width:50px;height:50px;animation: jericho-ring-pulse 3s ease-out infinite;}
.jericho-ring-2{width:83px;height:83px;animation: jericho-ring-pulse 3s ease-out infinite .6s;}
.jericho-ring-3{width:115px;height:115px;animation: jericho-ring-pulse 3s ease-out infinite 1.2s;}
@keyframes jericho-ring-pulse{
  0%{ transform: translate(-50%,-50%) scale(.85); opacity:.65; }
  80%{ opacity:.15; }
  100%{ transform: translate(-50%,-50%) scale(1.15); opacity:0; }
}
```

- [ ] **Step 2: Add tilt parallax to the satellite glow/house-glow**

Add below the ring rules:

```css
.jericho-house-glow{
  transition: transform .15s ease;
  transform: translateX(calc(-50% + (var(--mx, 50) - 50) * .12px));
}
```

(`--mx` is written as a percentage string like `62.3%` by `Card.jsx`; CSS `calc()` can't parse the `%` suffix arithmetic directly here, so this rule only activates meaningfully once `Card.jsx` writes a unitless numeric copy. Skip the numeric parallax calc and instead use a simpler, robust approach: shift on the existing `.tilting` class instead of a live `--mx` calc.)

Replace the block above with this simpler, robust version instead:

```css
.jericho-house-glow{ transition: opacity .2s ease, transform .2s ease; }
.tcg-card.tilting .jericho-house-glow{ transform: translateX(-50%) scale(1.15); opacity:.5; }
```

- [ ] **Step 3: Add reduced-motion override**

Add to the existing `prefers-reduced-motion` handling (create the block if none exists yet in `card.css`):

```css
@media (prefers-reduced-motion: reduce){
  .jericho-ring-1, .jericho-ring-2, .jericho-ring-3{ animation: none; opacity:.35; }
}
```

- [ ] **Step 4: Verify the build compiles**

Run: `npm run build`
Expected: build succeeds with no errors.

- [ ] **Step 5: Verify visually**

Confirm the three rings around the Jericho mascot now pulse outward on a staggered radar-sweep loop (not static concentric circles), and the house-glow beneath brightens slightly when the card is hovered/tilted.

- [ ] **Step 6: Commit**

```bash
git add src/styles/card.css
git commit -m "feat: animate Jericho scene ring pulse and tilt-reactive house glow"
```

---

### Task 4: TulipVision mascot (static, wired in)

**Files:**
- Modify: `src/components/MascotArt.jsx`
- Modify: `src/data/cards.js:69` (tulip entry)
- Modify: `src/components/FullArtScenes.jsx`

**Interfaces:**
- Produces: `TulipMascot({ className })`, added to `MASCOTS` as `tulip`.
- Consumes: same `MascotArt`/`MASCOTS` shape from Task 1.

- [ ] **Step 1: Add the `mascot` field to the TulipVision project entry**

In `src/data/cards.js`, find the `tulip` entry and add `mascot: 'tulip'`:

```js
stage: 'Stage 2 · Deployed', hp: 2779, hpMetric: 'loc', icon: '🌷', mascot: 'tulip',
```

- [ ] **Step 2: Add the TulipMascot component**

In `src/components/MascotArt.jsx`, add after `JerichoMascot`:

```jsx
export function TulipMascot({ className = '' }) {
  return (
    <svg
      className={`mascot mascot-tulip ${className}`}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="TulipVision bloom-scanner mascot"
    >
      <path className="tulip-m-stem" d="M50 95 L50 60" />
      <path className="tulip-m-leaf tulip-m-leaf-l" d="M50 82 Q30 78 26 62 Q42 66 50 82Z" />
      <path className="tulip-m-leaf tulip-m-leaf-r" d="M50 82 Q70 78 74 62 Q58 66 50 82Z" />
      <g className="tulip-m-bloom">
        <path className="tulip-m-petal tulip-m-petal-l" d="M50 60 Q20 55 26 28 Q42 34 50 60Z" />
        <path className="tulip-m-petal tulip-m-petal-r" d="M50 60 Q80 55 74 28 Q58 34 50 60Z" />
        <path className="tulip-m-petal tulip-m-petal-c" d="M46 60 Q46 20 50 14 Q54 20 54 60Z" />
        <circle className="tulip-m-lens-outer" cx="50" cy="42" r="11" />
        <circle className="tulip-m-lens-iris" cx="50" cy="42" r="6" />
        <circle className="tulip-m-lens-pupil" cx="50" cy="42" r="2.4" />
      </g>
    </svg>
  );
}
```

Update the registry:

```js
export const MASCOTS = {
  jericho: JerichoMascot,
  tulip: TulipMascot,
};
```

- [ ] **Step 3: Wire the mascot into the TulipVision scene, replacing the foreground tulip glyphs**

In `src/components/FullArtScenes.jsx`, add `TulipMascot` to the import:

```js
import { JerichoMascot, TulipMascot } from './MascotArt.jsx';
```

Inside `TulipVisionScene()`, replace the foreground-tulip render block:

```jsx
      {TULIP_FOREGROUND.map((t, i) => (
        <span
          key={`fg-${i}`}
          className="tulip-glyph"
          style={{ left: t.left, bottom: t.bottom, fontSize: t.size }}
        >🌷</span>
      ))}
```

with:

```jsx
      {TULIP_FOREGROUND.map((t, i) => (
        <div
          key={`fg-${i}`}
          className="tulip-mascot-slot"
          style={{ left: t.left, bottom: t.bottom, width: t.size * 1.6, height: t.size * 1.6 }}
        >
          <TulipMascot />
        </div>
      ))}
```

(Background tulip glyphs — `TULIP_BACKGROUND` — stay as plain 🌷 emoji; they're depth-filler, not the mascot subject. Only the 5 foreground tulips, which carry the detection annotations, become the mascot.)

Add the new `.tulip-mascot-slot` positioning rule to `src/styles/card.css`, right after the existing `.art-bg.scene-tulip .tulip-glyph` rule:

```css
.art-bg.scene-tulip .tulip-mascot-slot{ position:absolute; filter:drop-shadow(0 3px 6px rgba(0,0,0,.5)); }
.art-bg.scene-tulip .tulip-mascot-slot .mascot{ width:100%; height:100%; display:block; }
```

- [ ] **Step 4: Verify the build compiles**

Run: `npm run build`
Expected: build succeeds with no errors.

- [ ] **Step 5: Verify visually**

Confirm the 5 foreground tulips on the TulipVision card now render as the bloom-with-lens-eye mascot shape (static for now), sized/positioned the same as the emoji they replaced, with the 3 detection boxes still correctly framing 3 of them.

- [ ] **Step 6: Commit**

```bash
git add src/components/MascotArt.jsx src/components/FullArtScenes.jsx src/styles/card.css src/data/cards.js
git commit -m "feat: add TulipVision bloom-scanner mascot, replacing foreground tulip emoji"
```

---

### Task 5: TulipVision mascot idle + hover/scan animation

**Files:**
- Modify: `src/styles/mascot.css`

**Interfaces:**
- Consumes: class names from Task 4 (`mascot-tulip`, `tulip-m-bloom`, `tulip-m-petal`, `tulip-m-lens-outer`, `tulip-m-lens-iris`, `tulip-m-lens-pupil`, `tulip-m-leaf`, `tulip-m-stem`).

- [ ] **Step 1: Add TulipVision mascot styles and animation to `mascot.css`**

Append to `src/styles/mascot.css`:

```css
/* ---- TulipVision: bloom-scanner ---- */
.tulip-m-stem, .tulip-m-leaf{ fill: none; stroke: #1f8f6a; stroke-width: 2; stroke-linejoin: round; }
.tulip-m-leaf{ fill: rgba(31,143,106,.35); }
.tulip-m-petal{ fill: rgba(255,182,214,.55); stroke: #ffb6d6; stroke-width: 1.2; stroke-linejoin: round; }
.tulip-m-lens-outer{ fill: rgba(10,20,25,.55); stroke: #7CFFB2; stroke-width: 1.6; }
.tulip-m-lens-iris{ fill: #159487; transition: r .25s ease; transform-origin: 50px 42px; }
.tulip-m-lens-pupil{ fill: #0a2b16; }

.tulip-m-bloom{
  transform-origin: 50px 60px;
  animation: tulip-m-sway 5s ease-in-out infinite;
}
@keyframes tulip-m-sway{
  0%, 100%{ transform: rotate(-2deg); }
  50%{ transform: rotate(2deg); }
}
.tulip-m-lens-outer{ animation: tulip-m-lens-pulse 3.5s ease-in-out infinite; }
@keyframes tulip-m-lens-pulse{
  0%, 100%{ opacity:.75; }
  50%{ opacity:1; }
}

/* hover/tilt -> lens "focuses" (iris contracts), outer ring glows */
.tcg-card:hover .tulip-m-lens-iris, .tcg-card.tilting .tulip-m-lens-iris{ r: 4; }
.tcg-card:hover .tulip-m-lens-outer, .tcg-card.tilting .tulip-m-lens-outer{
  stroke: #b6ffd6; filter: drop-shadow(0 0 5px rgba(124,255,178,.7));
}

@media (prefers-reduced-motion: reduce){
  .tulip-m-bloom, .tulip-m-lens-outer{ animation: none; }
}
```

- [ ] **Step 2: Verify the build compiles**

Run: `npm run build`
Expected: build succeeds with no errors.

- [ ] **Step 3: Verify visually**

Confirm each TulipVision mascot sways gently and its lens pulses continuously, and hovering/tilting the card contracts the iris (focus) and brightens the lens ring — reads as the flower "scanning."

- [ ] **Step 4: Commit**

```bash
git add src/styles/mascot.css
git commit -m "feat: animate TulipVision mascot sway and lens-focus hover state"
```

---

### Task 6: TulipVision scene motion — Pokédex-style scan/lock cycle

**Files:**
- Modify: `src/components/FullArtScenes.jsx`
- Modify: `src/styles/card.css`

**Interfaces:**
- Consumes: existing `TULIP_DETECTIONS` array (3 entries, tiers `high`/`mid`/`low`) and existing `.tulip-box`/`.tulip-conf` classes.
- Produces: a cycling "active" detection index, advanced on an interval, exposed via a `useState`/`useEffect` inside `TulipVisionScene`.

- [ ] **Step 1: Add scan-cycle state to `TulipVisionScene`**

In `src/components/FullArtScenes.jsx`, add `useState`/`useEffect` to the imports:

```js
import { Fragment, useEffect, useState } from 'react';
```

Replace the `TulipVisionScene` function body's opening to add cycling state:

```jsx
function TulipVisionScene() {
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActiveIdx((i) => (i + 1) % TULIP_DETECTIONS.length);
    }, 2800);
    return () => clearInterval(id);
  }, []);

  return (
```

- [ ] **Step 2: Mark the active detection and add a scan-line sweep**

Replace the `TULIP_DETECTIONS.map` block:

```jsx
      {TULIP_DETECTIONS.map((d) => (
        <Fragment key={d.tier}>
          <div
            className={`tulip-box tulip-box-${d.tier}`}
            style={{ left: d.left, bottom: d.bottom, width: d.width, height: d.height }}
          />
          <div
            className={`tulip-conf tulip-conf-${d.tier}`}
            style={{ left: d.left, bottom: `calc(${d.bottom} + ${d.height + 1}px)` }}
          >R-CNN {d.pct}%</div>
        </Fragment>
      ))}
```

with:

```jsx
      {TULIP_DETECTIONS.map((d, i) => (
        <Fragment key={d.tier}>
          <div
            className={`tulip-box tulip-box-${d.tier} ${i === activeIdx ? 'tulip-box-active' : ''}`}
            style={{ left: d.left, bottom: d.bottom, width: d.width, height: d.height }}
          >
            {i === activeIdx && <div className="tulip-box-scanline" />}
          </div>
          <div
            className={`tulip-conf tulip-conf-${d.tier} ${i === activeIdx ? 'tulip-conf-active' : ''}`}
            style={{ left: d.left, bottom: `calc(${d.bottom} + ${d.height + 1}px)` }}
          >R-CNN {d.pct}%</div>
        </Fragment>
      ))}
```

- [ ] **Step 3: Add corner-bracket reticle, scan-line, and lock-flash CSS**

In `src/styles/card.css`, replace the existing static box rules:

```css
.tulip-box{position:absolute;border-radius:2px;}
.tulip-box-high{border:1.5px solid #7CFFB2;box-shadow:0 0 6px rgba(124,255,178,.4);}
.tulip-box-mid{border:1.5px solid #ffd166;box-shadow:0 0 6px rgba(255,209,102,.35);}
.tulip-box-low{border:1.5px dashed rgba(255,182,214,.55);}
```

with a reticle version (corner brackets via layered gradients, inactive boxes dim, active box "locks"):

```css
.tulip-box{
  position:absolute;border-radius:2px;overflow:visible;
  opacity:.35; transition: opacity .3s ease;
}
.tulip-box-high{box-shadow:0 0 6px rgba(124,255,178,.4);}
.tulip-box-mid{box-shadow:0 0 6px rgba(255,209,102,.35);}
.tulip-box-low{box-shadow:0 0 6px rgba(255,182,214,.3);}
.tulip-box::before, .tulip-box::after{
  content:''; position:absolute; width:8px; height:8px; border-style:solid; border-width:0;
}
.tulip-box-high::before, .tulip-box-high::after{ border-color:#7CFFB2; }
.tulip-box-mid::before, .tulip-box-mid::after{ border-color:#ffd166; }
.tulip-box-low::before, .tulip-box-low::after{ border-color:rgba(255,182,214,.75); }
.tulip-box::before{ top:-1.5px; left:-1.5px; border-top-width:2px; border-left-width:2px; }
.tulip-box::after{ bottom:-1.5px; right:-1.5px; border-bottom-width:2px; border-right-width:2px; }
.tulip-box-active{ opacity:1; animation: tulip-box-lock .5s ease; }
@keyframes tulip-box-lock{
  0%{ transform: scale(1.3); }
  100%{ transform: scale(1); }
}
.tulip-box-scanline{
  position:absolute; left:0; right:0; height:2px; top:0;
  background: linear-gradient(90deg, transparent, #eaffef, transparent);
  animation: tulip-scanline-sweep .5s ease-out;
}
@keyframes tulip-scanline-sweep{
  0%{ top:0; opacity:1; }
  100%{ top:100%; opacity:0; }
}
.tulip-conf{ opacity:0; transition: opacity .2s ease; }
.tulip-conf-active{ opacity:1; animation: tulip-conf-flash .4s ease .3s both; }
@keyframes tulip-conf-flash{
  0%{ transform: scale(1.4); filter: brightness(1.8); }
  100%{ transform: scale(1); filter: brightness(1); }
}

@media (prefers-reduced-motion: reduce){
  .tulip-box{ opacity:.7; }
  .tulip-box-active{ animation:none; }
  .tulip-box-scanline{ display:none; }
  .tulip-conf{ opacity:.9; }
  .tulip-conf-active{ animation:none; }
}
```

- [ ] **Step 4: Verify the build compiles**

Run: `npm run build`
Expected: build succeeds with no errors.

- [ ] **Step 5: Verify visually**

Confirm the three detection boxes now show corner-bracket reticles (dim when inactive), and every ~2.8s a new box "locks" — scale-pops in, a scan-line sweeps through it, and its confidence-% label flashes in — cycling through all three tiers in sequence, independent of the mascot's own idle sway underneath.

- [ ] **Step 6: Commit**

```bash
git add src/components/FullArtScenes.jsx src/styles/card.css
git commit -m "feat: add Pokedex-style scan/lock cycle to TulipVision detection boxes"
```

---

### Task 7: Severe Weather mascot (static, wired in)

**Files:**
- Modify: `src/components/MascotArt.jsx`
- Modify: `src/data/cards.js:53` (impala entry)
- Modify: `src/components/FullArtScenes.jsx`

**Interfaces:**
- Produces: `ImpalaMascot({ className })`, added to `MASCOTS` as `impala`.

- [ ] **Step 1: Add the `mascot` field to the Severe Weather project entry**

In `src/data/cards.js`, find the `impala` entry and add `mascot: 'impala'`:

```js
stage: 'Stage 1 · Internship', hp: 650, hpMetric: 'hours', icon: '🌡️', mascot: 'impala',
```

- [ ] **Step 2: Add the ImpalaMascot component (split heat/cold fox)**

In `src/components/MascotArt.jsx`, add after `TulipMascot`:

```jsx
export function ImpalaMascot({ className = '' }) {
  return (
    <svg
      className={`mascot mascot-impala ${className}`}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Severe Weather heat/cold sentinel mascot"
    >
      <clipPath id="impala-m-split-left"><rect x="0" y="0" width="50" height="100" /></clipPath>
      <clipPath id="impala-m-split-right"><rect x="50" y="0" width="50" height="100" /></clipPath>
      <g className="impala-m-heat" clipPath="url(#impala-m-split-left)">
        <path className="impala-m-tail impala-m-tail-heat" d="M26 66 Q6 60 10 40 Q22 46 26 66Z" />
        <ellipse className="impala-m-torso impala-m-torso-heat" cx="50" cy="60" rx="26" ry="20" />
        <circle className="impala-m-head impala-m-head-heat" cx="50" cy="34" r="16" />
        <polygon className="impala-m-ear impala-m-ear-heat" points="38,24 30,6 46,18" />
      </g>
      <g className="impala-m-cold" clipPath="url(#impala-m-split-right)">
        <path className="impala-m-tail impala-m-tail-cold" d="M74 66 Q94 60 90 40 Q78 46 74 66Z" />
        <ellipse className="impala-m-torso impala-m-torso-cold" cx="50" cy="60" rx="26" ry="20" />
        <circle className="impala-m-head impala-m-head-cold" cx="50" cy="34" r="16" />
        <polygon className="impala-m-ear impala-m-ear-cold" points="62,24 70,6 54,18" />
      </g>
      <circle className="impala-m-eye" cx="44" cy="34" r="2" />
      <circle className="impala-m-eye" cx="56" cy="34" r="2" />
    </svg>
  );
}
```

Update the registry:

```js
export const MASCOTS = {
  jericho: JerichoMascot,
  tulip: TulipMascot,
  impala: ImpalaMascot,
};
```

- [ ] **Step 3: Wire the mascot into the Severe Weather scene**

In `src/components/FullArtScenes.jsx`, add `ImpalaMascot` to the import:

```js
import { JerichoMascot, TulipMascot, ImpalaMascot } from './MascotArt.jsx';
```

Inside `SevereWeatherScene()`, replace this line:

```jsx
      <span className="impala-snowflake">❄️</span>
```

with a mascot slot placed centered where the snowflake glyph currently sits, keeping the snowflake as ambient decoration (it's cold-side atmosphere, not the mascot itself — the mascot is a new centered element):

```jsx
      <span className="impala-snowflake">❄️</span>
      <div className="impala-mascot-slot">
        <ImpalaMascot />
      </div>
```

Add the positioning rule to `src/styles/card.css`, after the existing `.impala-icing2` rule:

```css
.impala-mascot-slot{
  position:absolute; left:50%; bottom:18%; width:110px; height:110px; transform:translateX(-50%);
  filter: drop-shadow(0 6px 14px rgba(0,0,0,.5));
}
.impala-mascot-slot .mascot{ width:100%; height:100%; display:block; }
```

- [ ] **Step 4: Verify the build compiles**

Run: `npm run build`
Expected: build succeeds with no errors.

- [ ] **Step 5: Verify visually**

Confirm the Severe Weather card now shows a centered fox-shaped mascot straddling the heat/cold split, static for now, with its left half over the orange heat side and right half over the blue cold side.

- [ ] **Step 6: Commit**

```bash
git add src/components/MascotArt.jsx src/components/FullArtScenes.jsx src/styles/card.css src/data/cards.js
git commit -m "feat: add Severe Weather split heat/cold sentinel mascot"
```

---

### Task 8: Severe Weather mascot idle + hover animation

**Files:**
- Modify: `src/styles/mascot.css`

**Interfaces:**
- Consumes: class names from Task 7 (`mascot-impala`, `impala-m-heat`/`impala-m-cold`, `impala-m-torso-heat`/`-cold`, `impala-m-head-heat`/`-cold`, `impala-m-ear-heat`/`-cold`, `impala-m-tail-heat`/`-cold`, `impala-m-eye`).

- [ ] **Step 1: Add Severe Weather mascot styles and animation to `mascot.css`**

Append to `src/styles/mascot.css`:

```css
/* ---- Severe Weather: split heat/cold sentinel ---- */
.impala-m-torso-heat, .impala-m-head-heat{ fill: rgba(230,121,31,.4); stroke: #ffb648; stroke-width: 1.4; }
.impala-m-ear-heat, .impala-m-tail-heat{ fill: rgba(230,121,31,.5); stroke: #ffb648; stroke-width: 1.2; }
.impala-m-torso-cold, .impala-m-head-cold{ fill: rgba(28,63,107,.45); stroke: #cfe6ff; stroke-width: 1.4; }
.impala-m-ear-cold, .impala-m-tail-cold{ fill: rgba(28,63,107,.55); stroke: #cfe6ff; stroke-width: 1.2; }
.impala-m-eye{ fill: #1a1608; }

.mascot-impala{ animation: impala-m-bob 4.5s ease-in-out infinite; transform-origin: 50% 60%; }
@keyframes impala-m-bob{
  0%, 100%{ transform: translateY(0); }
  50%{ transform: translateY(-2.5px); }
}
.impala-m-tail-heat, .impala-m-tail-cold{ transform-origin: 20px 66px; }

.tcg-card:hover .impala-m-ear-heat, .tcg-card.tilting .impala-m-ear-heat{ animation: impala-m-ear-flick .35s ease; }
.tcg-card:hover .impala-m-ear-cold, .tcg-card.tilting .impala-m-ear-cold{ animation: impala-m-ear-flick .35s ease .05s; }
.tcg-card:hover .impala-m-tail-heat, .tcg-card.tilting .impala-m-tail-heat{ animation: impala-m-tail-flick .5s ease; }
.tcg-card:hover .impala-m-tail-cold, .tcg-card.tilting .impala-m-tail-cold{ animation: impala-m-tail-flick .5s ease .05s; }
@keyframes impala-m-ear-flick{
  0%{ transform: rotate(0deg); }
  50%{ transform: rotate(-8deg); }
  100%{ transform: rotate(0deg); }
}
@keyframes impala-m-tail-flick{
  0%{ transform: rotate(0deg); }
  50%{ transform: rotate(6deg); }
  100%{ transform: rotate(0deg); }
}

@media (prefers-reduced-motion: reduce){
  .mascot-impala{ animation: none; }
  .tcg-card:hover .impala-m-ear-heat, .tcg-card.tilting .impala-m-ear-heat,
  .tcg-card:hover .impala-m-ear-cold, .tcg-card.tilting .impala-m-ear-cold,
  .tcg-card:hover .impala-m-tail-heat, .tcg-card.tilting .impala-m-tail-heat,
  .tcg-card:hover .impala-m-tail-cold, .tcg-card.tilting .impala-m-tail-cold{ animation: none; }
}
```

- [ ] **Step 2: Verify the build compiles**

Run: `npm run build`
Expected: build succeeds with no errors.

- [ ] **Step 3: Verify visually**

Confirm the Severe Weather mascot bobs gently, and hovering/tilting the card triggers a quick ear-flick and tail-flick on both halves simultaneously.

- [ ] **Step 4: Commit**

```bash
git add src/styles/mascot.css
git commit -m "feat: animate Severe Weather mascot idle bob and hover flick"
```

---

### Task 9: Severe Weather scene motion (wind/shimmer drift, icing flicker)

**Files:**
- Modify: `src/styles/card.css`

**Interfaces:**
- Consumes: existing scene classes `impala-wind`, `impala-shimmer`, `impala-crystal-a`/`-b`, `impala-icing`/`impala-icing2`.

- [ ] **Step 1: Add drift/flicker keyframes**

In `src/styles/card.css`, replace:

```css
.impala-wind{position:absolute;left:6%;top:44%;width:42%;}
.impala-wind path{fill:none;stroke:#ffe9c8;stroke-width:2.5;stroke-linecap:round;opacity:.75;}
.impala-shimmer{position:absolute;left:8%;bottom:8%;width:34%;opacity:.4;}
.impala-shimmer path{fill:none;stroke:#ffe9c8;stroke-width:1.5;stroke-linecap:round;}
```

with:

```css
.impala-wind{position:absolute;left:6%;top:44%;width:42%;animation: impala-wind-drift 6s ease-in-out infinite;}
.impala-wind path{fill:none;stroke:#ffe9c8;stroke-width:2.5;stroke-linecap:round;opacity:.75;}
@keyframes impala-wind-drift{
  0%, 100%{ transform: translateX(0); }
  50%{ transform: translateX(6px); }
}
.impala-shimmer{position:absolute;left:8%;bottom:8%;width:34%;animation: impala-shimmer-pulse 3s ease-in-out infinite;}
.impala-shimmer path{fill:none;stroke:#ffe9c8;stroke-width:1.5;stroke-linecap:round;}
@keyframes impala-shimmer-pulse{
  0%, 100%{ opacity:.25; }
  50%{ opacity:.55; }
}
```

Replace:

```css
.art-bg.scene-impala .impala-crystal{
  position:absolute;color:#cfe6ff;text-shadow:0 0 6px rgba(160,210,255,.6);
  filter:drop-shadow(0 2px 4px rgba(0,0,0,.35));
}
.impala-crystal-a{right:6%;top:46%;font-size:16px;opacity:.65;}
.impala-crystal-b{right:22%;top:62%;font-size:12px;opacity:.5;}
```

with:

```css
.art-bg.scene-impala .impala-crystal{
  position:absolute;color:#cfe6ff;text-shadow:0 0 6px rgba(160,210,255,.6);
  filter:drop-shadow(0 2px 4px rgba(0,0,0,.35));
  animation: impala-crystal-twinkle 4s ease-in-out infinite;
}
.impala-crystal-a{right:6%;top:46%;font-size:16px;}
.impala-crystal-b{right:22%;top:62%;font-size:12px;animation-delay:1.3s;}
@keyframes impala-crystal-twinkle{
  0%, 100%{ opacity:.5; transform: rotate(0deg); }
  50%{ opacity:.9; transform: rotate(8deg); }
}
```

Replace:

```css
.impala-icing{
  position:absolute;right:0;top:0;bottom:0;width:14%;
  background:linear-gradient(90deg, transparent, rgba(200,230,255,.28));
  -webkit-mask-image:repeating-linear-gradient(0deg, #000 0 10px, transparent 10px 16px);
  mask-image:repeating-linear-gradient(0deg, #000 0 10px, transparent 10px 16px);
}
```

with:

```css
.impala-icing{
  position:absolute;right:0;top:0;bottom:0;width:14%;
  background:linear-gradient(90deg, transparent, rgba(200,230,255,.28));
  -webkit-mask-image:repeating-linear-gradient(0deg, #000 0 10px, transparent 10px 16px);
  mask-image:repeating-linear-gradient(0deg, #000 0 10px, transparent 10px 16px);
  animation: impala-icing-flicker 5s ease-in-out infinite;
}
@keyframes impala-icing-flicker{
  0%, 100%{ opacity:.85; }
  50%{ opacity:1; }
}
```

- [ ] **Step 2: Add reduced-motion overrides**

Append to `src/styles/card.css`'s `prefers-reduced-motion` block (or create one if this is the first scene-motion task to reach this file in isolation — by this point in the plan the block already exists from Task 3, so append inside it):

```css
  .impala-wind, .impala-shimmer, .impala-crystal, .impala-icing{ animation: none; }
```

- [ ] **Step 3: Verify the build compiles**

Run: `npm run build`
Expected: build succeeds with no errors.

- [ ] **Step 4: Verify visually**

Confirm the wind-gust lines drift side to side, the shimmer lines pulse opacity, the two ice crystals twinkle/rotate slightly, and the icing texture flickers gently — the whole right (cold) half no longer looks static.

- [ ] **Step 5: Commit**

```bash
git add src/styles/card.css
git commit -m "feat: animate Severe Weather scene wind, shimmer, crystal, and icing layers"
```

---

### Task 10: Pause off-screen scene/mascot animation (IntersectionObserver) + mobile particle reduction

**Files:**
- Create: `src/hooks/useInViewAnimation.js`
- Modify: `src/components/Card.jsx`
- Modify: `src/styles/card.css`
- Modify: `src/styles/mascot.css`

**Interfaces:**
- Produces: `useInViewAnimation()` — returns `[ref, inView]`, where `ref` attaches to the observed element and `inView` is a boolean.
- Consumes (in `Card.jsx`): attaches the ref to the `.tcg-card` element (the existing `ref` there is already used for tilt; this task adds a second, separate ref via a wrapping check — see Step 2) and toggles a `scene-paused` class when `!inView`.

- [ ] **Step 1: Create the IntersectionObserver hook**

Create `src/hooks/useInViewAnimation.js`:

```js
// src/hooks/useInViewAnimation.js
// Tracks whether an element is within (or near) the viewport, so callers
// can pause CSS animations on off-screen cards for mobile/scroll performance.
import { useEffect, useRef, useState } from 'react';

export function useInViewAnimation() {
  const ref = useRef(null);
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: '200px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, inView];
}
```

- [ ] **Step 2: Wire the hook into `Card.jsx`**

In `src/components/Card.jsx`, add the import:

```js
import { useInViewAnimation } from '../hooks/useInViewAnimation.js';
```

Inside the `Card` component function, alongside the existing `const ref = useRef(null);`, add:

```js
  const [inViewRef, inView] = useInViewAnimation();
```

Update the outer `motion.div` (the `tcg-card-wrap`) to attach `inViewRef`:

```jsx
    <motion.div
      ref={inViewRef}
      className="tcg-card-wrap"
```

Update the inner card `div`'s className to include the pause class when out of view:

```jsx
        className={`tcg-card rarity-${project.rarity} ${!inView ? 'scene-paused' : ''}`}
```

- [ ] **Step 3: Add `.scene-paused` overrides**

In `src/styles/card.css`, add (near the top, after the `.tcg-card` base rules):

```css
/* IntersectionObserver-driven pause for off-screen cards */
.tcg-card.scene-paused .jericho-ring-1, .tcg-card.scene-paused .jericho-ring-2, .tcg-card.scene-paused .jericho-ring-3,
.tcg-card.scene-paused .impala-wind, .tcg-card.scene-paused .impala-shimmer,
.tcg-card.scene-paused .impala-crystal, .tcg-card.scene-paused .impala-icing,
.tcg-card.scene-paused .tulip-box-scanline{
  animation-play-state: paused;
}
```

In `src/styles/mascot.css`, add at the top:

```css
.tcg-card.scene-paused .mascot-jericho,
.tcg-card.scene-paused .tulip-m-bloom, .tcg-card.scene-paused .tulip-m-lens-outer,
.tcg-card.scene-paused .mascot-impala{
  animation-play-state: paused;
}
```

- [ ] **Step 4: Verify the build compiles**

Run: `npm run build`
Expected: build succeeds with no errors.

- [ ] **Step 5: Reduce particle/layer count under the existing mobile breakpoint**

`src/styles/layout.css:109` already gates mobile layout at `@media (max-width:640px)`. Add a matching block to `src/styles/card.css` that thins out the highest-particle-count layers on mobile — the star field, the background tulip glyphs, and the ice-crystal pair — while keeping every layer that carries actual information (mascot, detection boxes, rings):

```css
@media (max-width:640px){
  .jericho-stars{
    background-image:radial-gradient(1.5px 1.5px at 20% 18%, #fff, transparent),
      radial-gradient(1px 1px at 42% 25%, #fff, transparent);
  }
  .art-bg.scene-tulip .tulip-glyph:nth-child(n+6){ display:none; }
  .impala-crystal-b{ display:none; }
}
```

(`.tulip-glyph:nth-child(n+6)` relies on the background tulips being the first-rendered glyphs in `TulipVisionScene`'s markup, which they are — `TULIP_BACKGROUND` maps before `TULIP_FOREGROUND`/the mascot slots. This keeps all 5 foreground mascots and drops roughly half the background depth-filler on narrow viewports.)

- [ ] **Step 6: Verify visually**

In the dev server with the gallery view, scroll the three flagship cards out of view and back in (use browser dev tools or resize to trigger scroll) — confirm animation halts while off-screen and resumes when scrolled back in. Confirm no visual jump/flash on resume. Then resize the viewport below 640px width and confirm the star field, background tulip count, and one ice crystal thin out while the mascots and detection boxes remain fully present.

- [ ] **Step 7: Commit**

```bash
git add src/hooks/useInViewAnimation.js src/components/Card.jsx src/styles/card.css src/styles/mascot.css
git commit -m "feat: pause off-screen animation and reduce particle counts on mobile"
```

---

### Task 11: "Who's That Dev?" reveal component

**Files:**
- Create: `src/components/IntroReveal.jsx`
- Create: `src/assets/fred-photo.jpg` (placeholder)
- Modify: `src/styles/layout.css`

**Interfaces:**
- Produces: `IntroReveal({ onDone })` default export — self-contained component managing its own play/skip/replay state via `sessionStorage`. Exposes no external API beyond mounting; a later task adds a way to trigger replay from outside (Task 12).
- Actually: to support external replay-on-click (Task 12 requirement), `IntroReveal` accepts a `replayKey` prop (any value that changes to trigger a fresh play) instead of managing replay internally.

- [ ] **Step 1: Create a placeholder photo asset**

Create `src/assets/fred-photo.jpg` — since a placeholder binary can't be authored as text, use a simple solid-color placeholder: create the file as an SVG instead of a JPG, so it can be written as plain text and swapped for a real JPG later without code changes (the `<img>` element in Step 2 works with any raster/vector image format at the same import path once Fred supplies `fred-photo.jpg` and the import is updated to match its extension).

Create `src/assets/fred-photo-placeholder.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300">
  <rect width="300" height="300" fill="#2a2c55"/>
  <circle cx="150" cy="120" r="55" fill="#4a4d8a"/>
  <path d="M60 280 Q150 190 240 280 Z" fill="#4a4d8a"/>
  <text x="150" y="160" font-family="sans-serif" font-size="14" fill="#cfd4e4" text-anchor="middle">placeholder — swap for real photo</text>
</svg>
```

(This is the pending asset called out in the spec's Decision 3.4. When Fred supplies the real photo, replace this file's import in `IntroReveal.jsx` — Step 2 below — with the real filename; no other code changes needed.)

- [ ] **Step 2: Create the `IntroReveal` component**

Create `src/components/IntroReveal.jsx`:

```jsx
// src/components/IntroReveal.jsx
// "Who's That Dev?" reveal — the anime "Who's That Pokemon?" intermission,
// re-skinned. Plays once per session (sessionStorage-gated by the parent
// via `autoplay`), and replays whenever `replayKey` changes.
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import fredPhoto from '../assets/fred-photo-placeholder.svg';

const SESSION_KEY = 'fredtcg_intro_seen';

export default function IntroReveal({ replayKey = 0 }) {
  const [phase, setPhase] = useState('silhouette'); // 'silhouette' | 'revealed'
  const [playing, setPlaying] = useState(() => !sessionStorage.getItem(SESSION_KEY));

  useEffect(() => {
    if (replayKey === 0) return;
    setPhase('silhouette');
    setPlaying(true);
  }, [replayKey]);

  useEffect(() => {
    if (!playing) return;
    const timer = setTimeout(() => {
      setPhase('revealed');
      sessionStorage.setItem(SESSION_KEY, '1');
    }, 1300);
    return () => clearTimeout(timer);
  }, [playing]);

  function skip() {
    setPhase('revealed');
    sessionStorage.setItem(SESSION_KEY, '1');
    setPlaying(false);
  }

  const resolved = !playing || phase === 'revealed';

  return (
    <div
      className="intro-reveal"
      onClick={playing && phase === 'silhouette' ? skip : undefined}
      role={playing && phase === 'silhouette' ? 'button' : undefined}
      tabIndex={playing && phase === 'silhouette' ? 0 : undefined}
      onKeyDown={playing && phase === 'silhouette' ? (e) => e.key === 'Enter' && skip() : undefined}
    >
      <AnimatePresence mode="wait">
        {!resolved ? (
          <motion.div
            key="silhouette"
            className="intro-reveal-photo intro-reveal-silhouette"
            style={{ backgroundImage: `url(${fredPhoto})` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        ) : (
          <motion.div
            key="revealed"
            className="intro-reveal-photo intro-reveal-color"
            style={{ backgroundImage: `url(${fredPhoto})` }}
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35 }}
          />
        )}
      </AnimatePresence>
      <div className="intro-reveal-caption">
        {resolved ? 'It\'s Fred!' : "Who's that Dev?"}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Add reveal styles**

Append to `src/styles/layout.css`:

```css
/* ---- Who's That Dev? reveal ---- */
.intro-reveal{
  position:relative; width:150px; height:150px; border-radius:18px; overflow:hidden;
  box-shadow:0 0 0 4px #0e1016, 0 0 0 6px var(--gold);
  cursor:pointer;
}
.intro-reveal-photo{
  position:absolute; inset:0; background-size:cover; background-position:center;
}
.intro-reveal-silhouette{ filter: brightness(0) saturate(100%); }
.intro-reveal-color{ filter:none; }
.intro-reveal-caption{
  position:absolute; left:0; right:0; bottom:0;
  background:linear-gradient(0deg, rgba(6,6,10,.9), transparent);
  color:#f4ead0; font-family:'Baloo 2'; font-weight:800; font-size:11px;
  text-align:center; padding:6px 4px 5px; letter-spacing:.02em;
}

@media (prefers-reduced-motion: reduce){
  .intro-reveal-photo{ transition:none; }
}
```

- [ ] **Step 4: Verify the build compiles**

Run: `npm run build`
Expected: build succeeds with no errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/IntroReveal.jsx src/assets/fred-photo-placeholder.svg src/styles/layout.css
git commit -m "feat: add Who's That Dev? silhouette reveal component"
```

---

### Task 12: Mount the reveal in the hero, replacing the letter-monogram avatar

**Files:**
- Modify: `src/views/GalleryView.jsx`

**Interfaces:**
- Consumes: `IntroReveal` from Task 11 (`replayKey` prop).

- [ ] **Step 1: Replace the avatar markup with `IntroReveal`**

In `src/views/GalleryView.jsx`, add the import at the top:

```js
import { useState } from 'react';
import IntroReveal from '../components/IntroReveal.jsx';
```

Add state inside `GalleryView`, alongside the existing `const active = ...` line:

```js
  const [replayKey, setReplayKey] = useState(0);
```

Replace:

```jsx
        <div className="avatar"><span>MF</span></div>
```

with:

```jsx
        <div onClick={() => setReplayKey((k) => k + 1)}>
          <IntroReveal replayKey={replayKey} />
        </div>
```

- [ ] **Step 2: Verify the build compiles**

Run: `npm run build`
Expected: build succeeds with no errors.

- [ ] **Step 3: Verify visually**

In the dev server, load the gallery view fresh (clear sessionStorage or open a private window) — confirm the silhouette + "Who's that Dev?" caption shows, then flips to the placeholder photo + "It's Fred!" after ~1.3s. Reload the page in the same session — confirm it does NOT replay (shows the resolved photo immediately). Click the avatar — confirm it replays the full silhouette-to-reveal sequence. Click/tap during the silhouette phase — confirm it skips straight to resolved.

- [ ] **Step 4: Commit**

```bash
git add src/views/GalleryView.jsx
git commit -m "feat: mount Who's That Dev? reveal in hero, replacing MF letter avatar"
```

---

## Post-plan note for Fred

When the real photo is ready: drop it in as `src/assets/fred-photo.jpg` (or `.png`), then in `src/components/IntroReveal.jsx` change the import line from `'../assets/fred-photo-placeholder.svg'` to the new filename. No other changes needed — the component doesn't care about the underlying format.
