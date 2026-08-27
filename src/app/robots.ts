import { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/checkout/success/'],
    },
    sitemap: 'https://tinykids.pk/sitemap.xml',
  };
}