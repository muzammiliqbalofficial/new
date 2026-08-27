'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, Truck, Package, ArrowRight, Phone, ShieldCheck, ShoppingBag } from 'lucide-react';
import { formatPrice } from '@/lib/formatters';
import { trackPurchase } from '@/lib/tracking';

function SuccessContent() {
  const searchParams = useSearchParams();
  const [orderData, setOrderData] = useState<any>(null);

  const queryOrderNum = searchParams.get('order_number') || searchParams.get('order') || 'TK-CONFIRMED';
  const queryName = searchParams.get('name') || 'Valued Customer';
  const queryTotal = Number(searchParams.get('total')) || 0;
  const queryCity = searchParams.get('city') || 'Pakistan';

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('tk_last_order');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setOrderData(parsed);
          trackPurchase({ orderNumber: parsed.orderNumber || queryOrderNum, total: parsed.total || queryTotal, items: (parsed.items || []).map((i: any) => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity })) });
        } catch (e) {}
      }
    }
  }, []);

  const orderNumber = orderData?.order_number || queryOrderNum;
  const customerName = orderData?.customer_name || queryName;
  const total = orderData?.total || queryTotal;
  const city = orderData?.city || queryCity;
  const address = orderData?.address || '';
  const items = orderData?.items || [];

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-3xl p-6 sm:p-10 border border-charcoal-border/70 shadow-card text-center space-y-6">
      {/* Success Icon & Header */}
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-brand-soft text-brand flex items-center justify-center mx-auto shadow-soft animate-bounce-subtle">
        <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10" />
      </div>

      <div className="space-y-1.5">
        <span className="text-[11px] font-black text-brand uppercase tracking-wider block">
          Order Successfully Recorded
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-charcoal tracking-tight">
          Thank You, {customerName}! 
        </h1>
        <p className="text-xs sm:text-sm text-charcoal-muted max-w-md mx-auto leading-relaxed">
          Your order has been forwarded to our dispatch team. We will contact you on your mobile number to confirm before shipping your baby parcel.
        </p>
      </div>

      {/* Order Summary Details Box */}
      <div className="p-5 sm:p-6 rounded-3xl bg-cream-50/80 border border-charcoal-border/60 text-left space-y-3.5 text-xs sm:text-sm">
        <div className="flex justify-between items-center">
          <span className="text-charcoal-muted font-semibold">Order Reference #</span>
          <span className="font-mono font-black text-charcoal text-base">{orderNumber}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-charcoal-muted font-semibold">Payment Method</span>
          <span className="font-bold text-charcoal">Cash on Delivery (COD)</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-charcoal-muted font-semibold">Destination City</span>
          <span className="font-bold text-charcoal">{city}</span>
        </div>
        {address && (
          <div className="pt-2 border-t border-charcoal-border/40">
            <span className="text-charcoal-muted font-semibold block mb-0.5 text-[11px]">Delivery Address:</span>
            <span className="font-medium text-charcoal block">{address}</span>
          </div>
        )}
        {items.length > 0 && (
          <div className="pt-2 border-t border-charcoal-border/40 space-y-1">
            <span className="text-charcoal-muted font-semibold block text-[11px]">Items in this Parcel:</span>
            {items.map((it: any, idx: number) => (
              <div key={idx} className="flex justify-between text-xs">
                <span className="text-charcoal truncate max-w-[240px]">• {it.quantity}x {it.name}</span>
                <span className="font-bold text-charcoal">{formatPrice(it.price * it.quantity)}</span>
              </div>
            ))}
          </div>
        )}
        {total > 0 && (
          <div className="pt-2.5 border-t border-charcoal-border/60 flex justify-between items-center">
            <span className="text-charcoal font-black text-sm">Total Payable at Delivery:</span>
            <span className="font-black text-brand text-base sm:text-lg">{formatPrice(total)}</span>
          </div>
        )}
      </div>

      {/* 2-Col Guarantee & Delivery Info */}
      <div className="grid grid-cols-2 gap-3 text-left text-xs">
        <div className="p-3.5 rounded-2xl bg-cream-50/70 border border-charcoal-border/50 flex items-start space-x-2.5">
          <Package className="w-4 h-4 text-brand mt-0.5 flex-shrink-0" />
          <div>
            <span className="font-bold text-charcoal block">Phone Verification</span>
            <span className="text-[11px] text-charcoal-muted">Our team will call / message before dispatch.</span>
          </div>
        </div>
        <div className="p-3.5 rounded-2xl bg-cream-50/70 border border-charcoal-border/50 flex items-start space-x-2.5">
          <Truck className="w-4 h-4 text-brand mt-0.5 flex-shrink-0" />
          <div>
            <span className="font-bold text-charcoal block">Delivery Time</span>
            <span className="text-[11px] text-charcoal-muted">2-4 days across Pakistan.</span>
          </div>
        </div>
      </div>

      {/* Helpline Contact Link */}
      <div className="pt-2 flex items-center justify-center space-x-2 text-xs text-charcoal-muted">
        <Phone className="w-3.5 h-3.5 text-[#25D366]" />
        <span>Questions about your order? WhatsApp Helpline: <strong>0336-6895035</strong></span>
      </div>

      {/* Return to Shopping */}
      <div className="pt-4 border-t border-charcoal-border/50">
        <Link
          href="/products"
          className="inline-flex items-center space-x-2 px-6 py-3 bg-brand hover:bg-brand-dark text-white font-bold text-xs rounded-2xl shadow-card transition-all"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Continue Shopping</span>
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
