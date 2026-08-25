import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, ArrowRight, ShieldCheck, Truck, HeartHandshake, Star, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import ProductCard from '@/components/ProductCard';
import TrustBar from '@/components/TrustBar';
import { Category, Product } from '@/lib/types';
import { resolveMainImage } from '@/lib/formatters';

export const revalidate = 3600;

interface CategoryWithMeta extends Category {
  itemCount: number;
  subtitle: string;
  imageStem: string;
}

const CATEGORY_SUBTITLES: Record<string, string> = {
  'newborn-starter-sets': 'Complete 10-22 piece welcome sets for baby hospital bags & gifts',
  'bodysuits-rompers': 'Soft breathable cotton bodysuits, rompers & sleepsuits',
  'sweaters-winter-fleece': 'Cozy warm fleece jackets, hoodies & knit sweaters',
  'baby-dresses-frocks': 'Adorable gentle party & casual dresses for little girls',
  'tops-bottoms': 'Everyday mix-and-match cotton shirts, tees & pants',
  'baby-caps-hats-socks': 'Cute soft beanies, anti-scratch mittens & booties',
};

async function getHomePageData(): Promise<{
  categories: CategoryWithMeta[];
  featuredProducts: Product[];
}> {
  try {
    // 1. Fetch only visible clothing categories
    const { data: categoriesData } = await supabase
      .from('categories')
      .select('id, name, slug, sort_order, is_visible')
      .eq('is_visible', true)
      .order('sort_order', { ascending: true });

    // 2. Fetch published clothing products with images
    const { data: productsData } = await supabase
      .from('products')
      .select('id, slug, name, price, sale_price, stock, is_published, categories(id, name, slug), product_images(id, r2_key, sort_order, is_primary, is_white_background, is_description_image)')
      .eq('is_published', true)
      .order('sort_order', { ascending: true });

    const rawProducts = (productsData || []) as unknown as Product[];
    const rawCategories = (categoriesData || []) as Category[];

    // 3. Attach metadata, item counts, and representative image
    const categoriesWithMeta: CategoryWithMeta[] = rawCategories.map((cat) => {
      const catProducts = rawProducts.filter((p) => p.categories?.id === cat.id);
      const firstProduct = catProducts[0];
      const imageStem = firstProduct ? resolveMainImage(firstProduct) : 'placeholder-product';
      return {
        ...cat,
        itemCount: catProducts.length,
        subtitle: CATEGORY_SUBTITLES[cat.slug] || 'Premium baby clothing essentials',
        imageStem,
      };
    });

    return {
      categories: categoriesWithMeta,
      featuredProducts: rawProducts.slice(0, 12),
    };
  } catch (err) {
    console.error('Error loading home page data:', err);
    return { categories: [], featuredProducts: [] };
  }
}

export default async function HomePage() {
  const { categories, featuredProducts } = await getHomePageData();

  return (
    <div className="space-y-12 sm:space-y-16 pb-16">
      {/* 1. Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-soft/70 via-cream-100/50 to-cream-50 pt-8 sm:pt-14 pb-12 sm:pb-20 border-b border-charcoal-border/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center">
            {/* Left Hero Copy */}
            <div className="lg:col-span-7 space-y-5 sm:space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-brand/20 shadow-xs text-xs font-semibold text-brand">
                <Sparkles className="w-3.5 h-3.5 text-coral" />
                <span>100% Gentle Cotton Baby Clothing Store</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-charcoal tracking-tight leading-[1.15]">
                Ultra-Soft Clothing for Your{' '}
                <span className="text-brand relative inline-block">
                  Little Newborns
                  <span className="absolute bottom-1 left-0 w-full h-2 bg-coral/20 -z-10 rounded-full" />
                </span>
              </h1>

              <p className="text-sm sm:text-base text-charcoal-light max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Discover our handpicked collection of newborn hospital starter sets, breathable cotton rompers, cozy fleece winterwear, and baby accessories. Delivered nationwide across Pakistan with Cash on Delivery.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <a
                  href="#collections"
                  className="w-full sm:w-auto px-7 py-3.5 bg-brand hover:bg-brand-dark text-white font-bold text-sm rounded-2xl shadow-card hover:shadow-hover transition-all flex items-center justify-center space-x-2"
                >
                  <span>Explore Baby Clothing</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
                <a
                  href="#bestsellers"
                  className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-cream-100 text-charcoal font-semibold text-sm rounded-2xl border border-charcoal-border/80 transition-all flex items-center justify-center"
                >
                  <span>Featured Collection</span>
                </a>
              </div>

              {/* Trust Indicators */}
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
                  <span className="text-[11px] sm:text-xs font-medium text-charcoal">Easy 7-Day Return</span>
                </div>
              </div>
            </div>

            {/* Right Hero Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-sm sm:max-w-md rounded-3xl bg-white p-3.5 sm:p-4 shadow-hover border border-charcoal-border/60">
                <div className="relative aspect-square rounded-2xl bg-cream-100 overflow-hidden border border-charcoal-border/40">
                  <Image
                    src={featuredProducts[0] ? resolveMainImage(featuredProducts[0]) : 'placeholder-product'}
                    alt="Baby Starter Set"
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
                    <span className="text-[11px] font-semibold text-brand uppercase tracking-wider">Newborn Hospital Pack</span>
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

      {/* 3. Clean Baby Clothing Collections (6 Clear Cards) */}
      <section id="collections" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-brand mb-1">
              <Sparkles className="w-3.5 h-3.5 text-coral" />
              <span>Carefully Curated</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-charcoal tracking-tight">
              Baby Clothing Collections
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-charcoal-muted mt-1 md:mt-0">
            Explore {featuredProducts.length}+ styles for newborns, infants & toddlers
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className="group relative bg-white rounded-3xl p-5 border border-charcoal-border/70 shadow-soft hover:shadow-hover transition-all flex flex-col justify-between overflow-hidden"
            >
              <div>
                <div className="relative w-full aspect-[4/3] rounded-2xl bg-cream-100 overflow-hidden mb-4 border border-charcoal-border/40">
                  <Image
                    src={cat.imageStem}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover object-center group-hover:scale-106 transition-transform duration-500"
                  />
                  <span className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm text-brand text-xs font-bold px-3 py-1 rounded-full shadow-xs border border-brand/20">
                    {cat.itemCount} Designs
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-charcoal group-hover:text-brand transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-charcoal-muted mt-1 leading-relaxed line-clamp-2">
                  {cat.subtitle}
                </p>
              </div>

              <div className="mt-4 pt-3.5 border-t border-charcoal-border/40 flex items-center justify-between text-xs font-bold text-brand group-hover:text-coral transition-colors">
                <span>View Collection</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Featured Baby Items Grid */}
      <section id="bestsellers" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-coral mb-1">
              <span>Bestselling Items</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-charcoal tracking-tight">
              Featured Baby Wear
            </h2>
          </div>
          <Link
            href={`/category/${categories[0]?.slug || 'newborn-starter-sets'}`}
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

      {/* 5. Baby Skin Promise Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-brand to-brand-dark text-white p-8 sm:p-12 overflow-hidden shadow-card">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-coral-light">
              Hypoallergenic & Soft
            </span>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              Pure Comfort for Your Baby’s Delicate Skin
            </h2>
            <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
              Every outfit is crafted from 100% gentle, breathable cotton with smooth non-scratch stitching and nickel-free snap buttons. Designed for all-day comfort and easy diaper changes.
            </p>
            <div className="pt-2">
              <a
                href="#collections"
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
