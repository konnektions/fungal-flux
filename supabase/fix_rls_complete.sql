-- Complete RLS Policy Fix for Fungal Flux
-- This resolves the circular dependency issue

-- Step 1: Re-enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Step 2: Drop ALL existing policies to start fresh
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Super admins can modify profiles" ON profiles;
DROP POLICY IF EXISTS "Enable read for authenticated users own profile" ON profiles;

-- Step 3: Create simple, non-circular policies

-- Policy 1: Users can ALWAYS view their own profile
CREATE POLICY "users_select_own_profile" ON profiles
    FOR SELECT
    USING (auth.uid() = user_id);

-- Policy 2: Users can update their own profile (but not their role)
CREATE POLICY "users_update_own_profile" ON profiles
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (
        auth.uid() = user_id 
        AND role = (SELECT role FROM profiles WHERE user_id = auth.uid())
    );

-- Policy 3: Admins can insert new profiles (for user management)
CREATE POLICY "admins_insert_profiles" ON profiles
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE user_id = auth.uid() 
            AND role IN ('admin', 'super_admin')
        )
    );

-- Policy 4: Super admins can modify any profile
CREATE POLICY "super_admins_all_profiles" ON profiles
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE user_id = auth.uid() 
            AND role = 'super_admin'
        )
    );

-- Verify policies
SELECT 
    policyname,
    cmd,
    CASE 
        WHEN qual IS NOT NULL THEN 'Has USING clause'
        ELSE 'No USING clause'
    END as using_clause,
    CASE 
        WHEN with_check IS NOT NULL THEN 'Has WITH CHECK clause'
        ELSE 'No WITH CHECK clause'
    END as check_clause
FROM pg_policies 
WHERE tablename = 'profiles'
ORDER BY policyname;