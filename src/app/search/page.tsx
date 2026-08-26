'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Sparkles } from 'lucide-react';
import MiniSearch from 'minisearch';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/lib/types';

function SearchPageContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<any[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [miniSearch, setMiniSearch] = useState<MiniSearch | null>(null);

  useEffect(() => {
    fetch('/search-index.json')
      .then((res) => res.json())
      .then((docs) => {
        const ms = new MiniSearch({
          fields: ['name', 'name_original', 'category'],
          storeFields: ['id', 'slug', 'name', 'category', 'price', 'imageStem'],
          searchOptions: {
            boost: { name: 3, category: 1.5, name_original: 1 },
            fuzzy: 0.2,
            prefix: true,
          },
        });
        ms.addAll(docs);
        setMiniSearch(ms);
        setAllProducts(docs);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching search index:', err);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!miniSearch) return;

    if (!query.trim()) {
      setResults(allProducts.slice(0, 24));
      return;
    }

    const hits = miniSearch.search(query, { combineWith: 'AND' });
    const hitIds = new Set(hits.map((h) => h.id));
    const matched = allProducts.filter((p) => hitIds.has(p.id));
    setResults(matched);
  }, [query, miniSearch, allProducts]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header Search Box */}
      <div className="max-w-2xl mx-auto text-center space-y-4">
        <h1 className="text-2xl sm:text-3xl font-black text-charcoal tracking-tight">Search Catalogue</h1>
        <p className="text-xs sm:text-sm text-charcoal-muted">
          Find rompers, welcome sets, blankets, feeding items, and accessories across all categories.
        </p>
        <div className="relative">
          <input
            type="text"
            placeholder="Search by keywords (e.g. starter set, romper, newborn)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full px-5 py-3.5 pl-12 bg-white rounded-2xl border border-charcoal-border/80 text-sm sm:text-base text-charcoal focus:outline-none focus:ring-2 focus:ring-brand shadow-soft"
          />
          <Search className="w-5 h-5 text-charcoal-muted absolute left-4 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Results Count & Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-sm font-bold text-charcoal uppercase tracking-wider">
            {query.trim() ? `Search Results for "${query}" (${results.length})` : `All Products (${results.length})`}
          </h2>
        </div>

        {isLoading ? (
          <div className="text-center py-20 text-charcoal-muted text-sm">
            <div className="animate-spin w-8 h-8 border-3 border-brand border-t-transparent rounded-full mx-auto mb-3" />
            <span>Loading product index...</span>
          </div>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
            {results.map((product) => (
              <ProductCard
                key={product.id}
                product={
                  {
                    id: product.id,
                    slug: product.slug,
                    name: product.name,
                    price: product.price,
                    currency: 'PKR',
                    stock: 10,
                    is_published: true,
                    attributes: {},
                    product_images: [{ r2_key: product.imageStem, is_primary: true }],
                    categories: { name: product.category, slug: '' },
                  } as any
                }
              />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center bg-white rounded-3xl border border-charcoal-border/60 p-8 shadow-soft max-w-lg mx-auto">
            <Sparkles className="w-10 h-10 text-charcoal-muted/50 mx-auto mb-3" />
            <h3 className="text-base font-bold text-charcoal">No products matched &quot;{query}&quot;</h3>
            <p className="text-xs text-charcoal-muted mt-1">
              Try searching with more general keywords or explore by category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-sm text-charcoal-muted">Loading search...</div>}>
      <SearchPageContent />
    </Suspense>
  );
}
