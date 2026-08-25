import * as path from 'path';
import * as dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Missing Supabase credentials for keepalive ping.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: false },
});

async function ping() {
  console.log('Sending daily keepalive ping to Supabase...');
  const { data, error } = await supabase.from('settings').select('store_name').limit(1);
  if (error) {
    console.error('Keepalive ping failed:', error.message);
    process.exit(1);
  }
  console.log('✅ Keepalive ping successful. Supabase project is active.');
}

ping();
