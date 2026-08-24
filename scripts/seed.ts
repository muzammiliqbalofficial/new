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

const isSkipImagesFlag = process.argv.includes('--skip-images');

let r2Client: S3Client | null = null;
const hasR2Creds = Boolean(R2_ACCOUNT_ID && R2_ACCESS_KEY_ID && R2_SECRET_ACCESS_KEY && R2_BUCKET_NAME);

if (hasR2Creds) {
  r2Client = new S3Client({
    region: 'auto',
    endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: R2_ACCESS_KEY_ID!,
      secretAccessKey: R2_SECRET_ACCESS_KEY!,
    },
  });
} else if (!isSkipImagesFlag) {
  console.error('❌ Error: Cloudflare R2 credentials (R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME) are missing in .env.');
  console.error('The seed script requires R2 credentials to generate responsive WebP variants (300w, 700w, 1400w) and upload them.');
  console.error('If you intentionally want to test DB seeding without R2 uploads, run with the --skip-images flag:');
  console.error('  npm run seed -- --skip-images\n');
  process.exit(1);
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

// Responsive variant specifications
const VARIANTS = [
  { suffix: '300w', width: 300, quality: 80 },
  { suffix: '700w', width: 700, quality: 82 },
  { suffix: '1400w', width: 1400, quality: 85 },
];

/**
 * Checks if a specific object key exists in R2 bucket
 */
async function r2ObjectExists(key: string): Promise<boolean> {
  if (!r2Client || !R2_BUCKET_NAME) return false;
  try {
    await r2Client.send(
      new HeadObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: key,
      })
    );
    return true;
  } catch (err: any) {
    return false;
  }
}

/**
 * Processes a local image file into 3 responsive WebP variants (300w, 700w, 1400w)
 * and uploads missing variants to Cloudflare R2.
 */
async function processAndUploadImageVariants(
  localPath: string,
  baseStem: string
): Promise<{ uploaded: number; skipped: number; failed: number }> {
  if (!r2Client || !R2_BUCKET_NAME || !fs.existsSync(localPath)) {
    return { uploaded: 0, skipped: 0, failed: fs.existsSync(localPath) ? 0 : 3 };
  }

  let uploaded = 0;
  let skipped = 0;
  let failed = 0;

  try {
    const rawBuffer = fs.readFileSync(localPath);

    for (const v of VARIANTS) {
      const variantKey = `${baseStem}-${v.suffix}.webp`;

      const exists = await r2ObjectExists(variantKey);
      if (exists) {
        skipped++;
        continue;
      }

      try {
        const webpBuffer = await sharp(rawBuffer)
          .resize(v.width, v.width, { fit: 'inside', withoutEnlargement: true })
          .webp({ quality: v.quality })
          .toBuffer();

        await r2Client.send(
          new PutObjectCommand({
            Bucket: R2_BUCKET_NAME,
            Key: variantKey,
            Body: webpBuffer,
            ContentType: 'image/webp',
            CacheControl: 'public, max-age=31536000, immutable',
          })
        );
        uploaded++;
      } catch (uploadErr: any) {
        console.error(`❌ Failed variant ${variantKey}:`, uploadErr.message || uploadErr);
        failed++;
      }
    }
  } catch (readErr: any) {
    console.error(`❌ Failed reading image ${localPath}:`, readErr.message || readErr);
    failed += 3;
  }

  return { uploaded, skipped, failed };
}

/**
 * Concurrency worker pool runner (max 8 concurrent tasks)
 */
async function runConcurrent<T, R>(
  items: T[],
  limit: number,
  fn: (item: T, index: number) => Promise<R>
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let currentIndex = 0;

  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (currentIndex < items.length) {
      const index = currentIndex++;
      results[index] = await fn(items[index], index);
    }
  });

  await Promise.all(workers);
  return results;
}

async function main() {
  console.log('====================================================');
  console.log('🚀 Starting Baby & Kids Store Database Migration & Seed');
  console.log('====================================================\n');

  // 1. Locate and read catalog.json
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
    console.error('❌ Error seeding categories:', catError.message);
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
      console.error(`❌ Error inserting product batch ${i}-${i + chunk.length}:`, prodError.message);
      productsFailed += chunk.length;
    } else {
      productsInserted += (insertedChunk || []).length;
      for (const item of insertedChunk || []) {
        productDbMap.set(item.slug, item.id);
      }
    }
  }

  console.log(`✅ ${productsInserted} products upserted (${productsPublishedCount} published, ${productsInserted - productsPublishedCount} unpriced/draft, ${productsFailed} failed).\n`);

  // 4. Seed Product Images & Cloudflare R2 Uploads
  console.log('🖼️  Preparing product image records and responsive WebP variants (300w, 700w, 1400w)...');

  const localImagesDir = path.resolve(process.cwd(), 'images');

  interface ImageEntry {
    product_id: string;
    r2_key: string;
    local_source_file: string;
    base_stem: string;
    sort_order: number;
    is_primary: boolean;
    is_description_image: boolean;
    is_white_background: boolean;
  }

  // Deduplicate entries by (product_id, r2_key) to prevent Postgres ON CONFLICT batch failure
  const imageEntryMap = new Map<string, ImageEntry>(); // `${product_id}:${r2_key}` -> ImageEntry
  const uniqueLocalFiles = new Map<string, string>(); // base_stem -> local_filename

  for (const p of rawCatalog) {
    const productId = productDbMap.get(p.slug);
    if (!productId) continue;

    // Helper to register/merge an image entry
    const registerImage = (
      localFile: string,
      sortOrder: number,
      isPrimary: boolean,
      isDesc: boolean,
      isWhiteBg: boolean
    ) => {
      const stem = path.parse(localFile).name;
      const compositeKey = `${productId}:${stem}`;
      uniqueLocalFiles.set(stem, localFile);

      const existing = imageEntryMap.get(compositeKey);
      if (existing) {
        // Merge flags & take lowest sort_order
        existing.is_primary = existing.is_primary || isPrimary;
        existing.is_description_image = existing.is_description_image || isDesc;
        existing.is_white_background = existing.is_white_background || isWhiteBg;
        existing.sort_order = Math.min(existing.sort_order, sortOrder);
      } else {
        imageEntryMap.set(compositeKey, {
          product_id: productId,
          r2_key: stem,
          local_source_file: localFile,
          base_stem: stem,
          sort_order: sortOrder,
          is_primary: isPrimary,
          is_description_image: isDesc,
          is_white_background: isWhiteBg,
        });
      }
    };

    // 1. Gallery images
    if (Array.isArray(p.images)) {
      p.images.forEach((img, idx) => {
        if (img.local) {
          registerImage(img.local, idx + 1, idx === 0, false, false);
        }
      });
    }

    // 2. Description body images
    if (Array.isArray(p.description_images)) {
      p.description_images.forEach((filename, idx) => {
        if (filename) {
          registerImage(filename, 100 + idx + 1, false, true, false);
        }
      });
    }

    // 3. White background images (38 products)
    if (p.white_background_image && p.white_background_image.local) {
      registerImage(p.white_background_image.local, 0, false, false, true);
    }
  }

  const imageEntries = Array.from(imageEntryMap.values());

  // Strict Assertion: Ensure zero duplicate (product_id, r2_key) pairs exist
  const uniquenessSet = new Set<string>();
  for (const entry of imageEntries) {
    const pairKey = `${entry.product_id}:${entry.r2_key}`;
    if (uniquenessSet.has(pairKey)) {
      throw new Error(`Assertion failed: Duplicate image pair found for product ${entry.product_id} and key ${entry.r2_key}`);
    }
    uniquenessSet.add(pairKey);
  }

  console.log(`Deduplication complete: ${imageEntries.length} unique product image records prepared.`);

  // 4a. Concurrent Cloudflare R2 Upload (Concurrency: 8)
  let totalVariantsUploaded = 0;
  let totalVariantsSkipped = 0;
  let totalVariantsFailed = 0;

  if (r2Client && fs.existsSync(localImagesDir)) {
    const uniqueFileList = Array.from(uniqueLocalFiles.entries());
    console.log(`☁️  Processing ${uniqueFileList.length} distinct source images into 3 responsive variants each (8 concurrent workers)...`);

    let completedImages = 0;
    await runConcurrent(uniqueFileList, 8, async ([stem, filename]) => {
      const localFilePath = path.join(localImagesDir, filename);
      const res = await processAndUploadImageVariants(localFilePath, stem);
      totalVariantsUploaded += res.uploaded;
      totalVariantsSkipped += res.skipped;
      totalVariantsFailed += res.failed;
      completedImages++;

      if (completedImages % 100 === 0 || completedImages === uniqueFileList.length) {
        console.log(`R2 Progress: ${completedImages}/${uniqueFileList.length} images processed (Variants: ${totalVariantsUploaded} uploaded, ${totalVariantsSkipped} skipped, ${totalVariantsFailed} failed)`);
      }
    });
  } else if (isSkipImagesFlag) {
    console.log('⚠️  --skip-images flag active: Skipped R2 image upload; registering image stems in database.');
  }

  // 4b. Idempotent Database Upsert on product_images
  let imagesDbInserted = 0;
  let imagesDbFailed = 0;

  const dbPayload = imageEntries.map((entry) => ({
    product_id: entry.product_id,
    r2_key: entry.r2_key,
    sort_order: entry.sort_order,
    is_primary: entry.is_primary,
    is_description_image: entry.is_description_image,
    is_white_background: entry.is_white_background,
  }));

  for (let i = 0; i < dbPayload.length; i += 100) {
    const chunk = dbPayload.slice(i, i + 100);
    const { data: upsertedImages, error: imgError } = await supabase
      .from('product_images')
      .upsert(chunk, { onConflict: 'product_id, r2_key' })
      .select('id');

    if (imgError) {
      console.error(`❌ Error upserting image batch ${i}-${i + chunk.length}:`, imgError.message);
      imagesDbFailed += chunk.length;
    } else {
      imagesDbInserted += (upsertedImages || []).length;
    }
  }

  console.log(`✅ ${imagesDbInserted} product image rows upserted into database (${imagesDbFailed} failed).\n`);

  // 5. Seed Singleton Settings Table (id = 1)
  console.log('⚙️  Seeding singleton store settings (id = 1)...');
  const { error: settingsError } = await supabase.from('settings').upsert(
    [
      {
        id: 1,
        store_name: process.env.NEXT_PUBLIC_STORE_NAME || 'Baby Store',
        store_domain: process.env.NEXT_PUBLIC_STORE_DOMAIN || '',
        whatsapp_number: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '',
        contact_email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || '',
        shipping_flat_rate: Number(process.env.NEXT_PUBLIC_SHIPPING_FLAT_RATE) || 200,
        announcement_bar_text: 'Cash on Delivery Available Nationwide | Easy Returns',
      },
    ],
    { onConflict: 'id' }
  );

  if (settingsError) {
    console.error('❌ Error initializing settings:', settingsError.message);
  } else {
    console.log('✅ Store settings initialized (id = 1).\n');
  }

  // Summary Report
  console.log('====================================================');
  console.log('🎉 SEED & MIGRATION SUMMARY REPORT');
  console.log('====================================================');
  console.log(`📁 Source catalog:        ${rawCatalog.length} products`);
  console.log(`🏷️  Categories created:    ${categoryNames.length}`);
  console.log(`📦 Products upserted:     ${productsInserted} (${productsFailed} failed)`);
  console.log(`🟢 Published products:    ${productsPublishedCount} (only priced products)`);
  console.log(`⚪ Unpriced/Draft:        ${productsInserted - productsPublishedCount}`);
  console.log(`🖼️  Product images in DB:  ${imagesDbInserted} upserted (${imagesDbFailed} failed)`);
  if (r2Client) {
    console.log(`☁️  R2 300w/700w/1400w:   ${totalVariantsUploaded} uploaded, ${totalVariantsSkipped} skipped, ${totalVariantsFailed} failed`);
  } else {
    console.log(`☁️  R2 upload:            Skipped (--skip-images flag active)`);
  }
  console.log('====================================================\n');
}

main().catch((err) => {
  console.error('Fatal seed error:', err);
  process.exit(1);
});
