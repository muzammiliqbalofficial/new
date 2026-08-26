'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  ShoppingBag,
  Package,
  PlusCircle,
  Zap,
  Settings,
  ExternalLink,
  LogOut,
  Menu,
  X,
  Store,
} from 'lucide-react';
import { isAdminAuthenticated, clearAdminSession } from '@/lib/admin-auth';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const NAV_ITEMS = [
  { label: 'Customer Orders', href: '/admin', icon: ShoppingBag },
  { label: 'All Products', href: '/admin/products', icon: Package },
  { label: 'Add New Product', href: '/admin/products/new', icon: PlusCircle },
  { label: 'Quick Price & Stock', href: '/admin/quick-edit', icon: Zap },
  { label: 'Store Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuth, setIsAuth] = useState<boolean | null>(null);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const isLoginPage = pathname === '/admin/login' || pathname === '/admin/login/';

  useEffect(() => {
    if (isLoginPage) {
      setIsAuth(true);
      return;
    }
    const authenticated = isAdminAuthenticated();
    if (!authenticated) {
      router.push('/admin/login');
    } else {
      setIsAuth(true);
    }
  }, [pathname, isLoginPage, router]);

  const handleLogout = () => {
    clearAdminSession();
    router.push('/admin/login');
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (isAuth === null) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50 flex flex-col md:flex-row">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-charcoal text-white min-h-screen border-r border-charcoal-light/20 flex-shrink-0">
        {/* Brand Header */}
        <div className="p-6 border-b border-charcoal-light/30 flex items-center space-x-3">
          <div className="relative w-9 h-9 rounded-xl overflow-hidden bg-white flex-shrink-0">
            <Image src="/logo.png" alt="Tiny Kids" fill className="object-cover" />
          </div>
          <div>
            <span className="font-black text-base text-white tracking-tight block">Tiny Kids</span>
            <span className="text-[10px] text-coral font-bold uppercase tracking-wider">Client Admin</span>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                  isActive
                    ? 'bg-brand text-white shadow-xs'
                    : 'text-charcoal-muted hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-charcoal-light/30 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold text-charcoal-muted hover:text-white hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center space-x-2.5">
              <Store className="w-4 h-4 text-brand-light" />
              <span>Live Website</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-coral hover:bg-coral/10 transition-colors text-left"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <div className="md:hidden bg-charcoal text-white px-4 py-3.5 flex items-center justify-between border-b border-charcoal-light/20 sticky top-0 z-40">
        <div className="flex items-center space-x-2.5">
          <div className="relative w-8 h-8 rounded-xl overflow-hidden bg-white">
            <Image src="/logo.png" alt="Tiny Kids" fill className="object-cover" />
          </div>
          <span className="font-bold text-sm text-white">Tiny Kids Admin</span>
        </div>

        <button
          onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
          className="p-2 rounded-xl text-charcoal-muted hover:text-white hover:bg-white/10"
        >
          {isMobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Navigation Dropdown */}
      {isMobileNavOpen && (
        <div className="md:hidden bg-charcoal text-white border-b border-charcoal-light/30 p-4 space-y-2 z-30">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileNavOpen(false)}
                className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold ${
                  isActive ? 'bg-brand text-white' : 'text-charcoal-muted hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
          <div className="pt-2 border-t border-charcoal-light/30 flex justify-between">
            <Link
              href="/"
              target="_blank"
              className="text-xs font-bold text-brand-light flex items-center space-x-1 py-1"
            >
              <span>View Storefront</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
            <button
              onClick={handleLogout}
              className="text-xs font-bold text-coral flex items-center space-x-1 py-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 overflow-y-auto max-w-7xl">
        {children}
      </main>
    </div>
  );
}
