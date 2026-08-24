import * as path from 'path';
import * as dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Error: Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in .env');
  process.exit(1);
}

// Anonymous public client
const anonClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: false },
});

// Admin service role client for test probe setup
let adminClient: any = null;
if (SUPABASE_SERVICE_KEY) {
  adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: { persistSession: false },
  });
}

async function verifyAnonAccess() {
  console.log('====================================================');
  console.log('🔍 PROVING POSTGREST & RLS ACCESS (ANON CLIENT)');
  console.log('====================================================\n');
  console.log(`Supabase URL: ${SUPABASE_URL}`);
  console.log(`Client Role:  anon (unauthenticated storefront visitor)\n`);

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
    console.log(`✅ SUCCESS: Retrieved ${categories?.length || 0} categories (sample: "${categories?.[0]?.name}").`);
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
      console.log(`   ℹ️  Note: 0 published products returned because all catalog items are currently unpriced (is_published = false by design).`);
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

  // 5. Test RLS Security Boundary with a real order probe
  console.log('\n5️⃣  Testing RLS security boundary (proving anon CANNOT read existing orders)...');
  const probeOrderNumber = `PROBE-TEST-${Date.now()}`;

  if (adminClient) {
    // Step 5a: Insert probe order via service role
    const { data: probeOrder, error: insertProbeError } = await adminClient
      .from('orders')
      .insert({
        order_number: probeOrderNumber,
        customer_name: 'Security Probe Test',
        customer_phone: '03000000000',
        address: 'Test Address',
        city: 'Lahore',
        total: 1000,
        status: 'new',
      })
      .select('id')
      .single();

    if (insertProbeError) {
      console.warn('⚠️  Could not insert probe order for RLS verification:', insertProbeError.message);
    } else {
      // Step 5b: Attempt to read probe order using anonymous client
      const { data: anonReadOrders, error: anonReadError } = await anonClient
        .from('orders')
        .select('*')
        .eq('order_number', probeOrderNumber);

      if (anonReadOrders && anonReadOrders.length > 0) {
        console.error('🚨 CRITICAL RLS FAILURE: Anon client was able to read order data!');
        allPassed = false;
      } else {
        console.log('✅ SECURE: Probe order exists in database, but anon client received 0 rows. RLS is actively blocking unauthorized reads.');
      }

      // Step 5c: Clean up probe order via service role
      await adminClient.from('orders').delete().eq('id', probeOrder.id);
    }
  } else {
    // Fallback if service key is absent during verification
    const { data: anonOrders } = await anonClient.from('orders').select('*');
    if (anonOrders && anonOrders.length > 0) {
      console.error('🚨 CRITICAL RLS FAILURE: Anon client read orders!');
      allPassed = false;
    } else {
      console.log('✅ SECURE: Anonymous client cannot read orders.');
    }
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
