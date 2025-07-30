-- Fix the latest_price issue
-- Update existing cards with their latest price from price_entries

-- First, let's update the latest_price for all cards based on their most recent price entry
UPDATE cards 
SET latest_price = (
    SELECT price 
    FROM price_entries 
    WHERE card_id = cards.id 
    ORDER BY timestamp DESC 
    LIMIT 1
)
WHERE latest_price IS NULL OR latest_price = 0;

-- Update price_entries_count for all cards
UPDATE cards 
SET price_entries_count = (
    SELECT COUNT(*) 
    FROM price_entries 
    WHERE card_id = cards.id
);

-- Update last_updated for all cards
UPDATE cards 
SET last_updated = (
    SELECT MAX(timestamp) 
    FROM price_entries 
    WHERE card_id = cards.id
)
WHERE last_updated IS NULL;

-- Check the results
SELECT 
    name, 
    latest_price, 
    price_entries_count, 
    last_updated,
    category
FROM cards 
ORDER BY last_updated DESC 
LIMIT 10;

-- Test the view
SELECT 
    name, 
    latest_price, 
    category,
    price_entries_count
FROM cards_with_prices 
ORDER BY last_updated DESC 
LIMIT 10; 