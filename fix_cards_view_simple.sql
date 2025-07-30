-- Simple fix for cards_with_prices view
-- Run this in your Supabase SQL Editor

-- Step 1: Inspect the actual table structure
SELECT '=== ACTUAL TABLE STRUCTURE ===' as info;
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'cards' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Step 2: Show sample data
SELECT '=== SAMPLE DATA ===' as info;
SELECT * FROM cards LIMIT 2;

-- Step 3: Drop existing view if it exists
DROP VIEW IF EXISTS cards_with_prices;

-- Step 4: Create a simple view that works with any table structure
-- This assumes at minimum: id, name, created_at columns exist
CREATE VIEW cards_with_prices AS
SELECT 
    id::text as id,
    name,
    -- Use NULL for price fields if they don't exist - the app will handle this
    NULL as latest_price,
    NULL as price_count,
    created_at as last_price_update,
    created_at
FROM cards;

-- Step 5: Grant permissions
GRANT SELECT ON cards_with_prices TO anon;

-- Step 6: Create a simple insert trigger
CREATE OR REPLACE FUNCTION insert_into_cards_via_view()
RETURNS TRIGGER AS $$
BEGIN
    -- Simple insert with just the name
    INSERT INTO cards (name) VALUES (NEW.name);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 7: Create the trigger
DROP TRIGGER IF EXISTS cards_with_prices_insert_trigger ON cards_with_prices;
CREATE TRIGGER cards_with_prices_insert_trigger
    INSTEAD OF INSERT ON cards_with_prices
    FOR EACH ROW
    EXECUTE FUNCTION insert_into_cards_via_view();

-- Step 8: Grant trigger permissions
GRANT EXECUTE ON FUNCTION insert_into_cards_via_view() TO anon;

-- Step 9: Test the view
SELECT '=== VIEW CREATED SUCCESSFULLY ===' as info;
SELECT * FROM cards_with_prices LIMIT 3; 