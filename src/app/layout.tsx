import type { Metadata, Viewport } from 'next';
import './globals.css';
import StorefrontChrome from '@/components/StorefrontChrome';

export const viewport: Viewport = {
  themeColor: '#3D6A52',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://tinykids.pk'),
  title: {
    default: 'tinykids.pk — Newborn Baby Clothes & Rompers Online in Pakistan',
    template: '%s | tinykids.pk',
  },
  description:
    'Shop premium newborn baby clothes, rompers, baby gift starter sets, and infant dresses online in Pakistan. 100% pure cotton, fast Cash on Delivery across Karachi, Lahore, Islamabad & nationwide.',
  keywords: [
    'Newborn baby clothes Pakistan',
    'Baby clothes online Pakistan',
    'Newborn baby starter sets',
    'Baby rompers Pakistan',
    'Infant bodysuits Pakistan',
    'Baby boy clothes online',
    'Baby girl dresses Karachi',
    'Baby gift packs Pakistan',
    'Cash on delivery baby shop Pakistan',
    'tinykids.pk',
    'Branny baby clothes alternative',
  ],
  authors: [{ name: 'tinykids.pk', url: 'https://tinykids.pk' }],
  creator: 'tinykids.pk',
  publisher: 'tinykids.pk',
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
  alternates: {
    canonical: 'https://tinykids.pk',
  },
  openGraph: {
    type: 'website',
    locale: 'en_PK',
    url: 'https://tinykids.pk',
    siteName: 'tinykids.pk',
    title: 'tinykids.pk — Newborn Baby Clothes & Rompers Online in Pakistan',
    description:
      'Explore soft, pure cotton newborn starter sets, baby rompers, and dresses. Cash on Delivery across Pakistan.',
    images: [
      {
        url: 'https://tinykids.pk/logo.png',
        width: 1200,
        height: 630,
        alt: 'tinykids.pk — Premium Baby Clothes Pakistan',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'tinykids.pk — Newborn Baby Clothes in Pakistan',
    description:
      'Pure cotton newborn starter packs, rompers, and infant outfits with Cash on Delivery in Pakistan.',
    images: ['https://tinykids.pk/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

// Global Organization & WebSite JSON-LD Schema for Google Rich Snippets
const globalSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://tinykids.pk/#organization',
      name: 'tinykids.pk',
      url: 'https://tinykids.pk',
      logo: {
        '@type': 'ImageObject',
        url: 'https://tinykids.pk/logo.png',
        width: 512,
        height: 512,
      },
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+92-336-6895035',
        contactType: 'customer service',
        areaServed: 'PK',
        availableLanguage: ['English', 'Urdu'],
      },
      sameAs: [
        'https://www.facebook.com/tinykids.pk',
        'https://www.instagram.com/tinykids.pk',
      ],
    },
    {
      '@type': 'WebSite',
      '@id': 'https://tinykids.pk/#website',
      url: 'https://tinykids.pk',
      name: 'tinykids.pk',
      publisher: {
        '@id': 'https://tinykids.pk/#organization',
      },
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://tinykids.pk/search?q={search_term_string}',
        'query-input': 'required name=search_term_string',
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700;800"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(globalSchema) }}
        />
      </head>
      <body className="font-sans antialiased text-charcoal bg-white flex flex-col min-h-screen selection:bg-brand-soft selection:text-brand">
        <StorefrontChrome>{children}</StorefrontChrome>
      </body>
    </html>
  );
}
