'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { ProductImage } from '@/lib/types';
import { getR2ImageUrl } from '@/lib/formatters';

interface Props {
  images: ProductImage[];
  productName: string;
}

export default function ProductGallery({ images, productName }: Props) {
  // Filter only gallery and white-bg images (exclude description images from top carousel)
  const galleryImages = images.filter((img) => !img.is_description_image);
  const displayImages = galleryImages.length > 0 ? galleryImages : images;

  // Prefer white background image as default index if available
  const initialIndex = Math.max(
    0,
    displayImages.findIndex((img) => img.is_white_background)
  );

  const [activeIndex, setActiveIndex] = useState(initialIndex >= 0 ? initialIndex : 0);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  if (!displayImages || displayImages.length === 0) {
    return (
      <div className="relative aspect-square w-full rounded-3xl bg-cream-100 flex items-center justify-center border border-charcoal-border">
        <span className="text-sm text-charcoal-muted">No image available</span>
      </div>
    );
  }

  const currentImage = displayImages[activeIndex] || displayImages[0];
  const mainImageUrl = getR2ImageUrl(currentImage?.r2_key, '1400w');

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }
    setTouchStart(null);
  };

  return (
    <div className="flex flex-col space-y-4">
      {/* Main Image Viewer with object-contain for full clarity */}
      <div
        className="relative aspect-square w-full rounded-3xl bg-white p-4 sm:p-6 overflow-hidden border border-charcoal-border/80 shadow-soft group flex items-center justify-center"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="relative w-full h-full">
          <Image
            src={mainImageUrl}
            alt={`${productName} - Image ${activeIndex + 1}`}
            fill
            priority={activeIndex === 0}
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-contain object-center transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        {currentImage.is_white_background && (
          <span className="absolute top-4 left-4 bg-white/95 backdrop-blur-md text-charcoal text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-sm flex items-center space-x-1 border border-charcoal-border/50">
            <Sparkles className="w-3 h-3 text-coral" />
            <span>Studio View</span>
          </span>
        )}

        {/* Prev / Next Arrows */}
        {displayImages.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 hover:bg-white text-charcoal shadow-md backdrop-blur-sm transition-all opacity-80 hover:opacity-100"
              aria-label="Previous product image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 hover:bg-white text-charcoal shadow-md backdrop-blur-sm transition-all opacity-80 hover:opacity-100"
              aria-label="Next product image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Counter Badge */}
        {displayImages.length > 1 && (
          <div className="absolute bottom-3 right-3 bg-charcoal/70 text-white text-[11px] font-medium px-2.5 py-0.5 rounded-full backdrop-blur-sm">
            {activeIndex + 1} / {displayImages.length}
          </div>
        )}
      </div>

      {/* Thumbnails Carousel */}
      {displayImages.length > 1 && (
        <div className="flex space-x-2.5 overflow-x-auto pb-2 scrollbar-none no-scrollbar">
          {displayImages.map((img, idx) => {
            const thumbUrl = getR2ImageUrl(img.r2_key, '300w');
            return (
              <button
                key={img.id || idx}
                onClick={() => setActiveIndex(idx)}
                className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden flex-shrink-0 bg-white p-1 transition-all border-2 ${
                  activeIndex === idx
                    ? 'border-brand ring-2 ring-brand/20 scale-95 shadow-sm'
                    : 'border-charcoal-border/60 hover:border-charcoal-muted opacity-80 hover:opacity-100'
                }`}
              >
                <div className="relative w-full h-full">
                  <Image
                    src={thumbUrl}
                    alt={`${productName} thumbnail ${idx + 1}`}
                    fill
                    sizes="80px"
                    className="object-contain object-center"
                  />
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
