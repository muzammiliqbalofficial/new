import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ShieldCheck, ChevronRight, Lock, Eye, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy | tinykids.pk',
  description:
    'Our privacy policy outlines how tinykids.pk collects, protects, and handles customer information.',
  alternates: { canonical: 'https://tinykids.pk/privacy/' },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-xs text-charcoal-muted font-medium">
        <Link href="/" className="hover:text-brand transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-charcoal font-bold">Privacy Policy</span>
      </nav>

      {/* Header */}
      <div className="border-b border-charcoal-border/60 pb-6 space-y-2">
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-brand block">
          Customer Data Protection
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-charcoal tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-xs sm:text-sm text-charcoal-muted max-w-2xl leading-relaxed">
          At tinykids.pk, we are committed to protecting your privacy and ensuring your personal information is stored securely.
        </p>
      </div>

      {/* Sections */}
      <div className="space-y-6 text-xs sm:text-sm text-charcoal-muted leading-relaxed font-medium">
        <section className="space-y-2">
          <h2 className="text-base sm:text-lg font-extrabold text-charcoal tracking-tight">
            1. Information We Collect
          </h2>
          <p>
            When you place an order on tinykids.pk, we collect essential information required to deliver your parcel, including your Full Name, Mobile Phone Number, Delivery Address, City, and optional Email Address.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base sm:text-lg font-extrabold text-charcoal tracking-tight">
            2. How We Use Your Information
          </h2>
          <ul className="space-y-1.5 list-disc list-inside">
            <li>To process, dispatch, and track your baby clothing order.</li>
            <li>To verify delivery address and phone numbers prior to dispatch.</li>
            <li>To contact you regarding delivery updates via SMS, phone, or WhatsApp.</li>
            <li>To improve our website shopping experience and customer support.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base sm:text-lg font-extrabold text-charcoal tracking-tight">
            3. Sharing of Information
          </h2>
          <p>
            We do NOT sell, rent, or trade your personal information to third parties. Your delivery details are only shared with our trusted courier partners (such as TCS, Leopard, and Trax) strictly for the purpose of delivering your parcel to your address.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base sm:text-lg font-extrabold text-charcoal tracking-tight">
            4. Data Security
          </h2>
          <p>
            We implement SSL 256-bit encryption across our website to ensure all browsing and order submissions are completely private and secure.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base sm:text-lg font-extrabold text-charcoal tracking-tight">
            5. Contact Information
          </h2>
          <p>
            If you have any questions regarding this Privacy Policy, you can reach our team at <strong>info@tinykids.pk</strong> or via WhatsApp at <strong>+92 336 6895035</strong>.
          </p>
        </section>
      </div>
    </div>
  );
}