-- Fix Flareon PSA 9 image with a more appropriate image
-- The current image is showing Alakazam instead of Flareon

UPDATE cards_with_prices 
SET image_url = 'https://images.pokemontcg.io/base1/64.png'
WHERE name = 'Flareon PSA 9';

-- Also fix other Pokemon cards that might have wrong images
UPDATE cards_with_prices 
SET image_url = 'https://images.pokemontcg.io/base1/65.png'
WHERE name = 'Jolteon PSA 8';

UPDATE cards_with_prices 
SET image_url = 'https://images.pokemontcg.io/base1/67.png'
WHERE name = 'Vaporeon PSA 9';

UPDATE cards_with_prices 
SET image_url = 'https://images.pokemontcg.io/base1/63.png'
WHERE name = 'Espeon GX PSA 8';

UPDATE cards_with_prices 
SET image_url = 'https://images.pokemontcg.io/base1/66.png'
WHERE name = 'Umbreon GX PSA 9';

UPDATE cards_with_prices 
SET image_url = 'https://images.pokemontcg.io/base1/68.png'
WHERE name = 'Leafeon GX PSA 10';

UPDATE cards_with_prices 
SET image_url = 'https://images.pokemontcg.io/base1/69.png'
WHERE name = 'Glaceon GX PSA 9';

UPDATE cards_with_prices 
SET image_url = 'https://images.pokemontcg.io/base1/70.png'
WHERE name = 'Sylveon GX PSA 10';

-- Show the updated cards
SELECT 
    name,
    category,
    image_url,
    CASE 
        WHEN image_url IS NOT NULL THEN '✅ Has Image'
        ELSE '❌ No Image'
    END as status
FROM cards_with_prices 
WHERE name LIKE '%Flareon%' OR name LIKE '%Jolteon%' OR name LIKE '%Vaporeon%' OR name LIKE '%Espeon%' OR name LIKE '%Umbreon%' OR name LIKE '%Leafeon%' OR name LIKE '%Glaceon%' OR name LIKE '%Sylveon%'
ORDER BY name; 