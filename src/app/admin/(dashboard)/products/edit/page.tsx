'use client';

import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import {
  ChevronLeft,
  Loader2,
  Trash2,
  Star,
  ArrowUp,
  ArrowDown,
  UploadCloud,
  Plus,
  X,
  Check,
  Settings2,
} from 'lucide-react';
import { adminSupabase } from '@/lib/supabase-admin-client';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { slugify } from '@/lib/admin-slug';
import { uploadProductImage, deleteProductImage } from '@/lib/admin-images';
import { getR2ImageUrl } from '@/lib/formatters';
import { Category, ProductImage } from '@/lib/types';
import RichTextEditor from '@/components/admin/RichTextEditor';

const SUGGESTED_ATTRIBUTE_KEYS = ['Country of Origin', 'Recommended Age', 'Recommended Gender'];

function LoadingScreen() {
  return (
    <div className="flex items-center justify-center py-24">
      <Loader2 className="w-6 h-6 animate-spin text-brand" />
    </div>
  );
}

export default function EditProductPage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <EditProductPageContent />
    </Suspense>
  );
}

function EditProductPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const { session } = useAdminAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [images, setImages] = useState<ProductImage[]>([]);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [uploadingCount, setUploadingCount] = useState(0);

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [brand, setBrand] = useState('');
  const [warranty, setWarranty] = useState('');
  const [price, setPrice] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [stock, setStock] = useState('0');
  const [isPublished, setIsPublished] = useState(false);
  const [descriptionHtml, setDescriptionHtml] = useState('');
  const [attributes, setAttributes] = useState<{ key: string; value: string }[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const markDirty = useCallback(() => setIsDirty(true), []);

  useEffect(() => {
    function handleBeforeUnload(e: BeforeUnloadEvent) {
      if (!isDirty) return;
      e.preventDefault();
      e.returnValue = '';
    }
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  useEffect(() => {
    if (!id) return;
    async function load() {
      const [{ data: product }, { data: cats }, { data: imgs }] = await Promise.all([
        adminSupabase.from('products').select('*').eq('id', id).single(),
        adminSupabase.from('categories').select('id, name, slug').order('sort_order'),
        adminSupabase.from('product_images').select('*').eq('product_id', id).order('sort_order'),
      ]);

      if (product) {
        setName(product.name ?? '');
        setSlug(product.slug ?? '');
        setCategoryId(product.category_id ?? '');
        setBrand(product.brand ?? '');
        setWarranty(product.warranty ?? '');
        setPrice(product.price === null ? '' : String(product.price));
        setSalePrice(product.sale_price === null ? '' : String(product.sale_price));
        setStock(String(product.stock ?? 0));
        setIsPublished(!!product.is_published);
        setDescriptionHtml(product.description_html ?? '');
        const attrs = (product.attributes as Record<string, string>) ?? {};
        setAttributes(Object.entries(attrs).map(([key, value]) => ({ key, value })));
      }
      setCategories((cats as Category[]) ?? []);
      setImages((imgs as ProductImage[]) ?? []);
      setIsLoading(false);
    }
    load();
  }, [id]);

  async function handleSave() {
    if (!id) return;
    setIsSaving(true);

    const attributesObj: Record<string, string> = {};
    attributes.forEach((a) => {
      if (a.key.trim()) attributesObj[a.key.trim()] = a.value;
    });

    const descText = descriptionHtml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

    const { error } = await adminSupabase
      .from('products')
      .update({
        name: name.trim(),
        slug: slug.trim() || slugify(name),
        category_id: categoryId || null,
        brand: brand.trim() || null,
        warranty: warranty.trim() || null,
        price: price.trim() === '' ? null : Number(price),
        sale_price: salePrice.trim() === '' ? null : Number(salePrice),
        stock: Number(stock) || 0,
        is_published: isPublished,
        description_html: descriptionHtml,
        description_text: descText,
        attributes: attributesObj,
      })
      .eq('id', id);

    setIsSaving(false);
    if (!error) {
      setIsDirty(false);
      setSavedFlash(true);
      setTimeout(() => setSavedFlash(false), 2000);
    }
  }

  async function handleFilesSelected(files: FileList | null) {
    if (!files || files.length === 0 || !id || !session) return;
    setUploadingCount(files.length);

    for (const file of Array.from(files)) {
      try {
        const stem = await uploadProductImage(file, session.access_token);
        const { data: inserted } = await adminSupabase
          .from('product_images')
          .insert({
            product_id: id,
            r2_key: stem,
            sort_order: images.length,
            is_primary: images.length === 0,
            is_description_image: false,
          })
          .select('*')
          .single();
        if (inserted) setImages((prev) => [...prev, inserted as ProductImage]);
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Image upload nahi ho saka');
      }
      setUploadingCount((c) => Math.max(0, c - 1));
    }
  }

  async function handleDeleteImage(img: ProductImage) {
    if (!session) return;
    if (!confirm('Ye photo delete karein?')) return;
    await deleteProductImage(img.r2_key, session.access_token);
    await adminSupabase.from('product_images').delete().eq('id', img.id);
    setImages((prev) => prev.filter((i) => i.id !== img.id));
  }

  async function handleMakePrimary(img: ProductImage) {
    setImages((prev) => prev.map((i) => ({ ...i, is_primary: i.id === img.id })));
    await adminSupabase.from('product_images').update({ is_primary: false }).eq('product_id', id!);
    await adminSupabase.from('product_images').update({ is_primary: true }).eq('id', img.id);
  }

  async function handleReorder(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= images.length) return;
    const next = [...images];
    [next[index], next[target]] = [next[target], next[index]];
    const reindexed = next.map((img, i) => ({ ...img, sort_order: i }));
    setImages(reindexed);
    await Promise.all(
      reindexed.map((img) => adminSupabase.from('product_images').update({ sort_order: img.sort_order }).eq('id', img.id))
    );
  }

  async function handleDeleteProduct() {
    if (!id || !session) return;
    setIsDeleting(true);
    await Promise.all(images.map((img) => deleteProductImage(img.r2_key, session.access_token)));
    await adminSupabase.from('products').update({ deleted_at: new Date().toISOString() }).eq('id', id);
    setIsDeleting(false);
    router.push('/admin/products');
  }

  function updateAttribute(index: number, patch: Partial<{ key: string; value: string }>) {
    setAttributes((prev) => prev.map((a, i) => (i === index ? { ...a, ...patch } : a)));
    markDirty();
  }

  function addAttribute(key = '') {
    setAttributes((prev) => [...prev, { key, value: '' }]);
    markDirty();
  }

  function removeAttribute(index: number) {
    setAttributes((prev) => prev.filter((_, i) => i !== index));
    markDirty();
  }

  if (!id) return <LoadingScreen />;
  if (isLoading) return <LoadingScreen />;

  const usedKeys = new Set(attributes.map((a) => a.key));
  const availableSuggestions = SUGGESTED_ATTRIBUTE_KEYS.filter((k) => !usedKeys.has(k));

  return (
    <div className="pb-28">
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur border-b border-charcoal-border px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => {
            if (isDirty && !confirm('Aapki changes save nahi hui. Chhod dein?')) return;
            router.push('/admin/products');
          }}
          className="p-2 -ml-2 text-charcoal-light"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="font-semibold text-charcoal truncate flex-1">{name || 'Product Edit'}</h1>
        <button
          onClick={handleSave}
          disabled={isSaving || !isDirty}
          className="h-10 px-4 rounded-lg bg-brand text-white text-sm font-semibold disabled:opacity-50 flex items-center gap-1.5 shrink-0"
        >
          {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
          {savedFlash && <Check className="w-4 h-4" />}
          {savedFlash ? 'Save ho gaya' : 'Save'}
        </button>
      </div>

      <div className="p-4 md:p-6 max-w-2xl mx-auto space-y-6">
        {/* Basics */}
        <section className="bg-white rounded-2xl shadow-soft p-4 space-y-4">
          <h2 className="font-semibold text-charcoal">Basics</h2>
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1.5">Naam</label>
            <input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                markDirty();
              }}
              className="w-full h-11 px-3 rounded-lg border border-charcoal-border focus:border-brand outline-none text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1.5">Category</label>
            <select
              value={categoryId}
              onChange={(e) => {
                setCategoryId(e.target.value);
                markDirty();
              }}
              className="w-full h-11 px-3 rounded-lg border border-charcoal-border focus:border-brand outline-none text-sm bg-white"
            >
              <option value="">Koi category nahi</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1.5">Brand</label>
              <input
                value={brand}
                onChange={(e) => {
                  setBrand(e.target.value);
                  markDirty();
                }}
                className="w-full h-11 px-3 rounded-lg border border-charcoal-border focus:border-brand outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1.5">Warranty</label>
              <input
                value={warranty}
                onChange={(e) => {
                  setWarranty(e.target.value);
                  markDirty();
                }}
                className="w-full h-11 px-3 rounded-lg border border-charcoal-border focus:border-brand outline-none text-sm"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowAdvanced((v) => !v)}
            className="flex items-center gap-1.5 text-xs text-charcoal-muted font-medium"
          >
            <Settings2 className="w-3.5 h-3.5" />
            Advanced
          </button>
          {showAdvanced && (
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1.5">
                Slug (website link)
              </label>
              <input
                value={slug}
                onChange={(e) => {
                  setSlug(slugify(e.target.value));
                  markDirty();
                }}
                className="w-full h-11 px-3 rounded-lg border border-charcoal-border focus:border-brand outline-none text-sm font-mono"
              />
            </div>
          )}
        </section>

        {/* Pricing & Stock */}
        <section className="bg-white rounded-2xl shadow-soft p-4 space-y-4">
          <h2 className="font-semibold text-charcoal">Pricing & Stock</h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1.5">Price (Rs.)</label>
              <input
                type="number"
                min={0}
                value={price}
                onChange={(e) => {
                  setPrice(e.target.value);
                  markDirty();
                }}
                className="w-full h-11 px-3 rounded-lg border border-charcoal-border focus:border-brand outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1.5">Sale Price (Rs.)</label>
              <input
                type="number"
                min={0}
                value={salePrice}
                onChange={(e) => {
                  setSalePrice(e.target.value);
                  markDirty();
                }}
                className="w-full h-11 px-3 rounded-lg border border-charcoal-border focus:border-brand outline-none text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1.5">Stock (kitni quantity hai)</label>
            <input
              type="number"
              min={0}
              value={stock}
              onChange={(e) => {
                setStock(e.target.value);
                markDirty();
              }}
              className="w-full h-11 px-3 rounded-lg border border-charcoal-border focus:border-brand outline-none text-sm"
            />
          </div>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={isPublished}
              onChange={(e) => {
                setIsPublished(e.target.checked);
                markDirty();
              }}
              className="w-5 h-5 accent-brand"
            />
            <span className="text-sm text-charcoal">Customers ko website par dikhayein</span>
          </label>
        </section>

        {/* Images */}
        <section className="bg-white rounded-2xl shadow-soft p-4 space-y-4">
          <h2 className="font-semibold text-charcoal">Photos</h2>

          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              handleFilesSelected(e.dataTransfer.files);
            }}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-charcoal-border rounded-xl py-6 flex flex-col items-center gap-2 text-charcoal-muted cursor-pointer active:bg-cream-100"
          >
            <UploadCloud className="w-6 h-6" />
            <span className="text-sm">Photos yahan drop karein ya tap karke chunein</span>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handleFilesSelected(e.target.files)}
            />
          </div>
          {uploadingCount > 0 && (
            <p className="text-sm text-charcoal-muted flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" /> {uploadingCount} photo(s) upload ho rahi hain…
            </p>
          )}

          {images.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {images.map((img, index) => (
                <div key={img.id} className="relative rounded-lg overflow-hidden border border-charcoal-border">
                  <Image
                    src={getR2ImageUrl(img.r2_key, '300w')}
                    alt=""
                    width={120}
                    height={120}
                    className="w-full aspect-square object-cover"
                  />
                  {img.is_primary && (
                    <span className="absolute top-1 left-1 bg-brand text-white text-[10px] px-1.5 py-0.5 rounded">
                      Main
                    </span>
                  )}
                  <div className="absolute bottom-1 inset-x-1 flex items-center gap-1 justify-center">
                    <button
                      onClick={() => handleReorder(index, -1)}
                      className="w-7 h-7 rounded bg-black/60 text-white flex items-center justify-center"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleReorder(index, 1)}
                      className="w-7 h-7 rounded bg-black/60 text-white flex items-center justify-center"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleMakePrimary(img)}
                      className="w-7 h-7 rounded bg-black/60 text-white flex items-center justify-center"
                    >
                      <Star className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteImage(img)}
                      className="w-7 h-7 rounded bg-black/60 text-white flex items-center justify-center"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Description */}
        <section className="bg-white rounded-2xl shadow-soft p-4 space-y-3">
          <h2 className="font-semibold text-charcoal">Description</h2>
          <RichTextEditor
            html={descriptionHtml}
            onChange={(html) => {
              setDescriptionHtml(html);
              markDirty();
            }}
          />
        </section>

        {/* Details / Attributes */}
        <section className="bg-white rounded-2xl shadow-soft p-4 space-y-3">
          <h2 className="font-semibold text-charcoal">Details</h2>
          {attributes.map((a, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                value={a.key}
                onChange={(e) => updateAttribute(i, { key: e.target.value })}
                placeholder="Naam (e.g. Material)"
                className="flex-1 h-10 px-3 rounded-lg border border-charcoal-border text-sm min-w-0"
              />
              <input
                value={a.value}
                onChange={(e) => updateAttribute(i, { value: e.target.value })}
                placeholder="Detail"
                className="flex-1 h-10 px-3 rounded-lg border border-charcoal-border text-sm min-w-0"
              />
              <button onClick={() => removeAttribute(i)} className="p-2 text-charcoal-muted shrink-0">
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => addAttribute()}
              className="h-9 px-3 rounded-lg border border-dashed border-charcoal-border text-sm text-charcoal-light flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Detail add karein
            </button>
            {availableSuggestions.map((s) => (
              <button
                key={s}
                onClick={() => addAttribute(s)}
                className="h-9 px-3 rounded-lg bg-cream-100 text-sm text-charcoal-light"
              >
                + {s}
              </button>
            ))}
          </div>
        </section>

        {/* Delete */}
        <section className="pt-2">
          {!deleteConfirmOpen ? (
            <button
              onClick={() => setDeleteConfirmOpen(true)}
              className="text-sm text-coral-dark font-medium"
            >
              Ye product delete karein
            </button>
          ) : (
            <div className="bg-coral-soft rounded-xl p-4 space-y-3">
              <p className="text-sm text-charcoal">
                Kya aap waqai <strong>{name}</strong> ko delete karna chahte hain? Ye website se hat
                jayega.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleDeleteProduct}
                  disabled={isDeleting}
                  className="h-10 px-4 rounded-lg bg-coral text-white text-sm font-semibold flex items-center gap-1.5"
                >
                  {isDeleting && <Loader2 className="w-4 h-4 animate-spin" />}
                  Haan, Delete Karein
                </button>
                <button
                  onClick={() => setDeleteConfirmOpen(false)}
                  className="h-10 px-4 rounded-lg bg-white text-sm font-medium text-charcoal"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
