'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import { CartProvider } from '@/context/CartContext';

export default function StorefrontChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <CartProvider>
      <Header />
      <div className="flex-1">{children}</div>
      <Footer />
      <CartDrawer />
      <FloatingWhatsApp />
    </CartProvider>
  );
}
