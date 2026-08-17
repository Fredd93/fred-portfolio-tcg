# Classic-Card Readability Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix the stage-pill badge so it hugs its own text instead of stretching to match the card name, and darken classic-layout body text colors so they clear WCAG-AA contrast on both the cream and tan card backgrounds.

**Architecture:** Two isolated CSS-only edits to `src/styles/card.css`. No markup, component, or data changes. No test framework exists in this repo (`package.json` has no test script) — verification is visual, via the running dev server (`npm run dev`), checked in the Browser pane.

**Tech Stack:** Plain CSS (no preprocessor), React 19 + Vite dev server.

## Global Constraints

- CSS-only changes — do not touch `src/components/Card.jsx` or any `.jsx` file.
- Classic layout only (`.layout-classic` selectors) — do not modify `.layout-fullart` color rules (per spec: full-art already measures fine, out of scope).
- The stage-pill width fix applies to **both** `.layout-classic .stage-pill` and `.layout-fullart .stage-pill` (same underlying bug in both — see spec "Root cause 1"), but the contrast/color fix is classic-only.
- Use the exact hex values from the spec (`docs/superpowers/specs/2026-08-17-classic-card-readability-design.md`) — no ad-hoc color picks.
- No alignment/padding changes to the stage-pill beyond the width fix (user explicitly chose "width fix only").

---

### Task 1: Fix stage-pill to hug its own text

**Files:**
- Modify: `src/styles/card.css:44-47` (`.layout-classic .stage-pill`)
- Modify: `src/styles/card.css:93-96` (`.layout-fullart .stage-pill`)

**Interfaces:**
- Consumes: nothing (pure CSS, no new selectors or props)
- Produces: nothing consumed by later tasks — Task 2 is independent

- [ ] **Step 1: Start the dev server and confirm the current bug**

Run: `npm run dev` (leave running in background)

In the Browser pane, navigate to `http://localhost:5173/#/gallery` and open the browser devtools console. Run this to confirm the pill is currently stretched:

```js
(function(){
  const card = document.querySelector('.layout-classic');
  const pill = card.querySelector('.stage-pill');
  const name = card.querySelector('.name');
  return JSON.stringify({
    pillWidth: pill.getBoundingClientRect().width,
    nameWidth: name.getBoundingClientRect().width
  });
})();
```

Expected: `pillWidth` equals (or is very close to) `nameWidth` — confirming the bug (the pill is borrowing the name's width).

- [ ] **Step 2: Edit `.layout-classic .stage-pill`**

In `src/styles/card.css`, change:

```css
.layout-classic .stage-pill{
  font-size:8px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;
  background:#1c1a12;color:#f6efdd;border-radius:5px;padding:2px 6px;
}
```

to:

```css
.layout-classic .stage-pill{
  display:inline-block;
  font-size:8px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;
  background:#1c1a12;color:#f6efdd;border-radius:5px;padding:2px 6px;
}
```

- [ ] **Step 3: Edit `.layout-fullart .stage-pill`**

In `src/styles/card.css`, change:

```css
.layout-fullart .stage-pill{
  font-size:8px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;
  background:rgba(255,255,255,.14);color:#f4efe0;border-radius:5px;padding:2px 6px;
}
```

to:

```css
.layout-fullart .stage-pill{
  display:inline-block;
  font-size:8px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;
  background:rgba(255,255,255,.14);color:#f4efe0;border-radius:5px;padding:2px 6px;
}
```

- [ ] **Step 4: Verify the fix in the browser**

Reload `http://localhost:5173/#/gallery`. Re-run the same devtools snippet from Step 1 against a classic card, and also check a full-art card:

```js
(function(){
  const classic = document.querySelector('.layout-classic');
  const fullart = document.querySelector('.layout-fullart');
  const out = {};
  if (classic) {
    const pill = classic.querySelector('.stage-pill');
    const name = classic.querySelector('.name');
    out.classic = { pillWidth: pill.getBoundingClientRect().width, nameWidth: name.getBoundingClientRect().width, pillText: pill.textContent };
  }
  if (fullart) {
    const pill = fullart.querySelector('.stage-pill');
    const name = fullart.querySelector('.name');
    out.fullart = { pillWidth: pill.getBoundingClientRect().width, nameWidth: name.getBoundingClientRect().width, pillText: pill.textContent };
  }
  return JSON.stringify(out);
})();
```

Expected: `pillWidth` is now noticeably smaller than `nameWidth` in both layouts, and roughly matches the pixel width the text itself would need (a few px of padding on top of the raw text width) — not stretched to the name's width anymore. Visually confirm on 2-3 different cards with different name lengths that the pill sizes differ appropriately per-card while still tightly wrapping each one's own label text.

- [ ] **Step 5: Commit**

```bash
git add src/styles/card.css
git commit -m "$(cat <<'EOF'
Fix stage-pill to hug its own text instead of stretching to sibling width

.stage-pill was a block-level div with no width, so it filled its non-flex
parent's content width -- which was driven by the card name next to it.
display:inline-block makes it size to its own text, matching the reference
card's tight badge look and fixing the per-card width inconsistency.
EOF
)"
```

---

### Task 2: Darken classic-card body text colors for contrast

**Files:**
- Modify: `src/styles/card.css:54` (`.layout-classic .hp small`)
- Modify: `src/styles/card.css:63` (`.layout-classic .dex-line`)
- Modify: `src/styles/card.css:71` (`.layout-classic .atk-text`)
- Modify: `src/styles/card.css:76-78` (`.layout-classic .wrr`, `.layout-classic .flavor`, `.layout-classic .foot`)

**Interfaces:**
- Consumes: nothing (pure CSS)
- Produces: nothing consumed elsewhere

- [ ] **Step 1: Confirm the current contrast failure**

With the dev server still running, in the Browser pane devtools console on `http://localhost:5173/#/gallery`, run:

```js
(function(){
  function luminance(r,g,b){
    const a=[r,g,b].map(v=>{v/=255;return v<=0.03928?v/12.92:Math.pow((v+0.055)/1.055,2.4);});
    return a[0]*0.2126+a[1]*0.7152+a[2]*0.0722;
  }
  function contrast(hex1,hex2){
    const p = h => [1,3,5].map(i=>parseInt(h.slice(i,i+2),16));
    const l1=luminance(...p(hex1))+0.05, l2=luminance(...p(hex2))+0.05;
    return (l1>l2? l1/l2 : l2/l1).toFixed(2);
  }
  return JSON.stringify({
    footOnBottom: contrast('6b6552','e9dcb6'),
    flavorOnBottom: contrast('5c5745','e9dcb6')
  });
})();
```

Expected: `footOnBottom` is around `4.26` (fails the 4.5:1 WCAG AA threshold for small text).

- [ ] **Step 2: Edit the color values in `src/styles/card.css`**

Change line 54 from:

```css
.layout-classic .hp small{font-size:8px;color:#6b6552;font-weight:700;}
```

to:

```css
.layout-classic .hp small{font-size:8px;color:#4a4636;font-weight:700;}
```

Change line 63 from:

```css
.layout-classic .dex-line{
  padding:4px 9px 2px;font-size:8px;font-style:italic;color:#6b6552;border-bottom:1px solid #d8cca0;
}
```

to:

```css
.layout-classic .dex-line{
  padding:4px 9px 2px;font-size:8px;font-style:italic;color:#4a4636;border-bottom:1px solid #d8cca0;
}
```

Change line 71 from:

```css
.layout-classic .atk-text{font-size:9.3px;color:#4a4636;margin-top:1px;}
```

to:

```css
.layout-classic .atk-text{font-size:9.3px;color:#3d3924;margin-top:1px;}
```

Change lines 76-78 from:

```css
.layout-classic .wrr{display:flex;justify-content:space-between;font-size:8px;font-weight:700;color:#4a4636;}
.layout-classic .flavor{font-size:8.3px;font-style:italic;color:#5c5745;margin:4px 0;}
.layout-classic .foot{display:flex;justify-content:space-between;align-items:center;font-size:7.6px;color:#6b6552;}
```

to:

```css
.layout-classic .wrr{display:flex;justify-content:space-between;font-size:8px;font-weight:700;color:#3d3924;}
.layout-classic .flavor{font-size:8.3px;font-style:italic;color:#3d3924;margin:4px 0;}
.layout-classic .foot{display:flex;justify-content:space-between;align-items:center;font-size:7.6px;color:#4a4636;}
```

- [ ] **Step 3: Verify the fix in the browser**

Reload the page and re-run the contrast check from Step 1 with the new colors:

```js
(function(){
  function luminance(r,g,b){
    const a=[r,g,b].map(v=>{v/=255;return v<=0.03928?v/12.92:Math.pow((v+0.055)/1.055,2.4);});
    return a[0]*0.2126+a[1]*0.7152+a[2]*0.0722;
  }
  function contrast(hex1,hex2){
    const p = h => [1,3,5].map(i=>parseInt(h.slice(i,i+2),16));
    const l1=luminance(...p(hex1))+0.05, l2=luminance(...p(hex2))+0.05;
    return (l1>l2? l1/l2 : l2/l1).toFixed(2);
  }
  return JSON.stringify({
    footOnBottom: contrast('4a4636','e9dcb6'),
    flavorOnBottom: contrast('3d3924','e9dcb6'),
    atkTextOnCream: contrast('3d3924','efe4c8')
  });
})();
```

Expected: `footOnBottom` ~6.9, `flavorOnBottom` ~8.5, `atkTextOnCream` well above 7 — all clear of the 4.5:1 AA threshold. Also visually scan the gallery view (`#/gallery`) to confirm classic cards read clearly against both the cream top and tan bottom panel, and that full-art (IR/SIR/SSIR) cards are visually unchanged.

- [ ] **Step 4: Commit**

```bash
git add src/styles/card.css
git commit -m "$(cat <<'EOF'
Darken classic-card body text for WCAG-AA contrast

Footer text measured 4.26:1 against the tan .bottom panel background,
failing WCAG AA for small text. Collapsed the three near-identical muddy
brown-grey tones into two deliberately darker tiers so every classic-card
text color clears ~7:1+ on its background.
EOF
)"
```

---

## Final verification

- [ ] With the dev server running, visit `http://localhost:5173/#/gallery` and inspect at least one card of each classic rarity (common, holo, reverse-holo) plus one full-art card. Confirm: stage-pill badges are tightly sized per-card, classic-card text is crisp and legible, full-art cards are unchanged.
- [ ] Run `npm run build` to confirm the CSS changes don't break the production build.
