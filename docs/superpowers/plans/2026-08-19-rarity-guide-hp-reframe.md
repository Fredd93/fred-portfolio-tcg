# Rarity Guide HP/Rarity Reframe Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rewrite the Rarity Guide copy in the gallery view so it no longer implies rarity tier correlates with HP/size, replacing it with the authentic framing (rarity = ownership/role, HP = separate raw-volume stat).

**Architecture:** Single-file copy edit — no component structure, data, or styling changes. `src/views/GalleryView.jsx` renders a static JSX block for the Rarity Guide section; only the text content of the intro sentence and the six legend items changes.

**Tech Stack:** React (JSX), Vite dev server, no test framework (verify via `npm run dev` + browser + `npm run build`).

## Global Constraints

- No test framework exists in this repo — verification is `npm run dev` + manual browser check, plus `npm run build` to confirm no build errors. (spec: Testing)
- No changes to `src/data/cards.js`, `Card.jsx`, or `CardModal.jsx` — HP values, `hpMetric`, and rarity assignments stay exactly as they are. (spec: Decision, Out of scope)
- Only the Rarity Guide section (`src/views/GalleryView.jsx` lines ~38-47) changes — no other section, styling, or markup structure changes. (spec: Decision)
- Exact copy to use (spec: Copy changes):
  - Intro (`section-sub`): `Same as a real booster pack — rarity tracks ownership and role, not size. HP is raw project volume, on its own axis; a Common can out-code a flagship.`
  - Legend items, in order:
    - `● Common — academic build, supporting role`
    - `◆ Holo Rare — shipped solo, or led the room`
    - `★ Reverse Holo — sole dev, heaviest personal commit share`
    - `★ IR — flagship #3 — team capstone, client-facing lead` (gold color, unchanged)
    - `★★ SIR — flagship #2 — solo, professional, end to end` (gold color, unchanged)
    - `★★★ SSIR — top flagship — solo-architected, ongoing` (gold color, unchanged)

---

### Task 1: Rewrite Rarity Guide copy

**Files:**
- Modify: `src/views/GalleryView.jsx:38-47`

**Interfaces:**
- Consumes: nothing new — this is a static JSX text change inside the existing `GalleryView` component.
- Produces: nothing consumed elsewhere — this is the final task in the plan.

- [ ] **Step 1: Read the current section to confirm exact existing markup**

Read `src/views/GalleryView.jsx` lines 36-49. Confirm it matches:

```jsx
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
```

If the file differs from this (e.g. already edited), stop and reconcile before proceeding.

- [ ] **Step 2: Replace the block with the new copy**

Replace the block from Step 1 with:

```jsx
      <div className="section">
        <div className="section-title"><span className="num">HOW TO READ THIS</span> Rarity Guide</div>
        <div className="section-sub">Same as a real booster pack — rarity tracks ownership and role, not size. HP is raw project volume, on its own axis; a Common can out-code a flagship.</div>
        <div className="legend">
          <div className="legend-item">● <b>Common</b> — academic build, supporting role</div>
          <div className="legend-item">◆ <b>Holo Rare</b> — shipped solo, or led the room</div>
          <div className="legend-item">★ <b>Reverse Holo</b> — sole dev, heaviest personal commit share</div>
          <div className="legend-item" style={{ color: '#e8c15a' }}>★ <b>IR</b> — flagship #3 — team capstone, client-facing lead</div>
          <div className="legend-item" style={{ color: '#e8c15a' }}>★★ <b>SIR</b> — flagship #2 — solo, professional, end to end</div>
          <div className="legend-item" style={{ color: '#e8c15a' }}>★★★ <b>SSIR</b> — top flagship — solo-architected, ongoing</div>
        </div>
      </div>
```

- [ ] **Step 3: Start the dev server and visually verify**

Run: `npm run dev` (or reuse an already-running dev server)

In the browser, navigate to the gallery view and scroll to the "Rarity Guide" section. Confirm:
- The intro sentence reads the new copy (no "bigger the result" language).
- All six legend lines show the new text, in the same order, with IR/SIR/SSIR still gold (`#e8c15a`).
- No layout breakage (lines wrap normally, no overflow).

- [ ] **Step 4: Run the production build to confirm no errors**

Run: `npm run build`
Expected: build completes with no errors.

- [ ] **Step 5: Commit**

```bash
git add src/views/GalleryView.jsx
git commit -m "Reframe Rarity Guide copy around ownership/role instead of size"
```
