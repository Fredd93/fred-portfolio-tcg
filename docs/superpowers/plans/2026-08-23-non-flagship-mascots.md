# Non-Flagship Mascot Pass Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the emoji `icon` on all 9 non-flagship project cards with bespoke lenticular SVG mascots (3 tilt-swapped frames each), per `docs/superpowers/specs/2026-08-23-non-flagship-mascots-design.md`.

**Architecture:** Each mascot is 3 complete, self-contained `<svg>` "frames" (idle / mid-tilt / full-tilt) wrapped in a `.mascot-frames` container, registered in the existing `MascotArt.jsx` registry (extending the `MASCOTS` map used by the flagship mascots). `Card.jsx`'s existing `writeTilt()` — already called from every mouse-move/touch-move/device-orientation event — gains one extra write: a `data-tilt-frame` (`"0"|"1"|"2"`) attribute derived from tilt magnitude. Pure CSS shows/hides the matching frame. No new JS event plumbing; no animation library beyond what's already used (CSS `opacity`/`filter` transitions).

**Tech Stack:** React 19, plain CSS (`src/styles/mascot.css`), inline SVG. No test framework in this project — verification is `npm run build` (catches syntax/import errors) plus manual browser check via the dev server for each task.

## Global Constraints

- No new npm dependencies.
- Mascots 1:1-replace the emoji `<span>{project.icon}</span>` inside the existing classic-layout `.art` box (`src/components/Card.jsx`) — same size/position, no `.art` box redesign (per spec Section 3).
- `project.icon` fields stay in `cards.js` as a fallback (unused once `project.mascot` is set) — do not delete them.
- Frame selection is driven by `data-tilt-frame` on `.tcg-card`, written by `Card.jsx`'s `writeTilt()`; `handleLeave()` resets it to `"0"`.
- `prefers-reduced-motion: reduce` pins every card to frame 0 via CSS, regardless of `data-tilt-frame` value.
- Each mascot's accent/glow details use `var(--type-color)` (already set as an inline CSS custom property on `.tcg-card`) so the mascot ties into the project's existing type-color accent language; body/base colors are creature-appropriate, not forced to the type color.
- `CardModal.jsx`'s icon display and full-art scene work are out of scope — untouched by this plan.

---

## File Structure

| File | Responsibility |
|---|---|
| `src/components/Card.jsx` (modify) | `writeTilt()`/`handleLeave()` gain `data-tilt-frame` read/write; `CardFace`'s classic `.art` box renders `MascotArt` instead of the emoji span when `project.mascot` is set. |
| `src/components/MascotArt.jsx` (modify) | Add 9 new mascot components (`GtaMascot`, `HaarlemMascot`, `SelfhostMascot`, `SomerinMascot`... one per project) and extend the `MASCOTS` registry. |
| `src/styles/mascot.css` (modify) | Generic lenticular frame-swap CSS (frame visibility by `data-tilt-frame`, reduced-motion pin) + per-mascot color/detail styling. |
| `src/data/cards.js` (modify) | Add `mascot: '<id>'` field to each of the 9 non-flagship project entries. |

---

### Task 1: Tilt-frame mechanism + generic frame-swap CSS

**Files:**
- Modify: `src/components/Card.jsx`
- Modify: `src/styles/mascot.css`

**Interfaces:**
- Produces: `.tcg-card[data-tilt-frame="0"|"1"|"2"]` attribute, written by `writeTilt()`, reset to `"0"` by `handleLeave()`.
- Produces: generic CSS contract later tasks rely on — any element with class `mascot-frame mascot-frame-0` (or `-1`/`-2`) inside a `.mascot-frames` container becomes visible only when its ancestor `.tcg-card` carries the matching `data-tilt-frame` value (or no attribute yet, for frame 0).

- [ ] **Step 1: Add frame-index calculation to `writeTilt`**

In `src/components/Card.jsx`, replace:

```js
  function writeTilt(mx, my) {
    ref.current.style.setProperty('--mx', `${mx.toFixed(1)}%`);
    ref.current.style.setProperty('--my', `${my.toFixed(1)}%`);
    const rx = ((my - 50) / 50) * -8;
    const ry = ((mx - 50) / 50) * 8;
    ref.current.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
  }
```

with:

```js
  function writeTilt(mx, my) {
    ref.current.style.setProperty('--mx', `${mx.toFixed(1)}%`);
    ref.current.style.setProperty('--my', `${my.toFixed(1)}%`);
    const rx = ((my - 50) / 50) * -8;
    const ry = ((mx - 50) / 50) * 8;
    ref.current.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
    const magnitude = Math.hypot(rx, ry);
    const frame = magnitude < 3 ? 0 : magnitude < 7 ? 1 : 2;
    ref.current.dataset.tiltFrame = String(frame);
  }
```

- [ ] **Step 2: Reset the frame on pointer leave**

Replace:

```js
  function handleLeave() {
    if (!ref.current) return;
    ref.current.style.transform = 'rotateX(0deg) rotateY(0deg)';
    ref.current.classList.remove('tilting');
  }
```

with:

```js
  function handleLeave() {
    if (!ref.current) return;
    ref.current.style.transform = 'rotateX(0deg) rotateY(0deg)';
    ref.current.classList.remove('tilting');
    ref.current.dataset.tiltFrame = '0';
  }
```

- [ ] **Step 3: Add the generic frame-swap CSS**

Append to `src/styles/mascot.css`:

```css
/* ---- Non-flagship lenticular mascots: generic frame-swap ---- */
.layout-classic .art .mascot-frames{ position:relative; width:52px; height:52px; }
.mascot-frame{ position:absolute; inset:0; width:100%; height:100%; opacity:0; overflow:visible; }
.tcg-card:not([data-tilt-frame]) .mascot-frame-0,
.tcg-card[data-tilt-frame="0"] .mascot-frame-0,
.tcg-card[data-tilt-frame="1"] .mascot-frame-1,
.tcg-card[data-tilt-frame="2"] .mascot-frame-2{ opacity:1; }

@media (prefers-reduced-motion: reduce){
  .tcg-card .mascot-frame-1, .tcg-card .mascot-frame-2{ opacity:0 !important; }
  .tcg-card:not([data-tilt-frame]) .mascot-frame-0,
  .tcg-card[data-tilt-frame] .mascot-frame-0{ opacity:1 !important; }
}
```

- [ ] **Step 4: Verify the build compiles**

Run: `npm run build`
Expected: build succeeds with no errors.

- [ ] **Step 5: Verify the attribute updates**

Start the dev server (`npm run dev`), open the gallery view, open devtools, select any card's `.tcg-card` element, and confirm `data-tilt-frame` appears and changes value (`0`/`1`/`2`) as you move the mouse across the card, and resets to `0` on mouse-leave. No visual change yet — no mascot consumes the attribute until Task 2.

- [ ] **Step 6: Commit**

```bash
git add src/components/Card.jsx src/styles/mascot.css
git commit -m "feat: add tilt-magnitude frame index for lenticular mascots"
```

---

### Task 2: Mascot registry wiring + GTA mascot (Varoom/Revavroom engine-block)

**Files:**
- Modify: `src/components/Card.jsx`
- Modify: `src/components/MascotArt.jsx`
- Modify: `src/styles/mascot.css`
- Modify: `src/data/cards.js:87` (gta entry)

**Interfaces:**
- Produces: `CardFace`'s classic `.art` box renders `<MascotArt id={project.mascot} className="mascot-classic" />` when `project.mascot` is set, else the existing emoji `<span>`. All later mascot tasks rely on this being in place already — they only touch `MascotArt.jsx`, `mascot.css`, and `cards.js`.
- Produces: `GtaMascot({ className })`, added to `MASCOTS` as `gta`.

- [ ] **Step 1: Wire `MascotArt` into the classic `.art` box**

In `src/components/Card.jsx`, add the import alongside the existing ones:

```js
import { MascotArt } from './MascotArt.jsx';
```

Replace:

```jsx
          <div className="art">
            <span>{project.icon}</span>
            <div className="art-shine" />
          </div>
```

with:

```jsx
          <div className="art">
            {project.mascot
              ? <MascotArt id={project.mascot} className="mascot-classic" />
              : <span>{project.icon}</span>}
            <div className="art-shine" />
          </div>
```

- [ ] **Step 2: Add the `GtaMascot` component**

In `src/components/MascotArt.jsx`, add after the existing `ImpalaMascot` (or after the last flagship mascot):

```jsx
export function GtaMascot({ className = '' }) {
  return (
    <div className={`mascot-frames ${className}`}>
      <svg className="mascot-frame mascot-frame-0" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Grand Transmission Auto mascot, idle">
        <polygon className="gta-m-body" points="20,55 20,80 80,80 80,55 65,40 35,40" />
        <rect className="gta-m-block" x="30" y="30" width="40" height="18" rx="3" />
        <circle className="gta-m-bolt" cx="30" cy="65" r="2.5" />
        <circle className="gta-m-bolt" cx="70" cy="65" r="2.5" />
        <circle className="gta-m-bolt" cx="50" cy="72" r="2.5" />
        <path className="gta-m-whisker" d="M20 70 Q6 66 8 54" />
        <path className="gta-m-whisker" d="M80 70 Q94 66 92 54" />
        <circle className="gta-m-light" cx="38" cy="58" r="5" />
        <circle className="gta-m-light" cx="62" cy="58" r="5" />
      </svg>
      <svg className="mascot-frame mascot-frame-1" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Grand Transmission Auto mascot, one headlight on">
        <polygon className="gta-m-body" points="20,55 20,80 80,80 80,55 65,40 35,40" />
        <rect className="gta-m-block" x="30" y="30" width="40" height="18" rx="3" />
        <circle className="gta-m-bolt" cx="30" cy="65" r="2.5" />
        <circle className="gta-m-bolt" cx="70" cy="65" r="2.5" />
        <circle className="gta-m-bolt" cx="50" cy="72" r="2.5" />
        <path className="gta-m-whisker" d="M20 70 Q6 66 8 54" />
        <path className="gta-m-whisker" d="M80 70 Q94 66 92 54" />
        <circle className="gta-m-light gta-m-light-on" cx="38" cy="58" r="5" />
        <circle className="gta-m-light" cx="62" cy="58" r="5" />
      </svg>
      <svg className="mascot-frame mascot-frame-2" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Grand Transmission Auto mascot, both headlights on">
        <polygon className="gta-m-body" points="20,55 20,80 80,80 80,55 65,40 35,40" />
        <rect className="gta-m-block" x="30" y="30" width="40" height="18" rx="3" />
        <circle className="gta-m-bolt" cx="30" cy="65" r="2.5" />
        <circle className="gta-m-bolt" cx="70" cy="65" r="2.5" />
        <circle className="gta-m-bolt" cx="50" cy="72" r="2.5" />
        <path className="gta-m-whisker" d="M20 70 Q6 66 8 54" />
        <path className="gta-m-whisker" d="M80 70 Q94 66 92 54" />
        <circle className="gta-m-light gta-m-light-on" cx="38" cy="58" r="5" />
        <circle className="gta-m-light gta-m-light-on" cx="62" cy="58" r="5" />
        <ellipse className="gta-m-exhaust" cx="8" cy="50" rx="4" ry="2.5" />
        <ellipse className="gta-m-exhaust" cx="92" cy="50" rx="4" ry="2.5" />
      </svg>
    </div>
  );
}
```

Update the registry:

```js
export const MASCOTS = {
  jericho: JerichoMascot,
  tulip: TulipMascot,
  impala: ImpalaMascot,
  gta: GtaMascot,
};
```

- [ ] **Step 3: Add GTA mascot styling**

Append to `src/styles/mascot.css`:

```css
/* ---- Grand Transmission Auto: Varoom/Revavroom engine-block ---- */
.gta-m-body{ fill:rgba(138,143,154,.35); stroke:#cfd3da; stroke-width:1.4; }
.gta-m-block{ fill:rgba(138,143,154,.5); stroke:#cfd3da; stroke-width:1.2; }
.gta-m-bolt{ fill:#cfd3da; }
.gta-m-whisker{ fill:none; stroke:#9aa0ab; stroke-width:2; stroke-linecap:round; }
.gta-m-light{ fill:#3a3d44; stroke:#cfd3da; stroke-width:1; }
.gta-m-light-on{ fill:var(--type-color); filter:drop-shadow(0 0 3px var(--type-color)); }
.gta-m-exhaust{ fill:#c7cbd2; opacity:.5; }
```

- [ ] **Step 4: Add the `mascot` field to the GTA project entry**

In `src/data/cards.js`, find the `gta` entry and change:

```js
    stage: 'Stage 1 · Primary Dev', hp: 9534, hpMetric: 'loc', icon: '🚗',
```

to:

```js
    stage: 'Stage 1 · Primary Dev', hp: 9534, hpMetric: 'loc', icon: '🚗', mascot: 'gta',
```

- [ ] **Step 5: Verify the build compiles**

Run: `npm run build`
Expected: build succeeds with no errors.

- [ ] **Step 6: Verify visually**

In the dev server, find the "Grand Transmission Auto" card (classic layout, small `.art` box). Confirm the chrome engine-block mascot renders in place of the 🚗 emoji. Move the mouse across the card: at rest/near-center it should show both headlights dim; tilt the card a little and one headlight lights up; tilt further and both headlights light with faint exhaust puffs at the corners. Mouse-leave returns to the dim/idle frame.

- [ ] **Step 7: Commit**

```bash
git add src/components/Card.jsx src/components/MascotArt.jsx src/styles/mascot.css src/data/cards.js
git commit -m "feat: add GTA engine-block mascot and wire MascotArt into classic .art box"
```

---

### Task 3: Haarlem Festival mascot (Comfey-lineage bunting decorator)

**Files:**
- Modify: `src/components/MascotArt.jsx`
- Modify: `src/styles/mascot.css`
- Modify: `src/data/cards.js:103` (haarlem entry)

- [ ] **Step 1: Add the `HaarlemMascot` component**

In `src/components/MascotArt.jsx`, add after `GtaMascot`:

```jsx
export function HaarlemMascot({ className = '' }) {
  return (
    <div className={`mascot-frames ${className}`}>
      <svg className="mascot-frame mascot-frame-0" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Haarlem Festival mascot, garland loose">
        <ellipse className="haarlem-m-body" cx="50" cy="55" rx="20" ry="18" />
        <path className="haarlem-m-stem" d="M50 73 L50 88" />
        <path className="haarlem-m-leaf" d="M50 80 Q38 78 36 68 Q46 70 50 80Z" />
        <circle className="haarlem-m-eye" cx="44" cy="52" r="2" />
        <circle className="haarlem-m-eye" cx="56" cy="52" r="2" />
        <polygon className="haarlem-m-flag" points="30,42 34,50 26,50" />
        <polygon className="haarlem-m-flag" points="45,38 49,47 41,47" />
        <polygon className="haarlem-m-flag" points="60,38 64,47 56,47" />
        <polygon className="haarlem-m-flag" points="72,42 76,50 68,50" />
      </svg>
      <svg className="mascot-frame mascot-frame-1" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Haarlem Festival mascot, garland straightening">
        <ellipse className="haarlem-m-body" cx="50" cy="55" rx="20" ry="18" />
        <path className="haarlem-m-stem" d="M50 73 L50 88" />
        <path className="haarlem-m-leaf" d="M50 80 Q38 78 36 68 Q46 70 50 80Z" />
        <circle className="haarlem-m-eye" cx="44" cy="52" r="2" />
        <circle className="haarlem-m-eye" cx="56" cy="52" r="2" />
        <polygon className="haarlem-m-flag haarlem-m-flag-active" points="30,40 34,48 26,48" />
        <polygon className="haarlem-m-flag haarlem-m-flag-active" points="45,36 49,45 41,45" />
        <polygon className="haarlem-m-flag haarlem-m-flag-active" points="60,36 64,45 56,45" />
        <polygon className="haarlem-m-flag haarlem-m-flag-active" points="72,40 76,48 68,48" />
      </svg>
      <svg className="mascot-frame mascot-frame-2" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Haarlem Festival mascot, lanterns lit">
        <ellipse className="haarlem-m-body" cx="50" cy="55" rx="20" ry="18" />
        <path className="haarlem-m-stem" d="M50 73 L50 88" />
        <path className="haarlem-m-leaf" d="M50 80 Q38 78 36 68 Q46 70 50 80Z" />
        <circle className="haarlem-m-eye" cx="44" cy="52" r="2" />
        <circle className="haarlem-m-eye" cx="56" cy="52" r="2" />
        <polygon className="haarlem-m-flag haarlem-m-flag-active" points="30,40 34,48 26,48" />
        <polygon className="haarlem-m-flag haarlem-m-flag-active" points="45,36 49,45 41,45" />
        <polygon className="haarlem-m-flag haarlem-m-flag-active" points="60,36 64,45 56,45" />
        <polygon className="haarlem-m-flag haarlem-m-flag-active" points="72,40 76,48 68,48" />
        <circle className="haarlem-m-lantern" cx="30" cy="46" r="2.5" />
        <circle className="haarlem-m-lantern" cx="45" cy="42" r="2.5" />
        <circle className="haarlem-m-lantern" cx="60" cy="42" r="2.5" />
        <circle className="haarlem-m-lantern" cx="72" cy="46" r="2.5" />
      </svg>
    </div>
  );
}
```

Update the registry:

```js
export const MASCOTS = {
  jericho: JerichoMascot,
  tulip: TulipMascot,
  impala: ImpalaMascot,
  gta: GtaMascot,
  haarlem: HaarlemMascot,
};
```

- [ ] **Step 2: Add Haarlem mascot styling**

Append to `src/styles/mascot.css`:

```css
/* ---- Haarlem Festival: Comfey-lineage bunting decorator ---- */
.haarlem-m-body{ fill:rgba(47,168,90,.28); stroke:#7be0a0; stroke-width:1.4; }
.haarlem-m-stem, .haarlem-m-leaf{ fill:rgba(47,168,90,.35); stroke:#7be0a0; stroke-width:1.2; }
.haarlem-m-eye{ fill:#1c3d24; }
.haarlem-m-flag{ opacity:.5; fill:#ffb6d6; }
.haarlem-m-flag:nth-of-type(even){ fill:#ffe08a; }
.haarlem-m-flag-active{ opacity:.9; }
.haarlem-m-lantern{ fill:#ffe08a; filter:drop-shadow(0 0 3px #ffe08a); }
```

- [ ] **Step 3: Add the `mascot` field to the Haarlem project entry**

In `src/data/cards.js`, change:

```js
    stage: 'Stage 1 · Design Lead', hp: 4583, hpMetric: 'loc', icon: '🎪',
```

to:

```js
    stage: 'Stage 1 · Design Lead', hp: 4583, hpMetric: 'loc', icon: '🎪', mascot: 'haarlem',
```

- [ ] **Step 4: Verify the build compiles**

Run: `npm run build`
Expected: build succeeds with no errors.

- [ ] **Step 5: Verify visually**

In the dev server, find the "Haarlem Festival" card. Confirm the flower-bodied decorator mascot with hanging bunting flags replaces the 🎪 emoji. Tilting the card should straighten/brighten the flags, and at full tilt 4 small lanterns should appear lit among the flags.

- [ ] **Step 6: Commit**

```bash
git add src/components/MascotArt.jsx src/styles/mascot.css src/data/cards.js
git commit -m "feat: add Haarlem Festival bunting-decorator mascot"
```

---

### Task 4: Self-Hosted AI Infrastructure mascot (Rotom-lineage server spark)

**Files:**
- Modify: `src/components/MascotArt.jsx`
- Modify: `src/styles/mascot.css`
- Modify: `src/data/cards.js:117` (selfhost entry)

- [ ] **Step 1: Add the `SelfhostMascot` component**

In `src/components/MascotArt.jsx`, add after `HaarlemMascot`:

```jsx
export function SelfhostMascot({ className = '' }) {
  return (
    <div className={`mascot-frames ${className}`}>
      <svg className="mascot-frame mascot-frame-0" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Self-Hosted AI Infrastructure mascot, dormant">
        <rect className="selfhost-m-tower" x="30" y="20" width="40" height="70" rx="4" />
        <rect className="selfhost-m-vent" x="36" y="30" width="28" height="3" />
        <rect className="selfhost-m-vent" x="36" y="38" width="28" height="3" />
        <rect className="selfhost-m-vent" x="36" y="46" width="28" height="3" />
        <circle className="selfhost-m-led" cx="40" cy="80" r="2" />
        <path className="selfhost-m-spark selfhost-m-spark-dim" d="M50 55 L44 65 L49 65 L46 75 L58 60 L52 60 Z" />
      </svg>
      <svg className="mascot-frame mascot-frame-1" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Self-Hosted AI Infrastructure mascot, flickering">
        <rect className="selfhost-m-tower" x="30" y="20" width="40" height="70" rx="4" />
        <rect className="selfhost-m-vent" x="36" y="30" width="28" height="3" />
        <rect className="selfhost-m-vent" x="36" y="38" width="28" height="3" />
        <rect className="selfhost-m-vent" x="36" y="46" width="28" height="3" />
        <circle className="selfhost-m-led" cx="40" cy="80" r="2" />
        <path className="selfhost-m-spark selfhost-m-spark-mid" d="M50 55 L44 65 L49 65 L46 75 L58 60 L52 60 Z" />
      </svg>
      <svg className="mascot-frame mascot-frame-2" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Self-Hosted AI Infrastructure mascot, fully lit">
        <rect className="selfhost-m-tower" x="30" y="20" width="40" height="70" rx="4" />
        <rect className="selfhost-m-vent" x="36" y="30" width="28" height="3" />
        <rect className="selfhost-m-vent" x="36" y="38" width="28" height="3" />
        <rect className="selfhost-m-vent" x="36" y="46" width="28" height="3" />
        <circle className="selfhost-m-led" cx="40" cy="80" r="2" />
        <path className="selfhost-m-spark selfhost-m-spark-full" d="M50 55 L44 65 L49 65 L46 75 L58 60 L52 60 Z" />
        <circle className="selfhost-m-fan" cx="50" cy="35" r="8" />
      </svg>
    </div>
  );
}
```

Update the registry:

```js
export const MASCOTS = {
  jericho: JerichoMascot,
  tulip: TulipMascot,
  impala: ImpalaMascot,
  gta: GtaMascot,
  haarlem: HaarlemMascot,
  selfhost: SelfhostMascot,
};
```

- [ ] **Step 2: Add Self-Hosted mascot styling**

Append to `src/styles/mascot.css`:

```css
/* ---- Self-Hosted AI Infrastructure: Rotom-lineage server spark ---- */
.selfhost-m-tower{ fill:rgba(127,140,156,.3); stroke:#c7ccd3; stroke-width:1.4; }
.selfhost-m-vent, .selfhost-m-led{ fill:#c7ccd3; }
.selfhost-m-spark-dim{ fill:#5a6068; opacity:.3; }
.selfhost-m-spark-mid{ fill:var(--type-color); opacity:.6; }
.selfhost-m-spark-full{ fill:var(--type-color); opacity:1; filter:drop-shadow(0 0 4px var(--type-color)); }
.selfhost-m-fan{ fill:none; stroke:var(--type-color); stroke-width:1; stroke-dasharray:3 2; opacity:.6; }
```

- [ ] **Step 3: Add the `mascot` field to the Self-Hosted project entry**

In `src/data/cards.js`, change:

```js
    stage: 'Basic', hp: 159, hpMetric: 'loc', icon: '🖥️',
```

to:

```js
    stage: 'Basic', hp: 159, hpMetric: 'loc', icon: '🖥️', mascot: 'selfhost',
```

- [ ] **Step 4: Verify the build compiles**

Run: `npm run build`
Expected: build succeeds with no errors.

- [ ] **Step 5: Verify visually**

In the dev server, find the "Self-Hosted AI Infrastructure" card. Confirm the server-tower mascot with an internal spark replaces the 🖥️ emoji. Tilting should brighten the spark from dim grey to a glowing type-colored spark, with a faint spinning-fan ring appearing at full tilt.

- [ ] **Step 6: Commit**

```bash
git add src/components/MascotArt.jsx src/styles/mascot.css src/data/cards.js
git commit -m "feat: add Self-Hosted AI Infrastructure server-spark mascot"
```

---

### Task 5: Somerin mascot (Swablu-lineage camp cloud-bird)

**Files:**
- Modify: `src/components/MascotArt.jsx`
- Modify: `src/styles/mascot.css`
- Modify: `src/data/cards.js:131` (somerin entry)

- [ ] **Step 1: Add the `SomerinMascot` component**

In `src/components/MascotArt.jsx`, add after `SelfhostMascot`:

```jsx
export function SomerinMascot({ className = '' }) {
  return (
    <div className={`mascot-frames ${className}`}>
      <svg className="mascot-frame mascot-frame-0" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Somerin mascot, grounded">
        <ellipse className="somerin-m-body" cx="50" cy="55" rx="22" ry="15" />
        <circle className="somerin-m-head" cx="72" cy="48" r="10" />
        <circle className="somerin-m-eye" cx="75" cy="46" r="1.6" />
        <polygon className="somerin-m-beak" points="82,48 90,50 82,52" />
        <path className="somerin-m-bandana" d="M62 42 L70 38 L70 46 Z" />
        <path className="somerin-m-wing" d="M35 55 Q22 55 20 60" />
      </svg>
      <svg className="mascot-frame mascot-frame-1" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Somerin mascot, wings opening">
        <ellipse className="somerin-m-body" cx="50" cy="55" rx="22" ry="15" />
        <circle className="somerin-m-head" cx="72" cy="48" r="10" />
        <circle className="somerin-m-eye" cx="75" cy="46" r="1.6" />
        <polygon className="somerin-m-beak" points="82,48 90,50 82,52" />
        <path className="somerin-m-bandana" d="M62 42 L70 37 L71 46 Z" />
        <path className="somerin-m-wing" d="M35 55 Q16 52 14 58" />
      </svg>
      <svg className="mascot-frame mascot-frame-2" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Somerin mascot, airborne">
        <ellipse className="somerin-m-body" cx="50" cy="55" rx="22" ry="15" />
        <circle className="somerin-m-head" cx="72" cy="48" r="10" />
        <circle className="somerin-m-eye" cx="75" cy="46" r="1.6" />
        <polygon className="somerin-m-beak" points="82,48 90,50 82,52" />
        <path className="somerin-m-bandana somerin-m-bandana-flap" d="M62 42 L72 35 L73 46 Z" />
        <path className="somerin-m-wing somerin-m-wing-open" d="M35 55 Q10 48 8 56 Q10 62 20 60" />
      </svg>
    </div>
  );
}
```

Update the registry:

```js
export const MASCOTS = {
  jericho: JerichoMascot,
  tulip: TulipMascot,
  impala: ImpalaMascot,
  gta: GtaMascot,
  haarlem: HaarlemMascot,
  selfhost: SelfhostMascot,
  somerin: SomerinMascot,
};
```

- [ ] **Step 2: Add Somerin mascot styling**

Append to `src/styles/mascot.css`:

```css
/* ---- Somerin: Swablu-lineage camp cloud-bird ---- */
.somerin-m-body{ fill:rgba(230,240,250,.85); stroke:#d7e6f4; stroke-width:1.4; }
.somerin-m-head{ fill:rgba(230,240,250,.9); stroke:#d7e6f4; stroke-width:1.4; }
.somerin-m-eye{ fill:#1c1c1c; }
.somerin-m-beak{ fill:#ffcf6b; }
.somerin-m-bandana{ fill:var(--type-color); opacity:.85; }
.somerin-m-bandana-flap{ opacity:1; }
.somerin-m-wing{ fill:none; stroke:#c3d6e8; stroke-width:2.5; stroke-linecap:round; }
.somerin-m-wing-open{ stroke:#e6effa; }
```

- [ ] **Step 3: Add the `mascot` field to the Somerin project entry**

In `src/data/cards.js`, change:

```js
    stage: 'Basic', hp: 40, hpMetric: 'hours', icon: '🏕️',
```

to:

```js
    stage: 'Basic', hp: 40, hpMetric: 'hours', icon: '🏕️', mascot: 'somerin',
```

- [ ] **Step 4: Verify the build compiles**

Run: `npm run build`
Expected: build succeeds with no errors.

- [ ] **Step 5: Verify visually**

In the dev server, find the "Somerin" card. Confirm the cloud-bird mascot with a bandana replaces the 🏕️ emoji, wings extending further and the bandana flapping as tilt increases.

- [ ] **Step 6: Commit**

```bash
git add src/components/MascotArt.jsx src/styles/mascot.css src/data/cards.js
git commit -m "feat: add Somerin cloud-bird mascot"
```

---

### Task 6: Souls Within mascot (Gastly-lineage sprite ghost)

**Files:**
- Modify: `src/components/MascotArt.jsx`
- Modify: `src/styles/mascot.css`
- Modify: `src/data/cards.js:142` (souls entry)

- [ ] **Step 1: Add the `SoulsMascot` component**

In `src/components/MascotArt.jsx`, add after `SomerinMascot`:

```jsx
export function SoulsMascot({ className = '' }) {
  return (
    <div className={`mascot-frames ${className}`}>
      <svg className="mascot-frame mascot-frame-0" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Souls Within mascot, translucent">
        <path className="souls-m-body souls-m-body-faint" d="M50 30 Q70 30 70 55 Q70 65 60 65 Q65 72 58 72 Q60 78 50 75 Q40 78 42 72 Q35 72 40 65 Q30 65 30 55 Q30 30 50 30 Z" />
        <circle className="souls-m-eye" cx="43" cy="50" r="3" />
        <circle className="souls-m-eye" cx="57" cy="50" r="3" />
      </svg>
      <svg className="mascot-frame mascot-frame-1" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Souls Within mascot, solidifying">
        <path className="souls-m-body souls-m-body-mid" d="M50 30 Q70 30 70 55 Q70 65 60 65 Q65 72 58 72 Q60 78 50 75 Q40 78 42 72 Q35 72 40 65 Q30 65 30 55 Q30 30 50 30 Z" />
        <circle className="souls-m-eye" cx="43" cy="50" r="3" />
        <circle className="souls-m-eye" cx="57" cy="50" r="3" />
      </svg>
      <svg className="mascot-frame mascot-frame-2" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Souls Within mascot, solid and bright-eyed">
        <path className="souls-m-body souls-m-body-full" d="M50 30 Q70 30 70 55 Q70 65 60 65 Q65 72 58 72 Q60 78 50 75 Q40 78 42 72 Q35 72 40 65 Q30 65 30 55 Q30 30 50 30 Z" />
        <circle className="souls-m-eye souls-m-eye-glow" cx="43" cy="50" r="3" />
        <circle className="souls-m-eye souls-m-eye-glow" cx="57" cy="50" r="3" />
      </svg>
    </div>
  );
}
```

Update the registry:

```js
export const MASCOTS = {
  jericho: JerichoMascot,
  tulip: TulipMascot,
  impala: ImpalaMascot,
  gta: GtaMascot,
  haarlem: HaarlemMascot,
  selfhost: SelfhostMascot,
  somerin: SomerinMascot,
  souls: SoulsMascot,
};
```

- [ ] **Step 2: Add Souls Within mascot styling**

Append to `src/styles/mascot.css`:

```css
/* ---- Souls Within: Gastly-lineage sprite ghost ---- */
.souls-m-body{ stroke:#a58ae0; stroke-width:1.2; }
.souls-m-body-faint{ fill:#6a4fa3; opacity:.3; }
.souls-m-body-mid{ fill:#6a4fa3; opacity:.6; }
.souls-m-body-full{ fill:#6a4fa3; opacity:.95; }
.souls-m-eye{ fill:#f4ead0; }
.souls-m-eye-glow{ filter:drop-shadow(0 0 4px var(--type-color)); }
```

- [ ] **Step 3: Add the `mascot` field to the Souls Within project entry**

In `src/data/cards.js`, change:

```js
    stage: 'Basic', hp: 137, hpMetric: 'loc', icon: '🎮',
```

to:

```js
    stage: 'Basic', hp: 137, hpMetric: 'loc', icon: '🎮', mascot: 'souls',
```

- [ ] **Step 4: Verify the build compiles**

Run: `npm run build`
Expected: build succeeds with no errors.

- [ ] **Step 5: Verify visually**

In the dev server, find the "Souls Within" card. Confirm the small ghost-sprite mascot replaces the 🎮 emoji, becoming more opaque and its eyes glowing as tilt increases.

- [ ] **Step 6: Commit**

```bash
git add src/components/MascotArt.jsx src/styles/mascot.css src/data/cards.js
git commit -m "feat: add Souls Within sprite-ghost mascot"
```

---

### Task 7: Chapeau POS mascot (Chatot-lineage beret parrot)

**Files:**
- Modify: `src/components/MascotArt.jsx`
- Modify: `src/styles/mascot.css`
- Modify: `src/data/cards.js:153` (chapeau entry)

- [ ] **Step 1: Add the `ChapeauMascot` component**

In `src/components/MascotArt.jsx`, add after `SoulsMascot`:

```jsx
export function ChapeauMascot({ className = '' }) {
  return (
    <div className={`mascot-frames ${className}`}>
      <svg className="mascot-frame mascot-frame-0" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Chapeau POS mascot, beak closed">
        <ellipse className="chapeau-m-body" cx="50" cy="58" rx="16" ry="20" />
        <circle className="chapeau-m-head" cx="50" cy="34" r="13" />
        <polygon className="chapeau-m-crest" points="38,26 50,12 62,26" />
        <circle className="chapeau-m-eye" cx="45" cy="32" r="2" />
        <polygon className="chapeau-m-beak" points="50,38 56,40 50,42" />
      </svg>
      <svg className="mascot-frame mascot-frame-1" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Chapeau POS mascot, beak opening">
        <ellipse className="chapeau-m-body" cx="50" cy="58" rx="16" ry="20" />
        <circle className="chapeau-m-head" cx="50" cy="34" r="13" />
        <polygon className="chapeau-m-crest" points="38,26 50,11 62,26" />
        <circle className="chapeau-m-eye" cx="45" cy="32" r="2" />
        <polygon className="chapeau-m-beak" points="50,37 60,41 50,45" />
      </svg>
      <svg className="mascot-frame mascot-frame-2" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Chapeau POS mascot, chirping">
        <ellipse className="chapeau-m-body" cx="50" cy="58" rx="16" ry="20" />
        <circle className="chapeau-m-head" cx="50" cy="34" r="13" />
        <polygon className="chapeau-m-crest chapeau-m-crest-raised" points="38,26 50,8 62,26" />
        <circle className="chapeau-m-eye" cx="45" cy="32" r="2" />
        <polygon className="chapeau-m-beak" points="50,36 63,42 50,48" />
        <path className="chapeau-m-note" d="M70 20 q3 -6 6 0 l0 10" />
      </svg>
    </div>
  );
}
```

Update the registry:

```js
export const MASCOTS = {
  jericho: JerichoMascot,
  tulip: TulipMascot,
  impala: ImpalaMascot,
  gta: GtaMascot,
  haarlem: HaarlemMascot,
  selfhost: SelfhostMascot,
  somerin: SomerinMascot,
  souls: SoulsMascot,
  chapeau: ChapeauMascot,
};
```

- [ ] **Step 2: Add Chapeau mascot styling**

Append to `src/styles/mascot.css`:

```css
/* ---- Chapeau POS: Chatot-lineage beret parrot ---- */
.chapeau-m-body{ fill:rgba(43,127,209,.25); stroke:#8fbeeb; stroke-width:1.4; }
.chapeau-m-head{ fill:rgba(43,127,209,.3); stroke:#8fbeeb; stroke-width:1.4; }
.chapeau-m-crest{ fill:var(--type-color); opacity:.8; }
.chapeau-m-crest-raised{ opacity:1; filter:drop-shadow(0 0 3px var(--type-color)); }
.chapeau-m-eye{ fill:#12202e; }
.chapeau-m-beak{ fill:#ffcf6b; }
.chapeau-m-note{ fill:none; stroke:#f4ead0; stroke-width:1.6; stroke-linecap:round; }
```

- [ ] **Step 3: Add the `mascot` field to the Chapeau project entry**

In `src/data/cards.js`, change:

```js
    stage: 'Basic', hp: 30, hpMetric: 'hours', icon: '🧾',
```

to:

```js
    stage: 'Basic', hp: 30, hpMetric: 'hours', icon: '🧾', mascot: 'chapeau',
```

- [ ] **Step 4: Verify the build compiles**

Run: `npm run build`
Expected: build succeeds with no errors.

- [ ] **Step 5: Verify visually**

In the dev server, find the "Chapeau POS" card. Confirm the beret-crested parrot mascot replaces the 🧾 emoji, beak opening wider and crest raising with a small musical note appearing at full tilt.

- [ ] **Step 6: Commit**

```bash
git add src/components/MascotArt.jsx src/styles/mascot.css src/data/cards.js
git commit -m "feat: add Chapeau POS beret-parrot mascot"
```

---

### Task 8: Greenhouse Automation mascot (Sunkern-lineage seed sprout)

**Files:**
- Modify: `src/components/MascotArt.jsx`
- Modify: `src/styles/mascot.css`
- Modify: `src/data/cards.js:164` (greenhouse entry)

- [ ] **Step 1: Add the `GreenhouseMascot` component**

In `src/components/MascotArt.jsx`, add after `ChapeauMascot`:

```jsx
export function GreenhouseMascot({ className = '' }) {
  return (
    <div className={`mascot-frames ${className}`}>
      <svg className="mascot-frame mascot-frame-0" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Greenhouse Automation mascot, dry">
        <circle className="greenhouse-m-seed" cx="50" cy="55" r="16" />
        <path className="greenhouse-m-face" d="M44 52 q2 -2 4 0" />
        <path className="greenhouse-m-face" d="M52 52 q2 -2 4 0" />
        <path className="greenhouse-m-wire" d="M34 55 Q50 75 66 55 Q50 40 34 55Z" />
      </svg>
      <svg className="mascot-frame mascot-frame-1" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Greenhouse Automation mascot, wire glowing">
        <circle className="greenhouse-m-seed" cx="50" cy="55" r="16" />
        <path className="greenhouse-m-face" d="M44 52 q2 -2 4 0" />
        <path className="greenhouse-m-face" d="M52 52 q2 -2 4 0" />
        <path className="greenhouse-m-wire greenhouse-m-wire-active" d="M34 55 Q50 75 66 55 Q50 40 34 55Z" />
      </svg>
      <svg className="mascot-frame mascot-frame-2" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Greenhouse Automation mascot, watered and sprouting">
        <circle className="greenhouse-m-seed" cx="50" cy="55" r="16" />
        <path className="greenhouse-m-face" d="M44 51 q2 -3 4 0" />
        <path className="greenhouse-m-face" d="M52 51 q2 -3 4 0" />
        <path className="greenhouse-m-wire greenhouse-m-wire-active" d="M34 55 Q50 75 66 55 Q50 40 34 55Z" />
        <path className="greenhouse-m-droplet" d="M50 26 Q54 34 50 38 Q46 34 50 26Z" />
        <path className="greenhouse-m-sprout" d="M50 39 Q46 34 50 30 Q54 34 50 39Z" />
      </svg>
    </div>
  );
}
```

Update the registry:

```js
export const MASCOTS = {
  jericho: JerichoMascot,
  tulip: TulipMascot,
  impala: ImpalaMascot,
  gta: GtaMascot,
  haarlem: HaarlemMascot,
  selfhost: SelfhostMascot,
  somerin: SomerinMascot,
  souls: SoulsMascot,
  chapeau: ChapeauMascot,
  greenhouse: GreenhouseMascot,
};
```

- [ ] **Step 2: Add Greenhouse mascot styling**

Append to `src/styles/mascot.css`:

```css
/* ---- Greenhouse Automation: Sunkern-lineage seed sprout ---- */
.greenhouse-m-seed{ fill:rgba(192,57,43,.2); stroke:#e0a89f; stroke-width:1.4; }
.greenhouse-m-face{ fill:none; stroke:#5a2b22; stroke-width:1.6; stroke-linecap:round; }
.greenhouse-m-wire{ fill:none; stroke:#7a5a3a; stroke-width:2; opacity:.5; }
.greenhouse-m-wire-active{ stroke:var(--type-color); opacity:.9; filter:drop-shadow(0 0 3px var(--type-color)); }
.greenhouse-m-droplet{ fill:#8fc6e8; opacity:.85; }
.greenhouse-m-sprout{ fill:#4a9a4a; }
```

- [ ] **Step 3: Add the `mascot` field to the Greenhouse project entry**

In `src/data/cards.js`, change:

```js
    stage: 'Basic', hp: 25, hpMetric: 'hours', icon: '🌱',
```

to:

```js
    stage: 'Basic', hp: 25, hpMetric: 'hours', icon: '🌱', mascot: 'greenhouse',
```

- [ ] **Step 4: Verify the build compiles**

Run: `npm run build`
Expected: build succeeds with no errors.

- [ ] **Step 5: Verify visually**

In the dev server, find the "Greenhouse Automation" card. Confirm the seed mascot with a wrapped wire replaces the 🌱 emoji, the wire glowing on tilt and a droplet + small sprout appearing at full tilt.

- [ ] **Step 6: Commit**

```bash
git add src/components/MascotArt.jsx src/styles/mascot.css src/data/cards.js
git commit -m "feat: add Greenhouse Automation seed-sprout mascot"
```

---

### Task 9: Movie Theater Ticketing mascot (Klefki-lineage ticket-stub keyring)

**Files:**
- Modify: `src/components/MascotArt.jsx`
- Modify: `src/styles/mascot.css`
- Modify: `src/data/cards.js:175` (movie entry)

- [ ] **Step 1: Add the `MovieMascot` component**

In `src/components/MascotArt.jsx`, add after `GreenhouseMascot`:

```jsx
export function MovieMascot({ className = '' }) {
  return (
    <div className={`mascot-frames ${className}`}>
      <svg className="mascot-frame mascot-frame-0" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Movie Theater Ticketing mascot, stubs still">
        <circle className="movie-m-ring" cx="50" cy="35" r="14" />
        <circle className="movie-m-eye" cx="45" cy="35" r="1.8" />
        <circle className="movie-m-eye" cx="55" cy="35" r="1.8" />
        <rect className="movie-m-stub" x="40" y="55" width="8" height="14" rx="1" />
        <rect className="movie-m-stub" x="52" y="58" width="8" height="14" rx="1" />
      </svg>
      <svg className="mascot-frame mascot-frame-1" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Movie Theater Ticketing mascot, ring turning">
        <circle className="movie-m-ring movie-m-ring-turn" cx="50" cy="35" r="14" />
        <circle className="movie-m-eye" cx="46" cy="34" r="1.8" />
        <circle className="movie-m-eye" cx="56" cy="36" r="1.8" />
        <rect className="movie-m-stub" x="39" y="56" width="8" height="14" rx="1" transform="rotate(-4 43 63)" />
        <rect className="movie-m-stub" x="53" y="58" width="8" height="14" rx="1" transform="rotate(4 57 65)" />
      </svg>
      <svg className="mascot-frame mascot-frame-2" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Movie Theater Ticketing mascot, stub torn">
        <circle className="movie-m-ring movie-m-ring-turn" cx="50" cy="35" r="14" />
        <circle className="movie-m-eye" cx="46" cy="34" r="1.8" />
        <circle className="movie-m-eye" cx="56" cy="36" r="1.8" />
        <polygon className="movie-m-stub movie-m-stub-torn" points="38,52 48,52 50,60 46,66 42,60 40,66 36,60" />
        <rect className="movie-m-stub" x="53" y="58" width="8" height="14" rx="1" transform="rotate(4 57 65)" />
      </svg>
    </div>
  );
}
```

Update the registry:

```js
export const MASCOTS = {
  jericho: JerichoMascot,
  tulip: TulipMascot,
  impala: ImpalaMascot,
  gta: GtaMascot,
  haarlem: HaarlemMascot,
  selfhost: SelfhostMascot,
  somerin: SomerinMascot,
  souls: SoulsMascot,
  chapeau: ChapeauMascot,
  greenhouse: GreenhouseMascot,
  movie: MovieMascot,
};
```

- [ ] **Step 2: Add Movie mascot styling**

Append to `src/styles/mascot.css`:

```css
/* ---- Movie Theater Ticketing: Klefki-lineage ticket-stub keyring ---- */
.movie-m-ring{ fill:none; stroke:#c7ccd3; stroke-width:2.5; transform-origin:50px 35px; }
.movie-m-ring-turn{ stroke:var(--type-color); }
.movie-m-eye{ fill:#1c1c1c; }
.movie-m-stub{ fill:#ffe08a; stroke:#c9a24a; stroke-width:1; }
.movie-m-stub-torn{ fill:var(--type-color); filter:drop-shadow(0 0 3px var(--type-color)); }
```

- [ ] **Step 3: Add the `mascot` field to the Movie project entry**

In `src/data/cards.js`, change:

```js
    stage: 'Basic', hp: 3129, hpMetric: 'loc', icon: '🎟️',
```

to:

```js
    stage: 'Basic', hp: 3129, hpMetric: 'loc', icon: '🎟️', mascot: 'movie',
```

- [ ] **Step 4: Verify the build compiles**

Run: `npm run build`
Expected: build succeeds with no errors.

- [ ] **Step 5: Verify visually**

In the dev server, find the "Movie Theater Ticketing" card. Confirm the key-ring mascot carrying ticket stubs replaces the 🎟️ emoji, the ring/stubs tilting with the card and one stub becoming a "torn," type-colored jagged shape at full tilt.

- [ ] **Step 6: Commit**

```bash
git add src/components/MascotArt.jsx src/styles/mascot.css src/data/cards.js
git commit -m "feat: add Movie Theater Ticketing keyring mascot"
```

---

### Task 10: Service Desk Ticket System mascot (Yamask-lineage archivist ghost)

**Files:**
- Modify: `src/components/MascotArt.jsx`
- Modify: `src/styles/mascot.css`
- Modify: `src/data/cards.js:186` (servicedesk entry)

- [ ] **Step 1: Add the `ServicedeskMascot` component**

In `src/components/MascotArt.jsx`, add after `MovieMascot`:

```jsx
export function ServicedeskMascot({ className = '' }) {
  return (
    <div className={`mascot-frames ${className}`}>
      <svg className="mascot-frame mascot-frame-0" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Service Desk mascot, plaque blank">
        <path className="servicedesk-m-body" d="M50 25 Q68 25 68 45 Q68 60 58 62 Q60 70 50 68 Q40 70 42 62 Q32 60 32 45 Q32 25 50 25Z" />
        <circle className="servicedesk-m-eye" cx="44" cy="42" r="2" />
        <circle className="servicedesk-m-eye" cx="56" cy="42" r="2" />
        <rect className="servicedesk-m-plaque" x="40" y="70" width="20" height="16" rx="2" />
      </svg>
      <svg className="mascot-frame mascot-frame-1" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Service Desk mascot, plaque logging">
        <path className="servicedesk-m-body" d="M50 25 Q68 25 68 45 Q68 60 58 62 Q60 70 50 68 Q40 70 42 62 Q32 60 32 45 Q32 25 50 25Z" />
        <circle className="servicedesk-m-eye" cx="44" cy="42" r="2" />
        <circle className="servicedesk-m-eye" cx="56" cy="42" r="2" />
        <rect className="servicedesk-m-plaque servicedesk-m-plaque-active" x="40" y="70" width="20" height="16" rx="2" />
        <line className="servicedesk-m-plaque-line" x1="43" y1="78" x2="57" y2="78" />
      </svg>
      <svg className="mascot-frame mascot-frame-2" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Service Desk mascot, plaque stamped">
        <path className="servicedesk-m-body" d="M50 25 Q68 25 68 45 Q68 60 58 62 Q60 70 50 68 Q40 70 42 62 Q32 60 32 45 Q32 25 50 25Z" />
        <circle className="servicedesk-m-eye" cx="44" cy="42" r="2" />
        <circle className="servicedesk-m-eye" cx="56" cy="42" r="2" />
        <rect className="servicedesk-m-plaque servicedesk-m-plaque-active" x="40" y="70" width="20" height="16" rx="2" />
        <path className="servicedesk-m-plaque-check" d="M44 78 l4 4 l8 -8" />
      </svg>
    </div>
  );
}
```

Update the registry:

```js
export const MASCOTS = {
  jericho: JerichoMascot,
  tulip: TulipMascot,
  impala: ImpalaMascot,
  gta: GtaMascot,
  haarlem: HaarlemMascot,
  selfhost: SelfhostMascot,
  somerin: SomerinMascot,
  souls: SoulsMascot,
  chapeau: ChapeauMascot,
  greenhouse: GreenhouseMascot,
  movie: MovieMascot,
  servicedesk: ServicedeskMascot,
};
```

- [ ] **Step 2: Add Service Desk mascot styling**

Append to `src/styles/mascot.css`:

```css
/* ---- Service Desk Ticket System: Yamask-lineage archivist ghost ---- */
.servicedesk-m-body{ fill:rgba(43,127,209,.22); stroke:#8fbeeb; stroke-width:1.4; }
.servicedesk-m-eye{ fill:#12202e; }
.servicedesk-m-plaque{ fill:#3a3428; stroke:#c9a24a; stroke-width:1.2; }
.servicedesk-m-plaque-active{ stroke:var(--type-color); }
.servicedesk-m-plaque-line{ stroke:#c9a24a; stroke-width:1.4; stroke-linecap:round; }
.servicedesk-m-plaque-check{ fill:none; stroke:var(--type-color); stroke-width:2; stroke-linecap:round; stroke-linejoin:round; filter:drop-shadow(0 0 3px var(--type-color)); }
```

- [ ] **Step 3: Add the `mascot` field to the Service Desk project entry**

In `src/data/cards.js`, change:

```js
    stage: 'Basic', hp: 1903, hpMetric: 'loc', icon: '🎫',
```

to:

```js
    stage: 'Basic', hp: 1903, hpMetric: 'loc', icon: '🎫', mascot: 'servicedesk',
```

- [ ] **Step 4: Verify the build compiles**

Run: `npm run build`
Expected: build succeeds with no errors.

- [ ] **Step 5: Verify visually**

In the dev server, find the "Service Desk Ticket System" card. Confirm the archivist-ghost mascot holding a clipboard plaque replaces the 🎫 emoji, the plaque gaining a line then a stamped checkmark as tilt increases.

- [ ] **Step 6: Commit**

```bash
git add src/components/MascotArt.jsx src/styles/mascot.css src/data/cards.js
git commit -m "feat: add Service Desk archivist-ghost mascot"
```

---

### Task 11: Reduced-motion and whole-gallery verification pass

**Files:** none (verification only)

- [ ] **Step 1: Verify reduced motion**

In the dev server, enable "prefers reduced motion" (via browser devtools rendering emulation, or OS-level setting) and reload the gallery. Confirm all 9 non-flagship mascots stay pinned to their idle (frame-0) art regardless of mouse movement/tilt — no frame swapping occurs.

- [ ] **Step 2: Verify the whole gallery together**

With reduced motion off, scroll through the full gallery and tilt/hover each of the 9 non-flagship cards in turn. Confirm: every card shows its bespoke mascot (no emoji remaining on any of the 9), each mascot's 3 frames are visually distinct, and no card regresses to a broken/empty `.art` box.

- [ ] **Step 3: Run a final production build**

Run: `npm run build`
Expected: build succeeds with no errors.
