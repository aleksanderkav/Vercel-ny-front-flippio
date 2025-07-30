-- Quick fix for sync_status constraint violation
-- Run this in your Supabase SQL Editor to update the existing trigger function

-- Update the trigger function to use valid sync_status values
CREATE OR REPLACE FUNCTION insert_into_cards_via_view()
RETURNS TRIGGER AS $$
DECLARE
    new_card_id BIGINT;
BEGIN
    -- Insert into cards table first
    INSERT INTO cards (name) VALUES (NEW.name) RETURNING id INTO new_card_id;
    
    -- If price data is provided, also insert into card_prices
    IF NEW.latest_price IS NOT NULL THEN
        INSERT INTO card_prices (
            card_id, 
            average_price, 
            last_seen, 
            sync_status, 
            updated_at
        ) VALUES (
            new_card_id, 
            NEW.latest_price, 
            COALESCE(NEW.last_price_update, NOW()), 
            'pending', 
            NOW()
        );
        
        -- If price_count is provided, create price_entries
        IF NEW.price_count IS NOT NULL AND NEW.price_count > 0 THEN
            -- Insert a sample price entry (you can modify this logic)
            INSERT INTO price_entries (
                card_id,
                price,
                timestamp,
                source
            ) VALUES (
                new_card_id,
                NEW.latest_price,
                NOW(),
                'app'
            );
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Show confirmation
SELECT '=== SYNC_STATUS CONSTRAINT FIX APPLIED ===' as info;
SELECT 'Updated sync_status from "manual" to "pending" and source from "manual" to "app"' as info;
SELECT 'You can now insert new cards without constraint violations!' as info; 