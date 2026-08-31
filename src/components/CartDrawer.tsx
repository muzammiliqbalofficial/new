'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Truck, Tag, Gift, Check, Sparkles } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice, getR2ImageUrl } from '@/lib/formatters';

export default function CartDrawer() {
  const {
    cart,
    isDrawerOpen,
    closeDrawer,
    updateQuantity,
    removeFromCart,
    subtotal,
    totalItems,
    couponCode,
    discount,
    applyCoupon,
    removeCoupon,
    isGiftBox,
    giftBoxFee,
    shippingFee,
    finalTotal,
  } = useCart();

  const [inputCode, setInputCode] = useState('');
  const [couponMsg, setCouponMsg] = useState<{ text: string; isError: boolean } | null>(null);

  const freeDeliveryRemaining = Math.max(0, 2500 - subtotal);
  const freeDeliveryProgress = Math.min(100, Math.round((subtotal / 2500) * 100));

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    const res = applyCoupon(inputCode);
    setCouponMsg({ text: res.message, isError: !res.success });
    if (res.success) setInputCode('');
  };

  if (!isDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-charcoal/60 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
        onClick={closeDrawer}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-charcoal-border/60 flex items-center justify-between bg-cream-50">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-brand" />
              <h2 className="text-base font-extrabold text-charcoal">
                Your Shopping Bag ({totalItems})
              </h2>
            </div>
            <button
              onClick={closeDrawer}
              className="p-1.5 rounded-full hover:bg-cream-200 text-charcoal-muted hover:text-charcoal transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          {cart.length > 0 && (
            <div className="p-3.5 bg-brand-soft/60 border-b border-charcoal-border/50 text-xs space-y-1.5">
              <div className="flex items-center justify-between font-bold text-charcoal">
                <span className="flex items-center space-x-1.5">
                  <Truck className="w-4 h-4 text-brand" />
                  <span>
                    {freeDeliveryRemaining === 0 ? (
                      <span className="text-emerald-700 font-extrabold">🎉 You unlocked FREE Nationwide Delivery!</span>
                    ) : (
                      <>
                        Add <strong className="text-brand font-black">Rs. {freeDeliveryRemaining}</strong> more for Free Shipping
                      </>
                    )}
                  </span>
                </span>
                <span className="text-[11px] font-black text-brand">{freeDeliveryProgress}%</span>
              </div>
              <div className="w-full h-2 bg-white rounded-full overflow-hidden border border-brand/20">
                <div
                  className="h-full bg-brand rounded-full transition-all duration-500"
                  style={{ width: `${freeDeliveryProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 divide-y divide-charcoal-border/50">
            {cart.length === 0 ? (
              <div className="py-16 text-center text-charcoal-muted flex flex-col items-center justify-center h-full">
                <div className="w-16 h-16 rounded-full bg-cream-100 flex items-center justify-center text-brand mb-4">
                  <ShoppingBag className="w-8 h-8 opacity-60" />
                </div>
                <h3 className="text-base font-extrabold text-charcoal">Your bag is empty</h3>
                <p className="text-xs text-charcoal-muted mt-1 max-w-xs font-medium">
                  Discover our premium 100% pure cotton baby sets and rompers.
                </p>
                <button
                  onClick={closeDrawer}
                  className="mt-6 px-6 py-2.5 bg-brand hover:bg-brand-dark text-white text-xs font-extrabold rounded-2xl transition-colors shadow-card"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex space-x-3.5">
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-cream-50 overflow-hidden flex-shrink-0 border border-charcoal-border/50">
                    <Image
                      src={getR2ImageUrl(item.imageStem, '300w')}
                      alt={item.name}
                      fill
                      sizes="80px"
                      className="object-contain p-1"
                    />
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={`/product/${item.slug}`}
                          onClick={closeDrawer}
                          className="text-xs sm:text-sm font-bold text-charcoal hover:text-brand transition-colors line-clamp-2 leading-snug"
                        >
                          {item.name}
                        </Link>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-charcoal-muted hover:text-coral p-1 transition-colors flex-shrink-0"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs font-black text-brand mt-1">{formatPrice(item.price)}</p>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity Selector */}
                      <div className="inline-flex items-center rounded-xl border border-charcoal-border/60 bg-cream-50 p-0.5">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 text-charcoal hover:bg-white rounded-lg transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-bold text-charcoal">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 text-charcoal hover:bg-white rounded-lg transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-xs sm:text-sm font-black text-charcoal">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Promo Code & Checkout CTA */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-charcoal-border/60 bg-cream-50 space-y-3">
              {/* Promo Code Form */}
              <div>
                {couponCode ? (
                  <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between text-xs font-bold text-emerald-800">
                    <span className="flex items-center space-x-1.5">
                      <Tag className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Code: <strong>{couponCode}</strong> (-Rs. {discount})</span>
                    </span>
                    <button
                      onClick={removeCoupon}
                      className="text-xs font-bold text-coral hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      value={inputCode}
                      onChange={(e) => setInputCode(e.target.value)}
                      placeholder="Promo code (e.g. WELCOME200)"
                      className="flex-1 px-3 py-2 bg-white rounded-xl border border-charcoal-border/80 text-xs text-charcoal focus:outline-none focus:ring-1 focus:ring-brand font-medium uppercase"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-charcoal hover:bg-brand text-white font-bold text-xs rounded-xl transition-colors"
                    >
                      Apply
                    </button>
                  </form>
                )}
                {couponMsg && (
                  <p className={`text-[11px] font-bold mt-1 ${couponMsg.isError ? 'text-coral' : 'text-emerald-700'}`}>
                    {couponMsg.text}
                  </p>
                )}
              </div>

              {/* Breakdown */}
              <div className="space-y-1.5 text-xs pt-1 border-t border-charcoal-border/40">
                <div className="flex items-center justify-between text-charcoal-muted font-medium">
                  <span>Subtotal</span>
                  <span className="font-bold text-charcoal">{formatPrice(subtotal)}</span>
                </div>

                {isGiftBox && (
                  <div className="flex items-center justify-between text-charcoal-muted font-medium">
                    <span className="flex items-center space-x-1">
                      <Gift className="w-3 h-3 text-coral" />
                      <span>Gift Box &amp; Card</span>
                    </span>
                    <span className="font-bold text-charcoal">+Rs. 150</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-charcoal-muted font-medium">
                  <span>Shipping (COD)</span>
                  <span className="font-bold text-charcoal">
                    {shippingFee === 0 ? <span className="text-emerald-600 font-extrabold">FREE</span> : 'Rs. 199'}
                  </span>
                </div>

                {discount > 0 && (
                  <div className="flex items-center justify-between text-emerald-700 font-bold">
                    <span>Discount ({couponCode})</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-sm font-extrabold text-charcoal pt-2 border-t border-charcoal-border/50">
                  <span>Total Amount</span>
                  <span className="text-base font-black text-brand">{formatPrice(finalTotal)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <Link
                href="/checkout"
                onClick={closeDrawer}
                className="w-full py-3.5 px-4 bg-brand hover:bg-brand-dark text-white font-extrabold text-xs sm:text-sm rounded-2xl flex items-center justify-center space-x-2 transition-all shadow-card hover:shadow-hover"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}