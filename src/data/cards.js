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
    stage: 'Stage 1 · Internship', hp: 650, hpMetric: 'hours', icon: '🌡️',
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
    stage: 'Stage 1 · Primary Dev', hp: 9534, hpMetric: 'loc', icon: '🚗', mascot: 'gta',
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
    stage: 'Stage 1 · Design Lead', hp: 4583, hpMetric: 'loc', icon: '🎪', mascot: 'haarlem',
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
    stage: 'Basic', hp: 159, hpMetric: 'loc', icon: '🖥️', mascot: 'selfhost',
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
    stage: 'Basic', hp: 40, hpMetric: 'hours', icon: '🏕️', mascot: 'somerin',
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
    stage: 'Basic', hp: 137, hpMetric: 'loc', icon: '🎮', mascot: 'souls',
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
    stage: 'Basic', hp: 30, hpMetric: 'hours', icon: '🧾', mascot: 'chapeau',
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
    stage: 'Basic', hp: 25, hpMetric: 'hours', icon: '🌱', mascot: 'greenhouse',
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
    stage: 'Basic', hp: 3129, hpMetric: 'loc', icon: '🎟️', mascot: 'movie',
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

if (import.meta.env.DEV) {
  for (const p of PROJECTS) {
    console.assert(Array.isArray(p.languages) && p.languages.length > 0, `${p.id}: languages missing or empty`);
    console.assert(typeof p.role === 'string' && p.role.length > 0, `${p.id}: role missing`);
    console.assert(p.hpMetric === 'loc' || p.hpMetric === 'hours', `${p.id}: hpMetric invalid`);
    console.assert(!('weakness' in p), `${p.id}: stale weakness field present`);
  }
}
