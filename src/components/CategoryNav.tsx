'use client';

import React from 'react';
import Link from 'next/link';
import { LayoutGrid } from 'lucide-react';
import { Category } from '@/lib/types';

interface Props {
  categories: Category[];
  currentSlug?: string;
}

export default function CategoryNav({ categories, currentSlug }: Props) {
  if (!categories || categories.length === 0) return null;

  return (
    <div className="bg-white/90 border-b border-charcoal-border/50 sticky top-16 sm:top-20 z-30 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-start md:justify-center space-x-2 py-3 overflow-x-auto no-scrollbar scrollbar-none">
          <Link
            href="/"
            className={`flex-shrink-0 inline-flex items-center space-x-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all ${
              !currentSlug
                ? 'bg-brand text-white shadow-xs'
                : 'bg-cream-100/90 text-charcoal hover:bg-cream-200 border border-charcoal-border/50'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>All Clothing</span>
          </Link>

          {categories.map((cat) => {
            const isActive = currentSlug === cat.slug;
            return (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-brand text-white shadow-xs'
                    : 'bg-cream-100/90 text-charcoal-light hover:text-charcoal hover:bg-cream-200 border border-charcoal-border/50'
                }`}
              >
                {cat.name}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
