'use client';

const ADMIN_SESSION_KEY = 'tk_admin_session';
const DEFAULT_PIN = '7860';

export function isAdminAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  const session = sessionStorage.getItem(ADMIN_SESSION_KEY) || localStorage.getItem(ADMIN_SESSION_KEY);
  return session === 'authenticated';
}

export function setAdminSession(): void {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem(ADMIN_SESSION_KEY, 'authenticated');
    localStorage.setItem(ADMIN_SESSION_KEY, 'authenticated');
  }
}

export function clearAdminSession(): void {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    localStorage.removeItem(ADMIN_SESSION_KEY);
  }
}

export function verifyAdminPin(pin: string): boolean {
  const validPins = [DEFAULT_PIN, '123456', 'admin', 'tinykids'];
  return validPins.includes(pin.trim().toLowerCase());
}
