-- Clear all cards and start fresh
-- WARNING: This will delete ALL your cards!

-- First, delete all price entries (due to foreign key constraints)
DELETE FROM price_entries;

-- Then delete all cards
DELETE FROM cards;

-- Reset the sequence (if using auto-increment)
-- ALTER SEQUENCE cards_id_seq RESTART WITH 1;

-- Show that tables are empty
SELECT 'Cards table is now empty' as status;
SELECT COUNT(*) as remaining_cards FROM cards;
SELECT COUNT(*) as remaining_price_entries FROM price_entries; 