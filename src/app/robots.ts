import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_STORE_DOMAIN
    ? `https://${process.env.NEXT_PUBLIC_STORE_DOMAIN}`
    : 'https://tinykids.pk';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/checkout/success'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
