'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { adminSupabase } from '@/lib/supabase-admin-client';
import { slugify } from '@/lib/admin-slug';
import { Category } from '@/lib/types';

export default function NewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminSupabase
      .from('categories')
      .select('id, name, slug')
      .order('sort_order')
      .then(({ data }) => setCategories((data as Category[]) ?? []));
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setIsSaving(true);
    setError(null);

    let slug = slugify(name);
    for (let attempt = 0; attempt < 5; attempt++) {
      const { data, error } = await adminSupabase
        .from('products')
        .insert({
          name: name.trim(),
          slug,
          category_id: categoryId || null,
          currency: 'PKR',
          stock: 0,
          is_published: false,
          attributes: {},
        })
        .select('id')
        .single();

      if (!error && data) {
        router.push(`/admin/products/edit?id=${data.id}`);
        return;
      }
      if (error?.code === '23505') {
        slug = `${slugify(name)}-${Math.random().toString(36).slice(2, 6)}`;
        continue;
      }
      setError('Product create nahi ho saka. Dobara koshish karein.');
      setIsSaving(false);
      return;
    }
    setError('Product create nahi ho saka. Dobara koshish karein.');
    setIsSaving(false);
  }

  return (
    <div className="p-4 md:p-6 max-w-lg mx-auto">
      <h1 className="text-xl font-bold text-charcoal mb-1">Naya Product</h1>
      <p className="text-sm text-charcoal-muted mb-6">
        Pehle naam aur category dein — baaki details (photos, price, description) agle screen par.
      </p>

      <form onSubmit={handleCreate} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-charcoal mb-1.5">Product ka naam</label>
          <input
            required
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full h-12 px-4 rounded-xl border border-charcoal-border focus:border-brand focus:ring-2 focus:ring-brand-soft outline-none text-base"
            placeholder="e.g. Newborn Baba Romper Set"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-charcoal mb-1.5">Category</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full h-12 px-4 rounded-xl border border-charcoal-border focus:border-brand focus:ring-2 focus:ring-brand-soft outline-none text-base bg-white"
          >
            <option value="">Baad mein choose karein</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {error && <p className="text-sm text-coral-dark">{error}</p>}

        <button
          type="submit"
          disabled={isSaving || !name.trim()}
          className="w-full h-12 rounded-xl bg-brand text-white font-semibold disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
          Product Banayein
        </button>
      </form>
    </div>
  );
}
