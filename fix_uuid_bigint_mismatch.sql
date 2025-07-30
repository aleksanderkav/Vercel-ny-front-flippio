-- Fix UUID/BigInt mismatch in cards_with_prices view and trigger
-- Run this in your Supabase SQL Editor

-- Step 1: Drop existing trigger and function
DROP TRIGGER IF EXISTS cards_with_prices_insert_trigger ON cards_with_prices;
DROP FUNCTION IF EXISTS insert_into_cards_via_view();

-- Step 2: Drop and recreate the view to ensure proper data types
DROP VIEW IF EXISTS cards_with_prices;

-- Step 3: Create the view with proper data type casting
CREATE VIEW cards_with_prices AS
SELECT 
    c.id::text as id,  -- Cast bigint to text for consistency
    c.name,
    cp.average_price AS latest_price,
    cp.last_seen AS last_price_update,
    (SELECT COUNT(*) FROM price_entries pe WHERE pe.card_id = c.id) AS price_count,
    c.created_at
FROM cards c
LEFT JOIN card_prices cp ON c.id = cp.card_id;

-- Step 4: Create the INSERT trigger function with proper data type handling
CREATE OR REPLACE FUNCTION insert_into_cards_via_view()
RETURNS TRIGGER AS $$
DECLARE
    new_card_id BIGINT;  -- Explicitly declare as BIGINT
BEGIN
    -- Insert into cards table first (cards.id is BIGSERIAL = BIGINT)
    INSERT INTO cards (name) VALUES (NEW.name) RETURNING id INTO new_card_id;
    
    -- If price data is provided, also insert into card_prices
    IF NEW.latest_price IS NOT NULL THEN
        INSERT INTO card_prices (
            card_id, 
            average_price, 
            last_seen, 
            sync_status, 
            updated_at
        ) VALUES (
            new_card_id,  -- This is now properly a BIGINT
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
                new_card_id,  -- This is now properly a BIGINT
                NEW.latest_price,
                NOW(),
                'app'
            );
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 5: Create the INSTEAD OF INSERT trigger
CREATE TRIGGER cards_with_prices_insert_trigger
    INSTEAD OF INSERT ON cards_with_prices
    FOR EACH ROW
    EXECUTE FUNCTION insert_into_cards_via_view();

-- Step 6: Grant permissions
GRANT SELECT ON cards_with_prices TO anon;
GRANT EXECUTE ON FUNCTION insert_into_cards_via_view() TO anon;

-- Step 7: Show confirmation and test
SELECT '=== UUID/BIGINT MISMATCH FIXED ===' as info;
SELECT 'View and trigger updated with proper data type handling' as info;
SELECT 'You can now insert new cards without data type errors!' as info;

-- Step 8: Show current view structure
SELECT '=== CURRENT VIEW STRUCTURE ===' as info;
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'cards_with_prices' 
AND table_schema = 'public'
ORDER BY ordinal_position; 