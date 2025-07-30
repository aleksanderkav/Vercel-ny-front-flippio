-- Simple fix for the cards table - only add essential columns
-- This script safely adds missing columns without referencing non-existent ones

-- Add missing columns to cards table if they don't exist
ALTER TABLE cards ADD COLUMN IF NOT EXISTS latest_price DECIMAL(10,2);
ALTER TABLE cards ADD COLUMN IF NOT EXISTS price_entries_count INTEGER DEFAULT 0;
ALTER TABLE cards ADD COLUMN IF NOT EXISTS category VARCHAR(50);
ALTER TABLE cards ADD COLUMN IF NOT EXISTS card_type VARCHAR(100);
ALTER TABLE cards ADD COLUMN IF NOT EXISTS set_name VARCHAR(255);
ALTER TABLE cards ADD COLUMN IF NOT EXISTS year INTEGER;
ALTER TABLE cards ADD COLUMN IF NOT EXISTS grading VARCHAR(50);
ALTER TABLE cards ADD COLUMN IF NOT EXISTS rarity VARCHAR(50);
ALTER TABLE cards ADD COLUMN IF NOT EXISTS serial_number VARCHAR(100);
ALTER TABLE cards ADD COLUMN IF NOT EXISTS last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Update existing cards to have proper category detection
UPDATE cards 
SET category = CASE 
    WHEN LOWER(name) LIKE '%pikachu%' OR LOWER(name) LIKE '%charizard%' OR LOWER(name) LIKE '%pokemon%' OR LOWER(name) LIKE '%pokémon%' THEN 'Pokemon'
    WHEN LOWER(name) LIKE '%yugioh%' OR LOWER(name) LIKE '%magic%' OR LOWER(name) LIKE '%mtg%' OR LOWER(name) LIKE '%hearthstone%' THEN 'Gaming'
    WHEN LOWER(name) LIKE '%football%' OR LOWER(name) LIKE '%basketball%' OR LOWER(name) LIKE '%baseball%' OR LOWER(name) LIKE '%soccer%' THEN 'Sports'
    ELSE 'Other'
END
WHERE category IS NULL;

-- Update existing cards to have proper card_type
UPDATE cards 
SET card_type = CASE 
    WHEN LOWER(name) LIKE '%pikachu%' OR LOWER(name) LIKE '%charizard%' OR LOWER(name) LIKE '%pokemon%' OR LOWER(name) LIKE '%pokémon%' THEN 'Pokémon'
    WHEN LOWER(name) LIKE '%yugioh%' THEN 'Yu-Gi-Oh!'
    WHEN LOWER(name) LIKE '%magic%' OR LOWER(name) LIKE '%mtg%' THEN 'Magic: The Gathering'
    WHEN LOWER(name) LIKE '%hearthstone%' THEN 'Hearthstone'
    WHEN LOWER(name) LIKE '%football%' OR LOWER(name) LIKE '%basketball%' OR LOWER(name) LIKE '%baseball%' OR LOWER(name) LIKE '%soccer%' THEN 'Sports'
    ELSE 'Other'
END
WHERE card_type IS NULL;

-- Create the cards_with_prices view
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
    c.card_set,
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

-- Grant permissions
GRANT SELECT ON cards_with_prices TO anon;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_cards_latest_price ON cards(latest_price);
CREATE INDEX IF NOT EXISTS idx_cards_category ON cards(category);
CREATE INDEX IF NOT EXISTS idx_cards_last_updated_desc ON cards(last_updated DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_cards_created_at_desc ON cards(created_at DESC); 