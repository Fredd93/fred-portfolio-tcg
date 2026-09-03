# Local image generation setup — RTX 4070 Laptop (8GB VRAM)

Target hardware: Ryzen 9 7940HX · 16GB system RAM · **RTX 4070 Laptop GPU, 8GB VRAM** · Windows 11.

8GB is the binding constraint. Everything below is chosen to fit it. All links verified
2026-09-03.

---

## 1. Install ComfyUI

Two options, either is fine:

- **Desktop app** (easiest, auto-updates) — <https://comfy.org/download>
- **Portable build** (self-contained folder, no installer) — <https://docs.comfy.org/installation/comfyui_portable_windows>

Pick the NVIDIA/CUDA package. Launch it once and confirm it opens in the browser before
downloading any models.

## 2. Install the GGUF custom node

**This is the step that makes 8GB viable.** Without it the quantised models will not load.

<https://github.com/city96/ComfyUI-GGUF>

Easiest route: open **ComfyUI Manager** inside ComfyUI → Custom Nodes Manager → search
`ComfyUI-GGUF` → Install → restart.

Manual route: `git clone https://github.com/city96/ComfyUI-GGUF` into `ComfyUI/custom_nodes/`,
then restart.

## 3. Download the models

| File | Where to get it | Size | Goes in |
|---|---|---|---|
| `flux1-dev-Q4_K_S.gguf` | [city96/FLUX.1-dev-gguf](https://huggingface.co/city96/FLUX.1-dev-gguf/tree/main) | ~6.8 GB | `models/unet/` |
| `t5-v1_1-xxl-encoder-Q5_K_M.gguf` | [city96/t5-v1_1-xxl-encoder-gguf](https://huggingface.co/city96/t5-v1_1-xxl-encoder-gguf/tree/main) | ~3.5 GB | `models/text_encoders/` |
| `clip_l.safetensors` | [comfyanonymous/flux_text_encoders](https://huggingface.co/comfyanonymous/flux_text_encoders/tree/main) | ~246 MB | `models/text_encoders/` |
| `ae.safetensors` (VAE) | [black-forest-labs/FLUX.1-schnell](https://huggingface.co/black-forest-labs/FLUX.1-schnell/blob/main/ae.safetensors) | ~335 MB | `models/vae/` |

**≈ 11 GB total.**

Notes:

- **Take Q4_K_S, not a bigger quant.** Q4_K_S is the 8GB sweet spot — it leaves headroom for
  the actual computation. Q5 and above will thrash.
- **The quantised T5 matters as much as the quantised model.** The usual `t5xxl_fp8` is 4.9GB;
  paired with a 6.8GB model that is 11.7GB and will not co-reside in 8GB. The GGUF T5 at
  Q5_K_M is ~3.5GB. city96 recommends Q5_K_M or larger for quality.
- Older ComfyUI builds call the text-encoder folder `models/clip/` rather than
  `models/text_encoders/`. Use whichever your install has.
- The VAE is pulled from the **schnell** repo deliberately — same file, more permissive licence,
  less gating friction than the dev repo.

## 4. First run

1. Restart ComfyUI after placing the files.
2. Load a Flux GGUF workflow — the examples at
   <https://comfyanonymous.github.io/ComfyUI_examples/flux/> are the canonical starting point.
3. Swap the loaders: **Unet Loader (GGUF)** for the model, **DualCLIPLoader (GGUF)** for the
   encoders.
4. **Set DualCLIPLoader (GGUF) `type` to `flux`.** This is the single most common setup mistake
   and it fails confusingly if you miss it.
5. Generate one 1024×1024 test image before touching the real prompts.

**Expect 1–3 minutes per image** at 20–25 steps. That is normal for this card; it is not broken.

## 5. Add Kontext later, for the pose edits

Needed for step 3b–3d of the prompt pack (generating the awake pose from the rest pose).
Same install pattern, goes in `models/unet/`, take the Q4 variant (~6.9 GB):

- [QuantStack/FLUX.1-Kontext-dev-GGUF](https://huggingface.co/QuantStack/FLUX.1-Kontext-dev-GGUF)
- [bullerwins/FLUX.1-Kontext-dev-GGUF](https://huggingface.co/bullerwins/FLUX.1-Kontext-dev-GGUF)

Don't download this until the base model is generating properly.

---

## Licence — decide this before building a deck on it

**FLUX.1-dev is a non-commercial licence.** This is a portfolio that exists to get you hired,
which is at minimum a grey area. Two clean ways out:

1. **Use FLUX.1-schnell instead** — Apache-2.0, unambiguously fine for any use.
   [city96/FLUX.1-schnell-gguf](https://huggingface.co/city96/FLUX.1-schnell-gguf)
2. Read the dev licence yourself and decide it covers your case.

**Schnell is arguably the better pick for this machine anyway:** it is distilled to run in
**~4 steps instead of 20–25**, so it is several times faster on an 8GB laptop, and the quality
gap matters far less for stylised illustration than it would for photorealism. The trade is
slightly weaker prompt adherence.

Suggested order: try schnell first. Only move to dev if schnell can't hold the style.

---

## The LoRA — rent, don't run it locally

Character-consistency LoRA training for FLUX wants 16–24GB VRAM. It is technically possible on
8GB and genuinely miserable. It is also a **one-off job of 30–60 minutes**.

- **RunPod / Vast.ai** — rent a 4090 or A100, well under $1/hour.
- **Replicate / fal.ai** — hosted FLUX LoRA training, no infrastructure to touch.

See §8 of `2026-09-03-node-generation-prompts.md` for the bootstrap order — you generate Node
first, then train the LoRA on ~20 edits of the chosen image.

---

## Disk and RAM

~11 GB now, ~18 GB with Kontext, ~25 GB with schnell as well. You have 953 GB, so disk is a
non-issue.

**Close everything else while generating.** 16 GB system RAM is the real squeeze — Windows takes
3–4 GB, and ComfyUI offloads to system RAM whenever the model doesn't fit in VRAM. If you ever
upgrade this laptop, RAM is the cheap win; VRAM is soldered.
