import React from 'react';
import type { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/lib/types';
import AllProductsView from '@/components/AllProductsView';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'All Baby Clothes & Newborn Outfits Online in Pakistan | Tiny Kids™',
  description:
    'Browse our complete collection of newborn starter sets, infant rompers, baby frocks, sweaters, and accessories. Pure combed cotton, nationwide Cash on Delivery across Pakistan.',
  alternates: {
    canonical: 'https://tinykids.pk/products/',
  },
};

async function getAllProducts(): Promise<Product[]> {
  try {
    const { data } = await supabase
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
      .eq('is_published', true)
      .order('sort_order', { ascending: true });

    return (data || []) as unknown as Product[];
  } catch (err) {
    console.error('Error fetching all products:', err);
    return [];
  }
}

export default async function AllProductsPage() {
  const products = await getAllProducts();

  return <AllProductsView initialProducts={products} />;
}
