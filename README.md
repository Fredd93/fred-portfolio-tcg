# Fred TCG — Portfolio

A Pokémon-TCG-styled portfolio for Mahmoud "Fred" Farid. React + Vite + Framer Motion.

## Quick start

```bash
npm install
npm run dev
```

Then open the printed localhost URL. `npm run build` produces a static `dist/` you can host anywhere
(Netlify, Vercel, GitHub Pages, or just open `dist/index.html` directly).

## What's here

- **Open Pack** (`src/views/PackOpeningView.jsx`) — an Elite-Trainer-Box-style interactive reveal.
  Tap the pack, flip cards one at a time (energy → supporters → commons → holo → reverse holo →
  IR → SIR → SSIR), land on the flagship (Jericho) last.
- **Full Collection** (`src/views/GalleryView.jsx`) — the whole set laid out at once: hero/Trainer ID,
  rarity legend, all 12 project cards, 2 Supporter (experience) cards, 3 Energy (certification) cards,
  and a type chart mapping every attack back to a skill category.
- **Card data** (`src/data/cards.js`) — single source of truth for both views. Every project's
  attacks, HP (est. work hours), weakness/resistance/retreat and flavor text live here. Edit this
  file to change content; the UI updates everywhere automatically.
- **Card visuals** (`src/components/Card.jsx`, `src/components/FlipCard.jsx`, `src/styles/card.css`) —
  two layouts: `layout-classic` (common/holo/reverse-holo, traditional framed card) and
  `layout-fullart` (IR/SIR/SSIR, full-bleed illustration like a modern Illustration Rare).

## Known follow-ups (flagged, not fixed)

- **HP numbers are estimated work hours**, not logged time — sanity-check them against reality,
  they're rough guesses from project duration and are labeled "est." throughout.
- **No real artwork** — cards currently use emoji as placeholder illustrations
  (`icon` field per project in `cards.js`). Swap in real screenshots/renders when ready.
- **Grand Transmission Auto repo** is marked private (needs credential sanitizing before it could
  link out — see `TulipVision_Portfolio_Handoff.md` equivalent note for GTA).
- If `.git/index.lock`, `.git/HEAD.lock`, or a stray file named `t91gtKh` show up as untracked/blocking
  a commit, that's leftover residue from the Cowork sandbox that first scaffolded this repo — safe to
  delete, then commit normally.
