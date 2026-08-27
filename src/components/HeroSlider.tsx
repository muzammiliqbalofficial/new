'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles, ShieldCheck, Truck, Star } from 'lucide-react';

interface Slide {
  id: number;
  tag: string;
  title: string;
  highlight: string;
  subtitle: string;
  primaryCtaText: string;
  primaryCtaHref: string;
  secondaryCtaText?: string;
  secondaryCtaHref?: string;
  badge: string;
  image: string;
  alt: string;
  bgGradient: string;
  accentColor: string;
}

const SLIDES: Slide[] = [
  {
    id: 1,
    tag: 'Hospital Bag & Newborn Starter Sets',
    title: 'Pure Comfort for',
    highlight: 'Little Miracles',
    subtitle:
      '100% combed cotton newborn sets, hospital starter packs, and gift boxes. Ultra-soft on delicate baby skin with nationwide Cash on Delivery.',
    primaryCtaText: 'Shop Starter Sets',
    primaryCtaHref: '/category/newborn-starter-sets',
    secondaryCtaText: 'View All Products',
    secondaryCtaHref: '/products',
    badge: 'HOT SELLER',
    image: 'https://pub-4327055644f945ce92583334944f4675.r2.dev/496335818-1-1df0f6c5-1400w.webp',
    alt: 'Newborn Baby Starter Set Pakistan - tinykids.pk',
    bgGradient: 'from-cream-100 via-cream-50 to-white',
    accentColor: 'text-brand',
  },
  {
    id: 2,
    tag: 'Daily Playwear & Nightwear',
    title: 'Ultra-Soft Cotton',
    highlight: 'Baby Rompers',
    subtitle:
      'Breathable bodysuits and one-piece rompers with easy-snap bottoms for quick, fuss-free diaper changes day and night.',
    primaryCtaText: 'Explore Rompers',
    primaryCtaHref: '/category/bodysuits-rompers',
    secondaryCtaText: 'Shop 0-24M',
    secondaryCtaHref: '/products',
    badge: '100% PURE COTTON',
    image: 'https://pub-4327055644f945ce92583334944f4675.r2.dev/749729864-1-66ea17bb-700w.webp',
    alt: 'Baby Boy and Girl Rompers Pakistan - tinykids.pk',
    bgGradient: 'from-brand-soft/40 via-cream-50 to-white',
    accentColor: 'text-brand',
  },
  {
    id: 3,
    tag: 'Winter Warmth Collection',
    title: 'Snuggle-Ready',
    highlight: 'Sweaters & Fleece',
    subtitle:
      'Keep your newborn warm and cozy with plush fleece sets, knitted sweaters, and soft caps crafted for colder days.',
    primaryCtaText: 'Shop Winterwear',
    primaryCtaHref: '/category/sweaters-winter-fleece',
    secondaryCtaText: 'Caps & Booties',
    secondaryCtaHref: '/category/baby-caps-hats-socks',
    badge: 'COZY ESSENTIALS',
    image: 'https://pub-4327055644f945ce92583334944f4675.r2.dev/944275199-1-b163ecbd-700w.webp',
    alt: 'Baby Winter Sweaters & Fleece Sets Pakistan - tinykids.pk',
    bgGradient: 'from-sage-soft/50 via-cream-50 to-white',
    accentColor: 'text-sage-dark',
  },
  {
    id: 4,
    tag: 'Special Moments & Occasions',
    title: 'Charming Festive',
    highlight: 'Dresses & Coty Suits',
    subtitle:
      'Picture-perfect Eid, aqeeqah, and family party outfits designed with gentle fabrics that keep baby happy and looking adorable.',
    primaryCtaText: 'View Dresses & Suits',
    primaryCtaHref: '/category/baby-dresses-frocks',
    secondaryCtaText: 'Starter Packs',
    secondaryCtaHref: '/category/newborn-starter-sets',
    badge: 'OCCASION WEAR',
    image: 'https://pub-4327055644f945ce92583334944f4675.r2.dev/885085540-1-5987be74-700w.webp',
    alt: 'Baby Girl Dresses and Coty Suits Pakistan - tinykids.pk',
    bgGradient: 'from-coral-soft/50 via-cream-50 to-white',
    accentColor: 'text-coral-dark',
  },
];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  // Auto-slide every 5.5s unless hovered
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 5500);
    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  // Touch Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 50) {
      nextSlide();
    } else if (diff < -50) {
      prevSlide();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const slide = SLIDES[currentSlide];

  return (
    <section
      aria-label="Featured Collections"
      className="relative overflow-hidden border-b border-charcoal-border/50 select-none transition-colors duration-700"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background Gradient */}
      <div
        className={`bg-gradient-to-br ${slide.bgGradient} py-10 sm:py-16 lg:py-20 transition-all duration-700`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-6 text-center lg:text-left z-10">
              {/* Category Pill Tag */}
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/80 backdrop-blur-xs border border-charcoal-border/60 text-charcoal text-xs font-bold shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-brand" />
                <span>{slide.tag}</span>
              </div>

              {/* Title with Animated Slide Key */}
              <h1
                key={`title-${slide.id}`}
                className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-charcoal tracking-tight leading-tight transition-all duration-500"
              >
                {slide.title} <br className="hidden sm:inline" />
                <span className={slide.accentColor}>{slide.highlight}</span>
              </h1>

              {/* Description */}
              <p
                key={`desc-${slide.id}`}
                className="text-xs sm:text-base text-charcoal-muted max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium"
              >
                {slide.subtitle}
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
                <Link
                  href={slide.primaryCtaHref}
                  className="w-full sm:w-auto px-8 py-4 bg-brand hover:bg-brand-dark text-white font-bold text-xs sm:text-sm rounded-2xl shadow-card hover:shadow-hover transition-all flex items-center justify-center space-x-2 active:scale-98"
                >
                  <span>{slide.primaryCtaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                {slide.secondaryCtaText && slide.secondaryCtaHref && (
                  <Link
                    href={slide.secondaryCtaHref}
                    className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-cream-100 text-charcoal font-bold text-xs sm:text-sm rounded-2xl border border-charcoal-border/80 shadow-xs transition-colors flex items-center justify-center"
                  >
                    <span>{slide.secondaryCtaText}</span>
                  </Link>
                )}
              </div>

              {/* Trust Badges */}
              <div className="pt-3 flex items-center justify-center lg:justify-start space-x-6 text-xs text-charcoal-muted font-bold">
                <span className="flex items-center space-x-1.5">
                  <Truck className="w-4 h-4 text-brand" />
                  <span>Free Delivery Above Rs. 2,999</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-sage-dark" />
                  <span>Cash on Delivery</span>
                </span>
              </div>
            </div>

            {/* Right Showcase Image Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative aspect-square w-full max-w-md mx-auto rounded-3xl bg-white p-6 shadow-2xl border border-charcoal-border/70 overflow-hidden group">
                <div className="relative w-full h-full">
                  <Image
                    key={`img-${slide.id}`}
                    src={slide.image}
                    alt={slide.alt}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-contain transition-transform duration-700 group-hover:scale-105"
                  />
                </div>

                {/* Hot Badge */}
                <div className="absolute top-4 right-4 bg-brand text-white font-extrabold text-[10px] sm:text-xs px-3 py-1 rounded-full shadow-md tracking-wider uppercase">
                  {slide.badge}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        aria-label="Previous Slide"
        className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 hover:bg-white text-charcoal shadow-card flex items-center justify-center border border-charcoal-border/70 transition-all hover:scale-105 active:scale-95 z-20"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      <button
        onClick={nextSlide}
        aria-label="Next Slide"
        className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 hover:bg-white text-charcoal shadow-card flex items-center justify-center border border-charcoal-border/70 transition-all hover:scale-105 active:scale-95 z-20"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {/* Slide Pagination Dots / Pills */}
      <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex items-center space-x-2 z-20 bg-white/80 backdrop-blur-xs px-4 py-1.5 rounded-full border border-charcoal-border/60 shadow-xs">
        {SLIDES.map((s, idx) => (
          <button
            key={s.id}
            onClick={() => setCurrentSlide(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={`transition-all duration-300 rounded-full ${
              currentSlide === idx
                ? 'w-8 h-2 bg-brand'
                : 'w-2 h-2 bg-charcoal-border hover:bg-charcoal-muted'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
