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
    const { data: categoryData, error: catError } = await supabase
      .from('categories')
      .select('id, name, slug, sort_order, is_visible')
      .eq('slug', slug)
      .single();

    if (catError || !categoryData) {
      return { category: null, products: [] };
    }

    const { data: productsData, error: prodError } = await supabase
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
    return { title: 'Category Not Found | tinykids.pk' };
  }

  return {
    title: `${category.name} — Newborn Baby Clothes Online in Pakistan | tinykids.pk`,
    description: `Shop ${category.name} in Pakistan at tinykids.pk. Explore ${products.length}+ soft 100% pure cotton baby designs with nationwide Cash on Delivery.`,
    alternates: {
      canonical: `https://tinykids.pk/category/${category.slug}/`,
    },
    openGraph: {
      title: `${category.name} | tinykids.pk`,
      description: `Shop ${category.name} with Cash on Delivery across Pakistan.`,
      url: `https://tinykids.pk/category/${category.slug}/`,
    },
  };
}

export default async function CategoryPage({ params }: Props) {
  const resolvedParams = await params;
  const { category, products } = await getCategoryData(resolvedParams.slug);

  if (!category) {
    notFound();
  }

  // Structured Schema for Category Collection & Breadcrumbs
  const categorySchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${category.name} - Baby Clothes Pakistan`,
    description: `Shop ${category.name} online at tinykids.pk with Cash on Delivery.`,
    url: `https://tinykids.pk/category/${category.slug}/`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: products.slice(0, 12).map((prod, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `https://tinykids.pk/product/${prod.slug}/`,
        name: prod.name,
      })),
    },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://tinykids.pk',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: category.name,
        item: `https://tinykids.pk/category/${category.slug}/`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(categorySchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <CategoryView category={category} initialProducts={products} />
    </>
  );
}
