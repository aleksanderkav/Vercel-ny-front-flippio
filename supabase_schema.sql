-- Trading Card Tracker Database Schema
-- Run this in your Supabase SQL Editor

-- Create the cards table with all necessary fields
CREATE TABLE IF NOT EXISTS cards (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    set VARCHAR(255) NOT NULL,
    condition VARCHAR(50) NOT NULL,
    current_price DECIMAL(10,2),
    average_price DECIMAL(10,2),
    lowest_price DECIMAL(10,2),
    highest_price DECIMAL(10,2),
    market_distribution JSONB,
    total_listings INTEGER DEFAULT 0,
    emoji VARCHAR(10),
    image_url TEXT,
    market VARCHAR(100),
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better search performance
CREATE INDEX IF NOT EXISTS idx_cards_name ON cards(name);
CREATE INDEX IF NOT EXISTS idx_cards_set ON cards(set);
CREATE INDEX IF NOT EXISTS idx_cards_condition ON cards(condition);
CREATE INDEX IF NOT EXISTS idx_cards_last_updated ON cards(last_updated);

-- Enable Row Level Security (RLS)
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anonymous read access
CREATE POLICY "Allow anonymous read access" ON cards
    FOR SELECT USING (true);

-- Insert some sample data
INSERT INTO cards (name, set, condition, current_price, average_price, lowest_price, highest_price, market_distribution, total_listings, emoji, market) VALUES
('Pikachu', 'Base Set', 'PSA 10', 299.99, 285.50, 245.00, 350.00, '{"eBay": 45, "TCGPlayer": 35, "CardMarket": 20}', 127, '⚡', 'eBay'),
('Charizard', 'Base Set', 'PSA 9', 899.99, 875.25, 820.00, 950.00, '{"eBay": 40, "TCGPlayer": 40, "CardMarket": 20}', 89, '🔥', 'TCGPlayer'),
('Blastoise', 'Base Set', 'PSA 8', 199.99, 185.75, 165.00, 220.00, '{"eBay": 50, "TCGPlayer": 30, "CardMarket": 20}', 156, '💧', 'eBay'),
('Venusaur', 'Base Set', 'PSA 10', 450.00, 435.80, 395.00, 485.00, '{"eBay": 35, "TCGPlayer": 45, "CardMarket": 20}', 94, '🌿', 'TCGPlayer'),
('Mewtwo', 'Base Set', 'PSA 9', 650.00, 625.40, 580.00, 690.00, '{"eBay": 45, "TCGPlayer": 35, "CardMarket": 20}', 67, '🧬', 'eBay'),
('Ekans', 'Base Set', 'PSA 10', 45.99, 42.50, 38.00, 52.00, '{"eBay": 60, "TCGPlayer": 25, "CardMarket": 15}', 45, '🐍', 'eBay'),
('Arbok', 'Base Set', 'PSA 9', 35.50, 32.75, 28.00, 40.00, '{"eBay": 55, "TCGPlayer": 30, "CardMarket": 15}', 38, '🐍', 'TCGPlayer'),
('Raichu', 'Base Set', 'PSA 10', 180.00, 165.25, 150.00, 195.00, '{"eBay": 40, "TCGPlayer": 40, "CardMarket": 20}', 72, '⚡', 'eBay'),
('Ninetales', 'Base Set', 'PSA 9', 120.00, 115.50, 105.00, 135.00, '{"eBay": 45, "TCGPlayer": 35, "CardMarket": 20}', 58, '🦊', 'TCGPlayer'),
('Gyarados', 'Base Set', 'PSA 8', 85.00, 78.25, 70.00, 95.00, '{"eBay": 50, "TCGPlayer": 30, "CardMarket": 20}', 89, '🐉', 'eBay');

-- Create a function to update last_updated timestamp
CREATE OR REPLACE FUNCTION update_last_updated()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_updated = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update last_updated
CREATE TRIGGER update_cards_last_updated
    BEFORE UPDATE ON cards
    FOR EACH ROW
    EXECUTE FUNCTION update_last_updated();

-- Create a view for card statistics
CREATE OR REPLACE VIEW card_stats AS
SELECT 
    COUNT(*) as total_cards,
    AVG(current_price) as avg_current_price,
    MIN(current_price) as min_price,
    MAX(current_price) as max_price,
    COUNT(DISTINCT set) as unique_sets,
    COUNT(DISTINCT condition) as unique_conditions
FROM cards;

-- Grant permissions
GRANT SELECT ON cards TO anon;
GRANT SELECT ON card_stats TO anon; 