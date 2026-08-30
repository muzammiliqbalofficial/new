'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, X, ShoppingBag, ArrowRight } from 'lucide-react';
import MiniSearch from 'minisearch';
import { formatPrice, getR2ImageUrl } from '@/lib/formatters';

interface SearchDoc {
  id: string;
  slug: string;
  name: string;
  name_original?: string;
  category: string;
  price: number | null;
  imageStem: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchDoc[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const miniSearchRef = useRef<MiniSearch<SearchDoc> | null>(null);
  const docsRef = useRef<Map<string, SearchDoc>>(new Map());
  const inputRef = useRef<HTMLInputElement>(null);

  // Load search index on first open
  useEffect(() => {
    if (!isOpen) return;

    // Focus input on open
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);

    if (!miniSearchRef.current) {
      setIsLoading(true);
      fetch('/search-index.json')
        .then((res) => res.json())
        .then((data: SearchDoc[]) => {
          const ms = new MiniSearch<SearchDoc>({
            fields: ['name', 'name_original', 'category'],
            storeFields: ['id', 'slug', 'name', 'category', 'price', 'imageStem'],
            searchOptions: {
              boost: { name: 3, category: 1.5, name_original: 1 },
              fuzzy: 0.2,
              prefix: true,
            },
          });

          ms.addAll(data);
          miniSearchRef.current = ms;

          const docMap = new Map<string, SearchDoc>();
          data.forEach((d) => docMap.set(d.id, d));
          docsRef.current = docMap;
          setIsLoading(false);
        })
        .catch((err) => {
          console.error('Error fetching search index:', err);
          setIsLoading(false);
        });
    }
  }, [isOpen]);

  // Handle Search Query
  useEffect(() => {
    if (!query.trim() || !miniSearchRef.current) {
      setResults([]);
      return;
    }

    const searchHits = miniSearchRef.current.search(query, {
      combineWith: 'AND',
    });

    const matchedDocs = searchHits.slice(0, 10).map((hit) => {
      return (
        docsRef.current.get(hit.id) || {
          id: hit.id,
          slug: hit.slug,
          name: hit.name,
          category: hit.category,
          price: hit.price,
          imageStem: hit.imageStem,
        }
      );
    });

    setResults(matchedDocs);
  }, [query]);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-charcoal/60 backdrop-blur-sm flex items-start justify-center p-3 sm:p-6 pt-12 sm:pt-20">
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-charcoal-border/80 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 sm:px-6 py-4 border-b border-charcoal-border/60 bg-cream-50">
          <Search className="w-5 h-5 text-charcoal-muted mr-3 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search baby rompers, starter sets, toys, blankets..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm sm:text-base text-charcoal placeholder:text-charcoal-muted/70 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-charcoal-muted hover:text-charcoal mr-2"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2.5 py-1 text-xs font-semibold text-charcoal-muted hover:text-charcoal bg-cream-200/80 rounded-lg hover:bg-cream-300/80 transition-colors"
          >
            ESC
          </button>
        </div>

        {/* Search Content / Results */}
        <div className="max-h-[60vh] overflow-y-auto p-4 sm:p-6">
          {isLoading ? (
            <div className="text-center py-10 text-charcoal-muted text-sm">
              <div className="animate-spin w-6 h-6 border-2 border-brand border-t-transparent rounded-full mx-auto mb-2" />
              Loading products index...
            </div>
          ) : query.trim() && results.length > 0 ? (
            <div className="divide-y divide-charcoal-border/40">
              {results.map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.slug}`}
                  onClick={onClose}
                  className="flex items-center justify-between p-3 rounded-2xl hover:bg-cream-100/80 transition-colors group"
                >
                  <div className="flex items-center space-x-3.5 min-w-0 pr-4">
                    <div className="relative w-12 h-12 rounded-xl bg-cream-200 overflow-hidden flex-shrink-0 border border-charcoal-border/50">
                      <Image
                        src={getR2ImageUrl(product.imageStem, '300w')}
                        alt={product.name}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-brand font-medium truncate">{product.category}</p>
                      <h4 className="text-sm font-semibold text-charcoal group-hover:text-brand transition-colors truncate">
                        {product.name}
                      </h4>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 flex items-center space-x-3">
                    <span className="text-sm font-bold text-charcoal">
                      {formatPrice(product.price)}
                    </span>
                    <ArrowRight className="w-4 h-4 text-charcoal-muted group-hover:text-brand transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              ))}
            </div>
          ) : query.trim() && results.length === 0 ? (
            <div className="text-center py-12 text-charcoal-muted">
              <ShoppingBag className="w-10 h-10 mx-auto text-charcoal-muted/50 mb-3" />
              <p className="text-sm font-medium text-charcoal">No products found for &quot;{query}&quot;</p>
              <p className="text-xs text-charcoal-muted mt-1">Try searching for keywords like romper, baby, newborn, cotton...</p>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-xs font-semibold text-charcoal-muted uppercase tracking-wider mb-4">
                Popular Searches
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {['Romper', 'Welcome Set', 'Body Suit', 'Blanket', 'Newborn Starter Set', 'Bibs', 'Feeding'].map(
                  (term) => (
                    <button
                      key={term}
                      onClick={() => setQuery(term)}
                      className="px-3.5 py-1.5 bg-cream-100 hover:bg-brand/10 hover:text-brand text-xs font-medium text-charcoal rounded-full transition-colors border border-charcoal-border/50"
                    >
                      {term}
                    </button>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
