import { AwsClient } from 'aws4fetch';

export interface Env {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  ALLOWED_ORIGINS: string;
  GITHUB_OWNER: string;
  GITHUB_REPO: string;
  GITHUB_TOKEN: string;
  R2_ACCOUNT_ID: string;
  R2_BUCKET_NAME: string;
  R2_ACCESS_KEY_ID: string;
  R2_SECRET_ACCESS_KEY: string;
}

function r2Client(env: Env): { client: AwsClient; baseUrl: string } {
  const client = new AwsClient({
    accessKeyId: env.R2_ACCESS_KEY_ID,
    secretAccessKey: env.R2_SECRET_ACCESS_KEY,
    service: 's3',
    region: 'auto',
  });
  const baseUrl = `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${env.R2_BUCKET_NAME}`;
  return { client, baseUrl };
}

const UPLOAD_KEY_PATTERN = /^admin-\d+-[a-z0-9]+-(300w|700w|1400w)\.webp$/;
const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

function corsHeaders(origin: string | null, env: Env): Record<string, string> {
  const allowed = env.ALLOWED_ORIGINS.split(',').map((s) => s.trim());
  const allowOrigin = origin && allowed.includes(origin) ? origin : allowed[0];
  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Authorization, Content-Type',
    'Access-Control-Max-Age': '86400',
    'Content-Type': 'application/json',
  };
}

function json(body: unknown, status: number, headers: Record<string, string>) {
  return new Response(JSON.stringify(body), { status, headers });
}

// Verifies the caller holds a valid Supabase session — the same trust
// boundary RLS uses everywhere else. No JWT secret needed: Supabase's own
// /auth/v1/user endpoint confirms validity for us.
async function verifySession(req: Request, env: Env): Promise<boolean> {
  const auth = req.headers.get('Authorization');
  if (!auth?.startsWith('Bearer ')) return false;
  const token = auth.slice(7);
  const res = await fetch(`${env.SUPABASE_URL}/auth/v1/user`, {
    headers: { Authorization: `Bearer ${token}`, apikey: env.SUPABASE_ANON_KEY },
  });
  return res.ok;
}

function isSafeStem(stem: unknown): stem is string {
  return typeof stem === 'string' && stem.length > 0 && !stem.includes('/') && !stem.includes('\\') && !stem.includes('..');
}

interface OrderItemInput {
  product_id?: string | null;
  product_name: string;
  unit_price: number;
  quantity: number;
  line_total: number;
}

interface OrderInput {
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string | null;
  address: string;
  city: string;
  notes?: string | null;
  subtotal: number;
  shipping_fee: number;
  total: number;
}

function isNonEmptyString(v: unknown, maxLen: number): v is string {
  return typeof v === 'string' && v.trim().length > 0 && v.length <= maxLen;
}

function isFiniteNonNegative(v: unknown): v is number {
  return typeof v === 'number' && Number.isFinite(v) && v >= 0;
}

// Every field is validated here — this is a public, unauthenticated
// endpoint (customers placing an order are never logged in), so nothing
// from the request body is trusted beyond these checks. status is never
// taken from the client; it's always forced to 'new' by the caller.
function validateOrderInput(body: unknown): { order: OrderInput; items: OrderItemInput[] } | null {
  if (!body || typeof body !== 'object') return null;
  const b = body as Record<string, unknown>;

  if (!isNonEmptyString(b.order_number, 50)) return null;
  if (!isNonEmptyString(b.customer_name, 200)) return null;
  if (!isNonEmptyString(b.customer_phone, 30)) return null;
  if (!isNonEmptyString(b.address, 500)) return null;
  if (!isNonEmptyString(b.city, 100)) return null;
  if (b.customer_email !== undefined && b.customer_email !== null && typeof b.customer_email !== 'string') return null;
  if (b.notes !== undefined && b.notes !== null && typeof b.notes !== 'string') return null;
  if (!isFiniteNonNegative(b.subtotal)) return null;
  if (!isFiniteNonNegative(b.shipping_fee)) return null;
  if (!isFiniteNonNegative(b.total)) return null;

  const rawItems = Array.isArray(b.items) ? b.items : [];
  if (rawItems.length > 50) return null;
  const items: OrderItemInput[] = [];
  for (const raw of rawItems) {
    if (!raw || typeof raw !== 'object') return null;
    const it = raw as Record<string, unknown>;
    if (!isNonEmptyString(it.product_name, 300)) return null;
    if (!isFiniteNonNegative(it.unit_price)) return null;
    if (!isFiniteNonNegative(it.line_total)) return null;
    if (typeof it.quantity !== 'number' || !Number.isInteger(it.quantity) || it.quantity < 1 || it.quantity > 100) return null;
    items.push({
      product_id: typeof it.product_id === 'string' ? it.product_id : null,
      product_name: it.product_name as string,
      unit_price: it.unit_price as number,
      quantity: it.quantity,
      line_total: it.line_total as number,
    });
  }

  return {
    order: {
      order_number: b.order_number as string,
      customer_name: b.customer_name as string,
      customer_phone: b.customer_phone as string,
      customer_email: (b.customer_email as string) || null,
      address: b.address as string,
      city: b.city as string,
      notes: (b.notes as string) || null,
      subtotal: b.subtotal as number,
      shipping_fee: b.shipping_fee as number,
      total: b.total as number,
    },
    items,
  };
}

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const origin = req.headers.get('Origin');
    const cors = corsHeaders(origin, env);

    if (req.method === 'OPTIONS') {
      return new Response(null, { headers: cors });
    }
    if (req.method !== 'POST') {
      return json({ error: 'Not found' }, 404, cors);
    }

    const url = new URL(req.url);

    // Public endpoint — no session required. Uses the service-role key
    // server-side (a Worker secret, never sent to the browser) because
    // this project's Data API intermittently/consistently rejects the
    // equivalent anon-key insert with a false RLS error when called
    // directly from a browser, despite Postgres RLS itself being verified
    // correct (SET ROLE anon + insert succeeds every time at the database
    // level). Routing through here sidesteps that edge-layer issue.
    if (url.pathname === '/orders/create') {
      let body: unknown;
      try {
        body = await req.json();
      } catch {
        return json({ error: 'Invalid request' }, 400, cors);
      }
      const validated = validateOrderInput(body);
      if (!validated) {
        return json({ error: 'Invalid order data' }, 400, cors);
      }

      const restBase = `${env.SUPABASE_URL}/rest/v1`;
      const serviceHeaders = {
        apikey: env.SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
      };

      const orderRes = await fetch(`${restBase}/orders`, {
        method: 'POST',
        headers: { ...serviceHeaders, Prefer: 'return=representation' },
        body: JSON.stringify({ ...validated.order, status: 'new' }),
      });

      if (!orderRes.ok) {
        return json({ error: 'Could not save order, please try again' }, 502, cors);
      }

      const insertedOrders = (await orderRes.json()) as Array<{ id: string }>;
      const newOrderId = insertedOrders?.[0]?.id;

      if (newOrderId && validated.items.length > 0) {
        const itemPayloads = validated.items.map((i) => ({ ...i, order_id: newOrderId }));
        await fetch(`${restBase}/order_items`, {
          method: 'POST',
          headers: serviceHeaders,
          body: JSON.stringify(itemPayloads),
        });
      }

      return json({ ok: true, id: newOrderId }, 200, cors);
    }

    const authed = await verifySession(req, env);
    if (!authed) {
      return json({ error: 'Unauthorized' }, 401, cors);
    }

    if (url.pathname === '/images/upload') {
      const key = url.searchParams.get('key') || '';
      if (!UPLOAD_KEY_PATTERN.test(key)) {
        return json({ error: 'Invalid image key' }, 400, cors);
      }
      const body = await req.arrayBuffer();
      if (body.byteLength === 0 || body.byteLength > MAX_UPLOAD_BYTES) {
        return json({ error: 'Image is too large, try one under 5 MB' }, 400, cors);
      }
      const { client, baseUrl } = r2Client(env);
      const putRes = await client.fetch(`${baseUrl}/${key}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'image/webp',
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
        body,
      });
      if (!putRes.ok) {
        return json({ error: 'Upload failed, please try again' }, 502, cors);
      }
      return json({ ok: true, key }, 200, cors);
    }

    if (url.pathname === '/images/delete') {
      let payload: { stem?: string };
      try {
        payload = await req.json();
      } catch {
        return json({ error: 'Invalid request' }, 400, cors);
      }
      if (!isSafeStem(payload.stem)) {
        return json({ error: 'Invalid image reference' }, 400, cors);
      }
      const { client, baseUrl } = r2Client(env);
      const keys = ['300w', '700w', '1400w'].map((v) => `${payload.stem}-${v}.webp`);
      await Promise.all(keys.map((k) => client.fetch(`${baseUrl}/${k}`, { method: 'DELETE' })));
      return json({ ok: true }, 200, cors);
    }

    if (url.pathname === '/publish') {
      const ghRes = await fetch(
        `https://api.github.com/repos/${env.GITHUB_OWNER}/${env.GITHUB_REPO}/actions/workflows/publish.yml/dispatches`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${env.GITHUB_TOKEN}`,
            Accept: 'application/vnd.github+json',
            'User-Agent': 'tinykids-admin-api',
          },
          body: JSON.stringify({ ref: 'main' }),
        }
      );
      if (!ghRes.ok) {
        const detail = await ghRes.text();
        return json({ error: 'Publish trigger failed', detail }, 502, cors);
      }
      return json({ ok: true }, 200, cors);
    }

    return json({ error: 'Not found' }, 404, cors);
  },
} satisfies ExportedHandler<Env>;
