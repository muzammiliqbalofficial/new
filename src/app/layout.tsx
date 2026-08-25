import type { Metadata, Viewport } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';
import { supabase } from '@/lib/supabase';
import { CartProvider } from '@/context/CartContext';
import AnnouncementBar from '@/components/AnnouncementBar';
import Header from '@/components/Header';
import CategoryNav from '@/components/CategoryNav';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import { Category, StoreSettings } from '@/lib/types';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#3D6A52',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: {
    template: '%s | Tiny Kids Pakistan',
    default: 'Tiny Kids — Premium Baby & Kids Clothing and Essentials in Pakistan',
  },
  description:
    'Shop newborn starter sets, rompers, bodysuits, blankets, and nursery essentials in Pakistan. Cash on delivery available nationwide with easy 7-day returns.',
  keywords: [
    'baby clothes pakistan',
    'newborn baby set',
    'baby romper online pakistan',
    'cash on delivery baby store',
    'baby starter set',
    'infant clothing karachi lahore islamabad',
  ],
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_STORE_DOMAIN
      ? `https://${process.env.NEXT_PUBLIC_STORE_DOMAIN}`
      : 'https://tinykids.pk'
  ),
  openGraph: {
    type: 'website',
    locale: 'en_PK',
    siteName: 'Tiny Kids',
  },
};

async function getGlobalStoreData(): Promise<{
  settings: StoreSettings | null;
  categories: Category[];
}> {
  try {
    // 1. Fetch settings
    const { data: settingsData } = await supabase
      .from('settings')
      .select('*')
      .eq('id', 1)
      .single();

    // 2. Fetch visible categories
    const { data: categoriesData } = await supabase
      .from('categories')
      .select('id, name, slug, sort_order, is_visible')
      .eq('is_visible', true)
      .order('sort_order', { ascending: true });

    return {
      settings: settingsData as StoreSettings | null,
      categories: (categoriesData || []) as Category[],
    };
  } catch (err) {
    console.error('Error loading global layout data:', err);
    return { settings: null, categories: [] };
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { settings, categories } = await getGlobalStoreData();

  const storeName = settings?.store_name || process.env.NEXT_PUBLIC_STORE_NAME || 'Tiny Kids';
  const whatsappNumber = settings?.whatsapp_number || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '923000000000';
  const announcementText = settings?.announcement_bar_text || 'Cash on Delivery Available Nationwide • Easy 7-Day Returns';
  const contactEmail = settings?.contact_email || process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'info@tinykids.pk';

  return (
    <html lang="en" className={outfit.variable}>
      <body className="min-h-screen flex flex-col font-sans bg-cream-50 text-charcoal">
        <CartProvider>
          <AnnouncementBar announcementText={announcementText} whatsappNumber={whatsappNumber} />
          <Header storeName={storeName} whatsappNumber={whatsappNumber} categories={categories} />
          <CategoryNav categories={categories} />
          <main className="flex-1">{children}</main>
          <Footer
            storeName={storeName}
            whatsappNumber={whatsappNumber}
            contactEmail={contactEmail}
            categories={categories}
          />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
