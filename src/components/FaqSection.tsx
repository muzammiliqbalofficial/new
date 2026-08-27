'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const FAQS = [
  {
    question: 'Kitne din me delivery mil jayegi? (How many days for delivery?)',
    answer:
      'Karachi, Lahore, Islamabad aur Rawalpindi me delivery 2 se 3 working days me ho jati hai. Baki tamam cities aur towns me 3 se 4 days lagte hain.',
  },
  {
    question: 'Kya Cash on Delivery (COD) available hai?',
    answer:
      'Jee bilkul! Poore Pakistan me 100% Cash on Delivery (COD) available hai. Courier rider jab parcel aapke ghar le kar aayega, tab aapne cash pay karna hai.',
  },
  {
    question: 'Kapray 100% cotton hain?',
    answer:
      'Jee haan, hamare tamam newborn starter gift sets aur baby rompers 100% pure combed cotton jersey se bane hain jo baby ki soft skin ke liye bilkul safe aur comfortable hain.',
  },
  {
    question: 'Agar size chota ya bara ho jaye tou exchange ho jayega?',
    answer:
      'Jee haan, 7 days ki easy exchange policy hai. Aap direct hamare WhatsApp number 0336-6895035 par order number share kar ke size exchange karwa sakte hain.',
  },
  {
    question: 'Free delivery kab milti hai?',
    answer:
      'Rs. 2,999 ya us se zyada ke order par delivery poore Pakistan me bilkul FREE hai.',
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
          Aapke Sawalat aur Jawab (FAQs)
        </h2>
        <p className="text-xs sm:text-sm text-charcoal-muted font-medium">
          Delivery, payment aur kapron ke mutalliq ahem sawalat
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
        <span className="font-bold text-charcoal block">Koi aur sawal hai? WhatsApp par direct rabta karein:</span>
        <a
          href="https://wa.me/923366895035"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-1.5 px-4 py-2 bg-[#25D366] text-white rounded-xl font-bold shadow-xs hover:bg-[#20bd5a] transition-colors"
        >
          <span>Chat on WhatsApp: 0336-6895035</span>
        </a>
      </div>
    </section>
  );
}
