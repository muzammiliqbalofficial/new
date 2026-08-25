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

export const revalidate = 3600; // Hourly ISR

interface Props {
  params: Promise<{ slug: string }>;
}

async function getProductData(slug: string): Promise<{
  product: Product | null;
  relatedProducts: Product[];
}> {
  try {
    // 1. Fetch product by slug
    const { data: productData, error } = await supabase
      .from('products')
      .select('*, categories(id, name, slug), product_images(*)')
      .eq('slug', slug)
      .single();

    if (error || !productData) {
      return { product: null, relatedProducts: [] };
    }

    // 2. Fetch related products in same category
    let relatedProducts: Product[] = [];
    if (productData.category_id) {
      const { data: relatedData } = await supabase
        .from('products')
        .select('id, slug, name, price, sale_price, stock, is_published, categories(id, name, slug), product_images(id, r2_key, sort_order, is_primary, is_white_background, is_description_image)')
        .eq('category_id', productData.category_id)
        .neq('id', productData.id)
        .limit(4);

      relatedProducts = (relatedData || []) as unknown as Product[];
    }

    return {
      product: productData as unknown as Product,
      relatedProducts,
    };
  } catch (err) {
    console.error('Error fetching product data:', err);
    return { product: null, relatedProducts: [] };
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { product } = await getProductData(slug);

  if (!product) {
    return { title: 'Product Not Found' };
  }

  const cleanDescription = product.description_text || `Shop ${product.name} at Tiny Kids Pakistan. Gentle, premium quality baby essentials with Cash on Delivery nationwide.`;
  const mainImage = resolveMainImage(product);

  return {
    title: product.name,
    description: cleanDescription.slice(0, 160),
    openGraph: {
      title: `${product.name} | Tiny Kids Pakistan`,
      description: cleanDescription.slice(0, 160),
      images: mainImage ? [{ url: mainImage }] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const { product, relatedProducts } = await getProductData(slug);

  if (!product) {
    notFound();
  }

  const categoryName = product.categories?.name || 'All Categories';
  const categorySlug = product.categories?.slug || '';
  const mainImageStem = resolveMainImage(product);

  // Dynamic attributes filtering (exclude "No Brand", empty keys, or empty values)
  const validAttributes = Object.entries(product.attributes || {}).filter(([key, val]) => {
    if (!key || !val) return false;
    if (key.toLowerCase() === 'brand' && val.toLowerCase() === 'no brand') return false;
    return true;
  });

  // Extract description supplementary images
  const descriptionImages = (product.product_images || []).filter((img) => img.is_description_image);

  // Product JSON-LD Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description_text || product.name,
    image: mainImageStem,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'PKR',
      price: product.price || 0,
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
    },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-10">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: categoryName, href: `/category/${categorySlug}` },
          { label: product.name },
        ]}
      />

      {/* Top Product Section (Gallery + Details) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left: Gallery */}
        <div className="lg:col-span-6 xl:col-span-7">
          <ProductGallery
            images={product.product_images || []}
            productName={product.name}
          />
        </div>

        {/* Right: Info & Actions */}
        <div className="lg:col-span-6 xl:col-span-5 space-y-6">
          <div>
            <span className="text-xs font-bold text-brand uppercase tracking-wider block mb-1">
              {categoryName}
            </span>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-charcoal tracking-tight leading-snug">
              {product.name}
            </h1>
            {product.warranty && product.warranty !== 'No Warranty' && (
              <span className="inline-block mt-2 text-[11px] text-charcoal-muted bg-cream-100 px-2.5 py-0.5 rounded-md border border-charcoal-border/50">
                {product.warranty}
              </span>
            )}
          </div>

          <ProductActions product={product} imageStem={mainImageStem} />

          {/* Product Specifications / Attributes Table */}
          {validAttributes.length > 0 && (
            <div className="pt-4 border-t border-charcoal-border/60">
              <h3 className="text-xs font-bold text-charcoal uppercase tracking-wider mb-3">
                Product Details
              </h3>
              <div className="rounded-2xl border border-charcoal-border/60 overflow-hidden bg-white">
                <table className="w-full text-xs">
                  <tbody className="divide-y divide-charcoal-border/40">
                    {validAttributes.map(([key, val], idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? 'bg-cream-50/50' : 'bg-white'}>
                        <td className="py-2.5 px-4 font-semibold text-charcoal-muted w-2/5">{key}</td>
                        <td className="py-2.5 px-4 font-medium text-charcoal w-3/5">{val}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Description & Supplementary Body Images Section */}
      <div className="pt-10 border-t border-charcoal-border/60 space-y-8">
        <div className="max-w-4xl">
          <h2 className="text-lg sm:text-xl font-bold text-charcoal mb-4">Product Description</h2>
          {product.description_html ? (
            <div
              className="prose prose-sm max-w-none text-charcoal-light leading-relaxed space-y-3 bg-white p-6 sm:p-8 rounded-3xl border border-charcoal-border/60 shadow-soft"
              dangerouslySetInnerHTML={{
                __html: sanitizeDescriptionHtml(product.description_html),
              }}
            />
          ) : (
            <p className="text-sm text-charcoal-muted bg-white p-6 rounded-3xl border border-charcoal-border/60">
              {product.description_text || 'Premium quality baby apparel designed for everyday comfort.'}
            </p>
          )}
        </div>

        {/* Supplementary Description Images */}
        {descriptionImages.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-charcoal uppercase tracking-wider">
              More Details & Close-Ups
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {descriptionImages.map((img, idx) => (
                <div
                  key={img.id || idx}
                  className="relative aspect-square rounded-2xl bg-cream-100 overflow-hidden border border-charcoal-border/60 shadow-soft"
                >
                  <Image
                    src={img.r2_key}
                    alt={`${product.name} detail view ${idx + 1}`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Related Products Carousel / Grid */}
      {relatedProducts.length > 0 && (
        <div className="pt-12 border-t border-charcoal-border/60 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-brand uppercase tracking-wider block mb-0.5">
                More from this Category
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-charcoal">Related Baby Items</h2>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
            {relatedProducts.map((relProduct) => (
              <ProductCard key={relProduct.id} product={relProduct} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
