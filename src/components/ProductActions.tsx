'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingBag, MessageCircle, Plus, Minus, Check, Truck, ShieldCheck, RotateCcw, Ruler, Phone, Zap, Edit3 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/formatters';
import SizeChartModal from './SizeChartModal';
import { Product } from '@/lib/types';

interface Props {
  product: Product;
  imageStem: string;
  whatsappNumber?: string;
}

const DEFAULT_SIZES = ['0-3 Months', '3-6 Months', '6-12 Months'];

export default function ProductActions({ product, imageStem, whatsappNumber = '923366895035' }: Props) {
  const router = useRouter();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('0-3 Months');
  const [babyName, setBabyName] = useState('');
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);
  const [added, setAdded] = useState(false);

  const isPriced = product.price !== null && product.price !== undefined && product.price > 0;
  const cleanPhone = whatsappNumber.replace(/[^0-9]/g, '');

  const itemNameWithCustomization = babyName.trim()
    ? `${product.name} (${selectedSize}) [Baby Name: ${babyName.trim()}]`
    : `${product.name} (${selectedSize})`;

  const whatsappMsg = `Assalam o Alaikum tinykids.pk! I want to order this item on Cash on Delivery:\n\n*Product:* ${product.name}\n*Price:* ${formatPrice(product.price)}\n*Size:* ${selectedSize}${babyName.trim() ? `\n*Baby Name:* ${babyName.trim()}` : ''}\n*Quantity:* ${quantity}\n\nPlease confirm availability and delivery to my address.`;
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(whatsappMsg)}`;

  const handleAddToCart = () => {
    if (!isPriced || !product.price) return;
    addToCart(
      {
        id: product.id,
        slug: product.slug,
        name: itemNameWithCustomization,
        price: product.price,
        originalPrice: product.sale_price,
        imageStem,
      },
      quantity
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    if (!isPriced || !product.price) return;
    addToCart(
      {
        id: product.id,
        slug: product.slug,
        name: itemNameWithCustomization,
        price: product.price,
        originalPrice: product.sale_price,
        imageStem,
      },
      quantity
    );
    router.push('/checkout');
  };

  return (
    <div className="space-y-6">
      {/* Price & Discount Bar */}
      <div className="p-4 rounded-3xl bg-cream-50/80 border border-charcoal-border/70 flex items-baseline justify-between">
        <div className="space-y-1">
          <span className="text-[11px] font-bold text-charcoal-muted uppercase tracking-wider block">
            Special Offer Price (COD)
          </span>
          <div className="flex items-baseline space-x-3">
            <span className="text-3xl font-extrabold text-charcoal tracking-tight">
              {formatPrice(product.price)}
            </span>
            {product.sale_price && product.price && product.sale_price > product.price && (
              <span className="text-sm font-semibold text-charcoal-muted line-through">
                {formatPrice(product.sale_price)}
              </span>
            )}
          </div>
        </div>

        {product.sale_price && product.price && product.sale_price > product.price && (
          <span className="px-3 py-1 rounded-full bg-coral/10 text-coral font-extrabold text-xs">
            Save {Math.round(((product.sale_price - (product.price || 0)) / product.sale_price) * 100)}%
          </span>
        )}
      </div>

      {/* Stock Availability Badge */}
      <div className="flex items-center space-x-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-3.5 py-2 rounded-2xl border border-emerald-200/80">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
        <span>In Stock — Ready to Dispatch from Karachi within 24 Hours</span>
      </div>

      {/* Size Selector */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold text-charcoal">Select Baby Size:</span>
          <button
            type="button"
            onClick={() => setIsSizeChartOpen(true)}
            className="text-xs font-bold text-brand hover:text-brand-dark transition-colors flex items-center space-x-1"
          >
            <Ruler className="w-3.5 h-3.5" />
            <span className="underline underline-offset-2">Size Guide</span>
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {DEFAULT_SIZES.map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => setSelectedSize(size)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                selectedSize === size
                  ? 'bg-brand text-white shadow-card scale-100'
                  : 'bg-white text-charcoal border border-charcoal-border/80 hover:bg-cream-100'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Baby Name Customization Field (Optional) */}
      <div className="p-3.5 rounded-2xl bg-cream-50/70 border border-charcoal-border/70 space-y-1.5">
        <label className="text-xs font-extrabold text-charcoal flex items-center space-x-1.5">
          <Edit3 className="w-3.5 h-3.5 text-brand" />
          <span>Enter Baby Name (Optional — for gift tag / custom print):</span>
        </label>
        <input
          type="text"
          maxLength={20}
          value={babyName}
          onChange={(e) => setBabyName(e.target.value)}
          placeholder="e.g. Zayd / Anaya (Max 20 letters)"
          className="w-full px-3 py-2 bg-white rounded-xl border border-charcoal-border/80 text-xs font-medium text-charcoal focus:outline-none focus:ring-2 focus:ring-brand/30"
        />
      </div>

      {/* Quantity & Action Buttons */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center space-x-3">
          {/* Quantity Controls */}
          <div className="flex items-center bg-cream-50 rounded-2xl border border-charcoal-border/80 p-1">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-2 rounded-xl text-charcoal-muted hover:text-charcoal hover:bg-cream-200 transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-10 text-center font-extrabold text-xs text-charcoal">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="p-2 rounded-xl text-charcoal-muted hover:text-charcoal hover:bg-cream-200 transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className={`flex-1 py-4 rounded-2xl font-extrabold text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all shadow-card hover:shadow-hover active:scale-98 ${
              added
                ? 'bg-emerald-600 text-white'
                : 'bg-white hover:bg-cream-100 text-charcoal border border-charcoal-border/80'
            }`}
          >
            {added ? (
              <>
                <Check className="w-4 h-4" />
                <span>Added to Bag!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4 text-brand" />
                <span>Add to Bag</span>
              </>
            )}
          </button>
        </div>

        {/* Buy Now Primary CTA */}
        <button
          onClick={handleBuyNow}
          className="w-full py-4 rounded-2xl bg-brand hover:bg-brand-dark text-white font-extrabold text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-card hover:shadow-hover transition-all active:scale-98"
        >
          <Zap className="w-4 h-4 fill-current text-cream-200" />
          <span>Buy Now — Cash on Delivery</span>
        </button>

        {/* Direct WhatsApp & Call Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="py-3 px-2 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-xs transition-colors"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>Order via WhatsApp</span>
          </a>
          <a
            href="tel:+923366895035"
            className="py-3 px-2 rounded-2xl bg-cream-100 hover:bg-cream-200 text-charcoal font-bold text-xs flex items-center justify-center space-x-1.5 border border-charcoal-border/70 transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-brand" />
            <span>Call: 0336-6895035</span>
          </a>
        </div>
      </div>

      {/* Delivery Calculator & Guarantees */}
      <div className="p-4 rounded-3xl bg-cream-50/70 border border-charcoal-border/60 space-y-3 text-xs">
        <div className="flex items-start space-x-2.5">
          <Truck className="w-4 h-4 text-brand mt-0.5 flex-shrink-0" />
          <div>
            <span className="font-extrabold text-charcoal block">Free Delivery over PKR 2,500</span>
            <span className="text-[11px] text-charcoal-muted leading-relaxed block">
              2-3 Days in Karachi, Lahore, Islamabad • 3-4 Days other cities. Flat Rs. 199 on smaller orders.
            </span>
          </div>
        </div>

        <div className="flex items-start space-x-2.5 pt-2 border-t border-charcoal-border/40">
          <RotateCcw className="w-4 h-4 text-brand mt-0.5 flex-shrink-0" />
          <div>
            <span className="font-extrabold text-charcoal block">7-Day Easy Exchange Policy</span>
            <span className="text-[11px] text-charcoal-muted leading-relaxed block">
              Hassle-free size or design exchange within 7 days.
            </span>
          </div>
        </div>

        <div className="flex items-start space-x-2.5 pt-2 border-t border-charcoal-border/40">
          <ShieldCheck className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
          <div>
            <span className="font-extrabold text-charcoal block">100% Pure Combed Cotton</span>
            <span className="text-[11px] text-charcoal-muted leading-relaxed block">
              Gentle, breathable and safe for delicate newborn skin.
            </span>
          </div>
        </div>
      </div>

      {/* Size Chart Modal */}
      <SizeChartModal isOpen={isSizeChartOpen} onClose={() => setIsSizeChartOpen(false)} />
    </div>
  );
}