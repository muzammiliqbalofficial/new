'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ManageRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/admin/products');
  }, [router]);
  return (
    <div className="min-h-screen flex items-center justify-center bg-cream-50 text-xs font-bold text-charcoal-muted">
      Loading Store Manager...
    </div>
  );
}
