interface ImageLoaderParams {
  src: string;
  width: number;
  quality?: number;
}

export default function r2ImageLoader({ src, width }: ImageLoaderParams): string {
  if (!src) return '/placeholder-product.svg';

  // If already a full URL, return as-is
  if (src.startsWith('http://') || src.startsWith('https://')) {
    return src;
  }

  // If a local static asset (e.g. in /public)
  if (src.startsWith('/')) {
    return src;
  }

  const r2PublicUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || '';
  const cleanBaseUrl = r2PublicUrl.replace(/\/+$/, '');

  // Strip extension if passed
  const stem = src.replace(/\.(webp|jpg|jpeg|png)$/i, '');

  // Determine closest responsive variant
  let variant = '700w';
  if (width <= 360) {
    variant = '300w';
  } else if (width <= 800) {
    variant = '700w';
  } else {
    variant = '1400w';
  }

  if (!cleanBaseUrl) {
    return `/${stem}-${variant}.webp`;
  }

  return `${cleanBaseUrl}/${stem}-${variant}.webp`;
}
