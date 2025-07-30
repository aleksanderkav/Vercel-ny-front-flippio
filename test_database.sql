-- Test script to check what's in the database
-- Run this to see the current state of your cards and view

-- Check what's in the cards table
SELECT 
    name, 
    latest_price, 
    category, 
    card_type,
    created_at,
    last_updated
FROM cards 
ORDER BY created_at DESC 
LIMIT 10;

-- Check what's in the cards_with_prices view
SELECT 
    name, 
    latest_price, 
    category, 
    price_entries_count,
    created_at
FROM cards_with_prices 
ORDER BY created_at DESC 
LIMIT 10;

-- Count total cards
SELECT COUNT(*) as total_cards FROM cards;

-- Count cards with prices
SELECT COUNT(*) as cards_with_prices FROM cards WHERE latest_price IS NOT NULL AND latest_price > 0;

-- Check categories distribution
SELECT category, COUNT(*) as count FROM cards GROUP BY category ORDER BY count DESC; 