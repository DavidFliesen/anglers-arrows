# Angler's Arrows v1.37.0 — deployment / file placement

Unzip at the **root of your GitHub Pages repo** so paths land exactly as below.
The app resolves every asset relative to `index.html`, so the folder names matter.

## Final repo structure

```
<repo root>/
├── index.html                  ← REPLACE (v1.37.0)
├── service-worker.js           ← REPLACE (cache: anglers-arrows-1.37.0)
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
    ├── puzzles/                (no longer used as of v1.37.0 — safe to delete)
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
| `assets/puzzles/NN_slug_puzzle.jpg` | **unused since v1.37.0** — different painting from the cutout, never aligned |
| `assets/thumbs/NN_slug_thumb.png` | Fish Caught list rows + drifting background fish |
| `assets/themes/*.png`             | environments cycled at the start of each level |

`NN_slug` must match the `id` in the FISH array in `index.html`
(01_largemouth_bass … 15_bowfin). To swap artwork later, drop in a file with the
same name — no code changes needed.

## Verify after deploying
1. Hard-reload once or twice (service worker is network-first for the page).
2. Bottom bar should read **ARTEZIQ • Angler's Arrows • v1.37.0**.
3. Fish Caught should list 15 species.

## Audio (added v1.37.0)

Music files ship in the zip and go here:

```
assets/audio/
├── menu.mp3              ← splash / menu loop      (your "Splash")
├── play-freshwater.mp3   ← gameplay bed, reef      (your "Freshwater")
├── play-deep.mp3         ← gameplay bed, wreck     (your "Deep Wreck")
└── reveal-sting.mp3      ← level-complete sting    (your "3.5 Sec Sting")
```

Re-encoded to 96 kbps stereo (sting 128 kbps): **13.5 MB → 7.4 MB**.

### Sound effects — optional, add any time
Drop MP3s into the SAME folder with these exact names. Any file that is absent is
simply skipped, so you can add them one at a time with no code change:

| File | Plays when |
|---|---|
| `sfx-clear.mp3`   | an arrow slides off the board (most frequent — keep it short/soft) |
| `sfx-blocked.mp3` | a blocked arrow is tapped |
| `sfx-win.mp3`     | level complete (layers under the sting) |
| `sfx-star.mp3`    | stars awarded |
| `sfx-hint.mp3`    | Hint |
| `sfx-undo.mp3`    | Undo |
| `sfx-reset.mp3`   | Reset |
| `sfx-open.mp3`    | Fish Caught opens |
| `sfx-close.mp3`   | Fish Caught closes |
| `sfx-tap.mp3`     | general button tap |

Pitch is randomised ±6% per play so repeats don't grate.

### Behaviour
- Audio unlocks on the **Start fishing** tap (iOS blocks autoplay before a gesture).
- The gameplay bed follows the environment: reef → freshwater, shipwreck → deep.
- The sting ducks the music, then fades it back.
- Sound button sits under the fullscreen toggle and cycles:
  **Sound on → Music only → Sound off**, saved between sessions.
- Music stops when the tab is hidden and resumes on return.

## Settings panel (v1.37.0)
Gear icon, top-right under the sound button:
- **Music level** / **Sound level** \u2014 sliders, saved to storage. Raising a level from 0 re-enables
  that channel automatically. Releasing the sound slider plays a sample at the new level.
- **Fullscreen lock** \u2014 when on, the app enters fullscreen on launch and re-applies it at the start
  of every level. On iPhone/iPad Safari the Fullscreen API is unavailable, so it uses the immersive
  layout instead; install to the Home Screen for true fullscreen.

Audio unlocks on the player's first touch anywhere (iOS requirement). The menu bed owns the splash
screen and hands over to the gameplay bed on "Start fishing".

## Ducking (v1.37.0)
The reveal sting takes the music fully out: fade to silence in 200ms, hold for the sting's real
duration, then ease back over 1.1s. Short SFX (arrow clear, taps) deliberately do NOT duck \u2014 at
one clear per second the music would pump. If you want a big one-off effect to dip the music,
call `AUDIO.duckFor(ms)` alongside it.

## Difficulty (v1.37.0)
| Setting | Feel | Board scale | Max arrow length |
|---|---|---|---|
| **Shallows** | fewer, longer arrows | 0.80x | 8 |
| **Open Water** *(default)* | the standard trip | 1.00x | 7 |
| **Deep Current** | dense tangles | 1.22x | 6 |

Stored as `aa_diff`. Asked on every **Start fishing**, and changeable in Settings (which re-deals the
current level). Every difficulty still generates only solvable, deadlock-free boards.
