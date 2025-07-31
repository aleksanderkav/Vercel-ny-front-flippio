-- Check the structure of the cards table
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'cards' 
ORDER BY ordinal_position;

-- Check sample data from cards table to see what's populated
SELECT 
  id,
  name,
  latest_price,
  price_entries_count,
  category,
  card_type,
  set_name,
  year,
  grading,
  rarity,
  serial_number,
  image_url,
  created_at,
  last_updated
FROM cards 
LIMIT 5;

-- Check for cards with missing metadata
SELECT 
  name,
  set_name,
  year,
  grading,
  rarity,
  card_type
FROM cards 
WHERE set_name IS NULL 
   OR year IS NULL 
   OR grading IS NULL 
   OR rarity IS NULL
LIMIT 10;

-- Count cards with missing data
SELECT 
  COUNT(*) as total_cards,
  COUNT(CASE WHEN set_name IS NOT NULL THEN 1 END) as with_set_name,
  COUNT(CASE WHEN year IS NOT NULL THEN 1 END) as with_year,
  COUNT(CASE WHEN grading IS NOT NULL THEN 1 END) as with_grading,
  COUNT(CASE WHEN rarity IS NOT NULL THEN 1 END) as with_rarity,
  COUNT(CASE WHEN card_type IS NOT NULL THEN 1 END) as with_card_type
FROM cards; 