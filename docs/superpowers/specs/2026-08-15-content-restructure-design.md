# Content restructure — "make it IT worthy" — design

## Problem

The card data model currently mixes real-TCG-flavor stats (HP, weakness,
retreat) with career facts, but three of those stats don't actually carry
information a recruiter cares about:

- **HP** is always "estimated work hours," a stylization with no source
  data behind it for most projects.
- **Weakness** is a real-TCG game mechanic (`"Scope creep ×2"`,
  `"Team scope ×2 (3-person academic project)"`) that reads as flavor text,
  not a fact about Fred's actual contribution.
- The full-art (IR/SIR/SSIR) cards — the three flagship projects — have
  room for more substance than the current attack-list-only layout uses,
  and nowhere on any card shows the actual languages/tech used per project
  (that information currently only exists in the separate, project-agnostic
  "Type Chart" section of the gallery).

## Goals

- Where real commit history exists, replace HP with an actual lines-of-code
  number instead of an unverifiable "estimated hours" figure.
- Replace "Weakness" with "Role" — what Fred's actual role/contribution was
  on the project — everywhere it's shown.
- Add a `languages` field per project, surfaced in the `CardModal` for all
  12 projects, and additionally on the card face for the three full-art
  flagships where there's room.
- Add a real `description` paragraph to the three full-art flagship cards,
  giving them narrative substance a recruiter can read in a few seconds.

## Non-goals

- No change to `resistance` or `retreat` — only `weakness` is being
  replaced.
- No description field on the 9 classic-layout (common/holo/reverse-holo)
  cards — matches how real full-art rares are the tier with dedicated
  bottom-text real estate; classic-layout commons stay compact, consistent
  with real TCG commons. Their depth stays in `CardModal`.
- No change to card types (`TYPES` / energy-pip categories) — confirmed
  these stay as broad skill categories, not languages. Languages are new,
  separate data.
- This does not touch layout/CSS beyond what's needed to render the new
  fields — a full typography/readability pass and the illustration/rarity
  effects work (reverse holo, better full-art illustrations) are separate,
  later design passes per the agreed sequencing.

## HP → LOC: methodology and per-project source of truth

**Method (for projects with a local git repo):** net lines added minus
deleted, from `git log --author="Mahmoud Farid" --numstat`, restricted to
actual source-code file extensions for that project's stack (e.g. `*.py`
for a Python project, `*.php`/`*.vue`/`*.js` for GTA), explicitly excluding
markdown docs, AI-agent skill/plan directories, vendor directories
(`node_modules`, `vendor`), lockfiles, and other non-source files.

This methodology was validated by hand: an initial pass on Jericho without
the extension restriction produced 22,335 "lines," which turned out to be
dominated by `docs/superpowers/plans/*.md` design-doc markdown (1,600+
lines in a single planning doc) and AI-agent skill definition files, not
code. Restricting to actual source extensions dropped it to a defensible
4,108.

**Method (for projects with no git history — plain folders):** total
current line count in source files, via the same extension-based
filtering. No commit history exists to attribute by author, so this is a
snapshot count rather than a contribution count.

| Project | `hp` (LOC) | `hpMetric` | Method | Local source |
|---|---|---|---|---|
| Jericho | 4108 | `'loc'` | git, author-attributed | `Personal Projects\Jericho` |
| TulipVision | 2779 | `'loc'` | git, author-attributed | `Inholland_IT3B_tulip_object_detection` |
| Grand Transmission Auto | 9534 | `'loc'` | git, author-attributed | `693428_Fred_Farid_Webdev2_Final_assignment_Auto_store` (the canonical repo — a second repo, `Grand_Transmission_Auto`, exists with fewer commits and uncommitted work; not used) |
| Haarlem Festival | 4583 | `'loc'` | git, author-attributed | `HaarlemFestival` |
| Self-Hosted AI Infra | 159 | `'loc'` | total, no git history | `Personal Projects\Self-hosting MCP` |
| Souls Within | 137 | `'loc'` | total, no git history | `Personal Projects\Games\Souls within\Game\Souls_within\Assets` |
| Movie Ticketing | 3129 | `'loc'` | total, no git history | `Studies\...\Java\...\FinalAssignment` |
| Severe Weather Alert System | 650 (unchanged) | `'hours'` | no local code found — career-vault notes it needs sanitizing before publishing, likely exists only on a work machine | — |
| Somerin | 40 (unchanged) | `'hours'` | no local code found anywhere | — |
| Chapeau POS | 30 (unchanged) | `'hours'` | no local code found (only a requirements PDF) | — |
| Greenhouse Automation | 25 (unchanged) | `'hours'` | no local code found | — |
| Service Desk Ticket System | 25 (unchanged) | `'hours'` | no local code found | — |

The 5 rows with no local code keep their existing work-hour HP values and
`hpMetric: 'hours'` — this is a deliberate mixed-metric approach (confirmed
with the user) rather than fabricating LOC numbers or blocking the whole
feature on locating 5 missing codebases.

## Weakness → Role: per-project values

| Project | `role` |
|---|---|
| Jericho | `'Solo Developer'` |
| Severe Weather Alert System | `'Sole Developer (Internship)'` |
| TulipVision | `'Lead Developer (Team of 3, 70% of commits)'` |
| Grand Transmission Auto | `'Primary Developer'` |
| Haarlem Festival | `'Design Lead + Developer'` |
| Self-Hosted AI Infrastructure | `'Solo / Personal'` |
| Somerin | `'Team Lead (team dispersed)'` |
| Souls Within | `'Solo Developer'` |
| Chapeau POS | `'Team Member'` |
| Greenhouse Automation | `'Solo Developer'` |
| Movie Theater Ticketing | `'Solo Developer'` |
| Service Desk Ticket System | `'Team Member'` |

These values are drawn directly from information already present in each
project's existing `context`/`stage`/`flavor` fields (e.g. Jericho's
existing `context: 'Solo · Big Rock #1'`, TulipVision's existing flavor
`"70% of 128 commits"`), plus direct confirmation from the user for the
four academic projects that previously had no role signal in the data
(Chapeau: team, Greenhouse: solo, Movie: solo, Service Desk: team/group
CRUD project).

## Languages: per-project values

| Project | `languages` |
|---|---|
| Jericho | `['Python']` |
| Severe Weather Alert System | `['Python']` |
| TulipVision | `['Python']` |
| Grand Transmission Auto | `['PHP', 'Vue.js (JS)']` |
| Haarlem Festival | `['PHP', 'JavaScript']` |
| Self-Hosted AI Infrastructure | `['Python']` |
| Somerin | `['C#', 'SQL']` |
| Souls Within | `['C#']` |
| Chapeau POS | `['C#', 'SQL']` |
| Greenhouse Automation | `['C++ (Arduino)']` |
| Movie Theater Ticketing | `['Java']` |
| Service Desk Ticket System | `['C#']` |

Drawn from existing attack/context text (e.g. GTA's existing attack text
mentions "PHP/PDO" and "Vue 3 SPA") and confirmed with the user directly
for Chapeau POS, which had no code or existing card text specifying a
language.

## Description: full-art flagships only

Only these three projects (the IR/SIR/SSIR full-art rarities) get a
populated `description` field, rendered on the card face:

- **Jericho:** *"An ambient AI assistant built from the ground up with a
  hexagonal architecture — ports and adapters enforced by tooling, not
  convention. Currently in active solo development, integrating local and
  cloud LLMs, voice I/O, and a growing set of machine-enforced
  architectural contracts that keep the codebase honest as it grows."*
- **Severe Weather Alert System:** *"Built solo during a software
  engineering internship at Impala Studios: an XGBoost model that predicts
  dangerous severe-weather events at ~92% accuracy, deployed serverless on
  AWS with infrastructure as code and Redis caching for cost and latency.
  Delivered end to end — modeling, deployment, and a proposed office-ops
  fix still running today."*
- **TulipVision:** *"A three-person academic capstone comparing four
  object-detection architectures for automated tulip disease detection —
  Faster R-CNN, RetinaNet, YOLOv5, and YOLOv11 — trained, evaluated, and
  benchmarked head to head. The Faster R-CNN model won on F1 and mAP and
  now powers the production app behind a FastAPI backend with Azure
  deployment."*

All three descriptions are grounded entirely in facts already present
elsewhere in that project's existing card data (attacks, flavor, context)
— no new unverified claims are introduced, only narrative framing of
existing facts. User-approved as-is.

The other 9 projects get `description: null` and render nothing new.

## Data model changes

`src/data/cards.js`, per project object in `PROJECTS`:

- **Remove:** `weakness` field.
- **Add:** `role: string` (replaces weakness everywhere weakness was shown).
- **Add:** `hpMetric: 'loc' | 'hours'` (disambiguates the HP subtext label
  — `'loc'` renders "LOC" instead of the current "est.").
- **Add:** `languages: string[]`.
- **Add:** `description: string | null` (only non-null for the 3 full-art
  flagships).
- `hp` itself stays a `number`, just sourced differently per the table
  above depending on `hpMetric`.

`resistance` and `retreat` are unchanged.

## UI changes

**`CardFace` (`src/components/Card.jsx`), classic layout (9 cards):**
- The `.wrr` row changes from `Weak: {project.weakness}` to
  `Role: {project.role}`. `Retreat: {project.retreat}` is unchanged.
- The HP subtext (`<small>`) renders `'LOC'` when `hpMetric === 'loc'`,
  `'est.'` when `hpMetric === 'hours'` (unchanged label for those 5).
- No other layout change on classic cards — no description, no languages
  row. These stay compact.

**`CardFace`, full-art layout (3 cards):**
- Same `.wrr` and HP-subtext changes as classic layout.
- New: a description block rendered between the `.attacks` block and the
  `.flavor` line, showing `project.description`.
- New: a compact languages row (e.g. small pill list) rendered near the
  description, showing `project.languages`.

**`CardModal` (`src/components/CardModal.jsx`), all 12 projects:**
- Same `Weakness:` → `Role:` label/value change in the existing
  weakness/resistance/retreat summary line.
- New: a "Languages" row added to the modal, showing `project.languages`
  — this is the one place all 12 projects' languages are visible, not just
  the 3 full-art ones.

**`FlipCard` / `PackCard` (pack-opening reveal faces):** `PackCard.jsx`
renders `<CardFace project={item.data} .../>` directly for project-kind
pulls (confirmed by reading the file). No separate change is needed here —
the pack-opening reveal automatically picks up every `CardFace` change
above for free.

## Testing

No automated test framework exists in this repo (consistent with prior
features). Verification is `npm run build` plus a manual QA pass checking:
every classic-layout card shows "Role:" not "Weak:"; the 7 LOC-metric cards
show "LOC" as the HP subtext and the 5 hours-metric cards still show
"est."; the 3 full-art cards render their description and languages;
`CardModal` shows the correct role and full language list for a sample of
both classic and full-art projects; no project accidentally lost its
`weakness` value being read anywhere (a global search for `.weakness`
usage should turn up zero remaining references after the change).
