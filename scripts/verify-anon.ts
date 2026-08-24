import * as path from 'path';
import * as dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Error: Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in environment variables.');
  process.exit(1);
}

// STRICTLY instantiate client with ONLY the ANON KEY (unauthenticated)
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
  const { data: products, error: prodError } = await anonClient
    .from('products')
    .select('id, name, slug, price, is_published, daraz_id')
    .eq('is_published', true)
    .limit(5);

  if (prodError) {
    console.error('❌ FAILED reading products:', prodError.message);
    allPassed = false;
  } else {
    console.log(`✅ SUCCESS: Retrieved ${products?.length} published products.`);
    if (products && products.length > 0) {
      console.log(`   Sample product: "${products[0].name}" (Slug: ${products[0].slug})`);
    } else {
      console.warn('⚠️  Warning: Query succeeded without error, but 0 published products were returned. Ensure products have is_published = true.');
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
    console.log(`✅ SUCCESS: Retrieved ${images?.length} image records (sample key: "${images?.[0]?.r2_key}").`);
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

  // 5. Test RLS Security: Verify anon CANNOT read orders
  console.log('\n5️⃣  Verifying security boundary (anon MUST NOT read `orders`)...');
  const { data: orders, error: ordersError } = await anonClient
    .from('orders')
    .select('*');

  if (orders && orders.length > 0) {
    console.error('🚨 SECURITY VULNERABILITY: Anon client was able to read orders!');
    allPassed = false;
  } else {
    console.log('✅ SECURE: Anonymous client cannot read orders (RLS working properly).');
  }

  console.log('\n====================================================');
  if (allPassed) {
    console.log('🎉 ALL PERMISSION & RLS CHECKS PASSED SUCCESSFULLY!');
  } else {
    console.log('❌ SOME CHECKS FAILED. Please review the errors above.');
  }
  console.log('====================================================\n');
}

verifyAnonAccess().catch((err) => {
  console.error('Fatal verification error:', err);
  process.exit(1);
});
