'use client';

import React, { useState, useMemo } from 'react';
import { MapPin, Truck, CheckCircle2, Clock } from 'lucide-react';

const CITIES_CONFIG: { [city: string]: { daysMin: number; daysMax: number; note: string } } = {
  Karachi: { daysMin: 1, daysMax: 2, note: 'Fast Local Dispatch (1-2 Days)' },
  Lahore: { daysMin: 2, daysMax: 3, note: 'Air Cargo COD (2-3 Days)' },
  Islamabad: { daysMin: 2, daysMax: 3, note: 'Express Courier COD (2-3 Days)' },
  Rawalpindi: { daysMin: 2, daysMax: 3, note: 'Express Courier COD (2-3 Days)' },
  Faisalabad: { daysMin: 2, daysMax: 4, note: 'Standard Express (2-4 Days)' },
  Multan: { daysMin: 2, daysMax: 4, note: 'Standard Express (2-4 Days)' },
  Peshawar: { daysMin: 3, daysMax: 4, note: 'Standard Express (3-4 Days)' },
  Quetta: { daysMin: 3, daysMax: 5, note: 'Express Courier (3-5 Days)' },
  Sialkot: { daysMin: 2, daysMax: 4, note: 'Standard Express (2-4 Days)' },
  Gujranwala: { daysMin: 2, daysMax: 4, note: 'Standard Express (2-4 Days)' },
  Hyderabad: { daysMin: 1, daysMax: 3, note: 'Sindh Express (1-3 Days)' },
  'Other City in Pakistan': { daysMin: 3, daysMax: 5, note: 'Nationwide COD (3-5 Days)' },
};

export default function CityDeliveryEstimator() {
  const [selectedCity, setSelectedCity] = useState('Karachi');

  const deliveryEstimation = useMemo(() => {
    const config = CITIES_CONFIG[selectedCity] || CITIES_CONFIG['Other City in Pakistan'];
    const now = new Date();

    const minDate = new Date(now);
    minDate.setDate(now.getDate() + config.daysMin);

    const maxDate = new Date(now);
    maxDate.setDate(now.getDate() + config.daysMax);

    const options: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'short', day: 'numeric' };
    const dateRangeStr =
      config.daysMin === config.daysMax
        ? minDate.toLocaleDateString('en-US', options)
        : `${minDate.toLocaleDateString('en-US', options)} - ${maxDate.toLocaleDateString('en-US', options)}`;

    return {
      dateRange: dateRangeStr,
      note: config.note,
    };
  }, [selectedCity]);

  return (
    <div className="p-4 rounded-3xl bg-cream-50/80 border border-charcoal-border/70 space-y-3 text-xs">
      <div className="flex items-center justify-between">
        <span className="font-extrabold text-charcoal flex items-center space-x-1.5 text-xs">
          <MapPin className="w-3.5 h-3.5 text-brand" />
          <span>Check Estimated Delivery Time:</span>
        </span>
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="px-2.5 py-1 bg-white border border-charcoal-border/80 rounded-xl text-xs font-bold text-charcoal focus:outline-none focus:ring-1 focus:ring-brand"
        >
          {Object.keys(CITIES_CONFIG).map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      {/* Dynamic Delivery Box */}
      <div className="p-3 bg-white rounded-2xl border border-charcoal-border/60 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-brand-soft text-brand flex items-center justify-center flex-shrink-0">
            <Truck className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-charcoal-muted font-bold block uppercase tracking-wider">
              Estimated Delivery to {selectedCity}
            </span>
            <span className="font-black text-xs text-charcoal block">
              {deliveryEstimation.dateRange}
            </span>
          </div>
        </div>

        <span className="text-[10px] font-extrabold px-2 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
          {deliveryEstimation.note}
        </span>
      </div>
    </div>
  );
}