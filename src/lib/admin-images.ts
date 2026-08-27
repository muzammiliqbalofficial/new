const ADMIN_API_URL = process.env.NEXT_PUBLIC_ADMIN_API_URL || '';

// Must match scripts/seed.ts VARIANTS exactly so admin-uploaded images are
// indistinguishable from seeded ones to the storefront's r2-image-loader.
const VARIANTS = [
  { suffix: '300w', width: 300, quality: 0.8 },
  { suffix: '700w', width: 700, quality: 0.82 },
  { suffix: '1400w', width: 1400, quality: 0.85 },
] as const;

export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

function generateStem(): string {
  const rand = Math.random().toString(36).slice(2, 10);
  return `admin-${Date.now()}-${rand}`;
}

async function loadImageBitmap(file: File): Promise<ImageBitmap> {
  return createImageBitmap(file);
}

// Resizes so the long edge fits within `maxDim`, never upscaling — same
// `fit: inside, withoutEnlargement: true` behavior as the sharp seed script.
function resizeCanvas(bitmap: ImageBitmap, maxDim: number): HTMLCanvasElement {
  const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(bitmap, 0, 0, w, h);
  return canvas;
}

function canvasToWebpBlob(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('WebP encoding failed'))), 'image/webp', quality);
  });
}

export interface UploadProgress {
  variant: string;
  done: boolean;
}

export async function uploadProductImage(
  file: File,
  accessToken: string,
  onProgress?: (p: UploadProgress) => void
): Promise<string> {
  if (!ADMIN_API_URL) throw new Error('Admin API is not configured');
  if (file.size > MAX_UPLOAD_BYTES) throw new Error('Image is too large, try one under 5 MB');

  const bitmap = await loadImageBitmap(file);
  const stem = generateStem();

  for (const v of VARIANTS) {
    const canvas = resizeCanvas(bitmap, v.width);
    const blob = await canvasToWebpBlob(canvas, v.quality);
    const key = `${stem}-${v.suffix}.webp`;

    const res = await fetch(`${ADMIN_API_URL}/images/upload?key=${encodeURIComponent(key)}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'image/webp',
      },
      body: blob,
    });

    if (!res.ok) throw new Error('Upload failed, please try again');
    onProgress?.({ variant: v.suffix, done: true });
  }

  bitmap.close();
  return stem;
}

export async function deleteProductImage(stem: string, accessToken: string): Promise<boolean> {
  if (!ADMIN_API_URL) return false;
  try {
    const res = await fetch(`${ADMIN_API_URL}/images/delete`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ stem }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
