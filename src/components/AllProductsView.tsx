'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, SlidersHorizontal, ArrowUpDown, ChevronRight, X, Filter } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/lib/types';

interface Props {
  initialProducts: Product[];
}

const CATEGORY_OPTIONS = [
  { label: 'All Categories', slug: 'all' },
  { label: 'Starter Sets', slug: 'newborn-starter-sets' },
  { label: 'Rompers & Bodysuits', slug: 'bodysuits-rompers' },
  { label: 'Dresses & Frocks', slug: 'baby-dresses-frocks' },
  { label: 'Sweaters & Fleece', slug: 'sweaters-winter-fleece' },
  { label: 'Caps & Booties', slug: 'baby-caps-hats-socks' },
  { label: 'Tops & Bottoms', slug: 'tops-bottoms' },
  { label: 'Machine Embroidery', slug: 'machine-embroidery-customize' },
  { label: 'Printing Customize', slug: 'printing-customize' },
];

const GENDER_OPTIONS = [
  { label: 'All', value: 'all' },
  { label: 'Baby Boy (Baba)', value: 'boy' },
  { label: 'Baby Girl', value: 'girl' },
  { label: 'Unisex', value: 'unisex' },
];

const AGE_OPTIONS = [
  { label: 'All Ages', value: 'all' },
  { label: '0-3 Months', value: '0-3' },
  { label: '3-6 Months', value: '3-6' },
  { label: '6-12 Months', value: '6-12' },
  { label: '12-24 Months', value: '12-24' },
];

const PRICE_OPTIONS = [
  { label: 'All Prices', value: 'all' },
  { label: 'Under Rs. 1,000', value: 'under-1000' },
  { label: 'Rs. 1,000 - Rs. 2,000', value: '1000-2000' },
  { label: 'Above Rs. 2,000', value: 'above-2000' },
];

export default function AllProductsView({ initialProducts }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedGender, setSelectedGender] = useState('all');
  const [selectedAge, setSelectedAge] = useState('all');
  const [selectedPrice, setSelectedPrice] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    let list = [...initialProducts];

    // 1. Text search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.slug.toLowerCase().includes(q) ||
          (p.brand && p.brand.toLowerCase().includes(q))
      );
    }

    // 2. Category filter
    if (selectedCategory !== 'all') {
      list = list.filter((p) => {
        const catObj: any = p.categories;
        const catSlug = Array.isArray(catObj) ? catObj[0]?.slug : catObj?.slug;
        return catSlug === selectedCategory;
      });
    }

    // 3. Gender filter
    if (selectedGender !== 'all') {
      list = list.filter((p) => {
        const nameLower = p.name.toLowerCase();
        if (selectedGender === 'boy') {
          return nameLower.includes('baba') || nameLower.includes('boy') || nameLower.includes('prince');
        } else if (selectedGender === 'girl') {
          return nameLower.includes('girl') || nameLower.includes('frok') || nameLower.includes('frock') || nameLower.includes('princess');
        } else if (selectedGender === 'unisex') {
          return !nameLower.includes('girl') && !nameLower.includes('baba') || nameLower.includes('unisex');
        }
        return true;
      });
    }

    // 4. Age filter
    if (selectedAge !== 'all') {
      list = list.filter((p) => {
        const nameLower = p.name.toLowerCase();
        if (selectedAge === '0-3') {
          return nameLower.includes('0-3') || nameLower.includes('0 to 3') || nameLower.includes('newborn');
        } else if (selectedAge === '3-6') {
          return nameLower.includes('3-6') || nameLower.includes('3 to 6') || nameLower.includes('0-6') || nameLower.includes('0 to 6');
        } else if (selectedAge === '6-12') {
          return nameLower.includes('6-12') || nameLower.includes('6 to 12') || nameLower.includes('0-12') || nameLower.includes('0 to 12');
        } else if (selectedAge === '12-24') {
          return nameLower.includes('12-24') || nameLower.includes('1-2') || nameLower.includes('2 year');
        }
        return true;
      });
    }

    // 5. Price filter
    if (selectedPrice !== 'all') {
      list = list.filter((p) => {
        const price = p.price || 0;
        if (selectedPrice === 'under-1000') return price < 1000;
        if (selectedPrice === '1000-2000') return price >= 1000 && price <= 2000;
        if (selectedPrice === 'above-2000') return price > 2000;
        return true;
      });
    }

    // 6. Sort
    if (sortBy === 'price-low') {
      list.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortBy === 'price-high') {
      list.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sortBy === 'discount') {
      list.sort((a, b) => {
        const discA = a.sale_price && a.price ? (a.sale_price - a.price) / a.sale_price : 0;
        const discB = b.sale_price && b.price ? (b.sale_price - b.price) / b.sale_price : 0;
        return discB - discA;
      });
    }

    return list;
  }, [initialProducts, searchQuery, selectedCategory, selectedGender, selectedAge, selectedPrice, sortBy]);

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    selectedGender !== 'all' ||
    selectedAge !== 'all' ||
    selectedPrice !== 'all' ||
    searchQuery.trim() !== '';

  const clearFilters = () => {
    setSelectedCategory('all');
    setSelectedGender('all');
    setSelectedAge('all');
    setSelectedPrice('all');
    setSearchQuery('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-xs text-charcoal-muted font-medium">
        <Link href="/" className="hover:text-brand transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-charcoal-muted/60" />
        <span className="text-charcoal font-semibold">All Baby Products</span>
      </nav>

      {/* Header */}
      <div className="border-b border-charcoal-border/60 pb-6 space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-charcoal tracking-tight">
          Baby Clothes & Outfits Collection
        </h1>
        <p className="text-xs sm:text-sm text-charcoal-muted max-w-2xl leading-relaxed font-medium">
          Explore all {initialProducts.length} newborn baby starter sets, cotton rompers, dresses, and accessories with nationwide Cash on Delivery across Pakistan.
        </p>
      </div>

      {/* Search & Top Controls */}
      <div className="space-y-4">
        {/* Category Pills Bar */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 no-scrollbar">
          {CATEGORY_OPTIONS.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat.slug
                  ? 'bg-brand text-white shadow-card scale-100'
                  : 'bg-white text-charcoal-light hover:text-charcoal border border-charcoal-border/70 hover:bg-cream-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Multi-Filter Bar */}
        <div className="bg-white p-4 rounded-3xl border border-charcoal-border/70 shadow-soft space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-charcoal-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, romper, set..."
                className="w-full pl-10 pr-4 py-2 bg-cream-50 rounded-xl border border-charcoal-border/80 text-xs focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-muted hover:text-charcoal"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Quick Count & Sort Dropdown */}
            <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto space-x-3 text-xs">
              <span className="text-charcoal-muted font-bold whitespace-nowrap">
                Showing <strong className="text-charcoal">{filteredProducts.length}</strong> Products
              </span>

              <div className="flex items-center space-x-1.5">
                <ArrowUpDown className="w-3.5 h-3.5 text-charcoal-muted" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 bg-cream-50 rounded-xl border border-charcoal-border/80 text-xs font-bold text-charcoal focus:outline-none focus:ring-2 focus:ring-brand/30"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="discount">Biggest Discount</option>
                </select>
              </div>
            </div>
          </div>

          {/* Filter Dropdowns (Gender, Age, Price) */}
          <div className="pt-3 border-t border-charcoal-border/50 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            {/* Gender Filter */}
            <div className="space-y-1">
              <span className="font-extrabold text-charcoal text-[11px] block">Boy / Girl / Unisex:</span>
              <select
                value={selectedGender}
                onChange={(e) => setSelectedGender(e.target.value)}
                className="w-full px-3 py-2 bg-cream-50 rounded-xl border border-charcoal-border/80 text-xs font-semibold text-charcoal focus:outline-none focus:ring-2 focus:ring-brand/30"
              >
                {GENDER_OPTIONS.map((g) => (
                  <option key={g.value} value={g.value}>
                    {g.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Age Filter */}
            <div className="space-y-1">
              <span className="font-extrabold text-charcoal text-[11px] block">Shop by Age:</span>
              <select
                value={selectedAge}
                onChange={(e) => setSelectedAge(e.target.value)}
                className="w-full px-3 py-2 bg-cream-50 rounded-xl border border-charcoal-border/80 text-xs font-semibold text-charcoal focus:outline-none focus:ring-2 focus:ring-brand/30"
              >
                {AGE_OPTIONS.map((a) => (
                  <option key={a.value} value={a.value}>
                    {a.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Filter */}
            <div className="space-y-1">
              <span className="font-extrabold text-charcoal text-[11px] block">Price Range:</span>
              <select
                value={selectedPrice}
                onChange={(e) => setSelectedPrice(e.target.value)}
                className="w-full px-3 py-2 bg-cream-50 rounded-xl border border-charcoal-border/80 text-xs font-semibold text-charcoal focus:outline-none focus:ring-2 focus:ring-brand/30"
              >
                {PRICE_OPTIONS.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Reset Filters Button */}
            <div className="flex items-end">
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="w-full py-2 px-3 bg-cream-100 hover:bg-cream-200 text-charcoal font-bold text-xs rounded-xl border border-charcoal-border/70 transition-colors flex items-center justify-center space-x-1"
                >
                  <X className="w-3.5 h-3.5 text-coral" />
                  <span>Clear Filters</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="py-20 text-center space-y-4 bg-white rounded-3xl border border-charcoal-border/70 p-8 shadow-soft">
          <div className="w-16 h-16 bg-cream-100 rounded-full flex items-center justify-center mx-auto text-charcoal-muted">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-charcoal">No Products Match Your Filters</h3>
          <p className="text-xs text-charcoal-muted max-w-sm mx-auto">
            Try resetting your filters or search keywords to view all available baby outfits.
          </p>
          <button
            onClick={clearFilters}
            className="px-6 py-2.5 bg-brand text-white rounded-xl text-xs font-bold shadow-card hover:bg-brand-dark transition-all"
          >
            Show All Products
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
