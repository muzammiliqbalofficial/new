'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Eye, ArrowRight, Clock } from 'lucide-react';
import { formatPrice, getR2ImageUrl } from '@/lib/formatters';

interface RecentItem {
  id: string;
  slug: string;
  name: string;
  price: number;
  imageStem: string;
  categoryName?: string;
}

const STORAGE_KEY = 'tinykids_recent_products_v1';

export function recordRecentlyViewed(item: RecentItem) {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    let items: RecentItem[] = raw ? JSON.parse(raw) : [];
    items = items.filter((i) => i.id !== item.id);
    items.unshift(item);
    items = items.slice(0, 8); // Keep top 8
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.warn('Failed to save recently viewed item', e);
  }
}

export default function RecentlyViewed({ currentProductId }: { currentProductId?: string }) {
  const [items, setItems] = useState<RecentItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: RecentItem[] = JSON.parse(raw);
        setItems(parsed.filter((i) => i.id !== currentProductId));
      }
    } catch (e) {
      console.warn('Failed to load recently viewed items', e);
    }
  }, [currentProductId]);

  if (items.length === 0) return null;

  return (
    <section className="space-y-4 pt-10 border-t border-charcoal-border/60">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-brand-soft text-brand flex items-center justify-center">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-extrabold text-charcoal tracking-tight">
              Recently Viewed by You
            </h3>
            <p className="text-[11px] text-charcoal-muted font-medium">Continue where you left off</p>
          </div>
        </div>

        <Link
          href="/products"
          className="text-xs font-bold text-brand hover:text-brand-dark transition-colors inline-flex items-center space-x-1"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {items.slice(0, 4).map((item) => (
          <Link
            key={item.id}
            href={`/product/${item.slug}`}
            className="p-3 bg-white rounded-3xl border border-charcoal-border/70 shadow-soft hover:shadow-hover hover:border-brand/40 transition-all flex flex-col justify-between group"
          >
            <div className="relative aspect-square rounded-2xl bg-cream-50 overflow-hidden mb-2.5">
              <Image
                src={getR2ImageUrl(item.imageStem, '300w')}
                alt={item.name}
                fill
                sizes="150px"
                className="object-contain p-2 group-hover:scale-105 transition-transform"
              />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-charcoal-muted uppercase block truncate">
                {item.categoryName || 'Baby Outfit'}
              </span>
              <h4 className="text-xs font-bold text-charcoal group-hover:text-brand line-clamp-1 transition-colors">
                {item.name}
              </h4>
              <span className="text-xs font-black text-charcoal block">
                {formatPrice(item.price)}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}