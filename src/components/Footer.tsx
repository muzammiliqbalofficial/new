import React from 'react';
import Link from 'next/link';
import { Sparkles, Phone, Mail, MapPin, Heart } from 'lucide-react';
import { Category } from '@/lib/types';

interface Props {
  storeName?: string;
  whatsappNumber?: string;
  contactEmail?: string;
  categories?: Category[];
}

export default function Footer({
  storeName = 'Tiny Kids',
  whatsappNumber = '923000000000',
  contactEmail = 'info@tinykids.pk',
  categories = [],
}: Props) {
  const cleanPhone = whatsappNumber.replace(/[^0-9]/g, '');

  return (
    <footer className="bg-charcoal text-white pt-12 sm:pt-16 pb-8 border-t border-charcoal-light/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 pb-12 border-b border-charcoal-light/30">
          {/* Col 1: Store Intro */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-brand flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-xl font-black tracking-tight text-white">{storeName}</span>
            </Link>
            <p className="text-xs text-charcoal-muted leading-relaxed">
              Premium baby clothing in Pakistan. From newborn welcome starter sets and rompers to winter fleece — crafted with love and gentle care for your little angels.
            </p>
            <div className="pt-1">
              <a
                href={`https://wa.me/${cleanPhone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-3 py-2 bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] text-xs font-semibold rounded-xl transition-colors border border-[#25D366]/30"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>WhatsApp Helpline</span>
              </a>
            </div>
          </div>

          {/* Col 2: Top Clothing Collections */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4 tracking-wider uppercase">Baby Clothing</h4>
            <ul className="space-y-2 text-xs text-charcoal-muted">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link href={`/category/${cat.slug}`} className="hover:text-white transition-colors">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Customer Service */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4 tracking-wider uppercase">Customer Service</h4>
            <ul className="space-y-2 text-xs text-charcoal-muted">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Our Store
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-white transition-colors">
                  Shipping & Delivery Info
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-white transition-colors">
                  Returns & Exchange Policy
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Information */}
          <div className="space-y-3 text-xs text-charcoal-muted">
            <h4 className="text-sm font-bold text-white mb-4 tracking-wider uppercase">Get In Touch</h4>
            <div className="flex items-center space-x-2.5">
              <Phone className="w-4 h-4 text-brand-light flex-shrink-0" />
              <span>+92 300 0000000 (Mon - Sat)</span>
            </div>
            <div className="flex items-center space-x-2.5">
              <Mail className="w-4 h-4 text-brand-light flex-shrink-0" />
              <span>{contactEmail}</span>
            </div>
            <div className="flex items-center space-x-2.5">
              <MapPin className="w-4 h-4 text-brand-light flex-shrink-0" />
              <span>Nationwide Delivery across Pakistan</span>
            </div>
            <div className="mt-4 p-3 rounded-xl bg-white/5 border border-white/10 text-[11px]">
              <span className="text-white font-semibold block mb-0.5">Cash on Delivery Available</span>
              Pay safely in cash when your baby parcel arrives at your doorstep.
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-charcoal-muted gap-4">
          <p>© {new Date().getFullYear()} {storeName}. All rights reserved.</p>
          <p className="flex items-center space-x-1">
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 text-coral fill-current inline" />
            <span>for Pakistani Parents</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
