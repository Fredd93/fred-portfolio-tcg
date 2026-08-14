# Hash-Based Routing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give every meaningful screen state (pack view, pack pull progress, gallery view, open card modal) its own shareable, refresh-safe, hash-based URL, with browser back/forward working naturally.

**Architecture:** A single hand-rolled hook, `useHashRoute`, parses `window.location.hash` into a route object and exposes `navigate(hash)`. `App.jsx` owns routing and passes route-derived props down; `PackOpeningView` and `GalleryView` stop owning view-level state locally and instead read it from props / call `navigate`.

**Tech Stack:** React 19, Vite, Framer Motion. No new dependencies.

## Global Constraints

- No new npm dependency — routing is a hand-rolled hash parser (per spec's "Non-goals").
- URL grammar is exactly the 5 shapes below — do not add more route shapes.
- `flipped` (is the current pull's card face-up) is never part of the URL — always local state, reset to `false` whenever the route's `pull` value changes (per spec's "Non-goals").
- No automated test framework exists in this repo — verification is `npm run build` per task plus a final manual QA pass (per spec's "Testing" section).

**URL grammar** (from `docs/superpowers/specs/2026-08-14-hash-routing-design.md`):

| Hash                  | Meaning                                                    |
|------------------------|-------------------------------------------------------------|
| `` / `#` / `#/`         | Pack view, unopened                                         |
| `#/pack`                | Same as above                                                |
| `#/pack/<n>`             | Pack opened, on pull index `n` (0-based), unflipped         |
| `#/pack/done`            | Pack finished — full pull summary shown                      |
| `#/gallery`              | Full collection view, no modal open                          |
| `#/gallery/<cardId>`     | Full collection view with that project's `CardModal` open   |

Invalid values fall back to that view's default (`#/pack` or `#/gallery`).

---

## Task 1: `useHashRoute` hook

**Files:**
- Create: `src/hooks/useHashRoute.js`

**Interfaces:**
- Consumes: `PACK_ORDER` (array, from `src/data/cards.js`, used for length bound on pull index), `PROJECTS` (array of `{id, ...}`, from `src/data/cards.js`, used to validate `cardId`)
- Produces: `useHashRoute()` — a hook returning `{ route, navigate }` where:
  - `route` is `{ view: 'pack', pull: number | 'done' | null }` or `{ view: 'gallery', card: string | null }`
  - `navigate(hash: string)` — sets `window.location.hash = hash`, which natively pushes a history entry and triggers a `hashchange` event

- [ ] **Step 1: Write the hook**

```js
// src/hooks/useHashRoute.js
import { useCallback, useEffect, useState } from 'react';
import { PACK_ORDER, PROJECTS } from '../data/cards.js';

function parseHash(hash) {
  const clean = hash.replace(/^#\/?/, ''); // strip leading '#' and '/'
  const parts = clean.split('/').filter(Boolean);

  if (parts[0] === 'gallery') {
    const cardId = parts[1];
    const valid = cardId && PROJECTS.some((p) => p.id === cardId);
    return { view: 'gallery', card: valid ? cardId : null };
  }

  // Default view is 'pack' for '', '#', '#/', '#/pack', '#/pack/...'
  const raw = parts[1]; // undefined | 'done' | a number-like string
  if (raw === 'done') {
    return { view: 'pack', pull: 'done' };
  }
  if (raw !== undefined) {
    const n = Number(raw);
    if (Number.isInteger(n) && n >= 0 && n < PACK_ORDER.length) {
      return { view: 'pack', pull: n };
    }
  }
  return { view: 'pack', pull: null };
}

export function useHashRoute() {
  const [route, setRoute] = useState(() => parseHash(window.location.hash));

  useEffect(() => {
    function onHashChange() {
      setRoute(parseHash(window.location.hash));
    }
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const navigate = useCallback((hash) => {
    window.location.hash = hash;
  }, []);

  return { route, navigate };
}
```

- [ ] **Step 2: Verify the build succeeds**

Run: `npm run build`
Expected: build completes with no errors (this file isn't wired in yet, so it won't affect output, but confirms the file has no syntax errors — Vite will fail the build on a parse error even in an unimported file only if it's part of the module graph; since it's not yet imported, this step mainly confirms no other build regressions. Proceed even if unused-file warnings appear.)

- [ ] **Step 3: Commit**

```bash
git add src/hooks/useHashRoute.js
git commit -m "Add useHashRoute hook for hash-based routing"
```

---

## Task 2: Wire routing into `App.jsx`

**Files:**
- Modify: `src/App.jsx` (full rewrite, file is 32 lines)

**Interfaces:**
- Consumes: `useHashRoute()` from Task 1 (`{ route, navigate }`)
- Produces: passes `pull={route.pull}` and `navigate` to `PackOpeningView`; passes `activeCardId={route.card}` and `navigate` to `GalleryView`. These prop names/shapes are relied on by Tasks 3 and 4.

- [ ] **Step 1: Rewrite `App.jsx`**

```jsx
// src/App.jsx
import { useHashRoute } from './hooks/useHashRoute.js';
import GalleryView from './views/GalleryView.jsx';
import PackOpeningView from './views/PackOpeningView.jsx';

export default function App() {
  const { route, navigate } = useHashRoute();

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
        </div>
      </div>

      {route.view === 'pack' ? (
        <PackOpeningView pull={route.pull} navigate={navigate} />
      ) : (
        <GalleryView activeCardId={route.card} navigate={navigate} />
      )}
    </>
  );
}
```

Note: `PackOpeningView` and `GalleryView` don't yet accept these new props — that's Tasks 3 and 4. The app will not run correctly (the old `onGoGallery`/local-state versions will just ignore the new props) until those tasks land. That's expected for this task's scope.

- [ ] **Step 2: Verify the build succeeds**

Run: `npm run build`
Expected: build completes with no errors (JSX syntax and imports are valid, even though downstream views haven't been updated yet).

- [ ] **Step 3: Commit**

```bash
git add src/App.jsx
git commit -m "Wire useHashRoute into App.jsx"
```

---

## Task 3: Refactor `PackOpeningView` to route-driven state

**Files:**
- Modify: `src/views/PackOpeningView.jsx` (full rewrite, file is 136 lines)

**Interfaces:**
- Consumes: props `{ pull: number | 'done' | null, navigate: (hash: string) => void }` from `App.jsx` (Task 2); `PACK_ORDER`, `RARITY` from `src/data/cards.js`; `FlipCard` from `src/components/FlipCard.jsx` (unchanged, not part of this plan)
- Produces: no exports beyond the default component — this view no longer takes an `onGoGallery` prop (replaced by `navigate('#/gallery')` called inline)

- [ ] **Step 1: Rewrite `PackOpeningView.jsx`**

```jsx
// src/views/PackOpeningView.jsx
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FlipCard from '../components/FlipCard.jsx';
import { PACK_ORDER, RARITY } from '../data/cards.js';

export default function PackOpeningView({ pull, navigate }) {
  const [tearing, setTearing] = useState(false);
  const [flipped, setFlipped] = useState(false);

  const total = PACK_ORDER.length;
  const cursor = typeof pull === 'number' ? pull : 0;
  const current = PACK_ORDER[cursor];
  const isLast = cursor === total - 1;

  const stage = tearing
    ? 'opening'
    : pull === 'done'
      ? 'done'
      : pull === null
        ? 'closed'
        : 'revealing';

  useEffect(() => {
    setFlipped(false);
  }, [pull]);

  function openPack() {
    setTearing(true);
    setTimeout(() => {
      setTearing(false);
      navigate('#/pack/0');
    }, 750);
  }

  function reveal() {
    setFlipped(true);
  }

  function next() {
    if (isLast) {
      navigate('#/pack/done');
    } else {
      navigate(`#/pack/${cursor + 1}`);
    }
  }

  function resetPack() {
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
              <FlipCard item={current} index={cursor} total={total} flipped={flipped} onReveal={reveal} />
              <div className="reveal-controls">
                {!flipped ? (
                  <button className="pack-btn" onClick={reveal}>Flip card</button>
                ) : (
                  <button className="pack-btn primary" onClick={next}>
                    {isLast ? 'See the whole pull →' : 'Next card →'}
                  </button>
                )}
              </div>
              <div className="pull-progress">
                {PACK_ORDER.map((_, i) => (
                  <span key={i} className={`dot ${i < cursor ? 'done' : ''} ${i === cursor ? 'active' : ''}`} />
                ))}
              </div>
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

Key changes from the original: `stage`/`cursor` are derived from the `pull` prop instead of local `useState`; `pulled` array is removed (the progress dots use `i < cursor` directly, and the done-stage summary already mapped over `PACK_ORDER` directly, not `pulled`); `openPack`, `next`, `resetPack` call `navigate(...)`; the "Browse the full collection" button calls `navigate('#/gallery')` directly instead of an `onGoGallery` prop.

- [ ] **Step 2: Verify the build succeeds**

Run: `npm run build`
Expected: build completes with no errors.

- [ ] **Step 3: Commit**

```bash
git add src/views/PackOpeningView.jsx
git commit -m "Refactor PackOpeningView to derive state from route"
```

---

## Task 4: Refactor `GalleryView` to route-driven modal state

**Files:**
- Modify: `src/views/GalleryView.jsx` (full rewrite, file is 118 lines)

**Interfaces:**
- Consumes: props `{ activeCardId: string | null, navigate: (hash: string) => void }` from `App.jsx` (Task 2); `PROJECTS`, `SUPPORTERS`, `CERTS`, `TYPES`, `TYPE_SKILLS` from `src/data/cards.js`; `Card` from `src/components/Card.jsx` (unchanged — its `onClick` prop is called with the clicked `project` object, per existing `Card.jsx:126`); `CardModal` from `src/components/CardModal.jsx` (unchanged — takes `project` and `onClose`)
- Produces: no exports beyond the default component

- [ ] **Step 1: Rewrite `GalleryView.jsx`**

```jsx
// src/views/GalleryView.jsx
import Card from '../components/Card.jsx';
import CardModal from '../components/CardModal.jsx';
import { PROJECTS, SUPPORTERS, CERTS, TYPES, TYPE_SKILLS } from '../data/cards.js';

function EnergyPip({ type }) {
  const t = TYPES[type];
  return <span className="energy-pip" style={{ background: t.color }}>{t.code}</span>;
}

export default function GalleryView({ activeCardId, navigate }) {
  const active = activeCardId ? PROJECTS.find((p) => p.id === activeCardId) : null;

  return (
    <div className="wrap">
      <div className="hero">
        <div className="avatar"><span>MF</span></div>
        <div>
          <div className="eyebrow">Trainer ID · Career Set 2026</div>
          <h1 className="trainer-name">Mahmoud "Fred" Farid</h1>
          <div className="trainer-class">
            Trainer class: <b>Solutions Architect / MLOps</b> — final-year IT student (Data &amp; AI + Cloud Computing) · Leiden, NL
          </div>
          <div className="hero-summary">
            Seven years leading e-commerce before pivoting into cloud, ML and software architecture — sole developer
            of a ~92%-accuracy severe-weather ML platform on AWS, trainer of the best-of-four tulip detector (F1 0.86)
            picked for production, and current builder of Jericho, a hexagonally-architected ambient AI assistant.
          </div>
          <div className="contact-row">
            <a className="pill" href="mailto:mahmoudelkassas9893@gmail.com">✉ mahmoudelkassas9893@gmail.com</a>
            <a className="pill" href="https://github.com/Fredd93" target="_blank" rel="noopener noreferrer">⌥ github.com/Fredd93</a>
            <a className="pill" href="https://linkedin.com/in/fred-farid-dev" target="_blank" rel="noopener noreferrer">in linkedin.com/in/fred-farid-dev</a>
            <span className="pill">📍 Leiden, Netherlands</span>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="section-title"><span className="num">HOW TO READ THIS</span> Rarity Guide</div>
        <div className="section-sub">Same as a real booster pack — the higher the tier, the more of the project is actually mine and the bigger the result.</div>
        <div className="legend">
          <div className="legend-item">● <b>Common</b> — small academic build</div>
          <div className="legend-item">◆ <b>Holo Rare</b> — solid, shipped</div>
          <div className="legend-item">★ <b>Reverse Holo</b> — heaviest lift, most commits</div>
          <div className="legend-item" style={{ color: '#e8c15a' }}>★ <b>IR</b> — flagship #3</div>
          <div className="legend-item" style={{ color: '#e8c15a' }}>★★ <b>SIR</b> — flagship #2</div>
          <div className="legend-item" style={{ color: '#e8c15a' }}>★★★ <b>SSIR</b> — top flagship</div>
        </div>
      </div>

      <div className="section">
        <div className="section-title"><span className="num">FULL COLLECTION</span> Projects</div>
        <div className="section-sub">Twelve cards. Click any of them to flip and read the full stats.</div>
        <div className="grid">
          {PROJECTS.map((p, i) => (
            <Card key={p.id} project={p} index={i} total={17} onClick={(project) => navigate(`#/gallery/${project.id}`)} />
          ))}
        </div>
      </div>

      <div className="section">
        <div className="section-title"><span className="num">TRAINER DECK</span> Experience</div>
        <div className="section-sub">Supporter cards — the people-and-process side of the deck.</div>
        <div className="supporter-grid">
          {SUPPORTERS.map((s) => (
            <div className="supporter" key={s.id}>
              <div className="supporter-top"><span>Trainer</span><span>Supporter</span></div>
              <div className="supporter-body">
                <h4>{s.name}</h4>
                <div className="role-meta">{s.sub} · {s.dates}</div>
                <p>{s.text}</p>
                <div className="supporter-rule">{s.rule}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="section">
        <div className="section-title"><span className="num">ENERGY</span> Certifications</div>
        <div className="section-sub">What powers the attacks.</div>
        <div className="energy-grid">
          {CERTS.map((c) => (
            <div className="energy-card" key={c.id}>
              <div className="energy-orb" style={{ background: c.color }}>{c.code}</div>
              <h5>{c.name}</h5>
              <span>{c.sub}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="section">
        <div className="section-title"><span className="num">TYPE CHART</span> Core Skills</div>
        <div className="section-sub">Every attack above draws on one of these.</div>
        <div className="type-chart">
          {Object.entries(TYPES).map(([k, t]) => (
            <div className="type-chip" key={k}>
              <EnergyPip type={k} />
              <div className="tc-body"><b>{t.name}</b><span>{TYPE_SKILLS[k]}</span></div>
            </div>
          ))}
        </div>
      </div>

      <footer>
        Fred TCG · Career Set · Leiden, NL · 2026 — every stat on this page is backed by a repo, a report grade, or a commit log.
        <div className="foot-links">
          <a href="mailto:mahmoudelkassas9893@gmail.com">Email</a>
          <a href="https://github.com/Fredd93" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href="https://linkedin.com/in/fred-farid-dev" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        </div>
      </footer>

      <CardModal project={active} onClose={() => navigate('#/gallery')} />
    </div>
  );
}
```

Key changes from the original: `active` is derived from the `activeCardId` prop via `PROJECTS.find(...)` instead of local `useState`; `Card`'s `onClick` now calls `navigate` with the project's id instead of a local setter; `CardModal`'s `onClose` calls `navigate('#/gallery')`.

- [ ] **Step 2: Verify the build succeeds**

Run: `npm run build`
Expected: build completes with no errors.

- [ ] **Step 3: Commit**

```bash
git add src/views/GalleryView.jsx
git commit -m "Refactor GalleryView to derive active card from route"
```

---

## Task 5: Manual QA pass

**Files:** none (verification only)

- [ ] **Step 1: Start the dev server**

Run: `npm run dev`
Expected: prints a local URL (e.g. `http://localhost:5173/`)

- [ ] **Step 2: Verify default route**

Open the printed URL with no hash. Expected: pack-opening view, unopened ("Tap to open"). Confirm the address bar shows no hash (or `#/` at most).

- [ ] **Step 3: Verify pack progress deep link**

Manually navigate the browser to `<url>#/pack/3`. Expected: pack view loads directly on pull 4 of N (0-indexed 3), card unflipped, "Flip card" button showing. Click "Flip card", confirm the URL does not change (flip state is not routed). Click "Next card →", confirm the address bar hash updates to `#/pack/4`.

- [ ] **Step 4: Verify pack-done deep link**

Manually navigate to `<url>#/pack/done`. Expected: full pull summary grid renders immediately, no need to click through pulls.

- [ ] **Step 5: Verify gallery deep link**

Click "Full Collection" in the nav. Expected: address bar hash becomes `#/gallery`. Click any project card. Expected: hash becomes `#/gallery/<that-project-id>` and the modal opens with that project's details.

- [ ] **Step 6: Verify card-modal deep link on direct load**

Copy the `#/gallery/<id>` URL from Step 5, open it in a fresh tab (or reload the current tab). Expected: gallery renders with that card's modal already open.

- [ ] **Step 7: Verify modal close updates the URL**

With a modal open, click the modal's close (✕) button. Expected: hash returns to `#/gallery`, modal closes.

- [ ] **Step 8: Verify browser back/forward**

From `#/gallery/<id>` (modal open), click the browser Back button. Expected: modal closes, hash becomes `#/gallery`. Click Forward. Expected: modal reopens on the same card.

- [ ] **Step 9: Verify invalid hashes fall back gracefully**

Manually navigate to `<url>#/gallery/not-a-real-project`. Expected: gallery view renders, no modal open, no console error. Manually navigate to `<url>#/pack/9999`. Expected: pack view renders in its unopened ("closed") state, no console error.

- [ ] **Step 10: Stop the dev server**

Stop the process started in Step 1 (Ctrl+C, or if run in background, terminate it).
