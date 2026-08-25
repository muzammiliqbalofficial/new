import { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';

export const revalidate = 86400; // Daily sitemap refresh

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_STORE_DOMAIN
    ? `https://${process.env.NEXT_PUBLIC_STORE_DOMAIN}`
    : 'https://tinykids.pk';

  // 1. Static Pages
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/search`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/shipping`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/returns`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
  ];

  try {
    // 2. Dynamic Categories
    const { data: categories } = await supabase
      .from('categories')
      .select('slug, created_at')
      .eq('is_visible', true);

    const categoryRoutes: MetadataRoute.Sitemap = (categories || []).map((cat) => ({
      url: `${baseUrl}/category/${cat.slug}`,
      lastModified: new Date(cat.created_at || Date.now()),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

    // 3. Dynamic Products
    const { data: products } = await supabase
      .from('products')
      .select('slug, updated_at, created_at');

    const productRoutes: MetadataRoute.Sitemap = (products || []).map((prod) => ({
      url: `${baseUrl}/product/${prod.slug}`,
      lastModified: new Date(prod.updated_at || prod.created_at || Date.now()),
      changeFrequency: 'weekly',
      priority: 0.7,
    }));

    return [...staticRoutes, ...categoryRoutes, ...productRoutes];
  } catch (err) {
    console.error('Error generating sitemap:', err);
    return staticRoutes;
  }
}
