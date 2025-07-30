#!/usr/bin/env node

import { scrapeAndInsertCard, batchScrapeCards, getCardStats } from './src/lib/cardScraper.js';

// Test function to run manual scraping
async function testScraping() {
    console.log('🎯 Flippio Card Scraper Test');
    console.log('=============================\n');
    
    try {
        // Test single card scraping
        console.log('1️⃣ Testing single card scraping...');
        const result = await scrapeAndInsertCard('Charizard PSA 10 Base Set');
        console.log('✅ Single card result:', result);
        
        // Test batch scraping
        console.log('\n2️⃣ Testing batch card scraping...');
        const batchCards = [
            'Pikachu PSA 9 Jungle',
            'Blastoise PSA 8 Base Set',
            'Venusaur PSA 10 Base Set',
            'Mewtwo PSA 9 Base Set'
        ];
        
        const batchResult = await batchScrapeCards(batchCards);
        console.log('✅ Batch scraping result:', batchResult);
        
        // Get statistics
        console.log('\n3️⃣ Getting card statistics...');
        const stats = await getCardStats();
        console.log('✅ Card statistics:', stats);
        
        console.log('\n🎉 All tests completed successfully!');
        
    } catch (error) {
        console.error('❌ Test failed:', error);
        process.exit(1);
    }
}

// Function to scrape a specific card (for manual use)
async function scrapeSpecificCard(cardName) {
    if (!cardName) {
        console.error('❌ Please provide a card name');
        console.log('Usage: node test_scraper.js "Card Name"');
        process.exit(1);
    }
    
    try {
        console.log(`🎯 Scraping card: "${cardName}"`);
        const result = await scrapeAndInsertCard(cardName);
        console.log('✅ Result:', result);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

// Main execution
const args = process.argv.slice(2);

if (args.length === 0) {
    // Run full test suite
    testScraping();
} else {
    // Scrape specific card
    const cardName = args.join(' ');
    scrapeSpecificCard(cardName);
} 