# Reverse Holo Effect + Touch-Drag Tilt Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give Holo Rare and Reverse Holo cards visually distinct shine behavior (shine confined to the illustration vs. shine everywhere except the illustration), and add cheap touch-drag tilt/shine tracking reusing the existing hover-driven mechanism.

**Architecture:** `Card.jsx`'s `CardFace` gains a second shine overlay (`.art-shine`) nested inside the classic-layout `.art` element; CSS scopes which shine (`.holo-shine` vs `.art-shine`) is visible per rarity, and uses a z-index bump to let the illustration occlude the whole-card shine for Reverse Holo. The `Card` wrapper's tilt logic is refactored into a shared `updateTilt(clientX, clientY)` function called by both mouse and touch handlers, with a native (non-passive) `touchmove` listener added via `useEffect` so `preventDefault()` actually works for touch-drag.

**Tech Stack:** React 19, Vite, Framer Motion. No new dependencies.

## Global Constraints

- No new npm dependency.
- Both shine effects (`.holo-shine`, `.art-shine`) reuse the exact same shimmer gradient already defined — no new colors, gradient stops, or animation timing.
- No gyroscope/device-tilt support — touch support is drag-tracking only (finger position mirrors the existing `--mx`/`--my` mouse-position mechanism), not `DeviceOrientationEvent`.
- No change to IR/SIR/SSIR (full-art) cards' shine behavior, and no change to `.rarity-common` (still no shine).
- The Reverse Holo occlusion must use the z-index bump on `.art` — not a hand-measured `clip-path`, since `.art` already has `position:relative` in the existing CSS (verified: `.layout-classic .art` already includes `position:relative;overflow:hidden;` — no need to add it).
- No automated test framework exists in this repo — verification is `npm run build` per task plus a manual QA pass.

---

## Task 1: Distinct Holo vs Reverse Holo shine (mouse-hover only)

**Files:**
- Modify: `src/components/Card.jsx` (only the classic-layout `.art` block inside `CardFace`, currently lines 37-42 of the 144-line file)
- Modify: `src/styles/card.css` (currently lines 140-141, the `.tcg-card:hover .holo-shine` and `.rarity-common .holo-shine` rules)

**Interfaces:**
- Consumes: nothing new — `project.rarity` is already read by `CardFace` (via `RARITY[project.rarity]` and the `rarity-${project.rarity}` className already applied by the parent `Card` component).
- Produces: a new `.art-shine` CSS class name that Task 2 will extend (adding a `.tilting` alternate trigger alongside the `:hover` trigger this task introduces).

- [ ] **Step 1: Add the nested `.art-shine` element in `CardFace`**

In `src/components/Card.jsx`, find this block (the classic-layout art render):
```jsx
      {!fullArt && (
        <>
          <div className="art"><span>{project.icon}</span></div>
          <div className="dex-line">{project.context} · {project.dates}</div>
        </>
      )}
```
Replace it with:
```jsx
      {!fullArt && (
        <>
          <div className="art">
            <span>{project.icon}</span>
            <div className="art-shine" />
          </div>
          <div className="dex-line">{project.context} · {project.dates}</div>
        </>
      )}
```

- [ ] **Step 2: Update shine CSS rules in `card.css`**

Find this block (currently the end of the holo-shine comment section):
```css
.tcg-card:hover .holo-shine{opacity:.5;}
.rarity-common .holo-shine{display:none;}
```
Replace it with:
```css
.tcg-card:hover .holo-shine{opacity:.5;}
.rarity-common .holo-shine{display:none;}
.rarity-holo .holo-shine{display:none;}
.rarity-reverseholo .art{z-index:4;}

.art-shine{
  content:"";position:absolute;inset:0;pointer-events:none;
  opacity:0;transition:opacity .2s ease;
  background:linear-gradient(115deg, transparent 25%, #ffe07a 38%, #ff9ecb 46%, #9ecbff 54%, #9effc7 62%, transparent 75%);
  background-size:250% 250%;
  background-position: var(--mx,50%) var(--my,50%);
  mix-blend-mode:overlay;
  display:none;
}
.rarity-holo .art-shine{display:block;}
.tcg-card:hover .art-shine{opacity:.5;}
```

This gives three distinct behaviors:
- **Holo Rare** (`.rarity-holo`): the whole-card `.holo-shine` is hidden; `.art-shine` is shown instead, confined to the `.art` element's own box (since it's `position:absolute;inset:0` inside `.art`, which already has `position:relative`).
- **Reverse Holo** (`.rarity-reverseholo`): the whole-card `.holo-shine` stays visible (unchanged from before), but `.art`'s `z-index:4` (raised above `.holo-shine`'s existing `z-index:3`) makes the illustration paint on top of the shine, occluding it exactly over the art's own rectangle — no shine visible on the illustration, shine remains visible everywhere else on the card.
- **Common**: unchanged, no shine at all (`.rarity-common .holo-shine{display:none;}` already existed; `.art-shine` is `display:none` by default and only turned on for `.rarity-holo`, so commons never show it either).
- **IR/SIR/SSIR** (full-art): unchanged — these rarities never render an `.art` element at all (confirmed by the `{!fullArt && (...)}` guard), so none of the new `.art-shine`/`z-index` rules apply to them; their existing whole-card `.holo-shine` behavior is untouched.

- [ ] **Step 3: Verify the build succeeds**

Run: `npm run build`
Expected: build completes with no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/Card.jsx src/styles/card.css
git commit -m "Distinguish Holo Rare (art-confined shine) from Reverse Holo (shine excludes art)"
```

---

## Task 2: Touch-drag tilt/shine tracking

**Files:**
- Modify: `src/components/Card.jsx` (only the default-exported `Card` component, currently lines 104-143 of the file — `CardFace` and `EnergyPip` are untouched)
- Modify: `src/styles/card.css` (the two shine-trigger rules Task 1 introduced/touched: `.tcg-card:hover .holo-shine{opacity:.5;}` and `.tcg-card:hover .art-shine{opacity:.5;}`)

**Interfaces:**
- Consumes: the `.art-shine`/`.holo-shine` class names from Task 1.
- Produces: no prop/signature change to the exported `Card` component — still `{ project, index, total, onClick, tiltEnabled = true }`.

- [ ] **Step 1: Refactor `Card`'s tilt logic and add touch handlers**

Replace the entire default-exported `Card` function (currently):
```jsx
export default function Card({ project, index, total, onClick, tiltEnabled = true }) {
  const ref = useRef(null);
  const type = TYPES[project.type];

  function handleMove(e) {
    if (!tiltEnabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const mx = ((e.clientX - rect.left) / rect.width) * 100;
    const my = ((e.clientY - rect.top) / rect.height) * 100;
    ref.current.style.setProperty('--mx', `${mx.toFixed(1)}%`);
    ref.current.style.setProperty('--my', `${my.toFixed(1)}%`);
    const rx = ((my - 50) / 50) * -8;
    const ry = ((mx - 50) / 50) * 8;
    ref.current.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
  }
  function handleLeave() {
    if (ref.current) ref.current.style.transform = 'rotateX(0deg) rotateY(0deg)';
  }

  return (
    <motion.div
      className="tcg-card-wrap"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.03, 0.5) }}
    >
      <div
        ref={ref}
        className={`tcg-card rarity-${project.rarity}`}
        style={{ '--type-color': type.color }}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        onClick={() => onClick?.(project)}
      >
        <CardFace project={project} index={index} total={total} />
      </div>
    </motion.div>
  );
}
```
with:
```jsx
export default function Card({ project, index, total, onClick, tiltEnabled = true }) {
  const ref = useRef(null);
  const type = TYPES[project.type];

  function updateTilt(clientX, clientY) {
    if (!tiltEnabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const mx = ((clientX - rect.left) / rect.width) * 100;
    const my = ((clientY - rect.top) / rect.height) * 100;
    ref.current.style.setProperty('--mx', `${mx.toFixed(1)}%`);
    ref.current.style.setProperty('--my', `${my.toFixed(1)}%`);
    const rx = ((my - 50) / 50) * -8;
    const ry = ((mx - 50) / 50) * 8;
    ref.current.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
  }

  function handleMouseMove(e) {
    updateTilt(e.clientX, e.clientY);
  }

  function handleLeave() {
    if (!ref.current) return;
    ref.current.style.transform = 'rotateX(0deg) rotateY(0deg)';
    ref.current.classList.remove('tilting');
  }

  function handleTouchStart(e) {
    if (!tiltEnabled || !e.touches[0]) return;
    ref.current?.classList.add('tilting');
    updateTilt(e.touches[0].clientX, e.touches[0].clientY);
  }

  useEffect(() => {
    const el = ref.current;
    if (!el || !tiltEnabled) return;

    function nativeTouchMove(e) {
      if (!e.touches[0]) return;
      e.preventDefault();
      updateTilt(e.touches[0].clientX, e.touches[0].clientY);
    }

    el.addEventListener('touchmove', nativeTouchMove, { passive: false });
    return () => el.removeEventListener('touchmove', nativeTouchMove);
  }, [tiltEnabled]);

  return (
    <motion.div
      className="tcg-card-wrap"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.03, 0.5) }}
    >
      <div
        ref={ref}
        className={`tcg-card rarity-${project.rarity}`}
        style={{ '--type-color': type.color }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleLeave}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleLeave}
        onTouchCancel={handleLeave}
        onClick={() => onClick?.(project)}
      >
        <CardFace project={project} index={index} total={total} />
      </div>
    </motion.div>
  );
}
```

Also update the import line at the top of the file (currently `import { useRef } from 'react';`) to:
```jsx
import { useEffect, useRef } from 'react';
```

Key points: `updateTilt` is the single source of tilt-calculation logic, called by both `handleMouseMove` (mouse) and the touch paths. `handleTouchStart` uses React's synthetic touch event (fine for a single "did a touch begin" check) and adds the `tilting` class immediately so the shine appears the instant a finger lands, without waiting for the first move. The actual per-frame tracking during a drag uses a **native** `touchmove` listener added via `useEffect` with `{ passive: false }` — this is required because React's synthetic `onTouchMove` is delegated through a passive root listener, so calling `e.preventDefault()` inside a JSX `onTouchMove` prop does not actually prevent page scroll; a native listener registered with `passive: false` is the standard, necessary workaround. `handleLeave` (already existing, reused for `onTouchEnd`/`onTouchCancel`) now also removes the `tilting` class it added.

- [ ] **Step 2: Extend the shine-trigger CSS rules to include `.tilting`**

In `src/styles/card.css`, find the two rules Task 1 left in place:
```css
.tcg-card:hover .holo-shine{opacity:.5;}
```
and
```css
.tcg-card:hover .art-shine{opacity:.5;}
```
Replace them respectively with:
```css
.tcg-card:hover .holo-shine, .tcg-card.tilting .holo-shine{opacity:.5;}
```
and
```css
.tcg-card:hover .art-shine, .tcg-card.tilting .art-shine{opacity:.5;}
```

This is additive only — desktop `:hover` behavior is unchanged; `.tilting` (added/removed by the JS touch handlers) is an alternate trigger for touch devices, where `:hover` doesn't reliably reflect an active touch-drag.

- [ ] **Step 3: Verify the build succeeds**

Run: `npm run build`
Expected: build completes with no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/Card.jsx src/styles/card.css
git commit -m "Add touch-drag tilt/shine tracking, reusing the existing hover-driven mechanism"
```

---

## Task 3: Manual QA pass

**Files:** none (verification only)

- [ ] **Step 1: Start the dev server**

Run: `npm run dev`
Expected: prints a local URL (e.g. `http://localhost:5173/`)

- [ ] **Step 2: Verify Holo Rare shine is confined to the illustration**

Navigate to `#/gallery`. Find a Holo Rare card (e.g. Haarlem Festival or Self-Hosted AI Infrastructure). Hover over it and move the mouse across the whole card. Confirm the shimmer only appears within the illustration/emoji art window, not across the text/stat areas.

- [ ] **Step 3: Verify Reverse Holo shine excludes the illustration**

Find the Reverse Holo card (Grand Transmission Auto). Hover and move the mouse across the whole card. Confirm the shimmer is visible across the frame/text/stat areas but does NOT appear over the illustration window itself.

- [ ] **Step 4: Verify Common cards still show no shine**

Hover over any Common-rarity card (e.g. Chapeau POS). Confirm no shimmer appears anywhere on the card.

- [ ] **Step 5: Verify full-art (IR/SIR/SSIR) cards are unchanged**

Hover over Jericho, Severe Weather Alert System, and TulipVision. Confirm the whole-card shimmer still works exactly as before this change (no regression).

- [ ] **Step 6: Verify touch-drag tracking**

Using the browser's touch-emulation/mobile device mode (or an actual touch device), press and drag a finger across a Holo Rare card and separately across the Reverse Holo card. Confirm: the card tilts (same 3D rotation as mouse hover), the appropriate shine (art-confined for Holo, art-excluded for Reverse Holo) appears during the drag, and the page does not scroll while dragging on the card.

- [ ] **Step 7: Verify releasing touch resets the tilt**

After a touch-drag (Step 6), lift the finger off the card. Confirm the card's tilt transform resets to flat (`rotateX(0deg) rotateY(0deg)`) and the shine fades out, matching `onMouseLeave` behavior.

- [ ] **Step 8: Stop the dev server**

Stop the process started in Step 1 (Ctrl+C, or if run in background, terminate it).
