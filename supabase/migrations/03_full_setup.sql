-- 03_full_setup.sql: Complete Supabase Database Setup for Baby & Kids Store
-- Contains schema creation with unique constraints, indexes, RLS policies, and scoped PostgREST Data API grants.

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    sort_order INTEGER DEFAULT 0,
    is_visible BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Products Table
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    daraz_id TEXT,
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    name_original TEXT,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    brand TEXT DEFAULT 'No Brand',
    warranty TEXT DEFAULT 'No Warranty',
    currency TEXT DEFAULT 'PKR',
    price NUMERIC NULL,
    sale_price NUMERIC NULL,
    stock INTEGER DEFAULT 0 NOT NULL,
    is_published BOOLEAN DEFAULT FALSE NOT NULL,
    attributes JSONB DEFAULT '{}'::jsonb NOT NULL,
    description_html TEXT,
    description_text TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Product Images Table (with UNIQUE constraint on product_id, r2_key for idempotency)
CREATE TABLE IF NOT EXISTS public.product_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    r2_key TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    is_primary BOOLEAN DEFAULT FALSE,
    is_description_image BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    CONSTRAINT uq_product_images_product_r2_key UNIQUE (product_id, r2_key)
);

-- 4. Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number TEXT NOT NULL UNIQUE,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_email TEXT,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    notes TEXT,
    subtotal NUMERIC DEFAULT 0 NOT NULL,
    shipping_fee NUMERIC DEFAULT 0 NOT NULL,
    total NUMERIC DEFAULT 0 NOT NULL,
    status TEXT DEFAULT 'new' NOT NULL CHECK (status IN ('new', 'confirmed', 'shipped', 'delivered', 'cancelled')),
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. Order Items Table
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,
    unit_price NUMERIC DEFAULT 0 NOT NULL,
    quantity INTEGER DEFAULT 1 NOT NULL,
    line_total NUMERIC DEFAULT 0 NOT NULL
);

-- 6. Settings Table
CREATE TABLE IF NOT EXISTS public.settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_name TEXT NOT NULL DEFAULT 'Baby Store',
    store_domain TEXT NOT NULL DEFAULT '',
    whatsapp_number TEXT NOT NULL DEFAULT '',
    contact_email TEXT NOT NULL DEFAULT '',
    shipping_flat_rate NUMERIC NOT NULL DEFAULT 200,
    announcement_bar_text TEXT NOT NULL DEFAULT 'Cash on Delivery Available Nationwide | Easy Returns',
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_products_category_id ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_is_published ON public.products(is_published);
CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON public.product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);

-- ==============================================================================
-- Row Level Security (RLS)
-- ==============================================================================
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if re-running
DROP POLICY IF EXISTS "Allow public read visible categories" ON public.categories;
DROP POLICY IF EXISTS "Allow authenticated full access categories" ON public.categories;
DROP POLICY IF EXISTS "Allow service_role full access categories" ON public.categories;

DROP POLICY IF EXISTS "Allow public read published products" ON public.products;
DROP POLICY IF EXISTS "Allow authenticated full access products" ON public.products;
DROP POLICY IF EXISTS "Allow service_role full access products" ON public.products;

DROP POLICY IF EXISTS "Allow public read product images" ON public.product_images;
DROP POLICY IF EXISTS "Allow authenticated full access product_images" ON public.product_images;
DROP POLICY IF EXISTS "Allow service_role full access product_images" ON public.product_images;

DROP POLICY IF EXISTS "Allow public insert orders" ON public.orders;
DROP POLICY IF EXISTS "Allow authenticated full access orders" ON public.orders;
DROP POLICY IF EXISTS "Allow service_role full access orders" ON public.orders;

DROP POLICY IF EXISTS "Allow public insert order items" ON public.order_items;
DROP POLICY IF EXISTS "Allow authenticated full access order_items" ON public.order_items;
DROP POLICY IF EXISTS "Allow service_role full access order_items" ON public.order_items;

DROP POLICY IF EXISTS "Allow public read settings" ON public.settings;
DROP POLICY IF EXISTS "Allow authenticated full access settings" ON public.settings;
DROP POLICY IF EXISTS "Allow service_role full access settings" ON public.settings;

-- Policies
CREATE POLICY "Allow public read visible categories"
    ON public.categories FOR SELECT TO anon, authenticated USING (is_visible = TRUE);
CREATE POLICY "Allow authenticated full access categories"
    ON public.categories FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Allow service_role full access categories"
    ON public.categories FOR ALL TO service_role USING (TRUE) WITH CHECK (TRUE);

CREATE POLICY "Allow public read published products"
    ON public.products FOR SELECT TO anon, authenticated USING (is_published = TRUE);
CREATE POLICY "Allow authenticated full access products"
    ON public.products FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Allow service_role full access products"
    ON public.products FOR ALL TO service_role USING (TRUE) WITH CHECK (TRUE);

CREATE POLICY "Allow public read product images"
    ON public.product_images FOR SELECT TO anon, authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.products
            WHERE products.id = product_images.product_id
            AND products.is_published = TRUE
        )
    );
CREATE POLICY "Allow authenticated full access product_images"
    ON public.product_images FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Allow service_role full access product_images"
    ON public.product_images FOR ALL TO service_role USING (TRUE) WITH CHECK (TRUE);

CREATE POLICY "Allow public insert orders"
    ON public.orders FOR INSERT TO anon, authenticated WITH CHECK (TRUE);
CREATE POLICY "Allow authenticated full access orders"
    ON public.orders FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Allow service_role full access orders"
    ON public.orders FOR ALL TO service_role USING (TRUE) WITH CHECK (TRUE);

CREATE POLICY "Allow public insert order items"
    ON public.order_items FOR INSERT TO anon, authenticated WITH CHECK (TRUE);
CREATE POLICY "Allow authenticated full access order_items"
    ON public.order_items FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Allow service_role full access order_items"
    ON public.order_items FOR ALL TO service_role USING (TRUE) WITH CHECK (TRUE);

CREATE POLICY "Allow public read settings"
    ON public.settings FOR SELECT TO anon, authenticated USING (TRUE);
CREATE POLICY "Allow authenticated full access settings"
    ON public.settings FOR ALL TO authenticated USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY "Allow service_role full access settings"
    ON public.settings FOR ALL TO service_role USING (TRUE) WITH CHECK (TRUE);

-- ==============================================================================
-- Scoped PostgREST Data API Grants (Post-May 30, 2026 Supabase Requirement)
-- ==============================================================================
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

GRANT SELECT ON public.categories TO anon;
GRANT SELECT ON public.products TO anon;
GRANT SELECT ON public.product_images TO anon;
GRANT SELECT ON public.settings TO anon;
GRANT INSERT ON public.orders TO anon;
GRANT INSERT ON public.order_items TO anon;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.categories TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.product_images TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.orders TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.order_items TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.settings TO authenticated;

GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
