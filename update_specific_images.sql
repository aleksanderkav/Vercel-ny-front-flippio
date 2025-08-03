-- Update specific card images with better URLs
-- This script updates the most problematic images with better alternatives

-- Pokemon cards with better images
UPDATE cards_with_prices 
SET image_url = 'https://images.pokemontcg.io/ex12/5.png'
WHERE name = 'Gengar PSA 8';

UPDATE cards_with_prices 
SET image_url = 'https://images.pokemontcg.io/base3/4.png'
WHERE name = 'Dragonite PSA 8';

UPDATE cards_with_prices 
SET image_url = 'https://images.pokemontcg.io/base6/3.png'
WHERE name = 'Charizard VMAX PSA 10';

UPDATE cards_with_prices 
SET image_url = 'https://images.pokemontcg.io/champions-path/74_hires.png'
WHERE name = 'Flareon PSA 9';

UPDATE cards_with_prices 
SET image_url = 'https://images.pokemontcg.io/base2/4.png'
WHERE name = 'Espeon GX PSA 8';

UPDATE cards_with_prices 
SET image_url = 'https://images.pokemontcg.io/base1/4_hires.png'
WHERE name = 'Alakazam PSA 9';

-- Sports cards with real images
UPDATE cards_with_prices 
SET image_url = 'https://www.tcdb.com/Images/Cards/Basketball/2009-10/Topps/321-StephenCurry.jpg'
WHERE name LIKE '%Stephen Curry%' AND image_url IS NULL;

UPDATE cards_with_prices 
SET image_url = 'https://www.tcdb.com/Images/Cards/Basketball/2013-14/Panini/340-GiannisAntetokounmpo.jpg'
WHERE name LIKE '%Giannis%' AND image_url IS NULL;

UPDATE cards_with_prices 
SET image_url = 'https://www.tcdb.com/Images/Cards/Basketball/1996-97/Topps/138-KobeBryant.jpg'
WHERE name LIKE '%Kobe Bryant%' AND image_url IS NULL;

UPDATE cards_with_prices 
SET image_url = 'https://www.tcdb.com/Images/Cards/Basketball/2003-04/Topps/221-LeBronJames.jpg'
WHERE name LIKE '%LeBron James%' AND image_url IS NULL;

-- Show results
SELECT 
    name,
    category,
    image_url,
    CASE 
        WHEN image_url IS NOT NULL THEN '✅ Has Image'
        ELSE '❌ No Image'
    END as status
FROM cards_with_prices 
ORDER BY category, name
LIMIT 20; 