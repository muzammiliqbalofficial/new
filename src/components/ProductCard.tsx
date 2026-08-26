'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Check } from 'lucide-react';
import { Product } from '@/lib/types';
import { formatPrice, resolveMainImage } from '@/lib/formatters';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export default function ProductCard({ product, priority = false }: ProductCardProps) {
  const { addToCart, openDrawer } = useCart();
  const imageStem = resolveMainImage(product);

  const hasDiscount = product.sale_price && product.sale_price > (product.price || 0);
  const discountPercent = hasDiscount
    ? Math.round((((product.sale_price || 0) - (product.price || 0)) / (product.sale_price || 1)) * 100)
    : 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addToCart(
      {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price || 0,
        originalPrice: product.sale_price,
        imageStem: imageStem,
      },
      1
    );
    openDrawer();
  };

  return (
    <div className="group relative flex flex-col bg-white rounded-3xl overflow-hidden border border-charcoal-border/70 shadow-soft hover:shadow-hover hover:border-brand/40 transition-all duration-300 transform hover:-translate-y-1">
      {/* Top Image Container */}
      <Link
        href={`/product/${product.slug}`}
        className="relative aspect-square w-full overflow-hidden bg-cream-50/70 p-3 sm:p-4 flex items-center justify-center cursor-pointer"
        aria-label={`View ${product.name}`}
      >
        <div className="relative w-full h-full flex items-center justify-center">
          <Image
            src={imageStem}
            alt={`${product.name} — Newborn Baby Clothes Pakistan | Tiny Kids`}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            priority={priority}
            className="object-contain object-center transition-transform duration-500 group-hover:scale-108"
          />
        </div>

        {/* Badges Overlay */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {hasDiscount && discountPercent > 0 && (
            <span className="bg-coral text-white text-[10px] sm:text-[11px] font-black px-2 py-0.5 rounded-full shadow-xs uppercase tracking-tight">
              -{discountPercent}% OFF
            </span>
          )}
          {product.stock > 0 && product.stock <= 5 && (
            <span className="bg-amber-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full shadow-xs uppercase tracking-tight">
              Low Stock
            </span>
          )}
        </div>

        {/* Floating Quick Action Button on Hover */}
        <div className="absolute inset-x-3 bottom-3 hidden sm:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          <button
            onClick={handleQuickAdd}
            className="w-full py-2.5 bg-charcoal/90 hover:bg-brand text-white font-bold text-xs rounded-2xl shadow-lg backdrop-blur-sm flex items-center justify-center space-x-1.5 transition-colors"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Quick Add</span>
          </button>
        </div>
      </Link>

      {/* Product Content Details */}
      <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between space-y-2 bg-white">
        <div>
          {/* Category Tag */}
          <span className="text-[10px] font-bold text-charcoal-muted uppercase tracking-wider block mb-1">
            {product.categories?.name || 'Baby Collection'}
          </span>

          {/* Product Title */}
          <Link href={`/product/${product.slug}`} className="block focus:outline-none">
            <h3 className="text-xs sm:text-sm font-black text-charcoal group-hover:text-brand line-clamp-2 leading-snug transition-colors">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Price & Action Row */}
        <div className="pt-2 border-t border-charcoal-border/40 flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-baseline space-x-1.5">
              <span className="text-xs sm:text-base font-black text-charcoal tracking-tight">
                {formatPrice(product.price)}
              </span>
              {hasDiscount && (
                <span className="text-[11px] sm:text-xs text-charcoal-muted line-through">
                  {formatPrice(product.sale_price)}
                </span>
              )}
            </div>
            <span className="text-[10px] text-emerald-600 font-bold flex items-center space-x-1">
              <Check className="w-3 h-3 inline" />
              <span>In Stock • Ready to Ship</span>
            </span>
          </div>

          {/* Mobile Add to Cart Button */}
          <button
            onClick={handleQuickAdd}
            aria-label="Add to cart"
            className="sm:hidden p-2 rounded-2xl bg-brand text-white shadow-xs hover:bg-brand-dark transition-colors active:scale-95 flex-shrink-0"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
