import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ShieldCheck, ChevronRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms & Conditions | tinykids.pk',
  description: 'Terms of service and purchasing conditions for tinykids.pk.',
  alternates: { canonical: 'https://tinykids.pk/terms/' },
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-xs text-charcoal-muted font-medium">
        <Link href="/" className="hover:text-brand transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-charcoal font-bold">Terms & Conditions</span>
      </nav>

      {/* Header */}
      <div className="border-b border-charcoal-border/60 pb-6 space-y-2">
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-brand block">
          Store Agreement
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-charcoal tracking-tight">
          Terms & Conditions
        </h1>
        <p className="text-xs sm:text-sm text-charcoal-muted max-w-2xl leading-relaxed">
          Please review the standard terms and conditions that govern your use of tinykids.pk and order placement.
        </p>
      </div>

      {/* Sections */}
      <div className="space-y-6 text-xs sm:text-sm text-charcoal-muted leading-relaxed font-medium">
        <section className="space-y-2">
          <h2 className="text-base sm:text-lg font-extrabold text-charcoal tracking-tight">
            1. Order Placement & Confirmation
          </h2>
          <p>
            By submitting an order on tinykids.pk, you confirm that the contact number and address provided are accurate. We reserve the right to contact the customer for phone/WhatsApp verification before dispatching parcels.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base sm:text-lg font-extrabold text-charcoal tracking-tight">
            2. Pricing & Payments
          </h2>
          <p>
            All prices listed on tinykids.pk are in Pakistani Rupees (PKR). Payment is made via Cash on Delivery (COD) directly to the courier rider upon delivery.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base sm:text-lg font-extrabold text-charcoal tracking-tight">
            3. Delivery & Courier Attempts
          </h2>
          <p>
            Our courier partners attempt delivery up to 2 times. Please ensure someone is available at the provided delivery address to receive the parcel and make the cash payment.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base sm:text-lg font-extrabold text-charcoal tracking-tight">
            4. Exchange & Returns
          </h2>
          <p>
            All clothing items are covered by our 7-Day Exchange Policy. Items must be unused, unwashed, and in original condition.
          </p>
        </section>
      </div>
    </div>
  );
}