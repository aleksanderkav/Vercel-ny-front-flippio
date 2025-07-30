-- Fix the cards_with_prices view with INSERT capability
-- Run this in your Supabase SQL Editor

-- Step 1: Drop any existing incorrect view and triggers
DROP TRIGGER IF EXISTS cards_with_prices_insert_trigger ON cards_with_prices;
DROP FUNCTION IF EXISTS insert_into_cards_via_view();
DROP VIEW IF EXISTS cards_with_prices;

-- Step 2: Create the correct view based on actual schema
CREATE VIEW cards_with_prices AS
SELECT 
    c.id::text as id,
    c.name,
    cp.average_price AS latest_price,
    cp.last_seen AS last_price_update,
    (SELECT COUNT(*) FROM price_entries pe WHERE pe.card_id = c.id) AS price_count,
    c.created_at
FROM cards c
LEFT JOIN card_prices cp ON c.id = cp.card_id;

-- Step 3: Create INSERT trigger function
CREATE OR REPLACE FUNCTION insert_into_cards_via_view()
RETURNS TRIGGER AS $$
DECLARE
    new_card_id BIGINT;
BEGIN
    -- Insert into cards table
    INSERT INTO cards (name) VALUES (NEW.name) RETURNING id INTO new_card_id;
    
    -- If price data is provided, also insert into card_prices
    IF NEW.latest_price IS NOT NULL THEN
        INSERT INTO card_prices (card_id, average_price, last_seen, sync_status, updated_at)
        VALUES (new_card_id, NEW.latest_price, COALESCE(NEW.last_price_update, NOW()), 'manual', NOW());
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 4: Create the INSERT trigger
CREATE TRIGGER cards_with_prices_insert_trigger
    INSTEAD OF INSERT ON cards_with_prices
    FOR EACH ROW
    EXECUTE FUNCTION insert_into_cards_via_view();

-- Step 5: Grant permissions
GRANT SELECT ON cards_with_prices TO anon;
GRANT EXECUTE ON FUNCTION insert_into_cards_via_view() TO anon;

-- Step 6: Test the view
SELECT '=== VIEW CREATED SUCCESSFULLY ===' as info;
SELECT 'Sample data from cards_with_prices:' as info;
SELECT * FROM cards_with_prices LIMIT 5;

-- Step 7: Show statistics
SELECT '=== VIEW STATISTICS ===' as info;
SELECT 
    COUNT(*) as total_cards,
    COUNT(latest_price) as cards_with_prices,
    AVG(latest_price) as average_price,
    MIN(latest_price) as min_price,
    MAX(latest_price) as max_price
FROM cards_with_prices;

-- Step 8: Test INSERT capability (optional - uncomment to test)
-- INSERT INTO cards_with_prices (name, latest_price) VALUES ('Test Card', 25.99);
-- SELECT 'Test card inserted successfully' as info; 