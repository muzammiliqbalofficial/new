'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
      <h1 className="text-4xl font-extrabold text-charcoal">404</h1>
      <h2 className="text-lg font-bold text-charcoal">Page Not Found</h2>
      <p className="text-xs text-charcoal-muted">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="inline-flex items-center space-x-2 px-6 py-3 bg-brand text-white font-bold text-xs rounded-2xl shadow-card hover:bg-brand-dark transition-all"
      >
        <ShoppingBag className="w-4 h-4" />
        <span>Return to Home</span>
      </Link>
    </div>
  );
}
