-- Fix RLS and Add Sample Data for Existing Schema
-- Run this in your Supabase SQL Editor

-- First, let's check and fix RLS policies for all tables
-- Enable RLS on all tables if not already enabled
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE card_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_entries ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow anonymous read access" ON cards;
DROP POLICY IF EXISTS "Allow anonymous read access" ON card_prices;
DROP POLICY IF EXISTS "Allow anonymous read access" ON price_entries;

-- Create policies to allow anonymous read access
CREATE POLICY "Allow anonymous read access" ON cards
    FOR SELECT USING (true);

CREATE POLICY "Allow anonymous read access" ON card_prices
    FOR SELECT USING (true);

CREATE POLICY "Allow anonymous read access" ON price_entries
    FOR SELECT USING (true);

-- Grant permissions to anon role
GRANT SELECT ON cards TO anon;
GRANT SELECT ON card_prices TO anon;
GRANT SELECT ON price_entries TO anon;

-- Now let's add some sample cards
INSERT INTO cards (name) VALUES
('Pikachu'),
('Charizard'),
('Blastoise'),
('Venusaur'),
('Mewtwo'),
('Ekans'),
('Arbok'),
('Raichu'),
('Ninetales'),
('Gyarados')
ON CONFLICT (name) DO NOTHING;

-- Now let's add price data for these cards
-- We'll use the card IDs from the cards table
INSERT INTO card_prices (card_id, average_price, last_seen, sync_status)
SELECT 
    c.id,
    CASE 
        WHEN c.name = 'Pikachu' THEN 299.99
        WHEN c.name = 'Charizard' THEN 899.99
        WHEN c.name = 'Blastoise' THEN 199.99
        WHEN c.name = 'Venusaur' THEN 450.00
        WHEN c.name = 'Mewtwo' THEN 650.00
        WHEN c.name = 'Ekans' THEN 45.99
        WHEN c.name = 'Arbok' THEN 35.50
        WHEN c.name = 'Raichu' THEN 180.00
        WHEN c.name = 'Ninetales' THEN 120.00
        WHEN c.name = 'Gyarados' THEN 85.00
        ELSE 100.00
    END as average_price,
    NOW() as last_seen,
    'success' as sync_status
FROM cards c
WHERE c.name IN ('Pikachu', 'Charizard', 'Blastoise', 'Venusaur', 'Mewtwo', 'Ekans', 'Arbok', 'Raichu', 'Ninetales', 'Gyarados')
ON CONFLICT (card_id) DO UPDATE SET
    average_price = EXCLUDED.average_price,
    last_seen = EXCLUDED.last_seen,
    sync_status = EXCLUDED.sync_status;

-- Add some price history entries
INSERT INTO price_entries (card_id, price, timestamp)
SELECT 
    c.id,
    CASE 
        WHEN c.name = 'Pikachu' THEN 299.99
        WHEN c.name = 'Charizard' THEN 899.99
        WHEN c.name = 'Blastoise' THEN 199.99
        WHEN c.name = 'Venusaur' THEN 450.00
        WHEN c.name = 'Mewtwo' THEN 650.00
        WHEN c.name = 'Ekans' THEN 45.99
        WHEN c.name = 'Arbok' THEN 35.50
        WHEN c.name = 'Raichu' THEN 180.00
        WHEN c.name = 'Ninetales' THEN 120.00
        WHEN c.name = 'Gyarados' THEN 85.00
        ELSE 100.00
    END as price,
    NOW() as timestamp
FROM cards c
WHERE c.name IN ('Pikachu', 'Charizard', 'Blastoise', 'Venusaur', 'Mewtwo', 'Ekans', 'Arbok', 'Raichu', 'Ninetales', 'Gyarados');

-- Add some historical price entries (last 7 days)
INSERT INTO price_entries (card_id, price, timestamp)
SELECT 
    c.id,
    CASE 
        WHEN c.name = 'Pikachu' THEN 285.50
        WHEN c.name = 'Charizard' THEN 875.25
        WHEN c.name = 'Blastoise' THEN 185.75
        WHEN c.name = 'Venusaur' THEN 435.80
        WHEN c.name = 'Mewtwo' THEN 625.40
        WHEN c.name = 'Ekans' THEN 42.50
        WHEN c.name = 'Arbok' THEN 32.75
        WHEN c.name = 'Raichu' THEN 165.25
        WHEN c.name = 'Ninetales' THEN 115.50
        WHEN c.name = 'Gyarados' THEN 78.25
        ELSE 95.00
    END as price,
    NOW() - INTERVAL '7 days' as timestamp
FROM cards c
WHERE c.name IN ('Pikachu', 'Charizard', 'Blastoise', 'Venusaur', 'Mewtwo', 'Ekans', 'Arbok', 'Raichu', 'Ninetales', 'Gyarados');

-- Verify the data was inserted and RLS is working
SELECT 
    c.name,
    cp.average_price,
    cp.last_seen,
    cp.sync_status,
    COUNT(pe.id) as price_entries_count
FROM cards c
LEFT JOIN card_prices cp ON c.id = cp.card_id
LEFT JOIN price_entries pe ON c.id = pe.card_id
GROUP BY c.name, cp.average_price, cp.last_seen, cp.sync_status
ORDER BY c.name; 