'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import BismillahIntro from '@/components/BismillahIntro';
import MobileBottomNav from '@/components/MobileBottomNav';
import WelcomeOfferModal from '@/components/WelcomeOfferModal';
import { CartProvider } from '@/context/CartContext';

export default function StorefrontChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <CartProvider>
      <BismillahIntro />
      <Header />
      <div className="flex-1 pb-16 md:pb-0">{children}</div>
      <Footer />
      <CartDrawer />
      <FloatingWhatsApp />
      <MobileBottomNav />
      <WelcomeOfferModal />
    </CartProvider>
  );
}