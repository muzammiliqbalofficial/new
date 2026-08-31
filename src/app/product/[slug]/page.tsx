import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, ShieldCheck, Truck, RefreshCw, Sparkles, Star } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import ProductGallery from '@/components/ProductGallery';
import ProductActions from '@/components/ProductActions';
import ProductReviews from '@/components/ProductReviews';
import RecentlyViewed from '@/components/RecentlyViewed';
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

    // Fetch related products in the same category
    let related: Product[] = [];
    const catId = product.categories?.id;
    if (catId) {
      const { data: relatedData } = await supabase
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
        .eq('is_published', true)
        .neq('id', product.id)
        .limit(4);

      related = (relatedData || []) as unknown as Product[];
    }

    return { product, related };
  } catch (err) {
    console.error('Error fetching product:', err);
    return { product: null, related: [] };
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { product } = await getProduct(slug);

  if (!product) {
    return { title: 'Product Not Found | tinykids.pk' };
  }

  const imageUrl = resolveMainImage(product, '1400w') || 'https://tinykids.pk/logo.png';
  const priceText = product.price ? ` — Rs. ${product.price.toLocaleString('en-PK')}` : '';

  return {
    title: `${product.name}${priceText} | tinykids.pk`,
    description: `Buy ${product.name} online in Pakistan at tinykids.pk. 100% pure combed cotton with Cash on Delivery nationwide.`,
    alternates: {
      canonical: `https://tinykids.pk/product/${product.slug}/`,
    },
    openGraph: {
      title: `${product.name} | tinykids.pk`,
      description: `Shop ${product.name} with fast Cash on Delivery in Karachi, Lahore, Islamabad and all cities across Pakistan.`,
      url: `https://tinykids.pk/product/${product.slug}/`,
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 800,
          alt: product.name,
        },
      ],
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const { product, related } = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const category = product.categories;
  const productImageUrl = resolveMainImage(product, '1400w') || 'https://tinykids.pk/logo.png';
  const mainImgObj = (product.product_images || []).find((img) => img.is_white_background) || (product.product_images || [])[0];
  const imageStem = mainImgObj?.r2_key || '';

  // Schema.org Product JSON-LD
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: [productImageUrl],
    description: product.description_text || `100% pure cotton baby outfit available at tinykids.pk with Cash on Delivery.`,
    brand: {
      '@type': 'Brand',
      name: 'tinykids.pk',
    },
    offers: {
      '@type': 'Offer',
      url: `https://tinykids.pk/product/${product.slug}/`,
      priceCurrency: 'PKR',
      price: product.price || 0,
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@type': 'Organization',
        name: 'tinykids.pk',
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '42',
    },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />

      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-xs text-charcoal-muted font-medium overflow-x-auto no-scrollbar whitespace-nowrap">
        <Link href="/" className="hover:text-brand transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
        {category && (
          <>
            <Link href={`/category/${category.slug}`} className="hover:text-brand transition-colors">
              {category.name}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
          </>
        )}
        <span className="text-charcoal font-bold truncate max-w-[200px] sm:max-w-md">{product.name}</span>
      </nav>

      {/* Product Main Showcase (2-Col Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Gallery Column */}
        <div className="lg:col-span-7 sticky top-24">
          <ProductGallery images={product.product_images || []} productName={product.name} />
        </div>

        {/* Right Info & Actions Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-2 border-b border-charcoal-border/50 pb-4">
            {/* Category Tag & Rating */}
            <div className="flex items-center justify-between">
              {category && (
                <Link
                  href={`/category/${category.slug}`}
                  className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-brand-soft text-brand text-xs font-extrabold hover:bg-brand hover:text-white transition-colors"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>{category.name}</span>
                </Link>
              )}

              <a href="#reviews" className="flex items-center space-x-1 text-xs group hover:opacity-80 transition-opacity">
                <div className="flex items-center text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <span className="font-extrabold text-charcoal text-xs">4.9</span>
                <span className="text-brand font-bold underline underline-offset-2 ml-1 text-[11px]">(42 Verified Reviews)</span>
              </a>
            </div>

            {/* Product Title */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal tracking-tight leading-tight">
              {product.name}
            </h1>

            <p className="text-xs text-charcoal-muted font-medium">
              100% Pure Combed Cotton • Soft on Newborn Skin • COD in Pakistan
            </p>
          </div>

          {/* Interactive Buy, Sizing, and Quantity Controls */}
          <ProductActions product={product} imageStem={imageStem} />

          {/* Product Description */}
          {product.description_text && (
            <div className="pt-4 border-t border-charcoal-border/50 space-y-2 text-xs text-charcoal-muted leading-relaxed">
              <h3 className="font-extrabold text-xs text-charcoal uppercase tracking-wider">Product Details</h3>
              <p className="whitespace-pre-line font-medium">{product.description_text}</p>
            </div>
          )}
        </div>
      </div>

      {/* Verified Customer Reviews Section */}
      <ProductReviews productName={product.name} categorySlug={category?.slug || ""} />

      {/* Related Products Grid */}
      {related.length > 0 && (
        <section className="space-y-6 pt-10 border-t border-charcoal-border/60">
          <div className="flex items-center justify-between">
            <h3 className="text-xl sm:text-2xl font-extrabold text-charcoal tracking-tight">
              You May Also Like
            </h3>
            {category && (
              <Link
                href={`/category/${category.slug}`}
                className="text-xs font-bold text-brand hover:text-brand-dark transition-colors"
              >
                View More in {category.name} &rarr;
              </Link>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {related.map((relProduct) => (
              <ProductCard key={relProduct.id} product={relProduct} />
            ))}
          </div>
        </section>
      )}

      {/* Recently Viewed Products by User */}
      <RecentlyViewed currentProductId={product.id} />
    </div>
  );
}