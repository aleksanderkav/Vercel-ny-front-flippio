-- Reset all card images to null to force re-scraping
-- This will clear all existing image_url values so new images can be fetched

UPDATE cards_with_prices 
SET image_url = NULL 
WHERE image_url IS NOT NULL;

-- Also reset the last_updated timestamp to trigger re-scraping
UPDATE cards_with_prices 
SET last_updated = NOW() - INTERVAL '1 day'
WHERE image_url IS NULL;

-- Show how many cards will be affected
SELECT 
    COUNT(*) as total_cards,
    COUNT(CASE WHEN image_url IS NULL THEN 1 END) as cards_without_images,
    COUNT(CASE WHEN image_url IS NOT NULL THEN 1 END) as cards_with_images
FROM cards_with_prices;

-- Show sample of cards that will be re-scraped
SELECT 
    name,
    category,
    image_url,
    last_updated
FROM cards_with_prices 
WHERE image_url IS NULL
ORDER BY name
LIMIT 10; 