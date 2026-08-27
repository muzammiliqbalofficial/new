-- 04_admin_dashboard.sql: Schema additions for the admin dashboard.
-- Soft delete for products, internal (admin-only) order notes.

ALTER TABLE public.products ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS internal_notes TEXT;

CREATE INDEX IF NOT EXISTS idx_products_deleted_at ON public.products(deleted_at);

-- Public storefront must never see soft-deleted products, even if published.
DROP POLICY IF EXISTS "Allow public read published products" ON public.products;
CREATE POLICY "Allow public read published products"
    ON public.products FOR SELECT TO anon, authenticated
    USING (is_published = TRUE AND deleted_at IS NULL);

-- Same for their images.
DROP POLICY IF EXISTS "Allow public read product images" ON public.product_images;
CREATE POLICY "Allow public read product images"
    ON public.product_images FOR SELECT TO anon, authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.products
            WHERE products.id = product_images.product_id
            AND products.is_published = TRUE
            AND products.deleted_at IS NULL
        )
    );
