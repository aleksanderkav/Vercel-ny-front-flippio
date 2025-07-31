-- Add missing image_url field to cards table
-- Run this in your Supabase SQL Editor

-- First, check if the field already exists
SELECT 'Checking if image_url field exists...' as info;
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'cards' 
AND column_name = 'image_url'
AND table_schema = 'public';

-- Add the image_url field if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'cards' 
        AND column_name = 'image_url'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE cards ADD COLUMN image_url TEXT;
        RAISE NOTICE 'Added image_url field to cards table';
    ELSE
        RAISE NOTICE 'image_url field already exists';
    END IF;
END $$;

-- Verify the field was added
SELECT 'Verifying image_url field...' as info;
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'cards' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Show current table structure
SELECT 'Current cards table structure:' as info;
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'cards' 
AND table_schema = 'public'
ORDER BY ordinal_position; 