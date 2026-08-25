# Tiny Kids Storefront — Deployment & Operations Guide

This guide documents the complete zero-running-cost setup and deployment for **Tiny Kids**. It covers Supabase Postgres, Cloudflare R2 Image Storage, Next.js OpenNext build, and operational backups.

---

## Architecture Overview
- **Storefront**: Next.js 15 (App Router, Tailwind CSS, TypeScript)
- **Edge Deployment**: Cloudflare Pages / Workers via `@opennextjs/cloudflare`
- **Database & Auth**: Supabase Postgres (Free Tier)
- **Image Storage & Delivery**: Cloudflare R2 (S3-Compatible, Free Tier Egress)
- **Cart & Checkout**: React Context + LocalStorage + Postgres COD Orders + WhatsApp Notification

---

## 1. Supabase Setup
1. Create a free project at [supabase.com](https://supabase.com).
2. Go to **SQL Editor** (`>_`) and paste/run [`supabase/migrations/03_full_setup.sql`](./supabase/migrations/03_full_setup.sql).
3. Under **Project Settings -> API Keys**, retrieve:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

---

## 2. Cloudflare R2 Image Bucket
1. Open Cloudflare Dashboard -> **Storage & Databases -> R2**.
2. Click **Create Bucket** and name it `tinykids-images`.
3. In Bucket **Settings -> Public Access**, enable the **R2.dev Subdomain** or connect a custom domain (e.g. `images.tinykids.pk`).
4. Under **Manage R2 API Tokens**, create an **Object Read & Write** token to get:
   - `R2_ACCOUNT_ID`
   - `R2_ACCESS_KEY_ID`
   - `R2_SECRET_ACCESS_KEY`

---

## 3. Populate `.env` & Run Migration Seed
Add the credentials to `.env`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://<your-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>

NEXT_PUBLIC_R2_PUBLIC_URL=https://<your-r2-public-url>
R2_ACCOUNT_ID=<your-account-id>
R2_ACCESS_KEY_ID=<your-access-key-id>
R2_SECRET_ACCESS_KEY=<your-secret-access-key>
R2_BUCKET_NAME=tinykids-images

NEXT_PUBLIC_STORE_NAME="Tiny Kids"
NEXT_PUBLIC_STORE_DOMAIN="tinykids.pk"
NEXT_PUBLIC_WHATSAPP_NUMBER="923001234567"
NEXT_PUBLIC_CONTACT_EMAIL="info@tinykids.pk"
NEXT_PUBLIC_SHIPPING_FLAT_RATE="200"
REVALIDATE_SECRET="random-secret-key-for-cache"
```

Run the seed script:
```bash
npm run seed
npm run verify:anon
```

---

## 4. Deploying to Cloudflare Pages
1. Push this repository to GitHub.
2. In Cloudflare Dashboard -> **Workers & Pages** -> **Create application** -> **Pages** -> **Connect to Git**.
3. Configure build settings:
   - **Framework preset**: `None` / `Next.js`
   - **Build command**: `npx @opennextjs/cloudflare build`
   - **Output directory**: `.open-next/assets`
4. In Project Settings -> **Environment variables**, add all variables from `.env`.
5. Point the client's custom domain (e.g. `tinykids.pk`) to Cloudflare Pages.

---

## 5. Operations & Automated Maintenance
- **Supabase Free Tier Keepalive**: The GitHub Action `.github/workflows/keepalive-and-backup.yml` sends a daily query to prevent Supabase from pausing after 7 days of inactivity.
- **Weekly Automated Backup**: Runs `pg_dump` every Sunday at 02:00 UTC and saves the database snapshot.
