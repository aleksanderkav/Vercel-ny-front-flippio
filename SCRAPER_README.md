# 🎯 Flippio Card Scraper - Backend Implementation

## Overview

This implementation provides a complete backend solution for manually scraping and inserting trading card data into Supabase. The system can be triggered manually from Railway or via API endpoints.

## 🚀 Quick Start

### 1. Update Supabase Schema

First, run the SQL script to update your Supabase database:

```sql
-- Run this in your Supabase SQL Editor
-- File: update_schema_for_scraping.sql
```

This will:
- Add new fields to the `cards` table
- Create the `price_entries` table
- Set up triggers and policies
- Create category detection functions

### 2. Test the Scraper

#### Option A: Command Line Testing
```bash
# Test with sample data
node test_scraper.js

# Scrape a specific card
node test_scraper.js "Charizard PSA 10 Base Set"
```

#### Option B: Web Interface
Open `scraper_test.html` in your browser for a visual interface.

#### Option C: API Endpoints
```bash
# Single card scraping
curl -X POST http://your-railway-url/api/scrape-card \
  -H "Content-Type: application/json" \
  -d '{"action": "scrape_single", "cardName": "Charizard PSA 10 Base Set"}'

# Batch scraping
curl -X POST http://your-railway-url/api/scrape-card \
  -H "Content-Type: application/json" \
  -d '{"action": "scrape_batch", "cardNames": ["Charizard PSA 10", "Pikachu PSA 9"]}'

# Get statistics
curl -X POST http://your-railway-url/api/scrape-card \
  -H "Content-Type: application/json" \
  -d '{"action": "get_stats"}'
```

## 📁 File Structure

```
├── src/lib/cardScraper.js     # Main scraping logic
├── api/scrape-card.js         # Railway API endpoint
├── test_scraper.js           # CLI testing script
├── scraper_test.html         # Web testing interface
├── update_schema_for_scraping.sql  # Database schema updates
└── SCRAPER_README.md         # This file
```

## 🔧 Configuration

### Environment Variables

The scraper uses these environment variables (already configured):

```bash
VITE_SUPABASE_URL=https://jvkxyjycpomtzfngocge.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### Railway Deployment

1. **Manual Trigger**: Use the API endpoints to trigger scraping manually
2. **Cron Job Setup**: Later, you can set up Railway cron jobs using the same endpoints

## 📊 Features

### Card Data Extraction

The scraper extracts and processes:

- **Required**: `latest_price` (simulated from eBay)
- **Metadata**: `category`, `card_type`, `set_name`, `year`, `grading`, `rarity`, `serial_number`
- **Price History**: Individual price entries with timestamps
- **Statistics**: Price counts, market distribution

### Category Detection

Automatic category detection based on:
- **Pokemon**: Pokemon card names, "Pokémon" in type
- **Sports**: Sports card names, athlete names, sports brands
- **Gaming**: Magic: The Gathering, Yu-Gi-Oh!, etc.
- **Other**: Default fallback

### Database Operations

- **New Cards**: Creates full card records with metadata
- **Existing Cards**: Updates prices and adds price entries
- **Price History**: Maintains individual price entries with sources
- **Triggers**: Automatic statistics updates

## 🎮 Usage Examples

### Single Card Scraping

```javascript
import { scrapeAndInsertCard } from './src/lib/cardScraper.js';

const result = await scrapeAndInsertCard('Charizard PSA 10 Base Set');
console.log(result);
// Output: { success: true, cardName: "...", cardId: 123, latestPrice: 899.99, ... }
```

### Batch Scraping

```javascript
import { batchScrapeCards } from './src/lib/cardScraper.js';

const cards = [
    'Charizard PSA 10 Base Set',
    'Pikachu PSA 9 Jungle',
    'Blastoise PSA 8 Base Set'
];

const result = await batchScrapeCards(cards);
console.log(result);
// Output: { total: 3, successful: 3, failed: 0, results: [...], errors: [] }
```

### Get Statistics

```javascript
import { getCardStats } from './src/lib/cardScraper.js';

const stats = await getCardStats();
console.log(stats);
// Output: { totalCards: 15, totalValue: 12500.50, averagePrice: 833.37, ... }
```

## 🔄 Railway Integration

### Manual Triggering

Use the API endpoint for manual scraping:

```bash
# Deploy to Railway
railway up

# Trigger scraping
curl -X POST https://your-app.railway.app/api/scrape-card \
  -H "Content-Type: application/json" \
  -d '{"action": "scrape_single", "cardName": "Charizard PSA 10"}'
```

### Future Cron Job Setup

For automatic price updates, you can set up Railway cron jobs:

```json
// railway.json (future enhancement)
{
  "cron": {
    "price-update": {
      "schedule": "0 */6 * * *",  // Every 6 hours
      "command": "curl -X POST https://your-app.railway.app/api/scrape-card -H 'Content-Type: application/json' -d '{\"action\": \"scrape_batch\", \"cardNames\": [\"popular cards list\"]}'"
    }
  }
}
```

## 🧪 Testing

### Test Scenarios

1. **New Card Creation**: Test with completely new card names
2. **Existing Card Update**: Test with cards already in database
3. **Batch Processing**: Test multiple cards simultaneously
4. **Error Handling**: Test with invalid card names
5. **Category Detection**: Test different card types

### Sample Test Data

```javascript
const testCards = [
    'Charizard PSA 10 Base Set',
    'Pikachu PSA 9 Jungle',
    'Blastoise PSA 8 Base Set',
    'Venusaur PSA 10 Base Set',
    'Mewtwo PSA 9 Base Set',
    'Michael Jordan 1986 Fleer PSA 10',
    'Black Lotus Alpha PSA 9'
];
```

## 🔍 Monitoring & Logging

The scraper provides detailed logging:

- **Process Tracking**: Step-by-step operation logs
- **Performance Metrics**: Duration tracking
- **Error Reporting**: Detailed error messages
- **Success Confirmation**: Operation results

### Log Output Example

```
🚀 Starting card scraping process for: "Charizard PSA 10 Base Set"
🔍 Simulating eBay scraping for: Charizard PSA 10 Base Set
📊 Scraped data: { latest_price: 899.99, category: "Pokemon", ... }
📝 Card "Charizard PSA 10 Base Set" already exists (ID: 123)
✅ Updated existing card (ID: 123) with new price: $899.99
💰 Added price entry: $899.99 from eBay
✅ Card scraping and insertion completed successfully!
📋 Result: { success: true, cardName: "...", duration: "2345ms" }
```

## 🚨 Error Handling

The system handles various error scenarios:

- **Database Connection Issues**: Retry logic and error reporting
- **Invalid Card Names**: Graceful handling with error messages
- **Duplicate Entries**: Proper update logic
- **Network Timeouts**: Simulated delays and error recovery

## 🔮 Future Enhancements

### Real Scraping Implementation

Replace the simulation with real web scraping:

```javascript
// Future: Real eBay scraping
import puppeteer from 'puppeteer';

async function realEbayScraping(cardName) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    // Navigate to eBay search
    await page.goto(`https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(cardName)}`);
    
    // Extract price data
    const prices = await page.evaluate(() => {
        // Real scraping logic here
    });
    
    await browser.close();
    return processPrices(prices);
}
```

### Additional Features

- **Multiple Sources**: TCGPlayer, CardMarket, etc.
- **Image Scraping**: Card image URLs
- **Market Analysis**: Price trends and predictions
- **Notification System**: Price alerts
- **Advanced Filtering**: Grade, condition, set filtering

## 📞 Support

For issues or questions:

1. Check the logs for detailed error messages
2. Verify Supabase connection and permissions
3. Test with the provided sample data
4. Review the database schema updates

## 🎯 Version History

- **v1.2.7**: Initial scraping implementation with simulation
- Future: Real web scraping integration
- Future: Automated cron job scheduling 