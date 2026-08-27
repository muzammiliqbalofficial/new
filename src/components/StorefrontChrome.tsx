'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import BismillahIntro from '@/components/BismillahIntro';
import { CartProvider } from '@/context/CartContext';

export default function StorefrontChrome({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <BismillahIntro />
      <Header />
      <div className="flex-1">{children}</div>
      <Footer />
      <CartDrawer />
      <FloatingWhatsApp />
    </CartProvider>
  );
}
