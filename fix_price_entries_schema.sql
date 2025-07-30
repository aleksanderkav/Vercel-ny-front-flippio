-- Fix Price Entries Schema - Run this in your Supabase SQL Editor
-- This script handles existing tables and adds missing columns

-- First, let's check if price_entries table exists and what columns it has
SELECT '=== CHECKING CURRENT PRICE_ENTRIES SCHEMA ===' as info;

-- Check if price_entries table exists
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'price_entries'
) as table_exists;

-- If table exists, show current columns
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'price_entries'
ORDER BY ordinal_position;

-- Add missing columns to price_entries if table exists
SELECT '=== ADDING MISSING COLUMNS TO PRICE_ENTRIES ===' as info;

-- Add source column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'price_entries' 
        AND column_name = 'source'
    ) THEN
        ALTER TABLE price_entries ADD COLUMN source VARCHAR(100) NOT NULL DEFAULT 'eBay';
        RAISE NOTICE 'Added source column to price_entries';
    ELSE
        RAISE NOTICE 'source column already exists in price_entries';
    END IF;
END $$;

-- Add timestamp column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'price_entries' 
        AND column_name = 'timestamp'
    ) THEN
        ALTER TABLE price_entries ADD COLUMN timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW();
        RAISE NOTICE 'Added timestamp column to price_entries';
    ELSE
        RAISE NOTICE 'timestamp column already exists in price_entries';
    END IF;
END $$;

-- Add created_at column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'price_entries' 
        AND column_name = 'created_at'
    ) THEN
        ALTER TABLE price_entries ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
        RAISE NOTICE 'Added created_at column to price_entries';
    ELSE
        RAISE NOTICE 'created_at column already exists in price_entries';
    END IF;
END $$;

-- Create price_entries table if it doesn't exist
SELECT '=== CREATING PRICE_ENTRIES TABLE IF NOT EXISTS ===' as info;
CREATE TABLE IF NOT EXISTS price_entries (
    id BIGSERIAL PRIMARY KEY,
    card_id BIGINT REFERENCES cards(id) ON DELETE CASCADE,
    price DECIMAL(10,2) NOT NULL,
    source VARCHAR(100) NOT NULL DEFAULT 'eBay',
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for price_entries
SELECT '=== CREATING INDEXES ===' as info;
CREATE INDEX IF NOT EXISTS idx_price_entries_card_id ON price_entries(card_id);
CREATE INDEX IF NOT EXISTS idx_price_entries_timestamp ON price_entries(timestamp);
CREATE INDEX IF NOT EXISTS idx_price_entries_source ON price_entries(source);

-- Enable RLS on price_entries
SELECT '=== ENABLING RLS ===' as info;
ALTER TABLE price_entries ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to start fresh
SELECT '=== DROPPING EXISTING POLICIES ===' as info;
DROP POLICY IF EXISTS "Allow anonymous read access" ON price_entries;
DROP POLICY IF EXISTS "Allow anonymous insert access" ON price_entries;
DROP POLICY IF EXISTS "Allow anon insert via trigger" ON price_entries;

-- Create policies for price_entries
SELECT '=== CREATING POLICIES ===' as info;
CREATE POLICY "Allow anonymous read access" ON price_entries
    FOR SELECT USING (true);

CREATE POLICY "Allow anonymous insert access" ON price_entries
    FOR INSERT WITH CHECK (true);

-- Grant permissions
SELECT '=== GRANTING PERMISSIONS ===' as info;
GRANT SELECT, INSERT ON price_entries TO anon;

-- Create a function to update card statistics when price entries are added
SELECT '=== CREATING UPDATE FUNCTION ===' as info;
CREATE OR REPLACE FUNCTION update_card_price_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- Update the card's latest price and price count
    UPDATE cards 
    SET 
        latest_price = NEW.price,
        price_entries_count = (
            SELECT COUNT(*) 
            FROM price_entries 
            WHERE card_id = NEW.card_id
        ),
        last_updated = NOW()
    WHERE id = NEW.card_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update card stats
SELECT '=== CREATING TRIGGER ===' as info;
DROP TRIGGER IF EXISTS trigger_update_card_price_stats ON price_entries;
CREATE TRIGGER trigger_update_card_price_stats
    AFTER INSERT ON price_entries
    FOR EACH ROW
    EXECUTE FUNCTION update_card_price_stats();

-- Show final confirmation
SELECT '=== PRICE_ENTRIES SCHEMA FIXED ===' as info;
SELECT 'All columns and triggers are now properly set up!' as status;

-- Show final table structure
SELECT '=== FINAL PRICE_ENTRIES STRUCTURE ===' as info;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'price_entries'
ORDER BY ordinal_position; 