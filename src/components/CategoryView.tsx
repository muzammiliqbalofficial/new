'use client';

import React, { useState, useMemo } from 'react';
import { SlidersHorizontal, ArrowUpDown, X, Sparkles } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { Product, Category } from '@/lib/types';

interface Props {
  category: Category;
  initialProducts: Product[];
}

export default function CategoryView({ category, initialProducts }: Props) {
  const [selectedAge, setSelectedAge] = useState<string>('all');
  const [selectedGender, setSelectedGender] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('default');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const ITEMS_PER_PAGE = 24;

  // Extract distinct age and gender options from initial products
  const ageOptions = useMemo(() => {
    const set = new Set<string>();
    initialProducts.forEach((p) => {
      const age = p.attributes?.['Recommended Age'];
      if (age) set.add(age);
    });
    return Array.from(set).sort();
  }, [initialProducts]);

  const genderOptions = useMemo(() => {
    const set = new Set<string>();
    initialProducts.forEach((p) => {
      const gender = p.attributes?.['Recommended Gender'];
      if (gender) set.add(gender);
    });
    return Array.from(set).sort();
  }, [initialProducts]);

  // Filter and Sort Products
  const filteredProducts = useMemo(() => {
    let list = [...initialProducts];

    // Filter Age
    if (selectedAge !== 'all') {
      list = list.filter((p) => p.attributes?.['Recommended Age'] === selectedAge);
    }

    // Filter Gender
    if (selectedGender !== 'all') {
      list = list.filter((p) => p.attributes?.['Recommended Gender'] === selectedGender);
    }

    // Sort
    if (sortBy === 'name-asc') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'name-desc') {
      list.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortBy === 'price-low') {
      list.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
    } else if (sortBy === 'price-high') {
      list.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
    }

    return list;
  }, [initialProducts, selectedAge, selectedGender, sortBy]);

  // Pagination slice
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const resetFilters = () => {
    setSelectedAge('all');
    setSelectedGender('all');
    setSortBy('default');
    setCurrentPage(1);
  };

  const hasActiveFilters = selectedAge !== 'all' || selectedGender !== 'all' || sortBy !== 'default';

  return (
    <div className="space-y-6">
      {/* Category Header Bar */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-charcoal-border/70 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-brand uppercase tracking-wider block mb-1">
            Category Collection
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-charcoal tracking-tight">
            {category.name}
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-muted mt-1">
            Showing {filteredProducts.length} items
          </p>
        </div>

        {/* Filter / Sort Control Strip */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            className="md:hidden inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-cream-100 border border-charcoal-border text-xs font-semibold text-charcoal hover:bg-cream-200"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters {hasActiveFilters && '•'}</span>
          </button>

          {/* Desktop Age Dropdown */}
          {ageOptions.length > 0 && (
            <div className="hidden md:block">
              <select
                value={selectedAge}
                onChange={(e) => {
                  setSelectedAge(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3.5 py-2 bg-cream-50 border border-charcoal-border/80 rounded-xl text-xs font-medium text-charcoal focus:outline-none focus:ring-1 focus:ring-brand"
              >
                <option value="all">Age: All Ages</option>
                {ageOptions.map((age) => (
                  <option key={age} value={age}>
                    Age: {age}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Desktop Gender Dropdown */}
          {genderOptions.length > 0 && (
            <div className="hidden md:block">
              <select
                value={selectedGender}
                onChange={(e) => {
                  setSelectedGender(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3.5 py-2 bg-cream-50 border border-charcoal-border/80 rounded-xl text-xs font-medium text-charcoal focus:outline-none focus:ring-1 focus:ring-brand"
              >
                <option value="all">Gender: All</option>
                {genderOptions.map((gender) => (
                  <option key={gender} value={gender}>
                    Gender: {gender}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3.5 py-2 bg-cream-50 border border-charcoal-border/80 rounded-xl text-xs font-medium text-charcoal focus:outline-none focus:ring-1 focus:ring-brand"
            >
              <option value="default">Sort by: Featured</option>
              <option value="name-asc">Name: A to Z</option>
              <option value="name-desc">Name: Z to A</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="px-3 py-2 text-xs font-medium text-coral hover:text-coral-dark flex items-center space-x-1"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {isMobileFilterOpen && (
        <div className="md:hidden bg-white p-4 rounded-2xl border border-charcoal-border shadow-soft space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between pb-2 border-b border-charcoal-border/50">
            <span className="font-bold text-xs text-charcoal uppercase">Filter Options</span>
            <button onClick={() => setIsMobileFilterOpen(false)} className="text-charcoal-muted">
              <X className="w-4 h-4" />
            </button>
          </div>
          {ageOptions.length > 0 && (
            <div>
              <label className="text-[11px] font-semibold text-charcoal-muted block mb-1">Recommended Age</label>
              <select
                value={selectedAge}
                onChange={(e) => setSelectedAge(e.target.value)}
                className="w-full p-2 text-xs bg-cream-50 border border-charcoal-border rounded-xl"
              >
                <option value="all">All Ages</option>
                {ageOptions.map((age) => (
                  <option key={age} value={age}>
                    {age}
                  </option>
                ))}
              </select>
            </div>
          )}
          {genderOptions.length > 0 && (
            <div>
              <label className="text-[11px] font-semibold text-charcoal-muted block mb-1">Recommended Gender</label>
              <select
                value={selectedGender}
                onChange={(e) => setSelectedGender(e.target.value)}
                className="w-full p-2 text-xs bg-cream-50 border border-charcoal-border rounded-xl"
              >
                <option value="all">All Genders</option>
                {genderOptions.map((gender) => (
                  <option key={gender} value={gender}>
                    {gender}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}

      {/* Product Grid */}
      {paginatedProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
          {paginatedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center bg-white rounded-3xl border border-charcoal-border/60 p-8 shadow-soft">
          <Sparkles className="w-10 h-10 text-charcoal-muted/40 mx-auto mb-3" />
          <h3 className="text-base font-bold text-charcoal">No products match your filter</h3>
          <p className="text-xs text-charcoal-muted mt-1 max-w-sm mx-auto">
            Try adjusting your age or gender filters to see available products in this category.
          </p>
          <button
            onClick={resetFilters}
            className="mt-5 px-5 py-2.5 bg-brand text-white text-xs font-semibold rounded-xl hover:bg-brand-dark transition-colors shadow-sm"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2 pt-8">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-white border border-charcoal-border disabled:opacity-40 hover:bg-cream-100 transition-colors"
          >
            Previous
          </button>
          <div className="flex items-center space-x-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`w-8 h-8 rounded-xl text-xs font-semibold transition-all ${
                  currentPage === pageNum
                    ? 'bg-brand text-white shadow-xs'
                    : 'bg-white text-charcoal hover:bg-cream-100 border border-charcoal-border/60'
                }`}
              >
                {pageNum}
              </button>
            ))}
          </div>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-white border border-charcoal-border disabled:opacity-40 hover:bg-cream-100 transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
