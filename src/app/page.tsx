import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles, ShoppingBag, ShieldCheck, Truck, Star } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import ProductCard from '@/components/ProductCard';
import CategoryBubbles from '@/components/CategoryBubbles';
import TrustBadges from '@/components/TrustBadges';
import FaqSection from '@/components/FaqSection';
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
  } catch (err) {
    console.error('Home page data fetch error:', err);
    return { starterSets: [], rompers: [], bestsellers: [] };
  }
}

export default async function HomePage() {
  const { starterSets, rompers, bestsellers } = await getFeaturedProducts();

  return (
    <div className="space-y-10 sm:space-y-14">
      {/* 1. Hero Promotional Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-cream-100 via-cream-50 to-white py-12 sm:py-20 border-b border-charcoal-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Text Content */}
            <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-brand-soft text-brand text-xs font-black uppercase tracking-wider shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-coral" />
                <span>Premium Babywear Collection • Pakistan</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-charcoal tracking-tight leading-tight">
                Pure Comfort for <br className="hidden sm:inline" />
                <span className="text-brand">Little Miracles</span>
              </h1>

              <p className="text-sm sm:text-base text-charcoal-muted max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Crafted with 100% pure combed cotton jersey. Hypoallergenic, breathable, and ultra-soft on delicate
                newborn skin. Enjoy nationwide <strong>Cash on Delivery</strong> across 200+ cities in Pakistan.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
                <Link
                  href="/category/newborn-starter-sets"
                  className="w-full sm:w-auto px-8 py-4 bg-brand hover:bg-brand-dark text-white font-bold text-sm rounded-2xl shadow-card hover:shadow-hover transition-all flex items-center justify-center space-x-2 active:scale-98"
                >
                  <span>Shop Newborn Sets</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/category/bodysuits-rompers"
                  className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-cream-100 text-charcoal font-bold text-sm rounded-2xl border border-charcoal-border/80 shadow-xs transition-colors flex items-center justify-center"
                >
                  <span>Explore Rompers</span>
                </Link>
              </div>

              {/* Trust highlights */}
              <div className="pt-4 flex items-center justify-center lg:justify-start space-x-6 text-xs text-charcoal-muted font-bold">
                <span className="flex items-center space-x-1.5">
                  <Truck className="w-4 h-4 text-brand" />
                  <span>Free Shipping Above Rs. 2,999</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Cash on Delivery</span>
                </span>
              </div>
            </div>

            {/* Hero Image Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative aspect-square w-full max-w-md mx-auto rounded-3xl bg-white p-6 shadow-2xl border border-charcoal-border/70 overflow-hidden group">
                <div className="relative w-full h-full">
                  <Image
                    src="https://pub-4327055644f945ce92583334944f4675.r2.dev/496335818-1-1df0f6c5-1400w.webp"
                    alt="Newborn Baby Gift Starter Set Pakistan - tinykids.pk"
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-contain transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="absolute top-4 right-4 bg-coral text-white font-black text-xs px-3 py-1 rounded-full shadow-md">
                  HOT SELLER
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Visual Category Bubbles Explorer */}
      <CategoryBubbles />

      {/* 3. Newborn Starter Sets & Packs Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-charcoal-border/50 pb-4">
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-coral block">
              Hospital Bag & Welcome Essentials
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-charcoal tracking-tight">
              Newborn Starter Sets & Packs
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

      {/* 4. Trust Badges (Branny-Inspired 4 Pillars) */}
      <TrustBadges />

      {/* 5. Rompers & Bodysuits Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-charcoal-border/50 pb-4">
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-coral block">
              Daily Comfort & Playwear
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-charcoal tracking-tight">
              Infant Rompers & Bodysuits
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

      {/* 6. SEO Keywords Rich Content Block (Captures Google #1 Rankings) */}
      <section className="bg-cream-100/60 py-10 border-y border-charcoal-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <h2 className="text-lg sm:text-xl font-black text-charcoal tracking-tight">
            Buy Newborn Baby Clothes Online in Pakistan — tinykids.pk
          </h2>
          <div className="text-xs text-charcoal-muted leading-relaxed space-y-2">
            <p>
              Welcome to <strong>tinykids.pk</strong>, your premier destination for high-quality, ultra-soft,
              and affordable baby clothing. Whether you are preparing your hospital bag with our 10-piece newborn starter
              gift packs, shopping for breathable cotton baby rompers, or picking adorable baby girl dresses and baby boy
              coty suits, we guarantee 100% pure combed cotton fabrics that keep your little ones cozy and comfortable.
            </p>
            <p>
              We deliver nationwide across Pakistan including Karachi, Lahore, Islamabad, Rawalpindi, Faisalabad, Multan,
              Peshawar, Quetta, and Sialkot with full <strong>Cash on Delivery (COD)</strong> and a hassle-free 7-day
              exchange guarantee.
            </p>
          </div>
        </div>
      </section>

      {/* 7. FAQs with FAQPage Structured Schema */}
      <FaqSection />
    </div>
  );
}
