-- Add Missing Columns to cards Table
-- Run this in your Supabase SQL Editor

-- Add new fields to cards table
ALTER TABLE cards ADD COLUMN IF NOT EXISTS latest_price DECIMAL(10,2);
ALTER TABLE cards ADD COLUMN IF NOT EXISTS price_entries_count INTEGER DEFAULT 0;
ALTER TABLE cards ADD COLUMN IF NOT EXISTS category VARCHAR(50);
ALTER TABLE cards ADD COLUMN IF NOT EXISTS card_type VARCHAR(100);
ALTER TABLE cards ADD COLUMN IF NOT EXISTS set_name VARCHAR(255);
ALTER TABLE cards ADD COLUMN IF NOT EXISTS year INTEGER;
ALTER TABLE cards ADD COLUMN IF NOT EXISTS grading VARCHAR(50);
ALTER TABLE cards ADD COLUMN IF NOT EXISTS rarity VARCHAR(50);
ALTER TABLE cards ADD COLUMN IF NOT EXISTS serial_number VARCHAR(100);

-- Show the updated table structure
SELECT '=== UPDATED CARDS TABLE STRUCTURE ===' as info;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'cards'
ORDER BY ordinal_position;

SELECT 'Missing columns added to cards table successfully!' as status; 