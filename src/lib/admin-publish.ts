const ADMIN_API_URL = process.env.NEXT_PUBLIC_ADMIN_API_URL || '';

export async function triggerPublish(accessToken: string): Promise<boolean> {
  if (!ADMIN_API_URL) {
    console.error('NEXT_PUBLIC_ADMIN_API_URL is not configured');
    return false;
  }
  try {
    const res = await fetch(`${ADMIN_API_URL}/publish`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return res.ok;
  } catch {
    return false;
  }
}
