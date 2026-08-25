'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Plus, Minus, Trash2, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/formatters';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart, subtotal, totalItems } = useCart();

  const shippingFlatRate = Number(process.env.NEXT_PUBLIC_SHIPPING_FLAT_RATE) || 200;
  const grandTotal = subtotal + (cart.length > 0 ? shippingFlatRate : 0);

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 sm:py-24 text-center">
        <div className="w-20 h-20 rounded-full bg-cream-100 flex items-center justify-center text-brand mx-auto mb-5 shadow-inner">
          <ShoppingBag className="w-10 h-10 opacity-70" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-charcoal tracking-tight">Your Cart is Empty</h1>
        <p className="text-xs sm:text-sm text-charcoal-muted mt-2 max-w-md mx-auto">
          Looks like you haven&apos;t added any items yet. Explore our newborn starter sets, bodysuits, and baby essentials!
        </p>
        <div className="mt-8">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 px-7 py-3.5 bg-brand hover:bg-brand-dark text-white font-bold text-sm rounded-2xl shadow-card transition-all"
          >
            <span>Start Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      <div className="flex items-center justify-between border-b border-charcoal-border/60 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-charcoal tracking-tight">
            Shopping Cart ({totalItems})
          </h1>
          <p className="text-xs text-charcoal-muted mt-0.5">Review your selected items before checkout</p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-charcoal-muted hover:text-red-500 transition-colors flex items-center space-x-1"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Cart</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Cart Items List */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-4 sm:p-6 border border-charcoal-border/70 shadow-soft divide-y divide-charcoal-border/50">
          {cart.map((item) => (
            <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex items-center space-x-4">
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-cream-100 overflow-hidden flex-shrink-0 border border-charcoal-border/40">
                <Image
                  src={item.imageStem}
                  alt={item.name}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              </div>

              <div className="flex-1 min-w-0 flex flex-col justify-between h-full">
                <div className="flex items-start justify-between gap-2">
                  <Link
                    href={`/product/${item.slug}`}
                    className="text-xs sm:text-sm font-bold text-charcoal hover:text-brand transition-colors line-clamp-2"
                  >
                    {item.name}
                  </Link>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-charcoal-muted hover:text-red-500 p-1 transition-colors flex-shrink-0"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between mt-3">
                  <div className="inline-flex items-center rounded-xl border border-charcoal-border bg-cream-50 p-0.5">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1.5 text-charcoal hover:bg-white rounded-lg transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-bold text-charcoal">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1.5 text-charcoal hover:bg-white rounded-lg transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-charcoal-muted block">
                      {formatPrice(item.price)} each
                    </span>
                    <span className="text-sm sm:text-base font-black text-charcoal">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Order Summary & Checkout */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-charcoal-border/70 shadow-soft space-y-5">
          <h2 className="text-base font-bold text-charcoal uppercase tracking-wider">Order Summary</h2>

          <div className="space-y-2.5 text-xs sm:text-sm text-charcoal-light">
            <div className="flex justify-between">
              <span>Items Subtotal</span>
              <span className="font-semibold text-charcoal">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Estimated Shipping (COD)</span>
              <span className="font-semibold text-charcoal">{formatPrice(shippingFlatRate)}</span>
            </div>
            <div className="pt-3 border-t border-charcoal-border/60 flex justify-between items-baseline text-base font-bold text-charcoal">
              <span>Grand Total</span>
              <span className="text-xl font-black text-brand">{formatPrice(grandTotal)}</span>
            </div>
          </div>

          <div className="p-3 bg-cream-50 rounded-2xl border border-charcoal-border/50 space-y-1.5 text-[11px] text-charcoal-muted">
            <div className="flex items-center space-x-1.5 text-charcoal font-semibold">
              <Truck className="w-3.5 h-3.5 text-brand" />
              <span>Cash on Delivery across Pakistan</span>
            </div>
            <p>Pay in cash when your order is delivered to your address.</p>
          </div>

          <Link
            href="/checkout"
            className="w-full py-4 px-6 bg-brand hover:bg-brand-dark text-white font-bold text-sm rounded-2xl shadow-card hover:shadow-hover transition-all flex items-center justify-center space-x-2"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/"
            className="w-full py-2.5 text-center text-xs font-semibold text-charcoal-muted hover:text-charcoal block transition-colors"
          >
            ← Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
