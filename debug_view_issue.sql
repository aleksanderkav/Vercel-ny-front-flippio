-- Debug the cards_with_prices view issue
-- Let's see what's actually in the database

-- Check if the view exists
SELECT schemaname, viewname FROM pg_views WHERE viewname = 'cards_with_prices';

-- Check what columns exist in the cards table
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'cards' 
ORDER BY ordinal_position;

-- Check what columns exist in the cards_with_prices view
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'cards_with_prices' 
ORDER BY ordinal_position;

-- Check if there are any cards with latest_price
SELECT COUNT(*) as total_cards FROM cards;
SELECT COUNT(*) as cards_with_latest_price FROM cards WHERE latest_price IS NOT NULL;
SELECT COUNT(*) as cards_with_latest_price_gt_0 FROM cards WHERE latest_price IS NOT NULL AND latest_price > 0;

-- Show some sample cards with their latest_price
SELECT name, latest_price, category, created_at 
FROM cards 
ORDER BY created_at DESC 
LIMIT 10;

-- Try to query the view directly
SELECT name, latest_price, category 
FROM cards_with_prices 
ORDER BY created_at DESC 
LIMIT 5; 