'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { CartItem } from '@/lib/types';

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  subtotal: number;
  totalItems: number;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  // Promo / Coupon code
  couponCode: string;
  discount: number;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  // Gift Box Option
  isGiftBox: boolean;
  setIsGiftBox: (val: boolean) => void;
  giftMessage: string;
  setGiftMessage: (msg: string) => void;
  giftBoxFee: number;
  shippingFee: number;
  finalTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'tk_store_cart_v1';
const COUPON_STORAGE_KEY = 'tk_store_coupon_v1';
const GIFT_STORAGE_KEY = 'tk_store_gift_v1';

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [isGiftBox, setIsGiftBox] = useState(false);
  const [giftMessage, setGiftMessage] = useState('');
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (storedCart) setCart(JSON.parse(storedCart));

      const storedCoupon = localStorage.getItem(COUPON_STORAGE_KEY);
      if (storedCoupon) {
        const parsed = JSON.parse(storedCoupon);
        setCouponCode(parsed.code || '');
        setDiscount(parsed.discount || 0);
      }

      const storedGift = localStorage.getItem(GIFT_STORAGE_KEY);
      if (storedGift) {
        const parsed = JSON.parse(storedGift);
        setIsGiftBox(Boolean(parsed.isGiftBox));
        setGiftMessage(parsed.giftMessage || '');
      }
    } catch (e) {
      console.warn('Failed to load cart state from storage', e);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Sync cart to localStorage
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.warn('Failed to save cart to storage', e);
    }
  }, [cart, isHydrated]);

  // Sync coupon & gift state
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(COUPON_STORAGE_KEY, JSON.stringify({ code: couponCode, discount }));
      localStorage.setItem(GIFT_STORAGE_KEY, JSON.stringify({ isGiftBox, giftMessage }));
    } catch (e) {
      console.warn('Failed to save extra state to storage', e);
    }
  }, [couponCode, discount, isGiftBox, giftMessage, isHydrated]);

  const addToCart = (item: Omit<CartItem, 'quantity'>, quantity = 1) => {
    if (quantity <= 0) return;
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [...prev, { ...item, quantity }];
    });
    setIsDrawerOpen(true);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === productId ? { ...item, quantity } : item))
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
    setCouponCode('');
    setDiscount(0);
    setIsGiftBox(false);
    setGiftMessage('');
  };

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const giftBoxFee = isGiftBox ? 150 : 0;
  const shippingFee = subtotal >= 2500 || subtotal === 0 ? 0 : 199;
  const finalTotal = Math.max(0, subtotal + shippingFee + giftBoxFee - discount);

  const applyCoupon = (code: string): { success: boolean; message: string } => {
    const clean = code.trim().toUpperCase();
    if (!clean) return { success: false, message: 'Please enter a coupon code.' };

    if (clean === 'WELCOME200' || clean === 'TINY200') {
      if (subtotal < 1000) {
        return { success: false, message: 'Minimum order amount for WELCOME200 is Rs. 1,000.' };
      }
      setCouponCode(clean);
      setDiscount(200);
      return { success: true, message: 'Coupon WELCOME200 applied! Rs. 200 saved.' };
    }

    if (clean === 'TINY10' || clean === 'BABY10') {
      const disc = Math.round(subtotal * 0.1);
      setCouponCode(clean);
      setDiscount(disc);
      return { success: true, message: `Coupon ${clean} applied! 10% (Rs. ${disc}) saved.` };
    }

    if (clean === 'FREESHIP') {
      setCouponCode(clean);
      setDiscount(shippingFee);
      return { success: true, message: 'Coupon FREESHIP applied! Free shipping unlocked.' };
    }

    return { success: false, message: 'Invalid coupon code. Try WELCOME200' };
  };

  const removeCoupon = () => {
    setCouponCode('');
    setDiscount(0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        subtotal,
        totalItems,
        isDrawerOpen,
        setIsDrawerOpen,
        openDrawer: () => setIsDrawerOpen(true),
        closeDrawer: () => setIsDrawerOpen(false),
        couponCode,
        discount,
        applyCoupon,
        removeCoupon,
        isGiftBox,
        setIsGiftBox,
        giftMessage,
        setGiftMessage,
        giftBoxFee,
        shippingFee,
        finalTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}