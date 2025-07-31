-- Add images to existing cards that don't have image_url
-- This simulates what the scraper would do for existing cards

UPDATE cards 
SET image_url = 
  CASE 
    -- Pokemon cards
    WHEN name ILIKE '%charizard%' THEN 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=600&fit=crop'
    WHEN name ILIKE '%pikachu%' THEN 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop'
    WHEN name ILIKE '%mewtwo%' THEN 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=600&fit=crop'
    WHEN name ILIKE '%blastoise%' THEN 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop'
    WHEN name ILIKE '%venusaur%' THEN 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=600&fit=crop'
    WHEN name ILIKE '%sylveon%' THEN 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop'
    WHEN name ILIKE '%umbreon%' THEN 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=600&fit=crop'
    WHEN name ILIKE '%espeon%' THEN 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop'
    WHEN name ILIKE '%vaporeon%' THEN 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=600&fit=crop'
    WHEN name ILIKE '%jolteon%' THEN 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop'
    WHEN name ILIKE '%flareon%' THEN 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=600&fit=crop'
    WHEN name ILIKE '%leafeon%' THEN 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop'
    WHEN name ILIKE '%glaceon%' THEN 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=600&fit=crop'
    WHEN name ILIKE '%eevee%' THEN 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop'
    WHEN name ILIKE '%snorlax%' THEN 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=600&fit=crop'
    WHEN name ILIKE '%gyarados%' THEN 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop'
    WHEN name ILIKE '%dragonite%' THEN 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=600&fit=crop'
    WHEN name ILIKE '%tyranitar%' THEN 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop'
    WHEN name ILIKE '%metagross%' THEN 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=600&fit=crop'
    WHEN name ILIKE '%salamence%' THEN 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop'
    WHEN name ILIKE '%garchomp%' THEN 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=600&fit=crop'
    WHEN name ILIKE '%lucario%' THEN 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop'
    WHEN name ILIKE '%gengar%' THEN 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=600&fit=crop'
    WHEN name ILIKE '%alakazam%' THEN 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop'
    WHEN name ILIKE '%machamp%' THEN 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=600&fit=crop'
    WHEN name ILIKE '%golem%' THEN 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop'
    WHEN name ILIKE '%ninetales%' THEN 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=600&fit=crop'
    WHEN name ILIKE '%raichu%' THEN 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop'
    WHEN name ILIKE '%nidoking%' THEN 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=600&fit=crop'
    WHEN name ILIKE '%nidoqueen%' THEN 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop'
    WHEN name ILIKE '%vileplume%' THEN 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=600&fit=crop'
    WHEN name ILIKE '%victreebel%' THEN 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop'
    WHEN name ILIKE '%tentacruel%' THEN 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=600&fit=crop'
    WHEN name ILIKE '%muk%' THEN 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop'
    WHEN name ILIKE '%weezing%' THEN 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=600&fit=crop'
    WHEN name ILIKE '%rapidash%' THEN 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop'
    WHEN name ILIKE '%slowbro%' THEN 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=600&fit=crop'
    WHEN name ILIKE '%magneton%' THEN 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop'
    WHEN name ILIKE '%dodrio%' THEN 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=600&fit=crop'
    WHEN name ILIKE '%dewgong%' THEN 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop'
    WHEN name ILIKE '%cloyster%' THEN 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=600&fit=crop'
    WHEN name ILIKE '%gastly%' THEN 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop'
    WHEN name ILIKE '%haunter%' THEN 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=600&fit=crop'
    WHEN name ILIKE '%onix%' THEN 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop'
    WHEN name ILIKE '%drowzee%' THEN 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=600&fit=crop'
    WHEN name ILIKE '%hypno%' THEN 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop'
    WHEN name ILIKE '%krabby%' THEN 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=600&fit=crop'
    WHEN name ILIKE '%kingler%' THEN 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop'
    WHEN name ILIKE '%voltorb%' THEN 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=600&fit=crop'
    WHEN name ILIKE '%electrode%' THEN 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop'
    WHEN name ILIKE '%exeggcute%' THEN 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=600&fit=crop'
    WHEN name ILIKE '%exeggutor%' THEN 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop'
    WHEN name ILIKE '%cubone%' THEN 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=600&fit=crop'
    WHEN name ILIKE '%marowak%' THEN 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop'
    WHEN name ILIKE '%hitmonlee%' THEN 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=600&fit=crop'
    WHEN name ILIKE '%hitmonchan%' THEN 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop'
    WHEN name ILIKE '%lickitung%' THEN 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=600&fit=crop'
    WHEN name ILIKE '%koffing%' THEN 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop'
    WHEN name ILIKE '%rhyhorn%' THEN 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=600&fit=crop'
    WHEN name ILIKE '%rhydon%' THEN 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop'
    WHEN name ILIKE '%chansey%' THEN 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=600&fit=crop'
    WHEN name ILIKE '%tangela%' THEN 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop'
    WHEN name ILIKE '%kangaskhan%' THEN 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=600&fit=crop'
    WHEN name ILIKE '%horsea%' THEN 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop'
    WHEN name ILIKE '%seadra%' THEN 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=600&fit=crop'
    WHEN name ILIKE '%goldeen%' THEN 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop'
    WHEN name ILIKE '%seaking%' THEN 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=600&fit=crop'
    WHEN name ILIKE '%staryu%' THEN 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop'
    WHEN name ILIKE '%starmie%' THEN 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=600&fit=crop'
    WHEN name ILIKE '%mr. mime%' THEN 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop'
    WHEN name ILIKE '%scyther%' THEN 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=600&fit=crop'
    WHEN name ILIKE '%jynx%' THEN 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop'
    WHEN name ILIKE '%electabuzz%' THEN 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=600&fit=crop'
    WHEN name ILIKE '%magmar%' THEN 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop'
    WHEN name ILIKE '%pinsir%' THEN 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=600&fit=crop'
    WHEN name ILIKE '%tauros%' THEN 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop'
    WHEN name ILIKE '%magikarp%' THEN 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=600&fit=crop'
    WHEN name ILIKE '%lapras%' THEN 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop'
    WHEN name ILIKE '%ditto%' THEN 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=600&fit=crop'
    WHEN name ILIKE '%omanyte%' THEN 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop'
    WHEN name ILIKE '%omastar%' THEN 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=600&fit=crop'
    WHEN name ILIKE '%kabuto%' THEN 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop'
    WHEN name ILIKE '%kabutops%' THEN 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=600&fit=crop'
    WHEN name ILIKE '%aerodactyl%' THEN 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop'
    WHEN name ILIKE '%articuno%' THEN 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=600&fit=crop'
    WHEN name ILIKE '%zapdos%' THEN 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop'
    WHEN name ILIKE '%moltres%' THEN 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=600&fit=crop'
    WHEN name ILIKE '%dratini%' THEN 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop'
    WHEN name ILIKE '%dragonair%' THEN 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=600&fit=crop'
    WHEN name ILIKE '%mewtwo%' THEN 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop'
    WHEN name ILIKE '%mew%' THEN 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=600&fit=crop'
    
    -- Sports cards
    WHEN name ILIKE '%jordan%' OR name ILIKE '%lebron%' OR name ILIKE '%brady%' THEN 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=600&fit=crop'
    
    -- Magic cards
    WHEN name ILIKE '%black lotus%' OR name ILIKE '%magic%' OR name ILIKE '%mtg%' THEN 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=600&fit=crop'
    
    -- Default for other cards
    ELSE 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop'
  END
WHERE image_url IS NULL OR image_url = '';

-- Show results
SELECT 
  name,
  image_url,
  category
FROM cards 
WHERE image_url IS NOT NULL 
ORDER BY created_at DESC 
LIMIT 10; 