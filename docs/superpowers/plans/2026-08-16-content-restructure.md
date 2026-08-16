# Content Restructure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the "estimated work hours" HP stat with real lines-of-code where source is available, replace "Weakness" with "Role" everywhere, and add a `languages` field (all 12 projects) plus a short card-face description + longer modal-only expansion (the 3 full-art flagships only).

**Architecture:** All new/changed data lives in `src/data/cards.js` (single source of truth, unchanged pattern). `CardFace` (in `src/components/Card.jsx`, reused by the gallery grid, `PackCard`, and `FlipCard`) picks up the Role/HP-label changes for all 12 projects and the description/languages block for the 3 full-art ones. `CardModal` (reused by both the gallery and the pack-opening inspect modal from the prior feature) picks up the Role/Languages changes for all 12 and the `detail` expansion for the 3 full-art ones.

**Tech Stack:** React 19, Vite, Framer Motion. No new dependencies.

## Global Constraints

- No new npm dependency.
- `weakness` field is removed entirely from every project object — replaced by `role`.
- `hp` stays a `number`; a new `hpMetric: 'loc' | 'hours'` field controls whether the UI subtext reads "LOC" or "est.".
- `languages: string[]` is populated for all 12 projects.
- `description: string | null` and `detail: string | null` are populated ONLY for the 3 full-art flagships (`jericho`, `impala`, `tulip` — the `ssir`/`sir`/`ir` rarities); all other 9 projects get `description: null, detail: null`.
- `description` (short nutshell) renders on the card face (full-art layout only). `detail` (longer expansion) renders ONLY in `CardModal`, never on the card face.
- `resistance` and `retreat` are unchanged — do not touch.
- Card types (`TYPES` / energy-pip categories) are unchanged — do not touch.
- No automated test framework exists in this repo — verification is `npm run build` per task plus a manual QA pass.

**Exact per-project values** (copied verbatim from
`docs/superpowers/specs/2026-08-15-content-restructure-design.md` — the
full rationale for each value, including which were git-verified vs.
user-supplied, lives there):

| id | `hp` | `hpMetric` | `role` | `languages` |
|---|---|---|---|---|
| jericho | 4108 | `'loc'` | `'Sole Developer (Personal Project)'` | `['Python', 'Flutter (planned)']` |
| impala | 650 | `'hours'` | `'Sole Developer (Internship)'` | `['Python', 'CloudFormation (IaC)']` |
| tulip | 2779 | `'loc'` | `'Team Lead & Lead Developer (Client-Facing)'` | `['Python']` |
| gta | 9534 | `'loc'` | `'Sole Developer'` | `['PHP', 'Vue.js (JS)']` |
| haarlem | 4583 | `'loc'` | `'Team Lead & Design Lead'` | `['PHP', 'JavaScript']` |
| selfhost | 159 | `'loc'` | `'Sole / Personal'` | `['Python']` |
| somerin | 40 | `'hours'` | `'Team Lead (Team Dispersed — Delivered Alone)'` | `['C#', 'Azure', 'SQL']` |
| souls | 137 | `'loc'` | `'Sole Developer (Personal Project)'` | `['C#']` |
| chapeau | 30 | `'hours'` | `'Team Member (Design + Dev)'` | `['C#', 'SQL']` |
| greenhouse | 25 | `'hours'` | `'Sole Developer'` | `['C++ (Arduino)']` |
| movie | 3129 | `'loc'` | `'Sole Developer'` | `['Java']` |
| servicedesk | 1903 | `'loc'` | `'Team Lead'` | `['C#', 'MongoDB']` |

`description`/`detail` (only jericho, impala, tulip are non-null — exact
text below in Task 1).

---

## Task 1: Update `cards.js` data model

**Files:**
- Modify: `src/data/cards.js` (full rewrite of the file, 197 lines)

**Interfaces:**
- Consumes: nothing new.
- Produces: every object in `PROJECTS` now has `role`, `hpMetric`,
  `languages`, `description`, `detail` and no longer has `weakness`. This
  is the exact shape Tasks 2 and 3 read from.

- [ ] **Step 1: Rewrite `cards.js`**

```js
// src/data/cards.js
// Source data for the Fred TCG portfolio.
// Every stat/claim here is backed by career-vault/vault/00-Master/Master-CV.md,
// Jericho/PORTFOLIO.md, and the TulipVision handoff doc, cross-checked directly
// against GitHub for the projects that have accessible repos. HP is either LOC
// (git-attributed lines added-minus-deleted, or a total line count for projects
// with no commit history to attribute) or estimated work hours where no source
// code is accessible anywhere — see `hpMetric` per project and
// docs/superpowers/specs/2026-08-15-content-restructure-design.md for the full
// per-project methodology and sourcing notes.

export const TYPES = {
  ml:       { name: 'ML / AI',        color: '#8e44ad', code: 'ML' },
  cloud:    { name: 'Cloud',          color: '#e6791f', code: 'CL' },
  backend:  { name: 'Backend',        color: '#2b7fd1', code: 'BE' },
  frontend: { name: 'Frontend',       color: '#2fa85a', code: 'FE' },
  devops:   { name: 'DevOps',         color: '#7f8c9c', code: 'DO' },
  data:     { name: 'Data',           color: '#159487', code: 'DA' },
  hardware: { name: 'Hardware / IoT', color: '#c0392b', code: 'HW' },
  creative: { name: 'Creative',       color: '#d35400', code: 'CR' },
  arch:     { name: 'Architecture',   color: '#5a5ec9', code: 'AR' },
};

export const RARITY = {
  common:      { label: 'Common',       sym: '●',   order: 0 },
  holo:        { label: 'Holo Rare',    sym: '◆',   order: 1 },
  reverseholo: { label: 'Reverse Holo', sym: '★',   order: 2 },
  ir:          { label: 'IR',           sym: '★',   order: 3 },
  sir:         { label: 'SIR',          sym: '★★',  order: 4 },
  ssir:        { label: 'SSIR',         sym: '★★★', order: 5 },
};

export const PROJECTS = [
  {
    id: 'jericho', name: 'Jericho', rarity: 'ssir', type: 'arch',
    stage: 'Stage 2 · In Progress', hp: 4108, hpMetric: 'loc', icon: '🛰️',
    attacks: [
      { cost: ['arch'], name: 'Hexagonal Enforcement', dmg: null,
        text: 'Machine-enforced ports & adapters — import-linter contracts plus a custom reflection-based contract verifier. Boundaries cannot silently rot.' },
      { cost: ['cloud', 'backend'], name: 'Provider Swap', dmg: 90,
        text: 'Added OpenRouter as a second cloud LLM port alongside local LM Studio — zero changes to services/. The abstraction held under real change.' },
      { cost: ['ml'], name: 'Voice Loop', dmg: null,
        text: 'Whisper STT → keyword router → streaming LLM (SSE) → Kokoro TTS, wake-word activated. Proven live end to end.' },
    ],
    role: 'Sole Developer (Personal Project)', resistance: 'Build-ahead −20 (deferred to Sprint 7+)', retreat: 2,
    languages: ['Python', 'Flutter (planned)'],
    description: 'A personal ambient AI assistant, conceived and architected entirely solo — hexagonal architecture, machine-enforced contracts, and a growing voice-driven feature set.',
    detail: 'Every technical decision is mine — including the call to move the client to Flutter next while the Python core stays. Currently in active development, sprint by sprint, integrating local and cloud LLMs, voice I/O, and machine-enforced architectural contracts that keep the codebase honest as it grows.',
    flavor: '"Lives at the periphery until you need it — then it\'s already listening."',
    context: 'Solo · Big Rock #1', dates: 'Jul 2026 – ongoing', link: null, linkLabel: null,
  },
  {
    id: 'impala', name: 'Severe Weather Alert System', rarity: 'sir', type: 'ml',
    stage: 'Stage 1 · Internship', hp: 650, hpMetric: 'hours', icon: '⛈️',
    attacks: [
      { cost: ['ml', 'data'], name: 'Threat Forecast', dmg: 92,
        text: 'XGBoost model predicting dangerous severe-weather events at ~92% accuracy. Sole developer, end to end.' },
      { cost: ['cloud', 'devops'], name: 'Serverless Deploy', dmg: null,
        text: 'AWS Lambda + ECS, infrastructure as code via CloudFormation, Redis caching for latency and cost. Hexagonal architecture throughout.' },
    ],
    role: 'Sole Developer (Internship)', resistance: 'Latency −30 (Redis cache)', retreat: 1,
    languages: ['Python', 'CloudFormation (IaC)'],
    description: "An AWS-based severe-weather prediction system built solo during an internship — researched, designed, deployed, and shipped into the company's own cloud account.",
    detail: 'Infrastructure as code via CloudFormation, after evaluating open-source alternatives like MinIO S3 before landing on native AWS S3. Prediction logic is grounded in real climate science — the Köppen classification system, researched independently, fed by Open-Meteo data. First project with enforced infrastructure contracts and a Makefile-driven build. An XGBoost model on top predicts dangerous severe-weather events at ~92% accuracy.',
    flavor: '"Report: 90/100. Presentation: 84/100. The office-ops fix I proposed is still running today."',
    context: 'Impala Studios · Haarlem, NL', dates: 'Sept 2025 – Jan 2026', link: null, linkLabel: null,
  },
  {
    id: 'tulip', name: 'TulipVision', rarity: 'ir', type: 'ml',
    stage: 'Stage 2 · Deployed', hp: 2779, hpMetric: 'loc', icon: '🌷',
    attacks: [
      { cost: ['ml'], name: 'Faster R-CNN Bloom', dmg: 86,
        text: 'Best-of-four object detector (F1 0.86, mAP 0.83) — the one selected to power the production app, beating RetinaNet, YOLOv5 and YOLOv11.' },
      { cost: ['backend', 'cloud'], name: 'Four-Model API', dmg: null,
        text: 'FastAPI backend serving four detectors behind one endpoint; Redis cache, JWT auth, Azure Blob storage, CI/CD to Azure Container Apps.' },
    ],
    role: 'Team Lead & Lead Developer (Client-Facing)', resistance: 'Downtime −40 (graceful fallbacks everywhere)', retreat: 2,
    languages: ['Python'],
    description: 'A three-person capstone comparing four object-detection architectures for tulip disease detection, led by Fred as team lead and client-facing presenter.',
    detail: 'Trained, evaluated, and benchmarked four architectures head to head — Faster R-CNN, RetinaNet, YOLOv5, and YOLOv11. The Faster R-CNN model won on F1 (0.86) and mAP (0.83) and now powers the production app, served via a FastAPI backend deployed to Azure Container Apps.',
    flavor: '"70% of 128 commits. Four models walked in, one got picked for the app."',
    context: 'Inholland · Data & AI, IT3B', dates: '2025 – 2026',
    link: 'github.com/Fredd93/Inholland_IT3B_tulip_object_detection', linkLabel: 'View repo',
  },
  {
    id: 'gta', name: 'Grand Transmission Auto', rarity: 'reverseholo', type: 'frontend',
    stage: 'Stage 1 · Primary Dev', hp: 9534, hpMetric: 'loc', icon: '🚗',
    attacks: [
      { cost: ['frontend', 'backend'], name: 'Dual Frontend Serve', dmg: null,
        text: 'One PHP/PDO REST API backing both a server-rendered site and a Vue 3 SPA, routed through Nginx.' },
      { cost: ['backend'], name: 'Guest Checkout', dmg: null,
        text: 'JWT + session auth, guest checkout, lease-installment tracking, role-based dashboards, sales analytics — Dockerized end to end.' },
    ],
    role: 'Sole Developer', resistance: '—', retreat: 1,
    languages: ['PHP', 'Vue.js (JS)'],
    description: null,
    detail: null,
    flavor: '"63 of 66 commits. Two frontends, one API, zero excuses."',
    context: 'Web Dev 2 · Final Assignment', dates: 'Apr 2025 – Jul 2026', link: null, linkLabel: 'Private repo',
  },
  {
    id: 'haarlem', name: 'Haarlem Festival', rarity: 'holo', type: 'frontend',
    stage: 'Stage 1 · Design Lead', hp: 4583, hpMetric: 'loc', icon: '🎪',
    attacks: [
      { cost: ['frontend'], name: 'Design → Ship', dmg: null,
        text: 'Led the Figma design team, then built the full-stack site — PHP, API, JS.' },
    ],
    role: 'Team Lead & Design Lead', resistance: '—', retreat: 1,
    languages: ['PHP', 'JavaScript'],
    description: null,
    detail: null,
    flavor: '"Led the room, then shipped the code."',
    context: 'Team project', dates: '2025', link: null, linkLabel: null,
  },
  {
    id: 'selfhost', name: 'Self-Hosted AI Infrastructure', rarity: 'holo', type: 'devops',
    stage: 'Basic', hp: 159, hpMetric: 'loc', icon: '🖥️',
    attacks: [
      { cost: ['devops'], name: 'Local-First Stack', dmg: null,
        text: 'Local MCP servers plus self-hosted SearXNG search — no cloud API key required.' },
    ],
    role: 'Sole / Personal', resistance: '—', retreat: 1,
    languages: ['Python'],
    description: null,
    detail: null,
    flavor: '"Runs on Fred\'s own hardware."',
    context: 'Personal infra', dates: 'Ongoing', link: null, linkLabel: null,
  },
  {
    id: 'somerin', name: 'Somerin', rarity: 'common', type: 'cloud',
    stage: 'Basic', hp: 40, hpMetric: 'hours', icon: '🏕️',
    attacks: [{ cost: ['cloud'], name: 'Camp Ops', dmg: null, text: 'Camp activity management system — C#, Azure, SSMS.' }],
    role: 'Team Lead (Team Dispersed — Delivered Alone)', resistance: '—', retreat: 1,
    languages: ['C#', 'Azure', 'SQL'],
    description: null,
    detail: null,
    flavor: '"Led on paper — the team scattered before launch."',
    context: 'Academic (team dispersed)', dates: '—', link: null, linkLabel: null,
  },
  {
    id: 'souls', name: 'Souls Within', rarity: 'common', type: 'creative',
    stage: 'Basic', hp: 137, hpMetric: 'loc', icon: '🎮',
    attacks: [{ cost: ['creative'], name: '2D World Build', dmg: null, text: 'Indie 2D game, C#/Unity — creativity kept alive outside the day job.' }],
    role: 'Sole Developer (Personal Project)', resistance: '—', retreat: 1,
    languages: ['C#'],
    description: null,
    detail: null,
    flavor: '"Not everything has to ship to matter."',
    context: 'Personal / creative', dates: '—', link: null, linkLabel: null,
  },
  {
    id: 'chapeau', name: 'Chapeau POS', rarity: 'common', type: 'backend',
    stage: 'Basic', hp: 30, hpMetric: 'hours', icon: '🧾',
    attacks: [{ cost: ['backend'], name: 'Ring It Up', dmg: null, text: 'Point-of-sale system, academic build.' }],
    role: 'Team Member (Design + Dev)', resistance: '—', retreat: 1,
    languages: ['C#', 'SQL'],
    description: null,
    detail: null,
    flavor: '"The register that never argues back."',
    context: 'Academic', dates: '—', link: null, linkLabel: null,
  },
  {
    id: 'greenhouse', name: 'Greenhouse Automation', rarity: 'common', type: 'hardware',
    stage: 'Basic', hp: 25, hpMetric: 'hours', icon: '🌱',
    attacks: [{ cost: ['hardware'], name: 'Auto-Water', dmg: null, text: 'Arduino-based greenhouse automation, academic build.' }],
    role: 'Sole Developer', resistance: '—', retreat: 1,
    languages: ['C++ (Arduino)'],
    description: null,
    detail: null,
    flavor: '"Plants that get looked after even when Fred doesn\'t."',
    context: 'Academic', dates: '—', link: null, linkLabel: null,
  },
  {
    id: 'movie', name: 'Movie Theater Ticketing', rarity: 'common', type: 'frontend',
    stage: 'Basic', hp: 3129, hpMetric: 'loc', icon: '🎟️',
    attacks: [{ cost: ['frontend', 'backend'], name: 'Seat Select', dmg: null, text: 'Ticketing system, Java/JavaFX, academic build.' }],
    role: 'Sole Developer', resistance: '—', retreat: 1,
    languages: ['Java'],
    description: null,
    detail: null,
    flavor: '"Front row, every time."',
    context: 'Academic', dates: '—', link: null, linkLabel: null,
  },
  {
    id: 'servicedesk', name: 'Service Desk Ticket System', rarity: 'common', type: 'backend',
    stage: 'Basic', hp: 1903, hpMetric: 'loc', icon: '🎫',
    attacks: [{ cost: ['backend', 'data'], name: 'Queue & Route', dmg: null, text: 'Ticketing system, C#/MongoDB, academic build.' }],
    role: 'Team Lead', resistance: '—', retreat: 1,
    languages: ['C#', 'MongoDB'],
    description: null,
    detail: null,
    flavor: '"Somebody has to log the bug."',
    context: 'Academic', dates: '—', link: null, linkLabel: null,
  },
];

export const SUPPORTERS = [
  {
    id: 'ecommerce',
    name: 'E-Commerce Manager', sub: 'Middle East Motors · Cairo, Egypt', dates: 'Sept 2012 – Jun 2019 · 7 years',
    text: 'Led the digital transformation of a traditionally offline automotive business — built and ran online sales channels end to end. Grew the online customer base by 39,000 through SEO and social-media strategy. Delivered end-to-end website development, integrated CRM + e-commerce systems, and trained staff on digital sales strategy.',
    rule: 'You may play as many Leadership cards as you like during your turn.',
  },
  {
    id: 'itil',
    name: 'ITIL 4 → 5 Transition', sub: 'Garden Group', dates: 'Process initiative',
    text: "Guided the organization's shift from ITIL 4 toward ITIL 5 practices — service-management process design, not a line of code, but the same discipline applied to people and workflow.",
    rule: 'This card counts as a Supporter card, not an Item card.',
  },
];

export const CERTS = [
  { id: 'aws', name: 'AWS SimuLearn: Gen AI Practitioner', sub: 'Completion cert · Sept 2025', color: '#e6791f', code: 'AWS' },
  { id: 'csharp', name: 'C# Game Development Certification', sub: 'Certification', color: '#d35400', code: 'C#' },
  { id: 'ccna', name: 'Cisco CCNA 1 & 2', sub: 'Networking', color: '#7f8c9c', code: 'NET' },
];

export const TYPE_SKILLS = {
  ml: 'PyTorch, XGBoost, Faster R-CNN, RetinaNet, YOLO',
  cloud: 'AWS (Lambda, ECS, CFN), Azure, OpenRouter',
  backend: 'FastAPI, hexagonal arch, REST, JWT, Redis',
  frontend: 'Vue 3, Vuetify, JS/TS, PHP',
  devops: 'Docker, CI/CD, import-linter, GitHub Actions',
  data: 'MongoDB, SQL, ChromaDB, Redis',
  hardware: 'Arduino, IoT',
  creative: 'Unity, C#, design (Figma)',
  arch: 'Ports & adapters, ADRs, systematic debugging',
};

// Full pull order for the pack-opening experience: energy + supporters warm up
// the pack, projects climb in rarity, and the flagship (SSIR) lands last as
// the chase pull.
export const PACK_ORDER = [
  ...CERTS.map((c) => ({ kind: 'energy', data: c })),
  ...SUPPORTERS.map((s) => ({ kind: 'supporter', data: s })),
  ...[...PROJECTS].sort((a, b) => RARITY[a.rarity].order - RARITY[b.rarity].order)
    .map((p) => ({ kind: 'project', data: p })),
];
```

Note: `weakness` does not appear anywhere in this file anymore — every
project object has `role` in the position `weakness` used to occupy
(between `attacks` and `resistance`).

- [ ] **Step 2: Verify the build succeeds**

Run: `npm run build`
Expected: build completes with no errors. (Task 2/3 haven't run yet, so
`Card.jsx`/`CardModal.jsx` still reference `project.weakness`, which will
now be `undefined` — this renders as literally nothing in the JSX text
interpolation, not a build error, since it's a data file change only. The
build succeeding here confirms the data file itself has no syntax errors;
visual correctness is verified after Tasks 2 and 3.)

- [ ] **Step 3: Commit**

```bash
git add src/data/cards.js
git commit -m "Restructure card data: HP->LOC, weakness->role, add languages/description/detail"
```

---

## Task 2: Update `CardFace` (`Card.jsx`) + CSS

**Files:**
- Modify: `src/components/Card.jsx` (only the `CardFace` function changes, lines 17-91 of the current 133-line file — the `EnergyPip` export and the default `Card` wrapper component below it are untouched)
- Modify: `src/styles/card.css` (append two new rules after the existing `.layout-fullart .foot{...}` rule, currently around line 113)

**Interfaces:**
- Consumes: `project.role`, `project.hpMetric`, `project.languages`,
  `project.description` from Task 1's data shape (`project.weakness` is no
  longer read anywhere in this file).
- Produces: no prop/signature change to `CardFace` or `Card` — same
  `{ project, index, total }` props as before.

- [ ] **Step 1: Edit `CardFace` in `Card.jsx`**

Replace the HP line (currently):
```jsx
        <div className="hp">
          HP {project.hp}<small>est.</small>
          <EnergyPip type={project.type} />
        </div>
```
with:
```jsx
        <div className="hp">
          HP {project.hp}<small>{project.hpMetric === 'loc' ? 'LOC' : 'est.'}</small>
          <EnergyPip type={project.type} />
        </div>
```

Replace the `.wrr` row (currently):
```jsx
        <div className="wrr">
          <span>Weak: {project.weakness}</span>
          <span>Retreat: {project.retreat}</span>
        </div>
```
with:
```jsx
        <div className="wrr">
          <span>Role: {project.role}</span>
          <span>Retreat: {project.retreat}</span>
        </div>
```

Insert a new description + languages block immediately before the `.wrr`
div (so the full `.bottom` div reads: full-art attacks block → new
description/languages block → `.wrr` → `.flavor` → `.foot`):

```jsx
        {fullArt && project.description && (
          <div className="card-description">{project.description}</div>
        )}
        {fullArt && project.languages.length > 0 && (
          <div className="card-languages">
            {project.languages.map((lang) => (
              <span className="lang-pip" key={lang}>{lang}</span>
            ))}
          </div>
        )}
        <div className="wrr">
```

(That last line is the existing `.wrr` div opening tag shown above for
placement context — don't duplicate it, just insert the two new blocks
directly above it.)

The full resulting `CardFace` function body (for reference — this is what
the file should look like after both edits above):

```jsx
export function CardFace({ project, index = 0, total = 17 }) {
  const r = RARITY[project.rarity];
  const type = TYPES[project.type];
  const fullArt = FULLART.has(project.rarity);

  return (
    <div className={`tcg-face ${fullArt ? 'layout-fullart' : 'layout-classic'}`} style={{ '--type-color': type.color }}>
      {fullArt && <div className="art-bg"><span>{project.icon}</span></div>}
      <div className="top-row">
        <div>
          <div className="stage-pill">{project.stage}</div>
          <div className="name">{project.name}</div>
        </div>
        <div className="hp">
          HP {project.hp}<small>{project.hpMetric === 'loc' ? 'LOC' : 'est.'}</small>
          <EnergyPip type={project.type} />
        </div>
      </div>

      {!fullArt && (
        <>
          <div className="art"><span>{project.icon}</span></div>
          <div className="dex-line">{project.context} · {project.dates}</div>
        </>
      )}

      {!fullArt && (
        <div className="attacks">
          {project.attacks.map((a) => (
            <div className="attack" key={a.name}>
              <div className="atk-cost">{a.cost.map((c) => <EnergyPip key={c} type={c} />)}</div>
              <div style={{ flex: 1 }}>
                <div className="atk-head">
                  <span>{a.name}</span>
                  {a.dmg ? <span className="atk-dmg">{a.dmg}</span> : null}
                </div>
                <div className="atk-text">{a.text}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="bottom">
        {fullArt && (
          <div className="attacks">
            {project.attacks.map((a) => (
              <div className="attack" key={a.name}>
                <div className="atk-cost">{a.cost.map((c) => <EnergyPip key={c} type={c} />)}</div>
                <div style={{ flex: 1 }}>
                  <div className="atk-head">
                    <span>{a.name}</span>
                    {a.dmg ? <span className="atk-dmg">{a.dmg}</span> : null}
                  </div>
                  <div className="atk-text">{a.text}</div>
                </div>
              </div>
            ))}
          </div>
        )}
        {fullArt && project.description && (
          <div className="card-description">{project.description}</div>
        )}
        {fullArt && project.languages.length > 0 && (
          <div className="card-languages">
            {project.languages.map((lang) => (
              <span className="lang-pip" key={lang}>{lang}</span>
            ))}
          </div>
        )}
        <div className="wrr">
          <span>Role: {project.role}</span>
          <span>Retreat: {project.retreat}</span>
        </div>
        <div className="flavor">{project.flavor}</div>
        <div className="foot">
          <span>FRED TCG · {String(index + 1).padStart(3, '0')}/{String(total).padStart(3, '0')}</span>
          <span style={{ color: fullArt ? 'var(--gold)' : undefined }}>{r.sym} {r.label}</span>
        </div>
      </div>

      <div className="holo-shine" />
    </div>
  );
}
```

- [ ] **Step 2: Append new CSS rules to `card.css`**

Add this block immediately after the existing
`.layout-fullart .foot{display:flex;justify-content:space-between;align-items:center;font-size:7.4px;color:#a9a596;}`
rule (currently line 113), before the `/* rarity-specific accents on top
of the frame */` comment:

```css
.layout-fullart .card-description{font-size:9.5px;line-height:1.35;color:#e4e1d6;margin:2px 0 6px;}
.layout-fullart .card-languages{display:flex;flex-wrap:wrap;gap:4px;margin-bottom:6px;}
.layout-fullart .lang-pip{font-size:7.4px;font-weight:700;background:rgba(255,255,255,.12);color:#f4efe0;border-radius:4px;padding:2px 6px;letter-spacing:.02em;}
```

These two new blocks (`.card-description`, `.card-languages`) are scoped
under `.layout-fullart` the same way every other rule in this section is,
consistent with the file's existing convention — they only apply to the 3
full-art cards, never to classic-layout cards (classic layout never
renders these elements anyway, since they're gated by `fullArt &&` in the
JSX, but the CSS scoping matches the file's house style regardless).

- [ ] **Step 3: Verify the build succeeds**

Run: `npm run build`
Expected: build completes with no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/Card.jsx src/styles/card.css
git commit -m "Update CardFace: Role replaces Weakness, LOC/hours HP label, full-art description+languages"
```

---

## Task 3: Update `CardModal.jsx`

**Files:**
- Modify: `src/components/CardModal.jsx` (full rewrite, 62 lines)

**Interfaces:**
- Consumes: `project.role`, `project.hpMetric`, `project.languages`,
  `project.detail` from Task 1's data shape (`project.weakness` is no
  longer read).
- Produces: no prop/signature change — still `{ project, onClose }`, used
  identically by both `GalleryView.jsx` and `PackOpeningView.jsx` (from
  the prior pack-navigation feature) without any change needed in either
  caller.

- [ ] **Step 1: Rewrite `CardModal.jsx`**

```jsx
// src/components/CardModal.jsx
import { motion, AnimatePresence } from 'framer-motion';
import { RARITY, TYPES } from '../data/cards.js';

function EnergyPip({ type }) {
  const t = TYPES[type];
  return <span className="energy-pip" style={{ background: t.color }}>{t.code}</span>;
}

export default function CardModal({ project, onClose }) {
  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="modal-bg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            className="modal"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 22, stiffness: 260 }}
          >
            <button className="modal-close" onClick={onClose}>✕</button>
            <div style={{ fontSize: 40, marginBottom: 6 }}>{project.icon}</div>
            <h3>{project.name}</h3>
            <div className="modal-meta">
              {project.context} · {project.dates} · {RARITY[project.rarity].sym} {RARITY[project.rarity].label} · HP {project.hp} ({project.hpMetric === 'loc' ? 'LOC' : 'est.'})
            </div>
            {project.attacks.map((a) => (
              <div className="attack" key={a.name}>
                <div className="atk-cost">{a.cost.map((c) => <EnergyPip key={c} type={c} />)}</div>
                <div style={{ flex: 1 }}>
                  <div className="atk-head">
                    <span>{a.name}</span>
                    {a.dmg ? <span className="atk-dmg">{a.dmg}</span> : null}
                  </div>
                  <div className="atk-text" style={{ fontSize: 12.5 }}>{a.text}</div>
                </div>
              </div>
            ))}
            <p style={{ marginTop: 14 }}>
              <b>Role:</b> {project.role} &nbsp; <b>Resistance:</b> {project.resistance} &nbsp; <b>Retreat:</b> {project.retreat}
            </p>
            <p><b>Languages:</b> {project.languages.join(', ')}</p>
            <p style={{ fontStyle: 'italic', color: '#b7bdd0' }}>{project.flavor}</p>
            {project.detail && <p>{project.detail}</p>}
            {project.link ? (
              <a className="modal-link" href={`https://${project.link}`} target="_blank" rel="noopener noreferrer">
                {project.linkLabel || 'View repo'} →
              </a>
            ) : project.linkLabel ? (
              <div className="modal-link" style={{ color: 'var(--muted)' }}>{project.linkLabel}</div>
            ) : null}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

Key changes from the original: the HP line's `(est.)` suffix is now
conditional on `hpMetric`. The `<b>Weakness:</b> {project.weakness}` text
becomes `<b>Role:</b> {project.role}`. A new `<p><b>Languages:</b>
{project.languages.join(', ')}</p>` line is added right after the
Role/Resistance/Retreat line. A new `{project.detail && <p>{project.detail}</p>}`
line is added right after the flavor-text paragraph — it renders nothing
for the 9 projects where `detail` is `null`, and shows the longer
expansion paragraph for the 3 full-art flagships. No new CSS is needed:
the new paragraphs use the existing `.modal p{font-size:14px;color:#d4d8e6;}`
rule already in `layout.css`, same as the flavor-text paragraph did
before this change.

- [ ] **Step 2: Verify the build succeeds**

Run: `npm run build`
Expected: build completes with no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/CardModal.jsx
git commit -m "Update CardModal: Role replaces Weakness, add Languages row and detail expansion"
```

---

## Task 4: Manual QA pass

**Files:** none (verification only)

- [ ] **Step 1: Start the dev server**

Run: `npm run dev`
Expected: prints a local URL (e.g. `http://localhost:5173/`)

- [ ] **Step 2: Verify a classic-layout card (Role + HP label)**

Navigate to `#/gallery`. Find a classic-layout common card, e.g. Souls
Within. Confirm its card face shows `Role: Sole Developer (Personal
Project)` where "Weak:" used to be, and the HP subtext reads `LOC` (Souls
Within has `hpMetric: 'loc'`).

- [ ] **Step 3: Verify an "hours" metric card still shows "est."**

Find Somerin (or Chapeau, Greenhouse, Severe Weather) on the gallery.
Confirm its HP subtext still reads `est.`, not `LOC`.

- [ ] **Step 4: Verify all 3 full-art cards render description + languages on the card face**

Find Jericho, Severe Weather Alert System, and TulipVision on the gallery.
Confirm each renders its short nutshell description and a row of language
pills on the card face itself (not the longer `detail` text — that should
NOT appear on the card face).

- [ ] **Step 5: Verify a classic-layout card does NOT render description/languages on its face**

Confirm none of the 9 classic-layout cards show a description block or
language-pip row on the card face (only the full-art 3 should).

- [ ] **Step 6: Verify `CardModal` for a classic-layout project**

Click a classic-layout card (e.g. Grand Transmission Auto). Confirm the
modal shows `Role: Sole Developer` (not "Weakness:"), a `Languages: PHP,
Vue.js (JS)` line, and does NOT show any extra paragraph after the flavor
text (GTA has `detail: null`).

- [ ] **Step 7: Verify `CardModal` for a full-art project shows the `detail` expansion**

Click Jericho (or open its modal via the pack-opening inspect feature at
`#/pack/<n>` once flipped). Confirm the modal shows: the short
`description` is NOT duplicated in the modal (only `CardFace` renders
`description` — the modal only shows `detail`), the Role line, the
Languages line, the flavor text, and then the longer `detail` paragraph
about the Flutter decision and sprint-by-sprint development.

- [ ] **Step 8: Verify pack-opening reveal picks up all changes automatically**

Navigate to `#/pack/0` and flip through a few pulls, including at least
one full-art project pull. Confirm the pack-opening card face shows the
same Role/HP-label/description/languages treatment as the gallery — no
separate change was needed here, so this step is confirming Task 1-3's
changes really do flow through `PackCard.jsx`'s reuse of `CardFace` as
expected.

- [ ] **Step 9: Global check for leftover `weakness` references**

Search the codebase for `.weakness` (e.g. via your editor's search) across
`src/`. Expected: zero matches — confirms nothing was missed reading the
now-removed field.

- [ ] **Step 10: Stop the dev server**

Stop the process started in Step 1 (Ctrl+C, or if run in background,
terminate it).
