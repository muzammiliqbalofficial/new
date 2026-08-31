'use client';

import React from 'react';
import { X, Ruler, Sparkles, ShieldCheck } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const SIZE_ROWS = [
  { age: '0 - 3 Months', chest: '18 in / 46 cm', length: '14 in / 36 cm', weight: '3 - 5.5 kg' },
  { age: '3 - 6 Months', chest: '19 in / 48 cm', length: '16 in / 41 cm', weight: '5.5 - 7.5 kg' },
  { age: '6 - 12 Months', chest: '20 in / 51 cm', length: '18 in / 46 cm', weight: '7.5 - 10 kg' },
  { age: '12 - 18 Months', chest: '21 in / 53 cm', length: '20 in / 51 cm', weight: '10 - 12 kg' },
  { age: '18 - 24 Months', chest: '22 in / 56 cm', length: '22 in / 56 cm', weight: '12 - 14 kg' },
];

export default function SizeChartModal({ isOpen, onClose }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-charcoal/60 backdrop-blur-sm transition-opacity" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-5 sm:p-8 shadow-2xl border border-charcoal-border/70 z-10 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-charcoal-border/50 pb-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-brand-soft text-brand flex items-center justify-center">
              <Ruler className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-charcoal">Baby Clothing Size Guide</h3>
              <p className="text-[11px] text-charcoal-muted font-medium">Standard measurements for Pakistani babies</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-charcoal-muted hover:text-charcoal hover:bg-cream-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Size Table */}
        <div className="overflow-x-auto rounded-2xl border border-charcoal-border/60">
          <table className="w-full text-xs text-left">
            <thead className="bg-cream-100 text-charcoal font-extrabold border-b border-charcoal-border/60">
              <tr>
                <th className="py-3 px-3.5">Age / Size</th>
                <th className="py-3 px-3">Chest</th>
                <th className="py-3 px-3">Length</th>
                <th className="py-3 px-3">Baby Weight</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal-border/40 font-medium text-charcoal-light">
              {SIZE_ROWS.map((row, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-cream-50/50'}>
                  <td className="py-3 px-3.5 font-bold text-charcoal whitespace-nowrap">{row.age}</td>
                  <td className="py-3 px-3 whitespace-nowrap">{row.chest}</td>
                  <td className="py-3 px-3 whitespace-nowrap">{row.length}</td>
                  <td className="py-3 px-3 whitespace-nowrap">{row.weight}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Sizing Tips */}
        <div className="p-4 rounded-2xl bg-cream-50 border border-charcoal-border/60 space-y-2 text-xs text-charcoal-muted">
          <div className="flex items-center space-x-1.5 font-bold text-charcoal">
            <Sparkles className="w-3.5 h-3.5 text-brand" />
            <span>Sizing & Fit Tips for Parents:</span>
          </div>
          <ul className="space-y-1 text-[11px] list-disc list-inside leading-relaxed">
            <li>If your baby is between two sizes or chubby, we recommend ordering one size larger.</li>
            <li>All our fabrics are 100% pure combed cotton with natural stretch for maximum comfort.</li>
            <li>Need help choosing a size? WhatsApp us at <strong>0336-6895035</strong> and we will guide you.</li>
          </ul>
        </div>

        {/* Footer Guarantee */}
        <div className="flex items-center justify-between pt-2 text-xs text-charcoal-muted border-t border-charcoal-border/40">
          <span className="flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-brand" />
            <span>7-Day Hassle-Free Size Exchange Guaranteed</span>
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-brand hover:bg-brand-dark text-white font-bold text-xs rounded-xl shadow-card transition-all"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
}
