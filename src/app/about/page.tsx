import React from 'react';
import type { Metadata } from 'next';
import Breadcrumbs from '@/components/Breadcrumbs';
import { Sparkles, Heart, ShieldCheck, Truck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about Tiny Kids Pakistan — your trusted source for premium baby clothing and newborn essentials.',
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      <Breadcrumbs items={[{ label: 'About Us' }]} />

      <div className="bg-white rounded-3xl p-6 sm:p-12 border border-charcoal-border/70 shadow-soft space-y-8">
        <div className="space-y-3 text-center sm:text-left">
          <span className="text-xs font-bold text-brand uppercase tracking-wider">Our Story</span>
          <h1 className="text-2xl sm:text-4xl font-black text-charcoal tracking-tight">
            Crafting Comfort for Pakistan’s Littlest Angels
          </h1>
          <div className="inline-block p-2 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-800">
            📌 <em>Client Note: This is placeholder copy. You can update this text anytime from the admin dashboard settings or request customized copy.</em>
          </div>
        </div>

        <div className="prose prose-sm sm:prose-base text-charcoal-light leading-relaxed space-y-4">
          <p>
            Welcome to <strong>Tiny Kids</strong>! Founded with a mother&apos;s love and dedication, we started with a single promise: to provide Pakistani parents with high-quality, gentle, and affordable newborn clothing that puts comfort and safety first.
          </p>
          <p>
            After serving thousands of happy families across Pakistan, our curated catalogue includes complete newborn welcome starter sets, breathable cotton rompers, bodysuits, swaddles, blankets, and nursery essentials.
          </p>
          <p>
            We understand that a baby&apos;s skin is sensitive. That&apos;s why every piece in our collection is crafted from breathable, baby-safe fabrics with smooth stitching, nickel-free snap buttons, and azo-free dyes.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-charcoal-border/60">
          <div className="p-4 rounded-2xl bg-cream-50 border border-charcoal-border/50 text-center space-y-1">
            <Heart className="w-6 h-6 text-coral mx-auto mb-1" />
            <h3 className="text-sm font-bold text-charcoal">Pure & Gentle</h3>
            <p className="text-xs text-charcoal-muted">100% gentle cotton fabrics designed for delicate infant skin.</p>
          </div>
          <div className="p-4 rounded-2xl bg-cream-50 border border-charcoal-border/50 text-center space-y-1">
            <Truck className="w-6 h-6 text-brand mx-auto mb-1" />
            <h3 className="text-sm font-bold text-charcoal">Nationwide COD</h3>
            <p className="text-xs text-charcoal-muted">Reliable delivery with cash on delivery to every corner of Pakistan.</p>
          </div>
          <div className="p-4 rounded-2xl bg-cream-50 border border-charcoal-border/50 text-center space-y-1">
            <ShieldCheck className="w-6 h-6 text-brand mx-auto mb-1" />
            <h3 className="text-sm font-bold text-charcoal">7-Day Guarantee</h3>
            <p className="text-xs text-charcoal-muted">Easy exchanges if the size or product doesn&apos;t fit your baby perfectly.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
