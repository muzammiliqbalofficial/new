'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Lock, ArrowRight, ShieldCheck, KeyRound } from 'lucide-react';
import { verifyAdminPin, setAdminSession, isAdminAuthenticated } from '@/lib/admin-auth';

export default function AdminLoginPage() {
  const router = useRouter();
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAdminAuthenticated()) {
      router.push('/admin');
    }
  }, [router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (verifyAdminPin(pin)) {
      setAdminSession();
      router.push('/admin');
    } else {
      setError('Invalid PIN / Password. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream-100/60 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-charcoal-border/80 shadow-card space-y-6">
        {/* Logo & Store Header */}
        <div className="text-center space-y-3">
          <div className="relative w-16 h-16 rounded-2xl overflow-hidden mx-auto shadow-soft border border-charcoal-border/50 bg-white">
            <Image src="/logo.png" alt="Tiny Kids Admin" fill className="object-cover" priority />
          </div>
          <div>
            <h1 className="text-2xl font-black text-charcoal tracking-tight">Tiny Kids Portal</h1>
            <p className="text-xs text-charcoal-muted mt-1 font-medium">
              Client Store Management & Orders Dashboard
            </p>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-2">
              Enter Admin PIN / Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-charcoal-muted">
                <KeyRound className="w-4 h-4" />
              </div>
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Enter PIN (Default: 7860)"
                autoFocus
                required
                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-charcoal-border/80 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand tracking-widest text-center font-bold text-lg"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-coral/10 border border-coral/30 text-coral text-xs font-semibold text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !pin.trim()}
            className="w-full py-3.5 bg-brand hover:bg-brand-dark text-white font-bold text-sm rounded-2xl shadow-card hover:shadow-hover transition-all flex items-center justify-center space-x-2 active:scale-98 disabled:opacity-50"
          >
            <span>{isLoading ? 'Verifying...' : 'Login to Dashboard'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-charcoal-border/50 text-center">
          <span className="text-[11px] text-charcoal-muted flex items-center justify-center space-x-1.5 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-brand" />
            <span>Default PIN: <strong className="text-charcoal">7860</strong></span>
          </span>
        </div>
      </div>
    </div>
  );
}
