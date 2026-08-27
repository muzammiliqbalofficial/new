'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, ArrowRight, ShieldCheck, Truck, Gift } from 'lucide-react';

export default function HeroBanners() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {/* Banner 1: Newborn Hospital Sets */}
        <div className="relative rounded-3xl bg-gradient-to-br from-brand/10 via-cream-100 to-white p-6 border border-brand/20 shadow-soft overflow-hidden flex flex-col justify-between group">
          <div className="space-y-2 z-10">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-brand text-white text-[10px] font-extrabold uppercase tracking-wider">
              <Gift className="w-3 h-3" />
              <span>Hospital Ready</span>
            </span>
            <h3 className="text-xl font-extrabold text-charcoal tracking-tight">
              Newborn Starter Sets & Gift Packs
            </h3>
            <p className="text-xs text-charcoal-muted font-medium max-w-[200px]">
              Complete 5 & 10 piece pure cotton hospital bag starter packs.
            </p>
          </div>

          <div className="pt-4 z-10">
            <Link
              href="/category/newborn-starter-sets"
              className="inline-flex items-center space-x-1.5 text-xs font-extrabold text-brand group-hover:text-brand-dark group-hover:underline"
            >
              <span>Explore Starter Sets</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="absolute right-2 -bottom-2 w-28 h-28 sm:w-32 sm:h-32 opacity-90 group-hover:scale-105 transition-transform duration-500">
            <Image
              src="https://pub-4327055644f945ce92583334944f4675.r2.dev/638036604-1-14a7c588-700w.webp"
              alt="Newborn Starter Sets"
              fill
              className="object-contain"
            />
          </div>
        </div>

        {/* Banner 2: Cotton Rompers & Onesies */}
        <div className="relative rounded-3xl bg-gradient-to-br from-sage/15 via-cream-100 to-white p-6 border border-sage/30 shadow-soft overflow-hidden flex flex-col justify-between group">
          <div className="space-y-2 z-10">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-sage text-white text-[10px] font-extrabold uppercase tracking-wider">
              <Sparkles className="w-3 h-3" />
              <span>100% Combed Cotton</span>
            </span>
            <h3 className="text-xl font-extrabold text-charcoal tracking-tight">
              Baby Baba Rompers & Bodysuits
            </h3>
            <p className="text-xs text-charcoal-muted font-medium max-w-[200px]">
              Ultra-soft breathable daily wear for active little ones.
            </p>
          </div>

          <div className="pt-4 z-10">
            <Link
              href="/category/bodysuits-rompers"
              className="inline-flex items-center space-x-1.5 text-xs font-extrabold text-sage-dark group-hover:underline"
            >
              <span>Shop Baby Rompers</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="absolute right-2 -bottom-2 w-28 h-28 sm:w-32 sm:h-32 opacity-90 group-hover:scale-105 transition-transform duration-500">
            <Image
              src="https://pub-4327055644f945ce92583334944f4675.r2.dev/649530987-1-8329c9f1-700w.webp"
              alt="Baby Rompers"
              fill
              className="object-contain"
            />
          </div>
        </div>

        {/* Banner 3: Free Delivery Offer */}
        <div className="relative rounded-3xl bg-gradient-to-br from-amber-500/10 via-cream-100 to-white p-6 border border-amber-500/20 shadow-soft overflow-hidden flex flex-col justify-between group">
          <div className="space-y-2 z-10">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-600 text-white text-[10px] font-extrabold uppercase tracking-wider">
              <Truck className="w-3 h-3" />
              <span>Special Offer</span>
            </span>
            <h3 className="text-xl font-extrabold text-charcoal tracking-tight">
              Free Delivery over PKR 2,500
            </h3>
            <p className="text-xs text-charcoal-muted font-medium max-w-[200px]">
              Nationwide Cash on Delivery with 7-Day Easy Exchange.
            </p>
          </div>

          <div className="pt-4 z-10">
            <Link
              href="/products"
              className="inline-flex items-center space-x-1.5 text-xs font-extrabold text-amber-700 group-hover:underline"
            >
              <span>Browse All Outfits</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="absolute right-2 -bottom-2 w-28 h-28 sm:w-32 sm:h-32 opacity-90 group-hover:scale-105 transition-transform duration-500">
            <Image
              src="https://pub-4327055644f945ce92583334944f4675.r2.dev/620053065-1-4cc74d34-700w.webp"
              alt="Special Offer"
              fill
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}