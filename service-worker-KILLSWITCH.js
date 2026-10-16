/* Angler's Arrows — END-OF-TEST KILL SWITCH service worker
 * ---------------------------------------------------------------------------
 * THIS FILE IS INERT WHILE IT HAS THIS NAME. Nothing references it, so simply
 * having it in the repo changes nothing. It only does its job when you rename
 * it over the real one.
 *
 * WHAT IT IS FOR
 *   An installed PWA keeps working offline from its own cache. Deleting the
 *   Cloudflare project does NOT reach a tester who already installed the app —
 *   they can keep opening the cached copy indefinitely. This build empties
 *   those caches and unregisters itself, so once a tester opens the app one
 *   more time, their copy stops working offline and dies with the hosting.
 *
 * HOW TO SHIP IT (only when testing is over)
 *   1. In the repo, rename the current service-worker.js to
 *      service-worker-LIVE-BACKUP.js  (keep it — you will want it back).
 *   2. Rename THIS file to  service-worker.js  and push to main.
 *   3. Cloudflare redeploys. Tell testers to open the app once, online.
 *      Their caches are emptied, the worker unregisters, and the page reloads.
 *   4. Give them a few days, then delete the Cloudflare project (runbook §7).
 *   5. To go back to normal, restore the backup file and bump the app version.
 *
 * TEST IT ON YOUR OWN DEVICE FIRST. Install the app from the Cloudflare copy,
 * go offline and confirm it opens; ship this; open it once online; go offline
 * again and confirm it no longer opens.
 *
 * WHAT IT DELIBERATELY DOES NOT DO
 *   It does not delete anything the tester saved. Caught fish, stars and
 *   settings live in localStorage, which this never touches — clearing it
 *   would destroy a tester's progress for no reason, and the app is going away
 *   regardless. It also serves no page of its own: after this runs, the app is
 *   an ordinary website that simply stops resolving once hosting is gone.
 */

const KILL_TAG = "anglers-arrows-killswitch-1";

self.addEventListener("install", (e) => {
  // take over immediately rather than waiting for every tab to close
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil((async () => {
    // 1. empty every cache this origin holds, not just ours by name
    try {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
    } catch (err) { /* nothing we can do; keep going */ }

    // 2. stop controlling pages
    try { await self.registration.unregister(); } catch (err) {}

    // 3. reload any open tab so it leaves the cached copy behind
    try {
      const windows = await self.clients.matchAll({ type: "window" });
      for (const w of windows) {
        try { w.navigate(w.url); } catch (err) { /* older browsers */ }
      }
    } catch (err) {}
  })());
});

// Never answer from cache. Everything goes to the network; if the network is
// gone, the browser shows its own offline page, which is the intended outcome.
self.addEventListener("fetch", (e) => { /* pass through */ });
