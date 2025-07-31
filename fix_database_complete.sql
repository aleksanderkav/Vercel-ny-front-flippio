-- Complete Database Fix for Flippio
-- Run this in your Supabase SQL Editor to fix all database issues

-- ========================================
-- STEP 1: Fix cards table structure
-- ========================================

-- First, check current table structure
SELECT '=== CURRENT CARDS TABLE STRUCTURE ===' as info;
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

-- ========================================
-- STEP 2: Create price_entries table
-- ========================================

-- Create price_entries table if it doesn't exist
CREATE TABLE IF NOT EXISTS price_entries (
    id BIGSERIAL PRIMARY KEY,
    card_id UUID REFERENCES cards(id) ON DELETE CASCADE,
    price DECIMAL(10,2) NOT NULL,
    source VARCHAR(100) DEFAULT 'eBay',
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance (only if they don't exist)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_price_entries_card_id') THEN
        CREATE INDEX idx_price_entries_card_id ON price_entries(card_id);
        RAISE NOTICE 'Created index idx_price_entries_card_id';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_price_entries_timestamp') THEN
        CREATE INDEX idx_price_entries_timestamp ON price_entries(timestamp);
        RAISE NOTICE 'Created index idx_price_entries_timestamp';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_price_entries_source') THEN
        CREATE INDEX idx_price_entries_source ON price_entries(source);
        RAISE NOTICE 'Created index idx_price_entries_source';
    END IF;
END $$;

-- Enable Row Level Security (RLS)
ALTER TABLE price_entries ENABLE ROW LEVEL SECURITY;

-- Create policies only if they don't exist
DO $$
BEGIN
    -- Check if read policy exists
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'price_entries' 
        AND policyname = 'Allow anonymous read access'
    ) THEN
        CREATE POLICY "Allow anonymous read access" ON price_entries
            FOR SELECT USING (true);
        RAISE NOTICE 'Created read policy for price_entries';
    END IF;
    
    -- Check if insert policy exists
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'price_entries' 
        AND policyname = 'Allow anonymous insert access'
    ) THEN
        CREATE POLICY "Allow anonymous insert access" ON price_entries
            FOR INSERT WITH CHECK (true);
        RAISE NOTICE 'Created insert policy for price_entries';
    END IF;
END $$;

-- Grant permissions (safe to run multiple times)
GRANT SELECT, INSERT ON price_entries TO anon;

-- Grant sequence usage if sequence exists
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.sequences WHERE sequence_name = 'price_entries_id_seq') THEN
        GRANT USAGE ON SEQUENCE price_entries_id_seq TO anon;
        RAISE NOTICE 'Granted sequence usage to anon';
    END IF;
END $$;

-- ========================================
-- STEP 3: Verify everything is working
-- ========================================

-- Show updated cards table structure
SELECT '=== UPDATED CARDS TABLE STRUCTURE ===' as info;
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'cards' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Show price_entries table structure
SELECT '=== PRICE_ENTRIES TABLE STRUCTURE ===' as info;
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'price_entries' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Show sample data
SELECT '=== SAMPLE CARDS DATA ===' as info;
SELECT id, name, latest_price, category, image_url, created_at 
FROM cards 
LIMIT 3;

SELECT '=== SAMPLE PRICE_ENTRIES DATA ===' as info;
SELECT * FROM price_entries LIMIT 3;

-- ========================================
-- STEP 4: Update version in database
-- ========================================

-- Create a version tracking table if it doesn't exist
CREATE TABLE IF NOT EXISTS app_version (
    id SERIAL PRIMARY KEY,
    version VARCHAR(20) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert or update version
INSERT INTO app_version (version) VALUES ('1.3.6')
ON CONFLICT (id) DO UPDATE SET 
    version = EXCLUDED.version,
    updated_at = NOW();

SELECT '=== DATABASE VERSION ===' as info;
SELECT version, updated_at FROM app_version ORDER BY id DESC LIMIT 1;

SELECT '✅ Database fix completed successfully!' as status; 