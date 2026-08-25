import React from 'react';
import type { Metadata } from 'next';
import Breadcrumbs from '@/components/Breadcrumbs';
import { Phone, Mail, MapPin, MessageCircle, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with Tiny Kids customer support via WhatsApp, phone, or email.',
};

export default function ContactPage() {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '923000000000';
  const cleanPhone = whatsappNumber.replace(/[^0-9]/g, '');

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      <Breadcrumbs items={[{ label: 'Contact Us' }]} />

      <div className="bg-white rounded-3xl p-6 sm:p-12 border border-charcoal-border/70 shadow-soft space-y-8">
        <div className="space-y-2">
          <span className="text-xs font-bold text-brand uppercase tracking-wider">Customer Support</span>
          <h1 className="text-2xl sm:text-3xl font-black text-charcoal tracking-tight">We’re Here to Help!</h1>
          <p className="text-xs sm:text-sm text-charcoal-muted">
            Have questions about product sizes, your delivery, or custom orders? Reach out anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* WhatsApp Card */}
          <div className="p-6 rounded-2xl bg-cream-50 border border-charcoal-border/60 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#25D366]/20 text-[#25D366] flex items-center justify-center">
              <MessageCircle className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-charcoal">WhatsApp Direct Helpline</h3>
            <p className="text-xs text-charcoal-muted">
              Get instant responses for order tracking, size suggestions, and photos.
            </p>
            <a
              href={`https://wa.me/${cleanPhone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 text-xs font-bold text-[#128C7E] hover:underline"
            >
              <span>Chat with us on WhatsApp →</span>
            </a>
          </div>

          {/* Email Card */}
          <div className="p-6 rounded-2xl bg-cream-50 border border-charcoal-border/60 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-brand/10 text-brand flex items-center justify-center">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-charcoal">Email Support</h3>
            <p className="text-xs text-charcoal-muted">
              For corporate inquiries, feedback, or formal order queries.
            </p>
            <span className="text-xs font-semibold text-charcoal block">
              {process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'info@tinykids.pk'}
            </span>
          </div>

          {/* Hours Card */}
          <div className="p-6 rounded-2xl bg-cream-50 border border-charcoal-border/60 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-brand/10 text-brand flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-charcoal">Operating Hours</h3>
            <p className="text-xs text-charcoal-muted">
              Monday to Saturday: 10:00 AM – 8:00 PM (PKT)<br />
              Sunday: WhatsApp inquiries answered periodically
            </p>
          </div>

          {/* Delivery Card */}
          <div className="p-6 rounded-2xl bg-cream-50 border border-charcoal-border/60 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-brand/10 text-brand flex items-center justify-center">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-charcoal">Nationwide Delivery</h3>
            <p className="text-xs text-charcoal-muted">
              Orders dispatched daily from Lahore/Karachi hub via premium courier partners.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
