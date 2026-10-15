/*
 * ARTEZIQ Feedback — per-app PUBLIC configuration. Copy to ladybug-config.js and fill in.
 * ONLY public values belong here (publishable key + the app's Public ingest key).
 * NEVER paste a service-role key, Management API PAT, GitHub token, or password.
 * If a value is blank or REPLACE_*, the app simply does not show the Ladybug launcher.
 */
export const LADYBUG_CONFIG = {
  supabaseUrl: 'https://mehsjriwijsyquhmrzkh.supabase.co',
  publishableKey: 'REPLACE_WITH_SUPABASE_PUBLISHABLE_KEY',
  appKey: 'REPLACE_WITH_APP_PUBLIC_INGEST_KEY',
  slug: 'REPLACE-with-app-slug',
  iconUrl: 'ladybug/assets/ladybug-feedback-icon-256.png',
  bottomOffsetPx: 16,        // raise ONLY if an app-specific bottom control overlaps
  bottomOffsetPhonePx: 12,
};
export function ladybugConfigured(cfg = LADYBUG_CONFIG) {
  const real = (v, min) => typeof v === 'string' && v.length >= min && !/^REPLACE/i.test(v) && !/\s/.test(v);
  return real(cfg.publishableKey, 20) && real(cfg.appKey, 8) && real(cfg.slug, 3);
}
