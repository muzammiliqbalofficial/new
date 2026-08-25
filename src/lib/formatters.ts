import { Product } from './types';

/**
 * Format numeric price to PKR currency with thousands separators (e.g. "Rs. 2,450")
 */
export function formatPrice(price: number | null | undefined): string {
  if (price === null || price === undefined || isNaN(Number(price)) || Number(price) <= 0) {
    return 'Price on request';
  }
  const formatted = new Intl.NumberFormat('en-PK', {
    maximumFractionDigits: 0,
  }).format(Number(price));
  return `Rs. ${formatted}`;
}

/**
 * Format numbers with comma separators (e.g. 1,250)
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-PK').format(num);
}

/**
 * Resolves the preferred main display image for a product:
 * Prefers white_background_image -> primary gallery image -> first image -> placeholder
 */
export function resolveMainImage(product: Product): string {
  if (!product.product_images || product.product_images.length === 0) {
    return 'placeholder-product';
  }

  // 1. Prefer white background image
  const whiteBg = product.product_images.find((img) => img.is_white_background);
  if (whiteBg && whiteBg.r2_key) {
    return whiteBg.r2_key;
  }

  // 2. Primary gallery image
  const primary = product.product_images.find((img) => img.is_primary && !img.is_description_image);
  if (primary && primary.r2_key) {
    return primary.r2_key;
  }

  // 3. First non-description image
  const firstGallery = product.product_images.find((img) => !img.is_description_image);
  if (firstGallery && firstGallery.r2_key) {
    return firstGallery.r2_key;
  }

  // 4. Any image
  return product.product_images[0].r2_key;
}

/**
 * Generates WhatsApp enquiry deep link for unpriced or custom enquiry products
 */
export function buildWhatsAppEnquiryLink(
  productName: string,
  productUrl: string,
  whatsappNumber?: string
): string {
  const phone = (whatsappNumber || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '923366895035').replace(/[^0-9]/g, '');
  const message = `Hello Tiny Kids! I would like to inquire about:\n\n*${productName}*\n${productUrl}\n\nPlease share details and available sizes.`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

/**
 * Generates WhatsApp order notification deep link for placed orders
 */
export function buildWhatsAppOrderConfirmationLink(
  orderNumber: string,
  customerName: string,
  total: number,
  items: { name: string; quantity: number }[],
  whatsappNumber?: string
): string {
  const phone = (whatsappNumber || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '923366895035').replace(/[^0-9]/g, '');
  const itemsText = items.map((i) => `• ${i.name} (x${i.quantity})`).join('\n');
  const message = `🛍️ *NEW ORDER CONFIRMATION — TINY KIDS*\n\nOrder Reference: *${orderNumber}*\nCustomer Name: *${customerName}*\n\nItems:\n${itemsText}\n\nTotal Amount: *${formatPrice(total)}*\nPayment: *Cash on Delivery (COD)*\n\nPlease confirm my order. Thank you!`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

/**
 * Basic client HTML sanitization for Daraz description markup
 */
export function sanitizeDescriptionHtml(rawHtml?: string): string {
  if (!rawHtml) return '';
  return rawHtml
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '');
}
