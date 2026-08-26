import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import CategoryView from '@/components/CategoryView';
import { Category, Product } from '@/lib/types';

export const revalidate = 3600;

export async function generateStaticParams() {
  const { data } = await supabase.from('categories').select('slug').eq('is_visible', true);
  return (data || []).map((c) => ({ slug: c.slug }));
}

interface Props {
  params: Promise<{ slug: string }>;
}

async function getCategoryData(slug: string): Promise<{
  category: Category | null;
  products: Product[];
}> {
  try {
    // 1. Fetch category
    const { data: categoryData, error: catError } = await supabase
      .from('categories')
      .select('id, name, slug, description, sort_order, is_visible')
      .eq('slug', slug)
      .single();

    if (catError || !categoryData) {
      return { category: null, products: [] };
    }

    // 2. Fetch all products in this category with images
    const { data: productsData } = await supabase
      .from('products')
      .select(
        `
        id,
        slug,
        name,
        brand,
        attributes,
        price,
        sale_price,
        stock,
        is_published,
        categories (
          id,
          name,
          slug
        ),
        product_images (
          id,
          r2_key,
          sort_order,
          is_primary,
          is_white_background,
          is_description_image
        )
      `
      )
      .eq('category_id', categoryData.id)
      .eq('is_published', true)
      .order('sort_order', { ascending: true });

    return {
      category: categoryData as Category,
      products: (productsData || []) as unknown as Product[],
    };
  } catch (err) {
    console.error('Error loading category page:', err);
    return { category: null, products: [] };
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const { category, products } = await getCategoryData(resolvedParams.slug);

  if (!category) {
    return {
      title: 'Category Not Found | Tiny Kids',
    };
  }

  return {
    title: `${category.name} — Baby Clothing | Tiny Kids Pakistan`,
    description: `Shop ${category.name} online at Tiny Kids. Explore ${products.length}+ soft, high-quality newborn & baby designs with Cash on Delivery across Pakistan.`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const resolvedParams = await params;
  const { category, products } = await getCategoryData(resolvedParams.slug);

  if (!category) {
    notFound();
  }

  return (
    <CategoryView
      category={category}
      initialProducts={products}
    />
  );
}
