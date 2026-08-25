import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import Breadcrumbs from '@/components/Breadcrumbs';
import CategoryView from '@/components/CategoryView';
import { Category, Product } from '@/lib/types';

export const revalidate = 3600; // Hourly ISR

interface Props {
  params: Promise<{ slug: string }>;
}

async function getCategoryData(slug: string): Promise<{
  category: Category | null;
  products: Product[];
}> {
  try {
    // 1. Fetch category by slug
    const { data: categoryData, error: catError } = await supabase
      .from('categories')
      .select('id, name, slug, sort_order, is_visible')
      .eq('slug', slug)
      .eq('is_visible', true)
      .single();

    if (catError || !categoryData) {
      return { category: null, products: [] };
    }

    // 2. Fetch products in category
    const { data: productsData } = await supabase
      .from('products')
      .select('id, slug, name, price, sale_price, stock, is_published, attributes, categories(id, name, slug), product_images(id, r2_key, sort_order, is_primary, is_white_background, is_description_image)')
      .eq('category_id', categoryData.id)
      .order('sort_order', { ascending: true });

    return {
      category: categoryData as Category,
      products: (productsData || []) as unknown as Product[],
    };
  } catch (err) {
    console.error('Error loading category:', err);
    return { category: null, products: [] };
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { category, products } = await getCategoryData(slug);

  if (!category) {
    return { title: 'Category Not Found' };
  }

  return {
    title: `${category.name} — Baby & Kids Collection`,
    description: `Shop our ${category.name} collection (${products.length} products). Premium soft baby essentials delivered nationwide with Cash on Delivery across Pakistan.`,
    openGraph: {
      title: `${category.name} | Tiny Kids Pakistan`,
      description: `Explore ${category.name} essentials for babies and toddlers. Cash on delivery nationwide.`,
    },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const { category, products } = await getCategoryData(slug);

  if (!category) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6">
      <Breadcrumbs items={[{ label: category.name }]} />
      <CategoryView category={category} initialProducts={products} />
    </div>
  );
}
