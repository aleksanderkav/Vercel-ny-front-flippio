-- Fix RLS Policies and Permissions for cards_with_prices view
-- Run this in your Supabase SQL Editor

-- Step 1: Check current RLS status and policies
SELECT '=== CURRENT RLS STATUS ===' as info;

-- Check if RLS is enabled on tables
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename IN ('cards', 'card_prices', 'price_entries')
AND schemaname = 'public';

-- Check existing policies
SELECT '=== EXISTING POLICIES ===' as info;
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
WHERE tablename IN ('cards', 'card_prices', 'price_entries')
AND schemaname = 'public';

-- Step 2: Enable RLS on all tables if not already enabled
SELECT '=== ENABLING RLS ===' as info;
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE card_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_entries ENABLE ROW LEVEL SECURITY;

-- Step 3: Drop existing policies to start fresh
SELECT '=== DROPPING EXISTING POLICIES ===' as info;
DROP POLICY IF EXISTS "Allow anonymous read access" ON cards;
DROP POLICY IF EXISTS "Allow anonymous insert access" ON cards;
DROP POLICY IF EXISTS "Allow anonymous read access" ON card_prices;
DROP POLICY IF EXISTS "Allow anonymous insert access" ON card_prices;
DROP POLICY IF EXISTS "Allow anonymous read access" ON price_entries;
DROP POLICY IF EXISTS "Allow anonymous insert access" ON price_entries;

-- Step 4: Create comprehensive policies for cards table
SELECT '=== CREATING CARDS POLICIES ===' as info;
CREATE POLICY "Allow anonymous read access" ON cards
    FOR SELECT USING (true);

CREATE POLICY "Allow anonymous insert access" ON cards
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anonymous update access" ON cards
    FOR UPDATE USING (true) WITH CHECK (true);

-- Step 5: Create comprehensive policies for card_prices table
SELECT '=== CREATING CARD_PRICES POLICIES ===' as info;
CREATE POLICY "Allow anonymous read access" ON card_prices
    FOR SELECT USING (true);

CREATE POLICY "Allow anonymous insert access" ON card_prices
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anonymous update access" ON card_prices
    FOR UPDATE USING (true) WITH CHECK (true);

-- Step 6: Create comprehensive policies for price_entries table
SELECT '=== CREATING PRICE_ENTRIES POLICIES ===' as info;
CREATE POLICY "Allow anonymous read access" ON price_entries
    FOR SELECT USING (true);

CREATE POLICY "Allow anonymous insert access" ON price_entries
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anonymous update access" ON price_entries
    FOR UPDATE USING (true) WITH CHECK (true);

-- Step 7: Grant all necessary permissions to anon role
SELECT '=== GRANTING PERMISSIONS ===' as info;
GRANT SELECT, INSERT, UPDATE ON cards TO anon;
GRANT SELECT, INSERT, UPDATE ON card_prices TO anon;
GRANT SELECT, INSERT, UPDATE ON price_entries TO anon;
GRANT SELECT ON cards_with_prices TO anon;
GRANT EXECUTE ON FUNCTION insert_into_cards_via_view() TO anon;

-- Step 8: Grant usage on sequences if they exist
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon;

-- Step 9: Test the trigger function directly
SELECT '=== TESTING TRIGGER FUNCTION ===' as info;
-- Test if the function can be called (this won't actually insert, just test syntax)
SELECT insert_into_cards_via_view() IS NOT NULL as function_test;

-- Step 10: Show final confirmation
SELECT '=== RLS AND PERMISSIONS FIXED ===' as info;
SELECT 'All tables have comprehensive RLS policies' as info;
SELECT 'Anonymous users can now read, insert, and update' as info;
SELECT 'Try inserting a new card now!' as info;

-- Step 11: Show current policies
SELECT '=== FINAL POLICY STATUS ===' as info;
SELECT 
    schemaname,
    tablename,
    policyname,
    cmd,
    permissive
FROM pg_policies 
WHERE tablename IN ('cards', 'card_prices', 'price_entries')
AND schemaname = 'public'
ORDER BY tablename, cmd; 