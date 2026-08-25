'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, MessageCircle } from 'lucide-react';
import { Product } from '@/lib/types';
import { formatPrice, resolveMainImage, buildWhatsAppEnquiryLink } from '@/lib/formatters';
import { useCart } from '@/context/CartContext';

interface Props {
  product: Product;
  whatsappNumber?: string;
}

export default function ProductCard({ product, whatsappNumber }: Props) {
  const { addToCart } = useCart();
  const imageStem = resolveMainImage(product);
  const isPriced = product.price !== null && product.price !== undefined && product.price > 0;
  const categoryName = product.categories?.name || 'Baby Products';

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

  const productUrl = typeof window !== 'undefined' ? `${window.location.origin}/product/${product.slug}` : `/product/${product.slug}`;
  const whatsappUrl = buildWhatsAppEnquiryLink(product.name, productUrl, whatsappNumber);

  return (
    <div className="group relative bg-white rounded-2xl border border-charcoal-border/70 overflow-hidden shadow-soft hover:shadow-hover transition-all duration-300 flex flex-col h-full">
      {/* Product Image Link */}
      <Link href={`/product/${product.slug}`} className="block relative aspect-square bg-cream-100 overflow-hidden">
        <Image
          src={imageStem}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {/* Category Pill */}
        <span className="absolute top-2.5 left-2.5 bg-white/90 backdrop-blur-md text-charcoal-light text-[10px] sm:text-xs font-medium px-2 py-0.5 rounded-full shadow-sm border border-charcoal-border/40">
          {categoryName}
        </span>
      </Link>

      {/* Product Details */}
      <div className="p-3.5 sm:p-4 flex flex-col flex-grow justify-between">
        <div>
          <Link href={`/product/${product.slug}`} className="block group-hover:text-brand transition-colors">
            <h3 className="text-xs sm:text-sm font-medium text-charcoal line-clamp-2 leading-snug">
              {product.name}
            </h3>
          </Link>
        </div>

        <div className="mt-3 pt-2.5 border-t border-charcoal-border/40 flex items-center justify-between gap-2">
          <div>
            <div className={`text-xs sm:text-sm font-bold ${isPriced ? 'text-charcoal' : 'text-brand'}`}>
              {formatPrice(product.price)}
            </div>
            {isPriced && product.sale_price && product.sale_price > (product.price || 0) && (
              <div className="text-[10px] sm:text-xs text-charcoal-muted line-through">
                {formatPrice(product.sale_price)}
              </div>
            )}
          </div>

          {isPriced ? (
            <button
              onClick={handleAddToCart}
              aria-label={`Add ${product.name} to cart`}
              className="inline-flex items-center justify-center p-2 sm:px-3 sm:py-1.5 bg-brand hover:bg-brand-dark text-white rounded-xl text-xs font-medium transition-colors shadow-sm"
            >
              <ShoppingBag className="w-3.5 h-3.5 sm:mr-1.5" />
              <span className="hidden sm:inline">Add</span>
            </button>
          ) : (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center justify-center p-2 sm:px-2.5 sm:py-1.5 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] rounded-xl text-xs font-semibold transition-colors"
              title="Enquire on WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5 sm:mr-1 text-[#25D366]" />
              <span className="hidden sm:inline">Enquire</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
