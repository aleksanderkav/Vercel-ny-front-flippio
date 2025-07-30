-- Update Supabase Schema for Card Scraping Functionality
-- Run this in your Supabase SQL Editor

-- Add new fields to cards table
ALTER TABLE cards ADD COLUMN IF NOT EXISTS latest_price DECIMAL(10,2);
ALTER TABLE cards ADD COLUMN IF NOT EXISTS price_entries_count INTEGER DEFAULT 0;
ALTER TABLE cards ADD COLUMN IF NOT EXISTS category VARCHAR(50);
ALTER TABLE cards ADD COLUMN IF NOT EXISTS card_type VARCHAR(100);
ALTER TABLE cards ADD COLUMN IF NOT EXISTS set_name VARCHAR(255);
ALTER TABLE cards ADD COLUMN IF NOT EXISTS year INTEGER;
ALTER TABLE cards ADD COLUMN IF NOT EXISTS grading VARCHAR(50);
ALTER TABLE cards ADD COLUMN IF NOT EXISTS rarity VARCHAR(50);
ALTER TABLE cards ADD COLUMN IF NOT EXISTS serial_number VARCHAR(100);

-- Create price_entries table if it doesn't exist
CREATE TABLE IF NOT EXISTS price_entries (
    id BIGSERIAL PRIMARY KEY,
    card_id BIGINT REFERENCES cards(id) ON DELETE CASCADE,
    price DECIMAL(10,2) NOT NULL,
    source VARCHAR(100) NOT NULL DEFAULT 'eBay',
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for price_entries
CREATE INDEX IF NOT EXISTS idx_price_entries_card_id ON price_entries(card_id);
CREATE INDEX IF NOT EXISTS idx_price_entries_timestamp ON price_entries(timestamp);
CREATE INDEX IF NOT EXISTS idx_price_entries_source ON price_entries(source);

-- Enable RLS on price_entries
ALTER TABLE price_entries ENABLE ROW LEVEL SECURITY;

-- Create policies for price_entries
CREATE POLICY "Allow anonymous read access" ON price_entries
    FOR SELECT USING (true);

CREATE POLICY "Allow anonymous insert access" ON price_entries
    FOR INSERT WITH CHECK (true);

-- Grant permissions
GRANT SELECT, INSERT ON price_entries TO anon;

-- Create a function to update card statistics when price entries are added
CREATE OR REPLACE FUNCTION update_card_price_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- Update the card's latest price and price count
    UPDATE cards 
    SET 
        latest_price = NEW.price,
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

-- Create trigger to automatically update card stats
DROP TRIGGER IF EXISTS trigger_update_card_price_stats ON price_entries;
CREATE TRIGGER trigger_update_card_price_stats
    AFTER INSERT ON price_entries
    FOR EACH ROW
    EXECUTE FUNCTION update_card_price_stats();

-- Create a view for cards with latest price information
CREATE OR REPLACE VIEW cards_with_prices AS
SELECT 
    c.id,
    c.name,
    c.card_set,
    c.condition,
    c.latest_price,
    c.price_entries_count,
    c.category,
    c.card_type,
    c.set_name,
    c.year,
    c.grading,
    c.rarity,
    c.serial_number,
    c.last_updated,
    c.created_at,
    c.emoji,
    c.image_url,
    c.market
FROM cards c;

-- Grant permissions on the view
GRANT SELECT ON cards_with_prices TO anon;

-- Create a function to detect category based on card name and type
CREATE OR REPLACE FUNCTION detect_card_category(card_name TEXT, card_type TEXT DEFAULT NULL)
RETURNS VARCHAR(50) AS $$
BEGIN
    -- Convert to lowercase for case-insensitive matching
    card_name := LOWER(card_name);
    
    -- Pokemon detection
    IF card_type ILIKE '%pokemon%' OR card_type ILIKE '%pokémon%' OR
       card_name ~ 'pikachu|charizard|blastoise|venusaur|mewtwo|jigglypuff|snorlax|gyarados|dragonite|mew' OR
       card_name ~ 'pokemon|pokémon' THEN
        RETURN 'Pokemon';
    END IF;
    
    -- Sports detection
    IF card_type ILIKE '%sports%' OR card_type ILIKE '%baseball%' OR card_type ILIKE '%basketball%' OR
       card_type ILIKE '%football%' OR card_type ILIKE '%hockey%' OR
       card_name ~ 'michael jordan|lebron james|kobe bryant|tom brady|mike trout|babe ruth|wayne gretzky' OR
       card_name ~ 'topps|panini|upper deck|fleer|donruss' THEN
        RETURN 'Sports';
    END IF;
    
    -- Gaming detection
    IF card_type ILIKE '%gaming%' OR card_type ILIKE '%magic%' OR card_type ILIKE '%yugioh%' OR
       card_type ILIKE '%hearthstone%' OR card_type ILIKE '%flesh and blood%' OR
       card_name ~ 'black lotus|blue eyes white dragon|red eyes black dragon|exodia|slifer|obelisk|ra' OR
       card_name ~ 'magic the gathering|yugioh|hearthstone' THEN
        RETURN 'Gaming';
    END IF;
    
    -- Default to Other
    RETURN 'Other';
END;
$$ LANGUAGE plpgsql;

-- Show confirmation
SELECT 'Schema updated successfully for card scraping functionality!' as status;
SELECT 'New fields added to cards table' as info;
SELECT 'price_entries table created with triggers' as info;
SELECT 'Category detection function created' as info; 