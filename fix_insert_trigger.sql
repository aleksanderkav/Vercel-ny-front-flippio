-- Add INSTEAD OF INSERT trigger to existing cards_with_prices view
-- Run this in your Supabase SQL Editor

-- Step 1: Drop any existing trigger and function
DROP TRIGGER IF EXISTS cards_with_prices_insert_trigger ON cards_with_prices;
DROP FUNCTION IF EXISTS insert_into_cards_via_view();

-- Step 2: Create the INSERT trigger function
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
            'manual', 
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
                'manual'
            );
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 3: Create the INSTEAD OF INSERT trigger
CREATE TRIGGER cards_with_prices_insert_trigger
    INSTEAD OF INSERT ON cards_with_prices
    FOR EACH ROW
    EXECUTE FUNCTION insert_into_cards_via_view();

-- Step 4: Grant permissions for the trigger function
GRANT EXECUTE ON FUNCTION insert_into_cards_via_view() TO anon;

-- Step 5: Test the trigger (optional - uncomment to test)
-- INSERT INTO cards_with_prices (name, latest_price, price_count) 
-- VALUES ('Test Card via Trigger', 25.99, 1);

-- Step 6: Show confirmation
SELECT '=== INSERT TRIGGER CREATED SUCCESSFULLY ===' as info;
SELECT 'You can now insert new cards through the cards_with_prices view!' as info; 