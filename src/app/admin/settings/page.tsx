'use client';

import React, { useEffect, useState } from 'react';
import { Settings, Save, Check, Phone, Truck, ShieldCheck, Mail } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    store_name: 'Tiny Kids',
    whatsapp_number: '923366895035',
    contact_email: 'info@tinykids.pk',
    announcement_bar_text: 'Cash on Delivery Available Nationwide • Easy 7-Day Returns',
    shipping_flat_rate: 200,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    supabase
      .from('settings')
      .select('*')
      .eq('id', 1)
      .single()
      .then(({ data }) => {
        if (data) {
          setSettings({
            store_name: data.store_name || 'Tiny Kids',
            whatsapp_number: data.whatsapp_number || '923366895035',
            contact_email: data.contact_email || 'info@tinykids.pk',
            announcement_bar_text:
              data.announcement_bar_text || 'Cash on Delivery Available Nationwide • Easy 7-Day Returns',
            shipping_flat_rate: data.shipping_flat_rate || 200,
          });
        }
        setIsLoading(false);
      });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      await supabase
        .from('settings')
        .update({
          store_name: settings.store_name,
          whatsapp_number: settings.whatsapp_number.replace(/[^0-9]/g, ''),
          contact_email: settings.contact_email,
          announcement_bar_text: settings.announcement_bar_text,
          shipping_flat_rate: Number(settings.shipping_flat_rate) || 200,
        })
        .eq('id', 1);

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3500);
    } catch (err) {
      console.error('Error saving settings:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-charcoal tracking-tight">Store Settings</h1>
        <p className="text-xs sm:text-sm text-charcoal-muted mt-0.5">
          Configure WhatsApp helpline, delivery charges, and top announcement banner
        </p>
      </div>

      {saveSuccess && (
        <div className="p-3.5 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center space-x-2">
          <Check className="w-4 h-4 text-emerald-700" />
          <span>Settings saved successfully! Changes are live across your store.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-8 border border-charcoal-border/70 shadow-soft space-y-6 text-xs">
        {/* Store Name */}
        <div>
          <label className="block font-bold text-charcoal mb-1.5 uppercase text-[11px]">
            Store Name
          </label>
          <input
            type="text"
            value={settings.store_name}
            onChange={(e) => setSettings({ ...settings, store_name: e.target.value })}
            required
            className="w-full px-4 py-3 bg-cream-50 rounded-xl border border-charcoal-border/80 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-brand/30"
          />
        </div>

        {/* WhatsApp Phone */}
        <div>
          <label className="block font-bold text-charcoal mb-1.5 uppercase text-[11px]">
            WhatsApp Helpline Phone Number <span className="text-coral">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-charcoal-muted">
              <Phone className="w-4 h-4 text-[#25D366]" />
            </div>
            <input
              type="text"
              value={settings.whatsapp_number}
              onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
              placeholder="923366895035"
              required
              className="w-full pl-10 pr-4 py-3 bg-cream-50 rounded-xl border border-charcoal-border/80 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-brand/30"
            />
          </div>
          <span className="text-[10px] text-charcoal-muted mt-1 block">
            Used for customer enquiry links, order notifications, and header helpline badges.
          </span>
        </div>

        {/* Announcement Banner */}
        <div>
          <label className="block font-bold text-charcoal mb-1.5 uppercase text-[11px]">
            Top Announcement Banner Text
          </label>
          <input
            type="text"
            value={settings.announcement_bar_text}
            onChange={(e) => setSettings({ ...settings, announcement_bar_text: e.target.value })}
            placeholder="Cash on Delivery Available Nationwide • Easy 7-Day Returns"
            className="w-full px-4 py-3 bg-cream-50 rounded-xl border border-charcoal-border/80 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30"
          />
        </div>

        {/* Contact Email & Flat Shipping */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-charcoal mb-1.5 uppercase text-[11px]">
              Support Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-charcoal-muted">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                value={settings.contact_email}
                onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                placeholder="info@tinykids.pk"
                className="w-full pl-10 pr-4 py-3 bg-cream-50 rounded-xl border border-charcoal-border/80 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-charcoal mb-1.5 uppercase text-[11px]">
              Flat Shipping Fee (PKR)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-charcoal-muted">
                <Truck className="w-4 h-4" />
              </div>
              <input
                type="number"
                value={settings.shipping_flat_rate}
                onChange={(e) =>
                  setSettings({ ...settings, shipping_flat_rate: Number(e.target.value) })
                }
                className="w-full pl-10 pr-4 py-3 bg-cream-50 rounded-xl border border-charcoal-border/80 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-brand/30"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-charcoal-border/50 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-7 py-3 bg-brand hover:bg-brand-dark text-white font-bold rounded-xl text-xs shadow-card hover:shadow-hover transition-all flex items-center space-x-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
