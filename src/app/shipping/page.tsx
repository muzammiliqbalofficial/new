import React from 'react';
import type { Metadata } from 'next';
import Breadcrumbs from '@/components/Breadcrumbs';
import { Truck, Clock, ShieldCheck, MapPin } from 'lucide-react';
import { formatPrice } from '@/lib/formatters';

export const metadata: Metadata = {
  title: 'Shipping & Delivery',
  description: 'Learn about our Cash on Delivery shipping rates, timelines, and courier partners across Pakistan.',
};

export default function ShippingPage() {
  const flatRate = Number(process.env.NEXT_PUBLIC_SHIPPING_FLAT_RATE) || 200;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      <Breadcrumbs items={[{ label: 'Shipping & Delivery' }]} />

      <div className="bg-white rounded-3xl p-6 sm:p-12 border border-charcoal-border/70 shadow-soft space-y-8">
        <div className="space-y-3">
          <span className="text-xs font-bold text-brand uppercase tracking-wider">Fast & Reliable</span>
          <h1 className="text-2xl sm:text-3xl font-black text-charcoal tracking-tight">
            Shipping & Delivery Policy
          </h1>
          <div className="inline-block p-2 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-800">
            📌 <em>Client Note: This is placeholder policy copy tailored for Pakistani e-commerce. You may customize shipping rates and courier timelines.</em>
          </div>
        </div>

        <div className="space-y-6 text-xs sm:text-sm text-charcoal-light leading-relaxed">
          <div className="p-4 rounded-2xl bg-cream-50 border border-charcoal-border/60 flex items-start space-x-3">
            <Truck className="w-5 h-5 text-brand flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-charcoal text-sm">Flat Rate Delivery ({formatPrice(flatRate)})</h3>
              <p className="text-xs text-charcoal-muted mt-0.5">
                We deliver nationwide to all cities, towns, and villages across Punjab, Sindh, Khyber Pakhtunkhwa, Balochistan, Azad Kashmir, and Gilgit-Baltistan.
              </p>
            </div>
          </div>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-charcoal">Delivery Timelines</h2>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-xs text-charcoal-muted">
              <li><strong>Major Cities (Karachi, Lahore, Islamabad, Rawalpindi, Faisalabad):</strong> 2 to 3 working days.</li>
              <li><strong>Other Cities & Towns:</strong> 3 to 5 working days.</li>
              <li><strong>Remote Areas:</strong> 4 to 6 working days.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-charcoal">Cash on Delivery (COD)</h2>
            <p>
              We provide 100% Cash on Delivery on all orders. You only pay when the rider arrives at your doorstep with your parcel. Please keep the exact amount ready to ensure smooth delivery.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-charcoal">Order Verification & Tracking</h2>
            <p>
              Once your order is placed, our team may contact you via WhatsApp or phone call to verify your address details before dispatch. You will receive tracking updates directly via SMS / WhatsApp.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
