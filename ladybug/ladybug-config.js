/*
 * ARTEZIQ Feedback — Angler's Arrows PUBLIC configuration.
 * ONLY public values belong here (publishable key + the app's Public ingest key).
 * NEVER paste a service-role key, Management API PAT, GitHub token, or password.
 *
 * ────────────────────────────────────────────────────────────────────────────
 *  ONE VALUE LEFT TO FILL IN:  appKey   (line 25)
 * ────────────────────────────────────────────────────────────────────────────
 *  publishableKey below is already set — it is the same key every ARTEZIQ app
 *  uses, copied from Angler's Navigator.
 *
 *  appKey is per-app. Angler's Arrows is ALREADY REGISTERED in the ARTEZIQ
 *  Feedback dashboard, so nothing needs creating — go to:
 *
 *      ARTEZIQ Feedback → Apps → the "Angler's Arrows" row → Edit
 *
 *  and copy its Public ingest key (a UUID) onto line 25. Angler's Navigator's
 *  key (78de6de9-…) will NOT work here — reports would file under Navigator.
 *
 *  slug and the loader's sessionIdPrefix ("AA") already match what the
 *  dashboard shows for this app, so leave both alone.
 *
 *  Until appKey is a real value, ladybugConfigured() returns false and NO
 *  ladybug launcher is shown. That is by design, not a fault: the game runs
 *  normally without it. Load the app with  ?ladybug=debug  to see a chip
 *  confirming exactly which value is still missing.
 * ────────────────────────────────────────────────────────────────────────────
 */
export const LADYBUG_CONFIG = {
  supabaseUrl: 'https://mehsjriwijsyquhmrzkh.supabase.co',
  publishableKey: 'sb_publishable_GJzFbU63AAgok24gxPrnSA_FL0H3kfu',
  appKey: 'REPLACE_WITH_APP_PUBLIC_INGEST_KEY',
  slug: 'anglers-arrows',
  iconUrl: 'ladybug/assets/ladybug-feedback-icon-256.png',
  bottomOffsetPx: 16,        // package defaults; Arrows keeps the launcher clear by
  bottomOffsetPhonePx: 12,   // padding .wrap under .has-ladybug instead
};
export function ladybugConfigured(cfg = LADYBUG_CONFIG) {
  const real = (v, min) => typeof v === 'string' && v.length >= min && !/^REPLACE/i.test(v) && !/\s/.test(v);
  return real(cfg.publishableKey, 20) && real(cfg.appKey, 8) && real(cfg.slug, 3);
}
/* Names whichever values are still placeholders, so "no ladybug" is never a mystery. */
export function ladybugMissing(cfg = LADYBUG_CONFIG) {
  const real = (v, min) => typeof v === 'string' && v.length >= min && !/^REPLACE/i.test(v) && !/\s/.test(v);
  const out = [];
  if (!real(cfg.publishableKey, 20)) out.push('publishableKey');
  if (!real(cfg.appKey, 8)) out.push('appKey');
  if (!real(cfg.slug, 3)) out.push('slug');
  return out;
}
