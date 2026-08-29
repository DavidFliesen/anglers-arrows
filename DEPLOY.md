# Angler's Arrows v1.27.0 — deployment / file placement

Unzip at the **root of your GitHub Pages repo** so paths land exactly as below.
The app resolves every asset relative to `index.html`, so the folder names matter.

## Final repo structure

```
<repo root>/
├── index.html                  ← REPLACE (v1.27.0)
├── service-worker.js           ← REPLACE (cache: anglers-arrows-1.27.0)
├── README.md                   ← REPLACE
├── manifest.webmanifest        ← keep your existing file
├── icons/                      ← keep your existing folder
│   ├── icon-192.png
│   ├── icon-512.png
│   ├── maskable-512.png
│   ├── apple-touch-icon.png
│   ├── favicon.png
│   └── mark-96.png
└── assets/                     ← NEW folder (replaces images/ and tools/)
    ├── CREDITS.txt
    ├── fish/                   15 transparent cutouts  (puzzle shape, reveal, guide)
    ├── puzzles/                15 habitat scenes       (backdrop behind the board)
    ├── thumbs/                 15 small cutouts        (list rows, drifting fish)
    └── themes/                 coral-reef.png, sunken-pirate-ship.png
```

## Delete after deploying (no longer referenced)

```
images/          ← old fish/ thumbs/ scenes/ from v1.18–v1.25
tools/           ← old fetch_fish_photos.py / fetch_raver_fish.ipynb / CREDITS.txt
```
Leaving them costs space and serves stale art, but will not break the app.

## Naming convention (canonical — matches Angler's Jigsaw)

| File | Used for |
|---|---|
| `assets/fish/NN_slug_large.png`   | transparent cutout → arrow shape, reveal, Fish Caught detail |
| `assets/puzzles/NN_slug_puzzle.jpg` | habitat scene behind the board |
| `assets/thumbs/NN_slug_thumb.png` | Fish Caught list rows + drifting background fish |
| `assets/themes/*.png`             | environments cycled at the start of each level |

`NN_slug` must match the `id` in the FISH array in `index.html`
(01_largemouth_bass … 15_bowfin). To swap artwork later, drop in a file with the
same name — no code changes needed.

## Verify after deploying
1. Hard-reload once or twice (service worker is network-first for the page).
2. Bottom bar should read **ARTEZIQ • Angler's Arrows • v1.27.0**.
3. Fish Caught should list 15 species.
