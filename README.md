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

## Real fish photos (recommended for credibility)
The reveal card and Field Guide will use a **real photo** for any species that has one.
Each fish looks for `images/fish/<slug>.jpg` (slugs listed in `images/fish/README.txt`).
If the file is present it shows the photo; if not, it falls back to the drawn illustration.
Photos are cached for offline use automatically the first time they load.

**Where to get properly-licensed images**
- **USFWS "Duane Raver" fish illustrations** — the realistic paintings used on most US
  state fishing regulations. Public domain, and the gold standard for fish ID credibility.
  (USFWS National Digital Library: digitalmedia.fws.gov; many are also on Wikimedia Commons.)
- **NOAA Photo Library** — public-domain photographs.
- **Wikimedia Commons** — large database, but licences vary per image; filter to
  Public Domain / CC0 / CC BY and keep attribution.
- **iNaturalist / GBIF APIs** — real photos, per-image CC licences (attribution required).
- Note: **FishBase** has images but they're contributor-copyrighted — not free to redistribute.

There is no clean "pip install fish photos" library with per-species, redistributable images;
the practical route is to pull from one of the public-domain sources above and bundle the files.

**Auto-populate:** run `tools/fetch_fish_photos.py` on a machine with internet — it queries
Wikimedia Commons for each species, downloads the best freely-licensed image to
`images/fish/`, and writes `tools/CREDITS.txt` with author + licence for each. Review the
results, swap any you don't like, and keep CREDITS.txt with the app to honor CC-BY licences.

## Notes on this build
- **Fullscreen:** a toggle sits at the top-right. Real fullscreen works on desktop and Android
  browsers; on iPhone/iPad Safari the Fullscreen API isn't available, so the toggle switches to an
  immersive layout instead — for true fullscreen on iOS, add the app to your Home Screen (it runs
  standalone). Launching from the splash requests fullscreen automatically where supported.
- **Try Again:** after six blocked taps on a single fish, the game offers a fresh start on that puzzle.
- **Arrows:** every puzzle is solvable in any valid order and can't dead-end. Arrows are spaced out
  (no stubby pieces, no back-to-back double-headed lines) and blocking chains make ordering matter.
- **Art:** the fish are original detailed vector illustrations (not photographs). If you ever want
  true photos, public-domain sources like the USFWS Duane Raver plates are an option to license/embed.

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
