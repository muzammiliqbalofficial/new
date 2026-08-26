'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const FAQS = [
  {
    question: 'How long does delivery take across Pakistan?',
    answer:
      'We deliver nationwide across Pakistan via trusted courier partners. Deliveries to major cities like Karachi, Lahore, Islamabad, and Rawalpindi take 2–3 working days. Deliveries to other cities and towns take 3–4 working days.',
  },
  {
    question: 'Is Cash on Delivery (COD) available?',
    answer:
      'Yes! We offer 100% Cash on Delivery (COD) across Pakistan. You pay in cash when the parcel arrives at your doorstep.',
  },
  {
    question: 'What sizes are available for newborn babies and infants?',
    answer:
      'Our baby clothing collection covers newborns up to 24 months, including: 0–3 Months, 3–6 Months, 6–12 Months, and 12–18 Months. Size specifications are listed on each product detail page.',
  },
  {
    question: 'What is your Exchange & Return policy?',
    answer:
      'We offer an easy 7-day exchange guarantee. If you face any sizing issues or received a damaged item, simply WhatsApp us at +92 336 6895035 with your order reference number and we will process a replacement.',
  },
  {
    question: 'Are Tiny Kids baby clothes made from 100% pure cotton?',
    answer:
      'Yes! All our baby rompers, starter packs, and sleepsuits are crafted from premium, breathable, 100% pure combed cotton jersey that is hypoallergenic, tagless, and gentle on sensitive newborn skin.',
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  // Structured JSON-LD Schema for Google Rich FAQ Snippets
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <section className="py-12 sm:py-16 bg-cream-50/50">
      {/* Google FAQPage Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-brand-soft text-brand text-xs font-bold uppercase tracking-wider mb-2">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-charcoal tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-charcoal-muted mt-1">
            Everything you need to know about ordering baby clothes at Tiny Kids Pakistan
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-charcoal-border/70 overflow-hidden shadow-soft transition-all"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between font-bold text-xs sm:text-sm text-charcoal hover:text-brand transition-colors focus:outline-none"
                >
                  <span className="pr-4">{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-charcoal-muted flex-shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-brand' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 sm:px-5 pb-4 sm:pb-5 text-xs text-charcoal-muted leading-relaxed border-t border-charcoal-border/40 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
