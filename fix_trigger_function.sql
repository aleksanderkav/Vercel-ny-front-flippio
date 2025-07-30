-- Fix the trigger function to not update last_updated column
-- Run this in your Supabase SQL Editor

-- Drop the existing trigger
DROP TRIGGER IF EXISTS trigger_update_card_price_stats ON price_entries;

-- Create a simplified trigger function that doesn't update last_updated
CREATE OR REPLACE FUNCTION update_card_price_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- Update the card's latest price and price count
    -- Only update fields that we know exist
    UPDATE cards 
    SET 
        latest_price = NEW.price,
        price_entries_count = (
            SELECT COUNT(*) 
            FROM price_entries 
            WHERE card_id = NEW.card_id
        )
    WHERE id = NEW.card_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recreate the trigger
CREATE TRIGGER trigger_update_card_price_stats
    AFTER INSERT ON price_entries
    FOR EACH ROW
    EXECUTE FUNCTION update_card_price_stats();

SELECT 'Trigger function fixed successfully!' as status; 