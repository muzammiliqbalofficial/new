'use client';

import { useEffect, useState } from 'react';
import { Loader2, Check } from 'lucide-react';
import { adminSupabase } from '@/lib/supabase-admin-client';
import { StoreSettings } from '@/lib/types';

export default function AdminSettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);

  const [storeName, setStoreName] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [shippingFlatRate, setShippingFlatRate] = useState('0');
  const [announcementText, setAnnouncementText] = useState('');

  useEffect(() => {
    adminSupabase
      .from('settings')
      .select('*')
      .eq('id', 1)
      .single()
      .then(({ data }) => {
        const s = data as StoreSettings | null;
        if (s) {
          setStoreName(s.store_name ?? '');
          setWhatsappNumber(s.whatsapp_number ?? '');
          setContactEmail(s.contact_email ?? '');
          setShippingFlatRate(String(s.shipping_flat_rate ?? 0));
          setAnnouncementText(s.announcement_bar_text ?? '');
        }
        setIsLoading(false);
      });
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    await adminSupabase
      .from('settings')
      .update({
        store_name: storeName.trim(),
        whatsapp_number: whatsappNumber.replace(/[^0-9]/g, ''),
        contact_email: contactEmail.trim(),
        shipping_flat_rate: Number(shippingFlatRate) || 0,
        announcement_bar_text: announcementText.trim(),
      })
      .eq('id', 1);
    setIsSaving(false);
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 2000);
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-6 h-6 animate-spin text-brand" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-lg mx-auto">
      <h1 className="text-xl font-bold text-charcoal mb-6">Settings</h1>

      <form onSubmit={handleSave} className="bg-white rounded-2xl shadow-soft p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-charcoal mb-1.5">Store ka naam</label>
          <input
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            className="w-full h-12 px-4 rounded-xl border border-charcoal-border focus:border-brand outline-none text-base"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-charcoal mb-1.5">WhatsApp Number</label>
          <input
            value={whatsappNumber}
            onChange={(e) => setWhatsappNumber(e.target.value)}
            placeholder="923001234567"
            className="w-full h-12 px-4 rounded-xl border border-charcoal-border focus:border-brand outline-none text-base"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-charcoal mb-1.5">Contact Email</label>
          <input
            type="email"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            className="w-full h-12 px-4 rounded-xl border border-charcoal-border focus:border-brand outline-none text-base"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-charcoal mb-1.5">Shipping Charges (Rs.)</label>
          <input
            type="number"
            min={0}
            value={shippingFlatRate}
            onChange={(e) => setShippingFlatRate(e.target.value)}
            className="w-full h-12 px-4 rounded-xl border border-charcoal-border focus:border-brand outline-none text-base"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-charcoal mb-1.5">
            Announcement Bar (website k top par jo text dikhta hai)
          </label>
          <textarea
            value={announcementText}
            onChange={(e) => setAnnouncementText(e.target.value)}
            rows={2}
            className="w-full px-4 py-3 rounded-xl border border-charcoal-border focus:border-brand outline-none text-base resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="w-full h-12 rounded-xl bg-brand text-white font-semibold disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
          {savedFlash && <Check className="w-4 h-4" />}
          {savedFlash ? 'Save ho gaya' : 'Save Karein'}
        </button>
      </form>
    </div>
  );
}
