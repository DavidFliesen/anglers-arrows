/*
 * ARTEZIQ Feedback — Angler's Arrows PUBLIC configuration.
 * ONLY public values belong here (publishable key + the app's Public ingest key).
 * NEVER paste a service-role key, Management API PAT, GitHub token, or password.
 * If a value is blank or REPLACE_*, the app simply does not show the Ladybug launcher.
 *
 * TO FINISH WIRING THIS APP, fill in the two REPLACE_ values below:
 *   publishableKey — the same value already in Angler's Navigator's ladybug-config.js
 *                    (it is shared across every ARTEZIQ app)
 *   appKey         — the Public ingest key for Angler's Arrows specifically. Register
 *                    the app in the ARTEZIQ Feedback project to get it; Navigator's
 *                    key will NOT work here.
 * Confirm `slug` below matches the slug the app is registered under.
 */
export const LADYBUG_CONFIG = {
  supabaseUrl: 'https://mehsjriwijsyquhmrzkh.supabase.co',
  publishableKey: 'REPLACE_WITH_SUPABASE_PUBLISHABLE_KEY',
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
