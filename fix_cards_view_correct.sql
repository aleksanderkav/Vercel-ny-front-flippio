-- Fix the cards_with_prices view based on actual database structure
-- Run this in your Supabase SQL Editor

-- Step 1: Drop any existing incorrect view
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

-- Step 3: Grant permissions to the view
GRANT SELECT ON cards_with_prices TO anon;

-- Step 4: Test the view
SELECT '=== VIEW CREATED SUCCESSFULLY ===' as info;
SELECT 'Sample data from cards_with_prices:' as info;
SELECT * FROM cards_with_prices LIMIT 5;

-- Step 5: Show statistics
SELECT '=== VIEW STATISTICS ===' as info;
SELECT 
    COUNT(*) as total_cards,
    COUNT(latest_price) as cards_with_prices,
    AVG(latest_price) as average_price,
    MIN(latest_price) as min_price,
    MAX(latest_price) as max_price
FROM cards_with_prices; 