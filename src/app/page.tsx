import React from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Truck, Star } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import ProductCard from '@/components/ProductCard';
import CategoryBubbles from '@/components/CategoryBubbles';
import TrustBadges from '@/components/TrustBadges';
import FaqSection from '@/components/FaqSection';
import HeroSlider from '@/components/HeroSlider';
import MarqueeTicker from '@/components/MarqueeTicker';
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
    <div className="space-y-12 sm:space-y-16 pb-16">
      {/* 1. Interactive E-Commerce Hero Slider */}
      <HeroSlider />

      {/* 2. Infinite Continuous Auto-Scrolling Ticker */}
      <MarqueeTicker />

      {/* 3. Visual Category Explorer */}
      <CategoryBubbles />

      {/* 4. Newborn Starter Sets & Packs Grid */}
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

      {/* 5. Trust Badges */}
      <TrustBadges />

      {/* 6. Rompers & Bodysuits Grid */}
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

      {/* 7. Simple Pakistani SEO Content Block */}
      <section className="bg-cream-100/60 py-10 border-y border-charcoal-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <h2 className="text-lg sm:text-xl font-extrabold text-charcoal tracking-tight">
            Buy Newborn Baby Clothes Online in Pakistan — tinykids.pk
          </h2>
          <div className="text-xs text-charcoal-muted leading-relaxed space-y-2 font-medium">
            <p>
              Welcome to <strong>tinykids.pk</strong>, Pakistan ka trusted online baby store. Hum newborn babies ke liye
              100% pure cotton gift starter sets, shirt pajama packs, baby baba rompers, baby girl frocks aur winter sweaters
              provide karte hain jo baby ki sensitive skin ke liye nihayat soft aur comfortable hain.
            </p>
            <p>
              Karachi, Lahore, Islamabad, Rawalpindi, Faisalabad, Multan, Peshawar aur poore Pakistan ke 200+ cities me
              <strong> Cash on Delivery (COD)</strong> aur 7-day easy size exchange guarantee ke sath fast delivery available hai.
            </p>
          </div>
        </div>
      </section>

      {/* 8. FAQs */}
      <FaqSection />
    </div>
  );
}
