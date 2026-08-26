'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, MessageCircle, Truck, Package, ArrowRight, Phone, Sparkles } from 'lucide-react';
import { formatPrice } from '@/lib/formatters';

const STORE_WHATSAPP = '923366895035';

function SuccessContent() {
  const searchParams = useSearchParams();
  const [orderData, setOrderData] = useState<any>(null);

  const queryOrderNum = searchParams.get('order_number') || searchParams.get('order') || '';
  const queryName = searchParams.get('name') || '';
  const queryTotal = Number(searchParams.get('total')) || 0;
  const queryCity = searchParams.get('city') || '';

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('tk_last_order');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setOrderData(parsed);
        } catch (e) {}
      }
    }
  }, []);

  const orderNumber = orderData?.order_number || queryOrderNum || 'TK-CONFIRMED';
  const customerName = orderData?.customer_name || queryName || 'Valued Customer';
  const total = orderData?.total || queryTotal || 0;
  const city = orderData?.city || queryCity || 'Pakistan';
  const phone = orderData?.customer_phone || '';
  const address = orderData?.address || '';

  // Generate WhatsApp Message
  const itemsText = (orderData?.items || [])
    .map((i: any) => `• ${i.quantity}x ${i.name} (${formatPrice(i.price * i.quantity)})`)
    .join('\n');

  const defaultMsg = `Assalam o Alaikum Tiny Kids! 👶\n\nI have placed an order on your website:\n📦 *Order #:* ${orderNumber}\n👤 *Customer:* ${customerName}\n${phone ? `📞 *Phone:* ${phone}\n` : ''}${address ? `📍 *Address:* ${address}, ${city}\n` : ''}${itemsText ? `\n🛍️ *Items Ordered:*\n${itemsText}\n` : ''}\n💰 *Total Payable:* ${formatPrice(total)} (Cash on Delivery)\n\nPlease confirm and dispatch my parcel! ✨`;

  const whatsappUrl =
    orderData?.whatsapp_url ||
    `https://wa.me/${STORE_WHATSAPP}?text=${encodeURIComponent(defaultMsg)}`;

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-3xl p-6 sm:p-10 border border-charcoal-border/70 shadow-card text-center space-y-6">
      {/* Icon & Heading */}
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-brand-soft text-brand flex items-center justify-center mx-auto shadow-soft animate-bounce-subtle">
        <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10" />
      </div>

      <div className="space-y-1.5">
        <span className="text-[11px] font-black text-brand uppercase tracking-wider block">
          Order Successfully Placed
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-charcoal tracking-tight">
          Thank You, {customerName}! 🎉
        </h1>
        <p className="text-xs sm:text-sm text-charcoal-muted max-w-md mx-auto">
          Your baby clothing order has been received. To ensure instant confirmation and fastest dispatch, send your order summary to our WhatsApp helpline below.
        </p>
      </div>

      {/* Primary WhatsApp Action Button */}
      <div className="p-4 sm:p-6 rounded-3xl bg-[#25D366]/10 border-2 border-[#25D366] space-y-3 shadow-soft">
        <div className="flex items-center justify-center space-x-2 text-[#128C7E] font-bold text-xs">
          <Sparkles className="w-4 h-4 text-[#25D366]" />
          <span>Instant WhatsApp Dispatch Support</span>
        </div>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-4 px-6 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-black text-sm sm:text-base rounded-2xl shadow-card hover:shadow-hover transition-all flex items-center justify-center space-x-2.5 active:scale-98"
        >
          <MessageCircle className="w-5 h-5 flex-shrink-0" />
          <span>Send Order to WhatsApp (0336-6895035)</span>
        </a>

        <p className="text-[11px] text-charcoal-muted font-medium">
          1-Tap confirmation for fast parcel booking & dispatch
        </p>
      </div>

      {/* Order Details Receipt Box */}
      <div className="p-5 rounded-2xl bg-cream-50 border border-charcoal-border/60 text-left space-y-3 text-xs sm:text-sm">
        <div className="flex justify-between items-center">
          <span className="text-charcoal-muted font-semibold">Order Reference:</span>
          <span className="font-mono font-black text-charcoal text-base">{orderNumber}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-charcoal-muted font-semibold">Payment Method:</span>
          <span className="font-bold text-charcoal">Cash on Delivery (COD)</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-charcoal-muted font-semibold">Destination City:</span>
          <span className="font-bold text-charcoal">{city}</span>
        </div>
        {total > 0 && (
          <div className="pt-2 border-t border-charcoal-border/50 flex justify-between items-center">
            <span className="text-charcoal font-black">Total Payable:</span>
            <span className="font-black text-brand text-base sm:text-lg">{formatPrice(total)}</span>
          </div>
        )}
      </div>

      {/* 2-Col Guarantee & Delivery Info */}
      <div className="grid grid-cols-2 gap-3 text-left text-xs">
        <div className="p-3 rounded-2xl bg-cream-50/70 border border-charcoal-border/50 flex items-start space-x-2.5">
          <Package className="w-4 h-4 text-brand mt-0.5 flex-shrink-0" />
          <div>
            <span className="font-bold text-charcoal block">Dispatch Confirmation</span>
            <span className="text-[11px] text-charcoal-muted">Address verification before shipping.</span>
          </div>
        </div>
        <div className="p-3 rounded-2xl bg-cream-50/70 border border-charcoal-border/50 flex items-start space-x-2.5">
          <Truck className="w-4 h-4 text-brand mt-0.5 flex-shrink-0" />
          <div>
            <span className="font-bold text-charcoal block">Fast Delivery</span>
            <span className="text-[11px] text-charcoal-muted">2-4 days across Pakistan.</span>
          </div>
        </div>
      </div>

      {/* Return to Shopping */}
      <div className="pt-4 border-t border-charcoal-border/50">
        <Link
          href="/products"
          className="inline-flex items-center space-x-2 text-xs font-bold text-charcoal hover:text-brand transition-colors"
        >
          <span>Continue Shopping More Baby Outfits</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <Suspense fallback={<div className="text-center py-20 text-sm text-charcoal-muted">Loading order confirmation...</div>}>
        <SuccessContent />
      </Suspense>
    </div>
  );
}
