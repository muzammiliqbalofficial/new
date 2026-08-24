import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { S3Client, PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import sharp from 'sharp';

// Load environment variables from .env.local or .env
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Error: Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env');
  console.error('Please configure your .env file with Supabase credentials.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { persistSession: false },
});

// Configure Cloudflare R2 S3 Client
const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME;

let r2Client: S3Client | null = null;
if (R2_ACCOUNT_ID && R2_ACCESS_KEY_ID && R2_SECRET_ACCESS_KEY && R2_BUCKET_NAME) {
  r2Client = new S3Client({
    region: 'auto',
    endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: R2_ACCESS_KEY_ID,
      secretAccessKey: R2_SECRET_ACCESS_KEY,
    },
  });
}

interface CatalogImage {
  url: string;
  local: string;
}

interface CatalogProduct {
  id: string;
  slug: string;
  name: string;
  name_original?: string;
  category: string;
  daraz_category_id?: string;
  currency?: string;
  brand?: string;
  warranty?: string;
  attributes?: Record<string, string>;
  images: CatalogImage[];
  white_background_image?: CatalogImage | null;
  description_html?: string;
  description_text?: string;
  description_images?: string[];
  variants?: any[];
  price?: string | number;
  sale_price?: string | number;
  stock?: string | number;
  published?: boolean;
}

/**
 * Converts local image file to WebP (max long edge 1600px) and uploads to Cloudflare R2.
 * Idempotent: Skips files that already exist in R2 bucket.
 */
async function uploadToR2IfMissing(localPath: string, r2Key: string): Promise<'uploaded' | 'skipped' | 'failed'> {
  if (!r2Client || !R2_BUCKET_NAME) {
    return 'skipped';
  }

  if (!fs.existsSync(localPath)) {
    console.warn(`⚠️ Local image not found: ${localPath}`);
    return 'failed';
  }

  try {
    // 1. Check if object already exists in R2
    try {
      await r2Client.send(
        new HeadObjectCommand({
          Bucket: R2_BUCKET_NAME,
          Key: r2Key,
        })
      );
      return 'skipped'; // already exists in R2
    } catch (headErr: any) {
      // 404/NotFound indicates object does not exist yet -> proceed to upload
    }

    // 2. Convert to WebP and cap long edge at 1600px using sharp
    const imageBuffer = fs.readFileSync(localPath);
    const optimizedBuffer = await sharp(imageBuffer)
      .resize(1600, 1600, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 85 })
      .toBuffer();

    // 3. Upload to R2 with immutable cache header
    await r2Client.send(
      new PutObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: r2Key,
        Body: optimizedBuffer,
        ContentType: 'image/webp',
        CacheControl: 'public, max-age=31536000, immutable',
      })
    );

    return 'uploaded';
  } catch (err: any) {
    console.error(`❌ Failed to upload ${r2Key} to R2:`, err.message || err);
    return 'failed';
  }
}

async function main() {
  console.log('====================================================');
  console.log('🚀 Starting Baby & Kids Store Database Migration & Seed');
  console.log('====================================================\n');

  // 1. Locate catalog.json
  const catalogPath = path.resolve(process.cwd(), 'catalog.json');
  if (!fs.existsSync(catalogPath)) {
    console.error(`❌ Cannot find catalog.json at ${catalogPath}`);
    process.exit(1);
  }

  console.log(`📖 Reading catalog from: ${catalogPath}`);
  const rawCatalog: CatalogProduct[] = JSON.parse(fs.readFileSync(catalogPath, 'utf-8'));
  console.log(`📦 Loaded ${rawCatalog.length} products from catalog.json.\n`);

  // 2. Seed / Upsert Categories
  console.log('🏷️  Extracting and seeding categories...');
  const categoryNames = Array.from(new Set(rawCatalog.map((p) => p.category.trim()))).sort();
  console.log(`Found ${categoryNames.length} distinct categories.`);

  const categoryPayload = categoryNames.map((name, index) => {
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    return {
      name,
      slug,
      sort_order: (index + 1) * 10,
      is_visible: true,
    };
  });

  const { data: seededCategories, error: catError } = await supabase
    .from('categories')
    .upsert(categoryPayload, { onConflict: 'slug' })
    .select('id, name, slug');

  if (catError) {
    console.error('❌ Error seeding categories:', catError);
    process.exit(1);
  }

  const categoryMap = new Map<string, string>();
  for (const cat of seededCategories || []) {
    categoryMap.set(cat.name, cat.id);
  }
  console.log(`✅ ${seededCategories?.length || 0} categories seeded successfully.\n`);

  // 3. Seed Products
  console.log('🛍️  Seeding products...');
  let productsInserted = 0;
  let productsPublishedCount = 0;
  let productsFailed = 0;
  const productDbMap = new Map<string, string>(); // slug -> product_id

  const BATCH_SIZE = 50;
  for (let i = 0; i < rawCatalog.length; i += BATCH_SIZE) {
    const chunk = rawCatalog.slice(i, i + BATCH_SIZE);
    const productPayload = chunk.map((p, idx) => {
      const categoryId = categoryMap.get(p.category.trim()) || null;
      const priceNum = p.price !== '' && p.price !== undefined && !isNaN(Number(p.price)) ? Number(p.price) : null;
      const salePriceNum = p.sale_price !== '' && p.sale_price !== undefined && !isNaN(Number(p.sale_price)) ? Number(p.sale_price) : null;
      const stockNum = p.stock !== '' && p.stock !== undefined && !isNaN(parseInt(String(p.stock), 10)) ? parseInt(String(p.stock), 10) : 0;

      // is_published: true ONLY if price is set and > 0, otherwise false
      const isPublished = priceNum !== null && priceNum > 0;
      if (isPublished) {
        productsPublishedCount++;
      }

      return {
        daraz_id: p.id,
        slug: p.slug,
        name: p.name,
        name_original: p.name_original || p.name,
        category_id: categoryId,
        brand: p.brand || 'No Brand',
        warranty: p.warranty || 'No Warranty',
        currency: p.currency || 'PKR',
        price: priceNum,
        sale_price: salePriceNum,
        stock: stockNum,
        is_published: isPublished,
        attributes: p.attributes || {},
        description_html: p.description_html || '',
        description_text: p.description_text || '',
        sort_order: i + idx + 1,
      };
    });

    const { data: insertedChunk, error: prodError } = await supabase
      .from('products')
      .upsert(productPayload, { onConflict: 'slug' })
      .select('id, slug');

    if (prodError) {
      console.error(`❌ Error inserting product batch ${i}-${i + chunk.length}:`, prodError);
      productsFailed += chunk.length;
    } else {
      productsInserted += (insertedChunk || []).length;
      for (const item of insertedChunk || []) {
        productDbMap.set(item.slug, item.id);
      }
    }
  }

  console.log(`✅ ${productsInserted} products upserted (${productsPublishedCount} published, ${productsInserted - productsPublishedCount} unpublished/unpriced, ${productsFailed} failed).\n`);

  // 4. Seed Product Images & Process R2
  console.log('🖼️  Seeding product images & processing Cloudflare R2 uploads...');
  let imagesUploaded = 0;
  let imagesSkipped = 0;
  let imagesFailed = 0;
  let imagesInserted = 0;

  const localImagesDir = path.resolve(process.cwd(), 'images');

  const imagePayload: any[] = [];
  for (const p of rawCatalog) {
    const productId = productDbMap.get(p.slug);
    if (!productId) continue;

    // Gallery images
    if (Array.isArray(p.images)) {
      p.images.forEach((img, idx) => {
        if (img.local) {
          imagePayload.push({
            product_id: productId,
            r2_key: img.local,
            sort_order: idx + 1,
            is_primary: idx === 0,
            is_description_image: false,
          });
        }
      });
    }

    // Description images
    if (Array.isArray(p.description_images)) {
      p.description_images.forEach((filename, idx) => {
        if (filename) {
          imagePayload.push({
            product_id: productId,
            r2_key: filename,
            sort_order: 100 + idx + 1,
            is_primary: false,
            is_description_image: true,
          });
        }
      });
    }
  }

  // Upload to R2 if client is configured and local images folder exists
  if (r2Client && fs.existsSync(localImagesDir)) {
    console.log(`Uploading & optimizing ${imagePayload.length} images to Cloudflare R2 bucket: "${R2_BUCKET_NAME}"...`);
    let count = 0;
    for (const img of imagePayload) {
      count++;
      const localFilePath = path.join(localImagesDir, img.r2_key);
      const res = await uploadToR2IfMissing(localFilePath, img.r2_key);
      if (res === 'uploaded') imagesUploaded++;
      else if (res === 'skipped') imagesSkipped++;
      else imagesFailed++;

      if (count % 100 === 0 || count === imagePayload.length) {
        console.log(`R2 Upload Progress: ${count}/${imagePayload.length} (Uploaded: ${imagesUploaded}, Skipped: ${imagesSkipped}, Failed: ${imagesFailed})`);
      }
    }
  } else if (!r2Client) {
    console.log('ℹ️  Cloudflare R2 credentials not provided; skipping R2 binary upload. Image records will still be registered in database.');
  }

  // Batch insert image metadata into Supabase
  for (let i = 0; i < imagePayload.length; i += 100) {
    const chunk = imagePayload.slice(i, i + 100);
    const { error: imgError } = await supabase.from('product_images').insert(chunk);
    if (!imgError) {
      imagesInserted += chunk.length;
    }
  }

  console.log(`✅ ${imagePayload.length} product image records processed in database.\n`);

  // 5. Seed Default Settings
  console.log('⚙️  Seeding default store settings...');
  const { error: settingsError } = await supabase.from('settings').upsert(
    [
      {
        store_name: process.env.NEXT_PUBLIC_STORE_NAME || 'Tiny Kiddies',
        store_domain: process.env.NEXT_PUBLIC_STORE_DOMAIN || 'tinykiddies.pk',
        whatsapp_number: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '923001234567',
        contact_email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'info@tinykiddies.pk',
        shipping_flat_rate: Number(process.env.NEXT_PUBLIC_SHIPPING_FLAT_RATE) || 200,
        announcement_bar_text: 'Cash on Delivery Available Nationwide | Easy Returns',
      },
    ],
    { onConflict: 'store_name' }
  );

  if (settingsError) {
    console.warn('Note on settings seed:', settingsError.message);
  } else {
    console.log('✅ Settings initialized.\n');
  }

  // Summary Report
  console.log('====================================================');
  console.log('🎉 SEED & MIGRATION SUMMARY REPORT');
  console.log('====================================================');
  console.log(`📁 Source catalog:        ${rawCatalog.length} products`);
  console.log(`🏷️  Categories created:    ${categoryNames.length}`);
  console.log(`📦 Products inserted:     ${productsInserted}`);
  console.log(`🟢 Published products:    ${productsPublishedCount} (only priced products)`);
  console.log(`⚪ Draft/Unpriced:        ${productsInserted - productsPublishedCount}`);
  console.log(`🖼️  Product images DB:     ${imagePayload.length}`);
  if (r2Client) {
    console.log(`☁️  R2 Images uploaded:   ${imagesUploaded}`);
    console.log(`☁️  R2 Images skipped:    ${imagesSkipped}`);
    console.log(`☁️  R2 Images failed:     ${imagesFailed}`);
  } else {
    console.log(`☁️  R2 upload:            Skipped (R2 credentials not set in .env)`);
  }
  console.log('====================================================\n');
}

main().catch((err) => {
  console.error('Fatal seed error:', err);
  process.exit(1);
});
