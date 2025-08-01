-- Check what columns actually exist in the cards table
-- Run this in your Supabase SQL Editor

SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'cards'
ORDER BY ordinal_position; 