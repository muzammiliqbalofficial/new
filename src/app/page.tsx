import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, ArrowRight, ShieldCheck, Truck, HeartHandshake, Star } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import ProductCard from '@/components/ProductCard';
import TrustBar from '@/components/TrustBar';
import { Category, Product } from '@/lib/types';
import { resolveMainImage } from '@/lib/formatters';

export const revalidate = 3600; // ISR revalidation hourly or on-demand

async function getHomePageData(): Promise<{
  categories: Category[];
  featuredProducts: Product[];
  categoryImages: Map<string, string>;
}> {
  try {
    // 1. Fetch categories
    const { data: categoriesData } = await supabase
      .from('categories')
      .select('id, name, slug, sort_order, is_visible')
      .eq('is_visible', true)
      .order('sort_order', { ascending: true });

    // 2. Fetch products with their images & category details
    const { data: productsData } = await supabase
      .from('products')
      .select('id, slug, name, price, sale_price, stock, is_published, categories(id, name, slug), product_images(id, r2_key, sort_order, is_primary, is_white_background, is_description_image)')
      .order('sort_order', { ascending: true })
      .limit(30);

    const categories = (categoriesData || []) as Category[];
    const featuredProducts = (productsData || []) as unknown as Product[];

    // 3. Map representative image for each category
    const categoryImages = new Map<string, string>();
    for (const p of featuredProducts) {
      if (p.categories?.id && !categoryImages.has(p.categories.id)) {
        categoryImages.set(p.categories.id, resolveMainImage(p));
      }
    }

    return { categories, featuredProducts, categoryImages };
  } catch (err) {
    console.error('Error loading home page data:', err);
    return { categories: [], featuredProducts: [], categoryImages: new Map() };
  }
}

export default async function HomePage() {
  const { categories, featuredProducts, categoryImages } = await getHomePageData();

  return (
    <div className="space-y-12 sm:space-y-16 pb-16">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-soft/60 via-cream-100/40 to-cream-50 pt-8 sm:pt-14 pb-12 sm:pb-20 border-b border-charcoal-border/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-5 sm:space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-brand/20 shadow-xs text-xs font-semibold text-brand">
                <Sparkles className="w-3.5 h-3.5 text-coral" />
                <span>Pakistan’s Trusted Baby & Newborn Store</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-charcoal tracking-tight leading-[1.15]">
                Pure Comfort & Gentle Care for Your{' '}
                <span className="text-brand relative inline-block">
                  Little Angels
                  <span className="absolute bottom-1 left-0 w-full h-2 bg-coral/20 -z-10 rounded-full" />
                </span>
              </h1>

              <p className="text-sm sm:text-base text-charcoal-light max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Discover our complete collection of 100% gentle cotton newborn welcome sets, rompers, bodysuits, and nursery essentials. Delivered with love right to your doorstep.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <a
                  href="#categories"
                  className="w-full sm:w-auto px-7 py-3.5 bg-brand hover:bg-brand-dark text-white font-bold text-sm rounded-2xl shadow-card hover:shadow-hover transition-all flex items-center justify-center space-x-2"
                >
                  <span>Explore All 37 Categories</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
                <a
                  href="#arrivals"
                  className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-cream-100 text-charcoal font-semibold text-sm rounded-2xl border border-charcoal-border/80 transition-all flex items-center justify-center"
                >
                  <span>Featured Collection</span>
                </a>
              </div>

              {/* Quick Perks */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-charcoal-border/50 max-w-lg mx-auto lg:mx-0">
                <div className="flex items-center space-x-2 text-left">
                  <Truck className="w-4 h-4 text-brand flex-shrink-0" />
                  <span className="text-[11px] sm:text-xs font-medium text-charcoal">Nationwide COD</span>
                </div>
                <div className="flex items-center space-x-2 text-left">
                  <ShieldCheck className="w-4 h-4 text-brand flex-shrink-0" />
                  <span className="text-[11px] sm:text-xs font-medium text-charcoal">100% Baby-Safe</span>
                </div>
                <div className="flex items-center space-x-2 text-left">
                  <HeartHandshake className="w-4 h-4 text-brand flex-shrink-0" />
                  <span className="text-[11px] sm:text-xs font-medium text-charcoal">Easy Returns</span>
                </div>
              </div>
            </div>

            {/* Right Hero Showcase Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-sm sm:max-w-md rounded-3xl bg-white p-3.5 sm:p-4 shadow-hover border border-charcoal-border/60 rotate-1 hover:rotate-0 transition-transform duration-500">
                <div className="relative aspect-square rounded-2xl bg-cream-100 overflow-hidden border border-charcoal-border/40">
                  <Image
                    src={featuredProducts[0] ? resolveMainImage(featuredProducts[0]) : 'placeholder-product'}
                    alt="Baby Starter Set Showcase"
                    fill
                    priority
                    sizes="(max-width: 768px) 90vw, 400px"
                    className="object-cover object-center"
                  />
                  <div className="absolute top-3 right-3 bg-coral text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                    Top Trending
                  </div>
                </div>
                <div className="mt-3.5 p-2 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-semibold text-brand uppercase tracking-wider">Newborn Essentials</span>
                    <h3 className="text-sm font-bold text-charcoal line-clamp-1">Welcome to the World Starter Set</h3>
                  </div>
                  <div className="flex items-center text-amber-500 text-xs font-bold space-x-1">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>5.0</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Trust Bar */}
      <TrustBar />

      {/* 3. Category Grid (All 37 Categories) */}
      <section id="categories" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-brand mb-1">
              <Sparkles className="w-3.5 h-3.5 text-coral" />
              <span>Complete Baby Collection</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-charcoal tracking-tight">
              Shop by Category ({categories.length})
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-charcoal-muted mt-1 md:mt-0">
            Carefully curated essentials for infants, babies & toddlers
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {categories.map((cat) => {
            const catImageStem = categoryImages.get(cat.id) || 'placeholder-product';
            return (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className="group relative bg-white rounded-2xl p-3 border border-charcoal-border/70 shadow-soft hover:shadow-hover transition-all flex flex-col items-center text-center overflow-hidden"
              >
                <div className="relative w-full aspect-square rounded-xl bg-cream-100 overflow-hidden mb-2.5 border border-charcoal-border/30">
                  <Image
                    src={catImageStem}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 15vw"
                    className="object-cover object-center group-hover:scale-108 transition-transform duration-500"
                  />
                </div>
                <h3 className="text-xs sm:text-sm font-semibold text-charcoal group-hover:text-brand transition-colors line-clamp-1 leading-snug">
                  {cat.name}
                </h3>
                <span className="text-[10px] text-charcoal-muted mt-0.5 group-hover:text-coral transition-colors flex items-center space-x-0.5">
                  <span>View Items</span>
                  <ArrowRight className="w-2.5 h-2.5 inline" />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 4. New Arrivals / Featured Strip */}
      <section id="arrivals" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-coral mb-1">
              <span>Fresh In Store</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-charcoal tracking-tight">
              Featured Baby Essentials
            </h2>
          </div>
          <Link
            href={`/category/${categories[0]?.slug || ''}`}
            className="text-xs sm:text-sm font-bold text-brand hover:text-brand-dark flex items-center space-x-1"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
          {featuredProducts.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 5. Baby Comfort Promise Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-brand to-brand-dark text-white p-8 sm:p-12 overflow-hidden shadow-card">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-coral-light">
              Quality Guaranteed
            </span>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              Crafted for Your Baby’s Delicate Skin
            </h2>
            <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
              Every garment in our catalog is handpicked for softness, breathability, and durability. With hypoallergenic fabrics and seamless stitching, we guarantee your newborn feels comfortable all day long.
            </p>
            <div className="pt-2">
              <a
                href="#categories"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-white text-brand hover:bg-cream-100 font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all"
              >
                <span>Shop Baby Clothing</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
          <div className="absolute -right-10 -bottom-10 w-72 h-72 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        </div>
      </section>
    </div>
  );
}
