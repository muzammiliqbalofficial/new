'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Truck, ShieldCheck, ShoppingBag, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice, buildWhatsAppOrderConfirmationLink } from '@/lib/formatters';

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
  'Abbottabad',
  'Bahawalpur',
  'Sargodha',
  'Sukkur',
  'Other City',
];

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, subtotal, clearCart } = useCart();

  const [formData, setFormData] = useState({
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    address: '',
    city: 'Lahore',
    custom_city: '',
    notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const shippingFlatRate = Number(process.env.NEXT_PUBLIC_SHIPPING_FLAT_RATE) || 200;
  const grandTotal = subtotal + (cart.length > 0 ? shippingFlatRate : 0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.customer_name.trim() || !formData.customer_phone.trim() || !formData.address.trim()) {
      setErrorMsg('Please complete all required fields (Name, Phone, and Delivery Address).');
      return;
    }

    // Clean phone number
    const phoneClean = formData.customer_phone.replace(/[^0-9]/g, '');
    if (phoneClean.length < 10) {
      setErrorMsg('Please enter a valid 11-digit Pakistani phone number (e.g. 03001234567).');
      return;
    }

    const selectedCity = formData.city === 'Other City' ? formData.custom_city || 'Other' : formData.city;

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: formData.customer_name.trim(),
          customer_phone: phoneClean,
          customer_email: formData.customer_email.trim() || null,
          address: formData.address.trim(),
          city: selectedCity,
          notes: formData.notes.trim() || null,
          subtotal,
          shipping_fee: shippingFlatRate,
          total: grandTotal,
          items: cart.map((i) => ({
            id: i.id,
            name: i.name,
            price: i.price,
            quantity: i.quantity,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to place order. Please try again.');
      }

      // Generate WhatsApp link
      const whatsappUrl = buildWhatsAppOrderConfirmationLink(
        data.order_number,
        formData.customer_name,
        grandTotal,
        cart.map((i) => ({ name: i.name, quantity: i.quantity }))
      );

      // Clear cart
      clearCart();

      // Attempt to open WhatsApp in new tab
      try {
        window.open(whatsappUrl, '_blank');
      } catch (waErr) {
        console.warn('Popup blocked for WhatsApp', waErr);
      }

      // Navigate to order confirmation success page
      router.push(
        `/checkout/success?order_number=${encodeURIComponent(data.order_number)}&name=${encodeURIComponent(
          formData.customer_name
        )}&total=${grandTotal}&whatsapp_url=${encodeURIComponent(whatsappUrl)}`
      );
    } catch (err: any) {
      console.error('Checkout error:', err);
      setErrorMsg(err.message || 'Something went wrong while placing your order. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <ShoppingBag className="w-12 h-12 text-brand mx-auto mb-3 opacity-60" />
        <h1 className="text-xl font-bold text-charcoal">Your cart is empty</h1>
        <p className="text-xs text-charcoal-muted mt-1">Please add items to your cart before proceeding to checkout.</p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center space-x-1.5 px-6 py-3 bg-brand text-white text-xs font-bold rounded-xl shadow-md"
        >
          <span>Return to Store</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/cart"
          className="text-xs font-semibold text-charcoal-muted hover:text-brand flex items-center space-x-1 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Cart</span>
        </Link>
        <span className="text-xs text-brand font-semibold flex items-center space-x-1">
          <ShieldCheck className="w-4 h-4 text-brand" />
          <span>Secure Cash on Delivery Checkout</span>
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Form: Delivery Address Details */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-charcoal-border/70 shadow-soft">
          <div className="border-b border-charcoal-border/50 pb-4 mb-6">
            <h1 className="text-xl sm:text-2xl font-black text-charcoal tracking-tight">
              Delivery Information
            </h1>
            <p className="text-xs text-charcoal-muted mt-1">
              Please provide your accurate delivery address in Pakistan for dispatch.
            </p>
          </div>

          {errorMsg && (
            <div className="mb-6 p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-charcoal mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="customer_name"
                required
                placeholder="e.g. Fatima Ali"
                value={formData.customer_name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-cream-50 border border-charcoal-border/80 rounded-xl text-xs sm:text-sm text-charcoal placeholder:text-charcoal-muted/60 focus:outline-none focus:ring-1 focus:ring-brand"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-bold text-charcoal mb-1">
                Phone Number (WhatsApp Active) <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="customer_phone"
                required
                placeholder="0300 1234567"
                value={formData.customer_phone}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-cream-50 border border-charcoal-border/80 rounded-xl text-xs sm:text-sm text-charcoal placeholder:text-charcoal-muted/60 focus:outline-none focus:ring-1 focus:ring-brand"
              />
              <span className="text-[10px] text-charcoal-muted mt-1 block">
                Rider will contact on this phone number before delivery.
              </span>
            </div>

            {/* Email (Optional) */}
            <div>
              <label className="block text-xs font-bold text-charcoal mb-1">
                Email Address <span className="text-charcoal-muted font-normal">(Optional)</span>
              </label>
              <input
                type="email"
                name="customer_email"
                placeholder="name@example.com"
                value={formData.customer_email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-cream-50 border border-charcoal-border/80 rounded-xl text-xs sm:text-sm text-charcoal placeholder:text-charcoal-muted/60 focus:outline-none focus:ring-1 focus:ring-brand"
              />
            </div>

            {/* Full Address */}
            <div>
              <label className="block text-xs font-bold text-charcoal mb-1">
                Complete Street Address <span className="text-red-500">*</span>
              </label>
              <textarea
                name="address"
                required
                rows={3}
                placeholder="House / Flat #, Street #, Sector / Area / Colony, Landmark"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-cream-50 border border-charcoal-border/80 rounded-xl text-xs sm:text-sm text-charcoal placeholder:text-charcoal-muted/60 focus:outline-none focus:ring-1 focus:ring-brand"
              />
            </div>

            {/* City */}
            <div>
              <label className="block text-xs font-bold text-charcoal mb-1">
                City <span className="text-red-500">*</span>
              </label>
              <select
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-cream-50 border border-charcoal-border/80 rounded-xl text-xs sm:text-sm text-charcoal focus:outline-none focus:ring-1 focus:ring-brand"
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
                <label className="block text-xs font-bold text-charcoal mb-1">
                  Specify City Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="custom_city"
                  required
                  placeholder="Enter your city"
                  value={formData.custom_city}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-cream-50 border border-charcoal-border/80 rounded-xl text-xs sm:text-sm text-charcoal focus:outline-none focus:ring-1 focus:ring-brand"
                />
              </div>
            )}

            {/* Order Notes (Optional) */}
            <div>
              <label className="block text-xs font-bold text-charcoal mb-1">
                Order Notes / Delivery Instructions <span className="text-charcoal-muted font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                name="notes"
                placeholder="e.g. Call before delivery, deliver after 2 PM"
                value={formData.notes}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-cream-50 border border-charcoal-border/80 rounded-xl text-xs sm:text-sm text-charcoal placeholder:text-charcoal-muted/60 focus:outline-none focus:ring-1 focus:ring-brand"
              />
            </div>

            {/* Payment Method Badge */}
            <div className="pt-3">
              <div className="p-4 rounded-2xl bg-brand-soft/80 border border-brand/20 flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <Truck className="w-5 h-5 text-brand" />
                  <div>
                    <span className="text-xs font-bold text-charcoal block">Cash on Delivery (COD)</span>
                    <span className="text-[11px] text-charcoal-muted">Pay in PKR cash upon parcel arrival</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-brand bg-white px-2.5 py-1 rounded-full border border-brand/20">
                  Selected
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-6 py-4 px-6 bg-brand hover:bg-brand-dark disabled:opacity-50 text-white font-bold text-sm sm:text-base rounded-2xl shadow-card transition-all flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                  <span>Placing Order...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Place Order • {formatPrice(grandTotal)}</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Order Summary Mini */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-charcoal-border/70 shadow-soft space-y-4">
          <h2 className="text-sm font-bold text-charcoal uppercase tracking-wider">
            Order Items ({cart.length})
          </h2>

          <div className="max-h-80 overflow-y-auto divide-y divide-charcoal-border/40 pr-1">
            {cart.map((item) => (
              <div key={item.id} className="py-3 flex items-center space-x-3 text-xs">
                <div className="relative w-12 h-12 rounded-xl bg-cream-100 overflow-hidden flex-shrink-0 border border-charcoal-border/40">
                  <Image
                    src={item.imageStem}
                    alt={item.name}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-charcoal line-clamp-1">{item.name}</h4>
                  <span className="text-charcoal-muted">Qty: {item.quantity}</span>
                </div>
                <span className="font-bold text-charcoal">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-charcoal-border/60 space-y-2 text-xs text-charcoal-light">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-charcoal">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping Fee (COD)</span>
              <span className="font-semibold text-charcoal">{formatPrice(shippingFlatRate)}</span>
            </div>
            <div className="pt-2 border-t border-charcoal-border/50 flex justify-between items-baseline text-sm font-bold text-charcoal">
              <span>Total Payable</span>
              <span className="text-lg font-black text-brand">{formatPrice(grandTotal)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
