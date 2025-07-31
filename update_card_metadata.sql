-- Update card metadata based on card names and patterns
-- This script will populate missing set_name, year, grading, and rarity fields

-- Update grading from card names (PSA, BGS, etc.)
UPDATE cards 
SET grading = 
  CASE 
    WHEN name ILIKE '%PSA 10%' THEN 'PSA 10'
    WHEN name ILIKE '%PSA 9%' THEN 'PSA 9'
    WHEN name ILIKE '%PSA 8%' THEN 'PSA 8'
    WHEN name ILIKE '%PSA 7%' THEN 'PSA 7'
    WHEN name ILIKE '%PSA 6%' THEN 'PSA 6'
    WHEN name ILIKE '%PSA 5%' THEN 'PSA 5'
    WHEN name ILIKE '%PSA 4%' THEN 'PSA 4'
    WHEN name ILIKE '%PSA 3%' THEN 'PSA 3'
    WHEN name ILIKE '%PSA 2%' THEN 'PSA 2'
    WHEN name ILIKE '%PSA 1%' THEN 'PSA 1'
    WHEN name ILIKE '%BGS 10%' THEN 'BGS 10'
    WHEN name ILIKE '%BGS 9%' THEN 'BGS 9'
    WHEN name ILIKE '%BGS 8%' THEN 'BGS 8'
    WHEN name ILIKE '%CGC 10%' THEN 'CGC 10'
    WHEN name ILIKE '%CGC 9%' THEN 'CGC 9'
    WHEN name ILIKE '%CGC 8%' THEN 'CGC 8'
    ELSE grading
  END
WHERE grading IS NULL OR grading = 'Ungraded';

-- Update set names based on card names and common patterns
UPDATE cards 
SET set_name = 
  CASE 
    WHEN name ILIKE '%Base Set%' OR name ILIKE '%Charizard%' AND name ILIKE '%PSA%' THEN 'Base Set'
    WHEN name ILIKE '%Jungle%' THEN 'Jungle'
    WHEN name ILIKE '%Fossil%' THEN 'Fossil'
    WHEN name ILIKE '%Team Rocket%' THEN 'Team Rocket'
    WHEN name ILIKE '%Gym Heroes%' THEN 'Gym Heroes'
    WHEN name ILIKE '%Gym Challenge%' THEN 'Gym Challenge'
    WHEN name ILIKE '%Neo Genesis%' THEN 'Neo Genesis'
    WHEN name ILIKE '%Neo Discovery%' THEN 'Neo Discovery'
    WHEN name ILIKE '%Neo Revelation%' THEN 'Neo Revelation'
    WHEN name ILIKE '%Neo Destiny%' THEN 'Neo Destiny'
    WHEN name ILIKE '%Legendary Collection%' THEN 'Legendary Collection'
    WHEN name ILIKE '%Expedition%' THEN 'Expedition'
    WHEN name ILIKE '%Aquapolis%' THEN 'Aquapolis'
    WHEN name ILIKE '%Skyridge%' THEN 'Skyridge'
    WHEN name ILIKE '%Ruby & Sapphire%' THEN 'Ruby & Sapphire'
    WHEN name ILIKE '%Sandstorm%' THEN 'Sandstorm'
    WHEN name ILIKE '%Dragon%' THEN 'Dragon'
    WHEN name ILIKE '%Team Magma vs Team Aqua%' THEN 'Team Magma vs Team Aqua'
    WHEN name ILIKE '%Hidden Legends%' THEN 'Hidden Legends'
    WHEN name ILIKE '%FireRed & LeafGreen%' THEN 'FireRed & LeafGreen'
    WHEN name ILIKE '%Team Rocket Returns%' THEN 'Team Rocket Returns'
    WHEN name ILIKE '%Deoxys%' THEN 'Deoxys'
    WHEN name ILIKE '%Emerald%' THEN 'Emerald'
    WHEN name ILIKE '%Unseen Forces%' THEN 'Unseen Forces'
    WHEN name ILIKE '%Delta Species%' THEN 'Delta Species'
    WHEN name ILIKE '%Legend Maker%' THEN 'Legend Maker'
    WHEN name ILIKE '%Holon Phantoms%' THEN 'Holon Phantoms'
    WHEN name ILIKE '%Crystal Guardians%' THEN 'Crystal Guardians'
    WHEN name ILIKE '%Dragon Frontiers%' THEN 'Dragon Frontiers'
    WHEN name ILIKE '%Power Keepers%' THEN 'Power Keepers'
    WHEN name ILIKE '%Diamond & Pearl%' THEN 'Diamond & Pearl'
    WHEN name ILIKE '%Mysterious Treasures%' THEN 'Mysterious Treasures'
    WHEN name ILIKE '%Secret Wonders%' THEN 'Secret Wonders'
    WHEN name ILIKE '%Great Encounters%' THEN 'Great Encounters'
    WHEN name ILIKE '%Majestic Dawn%' THEN 'Majestic Dawn'
    WHEN name ILIKE '%Legends Awakened%' THEN 'Legends Awakened'
    WHEN name ILIKE '%Stormfront%' THEN 'Stormfront'
    WHEN name ILIKE '%Platinum%' THEN 'Platinum'
    WHEN name ILIKE '%Rising Rivals%' THEN 'Rising Rivals'
    WHEN name ILIKE '%Supreme Victors%' THEN 'Supreme Victors'
    WHEN name ILIKE '%Arceus%' THEN 'Arceus'
    WHEN name ILIKE '%HeartGold & SoulSilver%' THEN 'HeartGold & SoulSilver'
    WHEN name ILIKE '%Unleashed%' THEN 'Unleashed'
    WHEN name ILIKE '%Undaunted%' THEN 'Undaunted'
    WHEN name ILIKE '%Triumphant%' THEN 'Triumphant'
    WHEN name ILIKE '%Call of Legends%' THEN 'Call of Legends'
    WHEN name ILIKE '%Black & White%' THEN 'Black & White'
    WHEN name ILIKE '%Emerging Powers%' THEN 'Emerging Powers'
    WHEN name ILIKE '%Noble Victories%' THEN 'Noble Victories'
    WHEN name ILIKE '%Next Destinies%' THEN 'Next Destinies'
    WHEN name ILIKE '%Dark Explorers%' THEN 'Dark Explorers'
    WHEN name ILIKE '%Dragons Exalted%' THEN 'Dragons Exalted'
    WHEN name ILIKE '%Boundaries Crossed%' THEN 'Boundaries Crossed'
    WHEN name ILIKE '%Plasma Storm%' THEN 'Plasma Storm'
    WHEN name ILIKE '%Plasma Freeze%' THEN 'Plasma Freeze'
    WHEN name ILIKE '%Plasma Blast%' THEN 'Plasma Blast'
    WHEN name ILIKE '%Legendary Treasures%' THEN 'Legendary Treasures'
    WHEN name ILIKE '%XY%' THEN 'XY'
    WHEN name ILIKE '%Flashfire%' THEN 'Flashfire'
    WHEN name ILIKE '%Furious Fists%' THEN 'Furious Fists'
    WHEN name ILIKE '%Phantom Forces%' THEN 'Phantom Forces'
    WHEN name ILIKE '%Primal Clash%' THEN 'Primal Clash'
    WHEN name ILIKE '%Double Crisis%' THEN 'Double Crisis'
    WHEN name ILIKE '%Roaring Skies%' THEN 'Roaring Skies'
    WHEN name ILIKE '%Ancient Origins%' THEN 'Ancient Origins'
    WHEN name ILIKE '%BREAKthrough%' THEN 'BREAKthrough'
    WHEN name ILIKE '%BREAKpoint%' THEN 'BREAKpoint'
    WHEN name ILIKE '%Generations%' THEN 'Generations'
    WHEN name ILIKE '%Fates Collide%' THEN 'Fates Collide'
    WHEN name ILIKE '%Steam Siege%' THEN 'Steam Siege'
    WHEN name ILIKE '%Evolutions%' THEN 'Evolutions'
    WHEN name ILIKE '%Sun & Moon%' THEN 'Sun & Moon'
    WHEN name ILIKE '%Guardians Rising%' THEN 'Guardians Rising'
    WHEN name ILIKE '%Burning Shadows%' THEN 'Burning Shadows'
    WHEN name ILIKE '%Shining Legends%' THEN 'Shining Legends'
    WHEN name ILIKE '%Crimson Invasion%' THEN 'Crimson Invasion'
    WHEN name ILIKE '%Ultra Prism%' THEN 'Ultra Prism'
    WHEN name ILIKE '%Forbidden Light%' THEN 'Forbidden Light'
    WHEN name ILIKE '%Celestial Storm%' THEN 'Celestial Storm'
    WHEN name ILIKE '%Dragon Majesty%' THEN 'Dragon Majesty'
    WHEN name ILIKE '%Lost Thunder%' THEN 'Lost Thunder'
    WHEN name ILIKE '%Team Up%' THEN 'Team Up'
    WHEN name ILIKE '%Detective Pikachu%' THEN 'Detective Pikachu'
    WHEN name ILIKE '%Unbroken Bonds%' THEN 'Unbroken Bonds'
    WHEN name ILIKE '%Unified Minds%' THEN 'Unified Minds'
    WHEN name ILIKE '%Hidden Fates%' THEN 'Hidden Fates'
    WHEN name ILIKE '%Cosmic Eclipse%' THEN 'Cosmic Eclipse'
    WHEN name ILIKE '%Sword & Shield%' THEN 'Sword & Shield'
    WHEN name ILIKE '%Rebel Clash%' THEN 'Rebel Clash'
    WHEN name ILIKE '%Darkness Ablaze%' THEN 'Darkness Ablaze'
    WHEN name ILIKE '%Champions Path%' THEN 'Champions Path'
    WHEN name ILIKE '%Vivid Voltage%' THEN 'Vivid Voltage'
    WHEN name ILIKE '%Shining Fates%' THEN 'Shining Fates'
    WHEN name ILIKE '%Battle Styles%' THEN 'Battle Styles'
    WHEN name ILIKE '%Chilling Reign%' THEN 'Chilling Reign'
    WHEN name ILIKE '%Evolving Skies%' THEN 'Evolving Skies'
    WHEN name ILIKE '%Celebrations%' THEN 'Celebrations'
    WHEN name ILIKE '%Fusion Strike%' THEN 'Fusion Strike'
    WHEN name ILIKE '%Brilliant Stars%' THEN 'Brilliant Stars'
    WHEN name ILIKE '%Astral Radiance%' THEN 'Astral Radiance'
    WHEN name ILIKE '%Pokemon GO%' THEN 'Pokemon GO'
    WHEN name ILIKE '%Lost Origin%' THEN 'Lost Origin'
    WHEN name ILIKE '%Silver Tempest%' THEN 'Silver Tempest'
    WHEN name ILIKE '%Crown Zenith%' THEN 'Crown Zenith'
    WHEN name ILIKE '%Scarlet & Violet%' THEN 'Scarlet & Violet'
    WHEN name ILIKE '%Paldea Evolved%' THEN 'Paldea Evolved'
    WHEN name ILIKE '%Obsidian Flames%' THEN 'Obsidian Flames'
    WHEN name ILIKE '%151%' THEN '151'
    WHEN name ILIKE '%Paradox Rift%' THEN 'Paradox Rift'
    WHEN name ILIKE '%Paldean Fates%' THEN 'Paldean Fates'
    WHEN name ILIKE '%Temporal Forces%' THEN 'Temporal Forces'
    WHEN name ILIKE '%Twilight Masquerade%' THEN 'Twilight Masquerade'
    ELSE set_name
  END
WHERE set_name IS NULL;

-- Update years based on set names
UPDATE cards 
SET year = 
  CASE 
    WHEN set_name = 'Base Set' THEN 1999
    WHEN set_name = 'Jungle' THEN 1999
    WHEN set_name = 'Fossil' THEN 1999
    WHEN set_name = 'Team Rocket' THEN 2000
    WHEN set_name = 'Gym Heroes' THEN 2000
    WHEN set_name = 'Gym Challenge' THEN 2000
    WHEN set_name = 'Neo Genesis' THEN 2000
    WHEN set_name = 'Neo Discovery' THEN 2001
    WHEN set_name = 'Neo Revelation' THEN 2001
    WHEN set_name = 'Neo Destiny' THEN 2002
    WHEN set_name = 'Legendary Collection' THEN 2002
    WHEN set_name = 'Expedition' THEN 2002
    WHEN set_name = 'Aquapolis' THEN 2003
    WHEN set_name = 'Skyridge' THEN 2003
    WHEN set_name = 'Ruby & Sapphire' THEN 2003
    WHEN set_name = 'Sandstorm' THEN 2003
    WHEN set_name = 'Dragon' THEN 2003
    WHEN set_name = 'Team Magma vs Team Aqua' THEN 2004
    WHEN set_name = 'Hidden Legends' THEN 2004
    WHEN set_name = 'FireRed & LeafGreen' THEN 2004
    WHEN set_name = 'Team Rocket Returns' THEN 2004
    WHEN set_name = 'Deoxys' THEN 2005
    WHEN set_name = 'Emerald' THEN 2005
    WHEN set_name = 'Unseen Forces' THEN 2005
    WHEN set_name = 'Delta Species' THEN 2005
    WHEN set_name = 'Legend Maker' THEN 2006
    WHEN set_name = 'Holon Phantoms' THEN 2006
    WHEN set_name = 'Crystal Guardians' THEN 2006
    WHEN set_name = 'Dragon Frontiers' THEN 2006
    WHEN set_name = 'Power Keepers' THEN 2007
    WHEN set_name = 'Diamond & Pearl' THEN 2007
    WHEN set_name = 'Mysterious Treasures' THEN 2007
    WHEN set_name = 'Secret Wonders' THEN 2007
    WHEN set_name = 'Great Encounters' THEN 2008
    WHEN set_name = 'Majestic Dawn' THEN 2008
    WHEN set_name = 'Legends Awakened' THEN 2008
    WHEN set_name = 'Stormfront' THEN 2008
    WHEN set_name = 'Platinum' THEN 2009
    WHEN set_name = 'Rising Rivals' THEN 2009
    WHEN set_name = 'Supreme Victors' THEN 2009
    WHEN set_name = 'Arceus' THEN 2009
    WHEN set_name = 'HeartGold & SoulSilver' THEN 2010
    WHEN set_name = 'Unleashed' THEN 2010
    WHEN set_name = 'Undaunted' THEN 2010
    WHEN set_name = 'Triumphant' THEN 2010
    WHEN set_name = 'Call of Legends' THEN 2011
    WHEN set_name = 'Black & White' THEN 2011
    WHEN set_name = 'Emerging Powers' THEN 2011
    WHEN set_name = 'Noble Victories' THEN 2011
    WHEN set_name = 'Next Destinies' THEN 2012
    WHEN set_name = 'Dark Explorers' THEN 2012
    WHEN set_name = 'Dragons Exalted' THEN 2012
    WHEN set_name = 'Boundaries Crossed' THEN 2012
    WHEN set_name = 'Plasma Storm' THEN 2013
    WHEN set_name = 'Plasma Freeze' THEN 2013
    WHEN set_name = 'Plasma Blast' THEN 2013
    WHEN set_name = 'Legendary Treasures' THEN 2013
    WHEN set_name = 'XY' THEN 2014
    WHEN set_name = 'Flashfire' THEN 2014
    WHEN set_name = 'Furious Fists' THEN 2014
    WHEN set_name = 'Phantom Forces' THEN 2014
    WHEN set_name = 'Primal Clash' THEN 2015
    WHEN set_name = 'Double Crisis' THEN 2015
    WHEN set_name = 'Roaring Skies' THEN 2015
    WHEN set_name = 'Ancient Origins' THEN 2015
    WHEN set_name = 'BREAKthrough' THEN 2015
    WHEN set_name = 'BREAKpoint' THEN 2016
    WHEN set_name = 'Generations' THEN 2016
    WHEN set_name = 'Fates Collide' THEN 2016
    WHEN set_name = 'Steam Siege' THEN 2016
    WHEN set_name = 'Evolutions' THEN 2016
    WHEN set_name = 'Sun & Moon' THEN 2017
    WHEN set_name = 'Guardians Rising' THEN 2017
    WHEN set_name = 'Burning Shadows' THEN 2017
    WHEN set_name = 'Shining Legends' THEN 2017
    WHEN set_name = 'Crimson Invasion' THEN 2017
    WHEN set_name = 'Ultra Prism' THEN 2018
    WHEN set_name = 'Forbidden Light' THEN 2018
    WHEN set_name = 'Celestial Storm' THEN 2018
    WHEN set_name = 'Dragon Majesty' THEN 2018
    WHEN set_name = 'Lost Thunder' THEN 2018
    WHEN set_name = 'Team Up' THEN 2019
    WHEN set_name = 'Detective Pikachu' THEN 2019
    WHEN set_name = 'Unbroken Bonds' THEN 2019
    WHEN set_name = 'Unified Minds' THEN 2019
    WHEN set_name = 'Hidden Fates' THEN 2019
    WHEN set_name = 'Cosmic Eclipse' THEN 2019
    WHEN set_name = 'Sword & Shield' THEN 2020
    WHEN set_name = 'Rebel Clash' THEN 2020
    WHEN set_name = 'Darkness Ablaze' THEN 2020
    WHEN set_name = 'Champions Path' THEN 2020
    WHEN set_name = 'Vivid Voltage' THEN 2020
    WHEN set_name = 'Shining Fates' THEN 2021
    WHEN set_name = 'Battle Styles' THEN 2021
    WHEN set_name = 'Chilling Reign' THEN 2021
    WHEN set_name = 'Evolving Skies' THEN 2021
    WHEN set_name = 'Celebrations' THEN 2021
    WHEN set_name = 'Fusion Strike' THEN 2021
    WHEN set_name = 'Brilliant Stars' THEN 2022
    WHEN set_name = 'Astral Radiance' THEN 2022
    WHEN set_name = 'Pokemon GO' THEN 2022
    WHEN set_name = 'Lost Origin' THEN 2022
    WHEN set_name = 'Silver Tempest' THEN 2022
    WHEN set_name = 'Crown Zenith' THEN 2023
    WHEN set_name = 'Scarlet & Violet' THEN 2023
    WHEN set_name = 'Paldea Evolved' THEN 2023
    WHEN set_name = 'Obsidian Flames' THEN 2023
    WHEN set_name = '151' THEN 2023
    WHEN set_name = 'Paradox Rift' THEN 2023
    WHEN set_name = 'Paldean Fates' THEN 2024
    WHEN set_name = 'Temporal Forces' THEN 2024
    WHEN set_name = 'Twilight Masquerade' THEN 2024
    ELSE year
  END
WHERE year IS NULL;

-- Update rarity based on card names and common patterns
UPDATE cards 
SET rarity = 
  CASE 
    WHEN name ILIKE '%Holo%' OR name ILIKE '%Holographic%' THEN 'Holo Rare'
    WHEN name ILIKE '%Secret%' OR name ILIKE '%Rainbow%' THEN 'Secret Rare'
    WHEN name ILIKE '%Ultra%' THEN 'Ultra Rare'
    WHEN name ILIKE '%Full Art%' THEN 'Full Art'
    WHEN name ILIKE '%VMAX%' THEN 'VMAX'
    WHEN name ILIKE '%V%' AND name NOT ILIKE '%VMAX%' THEN 'V'
    WHEN name ILIKE '%GX%' THEN 'GX'
    WHEN name ILIKE '%EX%' THEN 'EX'
    WHEN name ILIKE '%BREAK%' THEN 'BREAK'
    WHEN name ILIKE '%Prime%' THEN 'Prime'
    WHEN name ILIKE '%Legend%' THEN 'Legend'
    WHEN name ILIKE '%Lv.X%' THEN 'Lv.X'
    WHEN name ILIKE '%Star%' THEN 'Star'
    WHEN name ILIKE '%Crystal%' THEN 'Crystal'
    WHEN name ILIKE '%Shining%' THEN 'Shining'
    WHEN name ILIKE '%Gold Star%' THEN 'Gold Star'
    WHEN name ILIKE '%Common%' THEN 'Common'
    WHEN name ILIKE '%Uncommon%' THEN 'Uncommon'
    WHEN name ILIKE '%Rare%' THEN 'Rare'
    ELSE 'Rare'
  END
WHERE rarity IS NULL OR rarity = 'Unknown';

-- Show the results
SELECT 
  name,
  set_name,
  year,
  grading,
  rarity,
  latest_price
FROM cards 
ORDER BY created_at DESC 
LIMIT 10; 