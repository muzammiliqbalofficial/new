'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, Check, Image as ImageIcon } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Category } from '@/lib/types';

export default function AddProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    category_id: '',
    price: '',
    sale_price: '',
    stock: '50',
    description: '',
    image_r2_key: '',
    is_published: true,
  });

  useEffect(() => {
    supabase
      .from('categories')
      .select('*')
      .eq('is_visible', true)
      .order('sort_order', { ascending: true })
      .then(({ data }) => {
        if (data && data.length > 0) {
          setCategories(data);
          setFormData((prev) => ({ ...prev, category_id: data[0].id }));
        }
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim() || !formData.price) {
      setError('Please enter a product title and price.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Generate clean slug
      const baseSlug = formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      const uniqueSlug = `${baseSlug}-${Math.floor(1000 + Math.random() * 9000)}`;

      // 1. Insert product
      const { data: newProd, error: prodErr } = await supabase
        .from('products')
        .insert({
          name: formData.name.trim(),
          slug: uniqueSlug,
          category_id: formData.category_id || null,
          price: Number(formData.price) || 0,
          sale_price: Number(formData.sale_price) > 0 ? Number(formData.sale_price) : null,
          stock: Number(formData.stock) || 0,
          description_text: formData.description.trim() || null,
          is_published: formData.is_published,
        })
        .select()
        .single();

      if (prodErr || !newProd) {
        throw new Error(prodErr?.message || 'Failed to create product.');
      }

      // 2. Insert primary image if provided
      if (formData.image_r2_key.trim()) {
        await supabase.from('product_images').insert({
          product_id: newProd.id,
          r2_key: formData.image_r2_key.trim(),
          is_primary: true,
          sort_order: 1,
        });
      }

      router.push('/admin/products');
    } catch (err: any) {
      console.error('Error adding product:', err);
      setError(err.message || 'Error adding product. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6 pb-12">
      {/* Header */}
      <div>
        <Link
          href="/admin/products"
          className="inline-flex items-center text-xs font-semibold text-charcoal-muted hover:text-charcoal transition-colors mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1" />
          <span>Back to Products</span>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-black text-charcoal tracking-tight">Add New Baby Product</h1>
        <p className="text-xs sm:text-sm text-charcoal-muted mt-0.5">
          Add a new clothing outfit, starter set, or romper to your store
        </p>
      </div>

      {error && (
        <div className="p-3.5 rounded-2xl bg-coral/10 border border-coral/30 text-coral text-xs font-semibold">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-charcoal-border/70 shadow-soft space-y-5 text-xs">
        {/* Title */}
        <div>
          <label className="block font-bold text-charcoal mb-1.5 uppercase text-[11px]">
            Product Title <span className="text-coral">*</span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Newborn Baby Baba 5-Piece Welcome Gift Starter Set"
            required
            className="w-full px-4 py-3 bg-cream-50 rounded-xl border border-charcoal-border/80 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand/30"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block font-bold text-charcoal mb-1.5 uppercase text-[11px]">
            Collection / Category <span className="text-coral">*</span>
          </label>
          <select
            value={formData.category_id}
            onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
            className="w-full px-4 py-3 bg-cream-50 rounded-xl border border-charcoal-border/80 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand/30"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Prices & Stock */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block font-bold text-charcoal mb-1.5 uppercase text-[11px]">
              Selling Price (PKR) <span className="text-coral">*</span>
            </label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              placeholder="e.g. 1299"
              required
              className="w-full px-4 py-3 bg-cream-50 rounded-xl border border-charcoal-border/80 text-sm font-black focus:outline-none focus:ring-2 focus:ring-brand/30"
            />
          </div>

          <div>
            <label className="block font-bold text-charcoal mb-1.5 uppercase text-[11px]">
              Original Price (Crossed-Out)
            </label>
            <input
              type="number"
              value={formData.sale_price}
              onChange={(e) => setFormData({ ...formData, sale_price: e.target.value })}
              placeholder="e.g. 1699"
              className="w-full px-4 py-3 bg-cream-50 rounded-xl border border-charcoal-border/80 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30"
            />
          </div>

          <div>
            <label className="block font-bold text-charcoal mb-1.5 uppercase text-[11px]">
              Stock Quantity
            </label>
            <input
              type="number"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              placeholder="50"
              className="w-full px-4 py-3 bg-cream-50 rounded-xl border border-charcoal-border/80 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-brand/30"
            />
          </div>
        </div>

        {/* Image Stem / R2 Key */}
        <div>
          <label className="block font-bold text-charcoal mb-1.5 uppercase text-[11px]">
            Image Reference / Stem (Optional)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-charcoal-muted">
              <ImageIcon className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={formData.image_r2_key}
              onChange={(e) => setFormData({ ...formData, image_r2_key: e.target.value })}
              placeholder="e.g. 496335818-1-1df0f6c5 (or leave blank for placeholder)"
              className="w-full pl-10 pr-4 py-3 bg-cream-50 rounded-xl border border-charcoal-border/80 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30"
            />
          </div>
          <span className="text-[10px] text-charcoal-muted mt-1 block">
            Existing R2 image stem or leave empty to use default.
          </span>
        </div>

        {/* Description */}
        <div>
          <label className="block font-bold text-charcoal mb-1.5 uppercase text-[11px]">
            Product Description
          </label>
          <textarea
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Write details about fabric, sizes, piece count (e.g. 100% pure soft cotton jersey, hypoallergenic)..."
            className="w-full px-4 py-3 bg-cream-50 rounded-xl border border-charcoal-border/80 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 resize-none"
          />
        </div>

        {/* Published Toggle */}
        <div className="flex items-center space-x-2 pt-2">
          <input
            type="checkbox"
            id="pub_check"
            checked={formData.is_published}
            onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
            className="w-4 h-4 text-brand rounded focus:ring-brand"
          />
          <label htmlFor="pub_check" className="font-bold text-charcoal text-xs">
            Publish immediately (visible to customers on website)
          </label>
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-charcoal-border/50 flex justify-end space-x-3">
          <Link
            href="/admin/products"
            className="px-5 py-3 bg-cream-100 hover:bg-cream-200 text-charcoal font-bold rounded-xl text-xs"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-7 py-3 bg-brand hover:bg-brand-dark text-white font-bold rounded-xl text-xs shadow-card hover:shadow-hover transition-all flex items-center space-x-2 disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            <span>{isSubmitting ? 'Creating...' : 'Create Product'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
