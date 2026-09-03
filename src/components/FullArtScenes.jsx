// src/components/FullArtScenes.jsx
// Bespoke full-art background scenes for the flagship IR/SIR/SSIR projects.
// Falls back to a centered icon on a radial gradient for any full-art
// project that doesn't have a registered scene yet.

import { Fragment, useEffect, useState } from 'react';
import { JerichoMascot, TulipMascot, ImpalaMascot } from './MascotArt.jsx';

function DefaultFullArtScene({ icon }) {
  return (
    <div className="art-bg">
      <span>{icon}</span>
    </div>
  );
}

// Jericho (Hyper Rare) — "Mending, late afternoon."
//
// Late sun rakes across Fred's desk; he is mid-repair on one of Node's three
// units, panel open and warm inside; it holds still for him with its eyes shut
// and one ear turned his way; the other two hover close, watching.
//
// Staged as a Character Rare — the card type whose defined purpose is "the bond
// between a Pokemon and its Trainer." Fred flagged one (Magnemite 242/236, illus.
// Fumie Kitaoka) as his perfect example of story on a card without knowing that
// was what it was called. The subject of this illustration is the relationship,
// which is the correct frame for "an assistant that is always there for you."
//
// Reading order, and it closes into a loop: window (brightest) -> down the beam
// -> onto A's open amber panel -> up Fred's forearm -> his face -> back down his
// gaze to his hand -> to A's closed eye -> and A's turned ear points back up to
// him. The loop is the relationship.
//
// Coordinate frame is 242x346, matching .tcg-face. Clear art band is y 78-225.
// Three explicit planes per the atmospheric-perspective rule: the room is
// scrimmed back 16%, the desk and Fred sit untouched in the middle, and Node
// plays at full saturation in front. That separation is what depth is; it is not
// a blur filter, and it is directly observable on Kitaoka's card, where the three
// background Magnemite are flat desaturated grey with no rendering at all.

// Pegboard perforations — cheap, and they read as a real workshop surface.
const PEG_ROWS = Array.from({ length: 9 }, (_, r) => r);
const PEG_COLS = Array.from({ length: 18 }, (_, c) => c);

// Dust in the beam. Nothing says warm interior faster and nothing is cheaper.
const MOTES = [
  { x: 44, y: 150, r: 0.9, dur: 17, delay: 0 },
  { x: 68, y: 186, r: 0.7, dur: 21, delay: 3.5 },
  { x: 92, y: 214, r: 1.1, dur: 14, delay: 1.2 },
  { x: 34, y: 196, r: 0.6, dur: 19, delay: 6.1 },
  { x: 58, y: 122, r: 0.8, dur: 22, delay: 8.4 },
  { x: 104, y: 176, r: 0.7, dur: 16, delay: 4.7 },
  { x: 80, y: 138, r: 1.0, dur: 20, delay: 10.2 },
];

// ~14 large four-point stars with long thin spikes, concentrated inside the
// sunbeam where dust genuinely catches light. Corrected off Electrode CRE
// 222/198, whose glitter is a dozen-odd BIG stars, not a scatter of small ones —
// which also merges the hyper-rare convention with the scene's own physics
// instead of sprinkling sparkles over a background.
const SPARKLES = [
  { x: 30, y: 96, s: 1.3, d: 0 }, { x: 52, y: 128, s: 0.8, d: 2.4 },
  { x: 40, y: 168, s: 1.7, d: 5.1 }, { x: 74, y: 148, s: 1.0, d: 1.3 },
  { x: 62, y: 200, s: 1.2, d: 6.8 }, { x: 96, y: 186, s: 0.85, d: 3.7 },
  { x: 24, y: 140, s: 1.1, d: 8.2 }, { x: 36, y: 112, s: 1.5, d: 4.4 },
  { x: 88, y: 158, s: 0.9, d: 7.6 }, { x: 56, y: 176, s: 1.25, d: 2.9 },
  { x: 18, y: 152, s: 0.75, d: 9.4 }, { x: 106, y: 190, s: 1.05, d: 5.8 },
  { x: 66, y: 96, s: 0.9, d: 6.3 }, { x: 100, y: 124, s: 1.4, d: 1.8 },
];

// Warm/pastel wedges. Jittered angular spacing on purpose — evenly spaced rays
// read as a loading spinner. Fires on wake as delight, not as discharge.
const RAY_JITTER = [
  0, 19, 33, 51, 68, 79, 97, 113, 129, 141, 158, 174,
  191, 203, 219, 236, 248, 264, 281, 293, 309, 327, 341, 352,
];

// Index through little finger, splayed slightly and reaching toward Node.
const FINGERS = [
  'M140,175 C130,177 122,180 116,183',
  'M141,180 C131,183 123,186 117,189',
  'M141,185 C133,188 126,190 121,193',
  'M140,189 C134,192 129,194 125,196',
];

function JerichoScene() {
  return (
    <div className="art-bg scene-jericho">
      <svg
        className="jericho-scene"
        viewBox="0 0 242 346"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Fred at his workbench in late afternoon sun, repairing one of Node's three units while the other two hover close"
      >
        <defs>
          {/* Halftone, not crosshatch. Crosshatch reads etched and serious;
              halftone reads printed, soft and playful, and blends at thumbnail
              size into a soft tone rather than a scratchy one. Sourced to
              Deoxys VSTAR GG46/GG70, which fills its whole background with them. */}
          <pattern id="j-half-coarse" width="3" height="3" patternUnits="userSpaceOnUse">
            <circle cx="1.5" cy="1.5" r="0.62" fill="#8a6a52" />
          </pattern>
          <pattern id="j-half-fine" width="1.6" height="1.6" patternUnits="userSpaceOnUse">
            <circle cx="0.8" cy="0.8" r="0.34" fill="#7a5742" />
          </pattern>

          <linearGradient id="j-sky" x1="0" y1="1" x2="0.15" y2="0">
            <stop offset="0" stopColor="#ffd894" />
            <stop offset="0.3" stopColor="#f9b45a" />
            <stop offset="1" stopColor="#79aed6" />
          </linearGradient>
          {/* A real wall has a big value change across it because something is
              lighting it. This range is deliberately wide: Node is the coolest,
              brightest, cleanest thing in the frame and it needs a dark ground
              to pop against, which is Kitaoka's exact device — his silver
              Magnemite reads because the workshop behind it is deep brown. */}
          <linearGradient id="j-wall" x1="0.04" y1="0.05" x2="0.98" y2="0.4">
            <stop offset="0" stopColor="#f2dfba" />
            <stop offset="0.22" stopColor="#c9a476" />
            <stop offset="0.5" stopColor="#8a6640" />
            <stop offset="0.82" stopColor="#5c412a" />
            <stop offset="1" stopColor="#4a3322" />
          </linearGradient>
          {/* the room falls off away from the window — this is what stops the
              whole frame sitting in one compressed mid-tone band. Centred on the
              visible wall, not on the rect, since the desk hides its lower half. */}
          <radialGradient id="j-falloff" cx="0.14" cy="0.34" r="0.8">
            <stop offset="0.2" stopColor="#33200f" stopOpacity="0" />
            <stop offset="1" stopColor="#33200f" stopOpacity="0.72" />
          </radialGradient>
          {/* the lower third is composed pale on purpose (the Kayama principle)
              so the text scrim over it can stay weak and the ink can be dark */}
          <linearGradient id="j-desk" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#7a4f28" />
            <stop offset="0.16" stopColor="#a87445" />
            <stop offset="0.36" stopColor="#d0a374" />
            <stop offset="0.62" stopColor="#e2c39a" />
            <stop offset="1" stopColor="#f0dcbc" />
          </linearGradient>
          <linearGradient id="j-beam" x1="0" y1="0" x2="0.4" y2="1">
            <stop offset="0" stopColor="#fbe3b4" stopOpacity="0.62" />
            <stop offset="0.55" stopColor="#f7d08a" stopOpacity="0.34" />
            <stop offset="1" stopColor="#e8a33d" stopOpacity="0.08" />
          </linearGradient>

          <clipPath id="j-beam-clip">
            <path d="M8,58 L62,54 L142,240 L28,254Z" />
          </clipPath>

          <filter id="j-grain" x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <filter id="j-soft" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="3.2" />
          </filter>
          <filter id="j-soft-sm" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="1.4" />
          </filter>
          <radialGradient id="j-ray-mask">
            <stop offset="0.3" stopColor="#fff" stopOpacity="1" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
          <mask id="j-ray-fade">
            <circle cx="80" cy="168" r="86" fill="url(#j-ray-mask)" />
          </mask>
        </defs>

        {/* ================= PLANE 3 — the room ================= */}
        <g className="j-plane-room">
          <rect x="0" y="0" width="242" height="200" fill="url(#j-wall)" />
          {/* pegboard perforations */}
          <g className="j-peg-holes">
            {PEG_ROWS.map((r) => PEG_COLS.map((c) => (
              <circle key={`${r}-${c}`} cx={82 + c * 9} cy={26 + r * 15} r="1.1" />
            )))}
          </g>

          {/* ---- window, cropped by the left edge ---- */}
          <g className="j-window">
            <rect x="-4" y="55" width="74" height="95" fill="url(#j-sky)" />
            <ellipse cx="16" cy="78" rx="17" ry="6.5" className="j-cloud" />
            <ellipse cx="50" cy="96" rx="13" ry="5" className="j-cloud" />
            {/* a distant rooftop line, so the window looks out at somewhere */}
            <path className="j-rooftop" d="M-4,138 L8,138 L14,130 L20,138 L34,138 L34,126 L46,126 L46,138 L58,138 L64,132 L70,138 L70,150 L-4,150Z" />
            <g className="j-muntin">
              <rect x="33" y="55" width="3.4" height="95" />
              <rect x="-4" y="88" width="74" height="3.4" />
              <rect x="-4" y="118" width="74" height="3.4" />
            </g>
            <rect className="j-window-frame" x="-6" y="53" width="78" height="99" />
            <path className="j-sill" d="M-6,150 H74 L78,158 H-6Z" />
            <path className="j-sill-shadow" d="M-6,158 H78 L74,163 H-6Z" />
          </g>

          {/* ---- shelf and what is on it ---- */}
          <path className="j-shelf" d="M76,70 H242 V76 H76Z" />
          <path className="j-shelf-lip" d="M76,70 H242" />
          <path className="j-shelf-shadow" d="M76,76 H242 L242,92 C200,88 140,86 76,90Z" />
          {/* stack of four books */}
          <g className="j-books">
            <rect x="88" y="44" width="24" height="6.5" rx="1" fill="#8c5a3c" />
            <rect x="90" y="50" width="22" height="6" rx="1" fill="#6f7f5a" />
            <rect x="87" y="56" width="25" height="6.5" rx="1" fill="#a8603f" />
            <rect x="89" y="62.5" width="23" height="7.5" rx="1" fill="#5d6b7a" />
          </g>
          {/* three jars of screws */}
          <g className="j-jars">
            <path d="M120,52 h11 v18 h-11Z" fill="#cfe0e2" opacity="0.8" />
            <path d="M120,62 h11 v8 h-11Z" fill="#a98b5e" />
            <rect x="119" y="49" width="13" height="4" rx="1" fill="#8a7a63" />
            <path d="M136,55 h10 v15 h-10Z" fill="#cfe0e2" opacity="0.8" />
            <path d="M136,63 h10 v7 h-10Z" fill="#b5936a" />
            <rect x="135" y="52" width="12" height="4" rx="1" fill="#8a7a63" />
            <path d="M150,57 h9 v13 h-9Z" fill="#cfe0e2" opacity="0.8" />
            <path d="M150,64 h9 v6 h-9Z" fill="#9c7f58" />
            <rect x="149" y="54" width="11" height="4" rx="1" fill="#8a7a63" />
          </g>
          {/* mug of pens */}
          <g className="j-penmug">
            <path d="M164,56 h14 v14 h-14Z" fill="#d8cbb0" />
            <path d="M178,59 a4,4 0 0 1 0,7" fill="none" stroke="#d8cbb0" strokeWidth="2" />
            <path d="M167,56 L165,44 M171,56 L172,42 M175,56 L177,46" stroke="#8a6a52" strokeWidth="1.6" strokeLinecap="round" />
          </g>
          {/* small trailing plant */}
          <g className="j-plant">
            <path d="M198,58 h15 v12 h-15Z" fill="#a8603f" />
            <path d="M205,58 C205,48 199,44 196,40 M205,58 C205,50 211,47 215,44 M205,58 C204,52 208,54 212,58"
              fill="none" stroke="#5f8a52" strokeWidth="1.6" strokeLinecap="round" />
            <ellipse cx="196" cy="39" rx="3.6" ry="2.6" fill="#6d9a5c" />
            <ellipse cx="216" cy="43" rx="3.2" ry="2.3" fill="#7ba869" />
            <ellipse cx="213" cy="58" rx="2.8" ry="2" fill="#5f8a52" />
            {/* one vine trailing over the shelf edge */}
            <path d="M212,70 C214,78 210,84 213,92" fill="none" stroke="#5f8a52" strokeWidth="1.4" strokeLinecap="round" />
            <ellipse cx="213" cy="93" rx="2.6" ry="1.9" fill="#6d9a5c" />
          </g>

          {/* ---- hung on the pegboard ---- */}
          <g className="j-tools">
            {/* soldering iron on its stand */}
            <path className="j-tool-line" d="M86,92 L104,112" />
            <path d="M84,88 h6 v8 h-6Z" fill="#b8442f" />
            <path d="M88,95 L102,110" stroke="#8a7a63" strokeWidth="2.4" strokeLinecap="round" fill="none" />
            <path d="M82,112 a10,6 0 0 0 20,0" fill="none" stroke="#7d8590" strokeWidth="2" />
            <path d="M86,118 h14 v3 h-14Z" fill="#6b7280" />
            {/* coil of hookup wire */}
            <g className="j-coil">
              <circle cx="120" cy="100" r="9.5" fill="none" stroke="#c0392b" strokeWidth="2.6" />
              <circle cx="120" cy="100" r="5.5" fill="none" stroke="#c0392b" strokeWidth="2.2" opacity="0.75" />
            </g>
            {/* pliers */}
            <path d="M100,128 L96,150 M104,128 L108,150" stroke="#7d8590" strokeWidth="2.6" strokeLinecap="round" fill="none" />
            <path d="M99,126 L105,126 L102,133Z" fill="#8a9099" />
            <path d="M97,141 h10 v5 h-10Z" fill="#b8442f" opacity="0.85" />
            {/* roll of tape */}
            <circle cx="124" cy="126" r="8" fill="#d9c48a" />
            <circle cx="124" cy="126" r="3.4" fill="#a8703f" />
            {/* rolled cable */}
            <path d="M84,132 q7,5 0,10 q-7,5 0,10" fill="none" stroke="#4a4a52" strokeWidth="2.4" strokeLinecap="round" />
            {/* small speaker grille — Jericho is voice, so the room has ears too */}
            <rect x="106" y="158" width="18" height="14" rx="2" fill="#5a5148" />
            <g className="j-grille">
              <circle cx="110" cy="162" r="0.9" /><circle cx="115" cy="162" r="0.9" /><circle cx="120" cy="162" r="0.9" />
              <circle cx="110" cy="166" r="0.9" /><circle cx="115" cy="166" r="0.9" /><circle cx="120" cy="166" r="0.9" />
            </g>
          </g>

          {/* pinned photo, at a slight angle */}
          <g className="j-photo" transform="rotate(-4 180 40)">
            <rect x="164" y="24" width="32" height="26" fill="#f4ecdc" />
            <rect x="167" y="27" width="26" height="17" fill="#9db4c0" />
            <path d="M167,44 L175,34 L181,40 L187,32 L193,44Z" fill="#6f8a72" />
            <circle cx="180" cy="25" r="1.8" fill="#c0392b" />
          </g>
          {/* wall calendar with one month's grid */}
          <g className="j-calendar">
            <rect x="204" y="22" width="32" height="30" fill="#f2ead8" />
            <rect x="204" y="22" width="32" height="6" fill="#b8674a" />
            {[0, 1, 2, 3].map((r) => (
              <path key={r} d={`M206,${32 + r * 5} H234`} stroke="#c9b99a" strokeWidth="0.7" />
            ))}
            {[0, 1, 2, 3, 4, 5].map((c) => (
              <path key={c} d={`M${207 + c * 5},30 V50`} stroke="#c9b99a" strokeWidth="0.7" />
            ))}
          </g>

          {/* coarse halftone over the whole room plane */}
          <rect className="j-halftone-coarse" x="0" y="0" width="242" height="200" fill="url(#j-half-coarse)" />
          {/* and the scrim that pushes this plane back */}
          <rect className="j-room-scrim" x="0" y="0" width="242" height="200" />
          {/* light falloff away from the window, over everything in the room */}
          <rect className="j-falloff" x="0" y="0" width="242" height="200" fill="url(#j-falloff)" />
        </g>

        {/* ================= PLANE 2 — desk and Fred ================= */}
        {/* Fred sits behind the desk, so he is drawn first */}
        {/* ---------------- Fred ----------------
            Built off the anatomy Kitaoka actually draws on Magnemite 242/236,
            because the previous pass was an oval with a beard pasted on and read
            as an avatar sticker rather than a person. What a Pokemon TCG human
            has, and what was missing: a skull that narrows to a real jaw and
            chin; a bold nose as one of the most prominent features; eyes with
            sclera, iris and a heavy tapering upper lid rather than two arcs; a
            drawn ear; hair as separate pointed locks rather than a helmet; and
            hard-edged two-tone cel shadows on skin and cloth. Line weight varies
            hard -- very heavy on the silhouette and the eyelids, thin on the
            cheek and collar creases.

            He is also bigger. Surge's head is about 21% of his card's height;
            this is now ~17%, up from 12.7%, because he is half the relationship
            the illustration is about. */}
        <g className="j-fred">
          {/* torso. The far shoulder rides higher because he is leaning in over
              the work -- a level shoulder line reads as a mannequin. */}
          <path className="j-fred-torso" d="M144,232 C142,186 155,156 177,148 C207,139 238,148 248,180 L248,232Z" />
          <path className="j-fred-shade" d="M206,155 C228,158 242,170 248,190 L248,232 L216,232Z" />
          {/* folded collar with two lapel points and a placket, per the uniform */}
          <path className="j-fred-collar" d="M171,153 L186,175 L204,149 L196,144 L186,161 L178,147Z" />
          <path className="j-fred-placket" d="M186,175 L188,232" />
          <path className="j-fred-seam" d="M164,160 C158,172 155,190 156,206" />

          {/* neck, thick, with the hard cast shadow the jaw throws on it */}
          <path className="j-fred-neck" d="M175,122 C175,134 177,144 186,150 C195,144 199,134 199,122Z" />
          <path className="j-fred-neck-shade" d="M175,122 C175,132 177,140 183,146 C186,138 186,130 185,122Z" />

          {/* skull: broad cranium narrowing through the cheekbone to a jaw
              angle and a defined chin */}
          <path className="j-fred-face" d="M162,102 C162,85 170,73 185,73 C201,73 208,85 208,101 C208,112 206,120 201,127 C197,132 191,135 184,135 C176,135 169,130 166,121 C163,114 162,108 162,102Z" />
          {/* ear, at the jaw hinge */}
          <path className="j-fred-ear" d="M163,99 C157,97 154,102 155,108 C156,114 161,116 165,114Z" />
          <path className="j-fred-ear-in" d="M161,103 C159,104 159,108 161,110" />
          {/* hard-edged shadow shape on the side away from the window */}
          <path className="j-fred-face-shade" d="M196,80 C204,88 208,94 208,101 C208,112 206,120 201,127 C198,131 193,134 187,135 C195,126 199,112 198,98 C197,90 197,84 196,80Z" />
          {/* nose — a wedge with a tip and one nostril line, not an absence */}
          <path className="j-fred-nose" d="M180,97 C178,102 174,107 175,110 C176,112 180,112 182,110" />
          <path className="j-fred-nose-sh" d="M175.5,110.5 C177.5,111.5 180,111.5 181.5,110.5" />

          {/* eyes cast down toward the work: sclera, iris, heavy upper lid */}
          <ellipse className="j-fred-sclera" cx="176" cy="100.6" rx="4.6" ry="2.8" />
          <ellipse className="j-fred-sclera" cx="195" cy="100.6" rx="4.3" ry="2.6" />
          <circle className="j-fred-iris" cx="174.4" cy="102.2" r="2.5" />
          <circle className="j-fred-iris" cx="193.4" cy="102.2" r="2.4" />
          <path className="j-fred-lid" d="M171.2,100.2 C173.5,98.7 178.8,98.7 181,100 M190.6,100.2 C192.8,98.7 197.6,98.7 199.4,100" />
          <path className="j-fred-brow" d="M170,91.5 C173.5,89 180,89.2 183.5,91 M189.5,91 C193,89.2 199.5,89 202.5,91.5" />

          {/* hair as separate locks, receding at the temples */}
          <path className="j-fred-hair" d="M161,101 C159,84 168,71 185,71 C202,71 210,83 209,99 C207,90 203,84 197,81 C199,86 199,90 198,93 C195,86 189,82 181,82 C172,82 165,89 161,101Z" />
          <path className="j-fred-hair-lock" d="M167,84 C171,78 178,75 185,76 C177,77 171,80 167,84Z M196,78 C202,81 206,87 207,93 C204,86 200,81 196,78Z" />
          <path className="j-fred-hair-hi" d="M172,80 C177,76 184,75 190,76" />

          {/* full beard following the jawline, and a moustache */}
          <path className="j-fred-beard" d="M164,104 C165,118 169,128 176,133 C179,135 190,135 194,132 C201,127 205,117 206,103 C204,114 199,120 192,122 C186,124 180,124 175,122 C169,119 165,113 164,104Z" />
          <path className="j-fred-tache" d="M178,113.4 C181,112 189,112 192,113.4 C189,114.9 181,114.9 178,113.4Z" />
          {/* the mouth stays visible between moustache and beard — a dark mass
              across the whole lower face reads as a smudge, not as a person */}
          <path className="j-fred-lip" d="M179,118.5 C182.5,120.5 188.5,120.5 192,118.5" />

          {/* thin metal glasses, with a temple arm running back to the ear */}
          <g className="j-fred-glasses">
            <rect x="169" y="93" width="15" height="11" rx="3.4" />
            <rect x="188" y="93" width="14" height="10.5" rx="3.4" />
            <path d="M184,97 h4" />
            <path d="M169,96 L162,100" />
          </g>
          {/* warm sun rim down his window-side contour */}
          <path className="j-fred-rim" d="M164,84 C160,90 158,96 158,102 M158,162 C150,172 146,186 145,200" />
        </g>

        <g className="j-desk">
          <path d="M-6,176 H216 L236,346 H-6Z" fill="url(#j-desk)" />
          {/* hard specular streak where the sun catches the back lip */}
          <path className="j-desk-lip" d="M-6,176 H216" />
          <path className="j-desk-edge" d="M216,176 L236,346" />
          {/* fine halftone on the shaded right of the desk */}
          <rect className="j-halftone-fine" x="150" y="176" width="92" height="170" fill="url(#j-half-fine)" />
        </g>

        {/* Desk props: pale and low-contrast on purpose (the Kayama principle)
            so the scrim over them can stay a warm haze rather than a panel — but
            properly drawn, with outlines and cast shadows. The Rotom IR's lower
            third is genuinely busy; what makes its text read is that the objects
            down there are pale, not that they are absent. */}
        <g className="j-deskprops">
          <path className="j-prop-shadow" d="M148,206 h50 l8,7 h-50Z" />
          <path className="j-notebook" d="M146,190 h46 l7,14 h-46Z" />
          <path className="j-notebook-edge" d="M146,190 h46 l7,14 h-46Z" />
          <path className="j-notebook-page" d="M150,194 h38 M152,198 h34" />
          <path className="j-pen" d="M152,210 L176,205" />
          <path className="j-pen-tip" d="M176,205 L180,204" />
          <g className="j-mug">
            <path className="j-prop-shadow" d="M194,206 h24 l4,5 h-24Z" />
            <path d="M196,182 h18 v18 a4,4 0 0 1 -4,4 h-10 a4,4 0 0 1 -4,-4Z" />
            <path className="j-mug-handle" d="M214,186 a5.5,5.5 0 0 1 0,10" />
            <ellipse className="j-mug-rim" cx="205" cy="182" rx="9" ry="2.8" />
            <ellipse className="j-mug-inner" cx="205" cy="182" rx="6.4" ry="1.9" />
          </g>
          <path className="j-steam" d="M203,178 C201,173 207,170 205,165 C203,161 207,158 206,155" />
          <g className="j-tray">
            <path className="j-prop-shadow" d="M124,214 h40 l6,6 h-40Z" />
            <path className="j-tray-body" d="M122,198 h38 l6,12 h-38Z" />
            <path className="j-tray-in" d="M126,201 h29 l4,7 h-29Z" />
            <circle className="j-tray-part" cx="134" cy="205" r="1.6" />
            <circle className="j-tray-part" cx="141" cy="204" r="1.4" />
            <circle className="j-tray-part" cx="147" cy="206" r="1.5" />
          </g>
          <path className="j-cable" d="M166,214 C144,224 122,232 98,256 C80,274 64,296 46,346" />
          <path className="j-cable j-cable-hi" d="M166,213 C144,223 122,231 98,255" />
        </g>

        {/* ================= the sunbeam ================= */}
        {/* the card's light source, and it has to be visible as an object. Its
            job is to land on A's open panel — the beam and the amber interior
            meet at the focal point. A beam that lights nothing in particular is
            the generic cozy-IR move the uniqueness audit exists to catch. */}
        <g className="j-beam">
          {/* the pool where the beam lands — on A's open panel, which is the
              whole reason this beam is allowed to exist */}
          <ellipse className="j-beam-pool" cx="74" cy="170" rx="44" ry="26" />
          {/* soft-edged: a hard-edged translucent quad reads as a scanner
              artifact laid over the picture, not as light in a room */}
          <path className="j-beam-shaft" d="M8,58 L62,54 L142,240 L28,254Z" fill="url(#j-beam)" />
          <g clipPath="url(#j-beam-clip)">
            {MOTES.map((m, i) => (
              <circle
                key={i} className="j-mote" cx={m.x} cy={m.y} r={m.r}
                style={{ animationDuration: `${m.dur}s`, animationDelay: `${m.delay}s` }}
              />
            ))}
          </g>
          {SPARKLES.map((s, i) => (
            <path
              key={i} className="j-sparkle"
              transform={`translate(${s.x} ${s.y}) scale(${s.s})`}
              style={{ animationDelay: `${s.d}s` }}
              d="M0,-6 Q0.7,-0.7 6,0 Q0.7,0.7 0,6 Q-0.7,0.7 -6,0 Q-0.7,-0.7 0,-6Z"
            />
          ))}
        </g>

        {/* ================= PLANE 1 — Node ================= */}
        {/* the crocheted hexagon mat: Jericho's architecture rendered as
            something hand-made and domestic rather than as a wireframe, and the
            one element on this card that could not appear on any other in the deck */}
        <g className="j-mat">
          <ellipse className="j-mat-body" cx="84" cy="190" rx="41" ry="13.5" />
          <ellipse className="j-mat-inner" cx="84" cy="190" rx="35" ry="10" />
          <g className="j-mat-hex">
            {[[62, 187], [76, 184], [90, 184], [104, 187], [68, 194], [82, 195], [96, 194], [108, 192]].map(([hx, hy], i) => (
              <path
                key={i}
                d={`M${hx},${hy - 3.2} L${hx + 4.6},${hy - 1.6} L${hx + 4.6},${hy + 1.6} L${hx},${hy + 3.2} L${hx - 4.6},${hy + 1.6} L${hx - 4.6},${hy - 1.6}Z`}
                fill={['#b8613c', '#f4e6ca', '#6f9c96'][i % 3]}
              />
            ))}
          </g>
          {/* one corner rucked up */}
          <path className="j-mat-ruck" d="M47,189 C44,183 50,179 56,180 C52,183 50,186 51,190Z" />
        </g>

        {/* two-part contact shadow: a small hard core directly under it plus a
            wider soft one. One blurred blob alone reads as a UI drop shadow; the
            hard core is what makes an object sit. */}
        <ellipse className="j-contact-soft" cx="82" cy="190" rx="28" ry="7.5" />
        <ellipse className="j-contact-core" cx="81" cy="189" rx="15" ry="3.6" />

        {/* B and C float close, watching their sibling get fixed */}
        <g className="j-unit-wrap j-unit-b">
          <JerichoMascot variant="b" x={26} y={101} size={31} />
        </g>
        <g className="j-unit-wrap j-unit-c">
          <JerichoMascot variant="c" x={97} y={114} size={25} />
        </g>

        {/* the ray burst sits behind A and is at zero opacity at rest — you do
            not put burst lines behind a resting creature */}
        <g className="j-rays" mask="url(#j-ray-fade)">
          {RAY_JITTER.map((a, i) => (
            <path
              key={i}
              transform={`rotate(${a} 80 168)`}
              d="M80,168 L73,52 L87,52Z"
              fill={['#fdf1d6', '#f0b678', '#cfe6d8'][i % 3]}
              opacity={0.9 - (i % 3) * 0.22}
            />
          ))}
        </g>

        {/* A: on the mat, on the desk, at Fred's hand. Tipped toward him. */}
        <g className="j-unit-wrap j-unit-a">
          <JerichoMascot variant="a" x={54} y={142} size={53} />
        </g>

        {/* the story, lying on the mat where he set them down: the ear he took
            off and two loose screws. You only take something apart on your own
            desk if you care about it, and holding still for it is trust. */}
        <g className="j-loose">
          <ellipse className="j-loose-dish" cx="112" cy="192" rx="2.8" ry="6" transform="rotate(74 112 192)" />
          <ellipse className="j-loose-cone" cx="112" cy="192" rx="1.4" ry="3.9" transform="rotate(74 112 192)" />
          <circle className="j-loose-screw" cx="102" cy="197" r="1.9" />
          <circle className="j-loose-screw" cx="108" cy="200" r="1.7" />
        </g>

        {/* Fred's hand, palm down beside A, screwdriver held loosely. If exactly
            one element on this card has to be drawn well, it is this one — a
            hand resting next to a small creature is one of the most reliably
            tender images there is, and it carries the emotional load the face
            cannot be trusted with at 44px. */}
        {/* Fred's hand, palm down on the desk beside A, screwdriver held loosely
            between thumb and forefinger. Drawn as separated digits rather than a
            mitten with lines on it — at this size the gaps between fingers are
            what make it read as a hand, not the shading. If exactly one element
            on this card has to be drawn well it is this one: a hand resting next
            to a small creature is one of the most reliably tender images there
            is, and it carries the emotional load the face cannot be trusted with. */}
        {/* The forearm rests ON the desk, so it is drawn after it — a limb
            behind the desk edge cannot rest on the surface it is touching.
            Upper arm to elbow on the right, forearm running back left to the
            hand: that diagonal is the second half of the reading loop, carrying
            the eye from his face down to Node. */}
        {/* Limbs are round-capped strokes drawn twice — a heavier dark pass
            for the contour, then the fill — rather than hand-authored outline
            shapes. At this scale an authored closed path reads as a bean; a
            stroked segment is guaranteed to read as a tapered tube with a real
            joint at the elbow. Same construction as the fingers. */}
        {/* Limbs are round-capped strokes drawn twice — a heavier dark pass for
            the contour, then the fill — rather than hand-authored outline shapes.
            At this scale an authored closed path reads as a bean; a stroked
            segment is guaranteed to read as a tapered tube. Same construction as
            the fingers.

            The arm is short and steep on purpose. His near shoulder sits only
            about 13 units right of the hand, so any long forearm has to fold
            back across his chest and reads as folded arms rather than reaching.
            He is leaning in over the work, so the limb comes almost straight
            down, heavily foreshortened. */}
        <g className="j-forearm">
          <path className="j-limb-ink" d="M159,150 L167,168" />
          <path className="j-limb-ink" d="M167,168 L164,178" />
          <path className="j-upperarm" d="M159,150 L167,168" />
          <path className="j-forearm-skin" d="M167,168 L164,178" />
          {/* rolled sleeve end, across the arm rather than blobbed at the joint */}
          <path className="j-fred-cuff" d="M160,166 L174,170" />
        </g>

        {/* scaled to read against the head — at full size the hand was larger
            than his face and pulled the eye away from Node */}
        <g className="j-hand" transform="translate(2 4) scale(0.88)">
          <ellipse className="j-hand-shadow" cx="136" cy="190" rx="22" ry="4.6" />
          {/* Digits are drawn as round-capped strokes, twice: a heavier dark
              pass underneath for the contour, a skin pass on top. At ~5px wide
              per finger it is the gaps between them that read as a hand, and
              stroking gives a consistent capsule that hand-authored outline
              paths at this scale do not. */}
          {FINGERS.map((d, i) => <path key={`ink${i}`} className="j-digit-ink" d={d} />)}
          {FINGERS.map((d, i) => <path key={`fill${i}`} className="j-digit" d={d} />)}
          {/* back of the hand, overlapping the finger roots */}
          <path className="j-hand-palm" d="M138,169 C150,166 161,168 166,174 C169,180 163,187 152,188 C142,189 133,186 130,181 C128,176 131,171 138,169Z" />
          <path className="j-hand-knuckle" d="M137,173 C145,170 155,171 161,174" />
          {/* thumb, forward of the hand, holding the shaft */}
          <path className="j-digit-ink" d="M158,180 L170,177" />
          <path className="j-digit j-thumb" d="M158,180 L170,177" />
          <path className="j-screwdriver-shaft" d="M160,175 L176,169" />
          <path className="j-screwdriver-collar" d="M175,169.4 L178,168.2" />
          <path className="j-screwdriver-grip" d="M178,168.2 L192,162.8" />
        </g>

        {/* two short soft arcs between the units on wake — "they're talking to
            each other," not lightning across the frame. Arcs are action
            vocabulary and cannot be the main event on a bond card. */}
        <g className="j-arcs">
          <polyline className="j-arc j-arc-1" points="98,152 103,145 99,139 105,134 101,128 107,125" />
          <polyline className="j-arc j-arc-2" points="97,121 88,117 84,123 74,118 70,123 60,119" />
        </g>

        {/* foreground crop: the near edge of a mug, larger and softer than
            everything else, cropped by the frame. Cheap, real depth — sourced to
            the out-of-focus grass crossing the lower frame on Electrode GX 48/168.
            Kept mid-tone rather than dark so the lower third stays pale. */}
        <path className="j-fg-mug" d="M-20,262 C10,254 44,268 52,300 C58,324 52,346 52,346 L-20,346Z" />
        <path className="j-fg-mug-rim" d="M-20,262 C10,254 44,268 52,300" />

        {/* grain: with the halftone this reads as printed card stock, and a real
            card is a physical printed object you hold */}
        <rect className="j-grain" x="0" y="0" width="242" height="346" filter="url(#j-grain)" />
      </svg>
      <div className="jericho-wake-text">Jericho</div>
    </div>
  );
}

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
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActiveIdx((i) => (i + 1) % TULIP_DETECTIONS.length);
    }, 2800);
    return () => clearInterval(id);
  }, []);

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
        <div
          key={`fg-${i}`}
          className="tulip-mascot-slot"
          style={{ left: t.left, bottom: t.bottom, width: t.size * 1.6, height: t.size * 1.6 }}
        >
          <TulipMascot />
        </div>
      ))}
      {TULIP_DETECTIONS.map((d, i) => (
        <Fragment key={d.tier}>
          <div
            className={`tulip-box tulip-box-${d.tier} ${i === activeIdx ? 'tulip-box-active' : ''}`}
            style={{ left: d.left, bottom: d.bottom, width: d.width, height: d.height }}
          >
            {i === activeIdx && <div className="tulip-box-scanline" />}
          </div>
          <div
            className={`tulip-conf tulip-conf-${d.tier} ${i === activeIdx ? 'tulip-conf-active' : ''}`}
            style={{ left: d.left, bottom: `calc(${d.bottom} + ${d.height + 1}px)` }}
          >R-CNN {d.pct}%</div>
        </Fragment>
      ))}
    </div>
  );
}

function SevereWeatherScene() {
  return (
    <div className="art-bg scene-impala">
      <div className="impala-sun" />
      <svg className="impala-wind" viewBox="0 0 100 40" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 10 Q 30 4, 55 10 T 95 8" />
        <path d="M2 22 Q 25 16, 48 22 T 85 20" />
        <path d="M2 33 Q 20 29, 38 33 T 70 31" />
      </svg>
      <svg className="impala-shimmer" viewBox="0 0 100 60" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 18 Q 8 13, 16 18 T 32 18" />
        <path d="M0 32 Q 8 27, 16 32 T 32 32" />
        <path d="M0 46 Q 8 41, 16 46 T 32 46" />
      </svg>
      <span className="impala-snowflake">❄️</span>
      <div className="impala-mascot-slot">
        <ImpalaMascot />
      </div>
      <span className="impala-crystal impala-crystal-a">❆</span>
      <span className="impala-crystal impala-crystal-b">❆</span>
      <div className="impala-icing" />
      <div className="impala-icing2" />
    </div>
  );
}

const FULLART_SCENES = {
  jericho: JerichoScene,
  tulip: TulipVisionScene,
  impala: SevereWeatherScene,
};

export function FullArtScene({ project }) {
  const Scene = FULLART_SCENES[project.id];
  return Scene ? <Scene /> : <DefaultFullArtScene icon={project.icon} />;
}

export { FULLART_SCENES, DefaultFullArtScene };
