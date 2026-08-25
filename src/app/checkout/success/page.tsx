'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, MessageCircle, Truck, Package, ArrowRight } from 'lucide-react';
import { formatPrice } from '@/lib/formatters';

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('order_number') || 'TK-CONFIRMED';
  const customerName = searchParams.get('name') || 'Valued Customer';
  const total = Number(searchParams.get('total')) || 0;
  const whatsappUrl = searchParams.get('whatsapp_url') || '';

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 sm:p-12 border border-charcoal-border/70 shadow-soft text-center space-y-6">
      {/* Icon & Heading */}
      <div className="w-20 h-20 rounded-full bg-brand-soft text-brand flex items-center justify-center mx-auto shadow-inner">
        <CheckCircle2 className="w-10 h-10" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-bold text-brand uppercase tracking-wider">Order Received</span>
        <h1 className="text-2xl sm:text-3xl font-black text-charcoal tracking-tight">
          Thank You, {customerName}!
        </h1>
        <p className="text-xs sm:text-sm text-charcoal-muted max-w-md mx-auto">
          Your order has been recorded in our system and our dispatch team has received the details.
        </p>
      </div>

      {/* Order Details Box */}
      <div className="p-5 rounded-2xl bg-cream-50 border border-charcoal-border/60 text-left space-y-3">
        <div className="flex justify-between items-center text-xs sm:text-sm">
          <span className="text-charcoal-muted">Order Reference Number</span>
          <span className="font-mono font-black text-charcoal text-base">{orderNumber}</span>
        </div>
        <div className="flex justify-between items-center text-xs sm:text-sm">
          <span className="text-charcoal-muted">Payment Method</span>
          <span className="font-semibold text-charcoal">Cash on Delivery</span>
        </div>
        {total > 0 && (
          <div className="pt-2 border-t border-charcoal-border/40 flex justify-between items-center text-xs sm:text-sm">
            <span className="text-charcoal-muted">Total Payable</span>
            <span className="font-black text-brand text-base">{formatPrice(total)}</span>
          </div>
        )}
      </div>

      {/* WhatsApp Confirmation Action */}
      {whatsappUrl && (
        <div className="space-y-2.5">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-4 px-6 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-sm sm:text-base rounded-2xl shadow-card transition-all flex items-center justify-center space-x-2.5"
          >
            <MessageCircle className="w-5 h-5" />
            <span>Send Order Summary on WhatsApp</span>
          </a>
          <p className="text-[11px] text-charcoal-muted">
            Tap above if WhatsApp did not open automatically.
          </p>
        </div>
      )}

      {/* Next steps */}
      <div className="pt-6 border-t border-charcoal-border/50 grid grid-cols-2 gap-3 text-left text-xs">
        <div className="p-3 rounded-xl bg-cream-50/50 border border-charcoal-border/40 flex items-start space-x-2.5">
          <Package className="w-4 h-4 text-brand mt-0.5 flex-shrink-0" />
          <div>
            <span className="font-bold text-charcoal block">Dispatch Confirmation</span>
            <span className="text-[11px] text-charcoal-muted">We will verify your address before shipping.</span>
          </div>
        </div>
        <div className="p-3 rounded-xl bg-cream-50/50 border border-charcoal-border/40 flex items-start space-x-2.5">
          <Truck className="w-4 h-4 text-brand mt-0.5 flex-shrink-0" />
          <div>
            <span className="font-bold text-charcoal block">Delivery Time</span>
            <span className="text-[11px] text-charcoal-muted">2-4 business days across Pakistan.</span>
          </div>
        </div>
      </div>

      {/* Return Home */}
      <div className="pt-2">
        <Link
          href="/"
          className="inline-flex items-center space-x-2 text-xs sm:text-sm font-semibold text-brand hover:text-brand-dark transition-colors"
        >
          <span>Continue Browsing Products</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      <Suspense fallback={<div className="text-center py-20 text-sm text-charcoal-muted">Loading order confirmation...</div>}>
        <SuccessContent />
      </Suspense>
    </div>
  );
}
