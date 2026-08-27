import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Truck, Clock, ShieldCheck, Phone, CheckCircle2, ChevronRight, Package, MapPin } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Delivery & Shipping Policy | tinykids.pk',
  description:
    'Cash on Delivery across 200+ cities in Pakistan. 2-3 days delivery in Karachi, Lahore, Islamabad. Free shipping on orders above Rs. 2,999.',
  alternates: { canonical: 'https://tinykids.pk/shipping/' },
};

export default function ShippingPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-xs text-charcoal-muted font-medium">
        <Link href="/" className="hover:text-brand transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-charcoal font-bold">Shipping Policy</span>
      </nav>

      {/* Header */}
      <div className="border-b border-charcoal-border/60 pb-6 space-y-2">
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-brand block">
          Fast & Reliable Nationwide Delivery
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-charcoal tracking-tight">
          Delivery & Shipping Policy
        </h1>
        <p className="text-xs sm:text-sm text-charcoal-muted max-w-2xl leading-relaxed">
          We deliver baby clothing parcels all over Pakistan with 100% Cash on Delivery (COD) via premium courier services.
        </p>
      </div>

      {/* 3 Key Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-cream-50/80 border border-charcoal-border/70 space-y-2">
          <Clock className="w-6 h-6 text-brand" />
          <h3 className="font-extrabold text-sm text-charcoal">2 - 3 Days Delivery</h3>
          <p className="text-xs text-charcoal-muted leading-relaxed">
            Fast delivery to Karachi, Lahore, Islamabad, and Rawalpindi.
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-cream-50/80 border border-charcoal-border/70 space-y-2">
          <Truck className="w-6 h-6 text-brand" />
          <h3 className="font-extrabold text-sm text-charcoal">Free Delivery on Rs. 2,999+</h3>
          <p className="text-xs text-charcoal-muted leading-relaxed">
            Standard flat delivery rate of Rs. 199 on smaller orders.
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-cream-50/80 border border-charcoal-border/70 space-y-2">
          <ShieldCheck className="w-6 h-6 text-emerald-600" />
          <h3 className="font-extrabold text-sm text-charcoal">100% Cash on Delivery</h3>
          <p className="text-xs text-charcoal-muted leading-relaxed">
            Pay safely in cash when the courier rider delivers at your doorstep.
          </p>
        </div>
      </div>

      {/* Detailed Delivery Timelines */}
      <div className="space-y-4 text-xs sm:text-sm text-charcoal-muted leading-relaxed">
        <h2 className="text-lg sm:text-xl font-extrabold text-charcoal tracking-tight">
          Delivery Timelines by Region in Pakistan
        </h2>
        <div className="overflow-x-auto rounded-2xl border border-charcoal-border/60">
          <table className="w-full text-xs text-left">
            <thead className="bg-cream-100 text-charcoal font-extrabold border-b border-charcoal-border/60">
              <tr>
                <th className="py-3 px-4">City / Region</th>
                <th className="py-3 px-4">Estimated Delivery Time</th>
                <th className="py-3 px-4">Courier Partners</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal-border/40 font-medium text-charcoal-light">
              <tr className="bg-white">
                <td className="py-3 px-4 font-bold text-charcoal">Karachi</td>
                <td className="py-3 px-4">1 - 2 Working Days</td>
                <td className="py-3 px-4">TCS / Trax / Riders</td>
              </tr>
              <tr className="bg-cream-50/50">
                <td className="py-3 px-4 font-bold text-charcoal">Lahore, Islamabad, Rawalpindi</td>
                <td className="py-3 px-4">2 - 3 Working Days</td>
                <td className="py-3 px-4">TCS / Leopard / Trax</td>
              </tr>
              <tr className="bg-white">
                <td className="py-3 px-4 font-bold text-charcoal">Faisalabad, Multan, Peshawar, Sialkot, Gujranwala</td>
                <td className="py-3 px-4">2 - 4 Working Days</td>
                <td className="py-3 px-4">TCS / Leopard / Call Courier</td>
              </tr>
              <tr className="bg-cream-50/50">
                <td className="py-3 px-4 font-bold text-charcoal">All Other Cities, Towns & Rural Areas</td>
                <td className="py-3 px-4">3 - 5 Working Days</td>
                <td className="py-3 px-4">Pakistan Post / Leopard Courier</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Confirmation & Tracking */}
      <div className="space-y-3 text-xs sm:text-sm text-charcoal-muted leading-relaxed">
        <h2 className="text-lg sm:text-xl font-extrabold text-charcoal tracking-tight">
          How Your Parcel is Processed
        </h2>
        <ol className="space-y-2 list-decimal list-inside font-medium">
          <li><strong>Order Placement:</strong> Once you submit checkout, your order is recorded in our system.</li>
          <li><strong>Verification:</strong> Our customer support team verifies your delivery address via phone call or WhatsApp message.</li>
          <li><strong>Dispatch:</strong> The baby parcel is carefully inspected, packed, and handed over to our courier partner.</li>
          <li><strong>Doorstep Delivery:</strong> The courier rider contacts you on your mobile number before arrival for Cash on Delivery collection.</li>
        </ol>
      </div>

      {/* Helpline Contact Prompt */}
      <div className="p-6 rounded-3xl bg-brand-soft/50 border border-brand/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="space-y-1 text-center sm:text-left">
          <span className="font-extrabold text-sm text-charcoal block">Need urgent delivery or parcel tracking?</span>
          <span className="text-charcoal-muted">Our customer support team is active 7 days a week from 9 AM to 10 PM.</span>
        </div>
        <a
          href="https://wa.me/923366895035"
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white font-extrabold text-xs rounded-2xl shadow-xs transition-colors flex items-center space-x-2 flex-shrink-0"
        >
          <Phone className="w-4 h-4" />
          <span>WhatsApp Helpline: 0336-6895035</span>
        </a>
      </div>
    </div>
  );
}