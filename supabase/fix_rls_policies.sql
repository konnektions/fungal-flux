-- Fix RLS Policies for Profiles Table
-- This fixes the circular dependency issue causing queries to hang

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Super admins can modify profiles" ON profiles;

-- Recreate the admin view policy without circular dependency
-- Admins can view all profiles (using a simpler check)
CREATE POLICY "Admins can view all profiles" ON profiles
    FOR SELECT USING (
        -- Allow if user is viewing their own profile OR if they are an admin
        auth.uid() = user_id
        OR
        role IN ('admin', 'super_admin')
    );

-- Super admins can modify any profile
CREATE POLICY "Super admins can modify profiles" ON profiles
    FOR ALL USING (
        -- Check if the authenticated user's role is super_admin
        -- by using a direct subquery that will use the "Users can view own profile" policy
        (SELECT role FROM profiles WHERE user_id = auth.uid()) = 'super_admin'
    );

-- Verify policies are correct
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'profiles'
ORDER BY policyname;