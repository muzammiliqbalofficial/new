import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, ShieldCheck, Truck, RefreshCw, Sparkles } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import ProductGallery from '@/components/ProductGallery';
import ProductActions from '@/components/ProductActions';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/lib/types';
import { formatPrice, resolveMainImage, getR2ImageUrl } from '@/lib/formatters';

export const revalidate = 3600;

export async function generateStaticParams() {
  const { data } = await supabase.from('products').select('slug').eq('is_published', true);
  return (data || []).map((p) => ({ slug: p.slug }));
}

interface Props {
  params: Promise<{ slug: string }>;
}

async function getProduct(slug: string): Promise<{ product: Product | null; related: Product[] }> {
  try {
    const { data: rawProduct, error } = await supabase
      .from('products')
      .select(
        `
        id,
        slug,
        name,
        brand,
        attributes,
        price,
        sale_price,
        stock,
        is_published,
        description_text,
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

    if (error || !rawProduct) {
      return { product: null, related: [] };
    }

    const product = rawProduct as unknown as Product;
    const catObj: any = (product as any).categories;
    const categoryId = Array.isArray(catObj) ? catObj[0]?.id : catObj?.id;

    let related: Product[] = [];
    if (categoryId) {
      const { data: rel } = await supabase
        .from('products')
        .select(
          `
          id,
          slug,
          name,
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
        .eq('category_id', categoryId)
        .eq('is_published', true)
        .neq('id', product.id)
        .limit(4);

      related = (rel || []) as unknown as Product[];
    }

    return { product, related };
  } catch (err) {
    console.error('Error fetching product:', err);
    return { product: null, related: [] };
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const { product } = await getProduct(resolvedParams.slug);

  if (!product) {
    return { title: 'Product Not Found | tinykids.pk' };
  }

  const mainImg = resolveMainImage(product, '1400w');
  const priceText = product.price ? ` — ${formatPrice(product.price)}` : '';

  return {
    title: `${product.name}${priceText} | tinykids.pk`,
    description: `Buy ${product.name} online in Pakistan. 100% pure cotton babywear, Cash on Delivery nationwide, 7-day easy exchange guarantee.`,
    alternates: {
      canonical: `https://tinykids.pk/product/${product.slug}/`,
    },
    openGraph: {
      title: `${product.name} | tinykids.pk`,
      description: `Buy ${product.name} with Cash on Delivery across Pakistan.`,
      images: [{ url: mainImg, width: 800, height: 800, alt: product.name }],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const resolvedParams = await params;
  const { product, related } = await getProduct(resolvedParams.slug);

  if (!product) {
    notFound();
  }

  const imageStem = resolveMainImage(product);
  const mainImageUrl = getR2ImageUrl(product.product_images?.[0]?.r2_key, '1400w');
  const catObj: any = (product as any).categories;
  const category = Array.isArray(catObj) ? catObj[0] : catObj;

  // Google Product Schema
  const productSchema = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.name,
    image: [mainImageUrl],
    description:
      product.description_text ||
      `${product.name} crafted from 100% pure cotton for newborn babies and infants. Cash on Delivery across Pakistan.`,
    sku: product.slug,
    brand: {
      '@type': 'Brand',
      name: 'tinykids.pk',
    },
    offers: {
      '@type': 'Offer',
      url: `https://tinykids.pk/product/${product.slug}/`,
      priceCurrency: 'PKR',
      price: product.price || 0,
      priceValidUntil: '2027-12-31',
      itemCondition: 'https://schema.org/NewCondition',
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'tinykids.pk',
      },
    },
  };

  // Google BreadcrumbList Schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://tinykids.pk',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: category?.name || 'Baby Clothes',
        item: `https://tinykids.pk/category/${category?.slug || 'newborn-starter-sets'}/`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: product.name,
        item: `https://tinykids.pk/product/${product.slug}/`,
      },
    ],
  };

  return (
    <div className="space-y-12 pb-16">
      {/* Schema Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Breadcrumb Navigation */}
      <div className="bg-cream-50/80 border-b border-charcoal-border/50 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-2 text-xs font-semibold text-charcoal-muted truncate">
            <Link href="/" className="hover:text-charcoal transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
            {category && (
              <>
                <Link
                  href={`/category/${category.slug}`}
                  className="hover:text-charcoal transition-colors whitespace-nowrap"
                >
                  {category.name}
                </Link>
                <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
              </>
            )}
            <span className="text-charcoal font-bold truncate">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Main Product Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Gallery (7 Cols on desktop) */}
          <div className="lg:col-span-7">
            <ProductGallery images={product.product_images || []} productName={product.name} />
          </div>

          {/* Right Product Details & Buy Actions (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              {/* Category & Studio Badge */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-coral">
                  {category?.name || 'Newborn Collection'}
                </span>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  In Stock • Dispatch in 24h
                </span>
              </div>

              {/* Title */}
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-charcoal tracking-tight leading-snug">
                {product.name}
              </h1>
            </div>

            {/* Price Box */}
            <div className="p-4 bg-cream-50 rounded-2xl border border-charcoal-border/70 flex items-baseline space-x-3">
              <span className="text-2xl sm:text-3xl font-black text-charcoal tracking-tight">
                {formatPrice(product.price)}
              </span>
              {product.sale_price && product.sale_price > (product.price || 0) && (
                <>
                  <span className="text-sm sm:text-base text-charcoal-muted line-through">
                    {formatPrice(product.sale_price)}
                  </span>
                  <span className="text-xs font-black text-coral bg-coral/10 px-2 py-0.5 rounded-md">
                    SAVE {Math.round((((product.sale_price || 0) - (product.price || 0)) / (product.sale_price || 1)) * 100)}%
                  </span>
                </>
              )}
            </div>

            {/* Add to Cart & WhatsApp Order Actions */}
            <ProductActions product={product} imageStem={imageStem} />

            {/* Trust Assurance Pills */}
            <div className="space-y-2.5 pt-4 border-t border-charcoal-border/50 text-xs">
              <div className="flex items-center space-x-2.5 text-charcoal">
                <Truck className="w-4 h-4 text-brand flex-shrink-0" />
                <span>
                  <strong>Cash on Delivery:</strong> Free shipping above Rs. 2,999 (Flat Rs. 200 below).
                </span>
              </div>
              <div className="flex items-center space-x-2.5 text-charcoal">
                <Sparkles className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <span>
                  <strong>Pure Cotton Fabric:</strong> Breathable, gentle & safe for sensitive infant skin.
                </span>
              </div>
              <div className="flex items-center space-x-2.5 text-charcoal">
                <RefreshCw className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>
                  <strong>7-Day Easy Exchange:</strong> Hassle-free size replacement guarantee.
                </span>
              </div>
            </div>

            {/* Product Description */}
            {product.description_text && (
              <div className="pt-4 border-t border-charcoal-border/50 space-y-2">
                <h3 className="text-xs font-black uppercase tracking-wider text-charcoal">
                  Fabric & Product Specifications
                </h3>
                <div className="text-xs text-charcoal-muted leading-relaxed whitespace-pre-line bg-cream-50/50 p-4 rounded-2xl border border-charcoal-border/50">
                  {product.description_text}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pt-8 border-t border-charcoal-border/50">
          <h2 className="text-xl sm:text-2xl font-black text-charcoal tracking-tight">
            You May Also Like
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
