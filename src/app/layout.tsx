import type { Metadata, Viewport } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import { CartProvider } from '@/context/CartContext';

export const viewport: Viewport = {
  themeColor: '#7C3AED',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://tinykids.pk'),
  title: {
    default: 'Tiny Kids — Newborn Baby Clothes & Rompers Online in Pakistan',
    template: '%s | Tiny Kids Pakistan',
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
    'Tiny Kids Pakistan',
    'Branny baby clothes alternative',
  ],
  authors: [{ name: 'Tiny Kids', url: 'https://tinykids.pk' }],
  creator: 'Tiny Kids',
  publisher: 'Tiny Kids',
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
    siteName: 'Tiny Kids Pakistan',
    title: 'Tiny Kids — Newborn Baby Clothes & Rompers Online in Pakistan',
    description:
      'Explore soft, pure cotton newborn starter sets, baby rompers, and dresses. Cash on Delivery across Pakistan.',
    images: [
      {
        url: 'https://tinykids.pk/logo.png',
        width: 1200,
        height: 630,
        alt: 'Tiny Kids — Premium Baby Clothes Pakistan',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tiny Kids — Newborn Baby Clothes in Pakistan',
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
      name: 'Tiny Kids',
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
      name: 'Tiny Kids',
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
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(globalSchema) }}
        />
      </head>
      <body className="font-sans antialiased text-charcoal bg-white flex flex-col min-h-screen selection:bg-brand-soft selection:text-brand">
        <CartProvider>
          <Header />
          <div className="flex-1">{children}</div>
          <Footer />
          <CartDrawer />
          <FloatingWhatsApp />
        </CartProvider>
      </body>
    </html>
  );
}
