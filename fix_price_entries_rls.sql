-- Fix missing RLS INSERT policy for price_entries table
-- Run this in your Supabase SQL Editor

-- Check current RLS status and policies for price_entries
SELECT '=== CURRENT PRICE_ENTRIES RLS STATUS ===' as info;
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename = 'price_entries'
AND schemaname = 'public';

SELECT '=== CURRENT PRICE_ENTRIES POLICIES ===' as info;
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
WHERE tablename = 'price_entries'
AND schemaname = 'public';

-- Enable RLS on price_entries if not already enabled
SELECT '=== ENABLING RLS ON PRICE_ENTRIES ===' as info;
ALTER TABLE price_entries ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to start fresh
SELECT '=== DROPPING EXISTING PRICE_ENTRIES POLICIES ===' as info;
DROP POLICY IF EXISTS "Allow anonymous read access" ON price_entries;
DROP POLICY IF EXISTS "Allow anonymous insert access" ON price_entries;
DROP POLICY IF EXISTS "Allow anon insert via trigger" ON price_entries;

-- Create comprehensive policies for price_entries table
SELECT '=== CREATING PRICE_ENTRIES POLICIES ===' as info;
CREATE POLICY "Allow anonymous read access" ON price_entries
    FOR SELECT USING (true);

CREATE POLICY "Allow anon insert via trigger" ON price_entries
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anonymous update access" ON price_entries
    FOR UPDATE USING (true) WITH CHECK (true);

-- Grant permissions to anon role
SELECT '=== GRANTING PRICE_ENTRIES PERMISSIONS ===' as info;
GRANT SELECT, INSERT, UPDATE ON price_entries TO anon;

-- Show final confirmation
SELECT '=== PRICE_ENTRIES RLS FIX APPLIED ===' as info;
SELECT 'Anonymous users can now insert into price_entries via trigger' as info;
SELECT 'Try searching for a card now!' as info;

-- Show final policy status
SELECT '=== FINAL PRICE_ENTRIES POLICY STATUS ===' as info;
SELECT 
    schemaname,
    tablename,
    policyname,
    cmd,
    permissive
FROM pg_policies 
WHERE tablename = 'price_entries'
AND schemaname = 'public'
ORDER BY cmd; 