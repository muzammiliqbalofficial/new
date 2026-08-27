'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Loader2, Download } from 'lucide-react';
import { adminSupabase } from '@/lib/supabase-admin-client';
import { formatPrice } from '@/lib/formatters';

interface OrderRow {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  city: string;
  total: number;
  status: string;
  created_at: string;
}

const STATUSES = ['new', 'confirmed', 'shipped', 'delivered', 'cancelled'] as const;
const STATUS_LABELS: Record<string, string> = {
  new: 'Naya',
  confirmed: 'Confirm',
  shipped: 'Bhej diya',
  delivered: 'Pohonch gaya',
  cancelled: 'Cancel',
};
const STATUS_COLORS: Record<string, string> = {
  new: 'bg-coral-soft text-coral-dark',
  confirmed: 'bg-brand-soft text-brand',
  shipped: 'bg-blue-50 text-blue-700',
  delivered: 'bg-green-50 text-green-700',
  cancelled: 'bg-charcoal-border/50 text-charcoal-muted',
};

function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export default function AdminOrdersPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-6 h-6 animate-spin text-brand" />
        </div>
      }
    >
      <AdminOrdersPageContent />
    </Suspense>
  );
}

function AdminOrdersPageContent() {
  const searchParams = useSearchParams();
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [range, setRange] = useState<string>(searchParams.get('range') || 'all');

  useEffect(() => {
    adminSupabase
      .from('orders')
      .select('id, order_number, customer_name, customer_phone, city, total, status, created_at')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setOrders((data as OrderRow[]) ?? []);
        setIsLoading(false);
      });
  }, []);

  const filtered = useMemo(() => {
    let list = orders;
    if (statusFilter !== 'all') list = list.filter((o) => o.status === statusFilter);
    if (range === 'today') {
      const start = startOfToday().getTime();
      list = list.filter((o) => new Date(o.created_at).getTime() >= start);
    } else if (range === 'week') {
      const start = startOfToday().getTime() - 6 * 24 * 60 * 60 * 1000;
      list = list.filter((o) => new Date(o.created_at).getTime() >= start);
    }
    return list;
  }, [orders, statusFilter, range]);

  async function updateStatus(id: string, status: string) {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    await adminSupabase.from('orders').update({ status }).eq('id', id);
  }

  function exportCsv() {
    const header = ['Order #', 'Customer', 'Phone', 'City', 'Total', 'Status', 'Date'];
    const rows = filtered.map((o) => [
      o.order_number,
      o.customer_name,
      o.customer_phone,
      o.city,
      o.total,
      STATUS_LABELS[o.status] ?? o.status,
      new Date(o.created_at).toLocaleString('en-PK'),
    ]);
    const csv = [header, ...rows]
      .map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tinykids-orders-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-6 h-6 animate-spin text-brand" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl font-bold text-charcoal">Orders</h1>
        <button
          onClick={exportCsv}
          className="flex items-center gap-1.5 h-10 px-4 rounded-lg bg-white border border-charcoal-border text-sm font-medium text-charcoal-light"
        >
          <Download className="w-4 h-4" /> CSV
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        <select
          value={range}
          onChange={(e) => setRange(e.target.value)}
          className="h-10 px-3 rounded-lg border border-charcoal-border text-sm shrink-0 bg-white"
        >
          <option value="all">Sab dates</option>
          <option value="today">Aaj</option>
          <option value="week">Iss hafte</option>
        </select>
        <button
          onClick={() => setStatusFilter('all')}
          className={`h-10 px-3 rounded-lg text-sm font-medium shrink-0 border ${
            statusFilter === 'all' ? 'bg-brand text-white border-brand' : 'bg-white text-charcoal-light border-charcoal-border'
          }`}
        >
          Sab
        </button>
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`h-10 px-3 rounded-lg text-sm font-medium shrink-0 border ${
              statusFilter === s ? 'bg-brand text-white border-brand' : 'bg-white text-charcoal-light border-charcoal-border'
            }`}
          >
            {STATUS_LABELS[s]}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-soft divide-y divide-charcoal-border">
        {filtered.length === 0 ? (
          <p className="p-6 text-center text-charcoal-muted text-sm">Koi order nahi mila.</p>
        ) : (
          filtered.map((o) => (
            <div key={o.id} className="flex items-center gap-3 px-4 py-3.5">
              <Link href={`/admin/orders/detail?id=${o.id}`} className="min-w-0 flex-1">
                <p className="font-medium text-charcoal truncate">{o.customer_name}</p>
                <p className="text-xs text-charcoal-muted">
                  {o.order_number} · {o.city} · {new Date(o.created_at).toLocaleDateString('en-PK')}
                </p>
              </Link>
              <span className="font-semibold text-charcoal shrink-0">{formatPrice(o.total)}</span>
              <select
                value={o.status}
                onChange={(e) => updateStatus(o.id, e.target.value)}
                className={`h-9 px-2 rounded-lg text-xs font-medium border-0 shrink-0 ${STATUS_COLORS[o.status]}`}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {STATUS_LABELS[s]}
                  </option>
                ))}
              </select>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
