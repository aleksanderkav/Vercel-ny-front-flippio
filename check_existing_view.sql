-- Check what the existing cards_with_prices view looks like
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'cards_with_prices' 
ORDER BY ordinal_position;

-- Also check what columns exist in the cards table
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'cards' 
ORDER BY ordinal_position; 