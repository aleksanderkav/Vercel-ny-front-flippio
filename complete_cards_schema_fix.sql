-- Complete Cards Table Schema Fix
-- Run this in your Supabase SQL Editor to add ALL missing columns

-- Add all missing columns to cards table
ALTER TABLE cards ADD COLUMN IF NOT EXISTS latest_price DECIMAL(10,2);
ALTER TABLE cards ADD COLUMN IF NOT EXISTS price_entries_count INTEGER DEFAULT 0;
ALTER TABLE cards ADD COLUMN IF NOT EXISTS category VARCHAR(50);
ALTER TABLE cards ADD COLUMN IF NOT EXISTS card_type VARCHAR(100);
ALTER TABLE cards ADD COLUMN IF NOT EXISTS set_name VARCHAR(255);
ALTER TABLE cards ADD COLUMN IF NOT EXISTS year INTEGER;
ALTER TABLE cards ADD COLUMN IF NOT EXISTS grading VARCHAR(50);
ALTER TABLE cards ADD COLUMN IF NOT EXISTS rarity VARCHAR(50);
ALTER TABLE cards ADD COLUMN IF NOT EXISTS serial_number VARCHAR(100);
ALTER TABLE cards ADD COLUMN IF NOT EXISTS last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE cards ADD COLUMN IF NOT EXISTS condition VARCHAR(50);
ALTER TABLE cards ADD COLUMN IF NOT EXISTS card_set VARCHAR(255);
ALTER TABLE cards ADD COLUMN IF NOT EXISTS current_price DECIMAL(10,2);
ALTER TABLE cards ADD COLUMN IF NOT EXISTS average_price DECIMAL(10,2);
ALTER TABLE cards ADD COLUMN IF NOT EXISTS lowest_price DECIMAL(10,2);
ALTER TABLE cards ADD COLUMN IF NOT EXISTS highest_price DECIMAL(10,2);
ALTER TABLE cards ADD COLUMN IF NOT EXISTS market_distribution JSONB;
ALTER TABLE cards ADD COLUMN IF NOT EXISTS total_listings INTEGER DEFAULT 0;
ALTER TABLE cards ADD COLUMN IF NOT EXISTS emoji VARCHAR(10);
ALTER TABLE cards ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE cards ADD COLUMN IF NOT EXISTS market VARCHAR(100);

-- Show the complete table structure
SELECT '=== COMPLETE CARDS TABLE STRUCTURE ===' as info;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'cards'
ORDER BY ordinal_position;

SELECT 'All missing columns added successfully!' as status; 