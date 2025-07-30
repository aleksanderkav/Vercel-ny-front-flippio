-- Quick fix for UUID casting in trigger function
-- Run this in your Supabase SQL Editor

-- Update the trigger function to cast TEXT to UUID properly
CREATE OR REPLACE FUNCTION insert_into_cards_via_view()
RETURNS TRIGGER AS $$
DECLARE
    new_card_id TEXT;  -- Use TEXT to handle both UUID and BIGINT
    actual_card_id TEXT;  -- Store the actual inserted ID
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
            actual_card_id::uuid,  -- Cast TEXT to UUID
            NEW.latest_price, 
            COALESCE(NEW.last_price_update, NOW()), 
            'pending', 
            NOW()
        );
        
        -- If price_count is provided, create price_entries
        IF NEW.price_count IS NOT NULL AND NEW.price_count > 0 THEN
            INSERT INTO price_entries (
                card_id,
                price,
                timestamp,
                source
            ) VALUES (
                actual_card_id::uuid,  -- Cast TEXT to UUID
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
SELECT '=== UUID CASTING FIX APPLIED ===' as info;
SELECT 'Trigger function updated with proper UUID casting' as info;
SELECT 'actual_card_id::uuid now properly casts TEXT to UUID' as info;
SELECT 'Try running the test_insert_trigger.sql again!' as info; 