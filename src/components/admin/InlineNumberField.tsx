'use client';

import { useState, useRef } from 'react';
import { Check, Loader2 } from 'lucide-react';

interface Props {
  value: number | null;
  placeholder?: string;
  onSave: (value: number | null) => Promise<void>;
  className?: string;
}

export default function InlineNumberField({ value, placeholder, onSave, className }: Props) {
  const [draft, setDraft] = useState(value === null ? '' : String(value));
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  async function commit() {
    const trimmed = draft.trim();
    const next = trimmed === '' ? null : Number(trimmed);
    if (next !== null && (isNaN(next) || next < 0)) {
      setDraft(value === null ? '' : String(value));
      return;
    }
    if (next === value) return;

    setStatus('saving');
    await onSave(next);
    setStatus('saved');
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setStatus('idle'), 1500);
  }

  return (
    <div className={`relative inline-flex items-center ${className ?? ''}`}>
      <input
        type="number"
        inputMode="decimal"
        min={0}
        value={draft}
        placeholder={placeholder}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
        }}
        className="w-24 h-10 px-2 rounded-lg border border-charcoal-border focus:border-brand focus:ring-2 focus:ring-brand-soft outline-none text-sm text-right"
      />
      {status === 'saving' && <Loader2 className="w-4 h-4 ml-1.5 animate-spin text-charcoal-muted shrink-0" />}
      {status === 'saved' && <Check className="w-4 h-4 ml-1.5 text-brand shrink-0" />}
    </div>
  );
}
