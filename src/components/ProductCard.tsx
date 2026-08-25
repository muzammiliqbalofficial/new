'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag } from 'lucide-react';
import { Product } from '@/lib/types';
import { formatPrice, resolveMainImage } from '@/lib/formatters';
import { useCart } from '@/context/CartContext';

interface Props {
  product: Product;
  whatsappNumber?: string;
}

export default function ProductCard({ product }: Props) {
  const { addToCart } = useCart();
  const imageStem = resolveMainImage(product);
  const isPriced = product.price !== null && product.price !== undefined && product.price > 0;
  const categoryName = product.categories?.name || 'Baby Clothing';

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isPriced || !product.price) return;
    addToCart({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      originalPrice: product.sale_price,
      imageStem,
    });
  };

  // Calculate discount percentage if original sale_price exists
  const discountPercent =
    product.sale_price && product.price && product.sale_price > product.price
      ? Math.round(((product.sale_price - product.price) / product.sale_price) * 100)
      : null;

  return (
    <div className="group relative bg-white rounded-3xl border border-charcoal-border/70 overflow-hidden shadow-soft hover:shadow-hover transition-all duration-300 flex flex-col h-full">
      {/* Product Image Link with object-contain for zero cropping */}
      <Link href={`/product/${product.slug}`} className="block relative aspect-square bg-cream-50/60 p-3 overflow-hidden">
        <div className="relative w-full h-full flex items-center justify-center">
          <Image
            src={imageStem}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-contain object-center group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </div>

        {/* Discount Badge */}
        {discountPercent && discountPercent > 0 && (
          <span className="absolute top-2.5 left-2.5 bg-coral text-white text-[10px] sm:text-xs font-black px-2 py-0.5 rounded-full shadow-xs">
            -{discountPercent}%
          </span>
        )}

        {/* Category Pill */}
        <span className="absolute top-2.5 right-2.5 bg-white/95 backdrop-blur-md text-charcoal-light text-[9px] sm:text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-xs border border-charcoal-border/40 truncate max-w-[120px]">
          {categoryName}
        </span>
      </Link>

      {/* Product Details */}
      <div className="p-3.5 sm:p-4 flex flex-col flex-grow justify-between bg-white">
        <div>
          <Link href={`/product/${product.slug}`} className="block group-hover:text-brand transition-colors">
            <h3 className="text-xs sm:text-sm font-semibold text-charcoal line-clamp-2 leading-snug">
              {product.name}
            </h3>
          </Link>
        </div>

        <div className="mt-3 pt-2.5 border-t border-charcoal-border/40 flex items-center justify-between gap-2">
          <div>
            <div className="text-xs sm:text-base font-black text-charcoal">
              {formatPrice(product.price)}
            </div>
            {product.sale_price && product.sale_price > (product.price || 0) && (
              <div className="text-[10px] sm:text-xs text-charcoal-muted line-through">
                {formatPrice(product.sale_price)}
              </div>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            aria-label={`Add ${product.name} to cart`}
            className="inline-flex items-center justify-center p-2 sm:px-3 sm:py-1.5 bg-brand hover:bg-brand-dark text-white rounded-xl text-xs font-bold transition-all shadow-xs active:scale-95"
          >
            <ShoppingBag className="w-3.5 h-3.5 sm:mr-1.5" />
            <span className="hidden sm:inline">Add</span>
          </button>
        </div>
      </div>
    </div>
  );
}
