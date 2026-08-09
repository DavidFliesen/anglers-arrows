# Angler's Arrows — Fish Arrow Puzzles

A calm, offline-first PWA puzzle. **Every level is a fish built entirely out of arrow tiles.**
Tap an arrow to send it swimming off the board — it only leaves if its straight-line path to
the edge is clear. Clear all the arrows and the fish's true colors surface underneath, along
with the species name, scientific name, and a fact about it.

Inspired in mechanic by "arrow maze" games, reworked so the picture *is* the puzzle: the fish
silhouette is the board.

## How it works
- Each fish is a hand-built parametric SVG. On load it's rasterized in the browser into a small
  grid of colored cells — that fish-shaped set of cells becomes the board.
- Arrows are placed by **reverse construction**: each arrow is added only when it has a clear ray
  to the edge over the arrows already placed. Removing them in reverse order is always possible,
  so **every puzzle is guaranteed solvable and can never deadlock**, no matter the tap order.
- Arrows are **variable-length pieces** (1–5 cells) with a single arrowhead, drawn as bold rounded
  strokes on a light dotted board — the professional "arrow maze" look. Clearing a piece slides it
  off and uncovers the fish's real colors beneath it.
- Difficulty ramps by growing the fish's grid width across the 12 species (≈15 → ≈35 arrow pieces).




## Learning the fish (the point of it)
Angler's Arrows is built to help anglers recognize species by sight. The roster leads with fish
you actually catch — bluegill, largemouth and smallmouth bass, crappie, yellow perch, channel
catfish, rainbow trout — then moves to inshore species (redfish, spotted seatrout, flounder,
sheepshead). Clearing a puzzle reveals a detailed field-guide illustration of the fish with a
**"How to know it"** list of the features you'd use to identify one on the water, plus its common
and scientific name. Everything you've landed is saved in the **Field Guide** (top-right); tap any
caught species to study its illustration and field marks again. The completion screen waits for
you — study first, then tap **Next fish**.




## Real fish artwork (photos / illustrations)
The reveal, the Field Guide, **and the puzzle itself** use a real image for any species that has one.
Each fish looks for `images/fish/<slug>.jpg` (slugs in `images/fish/README.txt`).

When an image is present, the app:
- **shapes the puzzle from the artwork** — it removes the background, and the arrows fill the real
  silhouette and proportions of that fish (not the drawn illustration);
- shows the artwork **ghosted underneath** the arrows while you play, and on completion it
  **materializes** from ghost to full;
- uses the photo in the reveal card and the Field Guide.
If no image is present, everything falls back to the built-in vector illustration automatically.

### Where to get properly-licensed images
- **USFWS / Duane Raver illustrations** — realistic public-domain plates used on most US state fishing
  regs; the most credible option. **No attribution legally required** (an About credit is good practice).
- **NOAA Photo Library** — public-domain photographs.
- **Wikimedia Commons / iNaturalist / GBIF** — real images, per-item CC licences (attribution required
  for CC-BY; a credits list satisfies it — no per-image stamp needed).
There is no clean "pip install" library of redistributable per-species fish photos; pull from the
public-domain sources above and bundle the files.

### Auto-populate (Colab)
Open **`tools/fetch_raver_fish.ipynb`** in Google Colab and Run All. It pulls freely-licensed images
from Wikimedia Commons (preferring Duane Raver public-domain plates), previews them, writes
`images/fish/CREDITS.txt`, and zips everything. Unzip at the app root so files land in `images/fish/`.
(`tools/fetch_fish_photos.py` is a plain-Python version of the same.)

### Attribution & the About screen
Tap **Your Catch → the "i" (About)** button. The About screen auto-loads `images/fish/CREDITS.txt`
and displays it, so credits live in one place. Public-domain art needs no credit; CC-BY art is
covered by that list. You do **not** need a credit stamped on each image.

## Updates reach players automatically
The service worker is **network-first for the page**, so when you deploy a new `index.html` to
GitHub Pages, players get it on their next load (assets still cache for offline). After deploying,
a reload or two fully swaps the cached copy.

## Files
- `index.html` — the whole game (no dependencies, works offline)
- `manifest.webmanifest` — installable PWA metadata
- `service-worker.js` — offline cache (`anglers-arrows-v1`)
- `icons/` — app icons generated from the Angler's Arrows logo
- `logo_src.png` — the source logo

## Deploy to GitHub Pages
1. Put these files at the repo root (or `/docs`).
2. Settings → Pages → deploy from that branch/folder.
3. Visit the URL on a phone and "Add to Home Screen" to install it.

Must be served over **https** (GitHub Pages is) for the service worker and install to work.

## Extend it
- **Add a species:** append to the `FISH[]` array with a `spec` for `fishSVG()`
  (body `a`/`b`, colors, `tail`, `pattern`, fins, `spikes`, `bill`). It's picked up automatically.
- **Tune difficulty:** edit `levelWidth(i)` (grid width per level).
- **Ideas:** sound, freshwater vs saltwater packs, a move "par" / star rating, daily fish.
