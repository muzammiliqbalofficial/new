import React from 'react';
import type { Metadata } from 'next';
import Breadcrumbs from '@/components/Breadcrumbs';
import { RotateCcw, CheckCircle, AlertCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Returns & Exchanges',
  description: 'Learn about our easy 7-day return and exchange policy for baby and kids clothing.',
};

export default function ReturnsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      <Breadcrumbs items={[{ label: 'Returns & Exchange' }]} />

      <div className="bg-white rounded-3xl p-6 sm:p-12 border border-charcoal-border/70 shadow-soft space-y-8">
        <div className="space-y-3">
          <span className="text-xs font-bold text-brand uppercase tracking-wider">Hassle-Free</span>
          <h1 className="text-2xl sm:text-3xl font-black text-charcoal tracking-tight">
            Returns & Exchange Policy
          </h1>
          <div className="inline-block p-2 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-800">
             <em>Client Note: This is placeholder policy copy. Please review and inform us if you wish to amend return window or restocking conditions.</em>
          </div>
        </div>

        <div className="space-y-6 text-xs sm:text-sm text-charcoal-light leading-relaxed">
          <div className="p-4 rounded-2xl bg-cream-50 border border-charcoal-border/60 flex items-start space-x-3">
            <RotateCcw className="w-5 h-5 text-brand flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-charcoal text-sm">7-Day Easy Exchange Policy</h3>
              <p className="text-xs text-charcoal-muted mt-0.5">
                If an item is the wrong size, damaged in transit, or not as expected, you can request an exchange within 7 days of receiving your parcel.
              </p>
            </div>
          </div>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-charcoal">Exchange Conditions</h2>
            <div className="space-y-2">
              <div className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-brand flex-shrink-0 mt-0.5" />
                <span>The item must be unwashed, unworn, and in original packaging with tags intact.</span>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-brand flex-shrink-0 mt-0.5" />
                <span>Notify our customer support within 7 days of delivery via WhatsApp.</span>
              </div>
            </div>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-charcoal">How to Initiate a Return / Exchange</h2>
            <ol className="list-decimal list-inside space-y-1.5 pl-2 text-xs text-charcoal-muted">
              <li>Take a clear picture of the product and order receipt.</li>
              <li>Send the photos along with your Order Reference Number to our WhatsApp helpline.</li>
              <li>Our team will arrange a reverse pickup or provide return shipping instructions.</li>
              <li>Once verified at our hub, the replacement or refund will be processed promptly.</li>
            </ol>
          </section>
        </div>
      </div>
    </div>
  );
}
