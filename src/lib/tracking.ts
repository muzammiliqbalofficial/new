// Meta Pixel & Google Analytics 4 Event Dispatcher

declare global {
  interface Window {
    fbq?: any;
    gtag?: any;
    dataLayer?: any[];
  }
}

export function trackMetaEvent(eventName: string, params: Record<string, any> = {}) {
  if (typeof window !== 'undefined' && window.fbq) {
    try {
      window.fbq('track', eventName, params);
    } catch (e) {
      console.warn('Meta Pixel dispatch notice:', e);
    }
  }
  if (typeof window !== 'undefined' && window.gtag) {
    try {
      window.gtag('event', eventName, params);
    } catch (e) {
      console.warn('GA4 dispatch notice:', e);
    }
  }
}

export function trackViewContent(product: { name: string; id: string; price: number; category?: string }) {
  trackMetaEvent('ViewContent', {
    content_name: product.name,
    content_ids: [product.id],
    content_type: 'product',
    value: product.price,
    currency: 'PKR',
  });
}

export function trackAddToCart(product: { name: string; id: string; price: number; quantity?: number }) {
  trackMetaEvent('AddToCart', {
    content_name: product.name,
    content_ids: [product.id],
    content_type: 'product',
    value: product.price * (product.quantity || 1),
    currency: 'PKR',
  });
}

export function trackInitiateCheckout(items: Array<{ name: string; id: string; price: number; quantity: number }>, total: number) {
  trackMetaEvent('InitiateCheckout', {
    content_ids: items.map((i) => i.id),
    contents: items.map((i) => ({ id: i.id, quantity: i.quantity, item_price: i.price })),
    num_items: items.reduce((acc, i) => acc + i.quantity, 0),
    value: total,
    currency: 'PKR',
  });
}

export function trackPurchase(order: { orderNumber: string; total: number; items: Array<{ name: string; id: string; price: number; quantity: number }> }) {
  trackMetaEvent('Purchase', {
    content_type: 'product',
    content_ids: order.items.map((i) => i.id),
    contents: order.items.map((i) => ({ id: i.id, quantity: i.quantity, item_price: i.price })),
    num_items: order.items.reduce((acc, i) => acc + i.quantity, 0),
    value: order.total,
    currency: 'PKR',
    order_id: order.orderNumber,
  });
}