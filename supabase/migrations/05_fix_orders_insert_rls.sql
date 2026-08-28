-- 05_fix_orders_insert_rls.sql: Re-assert anon insert access on orders/order_items.
-- The policy/grant from 03_full_setup.sql was lost at some point, which silently
-- broke checkout — customers could submit orders but nothing reached the database.
--
-- The "orders" policy was recreated under a new name ("orders_anon_insert_v2")
-- during diagnosis; what actually turned out to be broken was stale connection
-- pool/replica state after a burst of rapid RLS changes, not the policy itself.
-- It self-resolved. Kept the new name here for the schema to match what is
-- actually live.

DROP POLICY IF EXISTS "Allow public insert orders" ON public.orders;
DROP POLICY IF EXISTS "orders_anon_insert_v2" ON public.orders;
CREATE POLICY "orders_anon_insert_v2"
    ON public.orders FOR INSERT TO anon, authenticated WITH CHECK (TRUE);
GRANT INSERT ON public.orders TO anon;

DROP POLICY IF EXISTS "Allow public insert order items" ON public.order_items;
CREATE POLICY "Allow public insert order items"
    ON public.order_items FOR INSERT TO anon, authenticated WITH CHECK (TRUE);
GRANT INSERT ON public.order_items TO anon;
