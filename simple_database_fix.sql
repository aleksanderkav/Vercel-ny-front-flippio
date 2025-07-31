-- Simple Database Fix - Just add missing fields
-- Run this in your Supabase SQL Editor

-- Add missing fields to cards table (safe to run multiple times)
ALTER TABLE cards ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE cards ADD COLUMN IF NOT EXISTS latest_price DECIMAL(10,2);
ALTER TABLE cards ADD COLUMN IF NOT EXISTS category VARCHAR(50);
ALTER TABLE cards ADD COLUMN IF NOT EXISTS card_type VARCHAR(100);
ALTER TABLE cards ADD COLUMN IF NOT EXISTS set_name VARCHAR(255);
ALTER TABLE cards ADD COLUMN IF NOT EXISTS year INTEGER;
ALTER TABLE cards ADD COLUMN IF NOT EXISTS grading VARCHAR(50);
ALTER TABLE cards ADD COLUMN IF NOT EXISTS rarity VARCHAR(100);
ALTER TABLE cards ADD COLUMN IF NOT EXISTS serial_number VARCHAR(100);
ALTER TABLE cards ADD COLUMN IF NOT EXISTS price_entries_count INTEGER DEFAULT 0;
ALTER TABLE cards ADD COLUMN IF NOT EXISTS last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Create price_entries table if it doesn't exist
CREATE TABLE IF NOT EXISTS price_entries (
    id BIGSERIAL PRIMARY KEY,
    card_id UUID REFERENCES cards(id) ON DELETE CASCADE,
    price DECIMAL(10,2) NOT NULL,
    source VARCHAR(100) DEFAULT 'eBay',
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Show what we have now
SELECT '=== CARDS TABLE STRUCTURE ===' as info;
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'cards' 
AND table_schema = 'public'
ORDER BY ordinal_position;

SELECT '=== SAMPLE CARDS DATA ===' as info;
SELECT id, name, latest_price, category, image_url, created_at 
FROM cards 
LIMIT 3;

SELECT '✅ Simple database fix completed!' as status; 