-- Fix RLS Policies for cards table
-- Run this in your Supabase SQL Editor

-- First, check current policies
SELECT '=== CURRENT POLICIES ===' as info;
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
WHERE tablename = 'cards'
AND schemaname = 'public';

-- Drop existing policies that might be blocking updates
DROP POLICY IF EXISTS "Allow anonymous read access" ON cards;
DROP POLICY IF EXISTS "Allow anonymous insert access" ON cards;
DROP POLICY IF EXISTS "Allow anonymous update access" ON cards;
DROP POLICY IF EXISTS "Allow anonymous delete access" ON cards;

-- Create comprehensive policies for cards table
CREATE POLICY "Allow anonymous read access" ON cards
    FOR SELECT USING (true);

CREATE POLICY "Allow anonymous insert access" ON cards
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anonymous update access" ON cards
    FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Allow anonymous delete access" ON cards
    FOR DELETE USING (true);

-- Grant all necessary permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON cards TO anon;
GRANT USAGE ON SEQUENCE cards_id_seq TO anon;

-- Test the policies
SELECT '=== UPDATED POLICIES ===' as info;
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
WHERE tablename = 'cards'
AND schemaname = 'public';

-- Test if we can update a card
SELECT '=== TESTING UPDATE ===' as info;
UPDATE cards 
SET image_url = 'https://test.example.com/image.jpg'
WHERE name = 'Charizard VMAX PSA 10'
RETURNING id, name, image_url;

SELECT '✅ RLS policies fixed!' as status; 