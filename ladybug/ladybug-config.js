/*
 * ARTEZIQ Feedback — Angler's Arrows PUBLIC configuration.
 * ONLY public values belong here (publishable key + the app's Public ingest key).
 * NEVER paste a service-role key, Management API PAT, GitHub token, or password.
 *
 * ────────────────────────────────────────────────────────────────────────────
 *  FULLY CONFIGURED — the ladybug launcher will appear.
 * ────────────────────────────────────────────────────────────────────────────
 *  supabaseUrl + publishableKey  shared by every ARTEZIQ app
 *  appKey                        Angler's Arrows' own Public ingest key, from
 *                                ARTEZIQ Feedback → Apps → Angler's Arrows
 *  slug / sessionIdPrefix "AA"   match the dashboard's registry row
 *
 *  All of these are PUBLIC values and are meant to ship in browser code.
 *  NEVER add a service-role key, Management API PAT, GitHub token or password.
 *
 *  Angler's Arrows is in DEVELOPMENT access mode, so only authorized ARTEZIQ
 *  accounts can sign in and send. Switch it to Explorer Testing in the
 *  dashboard when it goes out to testers — no code change needed.
 *
 *  If the launcher ever stops appearing, load the app with  ?ladybug=debug
 *  and the chip will name the missing value or the file that failed.
 */
export const LADYBUG_CONFIG = {
  supabaseUrl: 'https://mehsjriwijsyquhmrzkh.supabase.co',
  publishableKey: 'sb_publishable_GJzFbU63AAgok24gxPrnSA_FL0H3kfu',
  appKey: '147d09da-eb07-43a0-bc6e-fd4324ce4aad',
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
