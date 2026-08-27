import { AwsClient } from 'aws4fetch';

export interface Env {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
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

    const authed = await verifySession(req, env);
    if (!authed) {
      return json({ error: 'Unauthorized' }, 401, cors);
    }

    const url = new URL(req.url);

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
