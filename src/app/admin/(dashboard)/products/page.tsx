'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { Search, Plus, Eye, EyeOff, Loader2, X } from 'lucide-react';
import { adminSupabase } from '@/lib/supabase-admin-client';
import { resolveMainImage } from '@/lib/formatters';
import { Product, Category } from '@/lib/types';
import InlineNumberField from '@/components/admin/InlineNumberField';

type QuickFilter = 'all' | 'out-of-stock' | 'no-price' | 'hidden';

export default function AdminProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-6 h-6 animate-spin text-brand" />
        </div>
      }
    >
      <AdminProductsPageContent />
    </Suspense>
  );
}

function AdminProductsPageContent() {
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState<string>('all');
  const [quickFilter, setQuickFilter] = useState<QuickFilter>(
    (searchParams.get('filter') as QuickFilter) || 'all'
  );
  const [setPricesMode, setSetPricesMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkOpen, setBulkOpen] = useState<'publish' | 'price' | null>(null);
  const [priceAdjustType, setPriceAdjustType] = useState<'percent' | 'fixed'>('percent');
  const [priceAdjustValue, setPriceAdjustValue] = useState('');
  const [isBulkSaving, setIsBulkSaving] = useState(false);

  async function loadProducts() {
    const [prodRes, catRes] = await Promise.all([
      adminSupabase
        .from('products')
        .select(
          'id, slug, name, price, sale_price, stock, is_published, category_id, categories(id,name,slug), product_images(id,r2_key,is_primary,is_white_background,is_description_image)'
        )
        .is('deleted_at', null)
        .order('created_at', { ascending: false }),
      adminSupabase.from('categories').select('id, name, slug').order('sort_order'),
    ]);
    setProducts((prodRes.data as unknown as Product[]) ?? []);
    setCategories((catRes.data as Category[]) ?? []);
    setIsLoading(false);
  }

  useEffect(() => {
    loadProducts();
  }, []);

  const filtered = useMemo(() => {
    let list = products;
    if (setPricesMode) {
      return list.filter((p) => p.price === null);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q));
    }
    if (categoryId !== 'all') {
      list = list.filter((p) => p.category_id === categoryId);
    }
    if (quickFilter === 'out-of-stock') list = list.filter((p) => p.stock <= 0);
    if (quickFilter === 'no-price') list = list.filter((p) => p.price === null);
    if (quickFilter === 'hidden') list = list.filter((p) => !p.is_published);
    return list;
  }, [products, search, categoryId, quickFilter, setPricesMode]);

  async function updateProduct(id: string, patch: Partial<Product>) {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
    await adminSupabase.from('products').update(patch).eq('id', id);
  }

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function applyBulkPublish(publish: boolean) {
    setIsBulkSaving(true);
    const ids = Array.from(selectedIds);
    await adminSupabase.from('products').update({ is_published: publish }).in('id', ids);
    setProducts((prev) => prev.map((p) => (ids.includes(p.id) ? { ...p, is_published: publish } : p)));
    setIsBulkSaving(false);
    setSelectedIds(new Set());
    setBulkOpen(null);
  }

  async function applyBulkPriceAdjust() {
    const value = Number(priceAdjustValue);
    if (isNaN(value) || priceAdjustValue.trim() === '') return;
    setIsBulkSaving(true);
    const ids = Array.from(selectedIds);
    const targets = products.filter((p) => ids.includes(p.id) && p.price !== null);

    await Promise.all(
      targets.map((p) => {
        const newPrice =
          priceAdjustType === 'percent'
            ? Math.round((p.price as number) * (1 + value / 100))
            : Math.max(0, (p.price as number) + value);
        return adminSupabase.from('products').update({ price: newPrice }).eq('id', p.id);
      })
    );

    setProducts((prev) =>
      prev.map((p) => {
        if (!ids.includes(p.id) || p.price === null) return p;
        const newPrice =
          priceAdjustType === 'percent'
            ? Math.round(p.price * (1 + value / 100))
            : Math.max(0, p.price + value);
        return { ...p, price: newPrice };
      })
    );

    setIsBulkSaving(false);
    setSelectedIds(new Set());
    setBulkOpen(null);
    setPriceAdjustValue('');
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-6 h-6 animate-spin text-brand" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-4 pb-24">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl font-bold text-charcoal">Products</h1>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-1.5 h-10 px-4 rounded-lg bg-brand text-white text-sm font-semibold"
        >
          <Plus className="w-4 h-4" />
          Naya
        </Link>
      </div>

      <button
        onClick={() => {
          setSetPricesMode((v) => !v);
          setSelectedIds(new Set());
        }}
        className={`w-full h-11 rounded-xl text-sm font-semibold border transition ${
          setPricesMode
            ? 'bg-coral text-white border-coral'
            : 'bg-coral-soft text-coral-dark border-coral/30'
        }`}
      >
        {setPricesMode
          ? 'Set Prices mode band karein'
          : `Price Set Karein (${products.filter((p) => p.price === null).length} products)`}
      </button>

      {!setPricesMode && (
        <>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-muted" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Product dhoondein…"
              className="w-full h-11 pl-10 pr-4 rounded-xl border border-charcoal-border focus:border-brand focus:ring-2 focus:ring-brand-soft outline-none text-sm"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="h-10 px-3 rounded-lg border border-charcoal-border text-sm shrink-0 bg-white"
            >
              <option value="all">Sab Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            {(
              [
                { key: 'all', label: 'Sab' },
                { key: 'out-of-stock', label: 'Stock khatam' },
                { key: 'no-price', label: 'Price nahi hai' },
                { key: 'hidden', label: 'Hidden' },
              ] as { key: QuickFilter; label: string }[]
            ).map((f) => (
              <button
                key={f.key}
                onClick={() => setQuickFilter(f.key)}
                className={`h-10 px-3 rounded-lg text-sm font-medium shrink-0 border ${
                  quickFilter === f.key
                    ? 'bg-brand text-white border-brand'
                    : 'bg-white text-charcoal-light border-charcoal-border'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </>
      )}

      {setPricesMode ? (
        <div className="bg-white rounded-2xl shadow-soft divide-y divide-charcoal-border">
          {filtered.length === 0 ? (
            <p className="p-6 text-center text-charcoal-muted text-sm">Sab products ki price set ho chuki hai 🎉</p>
          ) : (
            filtered.map((p) => (
              <div key={p.id} className="flex items-center gap-3 px-4 py-3">
                <span className="flex-1 text-sm text-charcoal truncate">{p.name}</span>
                <InlineNumberField
                  value={p.price}
                  placeholder="Rs."
                  onSave={(v) => updateProduct(p.id, { price: v })}
                />
              </div>
            ))
          )}
        </div>
      ) : (
        <>
          {selectedIds.size > 0 && (
            <div className="sticky top-0 z-30 bg-charcoal text-white rounded-xl px-4 py-3 flex items-center gap-3 flex-wrap">
              <span className="text-sm font-medium">{selectedIds.size} select kiye</span>
              <button
                onClick={() => applyBulkPublish(true)}
                disabled={isBulkSaving}
                className="h-9 px-3 rounded-lg bg-white/15 text-sm font-medium flex items-center gap-1.5"
              >
                <Eye className="w-4 h-4" /> Dikhayein
              </button>
              <button
                onClick={() => applyBulkPublish(false)}
                disabled={isBulkSaving}
                className="h-9 px-3 rounded-lg bg-white/15 text-sm font-medium flex items-center gap-1.5"
              >
                <EyeOff className="w-4 h-4" /> Chupayein
              </button>
              <button
                onClick={() => setBulkOpen(bulkOpen === 'price' ? null : 'price')}
                className="h-9 px-3 rounded-lg bg-white/15 text-sm font-medium"
              >
                Price Adjust
              </button>
              <button onClick={() => setSelectedIds(new Set())} className="ml-auto p-1.5">
                <X className="w-4 h-4" />
              </button>

              {bulkOpen === 'price' && (
                <div className="w-full flex items-center gap-2 pt-2 border-t border-white/20">
                  <select
                    value={priceAdjustType}
                    onChange={(e) => setPriceAdjustType(e.target.value as 'percent' | 'fixed')}
                    className="h-9 px-2 rounded-lg text-charcoal text-sm"
                  >
                    <option value="percent">%</option>
                    <option value="fixed">Rs. (fixed)</option>
                  </select>
                  <input
                    type="number"
                    value={priceAdjustValue}
                    onChange={(e) => setPriceAdjustValue(e.target.value)}
                    placeholder={priceAdjustType === 'percent' ? 'e.g. 10 ya -10' : 'e.g. 50 ya -50'}
                    className="h-9 flex-1 px-2 rounded-lg text-charcoal text-sm min-w-0"
                  />
                  <button
                    onClick={applyBulkPriceAdjust}
                    disabled={isBulkSaving}
                    className="h-9 px-3 rounded-lg bg-brand text-white text-sm font-medium shrink-0"
                  >
                    Apply
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-soft divide-y divide-charcoal-border">
            {filtered.length === 0 ? (
              <p className="p-6 text-center text-charcoal-muted text-sm">Koi product nahi mila.</p>
            ) : (
              filtered.map((p) => (
                <div key={p.id} className="flex items-center gap-3 px-3 py-3">
                  <input
                    type="checkbox"
                    checked={selectedIds.has(p.id)}
                    onChange={() => toggleSelect(p.id)}
                    className="w-5 h-5 shrink-0 accent-brand"
                  />
                  <Link href={`/admin/products/edit?id=${p.id}`} className="shrink-0">
                    <Image
                      src={resolveMainImage(p, '300w')}
                      alt={p.name}
                      width={44}
                      height={44}
                      className="w-11 h-11 rounded-lg object-cover bg-cream-100"
                    />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <Link href={`/admin/products/edit?id=${p.id}`} className="block">
                      <p className="text-sm font-medium text-charcoal truncate">{p.name}</p>
                      <p className="text-xs text-charcoal-muted truncate">
                        {p.categories?.name ?? '—'}
                      </p>
                    </Link>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <InlineNumberField
                        value={p.price}
                        placeholder="Price"
                        onSave={(v) => updateProduct(p.id, { price: v })}
                      />
                      <InlineNumberField
                        value={p.stock}
                        placeholder="Stock"
                        onSave={(v) => updateProduct(p.id, { stock: v ?? 0 })}
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => updateProduct(p.id, { is_published: !p.is_published })}
                    className={`shrink-0 w-11 h-11 rounded-lg flex items-center justify-center ${
                      p.is_published ? 'bg-brand-soft text-brand' : 'bg-cream-200 text-charcoal-muted'
                    }`}
                    title={p.is_published ? 'Customers ko nazar aata hai' : 'Customers se hidden hai'}
                  >
                    {p.is_published ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                  </button>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}
