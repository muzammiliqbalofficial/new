'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  ShoppingBag,
  MessageCircle,
  Plus,
  Minus,
  Check,
  Truck,
  ShieldCheck,
  RotateCcw,
  Ruler,
  Phone,
  Zap,
  Edit3,
  Gift,
  Flame,
  Clock,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice, getR2ImageUrl } from '@/lib/formatters';
import SizeChartModal from './SizeChartModal';
import CityDeliveryEstimator from './CityDeliveryEstimator';
import { recordRecentlyViewed } from './RecentlyViewed';
import { Product } from '@/lib/types';

interface Props {
  product: Product;
  imageStem: string;
  whatsappNumber?: string;
}

const DEFAULT_SIZES = ['0-3 Months', '3-6 Months', '6-12 Months'];

export default function ProductActions({ product, imageStem, whatsappNumber = '923366895035' }: Props) {
  const router = useRouter();
  const {
    addToCart,
    isGiftBox,
    setIsGiftBox,
    giftMessage,
    setGiftMessage,
  } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('0-3 Months');
  const [babyName, setBabyName] = useState('');
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);
  const [added, setAdded] = useState(false);
  const [liveViewers, setLiveViewers] = useState(6);
  const [timeLeft, setTimeLeft] = useState({ hours: 3, minutes: 24, seconds: 40 });
  const [showStickyBar, setShowStickyBar] = useState(false);
  const mainActionsRef = useRef<HTMLDivElement>(null);

  // Live viewers simulation (between 5 and 11)
  useEffect(() => {
    recordRecentlyViewed({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price || 0,
      imageStem,
      categoryName: product.categories?.name,
    });
    const randomInitial = Math.floor(Math.random() * 5) + 6;
    setLiveViewers(randomInitial);

    const interval = setInterval(() => {
      setLiveViewers((prev) => {
        const delta = Math.random() > 0.5 ? 1 : -1;
        const nextVal = prev + delta;
        return nextVal >= 4 && nextVal <= 12 ? nextVal : 7;
      });
    }, 9000);

    return () => clearInterval(interval);
  }, []);

  // Same-Day Dispatch Countdown Timer
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      // Target 6:00 PM PKT dispatch cutoff
      const target = new Date(now);
      target.setHours(18, 0, 0, 0);
      if (now > target) {
        target.setDate(target.getDate() + 1);
      }
      const diffMs = target.getTime() - now.getTime();
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
      setTimeLeft({ hours, minutes, seconds });
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, []);

  // Sticky Mobile Bar scroll listener
  useEffect(() => {
    const handleScroll = () => {
      if (!mainActionsRef.current) return;
      const rect = mainActionsRef.current.getBoundingClientRect();
      // Show sticky bar when main button scrolls out of view
      setShowStickyBar(rect.bottom < 0);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isPriced = product.price !== null && product.price !== undefined && product.price > 0;
  const cleanPhone = whatsappNumber.replace(/[^0-9]/g, '');

  const itemNameWithCustomization = babyName.trim()
    ? `${product.name} (${selectedSize}) [Baby Name: ${babyName.trim()}]`
    : `${product.name} (${selectedSize})`;

  const whatsappMsg = `Assalam o Alaikum tinykids.pk! I want to order this item on Cash on Delivery:\n\n*Product:* ${product.name}\n*Price:* ${formatPrice(product.price)}\n*Size:* ${selectedSize}${babyName.trim() ? `\n*Baby Name:* ${babyName.trim()}` : ''}\n*Quantity:* ${quantity}${isGiftBox ? '\n*Gift Box Packaging:* Yes (+Rs. 150)' : ''}\n\nPlease confirm availability and delivery to my address.`;
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
      {/* 1. Live Viewer Counter & Urgency Chip */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-2xl bg-coral/10 text-coral font-extrabold border border-coral/20 animate-pulse">
          <Flame className="w-3.5 h-3.5 fill-current" />
          <span>{liveViewers} parents are viewing this set right now</span>
        </div>

        <div className="inline-flex items-center space-x-1 text-[11px] font-bold text-charcoal-muted">
          <Clock className="w-3 h-3 text-brand" />
          <span>
            Dispatch countdown:{' '}
            <strong className="text-charcoal font-black">
              {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:
              {String(timeLeft.seconds).padStart(2, '0')}
            </strong>
          </span>
        </div>
      </div>

      {/* 2. Price & Discount Bar */}
      <div className="p-4 rounded-3xl bg-cream-50/80 border border-charcoal-border/70 flex items-baseline justify-between">
        <div className="space-y-1">
          <span className="text-[11px] font-bold text-charcoal-muted uppercase tracking-wider block">
            Special Offer Price (Cash on Delivery)
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

      {/* 3. Stock Availability Badge */}
      <div className="flex items-center space-x-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-3.5 py-2 rounded-2xl border border-emerald-200/80">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
        <span>In Stock — Ready for Same-Day Dispatch from Karachi</span>
      </div>

      {/* 4. Size Selector */}
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

      {/* 5. Baby Name Customization Field (Optional) */}
      <div className="p-3.5 rounded-2xl bg-cream-50/70 border border-charcoal-border/70 space-y-1.5">
        <label className="text-xs font-extrabold text-charcoal flex items-center space-x-1.5">
          <Edit3 className="w-3.5 h-3.5 text-brand" />
          <span>Enter Baby Name (Optional — for custom gift tag / print):</span>
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

      {/* 6. Newborn Gift Box & Handwritten Card Addon */}
      <div className="p-3.5 rounded-2xl bg-white border-2 border-brand/20 shadow-soft space-y-2.5">
        <label className="flex items-start space-x-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={isGiftBox}
            onChange={(e) => setIsGiftBox(e.target.checked)}
            className="w-4 h-4 mt-0.5 text-brand rounded border-charcoal-border focus:ring-brand accent-brand"
          />
          <div className="flex-1 text-xs">
            <span className="font-extrabold text-charcoal flex items-center space-x-1.5">
              <Gift className="w-3.5 h-3.5 text-coral" />
              <span>Add Premium Baby Gift Box &amp; Handwritten Card (+Rs. 150)</span>
            </span>
            <p className="text-[11px] text-charcoal-muted leading-tight mt-0.5">
              Includes luxury magnetic gift box, ribbon wrap, and a personalized baby greeting card.
            </p>
          </div>
        </label>

        {isGiftBox && (
          <div className="pl-6 animate-in fade-in space-y-1">
            <input
              type="text"
              value={giftMessage}
              onChange={(e) => setGiftMessage(e.target.value)}
              placeholder="Enter greeting message (e.g. Welcome Little Prince! Love Khala)"
              className="w-full px-3 py-2 bg-cream-50 rounded-xl border border-charcoal-border/80 text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-brand/30"
            />
          </div>
        )}
      </div>

      {/* 7. Quantity & Main Action Buttons Container */}
      <div ref={mainActionsRef} className="space-y-3 pt-2">
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

      {/* 8. Live City Delivery Estimator */}
      <CityDeliveryEstimator />

      {/* 9. Guarantees & Policy Badges */}
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

      {/* 10. Sticky Mobile Bottom Buy Bar (appears when scrolled down past main CTA) */}
      {showStickyBar && (
        <div className="fixed bottom-14 left-0 right-0 z-30 bg-white/95 backdrop-blur-md p-3 border-t border-charcoal-border/80 shadow-2xl md:hidden animate-in slide-in-from-bottom duration-300">
          <div className="flex items-center justify-between gap-2.5">
            <div className="flex items-center space-x-2 min-w-0">
              <div className="relative w-10 h-10 rounded-xl bg-cream-50 overflow-hidden flex-shrink-0 border border-charcoal-border/50">
                <Image
                  src={getR2ImageUrl(imageStem, '300w')}
                  alt={product.name}
                  fill
                  sizes="40px"
                  className="object-contain p-0.5"
                />
              </div>
              <div className="min-w-0">
                <span className="text-xs font-black text-charcoal block truncate max-w-[120px]">
                  {product.name}
                </span>
                <span className="text-xs font-extrabold text-brand block">
                  {formatPrice(product.price)}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2 flex-shrink-0">
              <button
                onClick={handleAddToCart}
                className="px-3.5 py-2.5 bg-white border border-charcoal-border/80 rounded-xl font-extrabold text-xs text-charcoal shadow-xs"
              >
                {added ? '✓ Added' : 'Add to Bag'}
              </button>
              <button
                onClick={handleBuyNow}
                className="px-4 py-2.5 bg-brand hover:bg-brand-dark text-white rounded-xl font-extrabold text-xs shadow-card flex items-center space-x-1"
              >
                <Zap className="w-3.5 h-3.5 fill-current text-cream-200" />
                <span>Buy Now</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Size Chart Modal */}
      <SizeChartModal isOpen={isSizeChartOpen} onClose={() => setIsSizeChartOpen(false)} />
    </div>
  );
}