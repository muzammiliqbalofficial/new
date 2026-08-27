import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { RotateCcw, ShieldCheck, CheckCircle2, ChevronRight, MessageCircle, AlertCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: '7-Day Return & Exchange Policy | tinykids.pk',
  description:
    'Hassle-free 7-day size and design exchange guarantee on newborn baby clothes and rompers across Pakistan.',
  alternates: { canonical: 'https://tinykids.pk/returns/' },
};

export default function ReturnsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-xs text-charcoal-muted font-medium">
        <Link href="/" className="hover:text-brand transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-charcoal font-bold">Return & Exchange Policy</span>
      </nav>

      {/* Header */}
      <div className="border-b border-charcoal-border/60 pb-6 space-y-2">
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-brand block">
          Peace of Mind Guarantee
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-charcoal tracking-tight">
          7-Day Return & Exchange Policy
        </h1>
        <p className="text-xs sm:text-sm text-charcoal-muted max-w-2xl leading-relaxed">
          At tinykids.pk, we want you to be 100% satisfied with your baby outfits. If the size does not fit or you want to exchange the design, we offer a hassle-free 7-day exchange guarantee.
        </p>
      </div>

      {/* 3 Step Exchange Process */}
      <div className="space-y-4">
        <h2 className="text-lg sm:text-xl font-extrabold text-charcoal tracking-tight">
          How to Exchange an Item in 3 Simple Steps
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-3xl bg-cream-50/80 border border-charcoal-border/70 space-y-2 text-xs">
            <div className="w-8 h-8 rounded-full bg-brand text-white font-extrabold flex items-center justify-center text-sm">
              1
            </div>
            <h3 className="font-extrabold text-sm text-charcoal">Message on WhatsApp</h3>
            <p className="text-charcoal-muted leading-relaxed">
              Send your Order Reference # and picture of the item to our WhatsApp helpline at <strong>0336-6895035</strong>.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-cream-50/80 border border-charcoal-border/70 space-y-2 text-xs">
            <div className="w-8 h-8 rounded-full bg-brand text-white font-extrabold flex items-center justify-center text-sm">
              2
            </div>
            <h3 className="font-extrabold text-sm text-charcoal">Choose Replacement</h3>
            <p className="text-charcoal-muted leading-relaxed">
              Select the new size or design you would like in exchange. Our team will verify and reserve your item.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-cream-50/80 border border-charcoal-border/70 space-y-2 text-xs">
            <div className="w-8 h-8 rounded-full bg-brand text-white font-extrabold flex items-center justify-center text-sm">
              3
            </div>
            <h3 className="font-extrabold text-sm text-charcoal">Doorstep Swap</h3>
            <p className="text-charcoal-muted leading-relaxed">
              The courier rider will deliver your new item and collect the return item at your doorstep.
            </p>
          </div>
        </div>
      </div>

      {/* Exchange Conditions */}
      <div className="p-6 rounded-3xl bg-white border border-charcoal-border/70 shadow-soft space-y-4 text-xs sm:text-sm text-charcoal-muted leading-relaxed">
        <h2 className="text-base sm:text-lg font-extrabold text-charcoal tracking-tight flex items-center space-x-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <span>Exchange Conditions:</span>
        </h2>
        <ul className="space-y-2 list-disc list-inside font-medium">
          <li>Item must be unused, unwashed, and in original brand condition with all tags intact.</li>
          <li>Exchange request must be initiated within 7 days of receiving the delivery.</li>
          <li>Defective or wrong items are replaced free of charge without extra courier fees.</li>
          <li>For standard size or preference exchange, a minor courier charge of Rs. 199 applies.</li>
        </ul>
      </div>

      {/* CTA Prompt */}
      <div className="p-6 rounded-3xl bg-brand-soft/50 border border-brand/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="space-y-1 text-center sm:text-left">
          <span className="font-extrabold text-sm text-charcoal block">Need to exchange a baby outfit?</span>
          <span className="text-charcoal-muted">Our customer care team will assist you immediately on WhatsApp.</span>
        </div>
        <a
          href="https://wa.me/923366895035?text=Hello%20tinykids.pk,%20I%20want%20to%20request%20an%20exchange%20for%20my%20order."
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white font-extrabold text-xs rounded-2xl shadow-xs transition-colors flex items-center space-x-2 flex-shrink-0"
        >
          <MessageCircle className="w-4 h-4 fill-current" />
          <span>Start Exchange on WhatsApp</span>
        </a>
      </div>
    </div>
  );
}