-- Add Missing Columns to price_entries Table
-- Run this in your Supabase SQL Editor

-- Add source column if it doesn't exist
ALTER TABLE price_entries ADD COLUMN IF NOT EXISTS source VARCHAR(100) NOT NULL DEFAULT 'eBay';

-- Add timestamp column if it doesn't exist  
ALTER TABLE price_entries ADD COLUMN IF NOT EXISTS timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Add created_at column if it doesn't exist
ALTER TABLE price_entries ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Show the updated table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'price_entries'
ORDER BY ordinal_position;

SELECT 'Missing columns added successfully!' as status; 