'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Package,
  Plus,
  Search,
  Edit2,
  Trash2,
  RefreshCw,
  Eye,
  EyeOff,
  Check,
  X,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';
import {
  getAdminProducts,
  getAdminCategories,
  updateAdminProduct,
  deleteAdminProduct,
} from '@/lib/admin-api';
import { Product, Category } from '@/lib/types';
import { formatPrice, resolveMainImage } from '@/lib/formatters';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  // Edit Modal State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    price: 0,
    sale_price: 0,
    stock: 0,
    category_id: '',
    is_published: true,
  });
  const [isSaving, setIsSaving] = useState(false);

  // Delete Modal State
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [cats, prods] = await Promise.all([
        getAdminCategories(),
        getAdminProducts(),
      ]);

      setCategories(cats || []);
      const prodList = (prods || []) as unknown as Product[];
      setProducts(prodList);
      setFilteredProducts(prodList);
    } catch (err) {
      console.error('Error loading products:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter products
  useEffect(() => {
    let list = [...products];

    if (categoryFilter !== 'all') {
      list = list.filter((p) => {
        const catObj: any = p.categories;
        const catId = Array.isArray(catObj) ? catObj[0]?.id : catObj?.id;
        return catId === categoryFilter || p.category_id === categoryFilter;
      });
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((p) => {
        const catObj: any = p.categories;
        const catName = Array.isArray(catObj) ? catObj[0]?.name : catObj?.name;
        return (
          (p.name && p.name.toLowerCase().includes(q)) ||
          (p.slug && p.slug.toLowerCase().includes(q)) ||
          (catName && catName.toLowerCase().includes(q))
        );
      });
    }

    setFilteredProducts(list);
  }, [searchQuery, categoryFilter, products]);

  // Open Edit Modal
  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    const catObj: any = p.categories;
    const catId = Array.isArray(catObj) ? catObj[0]?.id : catObj?.id;
    setEditFormData({
      name: p.name,
      price: p.price || 0,
      sale_price: p.sale_price || 0,
      stock: p.stock || 0,
      category_id: catId || p.category_id || '',
      is_published: p.is_published,
    });
  };

  // Save Edit
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    setIsSaving(true);
    try {
      const payload: any = {
        name: editFormData.name,
        price: Number(editFormData.price) || 0,
        sale_price: Number(editFormData.sale_price) > 0 ? Number(editFormData.sale_price) : null,
        stock: Number(editFormData.stock) || 0,
        is_published: editFormData.is_published,
      };

      if (editFormData.category_id) {
        payload.category_id = editFormData.category_id;
      }

      await updateAdminProduct(editingProduct.id, payload);

      setProducts((prev) =>
        prev.map((p) => {
          if (p.id === editingProduct.id) {
            const matchedCat = categories.find((c) => c.id === editFormData.category_id);
            return {
              ...p,
              ...payload,
              categories: matchedCat
                ? { id: matchedCat.id, name: matchedCat.name, slug: matchedCat.slug }
                : p.categories,
            };
          }
          return p;
        })
      );

      setEditingProduct(null);
    } catch (err) {
      console.error('Failed to update product:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // Delete product
  const handleDeleteProduct = async () => {
    if (!deletingProduct) return;
    try {
      await deleteAdminProduct(deletingProduct.id);
      setProducts((prev) => prev.filter((p) => p.id !== deletingProduct.id));
      setDeletingProduct(null);
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  // Quick Toggle Visibility
  const handleToggleVisibility = async (p: Product) => {
    const nextState = !p.is_published;
    setProducts((prev) => prev.map((item) => (item.id === p.id ? { ...item, is_published: nextState } : item)));
    await updateAdminProduct(p.id, { is_published: nextState });
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-charcoal tracking-tight">Products Catalog</h1>
          <p className="text-xs sm:text-sm text-charcoal-muted mt-0.5">
            Manage your baby clothing collection, update prices, and stock counts ({products.length} total)
          </p>
        </div>

        <div className="flex items-center space-x-2.5 self-start sm:self-auto">
          <button
            onClick={loadData}
            disabled={isLoading}
            className="p-2.5 bg-white hover:bg-cream-100 text-charcoal border border-charcoal-border rounded-xl text-xs font-bold shadow-xs transition-colors"
            title="Refresh Products"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <Link
            href="/admin/products/new"
            className="inline-flex items-center space-x-2 px-4 py-2.5 bg-brand hover:bg-brand-dark text-white rounded-xl text-xs font-bold shadow-card transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </Link>
        </div>
      </div>

      {/* Search & Category Filter */}
      <div className="bg-white rounded-2xl p-4 border border-charcoal-border/70 shadow-soft flex flex-col sm:flex-row gap-3 items-center justify-between">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products by title..."
            className="w-full pl-9 pr-4 py-2 bg-cream-50 rounded-xl border border-charcoal-border/80 text-xs focus:outline-none focus:ring-2 focus:ring-brand/30"
          />
        </div>

        {/* Category Dropdown */}
        <div className="w-full sm:w-auto flex items-center space-x-2">
          <span className="text-xs text-charcoal-muted font-bold whitespace-nowrap">Category:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 bg-cream-50 rounded-xl border border-charcoal-border/80 text-xs font-semibold text-charcoal focus:outline-none"
          >
            <option value="all">All Clothing Collections ({products.length})</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-charcoal-border/70 shadow-soft overflow-hidden">
        {isLoading ? (
          <div className="py-20 text-center space-y-3">
            <RefreshCw className="w-8 h-8 animate-spin text-brand mx-auto" />
            <p className="text-xs text-charcoal-muted font-bold">Loading products catalog...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-20 text-center space-y-3">
            <Package className="w-10 h-10 text-charcoal-muted mx-auto" />
            <h3 className="text-base font-black text-charcoal">No Products Found</h3>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-cream-100/70 border-b border-charcoal-border/60 text-charcoal-muted uppercase text-[10px] tracking-wider font-bold">
                  <th className="py-3.5 px-4">Item</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Selling Price</th>
                  <th className="py-3.5 px-4">Original Price</th>
                  <th className="py-3.5 px-4">Stock</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal-border/40 text-charcoal font-medium">
                {filteredProducts.map((p) => {
                  const imageStem = resolveMainImage(p);
                  const catObj: any = p.categories;
                  const catName = Array.isArray(catObj) ? catObj[0]?.name : catObj?.name || 'Uncategorized';
                  return (
                    <tr key={p.id} className="hover:bg-cream-50/50 transition-colors">
                      {/* Item Image + Title */}
                      <td className="py-3.5 px-4 max-w-sm">
                        <div className="flex items-center space-x-3">
                          <div className="relative w-12 h-12 rounded-xl bg-cream-50 overflow-hidden flex-shrink-0 border border-charcoal-border/40 p-1">
                            <Image
                              src={imageStem}
                              alt={p.name}
                              fill
                              sizes="48px"
                              className="object-contain object-center"
                            />
                          </div>
                          <div className="min-w-0">
                            <span className="font-bold text-xs text-charcoal line-clamp-1 block">{p.name}</span>
                            <span className="text-[10px] text-charcoal-muted truncate block">{p.slug}</span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 rounded-full bg-cream-100 text-charcoal text-[11px] font-semibold">
                          {catName}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="py-3.5 px-4 font-black text-xs sm:text-sm text-charcoal">
                        {formatPrice(p.price)}
                      </td>

                      {/* Original Sale Price */}
                      <td className="py-3.5 px-4 text-xs text-charcoal-muted line-through">
                        {p.sale_price && p.sale_price > (p.price || 0) ? formatPrice(p.sale_price) : '—'}
                      </td>

                      {/* Stock */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                            p.stock > 0
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {p.stock > 0 ? `${p.stock} in stock` : 'Out of stock'}
                        </span>
                      </td>

                      {/* Published Toggle */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => handleToggleVisibility(p)}
                          className={`p-1.5 rounded-xl border transition-colors ${
                            p.is_published
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                              : 'bg-charcoal-border/40 text-charcoal-muted border-charcoal-border'
                          }`}
                          title={p.is_published ? 'Visible on website' : 'Hidden from website'}
                        >
                          {p.is_published ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right space-x-1 whitespace-nowrap">
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="p-1.5 bg-cream-100 hover:bg-cream-200 text-charcoal rounded-xl transition-colors"
                          title="Edit Product"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeletingProduct(p)}
                          className="p-1.5 bg-coral/10 hover:bg-coral/20 text-coral rounded-xl transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-charcoal-border relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-charcoal-border/50 pb-3">
              <h3 className="text-base font-black text-charcoal">Edit Product</h3>
              <button
                onClick={() => setEditingProduct(null)}
                className="p-1.5 rounded-xl text-charcoal-muted hover:text-charcoal hover:bg-cream-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-charcoal mb-1 uppercase text-[10px]">Product Title</label>
                <input
                  type="text"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  required
                  className="w-full px-3.5 py-2.5 bg-cream-50 rounded-xl border border-charcoal-border/80 focus:outline-none focus:ring-2 focus:ring-brand/30 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-charcoal mb-1 uppercase text-[10px]">Category Collection</label>
                <select
                  value={editFormData.category_id}
                  onChange={(e) => setEditFormData({ ...editFormData, category_id: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-cream-50 rounded-xl border border-charcoal-border/80 focus:outline-none focus:ring-2 focus:ring-brand/30 text-xs font-semibold"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-charcoal mb-1 uppercase text-[10px]">Selling Price (PKR)</label>
                  <input
                    type="number"
                    value={editFormData.price}
                    onChange={(e) => setEditFormData({ ...editFormData, price: Number(e.target.value) })}
                    required
                    className="w-full px-3.5 py-2.5 bg-cream-50 rounded-xl border border-charcoal-border/80 focus:outline-none focus:ring-2 focus:ring-brand/30 text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-charcoal mb-1 uppercase text-[10px]">Original/Crossed Price</label>
                  <input
                    type="number"
                    value={editFormData.sale_price}
                    onChange={(e) => setEditFormData({ ...editFormData, sale_price: Number(e.target.value) })}
                    placeholder="e.g. 1599"
                    className="w-full px-3.5 py-2.5 bg-cream-50 rounded-xl border border-charcoal-border/80 focus:outline-none focus:ring-2 focus:ring-brand/30 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-charcoal mb-1 uppercase text-[10px]">Stock Quantity</label>
                <input
                  type="number"
                  value={editFormData.stock}
                  onChange={(e) => setEditFormData({ ...editFormData, stock: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 bg-cream-50 rounded-xl border border-charcoal-border/80 focus:outline-none focus:ring-2 focus:ring-brand/30 text-xs font-bold"
                />
              </div>

              <div className="pt-2 flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="published_checkbox"
                  checked={editFormData.is_published}
                  onChange={(e) => setEditFormData({ ...editFormData, is_published: e.target.checked })}
                  className="w-4 h-4 text-brand rounded focus:ring-brand"
                />
                <label htmlFor="published_checkbox" className="font-bold text-charcoal text-xs">
                  Published & Visible on Website
                </label>
              </div>

              <div className="pt-4 border-t border-charcoal-border/50 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 bg-cream-100 hover:bg-cream-200 text-charcoal font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 bg-brand hover:bg-brand-dark text-white font-bold rounded-xl shadow-xs"
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingProduct && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-charcoal-border text-center">
            <div className="w-12 h-12 rounded-full bg-coral/10 text-coral flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-black text-charcoal">Delete Product?</h3>
              <p className="text-xs text-charcoal-muted mt-1 leading-relaxed">
                Are you sure you want to delete <strong className="text-charcoal">{deletingProduct.name}</strong>?
              </p>
            </div>
            <div className="pt-3 flex justify-center space-x-2">
              <button
                onClick={() => setDeletingProduct(null)}
                className="px-4 py-2 bg-cream-100 hover:bg-cream-200 text-charcoal font-bold rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProduct}
                className="px-5 py-2 bg-coral hover:bg-coral-dark text-white font-bold rounded-xl text-xs shadow-xs"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
