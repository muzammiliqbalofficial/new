'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  Truck,
  ShieldCheck,
  ShoppingBag,
  ArrowLeft,
  CheckCircle2,
  Gift,
  Tag,
  Sparkles,
  Phone,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice, getR2ImageUrl } from '@/lib/formatters';
import { sendOrderEmailNotification } from '@/lib/order-notifier';
import { trackInitiateCheckout } from '@/lib/tracking';

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
  const {
    cart: items,
    subtotal,
    clearCart,
    couponCode,
    discount,
    applyCoupon,
    removeCoupon,
    isGiftBox,
    setIsGiftBox,
    giftMessage,
    setGiftMessage,
    giftBoxFee,
    shippingFee,
    finalTotal,
  } = useCart();

  const [inputCode, setInputCode] = useState('');
  const [couponMsg, setCouponMsg] = useState<{ text: string; isError: boolean } | null>(null);

  useEffect(() => {
    if (items.length > 0) {
      trackInitiateCheckout(
        items.map((i) => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity })),
        finalTotal
      );
    }
  }, [items, finalTotal]);

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
        <h1 className="text-2xl font-black text-charcoal">Your bag is empty</h1>
        <p className="text-sm text-charcoal-light max-w-sm mx-auto">
          Please add baby clothes to your bag before proceeding to checkout.
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    const res = applyCoupon(inputCode);
    setCouponMsg({ text: res.message, isError: !res.success });
    if (res.success) setInputCode('');
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

      const fullNotes = [
        formData.notes.trim(),
        isGiftBox ? `[Gift Box Packaging (+Rs. 150): ${giftMessage || 'Yes'}]` : '',
        couponCode ? `[Coupon Applied: ${couponCode} (-Rs. ${discount})]` : '',
      ]
        .filter(Boolean)
        .join(' | ');

      // 1. Background Email Notification
      const orderDetails = {
        order_number: orderNumber,
        customer_name: formData.customer_name.trim(),
        customer_phone: phoneClean,
        customer_email: formData.customer_email.trim() || undefined,
        city: selectedCity,
        address: formData.address.trim(),
        notes: fullNotes || undefined,
        items: items.map((i) => ({ name: i.name, quantity: i.quantity, price: i.price })),
        subtotal: Number(subtotal) || 0,
        shipping_fee: Number(shippingFee) || 0,
        total: Number(finalTotal) || 0,
      };

      sendOrderEmailNotification(orderDetails);

      // 2. Save order via admin-api worker
      try {
        const orderPayload = {
          order_number: orderNumber,
          customer_name: formData.customer_name.trim(),
          customer_phone: phoneClean,
          customer_email: formData.customer_email.trim() || null,
          address: formData.address.trim(),
          city: selectedCity,
          notes: fullNotes || null,
          subtotal: Number(subtotal) || 0,
          shipping_fee: Number(shippingFee) || 0,
          total: Number(finalTotal) || 0,
          items: items.map((i) => ({
            product_name: i.name,
            unit_price: Number(i.price) || 0,
            quantity: Number(i.quantity) || 1,
            line_total: (Number(i.price) || 0) * (Number(i.quantity) || 1),
          })),
        };

        const orderRes = await fetch(`${process.env.NEXT_PUBLIC_ADMIN_API_URL}/orders/create`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderPayload),
        });

        if (!orderRes.ok) {
          console.warn('Order database insert failed:', await orderRes.text());
        }
      } catch (dbErr) {
        console.warn('Database background sync notice:', dbErr);
      }

      // 3. Save receipt locally
      const receiptData = {
        order_number: orderNumber,
        customer_name: formData.customer_name.trim(),
        customer_phone: phoneClean,
        customer_email: formData.customer_email.trim(),
        city: selectedCity,
        address: formData.address.trim(),
        notes: fullNotes,
        items: [...items],
        subtotal,
        shipping_fee: shippingFee,
        discount,
        gift_box_fee: giftBoxFee,
        total: finalTotal,
        created_at: new Date().toISOString(),
      };
      sessionStorage.setItem('last_order', JSON.stringify(receiptData));

      clearCart();
      router.push('/checkout/success');
    } catch (err: any) {
      console.error('Checkout submission error:', err);
      setErrorMsg('An error occurred while placing your order. Please try again or WhatsApp us.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Top Breadcrumb */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/products"
          className="inline-flex items-center space-x-1 text-xs font-bold text-charcoal-muted hover:text-charcoal transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Store</span>
        </Link>
        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          🔒 Secure 1-Page Checkout (Cash on Delivery)
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Column: Form */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 bg-white rounded-3xl border border-charcoal-border/70 shadow-soft space-y-6">
            <div>
              <h1 className="text-2xl font-extrabold text-charcoal tracking-tight">
                Delivery Details
              </h1>
              <p className="text-xs text-charcoal-muted mt-0.5 font-medium">
                Enter your address for fast Cash on Delivery across Pakistan.
              </p>
            </div>

            {errorMsg && (
              <div className="p-4 bg-coral/10 border border-coral/30 text-coral text-xs font-bold rounded-2xl">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="font-extrabold text-charcoal block">Full Name *</label>
                <input
                  type="text"
                  name="customer_name"
                  required
                  value={formData.customer_name}
                  onChange={handleChange}
                  placeholder="e.g. Ayesha Khan"
                  className="w-full px-4 py-3 bg-cream-50 rounded-2xl border border-charcoal-border/80 text-xs text-charcoal font-medium focus:outline-none focus:ring-2 focus:ring-brand/30"
                />
              </div>

              {/* Phone Number */}
              <div className="space-y-1.5">
                <label className="font-extrabold text-charcoal block">
                  WhatsApp / Mobile Phone Number *
                </label>
                <input
                  type="tel"
                  name="customer_phone"
                  required
                  value={formData.customer_phone}
                  onChange={handleChange}
                  placeholder="03001234567 (Courier rider will call on this number)"
                  className="w-full px-4 py-3 bg-cream-50 rounded-2xl border border-charcoal-border/80 text-xs text-charcoal font-medium focus:outline-none focus:ring-2 focus:ring-brand/30"
                />
              </div>

              {/* Street Address */}
              <div className="space-y-1.5">
                <label className="font-extrabold text-charcoal block">
                  Complete Delivery Address *
                </label>
                <textarea
                  name="address"
                  rows={2}
                  required
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="House / Flat No., Street, Sector / Area, Landmark"
                  className="w-full px-4 py-3 bg-cream-50 rounded-2xl border border-charcoal-border/80 text-xs text-charcoal font-medium focus:outline-none focus:ring-2 focus:ring-brand/30"
                />
              </div>

              {/* City Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-extrabold text-charcoal block">City *</label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-cream-50 rounded-2xl border border-charcoal-border/80 text-xs text-charcoal font-bold focus:outline-none focus:ring-2 focus:ring-brand/30"
                  >
                    {POPULAR_CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                {formData.city === 'Other City' && (
                  <div className="space-y-1.5 animate-in fade-in">
                    <label className="font-extrabold text-charcoal block">Enter Your City Name *</label>
                    <input
                      type="text"
                      name="custom_city"
                      required
                      value={formData.custom_city}
                      onChange={handleChange}
                      placeholder="e.g. Sargodha, Abbottabad, etc."
                      className="w-full px-4 py-3 bg-cream-50 rounded-2xl border border-charcoal-border/80 text-xs text-charcoal font-medium focus:outline-none focus:ring-2 focus:ring-brand/30"
                    />
                  </div>
                )}
              </div>

              {/* Gift Box Option */}
              <div className="p-4 rounded-2xl bg-cream-50/80 border border-charcoal-border/70 space-y-2">
                <label className="flex items-start space-x-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isGiftBox}
                    onChange={(e) => setIsGiftBox(e.target.checked)}
                    className="w-4 h-4 mt-0.5 text-brand rounded border-charcoal-border focus:ring-brand accent-brand"
                  />
                  <div className="flex-1">
                    <span className="font-extrabold text-charcoal flex items-center space-x-1.5">
                      <Gift className="w-3.5 h-3.5 text-coral" />
                      <span>Add Luxury Baby Gift Box &amp; Greeting Card (+Rs. 150)</span>
                    </span>
                    <p className="text-[11px] text-charcoal-muted leading-tight mt-0.5">
                      Personalized greeting card with custom message and magnetic gift box.
                    </p>
                  </div>
                </label>

                {isGiftBox && (
                  <div className="pl-6 pt-1 space-y-1">
                    <input
                      type="text"
                      value={giftMessage}
                      onChange={(e) => setGiftMessage(e.target.value)}
                      placeholder="Custom message on greeting card (e.g. Welcome baby! Love Mamu)"
                      className="w-full px-3 py-2 bg-white rounded-xl border border-charcoal-border/80 text-xs text-charcoal focus:outline-none focus:ring-2 focus:ring-brand/30 font-medium"
                    />
                  </div>
                )}
              </div>

              {/* Order Notes (Optional) */}
              <div className="space-y-1.5">
                <label className="font-bold text-charcoal block">Special Delivery Notes (Optional)</label>
                <input
                  type="text"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="e.g. Please deliver after 3 PM / Call before coming"
                  className="w-full px-4 py-2.5 bg-cream-50 rounded-2xl border border-charcoal-border/80 text-xs text-charcoal font-medium focus:outline-none focus:ring-2 focus:ring-brand/30"
                />
              </div>

              {/* Payment Method Info */}
              <div className="p-4 bg-cream-50 rounded-2xl border border-charcoal-border/70 flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-xs flex-shrink-0">
                  COD
                </div>
                <div>
                  <span className="font-extrabold text-charcoal block text-xs">
                    Cash on Delivery (COD)
                  </span>
                  <span className="text-[11px] text-charcoal-muted block font-medium">
                    Pay in cash to courier rider when parcel reaches your doorstep.
                  </span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-brand hover:bg-brand-dark disabled:opacity-50 text-white font-extrabold text-sm rounded-2xl shadow-card hover:shadow-hover transition-all flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <span>Processing Your Order...</span>
                ) : (
                  <span>Confirm Order — {formatPrice(finalTotal)} (COD)</span>
                )}
              </button>

              {/* WhatsApp Alternative */}
              <div className="pt-2 border-t border-charcoal-border/40">
                <a
                  href={
                    'https://wa.me/923366895035?text=' +
                    encodeURIComponent(
                      'Assalam o Alaikum tinykids.pk! I want to place this order on WhatsApp:\n\n' +
                        items
                          .map((i) => `• ${i.name} (Qty: ${i.quantity}) - Rs. ${i.price * i.quantity}`)
                          .join('\n') +
                        `\n\nSubtotal: Rs. ${subtotal}\nShipping: Rs. ${shippingFee}\nTotal: Rs. ${finalTotal}\n\nName: ${
                          formData.customer_name || 'Customer'
                        }\nPhone: ${formData.customer_phone || ''}\nAddress: ${formData.address || ''}, ${
                          formData.city === 'Other City' ? formData.custom_city : formData.city
                        }`
                    )
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 bg-[#25D366] hover:bg-[#20bd5a] text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-xs transition-colors flex items-center justify-center space-x-2"
                >
                  <Phone className="w-4 h-4 fill-current" />
                  <span>Or Order Directly via WhatsApp</span>
                </a>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Order Summary & Coupon */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 bg-white rounded-3xl border border-charcoal-border/70 shadow-soft space-y-5">
            <h2 className="text-lg font-extrabold text-charcoal tracking-tight border-b border-charcoal-border/50 pb-3">
              Order Summary ({items.reduce((a, b) => a + b.quantity, 0)} Items)
            </h2>

            {/* Items List */}
            <div className="divide-y divide-charcoal-border/40 max-h-72 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.id} className="py-3 first:pt-0 last:pb-0 flex items-center space-x-3">
                  <div className="relative w-12 h-12 rounded-xl bg-cream-50 overflow-hidden flex-shrink-0 border border-charcoal-border/50">
                    <Image
                      src={getR2ImageUrl(item.imageStem, '300w')}
                      alt={item.name}
                      fill
                      sizes="48px"
                      className="object-contain p-0.5"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-charcoal line-clamp-1">{item.name}</h4>
                    <span className="text-[11px] text-charcoal-muted font-medium">Qty: {item.quantity}</span>
                  </div>
                  <span className="text-xs font-black text-charcoal">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Promo Code Input */}
            <div className="pt-3 border-t border-charcoal-border/50">
              {couponCode ? (
                <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between text-xs font-bold text-emerald-800">
                  <span className="flex items-center space-x-1.5">
                    <Tag className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Coupon: <strong>{couponCode}</strong> (-Rs. {discount})</span>
                  </span>
                  <button onClick={removeCoupon} className="text-xs font-bold text-coral hover:underline">
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value)}
                    placeholder="Coupon Code (e.g. WELCOME200)"
                    className="flex-1 px-3 py-2 bg-cream-50 rounded-xl border border-charcoal-border/80 text-xs text-charcoal focus:outline-none focus:ring-1 focus:ring-brand uppercase font-medium"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-charcoal hover:bg-brand text-white font-bold text-xs rounded-xl transition-colors"
                  >
                    Apply
                  </button>
                </form>
              )}
              {couponMsg && (
                <p className={`text-[11px] font-bold mt-1 ${couponMsg.isError ? 'text-coral' : 'text-emerald-700'}`}>
                  {couponMsg.text}
                </p>
              )}
            </div>

            {/* Price Calculations */}
            <div className="space-y-2 text-xs pt-3 border-t border-charcoal-border/50">
              <div className="flex items-center justify-between text-charcoal-muted font-medium">
                <span>Subtotal</span>
                <span className="font-bold text-charcoal">{formatPrice(subtotal)}</span>
              </div>

              {isGiftBox && (
                <div className="flex items-center justify-between text-charcoal-muted font-medium">
                  <span className="flex items-center space-x-1">
                    <Gift className="w-3 h-3 text-coral" />
                    <span>Gift Box &amp; Greeting Card</span>
                  </span>
                  <span className="font-bold text-charcoal">+Rs. 150</span>
                </div>
              )}

              <div className="flex items-center justify-between text-charcoal-muted font-medium">
                <span>Nationwide Delivery</span>
                <span className="font-bold text-charcoal">
                  {shippingFee === 0 ? (
                    <span className="text-emerald-700 font-extrabold">FREE (Orders &gt; PKR 2,500)</span>
                  ) : (
                    'Rs. 199'
                  )}
                </span>
              </div>

              {discount > 0 && (
                <div className="flex items-center justify-between text-emerald-700 font-bold">
                  <span>Discount Code ({couponCode})</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}

              <div className="flex items-center justify-between text-sm font-black text-charcoal pt-3 border-t border-charcoal-border/60">
                <span>Final Payable Amount</span>
                <span className="text-lg font-black text-brand">{formatPrice(finalTotal)}</span>
              </div>
            </div>
          </div>

          {/* Guarantees */}
          <div className="p-4 bg-cream-50/70 rounded-3xl border border-charcoal-border/60 space-y-2 text-xs text-charcoal-muted font-medium">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>7-Day Easy Exchange Policy on all baby outfits.</span>
            </div>
            <div className="flex items-center space-x-2">
              <Truck className="w-4 h-4 text-brand flex-shrink-0" />
              <span>Dispatches from Karachi via TCS / Leopards Courier.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}