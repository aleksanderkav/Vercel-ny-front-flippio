-- Comprehensive diagnostic and fix for UUID/BigInt mismatch
-- Run this in your Supabase SQL Editor

-- Step 1: Diagnose the actual table structures
SELECT '=== DIAGNOSING TABLE STRUCTURES ===' as info;

-- Check cards table structure
SELECT 'Cards table structure:' as info;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'cards' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check card_prices table structure
SELECT 'Card_prices table structure:' as info;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'card_prices' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check price_entries table structure
SELECT 'Price_entries table structure:' as info;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'price_entries' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Step 2: Show sample data to understand actual data types
SELECT '=== SAMPLE DATA ANALYSIS ===' as info;
SELECT 'Sample cards data:' as info;
SELECT id, name, created_at FROM cards LIMIT 3;

SELECT 'Sample card_prices data:' as info;
SELECT card_id, average_price, last_seen FROM card_prices LIMIT 3;

-- Step 3: Check foreign key relationships
SELECT '=== FOREIGN KEY RELATIONSHIPS ===' as info;
SELECT 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name,
    ccu.data_type AS foreign_data_type
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
AND tc.table_name IN ('card_prices', 'price_entries');

-- Step 4: Drop all existing triggers and functions to start fresh
SELECT '=== CLEANING UP EXISTING TRIGGERS ===' as info;
DROP TRIGGER IF EXISTS cards_with_prices_insert_trigger ON cards_with_prices;
DROP FUNCTION IF EXISTS insert_into_cards_via_view();
DROP VIEW IF EXISTS cards_with_prices;

-- Step 5: Create the view based on actual data types
-- We'll use a dynamic approach that works with both UUID and BIGINT
CREATE VIEW cards_with_prices AS
SELECT 
    c.id::text as id,  -- Cast to text regardless of underlying type
    c.name,
    cp.average_price AS latest_price,
    cp.last_seen AS last_price_update,
    (SELECT COUNT(*) FROM price_entries pe WHERE pe.card_id = c.id) AS price_count,
    c.created_at
FROM cards c
LEFT JOIN card_prices cp ON c.id = cp.card_id;

-- Step 6: Create a flexible INSERT trigger function
CREATE OR REPLACE FUNCTION insert_into_cards_via_view()
RETURNS TRIGGER AS $$
DECLARE
    new_card_id TEXT;  -- Use TEXT to handle both UUID and BIGINT
    actual_card_id TEXT;  -- Store the actual inserted ID
BEGIN
    -- Insert into cards table first
    INSERT INTO cards (name) VALUES (NEW.name) RETURNING id::text INTO actual_card_id;
    
    -- If price data is provided, also insert into card_prices
    IF NEW.latest_price IS NOT NULL THEN
        INSERT INTO card_prices (
            card_id, 
            average_price, 
            last_seen, 
            sync_status, 
            updated_at
        ) VALUES (
            actual_card_id,  -- Use the actual inserted ID
            NEW.latest_price, 
            COALESCE(NEW.last_price_update, NOW()), 
            'pending', 
            NOW()
        );
        
        -- If price_count is provided, create price_entries
        IF NEW.price_count IS NOT NULL AND NEW.price_count > 0 THEN
            INSERT INTO price_entries (
                card_id,
                price,
                timestamp,
                source
            ) VALUES (
                actual_card_id,  -- Use the actual inserted ID
                NEW.latest_price,
                NOW(),
                'app'
            );
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 7: Create the INSTEAD OF INSERT trigger
CREATE TRIGGER cards_with_prices_insert_trigger
    INSTEAD OF INSERT ON cards_with_prices
    FOR EACH ROW
    EXECUTE FUNCTION insert_into_cards_via_view();

-- Step 8: Grant permissions
GRANT SELECT ON cards_with_prices TO anon;
GRANT EXECUTE ON FUNCTION insert_into_cards_via_view() TO anon;

-- Step 9: Show final confirmation
SELECT '=== FIX APPLIED SUCCESSFULLY ===' as info;
SELECT 'View and trigger updated with flexible data type handling' as info;
SELECT 'Should work with both UUID and BIGINT card IDs' as info;

-- Step 10: Show final view structure
SELECT '=== FINAL VIEW STRUCTURE ===' as info;
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'cards_with_prices' 
AND table_schema = 'public'
ORDER BY ordinal_position; 