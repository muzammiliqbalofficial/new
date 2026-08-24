-- 02_rls_and_grants.sql: Row Level Security and PostgREST Data API Grants

-- ==============================================================================
-- 1. Enable Row Level Security (RLS) on all tables
-- ==============================================================================
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- ==============================================================================
-- 2. Drop existing policies to allow clean re-runs
-- ==============================================================================
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

-- ==============================================================================
-- 3. Define RLS Policies
-- ==============================================================================

-- Categories
CREATE POLICY "Allow public read visible categories"
    ON public.categories FOR SELECT
    TO anon, authenticated
    USING (is_visible = TRUE);

CREATE POLICY "Allow authenticated full access categories"
    ON public.categories FOR ALL
    TO authenticated
    USING (TRUE)
    WITH CHECK (TRUE);

CREATE POLICY "Allow service_role full access categories"
    ON public.categories FOR ALL
    TO service_role
    USING (TRUE)
    WITH CHECK (TRUE);

-- Products
CREATE POLICY "Allow public read published products"
    ON public.products FOR SELECT
    TO anon, authenticated
    USING (is_published = TRUE);

CREATE POLICY "Allow authenticated full access products"
    ON public.products FOR ALL
    TO authenticated
    USING (TRUE)
    WITH CHECK (TRUE);

CREATE POLICY "Allow service_role full access products"
    ON public.products FOR ALL
    TO service_role
    USING (TRUE)
    WITH CHECK (TRUE);

-- Product Images
CREATE POLICY "Allow public read product images"
    ON public.product_images FOR SELECT
    TO anon, authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.products
            WHERE products.id = product_images.product_id
            AND products.is_published = TRUE
        )
    );

CREATE POLICY "Allow authenticated full access product_images"
    ON public.product_images FOR ALL
    TO authenticated
    USING (TRUE)
    WITH CHECK (TRUE);

CREATE POLICY "Allow service_role full access product_images"
    ON public.product_images FOR ALL
    TO service_role
    USING (TRUE)
    WITH CHECK (TRUE);

-- Orders
CREATE POLICY "Allow public insert orders"
    ON public.orders FOR INSERT
    TO anon, authenticated
    WITH CHECK (TRUE);

CREATE POLICY "Allow authenticated full access orders"
    ON public.orders FOR ALL
    TO authenticated
    USING (TRUE)
    WITH CHECK (TRUE);

CREATE POLICY "Allow service_role full access orders"
    ON public.orders FOR ALL
    TO service_role
    USING (TRUE)
    WITH CHECK (TRUE);

-- Order Items
CREATE POLICY "Allow public insert order items"
    ON public.order_items FOR INSERT
    TO anon, authenticated
    WITH CHECK (TRUE);

CREATE POLICY "Allow authenticated full access order_items"
    ON public.order_items FOR ALL
    TO authenticated
    USING (TRUE)
    WITH CHECK (TRUE);

CREATE POLICY "Allow service_role full access order_items"
    ON public.order_items FOR ALL
    TO service_role
    USING (TRUE)
    WITH CHECK (TRUE);

-- Settings
CREATE POLICY "Allow public read settings"
    ON public.settings FOR SELECT
    TO anon, authenticated
    USING (TRUE);

CREATE POLICY "Allow authenticated full access settings"
    ON public.settings FOR ALL
    TO authenticated
    USING (TRUE)
    WITH CHECK (TRUE);

CREATE POLICY "Allow service_role full access settings"
    ON public.settings FOR ALL
    TO service_role
    USING (TRUE)
    WITH CHECK (TRUE);

-- ==============================================================================
-- 4. PostgREST Data API Grants (Post-May 30, 2026 Supabase Requirement)
-- ==============================================================================

-- Ensure schema usage
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

-- Grant anonymous client permissions
GRANT SELECT ON public.categories TO anon;
GRANT SELECT ON public.products TO anon;
GRANT SELECT ON public.product_images TO anon;
GRANT SELECT ON public.settings TO anon;
GRANT INSERT ON public.orders TO anon;
GRANT INSERT ON public.order_items TO anon;

-- Grant authenticated (admin) permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;

-- Grant service_role full permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;

-- Grant sequence permissions
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;

-- Configure default future table privileges
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO postgres, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;
