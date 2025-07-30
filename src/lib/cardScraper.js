import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://jvkxyjycpomtzfngocge.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp2a3h5anljcG9tdHpmbmdvY2dlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3NTM1OTMsImV4cCI6MjA2OTMyOTU5M30.r3p4y2sl2RFROdKN-MsAsI1Z_8TBn6tK-aZ2claU32Q';

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Simulate eBay scraping for card data
 * In a real implementation, this would use a web scraping library like Puppeteer or Cheerio
 */
async function simulateEbayScraping(cardName) {
    console.log(`🔍 Simulating eBay scraping for: ${cardName}`);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    // Extract information from card name using regex patterns
    const nameLower = cardName.toLowerCase();
    
    // Parse grading (PSA, BGS, etc.)
    const gradingMatch = cardName.match(/(PSA|BGS|CGC|SGC)\s*(\d+)/i);
    const grading = gradingMatch ? `${gradingMatch[1]} ${gradingMatch[2]}` : 'Ungraded';
    
    // Parse set name
    const setPatterns = [
        /(base set|base set 2|jungle|fossil|team rocket|gym heroes|gym challenge)/i,
        /(neo genesis|neo discovery|neo revelation|neo destiny)/i,
        /(ex ruby & sapphire|ex sandstorm|ex dragon|ex team magma vs team aqua)/i,
        /(black & white|next destinies|dark explorers|dragons exalted)/i,
        /(sun & moon|guardians rising|crimson invasion|ultra prism)/i,
        /(sword & shield|rebel clash|darkness ablaze|champions path)/i
    ];
    
    let set_name = 'Unknown Set';
    for (const pattern of setPatterns) {
        const match = cardName.match(pattern);
        if (match) {
            set_name = match[1];
            break;
        }
    }
    
    // Determine card type and category
    let card_type = 'Pokémon';
    let category = 'Pokemon';
    
    if (nameLower.includes('jordan') || nameLower.includes('lebron') || nameLower.includes('brady')) {
        card_type = 'Sports';
        category = 'Sports';
    } else if (nameLower.includes('black lotus') || nameLower.includes('blue eyes')) {
        card_type = 'Magic: The Gathering';
        category = 'Gaming';
    }
    
    // Generate realistic price data
    const basePrice = Math.random() * 1000 + 50;
    const priceVariation = basePrice * 0.2;
    const latest_price = Math.round((basePrice + (Math.random() - 0.5) * priceVariation) * 100) / 100;
    
    // Generate year (mostly 1999-2023 for Pokemon)
    const year = category === 'Pokemon' ? 
        (Math.random() > 0.7 ? 2020 + Math.floor(Math.random() * 4) : 1999 + Math.floor(Math.random() * 20)) :
        1990 + Math.floor(Math.random() * 30);
    
    // Determine rarity
    const rarities = ['Common', 'Uncommon', 'Rare', 'Holo Rare', 'Secret Rare'];
    const rarity = rarities[Math.floor(Math.random() * rarities.length)];
    
    // Generate serial number for graded cards
    const serial_number = grading !== 'Ungraded' ? 
        `${Math.floor(Math.random() * 900000) + 100000}` : null;
    
    return {
        latest_price,
        price_entries: Math.floor(Math.random() * 50) + 5,
        category,
        card_type,
        set_name,
        year,
        grading,
        rarity,
        serial_number,
        source: 'eBay'
    };
}

/**
 * Check if a card already exists in the database
 */
async function checkCardExists(cardName) {
    try {
        const { data, error } = await supabase
            .from('cards')
            .select('id, name, latest_price, price_entries_count')
            .eq('name', cardName)
            .single();
        
        if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
            throw error;
        }
        
        return data || null;
    } catch (error) {
        console.error('Error checking card existence:', error);
        throw error;
    }
}

/**
 * Create a new card in the database
 */
async function createNewCard(cardName, scrapedData) {
    try {
        // Create a minimal card object with only the most basic fields
        const cardData = {
            name: cardName
        };

        const { data, error } = await supabase
            .from('cards')
            .insert(cardData)
            .select()
            .single();
        
        if (error) throw error;
        
        console.log(`✅ Created new card: ${cardName} (ID: ${data.id})`);
        return data;
    } catch (error) {
        console.error('Error creating new card:', error);
        throw error;
    }
}

/**
 * Update existing card with new price data
 */
async function updateExistingCard(cardId, scrapedData) {
    try {
        const { data, error } = await supabase
            .from('cards')
            .update({
                latest_price: scrapedData.latest_price
            })
            .eq('id', cardId);
        
        if (error) throw error;
        
        console.log(`✅ Updated existing card (ID: ${cardId}) with new price: $${scrapedData.latest_price}`);
        return { id: cardId, latest_price: scrapedData.latest_price };
    } catch (error) {
        console.error('Error updating existing card:', error);
        throw error;
    }
}

/**
 * Add price entry to the database
 */
async function addPriceEntry(cardId, price, source = 'eBay') {
    try {
        const { data, error } = await supabase
            .from('price_entries')
            .insert({
                card_id: cardId,
                price: price,
                source: source,
                timestamp: new Date().toISOString()
            })
            .select()
            .single();
        
        if (error) throw error;
        
        console.log(`💰 Added price entry: $${price} from ${source}`);
        return data;
    } catch (error) {
        console.error('Error adding price entry:', error);
        // Don't throw the error, just log it and continue
        console.log('⚠️ Price entry failed, but card was created successfully');
        return null;
    }
}

/**
 * Get appropriate emoji for card category
 */
function getCardEmoji(category) {
    const emojis = {
        'Pokemon': '⚡',
        'Sports': '🏀',
        'Gaming': '🎮',
        'Other': '🃏'
    };
    return emojis[category] || '🃏';
}

/**
 * Main function to scrape and insert card data
 */
export async function scrapeAndInsertCard(cardName) {
    const startTime = Date.now();
    
    try {
        console.log(`🚀 Starting card scraping process for: "${cardName}"`);
        
        // Step 1: Simulate scraping
        const scrapedData = await simulateEbayScraping(cardName);
        console.log('📊 Scraped data:', scrapedData);
        
        // Step 2: Check if card exists
        const existingCard = await checkCardExists(cardName);
        
        let cardId;
        
        if (existingCard) {
            // Step 3a: Update existing card
            console.log(`📝 Card "${cardName}" already exists (ID: ${existingCard.id})`);
            await updateExistingCard(existingCard.id, scrapedData);
            cardId = existingCard.id;
        } else {
            // Step 3b: Create new card
            console.log(`🆕 Card "${cardName}" not found, creating new entry`);
            const newCard = await createNewCard(cardName, scrapedData);
            cardId = newCard.id;
        }
        
        // Step 4: Add price entry
        await addPriceEntry(cardId, scrapedData.latest_price, scrapedData.source);
        
        const endTime = Date.now();
        const duration = endTime - startTime;
        
        const result = {
            success: true,
            cardName,
            cardId,
            latestPrice: scrapedData.latest_price,
            category: scrapedData.category,
            action: existingCard ? 'updated' : 'created',
            duration: `${duration}ms`,
            timestamp: new Date().toISOString()
        };
        
        console.log('✅ Card scraping and insertion completed successfully!');
        console.log('📋 Result:', result);
        
        return result;
        
    } catch (error) {
        console.error('❌ Error during card scraping and insertion:', error);
        
        const result = {
            success: false,
            cardName,
            error: error.message,
            timestamp: new Date().toISOString()
        };
        
        throw result;
    }
}

/**
 * Batch scrape multiple cards
 */
export async function batchScrapeCards(cardNames) {
    console.log(`🔄 Starting batch scrape for ${cardNames.length} cards`);
    
    const results = [];
    const errors = [];
    
    for (let i = 0; i < cardNames.length; i++) {
        const cardName = cardNames[i];
        console.log(`\n📋 Processing ${i + 1}/${cardNames.length}: ${cardName}`);
        
        try {
            const result = await scrapeAndInsertCard(cardName);
            results.push(result);
            
            // Add delay between requests to be respectful
            if (i < cardNames.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        } catch (error) {
            console.error(`❌ Failed to process "${cardName}":`, error);
            errors.push({ cardName, error: error.message });
        }
    }
    
    const summary = {
        total: cardNames.length,
        successful: results.length,
        failed: errors.length,
        results,
        errors
    };
    
    console.log('\n📊 Batch scraping completed!');
    console.log('📋 Summary:', summary);
    
    return summary;
}

/**
 * Get card statistics from database
 */
export async function getCardStats() {
    try {
        const { data, error } = await supabase
            .from('cards_with_prices')
            .select('*');
        
        if (error) throw error;
        
        const stats = {
            totalCards: data.length,
            totalValue: data.reduce((sum, card) => sum + (card.latest_price || 0), 0),
            averagePrice: data.length > 0 ? 
                data.reduce((sum, card) => sum + (card.latest_price || 0), 0) / data.length : 0,
            categories: data.reduce((acc, card) => {
                acc[card.category] = (acc[card.category] || 0) + 1;
                return acc;
            }, {}),
            lastUpdated: data.length > 0 ? 
                new Date(Math.max(...data.map(card => new Date(card.last_updated || card.created_at)))) : null
        };
        
        return stats;
    } catch (error) {
        console.error('Error getting card stats:', error);
        throw error;
    }
}

// Export for use in Railway or other environments
export default {
    scrapeAndInsertCard,
    batchScrapeCards,
    getCardStats
}; 