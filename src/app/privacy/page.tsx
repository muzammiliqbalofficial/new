import React from 'react';
import type { Metadata } from 'next';
import Breadcrumbs from '@/components/Breadcrumbs';
import { ShieldCheck, Lock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Learn how Tiny Kids protects your personal and order data.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      <Breadcrumbs items={[{ label: 'Privacy Policy' }]} />

      <div className="bg-white rounded-3xl p-6 sm:p-12 border border-charcoal-border/70 shadow-soft space-y-8">
        <div className="space-y-3">
          <span className="text-xs font-bold text-brand uppercase tracking-wider">Your Trust Matters</span>
          <h1 className="text-2xl sm:text-3xl font-black text-charcoal tracking-tight">
            Privacy Policy
          </h1>
          <div className="inline-block p-2 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-800">
            📌 <em>Client Note: Standard e-commerce privacy policy protecting customer checkout and delivery data.</em>
          </div>
        </div>

        <div className="space-y-6 text-xs sm:text-sm text-charcoal-light leading-relaxed">
          <p>
            At <strong>Tiny Kids</strong>, we respect your privacy and are committed to safeguarding the personal information you share with us when placing an order or communicating with our team.
          </p>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-charcoal">Information We Collect</h2>
            <p>
              When you place an order, we collect only the necessary details required to deliver your parcel:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-2 text-xs text-charcoal-muted">
              <li>Customer Full Name</li>
              <li>Delivery Address & City</li>
              <li>Phone Number for courier verification</li>
              <li>Optional Email address for order receipts</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-charcoal">How We Use Your Information</h2>
            <p>
              Your contact details are strictly used to fulfill and dispatch your orders, provide delivery tracking updates, and provide customer support. We never sell, rent, or trade your personal data to third parties.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-charcoal">Data Security</h2>
            <p>
              All customer orders and transactions are stored in our secure database with Row Level Security (RLS) policies. We do not store sensitive payment card details since all payments are processed via Cash on Delivery.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
