# Angler's Arrows — v1.38.0

**Version 1.38.0** · ARTEZIQ · updated 2026-08-31

Offline PWA puzzle: every level is a fish built from bent arrow paths. Clear the arrows to
reveal the species artwork, then learn to recognize it by its features.

### Changelog
- **1.38.0** — The header logo is now a button: tapping it closes any open panel and returns to the
  start screen (progress is kept, menu music resumes). Added a 4.5s splash intro on first load — the
  badge rises out of the depths, blurred and dim, settles with two expanding water rings, then the
  tagline and button fade in and the idle sway takes over. It plays once per load, is skipped when
  returning via the logo, and is disabled under reduced-motion.
- **1.37.0** — Added difficulty: **Shallows** / **Open Water** / **Deep Current**, defaulting to the
  middle. It scales the board (roughly 27 / 37 / 62 arrows on level 1) and the maximum arrow length.
  A picker appears every time you tap **Start fishing**, and the same control sits in Settings, where
  changing it re-deals the current level immediately.
- **1.36.0** — Reveal is now exhaustive: clearing an arrow surfaces **every** tile that is no longer
  under a live arrow, including the pale background slices, rippling outward from the arrow you
  cleared. Previously only the arrow's own cells (and one ring of neighbours) came up, which left
  unrevealed holes scattered through areas you had already cleared. Undo/reset recompute the
  revealed area to match the board exactly.
- **1.35.0** — Cleaner reveal. Tiles are now laid across the **whole grid** instead of only the cells
  the arrow-mask marked as fish, so fins and edges are no longer missing and the finished picture is
  whole. Raised the unrevealed baseline (7% → 22%) so the fish reads as one image rather than a
  checkerboard, feathered the edge of each cleared area into its uncovered neighbours, and replaced
  the scale-pop with a brightness bloom that doesn't shift tile edges.
- **1.34.0** — Dropped the habitat scene behind the board: it was a different painting from the
  cutout, so the two fish never lined up. The cutout is now the only artwork. The reveal is also
  **sectional** — the picture is sliced one tile per grid cell, so clearing an arrow surfaces
  exactly the part of the fish it was covering, instead of fading the whole image. Finishing a level
  sweeps the remaining tiles in from the centre.
- **1.33.0** — Music now dips **fully to silent** under the reveal sting (previously only to 16%),
  fading out in 200ms and easing back over 1.1s once the sting actually ends — driven by the audio
  `ended` event rather than a fixed timeout, with a safety net if it never fires.
- **1.32.0** — Stopped Safari's "It looks like you are typing while in full screen" prompt appearing
  when closing Fish Caught. Two things triggered it: a `keydown` listener used to unlock audio, and
  the Settings range sliders taking keyboard focus. Audio now unlocks on touch alone, the sliders are
  out of the focus path, and focus is cleared whenever a panel opens or closes.
- **1.31.0** — Menu music now plays on the splash screen (it was being overwritten by the gameplay
  bed at boot, and unlocked too late). Audio now unlocks on the player's first touch anywhere, and
  the menu bed hands over to the gameplay bed on "Start fishing". New **Settings** panel behind a
  gear icon under the sound button: **Music level**, **Sound level** and **Fullscreen lock**, all
  saved between sessions.
- **1.30.0** — Audio added: menu loop, two gameplay beds that follow the environment (reef →
  freshwater, wreck → deep), and a reveal sting that ducks the music. Unlocks on the first tap for
  iOS. Three-state sound button (on / music only / off) saved between sessions. Optional SFX hooks
  wired to every event — drop files into `assets/audio/` with the documented names and they
  activate automatically. Audio re-encoded 13.5 MB → 7.4 MB.
- **1.29.0** — Fixed the About ("i") screen opening *behind* Fish Caught (z-index 92 vs 95); overlays
  now use an explicit layer map. Larger, higher-contrast text on the About and opening screens.
  Added **Reset All Fish** at the bottom of Fish Caught (two-tap confirm) which clears every catch and
  restarts at Level 1.
- **1.28.0** — Fixed Replay / Next fish doing nothing after visiting Fish Caught. Overlays were
  *opened* with inline styles (`forceShow`) but *closed* by removing a CSS class, so the win card
  stayed pinned at z-index 9000 over the new board. Every overlay now opens and closes the same way.
  Async handler rejections are now surfaced as an error toast instead of failing silently.
- **1.27.0** — Fixed `TypeError: undefined is not an object (evaluating 's.a')` after finishing a
  level. The 15-species roster dropped the old vector `spec` field, but three call sites still asked
  the retired vector renderer to draw it — which also silently forced every board to fall back to a
  generic ellipse instead of the fish shape. The vector renderer is now removed entirely: puzzle
  masks, reveals and guide art all come from the transparent cutouts.
- **1.26.0** — Roster expanded to **15 species** using the ported Angler's Jigsaw artwork, with the
  canonical naming convention adopted: `assets/fish/NN_slug_large.png` (transparent — puzzle shape,
  reveal, guide), `assets/puzzles/NN_slug_puzzle.jpg` (habitat backdrop behind the board),
  `assets/thumbs/NN_slug_thumb.png` (list rows + drifting background fish), `assets/themes/` for
  environments. Habitat scene now sits behind each board and brightens as arrows clear. Assets
  optimized 59 MB → 13.6 MB.
- **1.25.0** — Fixed being stranded after opening **Fish Caught** from the level-complete card:
  opening the list hid the win card and nothing restored it, leaving a finished level with no way to
  advance. Closing the list now brings the win card back (Replay / Fish Caught / Next fish), with a
  safety net that restores it any time a completed level has no card showing.
- **1.24.0** — Added a **Fish Caught** button to the level-complete card, between Replay and Next
  fish (and beside Dive again on the final level). Button row now wraps and scales on narrow screens.
- **1.23.0** — Ambient scene brought up: environments 30%→46% opacity and brighter, drifting fish
  0.16–0.32→0.30–0.46, bubbles 12→17 and brighter. Drifting fish now sway and "breathe"
  (gentle tail rotation + slow swell), each at its own pace, with the direction-flip folded into the
  animation so no fish ever swims backwards.
- **1.22.0** — Tapping a blocked arrow now shows a running warning under the board:
  "Wrong choice N of 6 this game. Choose wisely." in amber with a shake, clearing on the next
  successful move, reset, or new level.
- **1.21.0** — Six wrong taps now raise a clear "6 wrong arrows" prompt (with the running count and
  a **Try again** button that restarts the same fish). Reveal curve retuned: the artwork starts at 5%
  opacity, rises only to 50% as arrows clear, then snaps to 100% with a scale-pop on the final move.
- **1.20.0** — "Your Catch" renamed **Fish Caught** (button and panel title). Image credits moved
  off the About screen onto each species page, parsed per-species from `images/fish/CREDITS.txt`.
  Added a **Fish Caught** button at the bottom of every species page. Shipped a corrected
  CREDITS.txt for the current artwork.
- **1.19.0** — "Your Catch" now force-opens with inline styles and is re-appended to the top of the
  document, so no CSS/stacking condition can hide it. Arrows restyled to match classic arrow-maze
  games: thin uniform lines, rounded corners at every bend, slim sharp tips, and arrowheads always
  inline with their line.
- **1.18.0** — Fixed "Your Catch" freezing the app: opening it decoded eight full-size (1536x1024)
  plates at once (~50 MB), exhausting memory on iPad. Artwork is now optimized (22.8 MB → 6.2 MB),
  the Field Guide and background fish use small thumbnails, and only one full-size image is ever
  decoded at a time. All dynamically-created buttons are crash-wrapped.
- **1.17.0** — Fixed "Your Catch" freezing the UI; every handler is now crash-proofed with an
  on-screen error toast. Added the ARTEZIQ brand/version bar to the bottom of every screen.
  Switched to semantic versioning.
- **v16** — Fixed dead input after level 1 (tap-guard); arrows now snake out head-first along
  their own bends (the head end was being animated from the wrong cell).
- **v15** — Roster rebuilt to 8 species with transparent artwork (exact fish-shaped puzzles);
  ambient underwater background with drifting fish + reef/shipwreck environments.
- **v13/v14** — Progressive artwork reveal as arrows clear; PNG support; thinner arrow tips.
- **v12** — Field Guide rebuilt as an in-panel list/detail; bigger board.

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


### Option B — download the FWS / Raver scans by hand (most reliable)
On **fws.gov**, open each species page (Species search), and on the image use **Download**. The credit
reads "Raver, Duane" and licence "Public Domain." Save each as the exact filename below into
`images/fish/` (side-profile scans work best):

  bluegill.jpg  largemouth-bass.jpg  smallmouth-bass.jpg  black-crappie.jpg
  yellow-perch.jpg  channel-catfish.jpg  rainbow-trout.jpg  redfish.jpg  (FWS: "Red drum")
  spotted-seatrout.jpg  striped-bass.jpg  flounder.jpg  (FWS: "Southern flounder")  sheepshead.jpg

The app removes the plate's background automatically, shapes the puzzle to that fish's outline, shows
the scan **ghosted under the arrows**, and **materializes** it when you finish the level. Add a
`CREDITS.txt` in `images/fish/` (the notebook writes one) and it shows on the in-app About screen.
Public-domain images need no attribution, but listing Duane Raver / USFWS is good practice.

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
