'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin, MessageCircle, Clock, ChevronRight, CheckCircle2, Send } from 'lucide-react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !message) return;

    // Send to WhatsApp / Notify
    const text = `Assalam o Alaikum tinykids.pk!\n\n*Name:* ${name}\n*Phone:* ${phone}\n*Message:* ${message}`;
    const waUrl = `https://wa.me/923366895035?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-xs text-charcoal-muted font-medium">
        <Link href="/" className="hover:text-brand transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-charcoal font-bold">Contact Us</span>
      </nav>

      {/* Header */}
      <div className="border-b border-charcoal-border/60 pb-6 space-y-2">
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-brand block">
          Customer Support Helpline
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-charcoal tracking-tight">
          Get in Touch with tinykids.pk
        </h1>
        <p className="text-xs sm:text-sm text-charcoal-muted max-w-2xl leading-relaxed">
          Have a question about sizes, delivery tracking, or order placement? Our customer care team is here to assist you 7 days a week.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Contact Details Column */}
        <div className="space-y-4">
          <div className="p-5 rounded-3xl bg-cream-50/80 border border-charcoal-border/70 space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-[#25D366]/10 text-[#25D366] flex items-center justify-center flex-shrink-0">
                <MessageCircle className="w-5 h-5 fill-current" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-charcoal-muted uppercase block">Official WhatsApp</span>
                <a
                  href="https://wa.me/923366895035"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-extrabold text-sm text-charcoal hover:text-brand transition-colors"
                >
                  +92 336 6895035
                </a>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-cream-50/80 border border-charcoal-border/70 space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-brand-soft text-brand flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-charcoal-muted uppercase block">Helpline Call</span>
                <a
                  href="tel:+923366895035"
                  className="font-extrabold text-sm text-charcoal hover:text-brand transition-colors"
                >
                  0336-6895035
                </a>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-cream-50/80 border border-charcoal-border/70 space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-brand-soft text-brand flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-charcoal-muted uppercase block">Email Inquiries</span>
                <a
                  href="mailto:info@tinykids.pk"
                  className="font-extrabold text-sm text-charcoal hover:text-brand transition-colors"
                >
                  info@tinykids.pk
                </a>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-cream-50/80 border border-charcoal-border/70 space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-brand-soft text-brand flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-charcoal-muted uppercase block">Working Hours</span>
                <span className="font-extrabold text-sm text-charcoal">
                  Monday – Sunday: 9:00 AM – 10:00 PM
                </span>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-cream-50/80 border border-charcoal-border/70 space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-brand-soft text-brand flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-charcoal-muted uppercase block">Dispatch Hub</span>
                <span className="font-extrabold text-sm text-charcoal">
                  Karachi, Pakistan — Delivering Nationwide
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form Column */}
        <div className="p-6 sm:p-8 bg-white rounded-3xl border border-charcoal-border/70 shadow-soft space-y-4">
          <h2 className="font-extrabold text-lg text-charcoal tracking-tight">Send Us a Direct Message</h2>
          <p className="text-xs text-charcoal-muted font-medium">
            Fill out the quick form below and our team will get back to you immediately on WhatsApp.
          </p>

          {submitted ? (
            <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl flex items-center space-x-2 font-bold text-xs">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span>Thank you! Your message has been forwarded to our WhatsApp team.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-charcoal block">Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Fatima Ali"
                  className="w-full px-4 py-2.5 bg-cream-50 rounded-xl border border-charcoal-border/80 focus:outline-none focus:ring-2 focus:ring-brand/30"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-charcoal block">Phone / WhatsApp Number *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 0333 1234567"
                  className="w-full px-4 py-2.5 bg-cream-50 rounded-xl border border-charcoal-border/80 focus:outline-none focus:ring-2 focus:ring-brand/30"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-charcoal block">How can we help? *</label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Inquire about a baby product, size availability, or delivery tracking..."
                  className="w-full px-4 py-2.5 bg-cream-50 rounded-xl border border-charcoal-border/80 focus:outline-none focus:ring-2 focus:ring-brand/30"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-brand hover:bg-brand-dark text-white font-extrabold text-xs rounded-2xl shadow-card hover:shadow-hover transition-all flex items-center justify-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Send Message via WhatsApp</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}