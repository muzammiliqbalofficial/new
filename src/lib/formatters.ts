import { Product } from './types';

const R2_BASE = 'https://pub-4327055644f945ce92583334944f4675.r2.dev';

/**
 * Generates full Cloudflare R2 URL for a given stem or key and width variant (300w, 700w, 1400w)
 */
export function getR2ImageUrl(stemOrKey?: string | null, variant: '300w' | '700w' | '1400w' = '700w'): string {
  if (!stemOrKey) return '/placeholder-product.svg';

  // If already a full URL or static path
  if (stemOrKey.startsWith('http://') || stemOrKey.startsWith('https://') || stemOrKey.startsWith('/')) {
    return stemOrKey;
  }

  const cleanStem = stemOrKey.replace(/\.(webp|jpg|jpeg|png)$/i, '');
  return `${R2_BASE}/${cleanStem}-${variant}.webp`;
}

/**
 * Resolves the preferred main display image for a product as a full, ready-to-render URL:
 * Prefers white_background_image -> primary gallery image -> first image -> placeholder
 */
export function resolveMainImage(product: Product, variant: '300w' | '700w' | '1400w' = '700w'): string {
  if (!product.product_images || product.product_images.length === 0) {
    return '/placeholder-product.svg';
  }

  // 1. Prefer white background image
  const whiteBg = product.product_images.find((img) => img.is_white_background);
  if (whiteBg && whiteBg.r2_key) {
    return getR2ImageUrl(whiteBg.r2_key, variant);
  }

  // 2. Primary gallery image
  const primary = product.product_images.find((img) => img.is_primary && !img.is_description_image);
  if (primary && primary.r2_key) {
    return getR2ImageUrl(primary.r2_key, variant);
  }

  // 3. First non-description image
  const firstGallery = product.product_images.find((img) => !img.is_description_image);
  if (firstGallery && firstGallery.r2_key) {
    return getR2ImageUrl(firstGallery.r2_key, variant);
  }

  // 4. Any image
  return getR2ImageUrl(product.product_images[0].r2_key, variant);
}

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
 * Generates WhatsApp enquiry deep link for unpriced or custom enquiry products
 */
export function buildWhatsAppEnquiryLink(
  productName: string,
  productUrl: string,
  whatsappNumber?: string
): string {
  const phone = (whatsappNumber || '923366895035').replace(/[^0-9]/g, '');
  const message = `Hello tinykids.pk! I would like to inquire about:\n\n*${productName}*\n${productUrl}\n\nPlease share details and available sizes.`;
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
  const phone = (whatsappNumber || '923366895035').replace(/[^0-9]/g, '');
  const itemsText = items.map((i) => `• ${i.name} (x${i.quantity})`).join('\n');
  const message = `️ *NEW ORDER CONFIRMATION — tinykids.pk*\n\nOrder Reference: *${orderNumber}*\nCustomer Name: *${customerName}*\n\nItems:\n${itemsText}\n\nTotal Amount: *${formatPrice(total)}*\nPayment: *Cash on Delivery (COD)*\n\nPlease confirm my order. Thank you!`;
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
