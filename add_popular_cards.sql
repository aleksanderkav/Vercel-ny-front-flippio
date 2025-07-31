-- Add 75 popular trading cards (25 Pokemon, 25 Football, 25 Basketball)
-- This creates a comprehensive test collection

-- First, clear existing data to start fresh
DELETE FROM price_entries;
DELETE FROM cards;

-- Add 25 Popular Pokemon Cards
INSERT INTO cards (name, latest_price, category, card_type, set_name, year, grading, rarity, created_at, last_updated) VALUES
-- Base Set Classics
('Charizard PSA 10', 2500.00, 'Pokemon', 'Pokémon', 'Base Set', 1999, 'PSA 10', 'Holo Rare', NOW(), NOW()),
('Pikachu PSA 9', 180.00, 'Pokemon', 'Pokémon', 'Base Set', 1999, 'PSA 9', 'Common', NOW(), NOW()),
('Blastoise PSA 8', 450.00, 'Pokemon', 'Pokémon', 'Base Set', 1999, 'PSA 8', 'Holo Rare', NOW(), NOW()),
('Venusaur PSA 9', 380.00, 'Pokemon', 'Pokémon', 'Base Set', 1999, 'PSA 9', 'Holo Rare', NOW(), NOW()),
('Mewtwo PSA 10', 1200.00, 'Pokemon', 'Pokémon', 'Base Set', 1999, 'PSA 10', 'Holo Rare', NOW(), NOW()),

-- Modern Pokemon
('Charizard VMAX PSA 10', 800.00, 'Pokemon', 'Pokémon', 'Champions Path', 2020, 'PSA 10', 'VMAX', NOW(), NOW()),
('Pikachu V PSA 9', 95.00, 'Pokemon', 'Pokémon', 'Vivid Voltage', 2020, 'PSA 9', 'V', NOW(), NOW()),
('Sylveon GX PSA 10', 320.00, 'Pokemon', 'Pokémon', 'Guardians Rising', 2017, 'PSA 10', 'GX', NOW(), NOW()),
('Umbreon GX PSA 9', 280.00, 'Pokemon', 'Pokémon', 'Sun & Moon', 2017, 'PSA 9', 'GX', NOW(), NOW()),
('Espeon GX PSA 8', 180.00, 'Pokemon', 'Pokémon', 'Sun & Moon', 2017, 'PSA 8', 'GX', NOW(), NOW()),

-- Eeveelutions
('Vaporeon PSA 9', 120.00, 'Pokemon', 'Pokémon', 'Jungle', 1999, 'PSA 9', 'Holo Rare', NOW(), NOW()),
('Jolteon PSA 8', 95.00, 'Pokemon', 'Pokémon', 'Jungle', 1999, 'PSA 8', 'Holo Rare', NOW(), NOW()),
('Flareon PSA 9', 110.00, 'Pokemon', 'Pokémon', 'Jungle', 1999, 'PSA 9', 'Holo Rare', NOW(), NOW()),
('Leafeon GX PSA 10', 220.00, 'Pokemon', 'Pokémon', 'Guardians Rising', 2017, 'PSA 10', 'GX', NOW(), NOW()),
('Glaceon GX PSA 9', 190.00, 'Pokemon', 'Pokémon', 'Guardians Rising', 2017, 'PSA 9', 'GX', NOW(), NOW()),

-- Legendary Pokemon
('Mew PSA 10', 850.00, 'Pokemon', 'Pokémon', 'Base Set', 1999, 'PSA 10', 'Holo Rare', NOW(), NOW()),
('Lugia PSA 9', 420.00, 'Pokemon', 'Pokémon', 'Neo Genesis', 2000, 'PSA 9', 'Holo Rare', NOW(), NOW()),
('Ho-Oh PSA 8', 280.00, 'Pokemon', 'Pokémon', 'Neo Revelation', 2001, 'PSA 8', 'Holo Rare', NOW(), NOW()),
('Rayquaza GX PSA 10', 380.00, 'Pokemon', 'Pokémon', 'Celestial Storm', 2018, 'PSA 10', 'GX', NOW(), NOW()),
('Giratina PSA 9', 320.00, 'Pokemon', 'Pokémon', 'Platinum', 2009, 'PSA 9', 'Holo Rare', NOW(), NOW()),

-- Popular Pokemon
('Snorlax PSA 8', 180.00, 'Pokemon', 'Pokémon', 'Jungle', 1999, 'PSA 8', 'Holo Rare', NOW(), NOW()),
('Gyarados PSA 9', 220.00, 'Pokemon', 'Pokémon', 'Base Set', 1999, 'PSA 9', 'Holo Rare', NOW(), NOW()),
('Dragonite PSA 8', 160.00, 'Pokemon', 'Pokémon', 'Fossil', 1999, 'PSA 8', 'Holo Rare', NOW(), NOW()),
('Tyranitar PSA 9', 280.00, 'Pokemon', 'Pokémon', 'Neo Discovery', 2001, 'PSA 9', 'Holo Rare', NOW(), NOW()),
('Metagross PSA 8', 140.00, 'Pokemon', 'Pokémon', 'Deoxys', 2005, 'PSA 8', 'Holo Rare', NOW(), NOW()),

-- Modern Pokemon
('Salamence GX PSA 10', 260.00, 'Pokemon', 'Pokémon', 'Celestial Storm', 2018, 'PSA 10', 'GX', NOW(), NOW()),
('Garchomp PSA 9', 180.00, 'Pokemon', 'Pokémon', 'Mysterious Treasures', 2007, 'PSA 9', 'Holo Rare', NOW(), NOW()),
('Lucario GX PSA 9', 220.00, 'Pokemon', 'Pokémon', 'Forbidden Light', 2018, 'PSA 9', 'GX', NOW(), NOW()),
('Gengar PSA 8', 150.00, 'Pokemon', 'Pokémon', 'Fossil', 1999, 'PSA 8', 'Holo Rare', NOW(), NOW()),
('Alakazam PSA 9', 190.00, 'Pokemon', 'Pokémon', 'Base Set', 1999, 'PSA 9', 'Holo Rare', NOW(), NOW());

-- Add 25 Popular Football Cards
INSERT INTO cards (name, latest_price, category, card_type, set_name, year, grading, rarity, created_at, last_updated) VALUES
-- Tom Brady Cards
('Tom Brady Rookie PSA 10', 8500.00, 'Sports', 'Football', '2000 Playoff Contenders', 2000, 'PSA 10', 'Rookie', NOW(), NOW()),
('Tom Brady 2000 Bowman PSA 9', 3200.00, 'Sports', 'Football', '2000 Bowman', 2000, 'PSA 9', 'Rookie', NOW(), NOW()),
('Tom Brady 2000 Topps PSA 10', 2800.00, 'Sports', 'Football', '2000 Topps', 2000, 'PSA 10', 'Rookie', NOW(), NOW()),
('Tom Brady 2000 Upper Deck PSA 9', 2400.00, 'Sports', 'Football', '2000 Upper Deck', 2000, 'PSA 9', 'Rookie', NOW(), NOW()),
('Tom Brady 2000 Stadium Club PSA 8', 1800.00, 'Sports', 'Football', '2000 Stadium Club', 2000, 'PSA 8', 'Rookie', NOW(), NOW()),

-- Patrick Mahomes Cards
('Patrick Mahomes Rookie PSA 10', 4200.00, 'Sports', 'Football', '2017 Panini Prizm', 2017, 'PSA 10', 'Rookie', NOW(), NOW()),
('Patrick Mahomes 2017 Optic PSA 9', 2800.00, 'Sports', 'Football', '2017 Donruss Optic', 2017, 'PSA 9', 'Rookie', NOW(), NOW()),
('Patrick Mahomes 2017 Select PSA 10', 3200.00, 'Sports', 'Football', '2017 Select', 2017, 'PSA 10', 'Rookie', NOW(), NOW()),
('Patrick Mahomes 2017 Contenders PSA 9', 2400.00, 'Sports', 'Football', '2017 Playoff Contenders', 2017, 'PSA 9', 'Rookie', NOW(), NOW()),
('Patrick Mahomes 2017 National Treasures PSA 8', 1800.00, 'Sports', 'Football', '2017 National Treasures', 2017, 'PSA 8', 'Rookie', NOW(), NOW()),

-- Joe Burrow Cards
('Joe Burrow Rookie PSA 10', 1800.00, 'Sports', 'Football', '2020 Panini Prizm', 2020, 'PSA 10', 'Rookie', NOW(), NOW()),
('Joe Burrow 2020 Optic PSA 9', 1200.00, 'Sports', 'Football', '2020 Donruss Optic', 2020, 'PSA 9', 'Rookie', NOW(), NOW()),
('Joe Burrow 2020 Select PSA 10', 1400.00, 'Sports', 'Football', '2020 Select', 2020, 'PSA 10', 'Rookie', NOW(), NOW()),
('Joe Burrow 2020 Contenders PSA 9', 950.00, 'Sports', 'Football', '2020 Playoff Contenders', 2020, 'PSA 9', 'Rookie', NOW(), NOW()),
('Joe Burrow 2020 Mosaic PSA 8', 750.00, 'Sports', 'Football', '2020 Mosaic', 2020, 'PSA 8', 'Rookie', NOW(), NOW()),

-- Josh Allen Cards
('Josh Allen Rookie PSA 10', 850.00, 'Sports', 'Football', '2018 Panini Prizm', 2018, 'PSA 10', 'Rookie', NOW(), NOW()),
('Josh Allen 2018 Optic PSA 9', 650.00, 'Sports', 'Football', '2018 Donruss Optic', 2018, 'PSA 9', 'Rookie', NOW(), NOW()),
('Josh Allen 2018 Select PSA 10', 750.00, 'Sports', 'Football', '2018 Select', 2018, 'PSA 10', 'Rookie', NOW(), NOW()),
('Josh Allen 2018 Contenders PSA 9', 550.00, 'Sports', 'Football', '2018 Playoff Contenders', 2018, 'PSA 9', 'Rookie', NOW(), NOW()),
('Josh Allen 2018 Mosaic PSA 8', 450.00, 'Sports', 'Football', '2018 Mosaic', 2018, 'PSA 8', 'Rookie', NOW(), NOW()),

-- Justin Herbert Cards
('Justin Herbert Rookie PSA 10', 950.00, 'Sports', 'Football', '2020 Panini Prizm', 2020, 'PSA 10', 'Rookie', NOW(), NOW()),
('Justin Herbert 2020 Optic PSA 9', 750.00, 'Sports', 'Football', '2020 Donruss Optic', 2020, 'PSA 9', 'Rookie', NOW(), NOW()),
('Justin Herbert 2020 Select PSA 10', 850.00, 'Sports', 'Football', '2020 Select', 2020, 'PSA 10', 'Rookie', NOW(), NOW()),
('Justin Herbert 2020 Contenders PSA 9', 650.00, 'Sports', 'Football', '2020 Playoff Contenders', 2020, 'PSA 9', 'Rookie', NOW(), NOW()),
('Justin Herbert 2020 Mosaic PSA 8', 550.00, 'Sports', 'Football', '2020 Mosaic', 2020, 'PSA 8', 'Rookie', NOW(), NOW());

-- Add 25 Popular Basketball Cards
INSERT INTO cards (name, latest_price, category, card_type, set_name, year, grading, rarity, created_at, last_updated) VALUES
-- Michael Jordan Cards
('Michael Jordan Rookie PSA 10', 15000.00, 'Sports', 'Basketball', '1986 Fleer', 1986, 'PSA 10', 'Rookie', NOW(), NOW()),
('Michael Jordan 1986 Fleer PSA 9', 8500.00, 'Sports', 'Basketball', '1986 Fleer', 1986, 'PSA 9', 'Rookie', NOW(), NOW()),
('Michael Jordan 1986 Fleer PSA 8', 4200.00, 'Sports', 'Basketball', '1986 Fleer', 1986, 'PSA 8', 'Rookie', NOW(), NOW()),
('Michael Jordan 1986 Star PSA 10', 12000.00, 'Sports', 'Basketball', '1986 Star', 1986, 'PSA 10', 'Rookie', NOW(), NOW()),
('Michael Jordan 1986 Star PSA 9', 6800.00, 'Sports', 'Basketball', '1986 Star', 1986, 'PSA 9', 'Rookie', NOW(), NOW()),

-- LeBron James Cards
('LeBron James Rookie PSA 10', 8500.00, 'Sports', 'Basketball', '2003 Topps Chrome', 2003, 'PSA 10', 'Rookie', NOW(), NOW()),
('LeBron James 2003 Topps PSA 9', 4800.00, 'Sports', 'Basketball', '2003 Topps', 2003, 'PSA 9', 'Rookie', NOW(), NOW()),
('LeBron James 2003 Upper Deck PSA 10', 7200.00, 'Sports', 'Basketball', '2003 Upper Deck', 2003, 'PSA 10', 'Rookie', NOW(), NOW()),
('LeBron James 2003 Bowman PSA 9', 3800.00, 'Sports', 'Basketball', '2003 Bowman', 2003, 'PSA 9', 'Rookie', NOW(), NOW()),
('LeBron James 2003 Fleer PSA 8', 2200.00, 'Sports', 'Basketball', '2003 Fleer', 2003, 'PSA 8', 'Rookie', NOW(), NOW()),

-- Kobe Bryant Cards
('Kobe Bryant Rookie PSA 10', 4200.00, 'Sports', 'Basketball', '1996 Topps Chrome', 1996, 'PSA 10', 'Rookie', NOW(), NOW()),
('Kobe Bryant 1996 Topps PSA 9', 2800.00, 'Sports', 'Basketball', '1996 Topps', 1996, 'PSA 9', 'Rookie', NOW(), NOW()),
('Kobe Bryant 1996 Upper Deck PSA 10', 3800.00, 'Sports', 'Basketball', '1996 Upper Deck', 1996, 'PSA 10', 'Rookie', NOW(), NOW()),
('Kobe Bryant 1996 Fleer PSA 9', 2200.00, 'Sports', 'Basketball', '1996 Fleer', 1996, 'PSA 9', 'Rookie', NOW(), NOW()),
('Kobe Bryant 1996 Skybox PSA 8', 1500.00, 'Sports', 'Basketball', '1996 Skybox', 1996, 'PSA 8', 'Rookie', NOW(), NOW()),

-- Giannis Antetokounmpo Cards
('Giannis Antetokounmpo Rookie PSA 10', 1800.00, 'Sports', 'Basketball', '2013 Panini Prizm', 2013, 'PSA 10', 'Rookie', NOW(), NOW()),
('Giannis Antetokounmpo 2013 Select PSA 9', 1200.00, 'Sports', 'Basketball', '2013 Select', 2013, 'PSA 9', 'Rookie', NOW(), NOW()),
('Giannis Antetokounmpo 2013 Optic PSA 10', 1400.00, 'Sports', 'Basketball', '2013 Donruss Optic', 2013, 'PSA 10', 'Rookie', NOW(), NOW()),
('Giannis Antetokounmpo 2013 Contenders PSA 9', 950.00, 'Sports', 'Basketball', '2013 Playoff Contenders', 2013, 'PSA 9', 'Rookie', NOW(), NOW()),
('Giannis Antetokounmpo 2013 Mosaic PSA 8', 750.00, 'Sports', 'Basketball', '2013 Mosaic', 2013, 'PSA 8', 'Rookie', NOW(), NOW()),

-- Stephen Curry Cards
('Stephen Curry Rookie PSA 10', 2200.00, 'Sports', 'Basketball', '2009 Topps Chrome', 2009, 'PSA 10', 'Rookie', NOW(), NOW()),
('Stephen Curry 2009 Topps PSA 9', 1400.00, 'Sports', 'Basketball', '2009 Topps', 2009, 'PSA 9', 'Rookie', NOW(), NOW()),
('Stephen Curry 2009 Upper Deck PSA 10', 1800.00, 'Sports', 'Basketball', '2009 Upper Deck', 2009, 'PSA 10', 'Rookie', NOW(), NOW()),
('Stephen Curry 2009 Bowman PSA 9', 1100.00, 'Sports', 'Basketball', '2009 Bowman', 2009, 'PSA 9', 'Rookie', NOW(), NOW()),
('Stephen Curry 2009 Fleer PSA 8', 850.00, 'Sports', 'Basketball', '2009 Fleer', 2009, 'PSA 8', 'Rookie', NOW(), NOW());

-- Show results
SELECT 
  'Total Cards Added' as summary,
  COUNT(*) as count
FROM cards;

SELECT 
  category,
  COUNT(*) as count,
  AVG(latest_price) as avg_price
FROM cards 
GROUP BY category 
ORDER BY avg_price DESC; 