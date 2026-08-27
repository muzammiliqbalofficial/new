'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ClipboardList, CalendarClock, PackageX, Tag, Loader2 } from 'lucide-react';
import { adminSupabase } from '@/lib/supabase-admin-client';
import { formatPrice } from '@/lib/formatters';

interface Counts {
  newToday: number;
  thisWeek: number;
  outOfStock: number;
  noPrice: number;
}

interface RecentOrder {
  id: string;
  order_number: string;
  customer_name: string;
  city: string;
  total: number;
  status: string;
  created_at: string;
}

const STATUS_LABELS: Record<string, string> = {
  new: 'Naya',
  confirmed: 'Confirm',
  shipped: 'Bhej diya',
  delivered: 'Pohonch gaya',
  cancelled: 'Cancel',
};

function startOfToday(): string {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

export default function AdminOverviewPage() {
  const [counts, setCounts] = useState<Counts | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [newTodayRes, weekRes, outOfStockRes, noPriceRes, recentRes] = await Promise.all([
        adminSupabase.from('orders').select('id', { count: 'exact', head: true }).gte('created_at', startOfToday()),
        adminSupabase.from('orders').select('id', { count: 'exact', head: true }).gte('created_at', daysAgo(7)),
        adminSupabase
          .from('products')
          .select('id', { count: 'exact', head: true })
          .is('deleted_at', null)
          .lte('stock', 0),
        adminSupabase
          .from('products')
          .select('id', { count: 'exact', head: true })
          .is('deleted_at', null)
          .is('price', null),
        adminSupabase
          .from('orders')
          .select('id, order_number, customer_name, city, total, status, created_at')
          .order('created_at', { ascending: false })
          .limit(5),
      ]);

      setCounts({
        newToday: newTodayRes.count ?? 0,
        thisWeek: weekRes.count ?? 0,
        outOfStock: outOfStockRes.count ?? 0,
        noPrice: noPriceRes.count ?? 0,
      });
      setRecentOrders(recentRes.data ?? []);
      setIsLoading(false);
    }
    load();
  }, []);

  if (isLoading || !counts) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-6 h-6 animate-spin text-brand" />
      </div>
    );
  }

  const cards = [
    {
      label: 'Aaj k naye orders',
      value: counts.newToday,
      icon: ClipboardList,
      href: '/admin/orders?range=today',
    },
    {
      label: 'Iss hafte k orders',
      value: counts.thisWeek,
      icon: CalendarClock,
      href: '/admin/orders?range=week',
    },
    {
      label: 'Stock khatam',
      value: counts.outOfStock,
      icon: PackageX,
      href: '/admin/products?filter=out-of-stock',
    },
    {
      label: 'Price set nahi hai',
      value: counts.noPrice,
      icon: Tag,
      href: '/admin/products?filter=no-price',
    },
  ];

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-6">
      <div className="grid grid-cols-2 gap-3 md:gap-4">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="bg-white rounded-2xl shadow-soft p-4 md:p-5 flex flex-col gap-2 active:scale-[0.98] transition"
          >
            <c.icon className="w-5 h-5 text-brand" />
            <span className="text-2xl md:text-3xl font-bold text-charcoal">{c.value}</span>
            <span className="text-sm text-charcoal-muted leading-tight">{c.label}</span>
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
        <div className="px-4 md:px-5 py-4 border-b border-charcoal-border flex items-center justify-between">
          <h2 className="font-semibold text-charcoal">Recent Orders</h2>
          <Link href="/admin/orders" className="text-sm text-brand font-medium">
            Sab dekhein
          </Link>
        </div>
        {recentOrders.length === 0 ? (
          <p className="p-6 text-center text-charcoal-muted text-sm">Abhi tak koi order nahi.</p>
        ) : (
          <ul className="divide-y divide-charcoal-border">
            {recentOrders.map((o) => (
              <li key={o.id}>
                <Link
                  href={`/admin/orders/detail?id=${o.id}`}
                  className="flex items-center justify-between gap-3 px-4 md:px-5 py-3.5 active:bg-cream-100"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-charcoal truncate">{o.customer_name}</p>
                    <p className="text-xs text-charcoal-muted">
                      {o.order_number} · {o.city}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-semibold text-charcoal">{formatPrice(o.total)}</p>
                    <p className="text-xs text-charcoal-muted">{STATUS_LABELS[o.status] ?? o.status}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
