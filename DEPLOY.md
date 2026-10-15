# Angler's Arrows v1.47.0 — deployment / file placement

Unzip at the **root of your GitHub Pages repo** so paths land exactly as below.
The app resolves every asset relative to `index.html`, so the folder names matter.

## Final repo structure

```
<repo root>/
├── index.html                  ← REPLACE (v1.47.0)
├── ladybug/                    ← NEW in v1.47.0 — upload the WHOLE folder (see below)
├── service-worker.js           ← REPLACE (cache: anglers-arrows-1.47.0)
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
    ├── puzzles/                (no longer used as of v1.34.0 — safe to delete)
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
| `assets/puzzles/NN_slug_puzzle.jpg` | **unused since v1.34.0** — different painting from the cutout, never aligned |
| `assets/thumbs/NN_slug_thumb.png` | Fish Caught list rows + drifting background fish |
| `assets/themes/*.png`             | environments cycled at the start of each level |

`NN_slug` must match the `id` in the FISH array in `index.html`
(01_largemouth_bass … 15_bowfin). To swap artwork later, drop in a file with the
same name — no code changes needed.

## Verify after deploying
1. Hard-reload once or twice (service worker is network-first for the page).
2. Bottom bar should read **ARTEZIQ • Angler's Arrows • v1.47.0**.
3. Fish Caught should list 15 species.

## Audio (added v1.47.0)

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

## Settings panel (v1.47.0)
Gear icon, top-right under the sound button:
- **Music level** / **Sound level** \u2014 sliders, saved to storage. Raising a level from 0 re-enables
  that channel automatically. Releasing the sound slider plays a sample at the new level.
- **Fullscreen lock** \u2014 when on, the app enters fullscreen on launch and re-applies it at the start
  of every level. On iPhone/iPad Safari the Fullscreen API is unavailable, so it uses the immersive
  layout instead; install to the Home Screen for true fullscreen.

Audio unlocks on the player's first touch anywhere (iOS requirement). The menu bed owns the splash
screen and hands over to the gameplay bed on "Start fishing".

## Ducking (v1.47.0)
Two independent mechanisms, in opposite directions:

**Music under the sting.** The reveal sting takes the music fully out: fade to silence in 200ms,
hold for the sting's real duration, then ease back over 1.1s. Call `AUDIO.duckFor(ms)` to do the
same for any other big one-off effect. The final arrow uses this.

**Effects under the music.** Every SFX is played at `sfxLevel(name)` rather than the raw `sfxVol`:

```js
const SFX_UNDER_MUSIC = 1/3;
function musicAudible(){ return !!(musicOn && cur && !cur.paused && cur.volume > 0.01); }
function sfxLevel(name){
  if(name === "clearFinal") return sfxVol;          // the finale ducks the music instead
  return musicAudible() ? sfxVol * SFX_UNDER_MUSIC : sfxVol;
}
```

So with the Sound slider at 60%, the arrow swoosh plays at 20% while the bed is running and at
60% when it is not. The level is recomputed per play, so toggling music takes effect on the next
tap with no state to keep in sync. Change `SFX_UNDER_MUSIC` to adjust the ratio.

Note the `cur.volume > 0.01` test: while the music is ducked out under the sting there is nothing
to sit beneath, so effects correctly return to full level.

## Difficulty (v1.47.0)
| Setting | Feel | Board scale | Max arrow length |
|---|---|---|---|
| **Shallows** | fewer, longer arrows | 0.80x | 8 |
| **Open Water** *(default)* | the standard trip | 1.00x | 7 |
| **Deep Current** | dense tangles | 1.22x | 6 |

Stored as `aa_diff`. Asked on every **Start fishing**, and changeable in Settings (which re-deals the
current level). Every difficulty still generates only solvable, deadlock-free boards.

## Arrow colour (v1.47.0)
Arrows are coloured at generation time by `colourPieces()`. It builds a conflict graph — two arrows
conflict if their cells touch (8-way) **or** if one sits in the other's exit lane — then greedily
colours most-constrained-first from `ARROW_PALETTE`. Measured on real boards: 0 same-colour touches
at every difficulty, 5 of 6 palette colours used. To restyle, edit `ARROW_PALETTE`; order matters
only for which colour is most common.

## Sound effects (v1.47.0)
Eighteen effects ship in `assets/audio/`. The swooshes are your recordings; the rest are
synthesised with soft 25–50ms eased attacks and rolled-off highs — a sub-10ms attack on broadband
content is what made the first generation sound like gunshots, so nothing is cut faster than 25ms.

| File | Fires on | Character |
|---|---|---|
| `sfx-clear.mp3` | every arrow | your 2.5s swoosh |
| `sfx-clear-final.mp3` | the last arrow of a level | your fuller 2.5s swoosh |
| `sfx-start.mp3` | **Start fishing** | C4→G4 rising fifth + water breath, 1250ms |
| `sfx-diff-shallows.mp3` | Shallows selected | D5, bright, 400ms |
| `sfx-diff-open.mp3` | Open Water selected | A4, 460ms |
| `sfx-diff-deep.mp3` | Deep Current selected | D4, dark, 580ms |
| `sfx-blocked.mp3` | wrong arrow | 300→190Hz blub + 112Hz thud, 210ms |
| `sfx-guide-open.mp3` | Fish Caught opens | A4+E5 rising, upward swell, 550ms |
| `sfx-guide-close.mp3` | Fish Caught × | A4→D4 falling, downward swell, 460ms |
| `sfx-open/close.mp3` | Settings panel | unchanged |
| the rest | `tap`, `undo`, `reset`, `hint`, `star`, `win` | unchanged |

The three waters are wired through `DIFFS[].sfx`, so adding a difficulty means adding its sound key
there and nowhere else. Replace any file in place to change a sound — no code change needed — but
**bump the service-worker cache name**, or players keep the cached copy of the old file.

The two swooshes overlap heavily while clearing quickly, so `clear` gets a 6-voice pool and
`clearFinal` 4, and neither is ever pitch-shifted. Short effects keep 3 voices and a ±4% pitch
wobble so repeats are not identical. Levels are set by `sfxLevel()` — see **Ducking** above.

## Reveal timing (v1.47.0)
The fish stays hidden for the whole level. `revealAll()` fires the moment the final arrow leaves,
rippling tiles out from the centre over ~620ms, with the species card following 1.5s later so the
final swoosh and the reveal both have room.

## ARTEZIQ Ladybug feedback (v1.47.0)

Wired exactly as in Angler's Navigator v066, from the shared package **ARTEZIQ-Ladybug-shared-v0.2**.
`ladybug-feedback.js`, `ladybug-auth.js` and `vendor/html2canvas.min.js` are **byte-identical** to the
shared package — do not edit them, or the apps drift apart. Everything app-specific is an option.

### Before it will appear — fill in ONE key

`publishableKey` is already set in `ladybug/ladybug-config.js` — it is the same value every ARTEZIQ
app uses. One value is left:

| Value | Where it comes from |
|---|---|
| `appKey` | the Public ingest key for **Angler's Arrows**, from the ARTEZIQ Feedback project. Register the app there to get it. Navigator's key (`78de6de9-…`) must NOT be used — reports would file under Navigator. |

`slug` is preset to `anglers-arrows` — confirm that matches how the app is registered.

Until `appKey` is real, `<html data-ladybug="unconfigured">`, `data-ladybug-missing` lists what is
still a placeholder, and **no launcher is shown** — by design; the game is unaffected. Add
`?ladybug=debug` to the URL to see an amber chip naming the missing value, or a red chip naming any
file that failed to load. **If there is no ladybug to click on, check that chip first** — a
placeholder key and a missing file look identical from the outside otherwise.

### Upload the whole folder

```
ladybug/
├── ladybug-config.js            ← your keys go here
├── ladybug-config.TEMPLATE.js
├── ladybug-feedback.js
├── ladybug-auth.js
├── assets/ladybug-feedback-icon-256.png
├── assets/ladybug-feedback-icon.png
└── vendor/html2canvas.min.js  +  html2canvas.LICENSE.txt
```

A **partial upload is the number one cause of "no ladybug"**. The second cause is **stale cache**:
assets are served cache-first, so an installed device keeps whatever it cached until the
service-worker cache name changes. As of v1.47.0 `ladybug-config.js` is exempt — it is fetched
network-first with a cached fallback, so changing a key takes effect without a version bump. Every
OTHER file in `ladybug/` still obeys the rule: **bump the cache name whenever one of them changes.**

### Two Arrows-specific fits

**The launcher vs. the Fish Caught button.** The launcher is fixed bottom-right at the package's
standard offsets (16px desktop / 12px phone) and would otherwise land on the rightmost control. So
`.has-ladybug .wrap` and `.has-ladybug .guide-scroll` add bottom padding, which lifts the controls
row clear of it. Measured on a 390px-wide viewport: 24px of clearance. If a future change makes the
bottom row taller, raise that padding rather than moving the launcher — apps may only raise
`bottomOffsetPx`, never relocate the launcher out of the corner.

**Fullscreen and the typing warning.** The report panel has real text inputs. iPadOS Safari raises
"you are typing while in full screen" when an input takes focus inside the Fullscreen API, which this
app uses on iPad. So `anFeedbackWatchPanel()` watches the connector's own overlay with a
MutationObserver and drops out of fullscreen while the panel is open. Note it watches the overlay
rather than wrapping `ladybug.open` — the launcher binds the module's *internal* `open` directly, so
a wrapper on the returned object would never fire. Re-entering fullscreen needs a user gesture, so
the restore is armed and fires on the tester's next tap on the game. (iPhone Safari has no
Fullscreen API at all; there "immersive" is only a CSS class, so nothing happens.)

### Tester Mode diagnostics

`anTrack(name, details)` queues events (max 50) until the connector loads, then drains into
`ladybug.track`. It is a no-op unless the tester opts in. Events emitted:

| Event | Data |
|---|---|
| `level_started` | level, difficulty, arrows, rows, cols |
| `level_completed` | level, difficulty, stars, moves, blocked, undos, arrows |
| `try_again_shown` | level, difficulty, blocked, remaining |
| `difficulty_chosen` | difficulty |
| `modal_opened` | name (`fish_caught`, `settings`, `about`) |
| `progress_reset` | caughtBefore |
| `fish_raster_fallback` | level — the artwork failed to rasterise, so the board took the wrong shape |

`window.anFeedbackContext()` returns `{appVersion, buildNumber, screen}`, where screen is derived
from which overlay is visible: Splash, Settings, Choose Difficulty, About, Species Detail, Try Again,
Fish Caught, Level Complete, or Playing. **Never** pass free text, and nothing here does — only
counts, booleans and short enum labels.

