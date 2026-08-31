'use client';

import React, { useState, useEffect } from 'react';
import { X, Copy, Check, Gift } from 'lucide-react';
import { useCart } from '@/context/CartContext';

const MODAL_SHOWN_KEY = 'tk_welcome_modal_shown_v1';

export default function WelcomeOfferModal() {
  const { applyCoupon } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        const shown = sessionStorage.getItem(MODAL_SHOWN_KEY);
        if (!shown) {
          // Show after 6 seconds of browsing
          const timer = setTimeout(() => {
            setIsOpen(true);
            try {
              sessionStorage.setItem(MODAL_SHOWN_KEY, 'true');
            } catch (e) {}
          }, 6000);
          return () => clearTimeout(timer);
        }
      }
    } catch (e) {
      console.warn('Welcome modal check notice:', e);
    }
  }, []);

  const handleCopyAndApply = () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        navigator.clipboard.writeText('WELCOME200');
      }
    } catch (e) {}
    applyCoupon('WELCOME200');
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
      setIsOpen(false);
    }, 1800);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-charcoal/60 backdrop-blur-sm transition-opacity animate-in fade-in"
        onClick={() => setIsOpen(false)}
      />

      {/* Modal Card */}
      <div className="relative bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border-2 border-brand/30 z-10 space-y-4 text-center animate-in zoom-in-95 duration-200">
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-3.5 right-3.5 p-1.5 rounded-full text-charcoal-muted hover:text-charcoal hover:bg-cream-100 transition-colors"
          aria-label="Close offer modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Icon */}
        <div className="w-14 h-14 rounded-2xl bg-coral/10 text-coral flex items-center justify-center mx-auto shadow-soft">
          <Gift className="w-7 h-7" />
        </div>

        {/* Text */}
        <div className="space-y-1">
          <span className="text-[11px] font-extrabold tracking-wide text-brand block">Welcome to <span className="lowercase font-black">tinykids.pk</span></span>
          <h3 className="text-xl font-extrabold text-charcoal tracking-tight">
            Flat Rs. 200 OFF on Your First Order!
          </h3>
          <p className="text-xs text-charcoal-muted font-medium leading-relaxed">
            Get an instant Rs. 200 discount on your newborn clothes or gift sets. Valid on orders above Rs. 1,000.
          </p>
        </div>

        {/* Coupon Code Pill */}
        <div className="p-3 bg-cream-50 rounded-2xl border border-charcoal-border/70 flex items-center justify-between">
          <div className="text-left">
            <span className="text-[9px] font-bold text-charcoal-muted uppercase block">Promo Code</span>
            <span className="text-sm font-black tracking-widest text-brand block">WELCOME200</span>
          </div>

          <button
            onClick={handleCopyAndApply}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1 shadow-xs ${
              copied
                ? 'bg-emerald-600 text-white'
                : 'bg-brand hover:bg-brand-dark text-white'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Applied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Apply Code</span>
              </>
            )}
          </button>
        </div>

        <button
          onClick={() => setIsOpen(false)}
          className="text-[11px] font-bold text-charcoal-muted hover:text-charcoal transition-colors underline underline-offset-2"
        >
          Continue Shopping &rarr;
        </button>
      </div>
    </div>
  );
}