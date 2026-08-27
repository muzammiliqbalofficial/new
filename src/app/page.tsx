import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import ProductCard from '@/components/ProductCard';
import CategoryBubbles from '@/components/CategoryBubbles';
import HeroBanners from '@/components/HeroBanners';
import TrustBadges from '@/components/TrustBadges';
import FaqSection from '@/components/FaqSection';
import MarqueeTicker from '@/components/MarqueeTicker';
import InstagramFeed from '@/components/InstagramFeed';
import { Product } from '@/lib/types';

export const revalidate = 3600;

async function getFeaturedProducts(): Promise<{
  starterSets: Product[];
  rompers: Product[];
  bestsellers: Product[];
}> {
  try {
    const { data } = await supabase
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
      .order('sort_order', { ascending: true })
      .limit(24);

    const prods = (data || []) as unknown as Product[];

    return {
      starterSets: prods.filter((p) => p.categories?.slug === 'newborn-starter-sets').slice(0, 8),
      rompers: prods.filter((p) => p.categories?.slug === 'bodysuits-rompers').slice(0, 8),
      bestsellers: prods.slice(0, 8),
    };
  } catch (e) {
    console.error('Error fetching homepage products:', e);
    return { starterSets: [], rompers: [], bestsellers: [] };
  }
}

export default async function HomePage() {
  const { starterSets, rompers, bestsellers } = await getFeaturedProducts();

  return (
    <div className="space-y-10 sm:space-y-14 pb-16">
      {/* 1. Continuous Auto-Scrolling Ticker (Cash on Delivery All Over Pakistan) */}
      <MarqueeTicker />

      {/* 2. Visual Aesthetic Hero Banners */}
      <HeroBanners />

      {/* 3. Circular Visual Category Explorer */}
      <CategoryBubbles />

      {/* 4. Shop By Age Hub */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 rounded-3xl bg-cream-50/90 border border-charcoal-border/70 shadow-soft space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-brand block">
                Quick Sizing Filter
              </span>
              <h3 className="text-lg sm:text-xl font-extrabold text-charcoal tracking-tight">
                Shop Baby Outfits by Age
              </h3>
            </div>
            <Link href="/products" className="text-xs font-bold text-brand hover:underline">
              View All Sizes &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Link
              href="/products"
              className="p-4 bg-white rounded-2xl border border-charcoal-border/70 hover:border-brand hover:shadow-card transition-all text-center group"
            >
              <span className="text-base font-extrabold text-charcoal group-hover:text-brand block">
                0 - 3 Months
              </span>
              <span className="text-[11px] text-charcoal-muted font-medium">Newborn & Hospital Sets</span>
            </Link>
            <Link
              href="/products"
              className="p-4 bg-white rounded-2xl border border-charcoal-border/70 hover:border-brand hover:shadow-card transition-all text-center group"
            >
              <span className="text-base font-extrabold text-charcoal group-hover:text-brand block">
                3 - 6 Months
              </span>
              <span className="text-[11px] text-charcoal-muted font-medium">Cotton Rompers & Suits</span>
            </Link>
            <Link
              href="/products"
              className="p-4 bg-white rounded-2xl border border-charcoal-border/70 hover:border-brand hover:shadow-card transition-all text-center group"
            >
              <span className="text-base font-extrabold text-charcoal group-hover:text-brand block">
                6 - 12 Months
              </span>
              <span className="text-[11px] text-charcoal-muted font-medium">Crawling & Playwear</span>
            </Link>
            <Link
              href="/products"
              className="p-4 bg-white rounded-2xl border border-charcoal-border/70 hover:border-brand hover:shadow-card transition-all text-center group"
            >
              <span className="text-base font-extrabold text-charcoal group-hover:text-brand block">
                1 - 2 Years
              </span>
              <span className="text-[11px] text-charcoal-muted font-medium">Toddler Dresses & Sets</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Newborn Starter Sets & Packs Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-charcoal-border/50 pb-4">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-brand block">
              Hospital Bag & Gift Packs
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-charcoal tracking-tight">
              Newborn Starter Sets & Gift Packs
            </h2>
          </div>
          <Link
            href="/category/newborn-starter-sets"
            className="text-xs font-bold text-brand hover:text-brand-dark transition-colors inline-flex items-center space-x-1"
          >
            <span>View All Starter Sets</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {(starterSets.length > 0 ? starterSets : bestsellers).map((product, idx) => (
            <ProductCard key={product.id} product={product} priority={idx < 4} />
          ))}
        </div>
      </section>

      {/* 6. Trust Badges (4 Pillars) */}
      <TrustBadges />

      {/* 7. Rompers & Bodysuits Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-charcoal-border/50 pb-4">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-brand block">
              Daily Wear Baby Clothes
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-charcoal tracking-tight">
              Baby Baba Rompers & Bodysuits
            </h2>
          </div>
          <Link
            href="/category/bodysuits-rompers"
            className="text-xs font-bold text-brand hover:text-brand-dark transition-colors inline-flex items-center space-x-1"
          >
            <span>View All Rompers</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {(rompers.length > 0 ? rompers : bestsellers.slice(4)).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 8. Instagram Social Proof Feed */}
      <InstagramFeed />

      {/* 9. SEO Content Block */}
      <section className="bg-cream-100/60 py-10 border-y border-charcoal-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <h2 className="text-lg sm:text-xl font-extrabold text-charcoal tracking-tight">
            Buy Newborn Baby Clothes Online in Pakistan — tinykids.pk
          </h2>
          <div className="text-xs text-charcoal-muted leading-relaxed space-y-2 font-medium">
            <p>
              Welcome to <strong>tinykids.pk</strong>, your trusted online destination for premium newborn baby clothing.
              We specialize in 100% pure combed cotton gift sets, hospital starter packs, baby rompers, suits, and frocks
              designed to keep your little ones soft, safe, and comfortable.
            </p>
            <p>
              Enjoy fast delivery across Karachi, Lahore, Islamabad, Rawalpindi, Faisalabad, Multan, Peshawar, and 200+
              cities with full <strong>Cash on Delivery (COD)</strong> and a hassle-free 7-day exchange policy.
            </p>
          </div>
        </div>
      </section>

      {/* 10. FAQs */}
      <FaqSection />
    </div>
  );
}