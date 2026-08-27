'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { ChevronLeft, Phone, MessageCircle, Loader2, Printer, Check } from 'lucide-react';
import { adminSupabase } from '@/lib/supabase-admin-client';
import { formatPrice, resolveMainImage } from '@/lib/formatters';
import { Product } from '@/lib/types';

interface OrderDetailRow {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  address: string;
  city: string;
  notes: string | null;
  internal_notes: string | null;
  subtotal: number;
  shipping_fee: number;
  total: number;
  status: string;
  created_at: string;
  updated_at: string;
}

interface OrderItemRow {
  id: string;
  product_id: string | null;
  product_name: string;
  unit_price: number;
  quantity: number;
  line_total: number;
  product?: Pick<Product, 'product_images'> | null;
}

const STATUSES = ['new', 'confirmed', 'shipped', 'delivered', 'cancelled'] as const;
const STATUS_LABELS: Record<string, string> = {
  new: 'Naya',
  confirmed: 'Confirm',
  shipped: 'Bhej diya',
  delivered: 'Pohonch gaya',
  cancelled: 'Cancel',
};

function LoadingScreen() {
  return (
    <div className="flex items-center justify-center py-24">
      <Loader2 className="w-6 h-6 animate-spin text-brand" />
    </div>
  );
}

export default function OrderDetailPage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <OrderDetailPageContent />
    </Suspense>
  );
}

function OrderDetailPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const [order, setOrder] = useState<OrderDetailRow | null>(null);
  const [items, setItems] = useState<OrderItemRow[]>([]);
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [savedFlash, setSavedFlash] = useState(false);

  useEffect(() => {
    if (!id) return;
    async function load() {
      const [{ data: orderData }, { data: itemsData }] = await Promise.all([
        adminSupabase.from('orders').select('*').eq('id', id).single(),
        adminSupabase
          .from('order_items')
          .select('id, product_id, product_name, unit_price, quantity, line_total, product:products(product_images(r2_key,is_primary,is_white_background,is_description_image))')
          .eq('order_id', id),
      ]);
      setOrder(orderData as OrderDetailRow);
      setNotes((orderData as OrderDetailRow)?.internal_notes ?? '');
      setItems((itemsData as unknown as OrderItemRow[]) ?? []);
      setIsLoading(false);
    }
    load();
  }, [id]);

  async function updateStatus(status: string) {
    if (!order) return;
    setOrder({ ...order, status });
    await adminSupabase.from('orders').update({ status }).eq('id', order.id);
  }

  async function saveNotes() {
    if (!order) return;
    await adminSupabase.from('orders').update({ internal_notes: notes }).eq('id', order.id);
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1500);
  }

  if (!id || isLoading || !order) return <LoadingScreen />;

  const phoneClean = order.customer_phone.replace(/[^0-9]/g, '');
  const whatsappPhone = phoneClean.startsWith('0') ? `92${phoneClean.slice(1)}` : phoneClean;

  return (
    <div className="pb-16">
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur border-b border-charcoal-border px-4 py-3 flex items-center gap-3 print:hidden">
        <button onClick={() => router.push('/admin/orders')} className="p-2 -ml-2 text-charcoal-light">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="font-semibold text-charcoal flex-1">{order.order_number}</h1>
        <button
          onClick={() => window.print()}
          className="h-10 px-3 rounded-lg bg-white border border-charcoal-border text-sm font-medium text-charcoal-light flex items-center gap-1.5"
        >
          <Printer className="w-4 h-4" /> Print
        </button>
      </div>

      <div className="p-4 md:p-6 max-w-2xl mx-auto space-y-4 print:max-w-full">
        <section className="bg-white rounded-2xl shadow-soft p-4 space-y-3 print:shadow-none print:border print:border-charcoal-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-charcoal">{order.customer_name}</p>
              <p className="text-sm text-charcoal-muted">{order.city}</p>
            </div>
            <select
              value={order.status}
              onChange={(e) => updateStatus(e.target.value)}
              className="h-10 px-3 rounded-lg bg-brand-soft text-brand text-sm font-medium border-0 print:hidden"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {STATUS_LABELS[s]}
                </option>
              ))}
            </select>
          </div>

          <p className="text-sm text-charcoal">{order.address}</p>

          <div className="flex items-center gap-2 print:hidden">
            <a
              href={`tel:${order.customer_phone}`}
              className="flex-1 h-11 rounded-lg bg-cream-100 text-charcoal text-sm font-medium flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4" /> Call
            </a>
            <a
              href={`https://wa.me/${whatsappPhone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 h-11 rounded-lg bg-green-50 text-green-700 text-sm font-medium flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" /> WhatsApp
            </a>
          </div>
          <p className="text-sm text-charcoal-muted print:text-charcoal">{order.customer_phone}</p>

          {order.notes && (
            <p className="text-sm text-charcoal-light bg-cream-100 rounded-lg p-3">
              <strong>Customer note:</strong> {order.notes}
            </p>
          )}
        </section>

        <section className="bg-white rounded-2xl shadow-soft divide-y divide-charcoal-border print:shadow-none print:border print:border-charcoal-border">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-3 px-4 py-3">
              {item.product?.product_images && (
                <Image
                  src={resolveMainImage({ product_images: item.product.product_images } as Product, '300w')}
                  alt=""
                  width={44}
                  height={44}
                  className="w-11 h-11 rounded-lg object-cover bg-cream-100 shrink-0"
                />
              )}
              <div className="min-w-0 flex-1">
                <p className="text-sm text-charcoal truncate">{item.product_name}</p>
                <p className="text-xs text-charcoal-muted">
                  {formatPrice(item.unit_price)} × {item.quantity}
                </p>
              </div>
              <span className="text-sm font-semibold text-charcoal shrink-0">{formatPrice(item.line_total)}</span>
            </div>
          ))}
          <div className="px-4 py-3 space-y-1.5">
            <div className="flex justify-between text-sm text-charcoal-muted">
              <span>Subtotal</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm text-charcoal-muted">
              <span>Shipping</span>
              <span>{formatPrice(order.shipping_fee)}</span>
            </div>
            <div className="flex justify-between font-semibold text-charcoal pt-1">
              <span>Total</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-2xl shadow-soft p-4 space-y-2 print:hidden">
          <label className="block text-sm font-medium text-charcoal">Internal Notes (sirf aapko nazar aata hai)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            onBlur={saveNotes}
            rows={3}
            className="w-full px-3 py-2 rounded-lg border border-charcoal-border focus:border-brand outline-none text-sm resize-none"
            placeholder="e.g. Customer ne size M mangwaya"
          />
          {savedFlash && (
            <p className="text-xs text-brand flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> Save ho gaya
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
