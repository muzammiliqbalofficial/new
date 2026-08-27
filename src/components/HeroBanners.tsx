'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, ArrowRight, Truck, Gift } from 'lucide-react';

export default function HeroBanners() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-5">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {/* Banner 1: Newborn Hospital Sets */}
        <Link
          href="/category/newborn-starter-sets"
          className="rounded-3xl bg-gradient-to-br from-brand/10 via-cream-100/80 to-white p-5 sm:p-6 border border-brand/20 shadow-soft hover:shadow-card hover:border-brand/40 transition-all flex items-center justify-between group"
        >
          <div className="flex-1 pr-3 space-y-2">
            <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-brand text-white text-[10px] font-extrabold uppercase tracking-wider">
              <Gift className="w-3 h-3" />
              <span>Hospital Ready</span>
            </span>
            <h3 className="text-base sm:text-lg font-extrabold text-charcoal tracking-tight leading-snug group-hover:text-brand transition-colors">
              Newborn Starter Sets
            </h3>
            <p className="text-[11px] sm:text-xs text-charcoal-muted font-medium line-clamp-2">
              Pure cotton 5 & 10 piece hospital starter packs.
            </p>
            <span className="inline-flex items-center space-x-1 text-xs font-extrabold text-brand pt-1">
              <span>Shop Sets</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>

          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white shadow-soft p-1 flex-shrink-0 border border-charcoal-border/50 overflow-hidden group-hover:scale-105 transition-transform duration-300">
            <Image
              src="https://pub-4327055644f945ce92583334944f4675.r2.dev/638036604-1-14a7c588-700w.webp"
              alt="Newborn Starter Sets"
              fill
              sizes="112px"
              className="object-contain p-1"
            />
          </div>
        </Link>

        {/* Banner 2: Cotton Rompers & Onesies */}
        <Link
          href="/category/bodysuits-rompers"
          className="rounded-3xl bg-gradient-to-br from-sage/15 via-cream-100/80 to-white p-5 sm:p-6 border border-sage/30 shadow-soft hover:shadow-card hover:border-sage/50 transition-all flex items-center justify-between group"
        >
          <div className="flex-1 pr-3 space-y-2">
            <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-sage text-white text-[10px] font-extrabold uppercase tracking-wider">
              <Sparkles className="w-3 h-3" />
              <span>100% Cotton</span>
            </span>
            <h3 className="text-base sm:text-lg font-extrabold text-charcoal tracking-tight leading-snug group-hover:text-sage-dark transition-colors">
              Baby Rompers & Suits
            </h3>
            <p className="text-[11px] sm:text-xs text-charcoal-muted font-medium line-clamp-2">
              Soft breathable daily wear for active babies.
            </p>
            <span className="inline-flex items-center space-x-1 text-xs font-extrabold text-sage-dark pt-1">
              <span>Shop Rompers</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>

          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white shadow-soft p-1 flex-shrink-0 border border-charcoal-border/50 overflow-hidden group-hover:scale-105 transition-transform duration-300">
            <Image
              src="https://pub-4327055644f945ce92583334944f4675.r2.dev/649530987-1-8329c9f1-700w.webp"
              alt="Baby Rompers"
              fill
              sizes="112px"
              className="object-contain p-1"
            />
          </div>
        </Link>

        {/* Banner 3: Free Delivery Offer */}
        <Link
          href="/products"
          className="rounded-3xl bg-gradient-to-br from-amber-500/10 via-cream-100/80 to-white p-5 sm:p-6 border border-amber-500/20 shadow-soft hover:shadow-card hover:border-amber-500/40 transition-all flex items-center justify-between group"
        >
          <div className="flex-1 pr-3 space-y-2">
            <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-amber-600 text-white text-[10px] font-extrabold uppercase tracking-wider">
              <Truck className="w-3 h-3" />
              <span>Special Offer</span>
            </span>
            <h3 className="text-base sm:text-lg font-extrabold text-charcoal tracking-tight leading-snug group-hover:text-amber-700 transition-colors">
              Free Delivery & COD
            </h3>
            <p className="text-[11px] sm:text-xs text-charcoal-muted font-medium line-clamp-2">
              Free shipping on orders above PKR 2,500.
            </p>
            <span className="inline-flex items-center space-x-1 text-xs font-extrabold text-amber-700 pt-1">
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>

          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white shadow-soft p-1 flex-shrink-0 border border-charcoal-border/50 overflow-hidden group-hover:scale-105 transition-transform duration-300">
            <Image
              src="https://pub-4327055644f945ce92583334944f4675.r2.dev/620053065-1-4cc74d34-700w.webp"
              alt="Free Delivery Special Offer"
              fill
              sizes="112px"
              className="object-contain p-1"
            />
          </div>
        </Link>
      </div>
    </section>
  );
}