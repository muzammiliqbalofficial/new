import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { resolveMainImage } from '@/lib/formatters';

export const revalidate = 3600; // Cache for 1 hour

export async function GET() {
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('id, slug, name, name_original, price, categories(name), product_images(r2_key, is_primary, is_white_background, is_description_image)')
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Error fetching search index:', error);
      return NextResponse.json([], { status: 500 });
    }

    const searchDocs = (products || []).map((p: any) => {
      const categoryName = p.categories?.name || 'General';
      const imageStem = resolveMainImage(p);
      return {
        id: p.id,
        slug: p.slug,
        name: p.name,
        name_original: p.name_original || p.name,
        category: categoryName,
        price: p.price,
        imageStem,
      };
    });

    return NextResponse.json(searchDocs, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (err: any) {
    console.error('Search index API error:', err);
    return NextResponse.json([], { status: 500 });
  }
}
