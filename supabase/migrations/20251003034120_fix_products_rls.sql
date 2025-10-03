-- Fix RLS Policies for Products Table
-- This resolves the circular dependency issue causing 406 errors

-- Drop existing problematic policy
DROP POLICY IF EXISTS "Only admins can modify products" ON products;

-- Create new policy without circular dependency
CREATE POLICY "Only admins can modify products" ON products
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE user_id = auth.uid()
            AND role IN ('admin', 'super_admin')
        )
    );

-- Ensure the SELECT policy still works for everyone
DROP POLICY IF EXISTS "Products are viewable by everyone" ON products;
CREATE POLICY "Products are viewable by everyone" ON products
    FOR SELECT
    USING (true);