-- Fix the cards_with_prices view to properly map the cards table
-- Run this in your Supabase SQL Editor

-- Drop the existing view if it exists
DROP VIEW IF EXISTS cards_with_prices;

-- Create the cards_with_prices view that maps to the cards table
CREATE VIEW cards_with_prices AS
SELECT 
    id::text as id,
    name,
    current_price as latest_price,
    total_listings as price_count,
    last_updated as last_price_update,
    created_at
FROM cards;

-- Grant permissions to the view
GRANT SELECT ON cards_with_prices TO anon;

-- Create an INSTEAD OF INSERT trigger to handle inserts through the view
CREATE OR REPLACE FUNCTION insert_into_cards_via_view()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO cards (
        name,
        set,
        condition,
        current_price,
        average_price,
        lowest_price,
        highest_price,
        total_listings,
        emoji,
        market
    ) VALUES (
        NEW.name,
        COALESCE(NEW.set, 'Base Set'),
        COALESCE(NEW.condition, 'PSA 10'),
        NEW.latest_price,
        NEW.latest_price,
        NEW.latest_price * 0.9,
        NEW.latest_price * 1.1,
        COALESCE(NEW.price_count, 1),
        COALESCE(NEW.emoji, '🎴'),
        COALESCE(NEW.market, 'eBay')
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