-- Fix database schema to match scraper requirements
-- Run this in your Supabase SQL Editor

-- First, check current table structure
SELECT '=== CURRENT TABLE STRUCTURE ===' as info;
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'cards' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Add missing fields that the scraper needs
DO $$
BEGIN
    -- Add latest_price field
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'cards' AND column_name = 'latest_price'
    ) THEN
        ALTER TABLE cards ADD COLUMN latest_price DECIMAL(10,2);
        RAISE NOTICE 'Added latest_price field';
    END IF;
    
    -- Add category field
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'cards' AND column_name = 'category'
    ) THEN
        ALTER TABLE cards ADD COLUMN category VARCHAR(50);
        RAISE NOTICE 'Added category field';
    END IF;
    
    -- Add card_type field
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'cards' AND column_name = 'card_type'
    ) THEN
        ALTER TABLE cards ADD COLUMN card_type VARCHAR(100);
        RAISE NOTICE 'Added card_type field';
    END IF;
    
    -- Add set_name field
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'cards' AND column_name = 'set_name'
    ) THEN
        ALTER TABLE cards ADD COLUMN set_name VARCHAR(255);
        RAISE NOTICE 'Added set_name field';
    END IF;
    
    -- Add year field
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'cards' AND column_name = 'year'
    ) THEN
        ALTER TABLE cards ADD COLUMN year INTEGER;
        RAISE NOTICE 'Added year field';
    END IF;
    
    -- Add grading field
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'cards' AND column_name = 'grading'
    ) THEN
        ALTER TABLE cards ADD COLUMN grading VARCHAR(50);
        RAISE NOTICE 'Added grading field';
    END IF;
    
    -- Add rarity field
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'cards' AND column_name = 'rarity'
    ) THEN
        ALTER TABLE cards ADD COLUMN rarity VARCHAR(100);
        RAISE NOTICE 'Added rarity field';
    END IF;
    
    -- Add serial_number field
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'cards' AND column_name = 'serial_number'
    ) THEN
        ALTER TABLE cards ADD COLUMN serial_number VARCHAR(100);
        RAISE NOTICE 'Added serial_number field';
    END IF;
    
    -- Add image_url field
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'cards' AND column_name = 'image_url'
    ) THEN
        ALTER TABLE cards ADD COLUMN image_url TEXT;
        RAISE NOTICE 'Added image_url field';
    END IF;
    
    -- Add price_entries_count field
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'cards' AND column_name = 'price_entries_count'
    ) THEN
        ALTER TABLE cards ADD COLUMN price_entries_count INTEGER DEFAULT 0;
        RAISE NOTICE 'Added price_entries_count field';
    END IF;
    
    -- Add last_updated field
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'cards' AND column_name = 'last_updated'
    ) THEN
        ALTER TABLE cards ADD COLUMN last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW();
        RAISE NOTICE 'Added last_updated field';
    END IF;
    
END $$;

-- Verify all fields were added
SELECT '=== UPDATED TABLE STRUCTURE ===' as info;
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'cards' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Show sample data to verify
SELECT '=== SAMPLE DATA ===' as info;
SELECT id, name, latest_price, category, image_url, created_at 
FROM cards 
LIMIT 3; 