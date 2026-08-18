# Full-Art Illustration Scenes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the single-giant-emoji-on-gradient placeholder art on the three flagship full-art cards (Jericho/SSIR, Severe Weather Alert System/SIR, TulipVision/IR) with bespoke coded scenes that tell each project's story, per `docs/superpowers/specs/2026-08-18-fullart-illustration-scenes-design.md`.

**Architecture:** A new component file (`src/components/FullArtScenes.jsx`) holds one scene function per flagship project plus a lookup map and a fallback (the current icon+gradient treatment, for any future full-art project without a bespoke scene). `Card.jsx` is wired once to render through this lookup. Each scene's styling lives in `src/styles/card.css` under its own project-scoped class. One data correction in `src/data/cards.js` (impala's icon).

**Tech Stack:** React 19 (JSX), plain CSS (no preprocessor), inline SVG for line/wind elements. No test framework exists in this repo — verification is visual, via the running dev server checked in the Browser pane, plus devtools JS to confirm DOM/class assertions precisely.

## Global Constraints

- No new image/SVG asset files — everything is inline JSX/CSS/SVG within `FullArtScenes.jsx` and `card.css`.
- Scenes are keyed by `project.id` (`jericho`, `impala`, `tulip`), not by `type` or `rarity` — two of the three share `type: ml` but need different scenery.
- Any full-art project without a registered scene must keep rendering the current fallback (icon centered on a radial gradient) — do not remove that path.
- No changes to `.holo-shine`, the outer `.tcg-card` border/shine escalation, or gold-foil name treatment (from PR #6) — this plan only replaces what renders *behind* those layers (z-index 0-1, inside `.art-bg`).
- No changes to classic-layout cards (`.layout-classic`), the pack-opening flow beyond what `CardFace` already shares, or any rarity tier outside IR/SIR/SSIR.
- `impala.icon` changes from `⛈️` to `🌡️` in `src/data/cards.js` — this is a data-level fix (the icon is reused elsewhere, e.g. classic-layout `.art`), not scoped only to the full-art scene.

---

### Task 1: Scene infrastructure, data fix, and fallback wiring

**Files:**
- Create: `src/components/FullArtScenes.jsx`
- Modify: `src/components/Card.jsx:25` (replace the inline `art-bg` markup with the new component)
- Modify: `src/data/cards.js:54` (impala icon field)
- Modify: `src/styles/card.css` (append base scene-reset rule after the existing `.layout-fullart .art-bg span` rule, currently line 96)

**Interfaces:**
- Consumes: nothing (new file)
- Produces: `FullArtScene({ project })` component, imported by `Card.jsx` and by Tasks 2-4 (which register scenes into the `FULLART_SCENES` map this task creates). `DefaultFullArtScene({ icon })` is also exported for reuse/reference but not imported elsewhere.

- [ ] **Step 1: Start the dev server and confirm the current (pre-fix) fallback art**

Run: `npm run dev` (leave running in background)

In the Browser pane, navigate to `http://localhost:5173/#/gallery`. Run this in devtools to confirm today's markup:

```js
(function(){
  const jerichoArt = document.querySelector('.tcg-card.rarity-ssir .art-bg');
  return JSON.stringify({
    html: jerichoArt ? jerichoArt.outerHTML.slice(0, 120) : null
  });
})();
```

Expected: `html` shows `<div class="art-bg"><span>🛰️</span></div>` (the current single-icon markup).

- [ ] **Step 2: Create `src/components/FullArtScenes.jsx` with the lookup + fallback**

```jsx
// src/components/FullArtScenes.jsx
// Bespoke full-art background scenes for the flagship IR/SIR/SSIR projects.
// Falls back to a centered icon on a radial gradient for any full-art
// project that doesn't have a registered scene yet.

function DefaultFullArtScene({ icon }) {
  return (
    <div className="art-bg">
      <span>{icon}</span>
    </div>
  );
}

const FULLART_SCENES = {};

export function FullArtScene({ project }) {
  const Scene = FULLART_SCENES[project.id];
  return Scene ? <Scene /> : <DefaultFullArtScene icon={project.icon} />;
}

export { FULLART_SCENES, DefaultFullArtScene };
```

- [ ] **Step 3: Wire `Card.jsx` to render through `FullArtScene`**

In `src/components/Card.jsx`, add the import near the top (after the existing imports on lines 1-3):

```jsx
import { FullArtScene } from './FullArtScenes.jsx';
```

Then find this line (line 25):

```jsx
      {fullArt && <div className="art-bg"><span>{project.icon}</span></div>}
```

Replace it with:

```jsx
      {fullArt && <FullArtScene project={project} />}
```

- [ ] **Step 4: Fix the impala icon in `src/data/cards.js`**

Find this line (line 54, inside the `impala` project object):

```js
    stage: 'Stage 1 · Internship', hp: 650, hpMetric: 'hours', icon: '⛈️',
```

Change `icon: '⛈️'` to `icon: '🌡️'`:

```js
    stage: 'Stage 1 · Internship', hp: 650, hpMetric: 'hours', icon: '🌡️',
```

- [ ] **Step 5: Add the base scene-reset rule to `src/styles/card.css`**

Find this line (currently line 96):

```css
.layout-fullart .art-bg span{filter:drop-shadow(0 10px 24px rgba(0,0,0,.6));}
```

Add this new rule directly after it:

```css
/* bespoke per-project scenes opt out of the generic centered-icon layout;
   each scene class below defines its own internal layout instead */
.art-bg.scene-jericho, .art-bg.scene-weather, .art-bg.scene-tulip{
  display:block;font-size:inherit;opacity:1;
}
```

- [ ] **Step 6: Verify the fallback still renders correctly (map is still empty)**

Reload `http://localhost:5173/#/gallery`. Run:

```js
(function(){
  const jerichoArt = document.querySelector('.tcg-card.rarity-ssir .art-bg');
  const impalaArt = document.querySelector('.tcg-card.rarity-sir .art-bg');
  const tulipArt = document.querySelector('.tcg-card.rarity-ir .art-bg');
  return JSON.stringify({
    jerichoHasSpan: !!jerichoArt?.querySelector('span'),
    impalaIconText: impalaArt?.querySelector('span')?.textContent,
    tulipHasSpan: !!tulipArt?.querySelector('span')
  });
})();
```

Expected: `jerichoHasSpan` and `tulipHasSpan` both `true` (still the fallback icon markup, since `FULLART_SCENES` is empty), `impalaIconText` is `"🌡️"` (confirms the data fix took effect even though the scene itself hasn't been built yet).

- [ ] **Step 7: Commit**

```bash
git add src/components/FullArtScenes.jsx src/components/Card.jsx src/data/cards.js src/styles/card.css
git commit -m "$(cat <<'EOF'
Add full-art scene infrastructure and fix Severe Weather Alert icon

Introduces a FullArtScene lookup component so each flagship IR/SIR/SSIR
project can get a bespoke background scene, falling back to the current
icon+gradient treatment for any project without one registered yet.
Also corrects the Severe Weather Alert System's icon from a storm cloud
to a thermometer -- the project actually detects heatwaves and cold
snaps, not storms.
EOF
)"
```

---

### Task 2: Jericho scene (SSIR)

**Files:**
- Modify: `src/components/FullArtScenes.jsx` (add `JerichoScene`, register in `FULLART_SCENES`)
- Modify: `src/styles/card.css` (append Jericho scene styles)

**Interfaces:**
- Consumes: `FULLART_SCENES` map and `DefaultFullArtScene`/`FullArtScene` exports from Task 1 (already in place)
- Produces: nothing consumed by Tasks 3-4 (each registers its own independent scene)

- [ ] **Step 1: Add the `JerichoScene` component**

In `src/components/FullArtScenes.jsx`, add this function above `const FULLART_SCENES = {};`:

```jsx
function JerichoScene() {
  return (
    <div className="art-bg scene-jericho">
      <div className="jericho-stars" />
      <div className="jericho-horizon" />
      <div className="jericho-hex" />
      <div className="jericho-signal" />
      <div className="jericho-house-glow" />
      <span className="jericho-house">🏠</span>
      <div className="jericho-sat-wrap">
        <div className="jericho-rings">
          <span className="jericho-ring r3" />
          <span className="jericho-ring r2" />
          <span className="jericho-ring r1" />
        </div>
        <span className="jericho-sat">🛰️</span>
      </div>
    </div>
  );
}
```

Then change:

```js
const FULLART_SCENES = {};
```

to:

```js
const FULLART_SCENES = {
  jericho: JerichoScene,
};
```

- [ ] **Step 2: Add the Jericho scene styles**

In `src/styles/card.css`, append this block after the scene-reset rule added in Task 1 (`.art-bg.scene-jericho, .art-bg.scene-weather, .art-bg.scene-tulip{...}`):

```css
/* Jericho (SSIR) — night sky, circuit-skyline horizon, centered satellite
   listening over a small house it watches, connected by a signal line */
.scene-jericho{
  background:linear-gradient(180deg,#2a2c55 0%,#3a3670 32%,#171a2e 68%,#0a0a10 100%);
}
.jericho-stars{
  position:absolute;inset:0;
  background-image:radial-gradient(1.5px 1.5px at 20% 18%, #fff, transparent),
    radial-gradient(1.5px 1.5px at 72% 12%, #fff, transparent),
    radial-gradient(1px 1px at 42% 25%, #fff, transparent),
    radial-gradient(1px 1px at 86% 22%, #fff, transparent),
    radial-gradient(1.5px 1.5px at 58% 8%, #fff, transparent);
  opacity:.7;
}
.jericho-horizon{
  position:absolute;left:-10%;right:-10%;bottom:26%;height:40%;
  background:linear-gradient(180deg, transparent, #0d0e1c 85%);
  clip-path:polygon(0% 70%, 10% 45%, 24% 60%, 38% 25%, 52% 50%, 66% 32%, 80% 55%, 100% 40%, 100% 100%, 0% 100%);
}
.jericho-hex{
  position:absolute;left:14%;bottom:34%;width:30px;height:30px;opacity:.3;
  background:linear-gradient(135deg, transparent 48%, #8b8fe0 49%, #8b8fe0 51%, transparent 52%),
    linear-gradient(45deg, transparent 48%, #8b8fe0 49%, #8b8fe0 51%, transparent 52%);
}
.jericho-sat-wrap{position:absolute;left:50%;top:26%;transform:translate(-50%,-50%);}
.jericho-sat{position:relative;font-size:30px;z-index:2;filter:drop-shadow(0 4px 8px rgba(0,0,0,.6));}
.jericho-rings span{
  position:absolute;left:50%;top:50%;border:1px solid rgba(180,183,240,.5);
  border-radius:50%;transform:translate(-50%,-50%);
}
.jericho-rings .r1{width:50px;height:50px;opacity:.6;}
.jericho-rings .r2{width:83px;height:83px;opacity:.4;}
.jericho-rings .r3{width:115px;height:115px;opacity:.22;}
.jericho-signal{
  position:absolute;left:50%;top:26%;width:1.5px;height:34%;
  background:repeating-linear-gradient(180deg, rgba(180,183,240,.55) 0 4px, transparent 4px 9px);
}
.jericho-house{
  position:absolute;left:50%;bottom:32%;transform:translateX(-50%);
  font-size:23px;filter:drop-shadow(0 3px 6px rgba(0,0,0,.6));
}
.jericho-house-glow{
  position:absolute;left:50%;bottom:29%;width:39px;height:16px;
  transform:translateX(-50%);background:radial-gradient(ellipse, rgba(255,224,140,.35), transparent 70%);
}
```

- [ ] **Step 3: Verify in the browser**

Reload `http://localhost:5173/#/gallery`. Run:

```js
(function(){
  const scene = document.querySelector('.tcg-card.rarity-ssir .scene-jericho');
  return JSON.stringify({
    hasScene: !!scene,
    hasSatellite: !!scene?.querySelector('.jericho-sat'),
    hasHouse: !!scene?.querySelector('.jericho-house'),
    ringCount: scene?.querySelectorAll('.jericho-ring').length
  });
})();
```

Expected: `hasScene` and `hasSatellite` and `hasHouse` all `true`, `ringCount` is `3`.

Also visually confirm: Jericho's card shows a night sky with stars, a jagged skyline silhouette, a satellite centered inside 3 concentric rings, a dotted line running down to a small glowing house, and a faint hex accent lower-left — no giant single icon dominating the card.

- [ ] **Step 4: Commit**

```bash
git add src/components/FullArtScenes.jsx src/styles/card.css
git commit -m "$(cat <<'EOF'
Add Jericho full-art scene

Night sky with stars and a circuit-skyline horizon; a centered satellite
inside three listening rings, connected by a dotted signal line to a
small glowing house on the horizon -- tells the "ambient assistant
watches over a home" story instead of showing the satellite alone.
EOF
)"
```

---

### Task 3: TulipVision scene (IR)

**Files:**
- Modify: `src/components/FullArtScenes.jsx` (add `TulipVisionScene`, register in `FULLART_SCENES`)
- Modify: `src/styles/card.css` (append TulipVision scene styles)

**Interfaces:**
- Consumes: `FULLART_SCENES` map from Task 1
- Produces: nothing consumed elsewhere

- [ ] **Step 1: Add the `TulipVisionScene` component**

In `src/components/FullArtScenes.jsx`, add this function above `const FULLART_SCENES = {`:

```jsx
const TULIP_BACKGROUND = [
  { left: '6%', bottom: '26%', size: 14, opacity: .6 },
  { left: '12%', bottom: '47%', size: 18, opacity: .75 },
  { left: '24%', bottom: '22%', size: 13, opacity: .55 },
  { left: '40%', bottom: '24%', size: 15, opacity: .6 },
  { left: '45%', bottom: '50%', size: 17, opacity: .7 },
  { left: '70%', bottom: '23%', size: 14, opacity: .55 },
  { left: '82%', bottom: '46%', size: 18, opacity: .75 },
  { left: '90%', bottom: '25%', size: 13, opacity: .55 },
  { left: '37%', bottom: '20%', size: 12, opacity: .5 },
  { left: '56%', bottom: '21%', size: 13, opacity: .5 },
];

const TULIP_FOREGROUND = [
  { left: '20%', bottom: '42%', size: 21 },
  { left: '34%', bottom: '38%', size: 25 },
  { left: '50%', bottom: '44%', size: 18 },
  { left: '63%', bottom: '36%', size: 28 },
  { left: '74%', bottom: '41%', size: 20 },
];

const TULIP_DETECTIONS = [
  { left: '29%', bottom: '35%', width: 39, height: 44, tier: 'high', pct: 94 },
  { left: '58%', bottom: '33%', width: 44, height: 48, tier: 'mid', pct: 78 },
  { left: '15%', bottom: '39%', width: 30, height: 32, tier: 'low', pct: 52 },
];

function TulipVisionScene() {
  return (
    <div className="art-bg scene-tulip">
      <div className="tulip-rows" />
      <div className="tulip-glow" />
      {TULIP_BACKGROUND.map((t, i) => (
        <span
          key={`bg-${i}`}
          className="tulip-glyph"
          style={{ left: t.left, bottom: t.bottom, fontSize: t.size, opacity: t.opacity }}
        >🌷</span>
      ))}
      {TULIP_FOREGROUND.map((t, i) => (
        <span
          key={`fg-${i}`}
          className="tulip-glyph"
          style={{ left: t.left, bottom: t.bottom, fontSize: t.size }}
        >🌷</span>
      ))}
      {TULIP_DETECTIONS.map((d) => (
        <div key={d.tier}>
          <div
            className={`tulip-box tulip-box-${d.tier}`}
            style={{ left: d.left, bottom: d.bottom, width: d.width, height: d.height }}
          />
          <div
            className={`tulip-conf tulip-conf-${d.tier}`}
            style={{ left: d.left, bottom: `calc(${d.bottom} + ${d.height + 1}px)` }}
          >R-CNN {d.pct}%</div>
        </div>
      ))}
    </div>
  );
}
```

Then change:

```js
const FULLART_SCENES = {
  jericho: JerichoScene,
};
```

to:

```js
const FULLART_SCENES = {
  jericho: JerichoScene,
  tulip: TulipVisionScene,
};
```

- [ ] **Step 2: Add the TulipVision scene styles**

In `src/styles/card.css`, append this block after the Jericho scene styles added in Task 2:

```css
/* TulipVision (IR) — dusk field with a full spread of tulips; three in the
   foreground carry R-CNN detection boxes at varying confidence, evoking
   the project's actual best-of-four object-detection result */
.scene-tulip{
  background:linear-gradient(180deg,#159487 0%,#0d5a52 35%,#101a22 72%,#0a0a10 100%);
}
.tulip-rows{
  position:absolute;left:0;right:0;bottom:18%;height:62%;opacity:.35;
  background:repeating-linear-gradient(100deg, transparent 0 18px, rgba(255,255,255,.25) 18px 19px);
  mask:linear-gradient(180deg, transparent, #000 60%);
  -webkit-mask:linear-gradient(180deg, transparent, #000 60%);
}
.tulip-glow{
  position:absolute;left:50%;top:48%;width:220px;height:150px;transform:translate(-50%,-50%);
  background:radial-gradient(circle, rgba(255,182,214,.22), transparent 70%);border-radius:50%;
}
.tulip-glyph{position:absolute;filter:drop-shadow(0 3px 6px rgba(0,0,0,.5));}
.tulip-box{position:absolute;border-radius:2px;}
.tulip-box-high{border:1.5px solid #7CFFB2;box-shadow:0 0 6px rgba(124,255,178,.4);}
.tulip-box-mid{border:1.5px solid #ffd166;box-shadow:0 0 6px rgba(255,209,102,.35);}
.tulip-box-low{border:1.5px dashed rgba(255,182,214,.55);}
.tulip-conf{
  position:absolute;font-size:7px;font-weight:800;letter-spacing:.02em;
  padding:1px 3px;border-radius:2px;white-space:nowrap;
}
.tulip-conf-high{background:#7CFFB2;color:#0a2b16;}
.tulip-conf-mid{background:#ffd166;color:#3a2a05;}
.tulip-conf-low{background:rgba(255,182,214,.55);color:#2a0a18;}
```

- [ ] **Step 3: Verify in the browser**

Reload `http://localhost:5173/#/gallery`. Run:

```js
(function(){
  const scene = document.querySelector('.tcg-card.rarity-ir .scene-tulip');
  return JSON.stringify({
    hasScene: !!scene,
    tulipGlyphCount: scene?.querySelectorAll('.tulip-glyph').length,
    boxTiers: [...(scene?.querySelectorAll('.tulip-box') ?? [])].map(b => b.className)
  });
})();
```

Expected: `hasScene` is `true`, `tulipGlyphCount` is `15` (10 background + 5 foreground), `boxTiers` includes three classes containing `tulip-box-high`, `tulip-box-mid`, `tulip-box-low`.

Also visually confirm: a dense field of tulips at varying size/opacity, three of them boxed with green-solid/amber-solid/pink-dashed borders each labeled `R-CNN <pct>%`, faint furrow lines and a soft pink glow — no single giant flower dominating.

- [ ] **Step 4: Commit**

```bash
git add src/components/FullArtScenes.jsx src/styles/card.css
git commit -m "$(cat <<'EOF'
Add TulipVision full-art scene

A dense field of 15 tulips at varying size/opacity for depth, three of
them annotated with R-CNN detection boxes at high/mid/low confidence --
evokes the project's actual best-of-four object-detection result
(Faster R-CNN, F1 0.86) instead of a single generic flower.
EOF
)"
```

---

### Task 4: Severe Weather Alert System scene (SIR)

**Files:**
- Modify: `src/components/FullArtScenes.jsx` (add `SevereWeatherScene`, register in `FULLART_SCENES`)
- Modify: `src/styles/card.css` (append Severe Weather scene styles)

**Interfaces:**
- Consumes: `FULLART_SCENES` map from Task 1 (the `impala.icon` data fix from Task 1 already applies wherever `project.icon` is used elsewhere in the app — this task's scene does not use `project.icon` directly, it hardcodes ☀️/❄️ as scene elements)
- Produces: nothing consumed elsewhere

- [ ] **Step 1: Add the `SevereWeatherScene` component**

In `src/components/FullArtScenes.jsx`, add this function above `const FULLART_SCENES = {`:

```jsx
function SevereWeatherScene() {
  return (
    <div className="art-bg scene-weather">
      <div className="weather-sun" />
      <svg className="weather-wind" viewBox="0 0 100 40" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 10 Q 30 4, 55 10 T 95 8" />
        <path d="M2 22 Q 25 16, 48 22 T 85 20" />
        <path d="M2 33 Q 20 29, 38 33 T 70 31" />
      </svg>
      <span className="weather-snowflake">❄️</span>
      <div className="weather-icing" />
      <div className="weather-icing2" />
    </div>
  );
}
```

Then change:

```js
const FULLART_SCENES = {
  jericho: JerichoScene,
  tulip: TulipVisionScene,
};
```

to:

```js
const FULLART_SCENES = {
  jericho: JerichoScene,
  tulip: TulipVisionScene,
  impala: SevereWeatherScene,
};
```

- [ ] **Step 2: Add the Severe Weather scene styles**

In `src/styles/card.css`, append this block after the TulipVision scene styles added in Task 3:

```css
/* Severe Weather Alert System (SIR) — hard vertical split telling the
   heatwave-vs-cold-snap story: sun + wind on the heat side, snowflake +
   creeping ice-frost on the cold side. No central icon. */
.scene-weather{
  background:linear-gradient(90deg,#e6791f 0%,#c94a1c 46%,#1d2340 52%,#1c3f6b 100%);
}
.weather-sun{
  position:absolute;left:16%;top:16%;width:64px;height:64px;border-radius:50%;
  background:radial-gradient(circle, #ffe9a8, #ffb648 70%);
  box-shadow:0 0 38px 9px rgba(255,182,72,.55);
}
.weather-wind{position:absolute;left:6%;top:38%;width:42%;}
.weather-wind path{fill:none;stroke:#ffe9c8;stroke-width:2.5;stroke-linecap:round;opacity:.75;}
.weather-snowflake{
  position:absolute;right:12%;top:18%;font-size:50px;color:#eaf4ff;
  text-shadow:0 0 14px rgba(160,210,255,.8);filter:drop-shadow(0 4px 10px rgba(0,0,0,.4));
}
.weather-icing{
  position:absolute;right:0;top:0;bottom:0;width:14%;
  background:linear-gradient(90deg, transparent, rgba(200,230,255,.28));
  -webkit-mask-image:repeating-linear-gradient(0deg, #000 0 10px, transparent 10px 16px);
  mask-image:repeating-linear-gradient(0deg, #000 0 10px, transparent 10px 16px);
}
.weather-icing2{
  position:absolute;right:0;top:0;bottom:0;width:5%;
  background:linear-gradient(90deg, transparent, rgba(220,240,255,.55));
}
```

- [ ] **Step 3: Verify in the browser**

Reload `http://localhost:5173/#/gallery`. Run:

```js
(function(){
  const scene = document.querySelector('.tcg-card.rarity-sir .scene-weather');
  return JSON.stringify({
    hasScene: !!scene,
    hasSun: !!scene?.querySelector('.weather-sun'),
    hasWind: !!scene?.querySelector('.weather-wind'),
    hasSnowflake: !!scene?.querySelector('.weather-snowflake'),
    hasIcing: !!scene?.querySelector('.weather-icing')
  });
})();
```

Expected: all five values `true`.

Also visually confirm: a hard vertical split — left half warm orange/red with a glowing sun and curved wind-gust lines, right half deep frost-blue with a snowflake and a subtly striped icy texture creeping in from the right edge. No cloud shapes, no lightning bolt, no central dominant icon.

- [ ] **Step 4: Commit**

```bash
git add src/components/FullArtScenes.jsx src/styles/card.css
git commit -m "$(cat <<'EOF'
Add Severe Weather Alert System full-art scene

A hard vertical split telling the heatwave/cold-snap story directly:
a glowing sun and wind-gust lines on the heat side, a snowflake and
creeping icy-frost texture on the cold side. Replaces earlier storm/
lightning directions that didn't match what the project actually
detects.
EOF
)"
```

---

## Final verification

- [ ] With the dev server running, visit `http://localhost:5173/#/gallery` and inspect all three flagship cards (Jericho SSIR, Severe Weather Alert System SIR, TulipVision IR). Confirm each renders its bespoke scene (not the fallback icon+gradient) and matches its description in the spec.
- [ ] Confirm no other full-art project (there are none currently besides these three, per `src/data/cards.js`) is affected — the `FULLART_SCENES` lookup only intercepts `jericho`/`impala`/`tulip`.
- [ ] Confirm PR #6's border/shine/gold-foil escalation is visually unaffected on all three cards — this plan only touches what renders behind those layers.
- [ ] Confirm the pack-opening flip flow (`CardFace`, shared with the gallery) also shows the new scenes correctly, not just the gallery grid.
- [ ] Run `npm run build` to confirm the changes don't break the production build.
