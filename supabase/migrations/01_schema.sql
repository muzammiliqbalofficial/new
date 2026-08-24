-- 01_schema.sql: Baby & Kids Store Database Schema

-- Enable UUID extension if not enabled
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

-- 3. Product Images Table
-- Note: r2_key stores the bare object stem with no extension (e.g. "496335818-1-1df0f6c5").
-- The custom storefront image loader appends "-300w.webp", "-700w.webp", or "-1400w.webp".
CREATE TABLE IF NOT EXISTS public.product_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    r2_key TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    is_primary BOOLEAN DEFAULT FALSE,
    is_description_image BOOLEAN DEFAULT FALSE,
    is_white_background BOOLEAN DEFAULT FALSE,
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

-- 6. Settings Table (Strict Singleton: exactly one row with id = 1)
CREATE TABLE IF NOT EXISTS public.settings (
    id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    store_name TEXT NOT NULL DEFAULT 'Baby Store',
    store_domain TEXT NOT NULL DEFAULT '',
    whatsapp_number TEXT NOT NULL DEFAULT '',
    contact_email TEXT NOT NULL DEFAULT '',
    shipping_flat_rate NUMERIC NOT NULL DEFAULT 200,
    announcement_bar_text TEXT NOT NULL DEFAULT 'Cash on Delivery Available Nationwide | Easy Returns',
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Indexes for fast queries
CREATE INDEX IF NOT EXISTS idx_products_category_id ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_is_published ON public.products(is_published);
CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON public.product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
