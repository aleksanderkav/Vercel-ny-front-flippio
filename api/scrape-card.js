import { scrapeAndInsertCard, batchScrapeCards, getCardStats } from '../src/lib/cardScraper.js';

export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({
            success: false,
            error: 'Method not allowed. Use POST to trigger scraping.'
        });
    }
    
    try {
        const { cardName, cardNames, action } = req.body;
        
        // Validate request
        if (!action) {
            return res.status(400).json({
                success: false,
                error: 'Missing required field: action'
            });
        }
        
        let result;
        
        switch (action) {
            case 'scrape_single':
                if (!cardName) {
                    return res.status(400).json({
                        success: false,
                        error: 'Missing required field: cardName'
                    });
                }
                
                console.log(`🎯 API: Scraping single card: ${cardName}`);
                result = await scrapeAndInsertCard(cardName);
                break;
                
            case 'scrape_batch':
                if (!cardNames || !Array.isArray(cardNames) || cardNames.length === 0) {
                    return res.status(400).json({
                        success: false,
                        error: 'Missing or invalid field: cardNames (must be an array)'
                    });
                }
                
                console.log(`🎯 API: Scraping batch of ${cardNames.length} cards`);
                result = await batchScrapeCards(cardNames);
                break;
                
            case 'get_stats':
                console.log('🎯 API: Getting card statistics');
                result = await getCardStats();
                break;
                
            default:
                return res.status(400).json({
                    success: false,
                    error: 'Invalid action. Use: scrape_single, scrape_batch, or get_stats'
                });
        }
        
        // Return success response
        res.status(200).json({
            success: true,
            action,
            timestamp: new Date().toISOString(),
            result
        });
        
    } catch (error) {
        console.error('❌ API Error:', error);
        
        res.status(500).json({
            success: false,
            error: error.message || 'Internal server error',
            timestamp: new Date().toISOString()
        });
    }
} 