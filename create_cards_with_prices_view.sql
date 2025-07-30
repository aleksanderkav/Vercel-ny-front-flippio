-- Create the cards_with_prices view that joins cards with their latest price entries
-- This view will be used by the frontend to display cards with their current prices

CREATE OR REPLACE VIEW cards_with_prices AS
SELECT 
    c.id,
    c.name,
    c.latest_price,
    c.price_entries_count,
    c.last_updated,
    c.created_at,
    c.category,
    c.card_type,
    c.set_name,
    c.year,
    c.grading,
    c.rarity,
    c.serial_number,
    c.condition,
    c.card_set,
    c.current_price,
    c.average_price,
    c.lowest_price,
    c.highest_price,
    c.market_distribution,
    c.total_listings,
    c.emoji,
    c.image_url,
    c.market
FROM cards c
ORDER BY c.last_updated DESC NULLS LAST, c.created_at DESC;

-- Grant permissions to the view
GRANT SELECT ON cards_with_prices TO anon;

-- Create an index on the cards table for better view performance
CREATE INDEX IF NOT EXISTS idx_cards_last_updated_desc ON cards(last_updated DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_cards_created_at_desc ON cards(created_at DESC); 