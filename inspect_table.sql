-- Inspect the actual structure of the cards table
-- Run this in your Supabase SQL Editor to see what columns exist

-- Show table structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'cards' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Show a few sample rows to understand the data
SELECT * FROM cards LIMIT 3;

-- Check if cards_with_prices view exists
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_name IN ('cards', 'cards_with_prices')
AND table_schema = 'public'; 