-- ============================================================
-- Run this in Supabase SQL Editor to fix production issues
-- ============================================================

-- 1. Fix status constraint to allow 'cancelled'
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;
ALTER TABLE orders ADD CONSTRAINT orders_status_check
  CHECK (status IN ('pending', 'processing', 'delivered', 'cancelled'));

-- 2. Add missing columns (safe — ignored if already exist)
ALTER TABLE products ADD COLUMN IF NOT EXISTS discount_percentage integer DEFAULT NULL;
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_featured boolean DEFAULT false;

-- 3. Make sure all RLS policies are correct
-- Drop and recreate to avoid conflicts
DROP POLICY IF EXISTS "Orders can be inserted by anyone" ON orders;
DROP POLICY IF EXISTS "Orders are readable" ON orders;
DROP POLICY IF EXISTS "Orders are updatable" ON orders;
DROP POLICY IF EXISTS "orders_select" ON orders;
DROP POLICY IF EXISTS "orders_insert" ON orders;
DROP POLICY IF EXISTS "orders_update" ON orders;

CREATE POLICY "orders_insert" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "orders_select" ON orders FOR SELECT USING (true);
CREATE POLICY "orders_update" ON orders FOR UPDATE USING (true);
CREATE POLICY "orders_delete" ON orders FOR DELETE USING (true);

-- 4. Make sure products RLS is open
DROP POLICY IF EXISTS "Products are publicly readable" ON products;
DROP POLICY IF EXISTS "Products are publicly writable" ON products;
DROP POLICY IF EXISTS "products_all" ON products;

CREATE POLICY "products_all" ON products FOR ALL USING (true) WITH CHECK (true);
