// VAYNOR Supabase client configuration.
// Publishable keys are intended for browser use. Never put service_role/secret keys here.
const VAYNOR_SUPABASE_URL = "https://hddphtxjtcjqqeouxqmh.supabase.co";
const VAYNOR_SUPABASE_PUBLISHABLE_KEY = "sb_publishable__vvKVbVuGpyS0SR4fAuxrQ_c8Bofd0Y";

if (!window.supabase) {
  console.error("Supabase JS library did not load.");
} else {
  window.vaynorSupabase = window.supabase.createClient(
    VAYNOR_SUPABASE_URL,
    VAYNOR_SUPABASE_PUBLISHABLE_KEY
  );
}
