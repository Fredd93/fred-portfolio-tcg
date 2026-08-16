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
- Add a short description ("nutshell") to the three full-art flagship card
  faces, plus a longer expansion shown only when the modal is opened.

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

**Method (for projects with a local/accessible git repo):** net lines
added minus deleted, from `git log --author="Mahmoud Farid" --numstat`,
restricted to actual source-code file extensions for that project's stack
(e.g. `*.py` for a Python project, `*.php`/`*.vue`/`*.js` for GTA,
`*.cs`/`*.cshtml` for C# projects), explicitly excluding markdown docs,
AI-agent skill/plan directories, vendor directories (`node_modules`,
`vendor`), build-output directories (`bin`, `obj`), lockfiles, and other
non-source files.

This methodology was validated by hand twice:
- An initial pass on Jericho without the extension restriction produced
  22,335 "lines," dominated by `docs/superpowers/plans/*.md` design-doc
  markdown (1,600+ lines in a single planning doc) and AI-agent skill
  definition files, not code. Restricting to actual source extensions
  dropped it to a defensible 4,108.
- A second pass, prompted by the user asking for an explicit GitHub check
  rather than relying on secondhand notes, found a project (Service Desk)
  previously marked "no code found" actually has a real repo
  (`CRUDProject`, C#/MongoDB, confirming the user's own memory of using
  NoSQL there) once checked directly against the GitHub account via `gh
  api` rather than only the local filesystem.

**Method (for projects with no git history — plain folders):** total
current line count in source files, via the same extension-based
filtering. No commit history exists to attribute by author, so this is a
snapshot count rather than a contribution count.

| Project | `hp` (LOC) | `hpMetric` | Method | Source |
|---|---|---|---|---|
| Jericho | 4108 | `'loc'` | git, author-attributed | local: `Personal Projects\Jericho`; confirmed matches `github.com/Fredd93/Jericho` (private) |
| TulipVision | 2779 | `'loc'` | git, author-attributed | local: `Inholland_IT3B_tulip_object_detection` |
| Grand Transmission Auto | 9534 | `'loc'` | git, author-attributed | local: `693428_Fred_Farid_Webdev2_Final_assignment_Auto_store` (the canonical repo — a second local repo, `Grand_Transmission_Auto`, exists with fewer commits and uncommitted work; not used) |
| Haarlem Festival | 4583 | `'loc'` | git, author-attributed | local: `HaarlemFestival` |
| Self-Hosted AI Infra | 159 | `'loc'` | total, no git history | local: `Personal Projects\Self-hosting MCP` |
| Souls Within | 137 | `'loc'` | total, no git history | local: `Personal Projects\Games\Souls within\Game\Souls_within\Assets` |
| Movie Ticketing | 3129 | `'loc'` | total, no git history | local: `Studies\...\Java\...\FinalAssignment` |
| Service Desk Ticket System | 1903 | `'loc'` | git, author-attributed | GitHub only: `github.com/Fredd93/CRUDProject` (private, C#/MongoDB) — not present locally, found only by checking the GitHub account directly |
| Severe Weather Alert System | 650 (unchanged) | `'hours'` | no repo with the actual internship deliverable is accessible — career-vault notes it needs sanitizing before publishing; a related personal repo (`severe-weather-simulation`, public) exists but is Fred's own parallel research/simulation project, not the shipped internship system, so it isn't used as the LOC source for this card | — |
| Somerin | 40 (unchanged) | `'hours'` | no repo found anywhere, incl. GitHub | — |
| Chapeau POS | 30 (unchanged) | `'hours'` | no repo found anywhere, incl. GitHub (only a requirements PDF exists) | — |
| Greenhouse Automation | 25 (unchanged) | `'hours'` | no repo found anywhere, incl. GitHub | — |

4 rows (down from the originally-assumed 5, after finding Service Desk's
repo) keep their existing work-hour HP values and `hpMetric: 'hours'` —
a deliberate mixed-metric approach (confirmed with the user) rather than
fabricating LOC numbers or blocking the whole feature on locating the
remaining missing codebases.

## Weakness → Role: per-project values

| Project | `role` |
|---|---|
| Jericho | `'Sole Developer (Personal Project)'` |
| Severe Weather Alert System | `'Sole Developer (Internship)'` |
| TulipVision | `'Team Lead & Lead Developer (Client-Facing)'` |
| Grand Transmission Auto | `'Sole Developer'` |
| Haarlem Festival | `'Team Lead & Design Lead'` |
| Self-Hosted AI Infrastructure | `'Sole / Personal'` |
| Somerin | `'Team Lead (Team Dispersed — Delivered Alone)'` |
| Souls Within | `'Sole Developer (Personal Project)'` |
| Chapeau POS | `'Team Member (Design + Dev)'` |
| Greenhouse Automation | `'Sole Developer'` |
| Movie Theater Ticketing | `'Sole Developer'` |
| Service Desk Ticket System | `'Team Lead'` |

These values went through two rounds of user correction before landing
here. The first draft leaned on existing `context`/`stage`/`flavor` text
already in the data plus direct answers for the 4 previously-ambiguous
academic projects (Chapeau: team, Greenhouse: solo, Movie: solo, Service
Desk: team). The user then corrected several: GTA and Somerin are sole
delivery (Somerin specifically despite being "team lead" on paper — the
user delivered it alone after the team dispersed); Haarlem was team *and*
design leadership, including delegating work across teammates and pulling
the team together; TulipVision's role expands to cover presenting and
being client-facing, not just "lead developer"; Jericho's phrasing was
strengthened to reflect full ownership (concept, research, and
architecture, not just "developer"); Chapeau gained "Design" since the
user was also part of its Figma prototyping, same as Haarlem; Service Desk
upgraded from "Team Member" to "Team Lead" once the user clarified they
led that CRUD project including team-organizing duties. The user also
asked for "Sole" instead of "Solo" throughout.

## Languages: per-project values

| Project | `languages` |
|---|---|
| Jericho | `['Python', 'Flutter (planned)']` |
| Severe Weather Alert System | `['Python', 'CloudFormation (IaC)']` |
| TulipVision | `['Python']` |
| Grand Transmission Auto | `['PHP', 'Vue.js (JS)']` |
| Haarlem Festival | `['PHP', 'JavaScript']` |
| Self-Hosted AI Infrastructure | `['Python']` |
| Somerin | `['C#', 'Azure', 'SQL']` |
| Souls Within | `['C#']` |
| Chapeau POS | `['C#', 'SQL']` |
| Greenhouse Automation | `['C++ (Arduino)']` |
| Movie Theater Ticketing | `['Java']` |
| Service Desk Ticket System | `['C#', 'MongoDB']` |

Jericho's `'Flutter (planned)'` is deliberately qualified: the repo
contains a real architecture-decision document
(`docs/decisions/2026-07-19-client-stack-flutter.md`) whose status line
reads "Accepted (direction recorded — not yet built)" — Flutter is a
genuine, deliberate tech decision, but no Dart/Flutter code exists yet, so
marking it unqualified `'Flutter'` would overclaim. Severe Weather's
CloudFormation entry and Somerin's Azure entry were both added after
direct user correction (Azure was already implied by Somerin's existing
`context`/attack text but had been missed in the first draft). Service
Desk's MongoDB entry is corroborated by the `CRUDProject` repo directly
referencing `MongoDB.Driver`/`MongoDB.Bson`. Chapeau's language had no
code or existing card text to draw from and was supplied directly by the
user (C#, SQL).

## Description: full-art flagships only, split into nutshell + expansion

Only these three projects (the IR/SIR/SSIR full-art rarities) get
populated description fields. Per user direction, the **card face** shows
a short, precise summary ("the nutshell of the application"); the fuller
narrative only appears once the card is clicked, in `CardModal`.

- **`description`** (short, ~25-35 words, rendered on the card face):
  - **Jericho:** *"A personal ambient AI assistant, conceived and
    architected entirely solo — hexagonal architecture, machine-enforced
    contracts, and a growing voice-driven feature set."*
  - **Severe Weather Alert System:** *"An AWS-based severe-weather
    prediction system built solo during an internship — researched,
    designed, deployed, and shipped into the company's own cloud
    account."*
  - **TulipVision:** *"A three-person capstone comparing four
    object-detection architectures for tulip disease detection, led by
    Fred as team lead and client-facing presenter."*

- **`detail`** (longer, rendered only in `CardModal`):
  - **Jericho:** *"Every technical decision is mine — including the call
    to move the client to Flutter next while the Python core stays.
    Currently in active development, sprint by sprint, integrating local
    and cloud LLMs, voice I/O, and machine-enforced architectural
    contracts that keep the codebase honest as it grows."*
  - **Severe Weather Alert System:** *"Infrastructure as code via
    CloudFormation, after evaluating open-source alternatives like MinIO
    S3 before landing on native AWS S3. Prediction logic is grounded in
    real climate science — the Köppen classification system, researched
    independently, fed by Open-Meteo data. First project with enforced
    infrastructure contracts and a Makefile-driven build. An XGBoost
    model on top predicts dangerous severe-weather events at ~92%
    accuracy."*
  - **TulipVision:** *"Trained, evaluated, and benchmarked four
    architectures head to head — Faster R-CNN, RetinaNet, YOLOv5, and
    YOLOv11. The Faster R-CNN model won on F1 (0.86) and mAP (0.83) and
    now powers the production app, served via a FastAPI backend deployed
    to Azure Container Apps."*

Both fields for all three projects are grounded in facts confirmed
directly by the user (the AWS-research/MVP-design/deployment/microservice
-registration narrative, the CloudFormation/MinIO/Köppen/Makefile/
contract-enforcement details, the Flutter decision, the client-facing/
presenter role) and, where checkable, verified directly against code:
the MinIO→S3 pattern is confirmed in `severe-weather-simulation`'s
`libs/data/provider.py` (a boto3 S3 client pointed at a configurable
`S3_ENDPOINT`, consistent with using MinIO as an S3-compatible substitute
before/alongside real AWS S3), and the Flutter decision is confirmed
directly in Jericho's own decision-log markdown.

The other 9 projects get `description: null` and `detail: null` and
render nothing new.

## Data model changes

`src/data/cards.js`, per project object in `PROJECTS`:

- **Remove:** `weakness` field.
- **Add:** `role: string` (replaces weakness everywhere weakness was shown).
- **Add:** `hpMetric: 'loc' | 'hours'` (disambiguates the HP subtext label
  — `'loc'` renders "LOC" instead of the current "est.").
- **Add:** `languages: string[]`.
- **Add:** `description: string | null` (short nutshell, only non-null for
  the 3 full-art flagships; rendered on the card face).
- **Add:** `detail: string | null` (longer expansion, only non-null for
  the same 3 flagships; rendered only in `CardModal`).
- `hp` itself stays a `number`, just sourced differently per the table
  above depending on `hpMetric`.

`resistance` and `retreat` are unchanged.

## UI changes

**`CardFace` (`src/components/Card.jsx`), classic layout (9 cards):**
- The `.wrr` row changes from `Weak: {project.weakness}` to
  `Role: {project.role}`. `Retreat: {project.retreat}` is unchanged.
- The HP subtext (`<small>`) renders `'LOC'` when `hpMetric === 'loc'`,
  `'est.'` when `hpMetric === 'hours'` (unchanged label for the 4 that
  keep the hours metric).
- No other layout change on classic cards — no description, no languages
  row. These stay compact.

**`CardFace`, full-art layout (3 cards):**
- Same `.wrr` and HP-subtext changes as classic layout.
- New: the short `description` (nutshell) rendered between the `.attacks`
  block and the `.flavor` line.
- New: a compact languages row (e.g. small pill list) rendered near the
  description, showing `project.languages`.
- `detail` is NOT rendered on the card face — modal only.

**`CardModal` (`src/components/CardModal.jsx`), all 12 projects:**
- Same `Weakness:` → `Role:` label/value change in the existing
  weakness/resistance/retreat summary line.
- New: a "Languages" row added to the modal, showing `project.languages`
  — this is the one place all 12 projects' languages are visible, not just
  the 3 full-art ones.
- New: when `project.detail` is non-null (the 3 full-art flagships), an
  additional paragraph rendered below the existing flavor text, showing
  the expanded narrative. When `detail` is null (the other 9), nothing
  new renders here beyond the Role/Languages changes above.

**`FlipCard` / `PackCard` (pack-opening reveal faces):** `PackCard.jsx`
renders `<CardFace project={item.data} .../>` directly for project-kind
pulls (confirmed by reading the file). No separate change is needed here —
the pack-opening reveal automatically picks up every `CardFace` change
above for free. The pack-opening inspect modal (added in the prior
pack-navigation feature) reuses the same `CardModal`, so it also picks up
the `detail` expansion automatically.

## Testing

No automated test framework exists in this repo (consistent with prior
features). Verification is `npm run build` plus a manual QA pass checking:
every classic-layout card shows "Role:" not "Weak:"; the 8 LOC-metric
cards show "LOC" as the HP subtext and the 4 hours-metric cards still show
"est."; the 3 full-art cards render their short `description` on the card
face (not `detail`); `CardModal` shows the correct role, full language
list, and (for the 3 flagships only) the `detail` expansion, for a sample
of both classic and full-art projects; no project accidentally lost its
`weakness` value being read anywhere (a global search for `.weakness`
usage should turn up zero remaining references after the change).
