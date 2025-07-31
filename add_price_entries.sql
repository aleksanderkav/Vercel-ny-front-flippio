-- Add realistic price entries for the cards
-- This simulates historical price data

-- Get all card IDs
WITH card_ids AS (
  SELECT id, name, latest_price 
  FROM cards 
  ORDER BY created_at
)

-- Add price entries for each card
INSERT INTO price_entries (card_id, price, source, timestamp)
SELECT 
  c.id,
  -- Generate realistic price variations (±20% from latest_price)
  c.latest_price * (0.8 + (random() * 0.4)) as price,
  'eBay' as source,
  -- Generate timestamps over the last 6 months
  (NOW() - (random() * interval '180 days')) as timestamp
FROM card_ids c
CROSS JOIN generate_series(1, 5) as entry_num; -- 5 price entries per card

-- Add some additional price entries for popular cards
INSERT INTO price_entries (card_id, price, source, timestamp)
SELECT 
  c.id,
  c.latest_price * (0.9 + (random() * 0.2)) as price,
  'eBay' as source,
  (NOW() - (random() * interval '30 days')) as timestamp
FROM cards c
WHERE c.name LIKE '%Charizard%' OR c.name LIKE '%Jordan%' OR c.name LIKE '%Brady%'
CROSS JOIN generate_series(1, 3); -- Extra entries for popular cards

-- Show results
SELECT 
  'Price Entries Added' as summary,
  COUNT(*) as count
FROM price_entries;

-- Show sample price data
SELECT 
  c.name,
  c.latest_price,
  COUNT(pe.id) as price_entries_count,
  AVG(pe.price) as avg_price,
  MIN(pe.price) as min_price,
  MAX(pe.price) as max_price
FROM cards c
LEFT JOIN price_entries pe ON c.id = pe.card_id
GROUP BY c.id, c.name, c.latest_price
ORDER BY c.latest_price DESC
LIMIT 10; 