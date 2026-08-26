'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, SlidersHorizontal, ArrowUpDown, ChevronRight, Sparkles } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/lib/types';

interface Props {
  initialProducts: Product[];
}

const CATEGORY_FILTERS = [
  { label: 'All Items', slug: 'all' },
  { label: '🍼 Starter Sets', slug: 'newborn-starter-sets' },
  { label: '👶 Rompers', slug: 'bodysuits-rompers' },
  { label: '👗 Dresses & Frocks', slug: 'baby-dresses-frocks' },
  { label: '🧶 Sweaters', slug: 'sweaters-winter-fleece' },
  { label: '🧢 Caps & Booties', slug: 'baby-caps-hats-socks' },
  { label: '👕 Tops & Sets', slug: 'tops-bottoms' },
];

export default function AllProductsView({ initialProducts }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredProducts = useMemo(() => {
    let list = [...initialProducts];

    // 1. Filter by category
    if (selectedCategory !== 'all') {
      list = list.filter((p) => p.categories?.slug === selectedCategory);
    }

    // 2. Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.slug.toLowerCase().includes(q) ||
          p.categories?.name.toLowerCase().includes(q)
      );
    }

    // 3. Sort
    if (sortBy === 'price-low') {
      list.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortBy === 'price-high') {
      list.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sortBy === 'discount') {
      list.sort((a, b) => {
        const discA = a.sale_price ? a.sale_price - (a.price || 0) : 0;
        const discB = b.sale_price ? b.sale_price - (b.price || 0) : 0;
        return discB - discA;
      });
    }

    return list;
  }, [initialProducts, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="space-y-8 pb-16">
      {/* Breadcrumb Navigation */}
      <div className="bg-cream-50/80 border-b border-charcoal-border/50 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-2 text-xs font-semibold text-charcoal-muted">
            <Link href="/" className="hover:text-charcoal transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-charcoal font-bold">All Baby Products</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Page Title & Count */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-charcoal-border/50 pb-6">
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-coral block mb-1">
              Complete Baby Collection
            </span>
            <h1 className="text-2xl sm:text-4xl font-black text-charcoal tracking-tight">
              All Baby Clothes & Essentials
            </h1>
            <p className="text-xs sm:text-sm text-charcoal-muted mt-1">
              Showing {filteredProducts.length} items • 100% Pure Combed Cotton • Cash on Delivery Nationwide
            </p>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center space-x-2 self-start sm:self-auto">
            <ArrowUpDown className="w-4 h-4 text-charcoal-muted" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3.5 py-2 bg-cream-50 rounded-xl border border-charcoal-border/80 text-xs font-bold text-charcoal focus:outline-none focus:ring-2 focus:ring-brand/30"
            >
              <option value="featured">Featured / Best Matches</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="discount">Biggest Discounts</option>
            </select>
          </div>
        </div>

        {/* Filter Controls Row */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Category Filter Pills */}
          <div className="flex space-x-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none no-scrollbar">
            {CATEGORY_FILTERS.map((filter) => {
              const isActive = selectedCategory === filter.slug;
              return (
                <button
                  key={filter.slug}
                  onClick={() => setSelectedCategory(filter.slug)}
                  className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-charcoal text-white shadow-soft scale-102'
                      : 'bg-cream-100/70 text-charcoal-light hover:bg-cream-200/80 hover:text-charcoal'
                  }`}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search in all products..."
              className="w-full pl-9 pr-4 py-2 bg-cream-50 rounded-2xl border border-charcoal-border/80 text-xs focus:outline-none focus:ring-2 focus:ring-brand/30"
            />
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="py-16 text-center space-y-4 bg-cream-50/50 rounded-3xl border border-charcoal-border/60">
            <Sparkles className="w-10 h-10 text-charcoal-muted mx-auto" />
            <h3 className="text-base font-bold text-charcoal">No matching products found</h3>
            <p className="text-xs text-charcoal-muted max-w-sm mx-auto">
              Try adjusting your category filter or search query to find baby clothes.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="px-5 py-2 bg-brand text-white text-xs font-bold rounded-xl shadow-xs"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {filteredProducts.map((product, idx) => (
              <ProductCard key={product.id} product={product} priority={idx < 8} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
