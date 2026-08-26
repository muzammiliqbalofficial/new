'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Zap, Search, Save, Check, RefreshCw } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Product } from '@/lib/types';
import { resolveMainImage } from '@/lib/formatters';

interface EditableRow {
  id: string;
  name: string;
  slug: string;
  categoryName: string;
  imageStem: string;
  price: number;
  sale_price: number | null;
  stock: number;
  isDirty: boolean;
  isSaving: boolean;
  savedSuccess: boolean;
}

export default function QuickEditPage() {
  const [rows, setRows] = useState<EditableRow[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingAll, setIsSavingAll] = useState(false);

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const { data } = await supabase
        .from('products')
        .select(
          `
          id,
          name,
          slug,
          price,
          sale_price,
          stock,
          categories(name),
          product_images(r2_key, is_primary, is_white_background, is_description_image)
        `
        )
        .eq('is_published', true)
        .order('name', { ascending: true });

      const mapped: EditableRow[] = (data || []).map((p: any) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        categoryName: p.categories?.name || 'Baby Clothing',
        imageStem: resolveMainImage(p as Product),
        price: p.price || 0,
        sale_price: p.sale_price || null,
        stock: p.stock || 0,
        isDirty: false,
        isSaving: false,
        savedSuccess: false,
      }));

      setRows(mapped);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleFieldChange = (id: string, field: 'price' | 'sale_price' | 'stock', value: number | null) => {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value, isDirty: true, savedSuccess: false } : r))
    );
  };

  const handleSaveRow = async (row: EditableRow) => {
    setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, isSaving: true } : r)));
    try {
      await supabase
        .from('products')
        .update({
          price: Number(row.price) || 0,
          sale_price: Number(row.sale_price) > 0 ? Number(row.sale_price) : null,
          stock: Number(row.stock) || 0,
        })
        .eq('id', row.id);

      setRows((prev) =>
        prev.map((r) =>
          r.id === row.id ? { ...r, isSaving: false, isDirty: false, savedSuccess: true } : r
        )
      );

      setTimeout(() => {
        setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, savedSuccess: false } : r)));
      }, 2500);
    } catch (err) {
      console.error(err);
      setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, isSaving: false } : r)));
    }
  };

  const handleSaveAll = async () => {
    const dirtyRows = rows.filter((r) => r.isDirty);
    if (dirtyRows.length === 0) return;

    setIsSavingAll(true);
    try {
      for (const row of dirtyRows) {
        await supabase
          .from('products')
          .update({
            price: Number(row.price) || 0,
            sale_price: Number(row.sale_price) > 0 ? Number(row.sale_price) : null,
            stock: Number(row.stock) || 0,
          })
          .eq('id', row.id);
      }

      setRows((prev) => prev.map((r) => ({ ...r, isDirty: false, savedSuccess: true })));
      setTimeout(() => {
        setRows((prev) => prev.map((r) => ({ ...r, savedSuccess: false })));
      }, 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSavingAll(false);
    }
  };

  const filtered = rows.filter(
    (r) =>
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.categoryName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const dirtyCount = rows.filter((r) => r.isDirty).length;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-brand mb-1">
            <Zap className="w-3.5 h-3.5 text-coral" />
            <span>Fast Bulk Editor</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-charcoal tracking-tight">
            Quick Price & Stock Editor
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-muted mt-0.5">
            Rapidly update selling prices, sale discounts, and stocks for multiple items in 1 click
          </p>
        </div>

        <div className="flex items-center space-x-2.5 self-start sm:self-auto">
          <button
            onClick={loadProducts}
            disabled={isLoading}
            className="p-2.5 bg-white hover:bg-cream-100 text-charcoal border border-charcoal-border rounded-xl text-xs font-bold shadow-xs transition-colors"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={handleSaveAll}
            disabled={dirtyCount === 0 || isSavingAll}
            className="inline-flex items-center space-x-2 px-5 py-2.5 bg-brand hover:bg-brand-dark text-white rounded-xl text-xs font-bold shadow-card transition-all disabled:opacity-40"
          >
            <Save className="w-4 h-4" />
            <span>{isSavingAll ? 'Saving All...' : `Save All Changes (${dirtyCount})`}</span>
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-white rounded-2xl p-4 border border-charcoal-border/70 shadow-soft">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search baby outfit to edit..."
            className="w-full pl-9 pr-4 py-2 bg-cream-50 rounded-xl border border-charcoal-border/80 text-xs focus:outline-none focus:ring-2 focus:ring-brand/30"
          />
        </div>
      </div>

      {/* Spreadsheet Editor Table */}
      <div className="bg-white rounded-3xl border border-charcoal-border/70 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-cream-100/70 border-b border-charcoal-border/60 text-charcoal-muted uppercase text-[10px] tracking-wider font-bold">
                <th className="py-3.5 px-4">Baby Outfit</th>
                <th className="py-3.5 px-4">Collection</th>
                <th className="py-3.5 px-4 w-36">Selling Price (Rs.)</th>
                <th className="py-3.5 px-4 w-36">Original Price (Rs.)</th>
                <th className="py-3.5 px-4 w-32">Stock</th>
                <th className="py-3.5 px-4 text-right w-24">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal-border/40 font-medium">
              {filtered.map((row) => (
                <tr
                  key={row.id}
                  className={`transition-colors ${
                    row.isDirty ? 'bg-amber-50/50' : 'hover:bg-cream-50/50'
                  }`}
                >
                  {/* Item Image + Title */}
                  <td className="py-3 px-4 max-w-xs">
                    <div className="flex items-center space-x-2.5">
                      <div className="relative w-10 h-10 rounded-xl bg-cream-50 overflow-hidden flex-shrink-0 border border-charcoal-border/40 p-0.5">
                        <Image
                          src={row.imageStem}
                          alt={row.name}
                          fill
                          sizes="40px"
                          className="object-contain object-center"
                        />
                      </div>
                      <span className="font-bold text-xs text-charcoal truncate block">{row.name}</span>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-3 px-4 text-[11px] text-charcoal-light whitespace-nowrap">
                    {row.categoryName}
                  </td>

                  {/* Selling Price Input */}
                  <td className="py-3 px-4">
                    <input
                      type="number"
                      value={row.price}
                      onChange={(e) => handleFieldChange(row.id, 'price', Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-charcoal-border/80 text-xs font-black text-charcoal focus:outline-none focus:ring-2 focus:ring-brand/30 bg-white"
                    />
                  </td>

                  {/* Original Sale Price Input */}
                  <td className="py-3 px-4">
                    <input
                      type="number"
                      value={row.sale_price || ''}
                      onChange={(e) =>
                        handleFieldChange(row.id, 'sale_price', e.target.value ? Number(e.target.value) : null)
                      }
                      placeholder="e.g. 1599"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-charcoal-border/80 text-xs text-charcoal-muted focus:outline-none focus:ring-2 focus:ring-brand/30 bg-white"
                    />
                  </td>

                  {/* Stock Input */}
                  <td className="py-3 px-4">
                    <input
                      type="number"
                      value={row.stock}
                      onChange={(e) => handleFieldChange(row.id, 'stock', Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-charcoal-border/80 text-xs font-bold text-charcoal focus:outline-none focus:ring-2 focus:ring-brand/30 bg-white"
                    />
                  </td>

                  {/* Save button per row */}
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleSaveRow(row)}
                      disabled={!row.isDirty || row.isSaving}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
                        row.savedSuccess
                          ? 'bg-emerald-600 text-white'
                          : row.isDirty
                          ? 'bg-brand hover:bg-brand-dark text-white'
                          : 'bg-cream-100 text-charcoal-muted opacity-60'
                      }`}
                    >
                      {row.isSaving ? '...' : row.savedSuccess ? <Check className="w-3.5 h-3.5 inline" /> : 'Save'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
