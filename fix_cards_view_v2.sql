-- Fix the cards_with_prices view - Version 2
-- This handles the most likely actual table structure
-- Run this in your Supabase SQL Editor

-- First, let's see what we're working with
SELECT 'Current table structure:' as info;
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'cards' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Drop the existing view if it exists
DROP VIEW IF EXISTS cards_with_prices;

-- Create the cards_with_prices view with flexible column mapping
-- This assumes the cards table has basic columns like id, name, created_at
CREATE VIEW cards_with_prices AS
SELECT 
    id::text as id,
    name,
    -- Try to map price columns - adjust these based on actual column names
    COALESCE(
        (SELECT column_name FROM information_schema.columns 
         WHERE table_name = 'cards' AND column_name = 'price' LIMIT 1),
        (SELECT column_name FROM information_schema.columns 
         WHERE table_name = 'cards' AND column_name = 'current_price' LIMIT 1),
        (SELECT column_name FROM information_schema.columns 
         WHERE table_name = 'cards' AND column_name = 'latest_price' LIMIT 1)
    ) as latest_price,
    -- Try to map count columns
    COALESCE(
        (SELECT column_name FROM information_schema.columns 
         WHERE table_name = 'cards' AND column_name = 'price_count' LIMIT 1),
        (SELECT column_name FROM information_schema.columns 
         WHERE table_name = 'cards' AND column_name = 'total_listings' LIMIT 1),
        (SELECT column_name FROM information_schema.columns 
         WHERE table_name = 'cards' AND column_name = 'listings_count' LIMIT 1)
    ) as price_count,
    -- Try to map timestamp columns
    COALESCE(
        (SELECT column_name FROM information_schema.columns 
         WHERE table_name = 'cards' AND column_name = 'last_price_update' LIMIT 1),
        (SELECT column_name FROM information_schema.columns 
         WHERE table_name = 'cards' AND column_name = 'last_updated' LIMIT 1),
        (SELECT column_name FROM information_schema.columns 
         WHERE table_name = 'cards' AND column_name = 'updated_at' LIMIT 1)
    ) as last_price_update,
    created_at
FROM cards;

-- Grant permissions to the view
GRANT SELECT ON cards_with_prices TO anon;

-- Create a simple INSTEAD OF INSERT trigger
CREATE OR REPLACE FUNCTION insert_into_cards_via_view()
RETURNS TRIGGER AS $$
BEGIN
    -- Insert with minimal required fields
    INSERT INTO cards (
        name,
        created_at
    ) VALUES (
        NEW.name,
        COALESCE(NEW.created_at, NOW())
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger
DROP TRIGGER IF EXISTS cards_with_prices_insert_trigger ON cards_with_prices;
CREATE TRIGGER cards_with_prices_insert_trigger
    INSTEAD OF INSERT ON cards_with_prices
    FOR EACH ROW
    EXECUTE FUNCTION insert_into_cards_via_view();

-- Grant permissions for the trigger function
GRANT EXECUTE ON FUNCTION insert_into_cards_via_view() TO anon;

-- Test the view
SELECT 'View created successfully. Testing with sample data:' as info;
SELECT * FROM cards_with_prices LIMIT 3; 