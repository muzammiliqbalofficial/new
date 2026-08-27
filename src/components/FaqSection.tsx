'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Phone } from 'lucide-react';

const FAQS = [
  {
    question: 'How many days does delivery take across Pakistan?',
    answer:
      'Deliveries to major cities like Karachi, Lahore, Islamabad, and Rawalpindi take 2 to 3 working days. Deliveries to all other cities and towns across Pakistan take 3 to 4 working days.',
  },
  {
    question: 'Is Cash on Delivery (COD) available?',
    answer:
      'Yes! We offer 100% Cash on Delivery nationwide. You pay in cash directly to the courier rider when your parcel arrives at your doorstep.',
  },
  {
    question: 'Are the baby clothes 100% pure cotton?',
    answer:
      'Yes, all our newborn starter gift sets, rompers, and suits are made with 100% pure combed cotton to ensure maximum softness and safety for delicate baby skin.',
  },
  {
    question: 'Can I exchange the size if it does not fit?',
    answer:
      'Yes, we offer a hassle-free 7-day exchange policy. Simply message our WhatsApp helpline at 0336-6895035 with your order reference number and we will exchange the size for you.',
  },
  {
    question: 'How do I qualify for Free Shipping?',
    answer:
      'Free shipping is automatically applied on all orders of Rs. 2,999 or more anywhere in Pakistan.',
  },
];

export default function FaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-brand-soft text-brand text-xs font-extrabold">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Frequently Asked Questions</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-charcoal tracking-tight">
          Questions & Answers
        </h2>
        <p className="text-xs sm:text-sm text-charcoal-muted font-medium">
          Everything you need to know about shipping, payments, and sizing
        </p>
      </div>

      <div className="space-y-3">
        {FAQS.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="border border-charcoal-border/70 rounded-2xl bg-white overflow-hidden shadow-xs transition-all"
            >
              <button
                onClick={() => toggle(idx)}
                className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 hover:bg-cream-50 transition-colors"
                aria-expanded={isOpen}
              >
                <span className="text-xs sm:text-sm font-extrabold text-charcoal">{faq.question}</span>
                <ChevronDown
                  className={`w-4 h-4 text-charcoal-muted flex-shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-brand' : ''
                  }`}
                />
              </button>
              {isOpen && (
                <div className="px-5 pb-4 pt-1 text-xs text-charcoal-muted leading-relaxed font-medium border-t border-charcoal-border/40">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* WhatsApp Help Prompt */}
      <div className="p-4 rounded-2xl bg-cream-100/70 border border-charcoal-border/60 text-center space-y-2 text-xs">
        <span className="font-bold text-charcoal block">Have more questions? Contact our team on WhatsApp:</span>
        <a
          href="https://wa.me/923366895035"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-1.5 px-4 py-2 bg-[#25D366] text-white rounded-xl font-bold shadow-xs hover:bg-[#20bd5a] transition-colors"
        >
          <Phone className="w-3.5 h-3.5" />
          <span>Chat on WhatsApp: 0336-6895035</span>
        </a>
      </div>
    </section>
  );
}
