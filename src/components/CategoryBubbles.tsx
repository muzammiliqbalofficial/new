'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface BubbleCategory {
  title: string;
  slug: string;
  image: string;
  badge?: string;
}

const CATEGORIES: BubbleCategory[] = [
  {
    title: 'Starter Sets',
    slug: 'newborn-starter-sets',
    image: 'https://pub-4327055644f945ce92583334944f4675.r2.dev/496335818-1-1df0f6c5-700w.webp',
    badge: 'Popular',
  },
  {
    title: 'Rompers',
    slug: 'bodysuits-rompers',
    image: 'https://pub-4327055644f945ce92583334944f4675.r2.dev/521743516-1-d6ae93bc-700w.webp',
    badge: 'Must-Have',
  },
  {
    title: 'Baby Dresses',
    slug: 'baby-dresses-frocks',
    image: 'https://pub-4327055644f945ce92583334944f4675.r2.dev/533319084-1-8f4b008d-700w.webp',
  },
  {
    title: 'Sweaters & Fleece',
    slug: 'sweaters-winter-fleece',
    image: 'https://pub-4327055644f945ce92583334944f4675.r2.dev/496351052-1-87224215-700w.webp',
  },
  {
    title: 'Caps & Booties',
    slug: 'baby-caps-hats-socks',
    image: 'https://pub-4327055644f945ce92583334944f4675.r2.dev/524888769-1-e4070a7b-700w.webp',
  },
  {
    title: 'Tops & Sets',
    slug: 'tops-bottoms',
    image: 'https://pub-4327055644f945ce92583334944f4675.r2.dev/532392500-1-6d0e9803-700w.webp',
  },
];

export default function CategoryBubbles() {
  return (
    <section className="py-6 sm:py-8 bg-cream-50/70 border-y border-charcoal-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-coral block">
              Curated Collections
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-charcoal tracking-tight">
              Shop by Category
            </h2>
          </div>
          <Link
            href="/category/newborn-starter-sets"
            className="text-xs font-bold text-brand hover:text-brand-dark transition-colors"
          >
            View All →
          </Link>
        </div>

        {/* Horizontal Bubble Scroll */}
        <div className="flex space-x-4 sm:space-x-8 overflow-x-auto pb-3 pt-1 scrollbar-none no-scrollbar justify-start sm:justify-center">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="flex flex-col items-center group flex-shrink-0 focus:outline-none"
            >
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full p-1 bg-white border-2 border-charcoal-border/70 group-hover:border-brand transition-all duration-300 shadow-soft group-hover:shadow-card group-hover:scale-105">
                <div className="relative w-full h-full rounded-full overflow-hidden bg-cream-100/50 flex items-center justify-center">
                  <Image
                    src={cat.image}
                    alt={`${cat.title} - Newborn Baby Clothes Pakistan`}
                    fill
                    sizes="96px"
                    className="object-contain p-1.5 transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                {cat.badge && (
                  <span className="absolute -top-1 -right-1 bg-coral text-white text-[9px] font-black px-1.5 py-0.5 rounded-full shadow-xs uppercase tracking-tighter">
                    {cat.badge}
                  </span>
                )}
              </div>
              <span className="mt-2 text-xs font-bold text-charcoal group-hover:text-brand transition-colors text-center max-w-[90px] leading-tight">
                {cat.title}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
