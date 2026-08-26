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
import { getAdminOrders, setOrderStatus } from '@/lib/admin-api';
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
      const data = await getAdminOrders();
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
          (o.order_number && o.order_number.toLowerCase().includes(q)) ||
          (o.customer_name && o.customer_name.toLowerCase().includes(q)) ||
          (o.customer_phone && o.customer_phone.includes(q)) ||
          (o.city && o.city.toLowerCase().includes(q))
      );
    }

    setFilteredOrders(result);
  }, [searchQuery, statusFilter, orders]);

  // Update order status
  const handleStatusChange = async (orderId: string, newStatus: Order['status']) => {
    setIsUpdatingStatus(orderId);
    try {
      const ok = await setOrderStatus(orderId, newStatus);
      if (ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
        }
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setIsUpdatingStatus(null);
    }
  };

  // WhatsApp Customer message trigger
  const generateCustomerWhatsAppLink = (order: Order) => {
    const cleanPhone = (order.customer_phone || '').replace(/[^0-9]/g, '');
    const phone = cleanPhone.startsWith('0') ? `92${cleanPhone.slice(1)}` : cleanPhone;
    const msg = `Assalam o Alaikum ${order.customer_name}! 👶\n\nThank you for ordering with *Tiny Kids* (Order #${order.order_number}).\nTotal Amount: *${formatPrice(order.total)}* (Cash on Delivery).\n\nYour order is currently *${(order.status || 'NEW').toUpperCase()}*. We will deliver to your address: ${order.address}, ${order.city}.\n\nFor any questions, feel free to reply! ✨`;
    return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
  };

  // Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.status !== 'cancelled' ? Number(o.total) || 0 : 0), 0);
  const newOrdersCount = orders.filter((o) => o.status === 'new').length;
  const dispatchedCount = orders.filter((o) => o.status === 'shipped' || o.status === 'confirmed').length;

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-charcoal tracking-tight">Customer Orders</h1>
          <p className="text-xs sm:text-sm text-charcoal-muted mt-0.5">
            Manage incoming Cash on Delivery orders & customer dispatches ({orders.length} total)
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
          <div className="flex items-center justify-between text-charcoal-muted mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Orders</span>
            <div className="p-2 rounded-xl bg-brand-soft text-brand">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl sm:text-3xl font-black text-charcoal">{orders.length}</span>
          <span className="text-[10px] text-charcoal-muted block mt-1">All-time store orders</span>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-charcoal-border/70 shadow-soft">
          <div className="flex items-center justify-between text-amber-700 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">New / Pending</span>
            <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl sm:text-3xl font-black text-charcoal">{newOrdersCount}</span>
          <span className="text-[10px] text-amber-700 font-semibold block mt-1">Requires confirmation</span>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-charcoal-border/70 shadow-soft">
          <div className="flex items-center justify-between text-purple-700 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">In Progress</span>
            <div className="p-2 rounded-xl bg-purple-100 text-purple-800">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl sm:text-3xl font-black text-charcoal">{dispatchedCount}</span>
          <span className="text-[10px] text-purple-700 font-semibold block mt-1">Confirmed / Shipped</span>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-charcoal-border/70 shadow-soft">
          <div className="flex items-center justify-between text-emerald-700 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Sales</span>
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <span className="text-xl sm:text-2xl font-black text-emerald-700">{formatPrice(totalRevenue)}</span>
          <span className="text-[10px] text-charcoal-muted block mt-1">Gross order value</span>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="bg-white rounded-2xl p-4 border border-charcoal-border/70 shadow-soft flex flex-col sm:flex-row gap-3 items-center justify-between">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, phone, order #..."
            className="w-full pl-9 pr-4 py-2 bg-cream-50 rounded-xl border border-charcoal-border/80 text-xs focus:outline-none focus:ring-2 focus:ring-brand/30"
          />
        </div>

        {/* Status Filter Buttons */}
        <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          {['all', 'new', 'confirmed', 'shipped', 'delivered', 'cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                statusFilter === st
                  ? 'bg-charcoal text-white shadow-xs'
                  : 'bg-cream-100 text-charcoal-light hover:bg-cream-200 hover:text-charcoal'
              }`}
            >
              {st === 'all' ? 'All' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-charcoal-border/70 shadow-soft overflow-hidden">
        {isLoading ? (
          <div className="py-20 text-center space-y-3">
            <RefreshCw className="w-8 h-8 animate-spin text-brand mx-auto" />
            <p className="text-xs text-charcoal-muted font-bold">Loading live store orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-20 text-center space-y-3">
            <ShoppingBag className="w-10 h-10 text-charcoal-muted mx-auto" />
            <h3 className="text-base font-black text-charcoal">No Orders Found</h3>
            <p className="text-xs text-charcoal-muted max-w-sm mx-auto">
              New customer orders will appear here automatically when placed through the website.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-cream-100/70 border-b border-charcoal-border/60 text-charcoal-muted uppercase text-[10px] tracking-wider font-bold">
                  <th className="py-3.5 px-4">Order #</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">City / Area</th>
                  <th className="py-3.5 px-4">Total Amount</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal-border/40 text-charcoal font-medium">
                {filteredOrders.map((order) => {
                  const badge = STATUS_BADGES[order.status] || STATUS_BADGES.new;
                  return (
                    <tr key={order.id} className="hover:bg-cream-50/50 transition-colors">
                      {/* Order Number & Date */}
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-xs text-charcoal block">{order.order_number}</span>
                        <span className="text-[10px] text-charcoal-muted block">
                          {order.created_at ? new Date(order.created_at).toLocaleDateString('en-PK', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          }) : 'Just now'}
                        </span>
                      </td>

                      {/* Customer Details */}
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-xs text-charcoal block">{order.customer_name}</span>
                        <span className="text-[10px] text-charcoal-muted block font-mono">
                          {order.customer_phone}
                        </span>
                      </td>

                      {/* Destination City */}
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-full bg-cream-100 text-charcoal text-[11px] font-semibold">
                          {order.city}
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
