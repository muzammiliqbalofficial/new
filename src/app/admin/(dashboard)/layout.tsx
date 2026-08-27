'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Package,
  ClipboardList,
  Settings,
  LogOut,
  UploadCloud,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { AdminAuthProvider, useAdminAuth } from '@/context/AdminAuthContext';
import { triggerPublish } from '@/lib/admin-publish';

const NAV_ITEMS = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/orders', label: 'Orders', icon: ClipboardList },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

function PublishButton() {
  const { session } = useAdminAuth();
  const [status, setStatus] = useState<'idle' | 'publishing' | 'done' | 'error'>('idle');

  async function handlePublish() {
    if (!session) return;
    setStatus('publishing');
    const ok = await triggerPublish(session.access_token);
    setStatus(ok ? 'done' : 'error');
    if (ok) setTimeout(() => setStatus('idle'), 4000);
  }

  return (
    <button
      onClick={handlePublish}
      disabled={status === 'publishing'}
      className="flex items-center gap-2 h-10 px-4 rounded-lg bg-coral text-white text-sm font-semibold disabled:opacity-70 active:scale-[0.98] transition shrink-0"
      title="Website par changes bhejein"
    >
      {status === 'publishing' && <Loader2 className="w-4 h-4 animate-spin" />}
      {status === 'done' && <CheckCircle2 className="w-4 h-4" />}
      {status === 'idle' && <UploadCloud className="w-4 h-4" />}
      <span className="whitespace-nowrap">
        {status === 'publishing'
          ? 'Publish ho raha hai…'
          : status === 'done'
            ? 'Publish shuru ho gaya'
            : status === 'error'
              ? 'Dobara koshish karein'
              : 'Website Update Karein'}
      </span>
    </button>
  );
}

function AdminShell({ children }: { children: React.ReactNode }) {
  const { session, isLoading, signOut } = useAdminAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !session) {
      router.replace('/admin/login');
    }
  }, [isLoading, session, router]);

  if (isLoading || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-100">
        <Loader2 className="w-6 h-6 animate-spin text-brand" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-100 flex">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:flex-col w-60 shrink-0 border-r border-charcoal-border bg-white p-4">
        <div className="mb-6 px-2">
          <p className="text-lg font-bold text-charcoal">Tiny Kids</p>
          <p className="text-xs text-charcoal-muted">Store Management</p>
        </div>
        <nav className="flex-1 space-y-1">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 h-11 px-3 rounded-lg text-sm font-medium transition ${
                  active ? 'bg-brand-soft text-brand' : 'text-charcoal-light hover:bg-cream-100'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <button
          onClick={() => signOut()}
          className="flex items-center gap-3 h-11 px-3 rounded-lg text-sm font-medium text-charcoal-light hover:bg-cream-100"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 shrink-0 border-b border-charcoal-border bg-white flex items-center justify-between gap-3 px-4 md:px-6">
          <p className="font-semibold text-charcoal md:hidden">Tiny Kids</p>
          <div className="flex-1" />
          <PublishButton />
          <button onClick={() => signOut()} className="md:hidden p-2 text-charcoal-light">
            <LogOut className="w-5 h-5" />
          </button>
        </header>

        <main className="flex-1 min-w-0 pb-20 md:pb-0">{children}</main>
      </div>

      {/* Mobile bottom tab nav */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-charcoal-border flex items-stretch z-40">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 min-h-[56px] text-xs font-medium ${
                active ? 'text-brand' : 'text-charcoal-muted'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <AdminShell>{children}</AdminShell>
    </AdminAuthProvider>
  );
}
