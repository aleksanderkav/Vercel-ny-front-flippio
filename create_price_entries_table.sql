-- Create price_entries table for tracking price history
-- Run this in your Supabase SQL Editor

-- Check if price_entries table exists
SELECT 'Checking if price_entries table exists...' as info;
SELECT table_name 
FROM information_schema.tables 
WHERE table_name = 'price_entries' 
AND table_schema = 'public';

-- Create price_entries table if it doesn't exist
CREATE TABLE IF NOT EXISTS price_entries (
    id BIGSERIAL PRIMARY KEY,
    card_id UUID REFERENCES cards(id) ON DELETE CASCADE,
    price DECIMAL(10,2) NOT NULL,
    source VARCHAR(100) DEFAULT 'eBay',
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_price_entries_card_id ON price_entries(card_id);
CREATE INDEX IF NOT EXISTS idx_price_entries_timestamp ON price_entries(timestamp);
CREATE INDEX IF NOT EXISTS idx_price_entries_source ON price_entries(source);

-- Enable Row Level Security (RLS)
ALTER TABLE price_entries ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anonymous read access
CREATE POLICY "Allow anonymous read access" ON price_entries
    FOR SELECT USING (true);

-- Create policy to allow anonymous insert access
CREATE POLICY "Allow anonymous insert access" ON price_entries
    FOR INSERT WITH CHECK (true);

-- Grant permissions
GRANT SELECT, INSERT ON price_entries TO anon;
GRANT USAGE ON SEQUENCE price_entries_id_seq TO anon;

-- Verify table was created
SELECT '=== PRICE_ENTRIES TABLE STRUCTURE ===' as info;
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'price_entries' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Show sample data if any exists
SELECT '=== SAMPLE PRICE_ENTRIES DATA ===' as info;
SELECT * FROM price_entries LIMIT 3; 