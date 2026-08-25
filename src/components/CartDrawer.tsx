'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/formatters';

export default function CartDrawer() {
  const { cart, isDrawerOpen, closeDrawer, updateQuantity, removeFromCart, subtotal, totalItems } =
    useCart();

  if (!isDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-charcoal/60 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
        onClick={closeDrawer}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-charcoal-border/60 flex items-center justify-between bg-cream-50">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-brand" />
              <h2 className="text-base font-bold text-charcoal">Your Shopping Cart ({totalItems})</h2>
            </div>
            <button
              onClick={closeDrawer}
              className="p-1.5 rounded-full hover:bg-cream-200 text-charcoal-muted hover:text-charcoal transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 divide-y divide-charcoal-border/50">
            {cart.length === 0 ? (
              <div className="py-16 text-center text-charcoal-muted flex flex-col items-center justify-center h-full">
                <div className="w-16 h-16 rounded-full bg-cream-100 flex items-center justify-center text-brand mb-4">
                  <ShoppingBag className="w-8 h-8 opacity-60" />
                </div>
                <h3 className="text-base font-semibold text-charcoal">Your cart is empty</h3>
                <p className="text-xs text-charcoal-muted mt-1 max-w-xs">
                  Discover our premium collection of newborn starter sets, bodysuits, and accessories.
                </p>
                <button
                  onClick={closeDrawer}
                  className="mt-6 px-5 py-2.5 bg-brand hover:bg-brand-dark text-white text-xs font-semibold rounded-xl transition-colors shadow-sm"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex space-x-3.5">
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-cream-100 overflow-hidden flex-shrink-0 border border-charcoal-border/40">
                    <Image
                      src={item.imageStem}
                      alt={item.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={`/product/${item.slug}`}
                          onClick={closeDrawer}
                          className="text-xs sm:text-sm font-semibold text-charcoal hover:text-brand transition-colors line-clamp-2 leading-snug"
                        >
                          {item.name}
                        </Link>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-charcoal-muted hover:text-red-500 p-1 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs font-bold text-brand mt-1">{formatPrice(item.price)}</p>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity Selector */}
                      <div className="inline-flex items-center rounded-lg border border-charcoal-border/60 bg-cream-50 p-0.5">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 text-charcoal hover:bg-white rounded transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-bold text-charcoal">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 text-charcoal hover:bg-white rounded transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-xs sm:text-sm font-bold text-charcoal">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout CTA */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-charcoal-border/60 bg-cream-50">
              <div className="flex items-center justify-between text-sm mb-1.5">
                <span className="text-charcoal-muted">Subtotal</span>
                <span className="text-base font-bold text-charcoal">{formatPrice(subtotal)}</span>
              </div>
              <p className="text-[11px] text-charcoal-muted mb-4">
                Shipping fee calculated at checkout. Cash on delivery available.
              </p>
              <Link
                href="/checkout"
                onClick={closeDrawer}
                className="w-full py-3 px-4 bg-brand hover:bg-brand-dark text-white font-semibold text-sm rounded-2xl flex items-center justify-center space-x-2 transition-colors shadow-card"
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
