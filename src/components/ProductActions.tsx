'use client';

import React, { useState } from 'react';
import { ShoppingBag, MessageCircle, Plus, Minus, Check, Truck, ShieldCheck, RotateCcw } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice, buildWhatsAppEnquiryLink } from '@/lib/formatters';
import { Product } from '@/lib/types';

interface Props {
  product: Product;
  imageStem: string;
  whatsappNumber?: string;
}

export default function ProductActions({ product, imageStem, whatsappNumber }: Props) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const isPriced = product.price !== null && product.price !== undefined && product.price > 0;
  const productUrl = typeof window !== 'undefined' ? window.location.href : `/product/${product.slug}`;
  const whatsappEnquiryUrl = buildWhatsAppEnquiryLink(product.name, productUrl, whatsappNumber);

  const handleAddToCart = () => {
    if (!isPriced || !product.price) return;
    addToCart(
      {
        id: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        originalPrice: product.sale_price,
        imageStem,
      },
      quantity
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Price Display */}
      <div className="p-4 rounded-2xl bg-cream-50 border border-charcoal-border/70 flex items-baseline justify-between">
        <div>
          <span className="text-xs text-charcoal-muted font-medium block">Price</span>
          <div className="text-2xl sm:text-3xl font-black text-charcoal flex items-baseline space-x-3">
            <span>{formatPrice(product.price)}</span>
            {isPriced && product.sale_price && product.sale_price > (product.price || 0) && (
              <span className="text-sm font-normal text-charcoal-muted line-through">
                {formatPrice(product.sale_price)}
              </span>
            )}
          </div>
        </div>
        <div className="text-right">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-brand/10 text-brand border border-brand/20">
            Cash on Delivery
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      {isPriced ? (
        <div className="space-y-3">
          {/* Quantity Selector & Add to Cart */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center rounded-2xl border border-charcoal-border bg-white p-1 shadow-xs">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="p-2 text-charcoal hover:bg-cream-100 rounded-xl transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-4 text-sm font-bold text-charcoal">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="p-2 text-charcoal hover:bg-cream-100 rounded-xl transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              className="flex-1 py-3.5 px-6 bg-brand hover:bg-brand-dark text-white font-bold text-sm sm:text-base rounded-2xl shadow-card hover:shadow-hover transition-all flex items-center justify-center space-x-2"
            >
              {added ? (
                <>
                  <Check className="w-5 h-5 text-coral-light" />
                  <span>Added to Cart!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-5 h-5" />
                  <span>Add to Cart ({formatPrice((product.price || 0) * quantity)})</span>
                </>
              )}
            </button>
          </div>

          {/* Secondary Quick Order via WhatsApp */}
          <a
            href={whatsappEnquiryUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-4 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] border border-[#25D366]/30 font-semibold text-xs sm:text-sm rounded-2xl transition-colors flex items-center justify-center space-x-2"
          >
            <MessageCircle className="w-4 h-4 text-[#25D366]" />
            <span>Order Directly via WhatsApp</span>
          </a>
        </div>
      ) : (
        /* Unpriced Product State: Direct WhatsApp Enquiry */
        <div className="space-y-3">
          <a
            href={whatsappEnquiryUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-4 px-6 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-sm sm:text-base rounded-2xl shadow-card hover:shadow-hover transition-all flex items-center justify-center space-x-2.5"
          >
            <MessageCircle className="w-5 h-5" />
            <span>Inquire Price on WhatsApp</span>
          </a>
          <p className="text-[11px] text-center text-charcoal-muted">
            Tap above to chat with our representative on WhatsApp for the latest discounted price & available sizes.
          </p>
        </div>
      )}

      {/* Trust Badges */}
      <div className="pt-4 border-t border-charcoal-border/50 grid grid-cols-3 gap-2 text-center text-charcoal-muted">
        <div className="p-2 rounded-xl bg-white border border-charcoal-border/40">
          <Truck className="w-4 h-4 text-brand mx-auto mb-1" />
          <span className="text-[10px] sm:text-xs font-semibold block text-charcoal">Nationwide COD</span>
          <span className="text-[9px] text-charcoal-muted">2-4 Days Delivery</span>
        </div>
        <div className="p-2 rounded-xl bg-white border border-charcoal-border/40">
          <RotateCcw className="w-4 h-4 text-brand mx-auto mb-1" />
          <span className="text-[10px] sm:text-xs font-semibold block text-charcoal">7-Day Returns</span>
          <span className="text-[9px] text-charcoal-muted">Hassle Free</span>
        </div>
        <div className="p-2 rounded-xl bg-white border border-charcoal-border/40">
          <ShieldCheck className="w-4 h-4 text-brand mx-auto mb-1" />
          <span className="text-[10px] sm:text-xs font-semibold block text-charcoal">100% Gentle</span>
          <span className="text-[9px] text-charcoal-muted">Baby Safe Fabric</span>
        </div>
      </div>
    </div>
  );
}
