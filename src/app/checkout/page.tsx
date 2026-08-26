'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Truck, ShieldCheck, ShoppingBag, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/formatters';
import { supabaseAdmin } from '@/lib/supabase';

const POPULAR_CITIES = [
  'Karachi',
  'Lahore',
  'Islamabad',
  'Rawalpindi',
  'Faisalabad',
  'Multan',
  'Peshawar',
  'Quetta',
  'Sialkot',
  'Gujranwala',
  'Hyderabad',
  'Other City',
];

export default function CheckoutPage() {
  const router = useRouter();
  const { cart: items, subtotal, clearCart } = useCart();
  const shippingFee = subtotal >= 3000 ? 0 : 250;
  const total = subtotal + shippingFee;

  const [formData, setFormData] = useState({
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    address: '',
    city: 'Karachi',
    custom_city: '',
    notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center space-y-6">
        <div className="w-16 h-16 bg-cream-100 rounded-full flex items-center justify-center mx-auto text-charcoal-muted">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-black text-charcoal">Your cart is empty</h1>
        <p className="text-sm text-charcoal-light max-w-sm mx-auto">
          Please add items to your cart before proceeding to checkout.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center space-x-2 px-6 py-3 bg-brand text-white font-bold text-sm rounded-2xl shadow-card hover:bg-brand-dark transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Continue Shopping</span>
        </Link>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.customer_name.trim() || !formData.customer_phone.trim() || !formData.address.trim()) {
      setErrorMsg('Please complete all required fields (Name, Phone, and Delivery Address).');
      return;
    }

    const phoneClean = formData.customer_phone.replace(/[^0-9]/g, '');
    if (phoneClean.length < 10) {
      setErrorMsg('Please enter a valid 11-digit Pakistani phone number (e.g. 03001234567).');
      return;
    }

    const selectedCity = formData.city === 'Other City' ? formData.custom_city || 'Other' : formData.city;

    setIsSubmitting(true);

    try {
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const orderNumber = `TK-${randomSuffix}`;

      // 1. Insert into Supabase Orders table
      const { data: newOrder, error: orderErr } = await supabaseAdmin
        .from('orders')
        .insert({
          order_number: orderNumber,
          customer_name: formData.customer_name.trim(),
          customer_phone: phoneClean,
          customer_email: formData.customer_email.trim() || null,
          address: formData.address.trim(),
          city: selectedCity,
          notes: formData.notes.trim() || null,
          subtotal: Number(subtotal) || 0,
          shipping_fee: Number(shippingFee) || 0,
          total: Number(total) || 0,
          status: 'new',
        })
        .select()
        .single();

      if (orderErr || !newOrder) {
        console.warn('Database order insert issue:', orderErr);
      }

      // 2. Insert order items
      if (newOrder && items.length > 0) {
        const orderItemsPayload = items.map((item) => ({
          order_id: newOrder.id,
          product_id: item.id || null,
          product_name: item.name,
          unit_price: Number(item.price) || 0,
          quantity: Number(item.quantity) || 1,
          line_total: (Number(item.price) || 0) * (Number(item.quantity) || 1),
        }));

        await supabaseAdmin.from('order_items').insert(orderItemsPayload);
      }

      const orderSummary = {
        order_number: orderNumber,
        customer_name: formData.customer_name,
        customer_phone: phoneClean,
        address: formData.address,
        city: selectedCity,
        notes: formData.notes,
        items: items.map((i) => ({ name: i.name, quantity: i.quantity, price: i.price })),
        subtotal,
        shipping_fee: shippingFee,
        total,
        created_at: new Date().toISOString(),
      };

      if (typeof window !== 'undefined') {
        localStorage.setItem('tk_last_order', JSON.stringify(orderSummary));
      }

      clearCart();
      router.push(
        `/checkout/success/?order=${orderNumber}&name=${encodeURIComponent(
          formData.customer_name
        )}&total=${total}`
      );
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Error placing order. Please try again or order via WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="mb-8">
        <Link
          href="/cart"
          className="inline-flex items-center text-xs font-semibold text-charcoal-muted hover:text-charcoal transition-colors mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1" />
          <span>Back to Cart</span>
        </Link>
        <h1 className="text-2xl sm:text-4xl font-black text-charcoal tracking-tight">
          Checkout — Cash on Delivery
        </h1>
        <p className="text-xs sm:text-sm text-charcoal-muted mt-1">
          Complete your delivery details to place your baby clothing order
        </p>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 rounded-2xl bg-coral/10 border border-coral/30 text-coral text-xs font-bold">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left: Customer & Delivery Details */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-charcoal-border/70 shadow-soft space-y-5">
              <h2 className="text-base font-bold text-charcoal uppercase tracking-wider pb-3 border-b border-charcoal-border/50">
                1. Delivery & Contact Details
              </h2>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-charcoal mb-1.5 uppercase">
                  Full Name <span className="text-coral">*</span>
                </label>
                <input
                  type="text"
                  name="customer_name"
                  value={formData.customer_name}
                  onChange={handleChange}
                  placeholder="e.g. Fatima Ali / Muhammad Usman"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-charcoal-border/80 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
                />
              </div>

              {/* Phone & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-charcoal mb-1.5 uppercase">
                    Phone / WhatsApp Number <span className="text-coral">*</span>
                  </label>
                  <input
                    type="tel"
                    name="customer_phone"
                    value={formData.customer_phone}
                    onChange={handleChange}
                    placeholder="0300 1234567"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-charcoal-border/80 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand font-mono"
                  />
                  <span className="text-[10px] text-charcoal-muted mt-1 block">
                    We will send order tracking updates via WhatsApp/SMS.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal mb-1.5 uppercase">
                    Email Address <span className="text-charcoal-muted font-normal">(Optional)</span>
                  </label>
                  <input
                    type="email"
                    name="customer_email"
                    value={formData.customer_email}
                    onChange={handleChange}
                    placeholder="example@mail.com"
                    className="w-full px-4 py-3 rounded-xl border border-charcoal-border/80 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
                  />
                </div>
              </div>

              {/* City Selection */}
              <div>
                <label className="block text-xs font-bold text-charcoal mb-1.5 uppercase">
                  Destination City <span className="text-coral">*</span>
                </label>
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-charcoal-border/80 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand font-medium"
                >
                  {POPULAR_CITIES.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              {formData.city === 'Other City' && (
                <div>
                  <label className="block text-xs font-bold text-charcoal mb-1.5 uppercase">
                    Type Your City Name <span className="text-coral">*</span>
                  </label>
                  <input
                    type="text"
                    name="custom_city"
                    value={formData.custom_city}
                    onChange={handleChange}
                    placeholder="Enter your city / town"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-charcoal-border/80 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
                  />
                </div>
              )}

              {/* Full Address */}
              <div>
                <label className="block text-xs font-bold text-charcoal mb-1.5 uppercase">
                  Complete Delivery Address <span className="text-coral">*</span>
                </label>
                <textarea
                  name="address"
                  rows={3}
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="House / Flat #, Street, Block / Sector, Landmark"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-charcoal-border/80 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand resize-none"
                />
              </div>

              {/* Order Notes */}
              <div>
                <label className="block text-xs font-bold text-charcoal mb-1.5 uppercase">
                  Special Delivery Instructions <span className="text-charcoal-muted font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="e.g. Call before delivery, deliver after 3pm"
                  className="w-full px-4 py-3 rounded-xl border border-charcoal-border/80 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
                />
              </div>
            </div>

            {/* Payment Method Badge */}
            <div className="bg-white rounded-3xl p-6 border border-charcoal-border/70 shadow-soft space-y-3">
              <h2 className="text-base font-bold text-charcoal uppercase tracking-wider pb-3 border-b border-charcoal-border/50">
                2. Payment Method
              </h2>
              <div className="p-4 rounded-2xl bg-brand-soft/50 border-2 border-brand flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 rounded-full bg-brand flex items-center justify-center text-white">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-charcoal block">Cash on Delivery (COD)</span>
                    <span className="text-xs text-charcoal-light">
                      Pay cash to courier upon receiving your baby parcel.
                    </span>
                  </div>
                </div>
                <Truck className="w-5 h-5 text-brand hidden sm:block" />
              </div>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-charcoal-border/70 shadow-soft space-y-5 sticky top-28">
              <h2 className="text-base font-bold text-charcoal uppercase tracking-wider pb-3 border-b border-charcoal-border/50">
                Order Summary ({items.length} {items.length === 1 ? 'Item' : 'Items'})
              </h2>

              {/* Items List */}
              <div className="divide-y divide-charcoal-border/40 max-h-64 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <div className="relative w-11 h-11 rounded-xl bg-cream-50 overflow-hidden flex-shrink-0 border border-charcoal-border/40">
                        <Image
                          src={item.imageStem}
                          alt={item.name}
                          fill
                          sizes="44px"
                          className="object-contain object-center"
                        />
                      </div>
                      <div className="min-w-0">
                        <span className="font-semibold text-charcoal truncate block">{item.name}</span>
                        <span className="text-charcoal-muted">Qty: {item.quantity}</span>
                      </div>
                    </div>
                    <span className="font-bold text-charcoal whitespace-nowrap">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Calculation Breakdown */}
              <div className="pt-3 border-t border-charcoal-border/50 space-y-2 text-xs">
                <div className="flex justify-between text-charcoal-light">
                  <span>Subtotal</span>
                  <span className="font-semibold text-charcoal">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-charcoal-light">
                  <span>Delivery Charges (Nationwide)</span>
                  <span className="font-semibold text-charcoal">
                    {shippingFee === 0 ? <span className="text-brand font-bold">FREE</span> : formatPrice(shippingFee)}
                  </span>
                </div>
                <div className="pt-3 border-t border-charcoal-border/60 flex justify-between items-baseline text-sm sm:text-base">
                  <span className="font-black text-charcoal">Total Payable</span>
                  <span className="text-lg sm:text-xl font-black text-brand">{formatPrice(total)}</span>
                </div>
              </div>

              {/* Place Order CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-brand hover:bg-brand-dark text-white font-black text-sm rounded-2xl shadow-card hover:shadow-hover transition-all flex items-center justify-center space-x-2 active:scale-98 disabled:opacity-70 cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Placing Your Order...</span>
                ) : (
                  <>
                    <span>Confirm Order (Cash on Delivery)</span>
                  </>
                )}
              </button>

              <div className="pt-2 text-center">
                <span className="text-[11px] text-charcoal-muted flex items-center justify-center space-x-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-brand" />
                  <span>100% Safe Checkout • 7-Day Easy Returns</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
