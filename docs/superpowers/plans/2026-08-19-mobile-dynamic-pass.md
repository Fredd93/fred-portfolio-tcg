# Mobile/Dynamic Pass Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix the Rarity Guide legend overflow bug at narrow viewports, and add an opt-in gyroscope-driven tilt mode for touch devices (falling back to the existing touch-drag tilt) — per `docs/superpowers/specs/2026-08-19-mobile-dynamic-pass-design.md`.

**Architecture:** A module-level pub/sub bus (`motionTiltBus.js`) lets `App.jsx`'s single `window.deviceorientation` listener drive every mounted `Card`'s tilt transform without each card owning its own orientation listener. A `motionTiltEnabled` boolean, lifted to `App.jsx` and set via a touch-only pill button in `top-nav`, gates whether `Card.jsx` uses touch-drag (default) or orientation-driven tilt, and is threaded through `GalleryView` only — `PackOpeningView` uses `FlipCard`, a separate component with no tilt mechanism at all, so it is untouched by this plan.

**Tech Stack:** React (function components + hooks), plain CSS (no CSS modules/framework), no test framework (manual QA via `npm run dev` / `npm run build`, consistent with prior passes in this repo).

## Global Constraints

- No automated test framework exists in this repo — every task's verification step is `npm run build` plus a manual browser check, never a unit test file.
- No localStorage/persistence for `motionTiltEnabled` — session-only state (spec: "Non-goals").
- The gyro-tilt pill must be touch-only: `matchMedia('(hover: none) and (pointer: coarse)').matches`. Never rendered on desktop/mouse.
- Existing shine/tilt CSS (`.holo-shine`, `.art-shine`, the `rotateX`/`rotateY` transform math) must not change — only the input source driving `--mx`/`--my` changes.
- Existing `tiltEnabled` prop on `Card` (mouse-hover gate, default `true`) is unrelated to the new `motionTiltEnabled` prop and must not be renamed or merged.

---

### Task 1: Fix Rarity Guide legend overflow at narrow viewports

**Files:**
- Modify: `src/styles/layout.css:60`

**Interfaces:** None (CSS-only, no JS interface).

- [ ] **Step 1: Make the change**

In `src/styles/layout.css`, change line 60 from:

```css
.legend-item{display:flex;align-items:center;gap:8px;font-size:12px;color:var(--muted);background:#12141f;border:1px solid var(--line);border-radius:10px;padding:6px 10px;}
```

to:

```css
.legend-item{display:flex;align-items:center;gap:8px;font-size:12px;color:var(--muted);background:#12141f;border:1px solid var(--line);border-radius:10px;padding:6px 10px;min-width:0;max-width:100%;}
```

- [ ] **Step 2: Verify with the dev server**

Run:

```bash
npm run dev
```

Open the app in a browser, resize the viewport to 375px wide, and check the "Rarity Guide" section (`HOW TO READ THIS`). Expected: all six legend lines (including the longest, `★★ SIR — flagship #2 — solo, professional, end to end`) wrap their text onto multiple lines within their pill and stay inside the viewport — no horizontal scrollbar on the page, no pill extending past the right edge.

- [ ] **Step 3: Run the build**

```bash
npm run build
```

Expected: exits 0, no errors.

- [ ] **Step 4: Commit**

```bash
git add src/styles/layout.css
git commit -m "fix: let Rarity Guide legend items wrap at narrow viewports"
```

---

### Task 2: Add the motion-tilt pub/sub bus

**Files:**
- Create: `src/utils/motionTiltBus.js`

**Interfaces:**
- Produces: `subscribeTilt(fn: (mx: number, my: number) => void) => () => void` (returns an unsubscribe function), `publishTilt(mx: number, my: number) => void`. Task 3 (`Card.jsx`) calls `subscribeTilt`; Task 4 (`App.jsx`) calls `publishTilt`.

- [ ] **Step 1: Create the module**

Create `src/utils/motionTiltBus.js`:

```js
// src/utils/motionTiltBus.js
// Lightweight pub/sub so a single window-level deviceorientation listener
// (owned by App.jsx) can drive every mounted Card's tilt transform without
// each card registering its own orientation listener.

const listeners = new Set();

export function subscribeTilt(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function publishTilt(mx, my) {
  listeners.forEach((fn) => fn(mx, my));
}
```

- [ ] **Step 2: Verify it loads with no build errors**

```bash
npm run build
```

Expected: exits 0. (No consumer wired up yet, so this only proves the file itself is syntactically valid — the import graph is still fine since nothing imports it yet.)

- [ ] **Step 3: Commit**

```bash
git add src/utils/motionTiltBus.js
git commit -m "feat: add motion-tilt pub/sub bus"
```

---

### Task 3: Wire `Card.jsx` to support orientation-driven tilt

**Files:**
- Modify: `src/components/Card.jsx`

**Interfaces:**
- Consumes: `subscribeTilt` from `src/utils/motionTiltBus.js` (Task 2).
- Consumes (new prop on the default-exported `Card` component): `motionTiltEnabled?: boolean` (default `false`).
- Produces: no new exports — behavior-only change to the existing default export.

- [ ] **Step 1: Make the change**

In `src/components/Card.jsx`:

1. Add the import at the top, alongside the existing imports:

```js
import { subscribeTilt } from '../utils/motionTiltBus.js';
```

2. Change the component signature (currently `export default function Card({ project, index, total, onClick, tiltEnabled = true }) {`) to add the new prop:

```js
export default function Card({ project, index, total, onClick, tiltEnabled = true, motionTiltEnabled = false }) {
```

3. Right after the existing `updateTilt` function definition (the one that takes `clientX, clientY`), add a second function that applies an already-computed `mx`/`my` percentage pair directly (no bounding-rect math needed, since the orientation source isn't a screen coordinate):

```js
  function applyOrientationTilt(mx, my) {
    if (!ref.current) return;
    ref.current.style.setProperty('--mx', `${mx.toFixed(1)}%`);
    ref.current.style.setProperty('--my', `${my.toFixed(1)}%`);
    const rx = ((my - 50) / 50) * -8;
    const ry = ((mx - 50) / 50) * 8;
    ref.current.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
    ref.current.classList.add('tilting');
  }
```

4. Add a `useEffect` that subscribes to the tilt bus only while `motionTiltEnabled` is true, and resets the card's transform (removing `.tilting`) when it turns off. Place it right after the existing `touchmove` `useEffect`:

```js
  useEffect(() => {
    if (!motionTiltEnabled) return;
    const unsubscribe = subscribeTilt(applyOrientationTilt);
    return () => {
      unsubscribe();
      handleLeave();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [motionTiltEnabled]);
```

(`applyOrientationTilt` and `handleLeave` close over `ref` only, which is stable across renders, so omitting them from the dependency array matches the existing pattern already used by the `touchmove` effect in this file, which omits `updateTilt` for the same reason.)

5. Make the existing touch-drag handlers no-ops while orientation tilt is active. Change `handleTouchStart`'s first line from:

```js
  function handleTouchStart(e) {
    if (!tiltEnabled || !e.touches[0]) return;
```

to:

```js
  function handleTouchStart(e) {
    if (!tiltEnabled || motionTiltEnabled || !e.touches[0]) return;
```

And inside the `touchmove` `useEffect`'s existing guard clause (currently `if (!el || !tiltEnabled) return;`), change it to:

```js
    if (!el || !tiltEnabled || motionTiltEnabled) return;
```

(also add `motionTiltEnabled` to that effect's dependency array, which currently reads `[tiltEnabled]` — change it to `[tiltEnabled, motionTiltEnabled]`, so the listener detaches/reattaches correctly when the mode is toggled mid-session).

- [ ] **Step 2: Verify with the dev server**

```bash
npm run dev
```

In the browser's device-toolbar/touch-emulation mode, open the gallery. With `motionTiltEnabled` still `false` everywhere (no consumer passes `true` yet after this task), confirm touch-drag tilt on a card still works exactly as before (drag a finger across a card, it tilts; release, it resets). This proves the new no-op guards don't break the default path.

- [ ] **Step 3: Run the build**

```bash
npm run build
```

Expected: exits 0, no errors, no unused-import warnings.

- [ ] **Step 4: Commit**

```bash
git add src/components/Card.jsx
git commit -m "feat: let Card consume orientation-driven tilt via motion-tilt bus"
```

---

### Task 4: Add the motion-tilt toggle, permission flow, and orientation listener to `App.jsx`

**Files:**
- Modify: `src/App.jsx`
- Modify: `src/styles/layout.css`

**Interfaces:**
- Consumes: `publishTilt` from `src/utils/motionTiltBus.js` (Task 2).
- Produces: `App.jsx` now holds `motionTiltEnabled: boolean` state and passes it to `GalleryView` as a new prop `motionTiltEnabled`, which Task 5 threads down to `Card`.

- [ ] **Step 1: Add the CSS for the new pill and its error text**

In `src/styles/layout.css`, add this block right after the existing `.pill:hover{...}` rule (around line 50):

```css
.motion-tilt-btn{
  display:inline-flex;align-items:center;gap:6px;background:#0f1220;border:1px solid var(--line);
  border-radius:999px;padding:7px 14px;font-size:13px;color:var(--ink);cursor:pointer;transition:.15s;
}
.motion-tilt-btn:hover{border-color:var(--gold);}
.motion-tilt-btn.active{border-color:var(--gold);color:var(--gold);}
.motion-tilt-error{font-size:11px;color:#e88;margin-left:8px;}
```

- [ ] **Step 2: Make the `App.jsx` changes**

Replace the full contents of `src/App.jsx` with:

```js
// src/App.jsx
import { useEffect, useState } from 'react';
import { useHashRoute } from './hooks/useHashRoute.js';
import GalleryView from './views/GalleryView.jsx';
import PackOpeningView from './views/PackOpeningView.jsx';
import { publishTilt } from './utils/motionTiltBus.js';

function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

export default function App() {
  const { route, navigate } = useHashRoute();
  const [isTouchDevice] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(hover: none) and (pointer: coarse)').matches
  );
  const [motionTiltEnabled, setMotionTiltEnabled] = useState(false);
  const [motionTiltError, setMotionTiltError] = useState('');

  useEffect(() => {
    if (!motionTiltEnabled) return;
    function onOrientation(e) {
      const beta = clamp(e.beta ?? 0, -20, 20);
      const gamma = clamp(e.gamma ?? 0, -20, 20);
      const my = ((beta + 20) / 40) * 100;
      const mx = ((gamma + 20) / 40) * 100;
      publishTilt(mx, my);
    }
    window.addEventListener('deviceorientation', onOrientation);
    return () => window.removeEventListener('deviceorientation', onOrientation);
  }, [motionTiltEnabled]);

  async function handleEnableMotionTilt() {
    setMotionTiltError('');
    if (typeof window.DeviceOrientationEvent === 'undefined') {
      setMotionTiltError('Motion access unavailable — using touch-drag instead.');
      return;
    }
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      try {
        const result = await DeviceOrientationEvent.requestPermission();
        if (result === 'granted') {
          setMotionTiltEnabled(true);
        } else {
          setMotionTiltError('Motion access denied — using touch-drag instead.');
        }
      } catch {
        setMotionTiltError('Motion access denied — using touch-drag instead.');
      }
    } else {
      setMotionTiltEnabled(true);
    }
  }

  return (
    <>
      <div className="top-nav">
        <div className="top-nav-inner">
          <div className="brand">Fred<span className="dot">TCG</span></div>
          <div className="tabs">
            <button
              className={`tab-btn ${route.view === 'pack' ? 'active' : ''}`}
              onClick={() => navigate('#/pack')}
            >
              Open Pack
            </button>
            <button
              className={`tab-btn ${route.view === 'gallery' ? 'active' : ''}`}
              onClick={() => navigate('#/gallery')}
            >
              Full Collection
            </button>
          </div>
          {isTouchDevice && (
            <>
              <button
                className={`motion-tilt-btn ${motionTiltEnabled ? 'active' : ''}`}
                onClick={handleEnableMotionTilt}
                disabled={motionTiltEnabled}
              >
                {motionTiltEnabled ? '✓ Motion tilt on' : 'Enable motion tilt'}
              </button>
              {motionTiltError && <span className="motion-tilt-error">{motionTiltError}</span>}
            </>
          )}
        </div>
      </div>

      {route.view === 'pack' ? (
        <PackOpeningView pull={route.pull} navigate={navigate} />
      ) : (
        <GalleryView activeCardId={route.card} navigate={navigate} motionTiltEnabled={motionTiltEnabled} />
      )}
    </>
  );
}
```

- [ ] **Step 3: Verify with the dev server**

```bash
npm run dev
```

In normal (mouse) browser mode: confirm the "Enable motion tilt" pill is **absent** from the top nav, and mouse-hover tilt on cards in the gallery is unchanged.

In the browser's touch-emulation / device-toolbar mode: confirm the pill **appears**. Click it — since desktop Chrome's device emulation doesn't implement `DeviceOrientationEvent.requestPermission`, the click should go straight to the `else` branch and flip the pill to "✓ Motion tilt on" (disabled state) with no error text. This confirms the non-iOS code path.

- [ ] **Step 4: Run the build**

```bash
npm run build
```

Expected: exits 0, no errors.

- [ ] **Step 5: Commit**

```bash
git add src/App.jsx src/styles/layout.css
git commit -m "feat: add opt-in motion-tilt toggle to top nav"
```

---

### Task 5: Thread `motionTiltEnabled` from `GalleryView` down to `Card`

**Files:**
- Modify: `src/views/GalleryView.jsx`

**Interfaces:**
- Consumes: new prop `motionTiltEnabled?: boolean` on `GalleryView` (produced by Task 4's `App.jsx`), and the `motionTiltEnabled` prop on `Card` (produced by Task 3).

- [ ] **Step 1: Make the change**

In `src/views/GalleryView.jsx`:

1. Change the function signature from:

```js
export default function GalleryView({ activeCardId, navigate }) {
```

to:

```js
export default function GalleryView({ activeCardId, navigate, motionTiltEnabled = false }) {
```

2. Change the `Card` usage from:

```jsx
<Card key={p.id} project={p} index={i} total={17} onClick={(project) => navigate(`#/gallery/${project.id}`)} />
```

to:

```jsx
<Card
  key={p.id}
  project={p}
  index={i}
  total={17}
  onClick={(project) => navigate(`#/gallery/${project.id}`)}
  motionTiltEnabled={motionTiltEnabled}
/>
```

- [ ] **Step 2: Verify end-to-end with the dev server**

```bash
npm run dev
```

In the browser's touch-emulation mode (device toolbar), open Full Collection, tap "Enable motion tilt". Since real device-orientation events don't fire from a desktop emulator, confirm instead (via the browser's sensor-override panel if available, or by reading `src/App.jsx`'s `onOrientation` logic) that: (a) touch-drag on a card no longer tilts it once the pill reads "✓ Motion tilt on" (proving the no-op guard from Task 3 fired), and (b) no console errors appear. If the browser used for testing supports a sensors panel (Chrome DevTools → More tools → Sensors → Orientation), use it to drive `beta`/`gamma` values and confirm cards tilt in response.

Then switch back to normal (mouse) mode and confirm the whole gallery — including the Task 1 legend fix — still renders correctly with no regressions: mouse-hover tilt works, Rarity Guide legend text wraps at 375px (re-check by resizing), no horizontal scroll at 375px or 768px anywhere in the page (hero, grid, supporter cards, energy cards, type chart, footer).

- [ ] **Step 3: Run the build**

```bash
npm run build
```

Expected: exits 0, no errors.

- [ ] **Step 4: Commit**

```bash
git add src/views/GalleryView.jsx
git commit -m "feat: thread motionTiltEnabled from App into GalleryView cards"
```

---

## Self-Review Notes

- **Spec coverage:** Part 1 (gyro tilt: pill placement/visibility, permission flow, touch-drag/orientation mutual exclusion, session-only state, all-cards-tilt-together behavior) → Tasks 2–5. Part 2 (legend fix) → Task 1. Part 2's "audited, no fix needed" items require no task (confirmed already compliant in the design doc). Testing section's manual QA steps are folded into each task's own verification step rather than one giant final task, per Task Right-Sizing.
- **Placeholder scan:** no TBD/TODO; every step shows literal code or an exact command.
- **Type consistency:** `subscribeTilt`/`publishTilt` signatures match between Task 2 (bus) and Task 3/4 (consumers). `motionTiltEnabled` prop name and default (`false`) match across `Card.jsx` (Task 3), `App.jsx`→`GalleryView` (Task 4), and `GalleryView`→`Card` (Task 5). `applyOrientationTilt(mx, my)` defined in Task 3 matches the `(mx, my) => void` shape `subscribeTilt` expects.
