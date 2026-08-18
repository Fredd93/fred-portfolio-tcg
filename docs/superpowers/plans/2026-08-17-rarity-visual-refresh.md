# Rarity Visual Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bring the card rarity ladder (common/holo/reverse-holo/IR/SIR/SSIR) closer to authentic Pokemon TCG visual conventions: a neutral metallic classic-card border instead of a type-colored one, reverse-holo shine that covers the whole face, and escalating shine/gold-foil/glow treatment across IR → SIR → SSIR.

**Architecture:** Two CSS-only edits to `src/styles/card.css`, split by rarity group (classic tiers vs. full-art tiers). No markup, component, or data changes. No test framework exists in this repo — verification is visual, via the running dev server checked in the Browser pane, plus devtools JS to confirm computed styles/opacity values precisely.

**Tech Stack:** Plain CSS (no preprocessor), React 19 + Vite dev server.

## Global Constraints

- CSS-only changes — do not touch any `.jsx` file or `src/data/cards.js`.
- Use the exact values from the spec (`docs/superpowers/specs/2026-08-17-rarity-visual-refresh-design.md`) — no ad-hoc color/opacity picks.
- Holo (`rarity-holo`) gets no changes — confirmed already correct (art-confined shine).
- `rarity-common` gets no shine changes — only the new metallic border applies to it.
- No changes to `src/styles/pack.css` (`pull-thumb` rarity borders) — out of scope.
- Existing `.holo-shine`/`.art-shine` hover/tilt mechanism (driven by `--mx`/`--my`, toggled via `.tcg-card:hover` / `.tcg-card.tilting`) is reused, not replaced, everywhere in this plan.

---

### Task 1: Classic tier — metallic border, type-color corner wash, full-face reverse-holo shine

**Files:**
- Modify: `src/styles/card.css` (three separate edits, detailed below — search by the selector text shown, since exact line numbers may have shifted since this plan was written)

**Interfaces:**
- Consumes: nothing (pure CSS)
- Produces: nothing consumed by Task 2 — the two tasks touch disjoint rarity groups (common/holo/reverseholo vs. ir/sir/ssir) and can be done in either order

- [ ] **Step 1: Start the dev server and confirm the current (pre-fix) border**

Run: `npm run dev` (leave running in background)

In the Browser pane, navigate to `http://localhost:5173/#/gallery`. Run this in devtools to confirm the current border is type-colored, not metallic:

```js
(function(){
  const card = document.querySelector('.tcg-card.rarity-common') || document.querySelector('.tcg-card.rarity-holo');
  return JSON.stringify({ backgroundImage: getComputedStyle(card).backgroundImage });
})();
```

Expected: the `backgroundImage` contains the project's type color (e.g. a hex matching one of the `TYPES` colors in `src/data/cards.js`), not a grey/silver gradient.

- [ ] **Step 2: Add the metallic border override for common/holo/reverse-holo**

In `src/styles/card.css`, find this block (currently around line 121-123):

```css
/* rarity-specific accents on top of the frame */
.rarity-ssir .tcg-card{background:linear-gradient(155deg,#ffe9a8,var(--gold) 45%,#5a4a1c 80%,#14151f);}
.rarity-ssir .name{font-size:17.5px;}
.rarity-sir .tcg-card{background:linear-gradient(155deg,var(--gold),#8e44ad 55%,#14151f);}
```

Add this new rule directly above it (keep the existing three lines unchanged, immediately below your addition):

```css
.tcg-card.rarity-common, .tcg-card.rarity-holo, .tcg-card.rarity-reverseholo{
  background:linear-gradient(155deg,#e8e8ec,#a4a4ac 45%,#5c5c64 78%,#2b2b30);
}
```

- [ ] **Step 3: Add the type-color corner wash behind the name/HP row**

Find this rule (currently around line 36-39):

```css
.tcg-face.layout-classic{
  background:linear-gradient(180deg,#f6efdd,#efe4c8);
  color:#1c1a12;
}
```

Add a `::before` pseudo-element rule directly after it:

```css
.tcg-face.layout-classic::before{
  content:'';
  position:absolute;inset:0;z-index:0;
  background:radial-gradient(circle at 100% 0%, var(--type-color) 0%, transparent 60%);
  opacity:.25;
  pointer-events:none;
}
```

Then find this rule (currently around line 40-43):

```css
.layout-classic .top-row{
  display:flex;align-items:flex-start;justify-content:space-between;
  padding:6px 8px 0;
}
```

Change it to add `position:relative;z-index:1;` so the name/HP text renders above the new wash:

```css
.layout-classic .top-row{
  position:relative;z-index:1;
  display:flex;align-items:flex-start;justify-content:space-between;
  padding:6px 8px 0;
}
```

- [ ] **Step 4: Extend reverse-holo shine across the whole face, including the art**

Find this line (currently around line 147):

```css
.rarity-reverseholo .art{z-index:4;}
```

Delete it entirely. (This line was elevating the artwork above `.holo-shine`'s `z-index:3` so the shine excluded the art — removing it lets the shine cover the art like the rest of the face, per the design spec.)

- [ ] **Step 5: Verify in the browser**

Reload `http://localhost:5173/#/gallery`. Run:

```js
(function(){
  const commonCard = document.querySelector('.tcg-card.rarity-common');
  const holoCard = document.querySelector('.tcg-card.rarity-holo');
  const revCard = document.querySelector('.tcg-card.rarity-reverseholo');
  const revArt = revCard ? revCard.querySelector('.art') : null;
  return JSON.stringify({
    commonBorderIsMetallic: commonCard ? getComputedStyle(commonCard).backgroundImage.includes('232, 232, 236') : null,
    holoBorderIsMetallic: holoCard ? getComputedStyle(holoCard).backgroundImage.includes('232, 232, 236') : null,
    reverseArtZIndex: revArt ? getComputedStyle(revArt).zIndex : null,
    washPresent: getComputedStyle(document.querySelector('.tcg-face.layout-classic'), '::before').backgroundImage !== 'none'
  });
})();
```

Expected: `commonBorderIsMetallic` and `holoBorderIsMetallic` both `true` (the metallic gradient's first stop `#e8e8ec` is `rgb(232, 232, 236)`), `reverseArtZIndex` is `"auto"` (not `"4"`), `washPresent` is `true`.

Also visually confirm: common/holo/reverse-holo cards show a silver-to-black metallic border (not tinted by project type), a faint colored glow behind the name on the top-right, and hovering/tilting a reverse-holo card shows the rainbow shine crossing the artwork (not stopping at its edge).

- [ ] **Step 6: Commit**

```bash
git add src/styles/card.css
git commit -m "$(cat <<'EOF'
Give classic-tier cards a metallic border and extend reverse-holo shine to the art

Real Pokemon TCG cards use a neutral silver-to-black metallic border
regardless of type -- type identity shows up only as a faint corner wash,
not the frame color. Also fixes reverse holo to shine across the whole
face (art included) instead of excluding the artwork, matching the
Ho-Oh/Chien-Pao/Xerneas reference cards.
EOF
)"
```

---

### Task 2: Full-art tier — IR border, escalating shine, gold-foil name, SSIR glow

**Files:**
- Modify: `src/styles/card.css` (five separate edits, detailed below — search by selector text, since Task 1 may have shifted line numbers)

**Interfaces:**
- Consumes: nothing from Task 1 (disjoint rarity groups)
- Produces: nothing consumed elsewhere

- [ ] **Step 1: Confirm current (pre-fix) full-art shine and padding**

With the dev server running, on `http://localhost:5173/#/gallery`, run:

```js
(function(){
  const ir = document.querySelector('.tcg-card.rarity-ir');
  const sir = document.querySelector('.tcg-card.rarity-sir');
  return JSON.stringify({
    irPadding: ir ? getComputedStyle(ir).padding : null,
    irShineOpacity: ir ? getComputedStyle(ir.querySelector('.holo-shine')).opacity : null,
    sirShineOpacity: sir ? getComputedStyle(sir.querySelector('.holo-shine')).opacity : null
  });
})();
```

Expected: `irPadding` is `"9px"` (the shared default), and both shine opacities are `"0"` at rest (no tier-specific base opacity yet).

- [ ] **Step 2: Add thinner padding for all three full-art tiers**

Find this rule (currently around line 13-23):

```css
.tcg-card{
  position:relative;
  width:100%;height:100%;
  border-radius:16px;
  padding:9px;
  background:linear-gradient(155deg, var(--type-color), #14151f 78%);
  box-shadow:0 10px 24px -10px rgba(0,0,0,.65), 0 2px 0 rgba(255,255,255,.05) inset;
  cursor:pointer;
  transform-style:preserve-3d;
  transition:box-shadow .25s ease;
}
```

Do not modify it. Instead, add a new rule in the "rarity-specific accents" section (currently around line 120-123, alongside the `.rarity-ssir .tcg-card` / `.rarity-sir .tcg-card` rules):

```css
.tcg-card.rarity-ir, .tcg-card.rarity-sir, .tcg-card.rarity-ssir{
  padding:4px;
}
```

- [ ] **Step 3: Add the IR gold border**

In the same "rarity-specific accents" section, add:

```css
.rarity-ir .tcg-card{background:linear-gradient(155deg,#caa858,#5a4a1c 60%,#14151f);}
```

- [ ] **Step 4: Add the SSIR outer glow**

Find the existing SSIR rule:

```css
.rarity-ssir .tcg-card{background:linear-gradient(155deg,#ffe9a8,var(--gold) 45%,#5a4a1c 80%,#14151f);}
```

Change it to add a box-shadow glow on top of the base card shadow:

```css
.rarity-ssir .tcg-card{
  background:linear-gradient(155deg,#ffe9a8,var(--gold) 45%,#5a4a1c 80%,#14151f);
  box-shadow:0 0 20px -2px var(--gold), 0 10px 24px -10px rgba(0,0,0,.65), 0 2px 0 rgba(255,255,255,.05) inset;
}
```

- [ ] **Step 5: Add gold-foil name text for SIR and SSIR**

In the same section, add (this is additive — it does not replace the existing `.rarity-ssir .name{font-size:17.5px;}` rule, which stays):

```css
.rarity-sir .name, .rarity-ssir .name{
  background:linear-gradient(180deg,#fff6da,var(--gold));
  -webkit-background-clip:text;background-clip:text;color:transparent;
  text-shadow:0 1px 0 rgba(0,0,0,.3);
}
```

- [ ] **Step 6: Add escalating shine opacity per tier**

Find the "holo shine overlay" section (currently around line 133-150):

```css
/* holo shine overlay, position driven by --mx/--my custom props set on hover */
.holo-shine, .art-shine{
  position:absolute;inset:0;pointer-events:none;
  opacity:0;transition:opacity .2s ease;
  background:linear-gradient(115deg, transparent 25%, #ffe07a 38%, #ff9ecb 46%, #9ecbff 54%, #9effc7 62%, transparent 75%);
  background-size:250% 250%;
  background-position: var(--mx,50%) var(--my,50%);
  mix-blend-mode:overlay;
}
.holo-shine{z-index:3;}
.art-shine{display:none;}
.tcg-card:hover .holo-shine, .tcg-card.tilting .holo-shine{opacity:.5;}
.rarity-common .holo-shine{display:none;}
.rarity-holo .holo-shine{display:none;}

.rarity-holo .art-shine{display:block;}
.tcg-card:hover .art-shine, .tcg-card.tilting .art-shine{opacity:.5;}
```

Add this block directly after `.rarity-holo .holo-shine{display:none;}` (before the blank line and the `.rarity-holo .art-shine` rule):

```css
.rarity-ir .holo-shine{opacity:.12;}
.tcg-card.rarity-ir:hover .holo-shine, .tcg-card.rarity-ir.tilting .holo-shine{opacity:.25;}

.rarity-sir .holo-shine{opacity:.18;}
.tcg-card.rarity-sir:hover .holo-shine, .tcg-card.rarity-sir.tilting .holo-shine{opacity:.6;}

.rarity-ssir .holo-shine{opacity:.25;}
.tcg-card.rarity-ssir:hover .holo-shine, .tcg-card.rarity-ssir.tilting .holo-shine{opacity:.75;}
```

- [ ] **Step 7: Verify in the browser**

Reload `http://localhost:5173/#/gallery`. Run:

```js
(function(){
  const ir = document.querySelector('.tcg-card.rarity-ir');
  const sir = document.querySelector('.tcg-card.rarity-sir');
  const ssir = document.querySelector('.tcg-card.rarity-ssir');
  return JSON.stringify({
    irPadding: ir ? getComputedStyle(ir).padding : null,
    irShineRestOpacity: ir ? getComputedStyle(ir.querySelector('.holo-shine')).opacity : null,
    sirShineRestOpacity: sir ? getComputedStyle(sir.querySelector('.holo-shine')).opacity : null,
    ssirShineRestOpacity: ssir ? getComputedStyle(ssir.querySelector('.holo-shine')).opacity : null,
    sirNameColor: sir ? getComputedStyle(sir.querySelector('.name')).color : null,
    ssirBoxShadow: ssir ? getComputedStyle(ssir).boxShadow : null
  });
})();
```

Expected: `irPadding` is `"4px"`; rest-state shine opacities are `"0.12"`, `"0.18"`, `"0.25"` for IR/SIR/SSIR respectively; `sirNameColor` is `"rgba(0, 0, 0, 0)"` (transparent, since the gradient clip takes over via `background-clip:text`); `ssirBoxShadow` includes a shadow using the gold color in addition to the existing dark shadow.

Also visually confirm: IR has a thin gold border and a barely-visible shimmer that brightens on hover/tilt; SIR has a visibly gold-foil name and a brighter shine; SSIR has the brightest shine plus a visible glow around the card edge.

- [ ] **Step 8: Commit**

```bash
git add src/styles/card.css
git commit -m "$(cat <<'EOF'
Escalate shine and gold treatment across IR/SIR/SSIR full-art cards

Full-art tiers previously looked identical apart from the outer border
gradient. Adds a thin gold IR border, tier-specific resting/hover shine
opacity (IR faint, SIR bright, SSIR brightest), gold-foil name text on
SIR/SSIR, an SSIR outer glow, and thinner padding matching the minimal
borders on real full-art/SIR reference cards.
EOF
)"
```

---

## Final verification

- [ ] With the dev server running, visit `http://localhost:5173/#/gallery` and inspect at least one card of each of the six rarities (common, holo, reverseholo, ir, sir, ssir). Confirm each matches its spec description, and that common/holo/reverse-holo cards no longer show a type-colored border.
- [ ] Hover/tilt a card of each shine-bearing rarity (holo, reverseholo, ir, sir, ssir) and confirm the shine escalates as described — holo confined to art, reverseholo/ir/sir/ssir covering the full face at increasing intensity.
- [ ] Run `npm run build` to confirm the CSS changes don't break the production build.
