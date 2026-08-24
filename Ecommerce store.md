# Build Prompt — Baby & Kids Products E-commerce Storefront

Paste everything below into Claude Code, in a folder that already contains
`catalog.json`, `images_manifest.csv` and `download_images.py`.

---

## Project brief

Build a production ready e-commerce storefront for a Pakistani baby and kids products
retailer. The client currently sells on Daraz and is moving to their own domain. The
entire product catalogue has already been exported and cleaned into `catalog.json` in
the project root. Do not scrape anything; that file is the single source of truth.

The client left a hosted platform specifically to eliminate a recurring monthly fee, so
every architectural decision must favour zero or near zero running cost. Do not
introduce a managed database, a paid CMS, or any paid third party service without
flagging it first.

## Tech stack (use exactly this)

- Next.js 15, App Router, TypeScript
- Tailwind CSS
- Supabase for Postgres and Auth (free tier)
- **Cloudflare Pages / Workers for hosting**, via the `@opennextjs/cloudflare` adapter
- **Cloudflare R2 for all product images**, served through a custom domain on the
  Cloudflare CDN
- Incremental Static Regeneration for catalogue pages, so the storefront stays fast but
  reflects price and stock edits without a manual rebuild
- Cart state in React Context, persisted to `localStorage`
- No customer accounts. The only login in the system is the client's admin login,
  covered in `ADMIN_DASHBOARD_PROMPT.md`.

### Why this hosting, and what not to substitute

Do not deploy to Vercel, and do not suggest it. Vercel's Hobby plan forbids commercial
use, and their definition of commercial includes any project that financially benefits
anyone involved in producing it — which covers both a store making sales and a paid
developer. Netlify's free plan permits commercial use but runs on a hard monthly credit
cap with no auto recharge, so the site simply stops serving when the credits run out.
Cloudflare Pages allows commercial use and does not meter bandwidth, which is the right
shape for a low traffic store that must cost nothing to run.

Images must never be served from Supabase Storage. The free tier allows roughly 10 GB of
egress per month across the whole organisation, and an image heavy catalogue page will
exhaust that quickly. Supabase serves JSON only; Cloudflare serves every byte of media.

**Phase 2 exists.** A separate admin dashboard is specified in
`ADMIN_DASHBOARD_PROMPT.md` in this same folder. Read it before designing the data
layer, because the storefront reads from the same Supabase tables the admin writes to.
`catalog.json` is the seed for that database, not the runtime data source.

## Data contract

`catalog.json` is an array of 190 product objects across 37 categories. Exact shape:

```jsonc
{
  "id": "496370954",
  "slug": "newborn-baby-baba-welcome-to-the-world-starter-set",
  "name": "Newborn Baby Baba Welcome To The World Starter Set",
  "name_original": "...the full keyword stuffed Daraz title...",
  "category": "Sets Packs",
  "daraz_category_id": "8970",
  "currency": "PKR",
  "brand": "No Brand",
  "warranty": "No Warranty",
  "attributes": { "Brand": "No Brand", "Recommended Age": "0-3months",
                  "Recommended Gender": "Unisex", "Country of Origin": "Bangladesh" },
  "images": [ { "url": "https://...", "local": "496370954-1-39f19931.jpg" } ],
  "white_background_image": { "url": "...", "local": "..." },   // or null
  "description_html": "<div><p>...</p></div>",                  // inline <img> already stripped
  "description_text": "plain text version, use for meta description",
  "description_images": [ "496370954-desc1-ab12cd34.jpg" ],
  "variants": [ { "sku": "", "variation": "", "price": "", "sale_price": "", "stock": "" } ],
  "price": "",
  "sale_price": "",
  "stock": "",
  "published": false
}
```

Notes you must handle:

- **`price`, `sale_price`, `stock` and `variants` are currently empty for every product.**
  The client has not yet supplied the price and stock export. The site must degrade
  gracefully: where a product has no price, show "Price on request" and replace the Add
  to Cart button with a WhatsApp enquiry button. When prices are filled in later,
  nothing in the code should need to change.
- Images average 6 per product. Local filenames live in `images[].local`; the files land
  in `public/images/` after running `python download_images.py`. Those local files are
  the upload source only — the seed script pushes them to R2 and the site references the
  R2 URL. Do not ship 1574 images inside the deployment bundle, and never hotlink the
  remote `url` values in production, because the source host may block them.
- Only 38 of 190 products have a `white_background_image`. Fall back to `images[0]`.
- Attribute coverage is uneven: Brand 190, Country of Origin 135, Recommended Age 130,
  Recommended Gender 116, everything else near zero. Render the attributes table from
  whatever keys exist on that product; never render an empty row or a hardcoded schema.
- `brand` is `"No Brand"` for the whole catalogue. Do not display a brand field or a
  brand filter anywhere.
- `description_html` is sanitised Daraz markup and is mostly Roman Urdu mixed with
  English. Render it as HTML but sanitise again on the client. Keep the language as is.
- `description_images` are supplementary images extracted from the description body.
  Show them below the description text, not in the main gallery.

## Pages to build

1. **Home** — hero section, category grid (all 37 categories with a representative
   product image), a "New Arrivals" strip, and a trust bar covering cash on delivery,
   nationwide shipping and easy returns.
2. **Category listing** `/category/[slug]` — responsive product grid, client side filter
   by Recommended Age and Recommended Gender, sort by name and price, pagination or
   infinite scroll at 24 per page.
3. **Product detail** `/product/[slug]` — image gallery with thumbnails and swipe on
   mobile, price block, quantity selector, Add to Cart, WhatsApp enquiry button,
   attributes table, description, description images, and a related products row drawn
   from the same category.
4. **Search** — client side fuzzy search over `name`, `name_original` and `category`.
   Search `name_original` too, because the long Daraz titles carry the keywords buyers
   actually type. Never display `name_original` in the UI.
5. **Cart** — line items, quantity edit, remove, subtotal, shipping note, checkout CTA.
6. **Checkout** — a single page form: name, phone, full address, city, optional email,
   optional order notes. Cash on delivery is the only payment method in this phase.
   On submit, write the order to the `orders` and `order_items` tables first, then open
   WhatsApp with a pre-filled summary via a `wa.me` deep link, using a phone number read
   from an environment variable. The database write is the record of truth; WhatsApp is
   only the notification. If the WhatsApp link fails to open, the order must still be
   saved and the customer must still see a confirmation with their order number.
7. **Static pages** — About, Contact, Shipping & Delivery, Returns & Exchange, Privacy
   Policy. Write reasonable placeholder copy for a Pakistani baby products retailer and
   clearly mark it as placeholder for the client to review.

## Design direction

Warm and soft, appropriate for a baby and kids brand, but restrained rather than
cartoonish. Choose a considered palette and a real typographic hierarchy — do not ship
default Tailwind blue on white. Mobile first: the large majority of Pakistani
e-commerce traffic is mobile, so design the phone layout first and let the desktop
layout follow. Product images are the hero of every page; give them room.

## Non negotiable requirements

- Prices in PKR with thousands separators, e.g. `Rs. 2,450`.
- Every image uses `next/image` with correct `sizes`, lazy loading below the fold, and a
  blur placeholder. Next's default image optimiser does not run on Cloudflare Workers —
  configure a custom loader that points at Cloudflare Images resizing, or pre-generate
  the required sizes at seed time and store each variant in R2. Pick one, implement it
  fully, and say which you chose and why.
- Per product SEO: unique `<title>`, meta description built from `description_text`,
  Open Graph tags, and Product JSON-LD structured data.
- `sitemap.xml` and `robots.txt` generated at build time.
- Accessible: real button and anchor elements, alt text on every image from the product
  name, keyboard navigable cart and gallery.
- No layout shift on image load.
- Lighthouse performance above 90 on mobile for the product detail page.

## Deployment and operations

Target Cloudflare Pages / Workers through `@opennextjs/cloudflare`. Verify that ISR and
on demand revalidation actually work on that adapter before building features on top of
them; if a limitation appears, raise it rather than silently falling back to a full
rebuild on every price change.

Also produce these two operational pieces, because the free tier does not provide them:

1. **Weekly database backup.** A GitHub Action on a cron schedule that runs `pg_dump`
   against Supabase and commits the dump to a private repository. Orders and customer
   details live in this database and the free plan includes no automated backups, so
   this is not optional.
2. **Keepalive.** A scheduled Cloudflare Worker, or a cron job in the same Action, that
   makes one small query against the database every day. Supabase pauses free projects
   after about a week of inactivity, and a new store with little traffic can trip that.

Write a short `DEPLOYMENT.md` covering: creating the Supabase project, creating the R2
bucket and binding a custom domain to it, setting every secret, running the seed script,
connecting the repo to Cloudflare Pages, and pointing the client's domain at it. Write it
for someone following it six months from now who has forgotten every step.

## Explicitly out of scope

Do not build: customer accounts, wishlist, product reviews, a payment gateway
integration, multi language switching, or a recommendation engine. If you think one of
these is essential, say so instead of building it. The admin dashboard is a separate
phase with its own prompt — do not start it during this phase.

## Build order

1. Scaffold the project, wire the data loader with typed interfaces derived from the
   schema above, and print a short report confirming product count, category count and
   how many products resolved a main image.
2. Layout shell: header with search and cart, footer, category navigation.
3. Category and product detail pages.
4. Cart and checkout.
5. SEO, sitemap, static pages.
6. Performance pass.

Stop after step 1 and show the report before continuing, so the data mapping can be
verified before any UI is built on top of it.

## Environment variables

```
NEXT_PUBLIC_STORE_NAME=
NEXT_PUBLIC_STORE_DOMAIN=
NEXT_PUBLIC_WHATSAPP_NUMBER=      # international format, no plus sign
NEXT_PUBLIC_CONTACT_EMAIL=
NEXT_PUBLIC_SHIPPING_FLAT_RATE=   # PKR, used until the client confirms real rates

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=        # server only, never expose to the client
SUPABASE_DB_URL=                  # used by the seed script and the backup Action

NEXT_PUBLIC_R2_PUBLIC_URL=        # custom domain in front of the R2 bucket
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=
REVALIDATE_SECRET=                # guards the on demand revalidation endpoint
```

Create a `.env.example` with these keys and sensible comments. Do not hardcode any store
specific value in a component.
