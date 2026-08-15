# Pack-Opening Navigation + Inspect Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let the user revisit already-revealed cards during pack-opening (via arrow buttons and `ArrowLeft`/`ArrowRight`) and open the existing project detail modal on a flipped card, without leaving the pack flow or adding any new URL route shapes.

**Architecture:** `PackOpeningView` tracks which pull indices have actually been flipped in a `Set<number>` (`revealedSet`), so `flipped` becomes a *derived* value (`revealedSet.has(pull)`) instead of a resettable boolean — this is what makes revisiting an already-flipped card show it pre-flipped correctly, with no risk of a stale reset wiping that state. A separate `highestReached` number bounds how far the right arrow will go, so reaching brand-new cards still requires the existing Flip → Next flow. `FlipCard` gains an `onInspect` callback fired when a flipped project card is clicked, which `PackOpeningView` uses to open the existing `CardModal` locally (not routed).

**Tech Stack:** React 19, Vite, Framer Motion. No new dependencies.

## Global Constraints

- No new npm dependency.
- No new URL route shapes — arrow navigation reuses the existing `navigate('#/pack/<n>')` calls already used by "Next card →". The grammar from `docs/superpowers/specs/2026-08-14-hash-routing-design.md` is unchanged.
- Right arrow (`nextPull`) is enabled only while `cursor < highestReached` — it must never let the user skip to a card that hasn't been flipped yet. Reaching a new card still requires the deliberate Flip → Next flow.
- Left arrow (`prevPull`) is enabled whenever `cursor > 0`.
- `flipped` must be a *derived* value from a `Set<number>` of indices actually flipped (`revealedSet`), not a plain `useState(false)` reset on every `pull` change. (The spec's own architecture sketch suggested a conditional reset; that approach has a bug — see "Design note" below — so this plan uses the Set-based approach instead. This is a refinement of the spec's stated *behavior*, not a deviation from it.)
- The pack-opening inspect modal's open/closed state (`modalOpen`) is local component state only — closing it must never call `navigate(...)`.
- Only project-kind pulls (`item.kind === 'project'`) are clickable-to-inspect once flipped. Supporter/energy pulls and not-yet-flipped cards are unaffected.
- No sitewide keyboard-focus audit. Only the two new `.pull-arrow` `<button>` elements get explicit `:focus-visible` styling — they're natively focusable already as real `<button>` elements, so no `tabIndex` or keyboard handling needs to be added to them beyond CSS. The card itself is NOT made keyboard-focusable (no `tabIndex` added to `.tcg-card-wrap`) — this matches the existing gallery `Card.jsx`, which is also mouse-only, and keeps this change scoped to what the spec asked for.
- No automated test framework exists in this repo — verification is `npm run build` per task plus a manual QA pass.

**Design note — why `flipped` must be derived, not reset:** The spec's architecture section described changing the old `useEffect(() => setFlipped(false), [pull])` to conditionally set `true` or `false` based on comparing `cursor` to `highestReached` at the time the effect runs. Working through the actual sequence (flip card at the frontier → arrow back → arrow forward again to the same frontier) shows that approach re-derives `flipped` from a stale comparison and would incorrectly reset an already-flipped frontier card back to unflipped when revisited. Tracking the exact set of flipped indices side-steps the bug entirely: `flipped` for any given `pull` is simply "is `pull` in the set of indices ever flipped," which is unambiguous regardless of navigation order.

---

## Task 1: Pack navigation (arrows + keyboard) and click-to-inspect

**Files:**
- Modify: `src/components/FlipCard.jsx` (full rewrite, file is 38 lines)
- Modify: `src/views/PackOpeningView.jsx` (full rewrite, file is 148 lines)
- Modify: `src/styles/pack.css` (append after the existing `.pull-progress` block, currently lines 45-48)

**Interfaces:**
- Consumes: `CardModal` from `src/components/CardModal.jsx` (unchanged — takes `{ project, onClose }`, already used by `GalleryView.jsx`); `PACK_ORDER`, `RARITY` from `src/data/cards.js` (unchanged imports, already used)
- Produces: `FlipCard` now accepts an additional `onInspect?: () => void` prop, called when a flipped project-kind card is clicked. `PackOpeningView` has no new props (still just `{ pull, navigate }` from `App.jsx`) and no new exports.

- [ ] **Step 1: Rewrite `FlipCard.jsx`**

```jsx
// src/components/FlipCard.jsx
import { motion } from 'framer-motion';
import PackCard from './PackCard.jsx';
import { TYPES } from '../data/cards.js';

function CardBack() {
  return (
    <div className="card-back">
      <div className="mark">F</div>
    </div>
  );
}

export default function FlipCard({ item, index, total, flipped, onReveal, onInspect }) {
  const isProject = item.kind === 'project';
  const typeColor = isProject ? TYPES[item.data.type].color : '#e8c15a';

  function handleClick() {
    if (!flipped) {
      onReveal?.();
    } else if (isProject) {
      onInspect?.();
    }
  }

  return (
    <div className="tcg-card-wrap" onClick={handleClick}>
      <div className="flip-outer">
        <motion.div
          className="flip-inner"
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flip-face flip-front">
            <CardBack />
          </div>
          <div
            className={`flip-face flip-back ${isProject ? `tcg-card rarity-${item.data.rarity}` : ''}`}
            style={isProject ? { '--type-color': typeColor, cursor: flipped ? 'pointer' : 'default' } : undefined}
          >
            <PackCard item={item} index={index} total={total} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
```

Key change from the original: `onClick` is now `handleClick`, which calls `onReveal` when not yet flipped (unchanged behavior) or `onInspect` when already flipped and the item is a project (new). The flip-back face's inline `cursor` style now reads `flipped ? 'pointer' : 'default'` instead of always `'default'`, since a flipped project card is now clickable again (to inspect) rather than inert.

- [ ] **Step 2: Rewrite `PackOpeningView.jsx`**

```jsx
// src/views/PackOpeningView.jsx
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FlipCard from '../components/FlipCard.jsx';
import CardModal from '../components/CardModal.jsx';
import { PACK_ORDER, RARITY } from '../data/cards.js';

export default function PackOpeningView({ pull, navigate }) {
  const [tearing, setTearing] = useState(false);
  const [revealedSet, setRevealedSet] = useState(() => new Set());
  const [highestReached, setHighestReached] = useState(() => (typeof pull === 'number' ? pull : 0));
  const [modalOpen, setModalOpen] = useState(false);
  const timerRef = useRef(null);

  const total = PACK_ORDER.length;
  const cursor = typeof pull === 'number' ? pull : 0;
  const current = PACK_ORDER[cursor];
  const isLast = cursor === total - 1;
  const flipped = typeof pull === 'number' && revealedSet.has(pull);

  const stage = tearing
    ? 'opening'
    : pull === 'done'
      ? 'done'
      : pull === null
        ? 'closed'
        : 'revealing';

  useEffect(() => {
    setTearing(false);
    setModalOpen(false);
  }, [pull]);

  useEffect(() => {
    if (typeof pull === 'number') {
      setHighestReached((h) => Math.max(h, pull));
    }
  }, [pull]);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  useEffect(() => {
    if (stage !== 'revealing') return;
    function onKeyDown(e) {
      if (e.key === 'ArrowLeft' && cursor > 0) {
        e.preventDefault();
        navigate(`#/pack/${cursor - 1}`);
      } else if (e.key === 'ArrowRight' && cursor < highestReached) {
        e.preventDefault();
        navigate(`#/pack/${cursor + 1}`);
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [stage, cursor, highestReached, navigate]);

  function openPack() {
    setTearing(true);
    timerRef.current = setTimeout(() => {
      navigate('#/pack/0');
    }, 750);
  }

  function reveal() {
    setRevealedSet((prev) => {
      const next = new Set(prev);
      next.add(pull);
      return next;
    });
  }

  function next() {
    if (isLast) {
      navigate('#/pack/done');
    } else {
      navigate(`#/pack/${cursor + 1}`);
    }
  }

  function prevPull() {
    if (cursor > 0) navigate(`#/pack/${cursor - 1}`);
  }

  function nextPull() {
    if (cursor < highestReached) navigate(`#/pack/${cursor + 1}`);
  }

  function resetPack() {
    setRevealedSet(new Set());
    setHighestReached(0);
    navigate('#/pack');
  }

  return (
    <div className="wrap pack-wrap">
      <div className="section" style={{ marginTop: 24 }}>
        <div className="section-title"><span className="num">ELITE TRAINER BOX</span> Open the Career Pack</div>
        <div className="section-sub">
          {stage === 'closed' && `One pack, ${total} pulls, one flagship chase card. Tap it.`}
          {stage === 'opening' && 'Tearing it open…'}
          {stage === 'revealing' && `Pull ${cursor + 1} of ${total} — tap the card to flip it.`}
          {stage === 'done' && `That's the whole box. Here's everything that was pulled.`}
        </div>
      </div>

      <div className="pack-stage">
        <AnimatePresence mode="wait">
          {stage === 'closed' && (
            <motion.div
              key="pack"
              className="etb-pack"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              whileHover={{ y: -6 }}
              whileTap={{ scale: 0.97 }}
              onClick={openPack}
            >
              <div className="etb-shine" />
              <div className="etb-label">FRED TCG</div>
              <div className="etb-title">Career Booster Pack</div>
              <div className="etb-sub">{total} cards · 1 guaranteed flagship</div>
              <div className="etb-cta">Tap to open</div>
            </motion.div>
          )}

          {stage === 'opening' && (
            <motion.div
              key="opening"
              className="etb-pack opening"
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.08, 0.4], rotate: [0, -4, 12], opacity: [1, 1, 0] }}
              transition={{ duration: 0.7, times: [0, 0.4, 1] }}
            >
              <div className="etb-label">FRED TCG</div>
              <div className="etb-title">Career Booster Pack</div>
            </motion.div>
          )}

          {stage === 'revealing' && current && (
            <motion.div
              key={`card-${cursor}`}
              className="reveal-stage"
              initial={{ opacity: 0, y: 24, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <FlipCard
                item={current}
                index={cursor}
                total={total}
                flipped={flipped}
                onReveal={reveal}
                onInspect={() => setModalOpen(true)}
              />
              <div className="reveal-controls">
                {!flipped ? (
                  <button className="pack-btn" onClick={reveal}>Flip card</button>
                ) : (
                  <button className="pack-btn primary" onClick={next}>
                    {isLast ? 'See the whole pull →' : 'Next card →'}
                  </button>
                )}
              </div>
              <div className="pull-nav">
                <button
                  className="pull-arrow"
                  onClick={prevPull}
                  disabled={cursor === 0}
                  aria-label="Previous card"
                >
                  ←
                </button>
                <div className="pull-progress">
                  {PACK_ORDER.map((_, i) => (
                    <span key={i} className={`dot ${i < cursor ? 'done' : ''} ${i === cursor ? 'active' : ''}`} />
                  ))}
                </div>
                <button
                  className="pull-arrow"
                  onClick={nextPull}
                  disabled={cursor >= highestReached}
                  aria-label="Next revealed card"
                >
                  →
                </button>
              </div>
              {current.kind === 'project' && (
                <CardModal
                  project={modalOpen ? current.data : null}
                  onClose={() => setModalOpen(false)}
                />
              )}
            </motion.div>
          )}

          {stage === 'done' && (
            <motion.div key="done" className="pull-summary" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="pull-grid">
                {PACK_ORDER.map((item, i) => (
                  <div key={i} className={`pull-thumb rarity-${item.kind === 'project' ? item.data.rarity : 'holo'}`}>
                    <span>{item.kind === 'project' ? item.data.icon : item.kind === 'supporter' ? '🤝' : '⚡'}</span>
                    <b>{item.data.name}</b>
                    <small>{item.kind === 'project' ? RARITY[item.data.rarity].label : item.kind === 'supporter' ? 'Supporter' : 'Energy'}</small>
                  </div>
                ))}
              </div>
              <div className="pull-actions">
                <button className="pack-btn" onClick={resetPack}>Open another pack</button>
                <button className="pack-btn primary" onClick={() => navigate('#/gallery')}>Browse the full collection →</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
```

Key changes from the original: the old `const [flipped, setFlipped] = useState(false);` plus its `useEffect(() => setFlipped(false), [pull])` are gone entirely, replaced by `revealedSet` (a `Set<number>` of every pull index ever flipped this session) and a derived `flipped` value. `highestReached` is new state bounding the right arrow. `modalOpen` is new state for the inspect modal, reset (closed) on every `pull` change alongside the existing `tearing` reset. `reveal()` now adds `pull` to `revealedSet` instead of calling a setter directly. `resetPack()` additionally clears `revealedSet` and `highestReached` back to their fresh-session values. A new keydown-listening `useEffect` handles `ArrowLeft`/`ArrowRight`, scoped to the `revealing` stage only. The JSX gains `prevPull`/`nextPull` arrow buttons wrapping the existing `.pull-progress` dots in a new `.pull-nav` row, and a conditionally-rendered `CardModal` for project-kind pulls.

- [ ] **Step 3: Append arrow-button styles to `pack.css`**

Add this block immediately after the existing `.pull-progress .dot.active{...}` rule (currently `src/styles/pack.css` line 48), before the `/* ---- summary ---- */` comment:

```css
.pull-nav{display:flex;align-items:center;gap:12px;}
.pull-arrow{
  width:32px;height:32px;border-radius:50%;flex-shrink:0;
  background:#1b2030;border:1px solid var(--line);color:var(--ink);
  font-size:14px;cursor:pointer;transition:.15s;
  display:flex;align-items:center;justify-content:center;
}
.pull-arrow:hover:not(:disabled){border-color:var(--gold);}
.pull-arrow:disabled{opacity:.35;cursor:default;}
.pull-arrow:focus-visible{outline:2px solid var(--gold);outline-offset:2px;}
```

The existing `.pull-progress{display:flex;gap:5px;flex-wrap:wrap;max-width:340px;justify-content:center;}` rule is unchanged — it now sits nested inside the new `.pull-nav` flex row alongside the two arrow buttons, per the JSX change in Step 2.

- [ ] **Step 4: Verify the build succeeds**

Run: `npm run build`
Expected: build completes with no errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/FlipCard.jsx src/views/PackOpeningView.jsx src/styles/pack.css
git commit -m "Add pack-opening arrow navigation and click-to-inspect"
```

---

## Task 2: Manual QA pass

**Files:** none (verification only)

- [ ] **Step 1: Start the dev server**

Run: `npm run dev`
Expected: prints a local URL (e.g. `http://localhost:5173/`)

- [ ] **Step 2: Verify basic flip and arrow appearance**

Open the pack (Tap to open). On the first revealed card, confirm: the left arrow (`←`) is visibly disabled (dimmed, `cursor === 0`), the right arrow (`→`) is also disabled (nothing revealed beyond this card yet).

- [ ] **Step 3: Verify left-arrow revisit shows pre-flipped, no re-animation**

Flip the first card, click "Next card →" to reach pull 2. Click the left arrow (`←`). Confirm: you land back on pull 1, it is already showing flipped (no card-back flash, no flip animation replay), and the right arrow (`→`) is now enabled (since pull 2 has been reached).

- [ ] **Step 4: Verify right-arrow boundary — cannot skip unrevealed cards**

From pull 1 (after Step 3), click the right arrow (`→`) to return to pull 2. Confirm pull 2 still shows flipped as you left it (not reset to card-back) and the right arrow is now disabled again (pull 2 is the frontier — nothing beyond it has been revealed).

- [ ] **Step 5: Verify keyboard arrows perform the same navigation**

With focus on the page (not inside an input — there are none), press the `ArrowLeft` key. Confirm it moves back one pull, identically to clicking the `←` button. Press `ArrowRight` to move forward again. Confirm pressing `ArrowRight` at the frontier (nothing further revealed) does nothing.

- [ ] **Step 6: Verify click-to-inspect on a flipped project card**

Navigate to a pull that is a project card (not a supporter/energy card — check by icon/name) and flip it. Click the card again (now flipped). Confirm the `CardModal` opens showing that project's full detail (attacks, weakness/resistance, flavor text). Close the modal via the ✕ button. Confirm the URL hash does not change when the modal opens or closes (still `#/pack/<n>` for whatever pull you're on).

- [ ] **Step 7: Verify supporter/energy cards remain non-clickable after flip**

Navigate to a pull that is a supporter or energy card (certification) and flip it. Click the flipped card again. Confirm nothing happens — no modal opens, consistent with pre-existing behavior.

- [ ] **Step 8: Verify modal auto-closes on navigation**

With the inspect modal open (per Step 6), click the right or left arrow (or press an arrow key) to move to a different pull. Confirm the modal closes automatically rather than staying open over the wrong card's content.

- [ ] **Step 9: Verify `highestReached` resets on "Open another pack"**

Progress through several pulls to reach `#/pack/done`, then click "Open another pack." Confirm you're back at the closed pack state, and after opening it again, the right arrow is disabled on the first card (fresh session, nothing revealed yet) — not still enabled from the previous session's progress.

- [ ] **Step 10: Stop the dev server**

Stop the process started in Step 1 (Ctrl+C, or if run in background, terminate it).
