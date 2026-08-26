import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import Breadcrumbs from '@/components/Breadcrumbs';
import ProductGallery from '@/components/ProductGallery';
import ProductActions from '@/components/ProductActions';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/lib/types';
import { sanitizeDescriptionHtml, resolveMainImage, formatPrice } from '@/lib/formatters';

export const revalidate = 3600;

export async function generateStaticParams() {
  const { data } = await supabase.from('products').select('slug').eq('is_published', true);
  return (data || []).map((p) => ({ slug: p.slug }));
}

interface Props {
  params: Promise<{ slug: string }>;
}

async function getProduct(slug: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select(
      `
      id,
      slug,
      name,
      name_original,
      brand,
      warranty,
      attributes,
      description_html,
      description_text,
      price,
      sale_price,
      stock,
      is_published,
      categories (
        id,
        name,
        slug
      ),
      product_images (
        id,
        r2_key,
        sort_order,
        is_primary,
        is_white_background,
        is_description_image
      )
    `
    )
    .eq('slug', slug)
    .eq('is_published', true)
    .single();

  if (error || !data) return null;
  return data as unknown as Product;
}

async function getRelatedProducts(categoryId?: string, currentProductId?: string): Promise<Product[]> {
  if (!categoryId) return [];
  const { data } = await supabase
    .from('products')
    .select(
      `
      id,
      slug,
      name,
      price,
      sale_price,
      categories (
        id,
        name,
        slug
      ),
      product_images (
        id,
        r2_key,
        sort_order,
        is_primary,
        is_white_background,
        is_description_image
      )
    `
    )
    .eq('category_id', categoryId)
    .eq('is_published', true)
    .neq('id', currentProductId || '')
    .limit(4);

  return (data || []) as unknown as Product[];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.slug);

  if (!product) {
    return {
      title: 'Product Not Found | Tiny Kids',
    };
  }

  const imageStem = resolveMainImage(product);
  const r2Base = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || '';
  const imageUrl = `${r2Base}/${imageStem}-700w.webp`;

  return {
    title: `${product.name} | Tiny Kids Pakistan`,
    description: product.description_text
      ? product.description_text.slice(0, 160)
      : `Buy ${product.name} online in Pakistan at Tiny Kids. Cash on delivery available.`,
    openGraph: {
      title: product.name,
      description: product.description_text?.slice(0, 160),
      images: [{ url: imageUrl }],
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.slug);

  if (!product) {
    notFound();
  }

  const related = await getRelatedProducts(product.categories?.id, product.id);
  const images = (product.product_images || []).sort((a, b) => a.sort_order - b.sort_order);
  const descImages = images.filter((img) => img.is_description_image);
  const imageStem = resolveMainImage(product);

  // Filter dynamic attributes (remove empty, "No Brand", internal keys)
  const validAttributes = Object.entries(product.attributes || {}).filter(([key, val]) => {
    if (!val || typeof val !== 'string') return false;
    const lower = val.trim().toLowerCase();
    if (lower === 'no brand' || lower === 'no warranty' || lower === 'n/a' || lower === 'none') return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-12">
      {/* 1. Breadcrumbs */}
      <Breadcrumbs
        items={[
          ...(product.categories
            ? [{ label: product.categories.name, href: `/category/${product.categories.slug}` }]
            : []),
          { label: product.name },
        ]}
      />

      {/* 2. Main Product Info Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left: Responsive Image Gallery */}
        <div className="lg:col-span-7">
          <ProductGallery images={images} productName={product.name} />
        </div>

        {/* Right: Product Details & CTA */}
        <div className="lg:col-span-5 space-y-6">
          {/* Category & Title */}
          <div>
            {product.categories && (
              <span className="text-xs font-bold uppercase tracking-wider text-brand">
                {product.categories.name}
              </span>
            )}
            <h1 className="text-xl sm:text-3xl font-black text-charcoal tracking-tight mt-1 leading-tight">
              {product.name}
            </h1>
          </div>

          {/* Interactive Actions (Pricing, COD Add to Cart, WhatsApp Enquiry) */}
          <ProductActions product={product} imageStem={imageStem} />

          {/* Key Specifications & Attributes Table */}
          {validAttributes.length > 0 && (
            <div className="pt-4 border-t border-charcoal-border/60">
              <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal mb-3">
                Product Details
              </h3>
              <div className="bg-white rounded-2xl border border-charcoal-border/70 overflow-hidden divide-y divide-charcoal-border/50 text-xs">
                {validAttributes.map(([key, val]) => (
                  <div key={key} className="flex justify-between py-2.5 px-4">
                    <span className="text-charcoal-muted font-medium capitalize">{key}</span>
                    <span className="text-charcoal font-semibold">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. Product Description & Body Images */}
      <div className="border-t border-charcoal-border/60 pt-10">
        <div className="max-w-3xl space-y-6">
          <h2 className="text-xl font-bold text-charcoal tracking-tight">
            Detailed Description
          </h2>

          {product.description_html ? (
            <div
              className="prose prose-sm max-w-none text-charcoal-light leading-relaxed space-y-3"
              dangerouslySetInnerHTML={{
                __html: sanitizeDescriptionHtml(product.description_html),
              }}
            />
          ) : product.description_text ? (
            <p className="text-sm text-charcoal-light leading-relaxed whitespace-pre-line">
              {product.description_text}
            </p>
          ) : (
            <p className="text-sm text-charcoal-muted">No detailed description available.</p>
          )}

          {/* Embedded Description Images */}
          {descImages.length > 0 && (
            <div className="space-y-4 pt-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal-muted">
                Product Highlights & Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {descImages.map((img, i) => (
                  <div
                    key={img.id || i}
                    className="relative aspect-square rounded-2xl overflow-hidden bg-cream-50 border border-charcoal-border/50"
                  >
                    <Image
                      src={img.r2_key}
                      alt={`${product.name} detail image ${i + 1}`}
                      fill
                      sizes="(max-width: 640px) 100vw, 50vw"
                      className="object-contain object-center"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 4. Related Products Grid */}
      {related.length > 0 && (
        <div className="border-t border-charcoal-border/60 pt-12 space-y-6">
          <h2 className="text-xl font-bold text-charcoal tracking-tight">
            Similar Baby Clothing
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
