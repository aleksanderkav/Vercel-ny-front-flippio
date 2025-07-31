-- Simple RLS Fix for cards table
-- Run this in your Supabase SQL Editor

-- Check current policies
SELECT '=== CURRENT POLICIES ===' as info;
SELECT 
    tablename,
    policyname,
    cmd,
    permissive
FROM pg_policies 
WHERE tablename = 'cards'
AND schemaname = 'public';

-- Drop existing policies
DROP POLICY IF EXISTS "Allow anonymous read access" ON cards;
DROP POLICY IF EXISTS "Allow anonymous insert access" ON cards;
DROP POLICY IF EXISTS "Allow anonymous update access" ON cards;
DROP POLICY IF EXISTS "Allow anonymous delete access" ON cards;

-- Create new policies
CREATE POLICY "Allow anonymous read access" ON cards
    FOR SELECT USING (true);

CREATE POLICY "Allow anonymous insert access" ON cards
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anonymous update access" ON cards
    FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Allow anonymous delete access" ON cards
    FOR DELETE USING (true);

-- Grant permissions (safe)
GRANT SELECT, INSERT, UPDATE, DELETE ON cards TO anon;

-- Test the policies
SELECT '=== UPDATED POLICIES ===' as info;
SELECT 
    tablename,
    policyname,
    cmd,
    permissive
FROM pg_policies 
WHERE tablename = 'cards'
AND schemaname = 'public';

-- Test update
SELECT '=== TESTING UPDATE ===' as info;
UPDATE cards 
SET image_url = 'https://test.example.com/image.jpg'
WHERE name = 'Charizard VMAX PSA 10'
RETURNING id, name, image_url;

SELECT '✅ RLS policies fixed!' as status; 