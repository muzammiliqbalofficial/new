import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { ShieldCheck, Truck, Sparkles, Heart, ChevronRight, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us | tinykids.pk',
  description:
    'Learn more about tinykids.pk — Pakistan’s trusted online baby clothing store offering 100% pure combed cotton outfits with Cash on Delivery nationwide.',
  alternates: { canonical: 'https://tinykids.pk/about/' },
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-xs text-charcoal-muted font-medium">
        <Link href="/" className="hover:text-brand transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-charcoal font-bold">About Us</span>
      </nav>

      {/* Header */}
      <div className="border-b border-charcoal-border/60 pb-6 space-y-2 text-center sm:text-left">
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-brand block">
          Our Brand Story & Mission
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-charcoal tracking-tight">
          Welcome to tinykids.pk
        </h1>
        <p className="text-xs sm:text-sm text-charcoal-muted max-w-2xl leading-relaxed">
          Crafting soft, comfortable, and affordable pure cotton clothing for Pakistan’s littlest miracles.
        </p>
      </div>

      {/* Story Content Block */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        <div className="md:col-span-7 space-y-4 text-xs sm:text-sm text-charcoal-muted leading-relaxed font-medium">
          <p>
            At <strong>tinykids.pk</strong>, we understand that newborn babies deserve the softest, purest, and gentlest fabrics on their delicate skin. Founded in Pakistan with a mission to bring high-quality, affordable babywear directly to parents&apos; doorsteps, we take immense pride in every stitch we produce.
          </p>
          <p>
            From our signature 10-piece hospital bag starter sets to breathable cotton rompers, party dresses, and winter fleece suits, our collections are thoughtfully designed to make baby care effortless, comfortable, and joyful.
          </p>
          <p>
            We proudly serve over 200+ cities and towns across Pakistan with fast <strong>Cash on Delivery (COD)</strong>, direct WhatsApp customer care, and a hassle-free 7-day exchange guarantee.
          </p>
        </div>

        <div className="md:col-span-5 relative aspect-square rounded-3xl overflow-hidden bg-cream-100 border border-charcoal-border/70 shadow-card">
          <Image
            src="https://pub-4327055644f945ce92583334944f4675.r2.dev/496335818-1-1df0f6c5-1400w.webp"
            alt="tinykids.pk Baby Clothes Collection"
            fill
            className="object-contain p-6"
          />
        </div>
      </div>

      {/* 4 Core Pillars */}
      <div className="space-y-6 pt-6 border-t border-charcoal-border/50">
        <div className="text-center space-y-1">
          <h2 className="text-xl sm:text-2xl font-extrabold text-charcoal tracking-tight">
            Our Quality Promise to Parents
          </h2>
          <p className="text-xs text-charcoal-muted font-medium">
            Four pillars that define the tinykids.pk shopping experience
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 rounded-3xl bg-cream-50/80 border border-charcoal-border/70 space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-brand-soft text-brand flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-sm text-charcoal">100% Pure Combed Cotton</h3>
            <p className="text-xs text-charcoal-muted leading-relaxed font-medium">
              We exclusively use pure combed cotton jersey that is naturally breathable and hypoallergenic.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-cream-50/80 border border-charcoal-border/70 space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-brand-soft text-brand flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-sm text-charcoal">Nationwide Cash on Delivery</h3>
            <p className="text-xs text-charcoal-muted leading-relaxed font-medium">
              Reliable doorstep delivery in Karachi, Lahore, Islamabad, and 200+ cities with pay-at-delivery convenience.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-cream-50/80 border border-charcoal-border/70 space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-brand-soft text-brand flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-sm text-charcoal">7-Day Easy Size Exchange</h3>
            <p className="text-xs text-charcoal-muted leading-relaxed font-medium">
              Wrong size? No problem. Simply message us on WhatsApp and we will exchange the size hassle-free.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-cream-50/80 border border-charcoal-border/70 space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-brand-soft text-brand flex items-center justify-center">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-sm text-charcoal">Made with Love & Care</h3>
            <p className="text-xs text-charcoal-muted leading-relaxed font-medium">
              Crafted by experienced tailors who prioritize baby comfort, safety, and durability through every wash.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}