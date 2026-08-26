'use client';

import React, { useEffect, useState } from 'react';
import {
  ShoppingBag,
  Clock,
  CheckCircle,
  Truck,
  Phone,
  Search,
  RefreshCw,
  Eye,
  X,
  MapPin,
  Calendar,
  AlertCircle,
  MessageCircle,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { formatPrice } from '@/lib/formatters';

interface OrderItem {
  id?: string;
  product_name: string;
  unit_price: number;
  quantity: number;
  line_total: number;
}

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  address: string;
  city: string;
  notes?: string;
  subtotal: number;
  shipping_fee: number;
  total: number;
  status: 'new' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  created_at: string;
  order_items?: OrderItem[];
}

const STATUS_BADGES: Record<string, { label: string; color: string }> = {
  new: { label: 'New Order', color: 'bg-amber-100 text-amber-800 border-amber-300' },
  confirmed: { label: 'Confirmed', color: 'bg-blue-100 text-blue-800 border-blue-300' },
  shipped: { label: 'Dispatched', color: 'bg-purple-100 text-purple-800 border-purple-300' },
  delivered: { label: 'Delivered', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  cancelled: { label: 'Cancelled', color: 'bg-rose-100 text-rose-800 border-rose-300' },
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<string | null>(null);

  // Load orders
  const loadOrders = async () => {
    setIsLoading(true);
    try {
      // Fetch from Supabase
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Database orders query warning:', error);
      }

      // Check localStorage for offline/client fallback test orders
      let combinedOrders = (data || []) as Order[];
      if (typeof window !== 'undefined') {
        const local = localStorage.getItem('tk_last_order');
        if (local) {
          try {
            const parsed = JSON.parse(local);
            if (!combinedOrders.find((o) => o.order_number === parsed.order_number)) {
              combinedOrders = [parsed, ...combinedOrders];
            }
          } catch (e) {}
        }
      }

      setOrders(combinedOrders);
      setFilteredOrders(combinedOrders);
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  // Filter orders
  useEffect(() => {
    let result = [...orders];

    if (statusFilter !== 'all') {
      result = result.filter((o) => o.status === statusFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (o) =>
          o.order_number.toLowerCase().includes(q) ||
          o.customer_name.toLowerCase().includes(q) ||
          o.customer_phone.includes(q) ||
          o.city.toLowerCase().includes(q)
      );
    }

    setFilteredOrders(result);
  }, [searchQuery, statusFilter, orders]);

  // Update order status
  const handleStatusChange = async (orderId: string, newStatus: Order['status']) => {
    setIsUpdatingStatus(orderId);
    try {
      await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);

      // Update state locally
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setIsUpdatingStatus(null);
    }
  };

  // WhatsApp Customer message trigger
  const generateCustomerWhatsAppLink = (order: Order) => {
    const cleanPhone = order.customer_phone.replace(/[^0-9]/g, '');
    const phone = cleanPhone.startsWith('0') ? `92${cleanPhone.slice(1)}` : cleanPhone;
    const msg = `Assalam o Alaikum ${order.customer_name}! 👶\n\nThank you for ordering with *Tiny Kids* (Order #${order.order_number}).\nTotal Amount: *${formatPrice(order.total)}* (Cash on Delivery).\n\nYour order is currently *${order.status.toUpperCase()}*. We will deliver to your address: ${order.address}, ${order.city}.\n\nFor any questions, feel free to reply! ✨`;
    return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
  };

  // Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.status !== 'cancelled' ? o.total : 0), 0);
  const newOrdersCount = orders.filter((o) => o.status === 'new').length;
  const dispatchedCount = orders.filter((o) => o.status === 'shipped' || o.status === 'confirmed').length;

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-charcoal tracking-tight">Customer Orders</h1>
          <p className="text-xs sm:text-sm text-charcoal-muted mt-0.5">
            Manage incoming Cash on Delivery orders & customer dispatches
          </p>
        </div>
        <button
          onClick={loadOrders}
          disabled={isLoading}
          className="inline-flex items-center space-x-2 px-4 py-2 bg-white hover:bg-cream-100 text-charcoal border border-charcoal-border rounded-xl text-xs font-bold shadow-xs transition-colors self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Orders</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-charcoal-border/70 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-charcoal-muted uppercase">Total Orders</span>
            <div className="w-8 h-8 rounded-xl bg-brand-soft text-brand flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-charcoal mt-2">{orders.length}</div>
          <span className="text-[11px] text-charcoal-muted">All-time store orders</span>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-charcoal-border/70 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-700 uppercase">New / Pending</span>
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-charcoal mt-2">{newOrdersCount}</div>
          <span className="text-[11px] text-amber-600 font-semibold">Requires confirmation</span>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-charcoal-border/70 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-purple-700 uppercase">In Progress</span>
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-charcoal mt-2">{dispatchedCount}</div>
          <span className="text-[11px] text-purple-600 font-semibold">Confirmed / Shipped</span>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-charcoal-border/70 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-700 uppercase">Total Sales</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-charcoal mt-2">{formatPrice(totalRevenue)}</div>
          <span className="text-[11px] text-emerald-600 font-semibold">Gross order value</span>
        </div>
      </div>

      {/* Filter & Search Controls */}
      <div className="bg-white rounded-2xl p-4 border border-charcoal-border/70 shadow-soft flex flex-col sm:flex-row gap-3 items-center justify-between">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, phone, order #..."
            className="w-full pl-9 pr-4 py-2 bg-cream-50 rounded-xl border border-charcoal-border/80 text-xs focus:outline-none focus:ring-2 focus:ring-brand/30"
          />
        </div>

        {/* Status Pills */}
        <div className="flex space-x-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          {['all', 'new', 'confirmed', 'shipped', 'delivered', 'cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-colors whitespace-nowrap ${
                statusFilter === st
                  ? 'bg-charcoal text-white shadow-xs'
                  : 'bg-cream-100 text-charcoal-light hover:bg-cream-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-charcoal-border/70 shadow-soft overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <ShoppingBag className="w-10 h-10 text-charcoal-muted mx-auto" />
            <h3 className="text-base font-bold text-charcoal">No orders found</h3>
            <p className="text-xs text-charcoal-muted max-w-sm mx-auto">
              Customer orders placed on the storefront will appear right here in real time.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-cream-100/70 border-b border-charcoal-border/60 text-charcoal-muted uppercase text-[10px] tracking-wider font-bold">
                  <th className="py-3.5 px-4">Order Ref</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">City & Address</th>
                  <th className="py-3.5 px-4">Amount</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal-border/40 text-charcoal font-medium">
                {filteredOrders.map((order) => {
                  const badge = STATUS_BADGES[order.status] || STATUS_BADGES.new;
                  return (
                    <tr key={order.id || order.order_number} className="hover:bg-cream-50/50 transition-colors">
                      {/* Order Ref & Date */}
                      <td className="py-3.5 px-4">
                        <span className="font-black text-brand text-xs block">{order.order_number}</span>
                        <span className="text-[10px] text-charcoal-muted block">
                          {new Date(order.created_at || Date.now()).toLocaleDateString('en-PK', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </td>

                      {/* Customer Info */}
                      <td className="py-3.5 px-4">
                        <span className="font-bold block text-charcoal">{order.customer_name}</span>
                        <a
                          href={`tel:${order.customer_phone}`}
                          className="text-xs text-charcoal-light hover:text-brand flex items-center space-x-1"
                        >
                          <Phone className="w-3 h-3 text-charcoal-muted inline" />
                          <span>{order.customer_phone}</span>
                        </a>
                      </td>

                      {/* City & Address */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <span className="font-bold text-xs text-charcoal block">{order.city}</span>
                        <span className="text-[11px] text-charcoal-muted truncate block max-w-xs">
                          {order.address}
                        </span>
                      </td>

                      {/* Total Amount */}
                      <td className="py-3.5 px-4">
                        <span className="font-black text-xs sm:text-sm text-charcoal block">
                          {formatPrice(order.total)}
                        </span>
                        <span className="text-[10px] text-charcoal-muted block">
                          {order.order_items?.length || 1} Item(s) • COD
                        </span>
                      </td>

                      {/* Status Selector */}
                      <td className="py-3.5 px-4">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value as any)}
                          disabled={isUpdatingStatus === order.id}
                          className={`text-[11px] font-bold px-2.5 py-1 rounded-xl border focus:outline-none ${badge.color} cursor-pointer`}
                        >
                          <option value="new">New</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="shipped">Dispatched</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>

                      {/* Action Buttons */}
                      <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                        <a
                          href={generateCustomerWhatsAppLink(order)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1 px-2.5 py-1.5 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] text-xs font-bold rounded-xl border border-[#25D366]/30 transition-colors"
                          title="WhatsApp Customer"
                        >
                          <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                          <span>WhatsApp</span>
                        </a>

                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="inline-flex items-center space-x-1 px-2.5 py-1.5 bg-cream-100 hover:bg-cream-200 text-charcoal text-xs font-bold rounded-xl transition-colors"
                          title="View Order Details"
                        >
                          <Eye className="w-3.5 h-3.5 text-charcoal-muted" />
                          <span>Details</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Details Slide-over Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl border border-charcoal-border relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-charcoal-border/50 pb-3">
              <div>
                <span className="text-[10px] text-charcoal-muted uppercase font-bold tracking-wider">
                  Order Details
                </span>
                <h3 className="text-lg font-black text-charcoal">{selectedOrder.order_number}</h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 rounded-xl text-charcoal-muted hover:text-charcoal hover:bg-cream-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer Details */}
            <div className="bg-cream-50 p-4 rounded-2xl border border-charcoal-border/50 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-charcoal-muted">Customer Name:</span>
                <span className="font-bold text-charcoal">{selectedOrder.customer_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal-muted">Phone Number:</span>
                <span className="font-bold text-charcoal">{selectedOrder.customer_phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal-muted">City:</span>
                <span className="font-bold text-charcoal">{selectedOrder.city}</span>
              </div>
              <div>
                <span className="text-charcoal-muted block mb-0.5">Delivery Address:</span>
                <span className="font-semibold text-charcoal block bg-white p-2 rounded-xl border border-charcoal-border/40">
                  {selectedOrder.address}
                </span>
              </div>
              {selectedOrder.notes && (
                <div>
                  <span className="text-charcoal-muted block mb-0.5">Customer Notes:</span>
                  <span className="italic text-charcoal block bg-white p-2 rounded-xl border border-charcoal-border/40">
                    "{selectedOrder.notes}"
                  </span>
                </div>
              )}
            </div>

            {/* Ordered Items */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal mb-2">
                Items ({selectedOrder.order_items?.length || 1})
              </h4>
              <div className="bg-white rounded-2xl border border-charcoal-border/60 divide-y divide-charcoal-border/40 text-xs">
                {(selectedOrder.order_items || []).map((item, idx) => (
                  <div key={item.id || idx} className="p-3 flex justify-between items-center">
                    <div>
                      <span className="font-bold text-charcoal block">{item.product_name}</span>
                      <span className="text-charcoal-muted">
                        Qty: {item.quantity} × {formatPrice(item.unit_price)}
                      </span>
                    </div>
                    <span className="font-bold text-charcoal">{formatPrice(item.line_total)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="border-t border-charcoal-border/50 pt-3 space-y-1.5 text-xs">
              <div className="flex justify-between text-charcoal-light">
                <span>Subtotal:</span>
                <span className="font-semibold">{formatPrice(selectedOrder.subtotal)}</span>
              </div>
              <div className="flex justify-between text-charcoal-light">
                <span>Delivery:</span>
                <span className="font-semibold">{formatPrice(selectedOrder.shipping_fee)}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-charcoal pt-1 border-t border-charcoal-border/50">
                <span>Total Payable:</span>
                <span className="text-brand">{formatPrice(selectedOrder.total)}</span>
              </div>
            </div>

            {/* Direct WhatsApp button in modal */}
            <div className="pt-2">
              <a
                href={generateCustomerWhatsAppLink(selectedOrder)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-[#25D366] hover:bg-[#128C7E] text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center space-x-2 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Send WhatsApp Update to Customer</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
