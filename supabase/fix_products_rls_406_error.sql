-- Fix for 406 Not Acceptable Error on Product Updates
-- Run this script in your Supabase SQL Editor

-- First, let's check current policies
SELECT
    schemaname,
    tablename,
    policyname,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'products';

-- Drop the existing problematic policy that causes circular dependency
DROP POLICY IF EXISTS "Only admins can modify products" ON products;

-- Create new policy that avoids circular dependency issues
-- This uses a simpler EXISTS query that should work without circular dependencies
CREATE POLICY "Only admins can modify products" ON products
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE user_id = auth.uid()
            AND role IN ('admin', 'super_admin')
        )
    );

-- Verify the fix worked
SELECT
    schemaname,
    tablename,
    policyname,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'products';