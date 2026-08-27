import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Public read client for catalog. Safe to bundle client-side: RLS restricts
// this key to published/visible rows and anon-insert-only on orders.
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: false },
});

// Service-role client. NEVER import this from a Client Component or any file
// that can end up in a browser bundle — it bypasses RLS entirely. Build-time
// scripts (e.g. scripts/seed.ts) only.
export function getServiceSupabase() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set');
  return createClient(SUPABASE_URL, key, { auth: { persistSession: false } });
}
