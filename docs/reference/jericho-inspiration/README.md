# Jericho mascot — visual reference library

Ground-truth reference images for the Jericho card redesign (mascot "Node" + its scene).
These are **design references only** — they live in `docs/` and must never ship in the
production bundle.

Distinct from `docs/reference/pokemon-cards/`, which holds Fred's own physical cards as
general card-convention reference (foil behavior, layout, rarity markers). This folder is
specifically about *what Node should look like and how its scene should be lit*.

## What goes where

| Folder | What to put here | The craft problem it answers |
|---|---|---|
| `01-magneton-lineage/` | Magnemite, Magneton, Magnezone — any era, any rarity | Jericho's canon lineage: three linked units. How metal is rendered (specular highlights, reflected environment color) and how visible hardware (screws, magnet caps) keeps the lineage legible. |
| `02-sphere-voltorb-electrode/` | Voltorb, Electrode | Making a perfect sphere read as a *sphere* and not a flat circle — terminator line, bounce light, contact shadow. Node's core is spherical; v1 failed this. |
| `03-translucent-inner-light/` | Solosis, Duosion, Reuniclus, Cryogonal | A glowing core seen *through* a translucent shell, and hard angular faceting on a see-through body. This is Node's exact material. The single biggest v1 failure. |
| `04-hex-mechanical/` | Klink, Klang, Klinklang, Rotom (any form) | Geared/plated linked units and geometric hard-surface plating — the closest real analog to Node's hex-plated modules, echoing Jericho's hexagonal-architecture concept. Rotom for the "entity living inside a machine" theme. |
| `05-night-interior-scenes/` | Any card whose illustration is a night or lamp-lit **interior** | Composition/lighting reference, not creature reference. Jericho's scene is a dusk room with one light source — how real illustrators stage a single warm light in darkness. |
| `06-rarity-treatment/` | Hyper Rare, Special Illustration Rare, Illustration Rare examples | Jericho is the deck's top-tier card, so the ceiling treatment is the bar. Also shows how much of a full-art card is actually illustration vs. text box. |
| `07-fred-picks-just-beautiful/` | **Fred's own picks — any card, any rarity, any era, no justification needed** | Taste, not craft. Cards Fred finds genuinely beautiful and wants this deck to feel like. The other six buckets answer technical problems; this one carries the aesthetic target those techniques are supposed to serve. If a proposal satisfies buckets 01-06 but doesn't feel like *these*, it has missed. |

## Naming

Name files so they can be cited precisely in a design brief:

```
Magneton_IR_SVP159_ShinjiKanda.jpeg
Electrode_base-set.jpeg
Reuniclus_SIR.jpeg
Xatu_IR_night-interior.jpeg
```

Set/number and illustrator where known — a brief that says "per `Magneton_IR_SVP159`" is
checkable; one that says "like that one Magneton card" is not.

## Why this exists

The v1 Jericho redesign was built from a written brief with no direct visual grounding, and
the result read as flat vector shapes next to real card art. More reference, cited
specifically, is the fix.
