-- Fix the trigger to automatically update latest_price when price_entries are added
-- This will ensure prices show up immediately after scraping

-- Drop the existing trigger function if it exists
DROP FUNCTION IF EXISTS update_card_price_stats() CASCADE;

-- Create a new trigger function that properly updates latest_price
CREATE OR REPLACE FUNCTION update_card_price_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- Update the cards table with the latest price and count
    UPDATE cards 
    SET 
        latest_price = (
            SELECT price 
            FROM price_entries 
            WHERE card_id = NEW.card_id 
            ORDER BY timestamp DESC 
            LIMIT 1
        ),
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

-- Create the trigger
CREATE TRIGGER update_card_price_stats
    AFTER INSERT ON price_entries
    FOR EACH ROW
    EXECUTE FUNCTION update_card_price_stats();

-- Test the trigger by checking if it exists
SELECT 
    trigger_name, 
    event_manipulation, 
    action_timing, 
    action_statement
FROM information_schema.triggers 
WHERE trigger_name = 'update_card_price_stats'; 