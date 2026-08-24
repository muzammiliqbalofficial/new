# Build Prompt — Phase 2: Admin Dashboard

Read `CLAUDE_CODE_PROMPT.md` first. This document specifies the admin side of the same
Next.js application and the Supabase schema that both phases share.

---

## Who this is for

One person: the store owner. They are **not technical**. They have never used a database,
a CMS, or a deployment tool. They currently manage their inventory through the Daraz
seller app on a phone. Assume they will use this dashboard on a mid range Android phone
far more often than on a laptop.

That single fact drives every decision below. If a choice makes the code cleaner but the
interface harder for that person, make the interface easier.

## Data layer

Supabase Postgres for data and Auth. **Cloudflare R2 for all image files** — Supabase
Storage is not used anywhere in this project, because its free tier egress allowance is
too small to serve a product catalogue. Design the schema so the storefront reads from
the same tables the admin writes to. Seed it from `catalog.json` with a one time
migration script.

### Tables

**`categories`** — id, name, slug, sort_order, is_visible, created_at.
Seed from the 37 distinct `category` values in `catalog.json`.

**`products`** — id (use the Daraz product id as an external reference, not the primary
key), slug (unique), name, description_html, description_text, category_id, brand,
warranty, currency default `PKR`, price numeric nullable, sale_price numeric nullable,
stock integer default 0, is_published boolean default false, attributes jsonb,
sort_order, created_at, updated_at.

`attributes` stays jsonb because coverage across the catalogue is uneven — Brand appears
on all 190 products, Country of Origin on 135, Recommended Age on 130, Recommended
Gender on 116, and everything else on fewer than 5. Do not create columns for these.

**`product_images`** — id, product_id, r2_key, sort_order, is_primary,
is_description_image boolean. Seed from the `images` and `description_images` arrays.
Store only the R2 object key, not a full URL, so the CDN domain can change later without
a data migration.

**`orders`** — id, order_number (human readable, e.g. `TK-1042`), customer_name,
customer_phone, customer_email nullable, address, city, notes nullable, subtotal,
shipping_fee, total, status enum (`new`, `confirmed`, `shipped`, `delivered`,
`cancelled`) default `new`, created_at, updated_at.

**`order_items`** — id, order_id, product_id, product_name snapshot, unit_price snapshot,
quantity, line_total. Snapshot the name and price at order time so later price edits
never rewrite past orders.

**`settings`** — single row key value store for WhatsApp number, shipping flat rate,
store name, contact email, and the announcement bar text.

### Row Level Security

Enable RLS on every table. Public anon role gets read only access to `products`,
`product_images`, `categories` and `settings`, filtered to published rows. Orders are
insert only for anon and readable only by the authenticated admin. Everything else
requires the admin role. The R2 bucket is public read through its CDN domain; all writes
go through a server route that checks the admin session, never from the browser directly.

### Migration script

Write `scripts/seed.ts` that reads `catalog.json`, uploads the files from
`public/images/` to the Cloudflare R2 bucket, and populates all tables. Convert each
image to WebP and cap the long edge at 1600px during upload — the raw Daraz files are
larger than a product page needs. It must be idempotent, safe to run twice without
creating duplicates or re-uploading files that already exist. Print a summary at the end:
products inserted, images uploaded, images skipped, images that failed, categories
created, and total bytes now in the bucket.

## Authentication

Supabase Auth, email and password, exactly one account. No signup page — create the
account manually and document how. Protect `/admin/*` with middleware. Session lasts 30
days so the client is not logged out constantly. Include a password reset flow that
sends an email, because they will forget the password.

## Screens

### `/admin` — Overview

Four large cards: new orders today, orders this week, products out of stock, products
with no price set. Below that, the five most recent orders as a tappable list. Every
number links to the filtered view behind it. No charts in this phase.

### `/admin/products` — Product list

The screen they will live in. Requirements:

- Search box, category filter, and quick filters for "out of stock", "no price",
  "hidden".
- Each row shows a thumbnail, name, category, price, stock, and a visibility toggle.
- **Price and stock are editable inline.** Tap the number, type, tap away, it saves.
  Show a brief saved indicator. No modal, no separate edit page for this.
- Bulk selection with two actions: publish/unpublish, and apply a percentage or fixed
  price change to selected products.
- Because 190 products all currently have no price, add a dedicated "Set prices" mode
  that shows only unpriced products in a compact list, one input per row, so the client
  can work through the backlog in one sitting.

### `/admin/products/new` and `/admin/products/[id]`

A single form, grouped into clearly labelled sections: Basics, Pricing & Stock, Images,
Description, Details. Requirements:

- Slug is generated from the name automatically and hidden behind an "Advanced" toggle.
- Image upload by drag and drop or file picker, multiple at once, with reorder by
  dragging and a "make this the main image" action. Uploads go to a server route that
  verifies the admin session, converts to WebP, caps the long edge at 1600px, and writes
  to R2. Show upload progress. Deleting an image must remove the R2 object too, so the
  bucket does not fill with orphans.
- Description uses a simple rich text editor with bold, italic, lists, and headings
  only. No HTML source view.
- Attributes are editable as add/remove key value pairs, with the four common keys
  offered as suggestions.
- Unsaved changes warning on navigate away.
- Delete asks for confirmation and soft deletes, so a mistake is recoverable.

### `/admin/orders` — Order list

Filter by status and date range. Each row shows order number, customer name, city,
total, status, and time. Status is changed from the list with a dropdown, no page load.
Export the current filtered view to CSV.

### `/admin/orders/[id]` — Order detail

Full customer details with a tap to call and tap to WhatsApp on the phone number, the
item list with images, totals, status history, and an internal notes field. Add a
"Print invoice" view that prints cleanly on A4 with the store name and order details,
because they will need something to put in the parcel.

### `/admin/settings`

WhatsApp number, shipping flat rate, store name, contact email, announcement bar text.
Nothing technical. No API keys, no environment variables, no database controls.

## Interface rules for a non technical user

- Plain language throughout. "Hidden from customers", not "unpublished". "Not for sale
  yet", not "draft state".
- Every destructive action confirms, and the confirmation names the thing being deleted.
- Every save shows visible feedback. Never leave them wondering whether it worked.
- Errors say what to do next, not what went wrong internally. "Image is too large, try
  one under 5 MB" beats a stack trace or a status code.
- Fully usable on a 360px wide screen. Tap targets at least 44px. No horizontal scrolling
  tables on mobile — collapse rows into cards below the tablet breakpoint.
- No feature requires understanding slugs, JSON, markdown, or image dimensions.

## Keeping the storefront in sync

When the admin saves a product, price, stock or visibility change, trigger on demand
revalidation for the affected product page, its category page, and the home page. The
client must be able to change a price and see it live on the site within seconds, not
wait for a rebuild. Verify this end to end and demonstrate it.

## Out of scope

Multiple admin users and roles, discount coupons, analytics dashboards, inventory
history, automated Daraz sync, and email notifications. Do not build these. If any turns
out to be necessary, raise it rather than adding it.

## Build order

1. Supabase schema, RLS policies, and the seed script. Run the seed and print the
   summary. **Stop here and show the result before continuing.**
2. Auth and the protected admin shell.
3. Product list with inline price and stock editing, plus the "Set prices" mode. This is
   the highest value screen — get it working before anything else.
4. Product create and edit form with image upload.
5. Orders list and order detail.
6. Overview and settings.
7. On demand revalidation wiring and an end to end test.
