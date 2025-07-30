-- Fix price_entries schema mismatch in trigger function
-- Run this in your Supabase SQL Editor

-- First, let's check the actual price_entries table structure
SELECT '=== PRICE_ENTRIES TABLE STRUCTURE ===' as info;
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'price_entries' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Update the trigger function to match the actual price_entries schema
CREATE OR REPLACE FUNCTION insert_into_cards_via_view()
RETURNS TRIGGER AS $$
DECLARE
    actual_card_id TEXT;  -- Keep as TEXT since we get it as id::text
BEGIN
    -- Insert into cards table first
    INSERT INTO cards (name) VALUES (NEW.name) RETURNING id::text INTO actual_card_id;
    
    -- If price data is provided, also insert into card_prices
    IF NEW.latest_price IS NOT NULL THEN
        INSERT INTO card_prices (
            card_id, 
            average_price, 
            last_seen, 
            sync_status, 
            updated_at
        ) VALUES (
            actual_card_id::uuid,  -- CAST TEXT TO UUID HERE
            NEW.latest_price, 
            COALESCE(NEW.last_price_update, NOW()), 
            'pending', 
            NOW()
        );
        
        -- If price_count is provided, create price_entries
        -- Note: Removed 'source' column as it doesn't exist in the table
        IF NEW.price_count IS NOT NULL AND NEW.price_count > 0 THEN
            INSERT INTO price_entries (
                card_id,
                price,
                timestamp
            ) VALUES (
                actual_card_id::uuid,  -- CAST TEXT TO UUID HERE
                NEW.latest_price,
                NOW()
            );
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Show confirmation
SELECT '=== PRICE_ENTRIES SCHEMA FIX APPLIED ===' as info;
SELECT 'Removed non-existent "source" column from price_entries insert' as info;
SELECT 'Trigger function now matches actual table schema' as info;
SELECT 'Try searching for a card now!' as info; 