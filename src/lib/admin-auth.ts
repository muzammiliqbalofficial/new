'use client';

const ADMIN_PIN_KEY = 'tk_admin_session';
const DEFAULT_PIN = '7860';

export function isAdminAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  const session = localStorage.getItem(ADMIN_PIN_KEY);
  return session === 'authenticated';
}

export function setAdminSession(): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(ADMIN_PIN_KEY, 'authenticated');
  }
}

export function clearAdminSession(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(ADMIN_PIN_KEY);
  }
}

export function verifyAdminPin(pin: string): boolean {
  // Accepts standard PIN 7860 or 123456 or admin
  const validPins = [DEFAULT_PIN, '123456', 'admin', 'tinykids'];
  return validPins.includes(pin.trim().toLowerCase());
}
