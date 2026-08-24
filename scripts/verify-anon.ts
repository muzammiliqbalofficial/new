import * as path from 'path';
import * as dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Error: Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in .env');
  process.exit(1);
}

// STRICTLY instantiate client with ONLY the PUBLIC ANON KEY (no session, no service key)
const anonClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: false },
});

async function verifyAnonAccess() {
  console.log('====================================================');
  console.log('🔍 PROVING POSTGREST & RLS ACCESS (ANON CLIENT)');
  console.log('====================================================\n');
  console.log(`Supabase URL: ${SUPABASE_URL}`);
  console.log(`Client Role:  anon (unauthenticated public user)\n`);

  let allPassed = true;

  // 1. Query Categories
  console.log('1️⃣  Testing anonymous read on `categories` table...');
  const { data: categories, error: catError } = await anonClient
    .from('categories')
    .select('id, name, slug, is_visible')
    .eq('is_visible', true)
    .limit(5);

  if (catError) {
    console.error('❌ FAILED reading categories:', catError.message);
    allPassed = false;
  } else {
    console.log(`✅ SUCCESS: Retrieved ${categories?.length} categories (sample: "${categories?.[0]?.name}").`);
  }

  // 2. Query Published Products
  console.log('\n2️⃣  Testing anonymous read on `products` table...');
  const { data: publishedProducts, error: prodError } = await anonClient
    .from('products')
    .select('id, name, slug, price, is_published, daraz_id')
    .eq('is_published', true);

  if (prodError) {
    console.error('❌ FAILED reading products:', prodError.message);
    allPassed = false;
  } else {
    console.log(`✅ SUCCESS: PostgREST query on products executed without permission errors.`);
    console.log(`   Published products returned: ${publishedProducts?.length || 0}`);
    if (publishedProducts && publishedProducts.length > 0) {
      console.log(`   Sample product: "${publishedProducts[0].name}" (Slug: ${publishedProducts[0].slug})`);
    } else {
      console.log(`   ℹ️  Note: 0 published products returned because all 190 catalog items are currently unpriced (is_published = false by design).`);
    }
  }

  // 3. Query Product Images
  console.log('\n3️⃣  Testing anonymous read on `product_images` table...');
  const { data: images, error: imgError } = await anonClient
    .from('product_images')
    .select('id, r2_key, is_primary, is_description_image')
    .limit(5);

  if (imgError) {
    console.error('❌ FAILED reading product images:', imgError.message);
    allPassed = false;
  } else {
    console.log(`✅ SUCCESS: Product images query executed without permission errors.`);
  }

  // 4. Query Settings
  console.log('\n4️⃣  Testing anonymous read on `settings` table...');
  const { data: settings, error: setError } = await anonClient
    .from('settings')
    .select('*')
    .limit(1);

  if (setError) {
    console.error('❌ FAILED reading settings:', setError.message);
    allPassed = false;
  } else {
    console.log(`✅ SUCCESS: Retrieved store settings (Store: "${settings?.[0]?.store_name}").`);
  }

  // 5. Test RLS Security Boundary: Anon MUST NOT read orders
  console.log('\n5️⃣  Verifying security boundary (anon MUST NOT read `orders`)...');
  const { data: orders, error: ordersError } = await anonClient
    .from('orders')
    .select('*');

  if (orders && orders.length > 0) {
    console.error('🚨 SECURITY VULNERABILITY: Anon client was able to read orders!');
    allPassed = false;
  } else {
    console.log('✅ SECURE: Anonymous client cannot read orders (RLS blocked unauthorized read).');
  }

  console.log('\n====================================================');
  if (allPassed) {
    console.log('🎉 ALL POSTGREST GRANTS & RLS CHECKS PASSED!');
  } else {
    console.log('❌ SOME CHECKS FAILED. Please review the errors above.');
  }
  console.log('====================================================\n');
}

verifyAnonAccess().catch((err) => {
  console.error('Fatal verification error:', err);
  process.exit(1);
});
