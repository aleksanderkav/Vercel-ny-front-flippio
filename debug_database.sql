-- Debug Database - Check what's actually stored
-- Run this in your Supabase SQL Editor

-- Check the specific card that was just updated
SELECT '=== CHARIZARD VMAX PSA 10 DATA ===' as info;
SELECT 
    id,
    name,
    latest_price,
    image_url,
    category,
    card_type,
    set_name,
    year,
    grading,
    rarity,
    serial_number,
    price_entries_count,
    last_updated,
    created_at
FROM cards 
WHERE name ILIKE '%charizard vmax psa 10%'
ORDER BY last_updated DESC;

-- Check all cards with image_url
SELECT '=== CARDS WITH IMAGE_URL ===' as info;
SELECT 
    id,
    name,
    latest_price,
    image_url,
    last_updated
FROM cards 
WHERE image_url IS NOT NULL
ORDER BY last_updated DESC
LIMIT 10;

-- Check price_entries for the Charizard card
SELECT '=== PRICE ENTRIES FOR CHARIZARD ===' as info;
SELECT 
    pe.id,
    pe.card_id,
    pe.price,
    pe.source,
    pe.timestamp,
    c.name as card_name
FROM price_entries pe
JOIN cards c ON pe.card_id = c.id
WHERE c.name ILIKE '%charizard vmax psa 10%'
ORDER BY pe.timestamp DESC
LIMIT 5;

-- Check table structure
SELECT '=== CARDS TABLE STRUCTURE ===' as info;
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'cards' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check if image_url field exists and has data
SELECT '=== IMAGE_URL FIELD STATUS ===' as info;
SELECT 
    COUNT(*) as total_cards,
    COUNT(image_url) as cards_with_images,
    COUNT(CASE WHEN image_url IS NOT NULL AND image_url != '' THEN 1 END) as cards_with_valid_images
FROM cards; 