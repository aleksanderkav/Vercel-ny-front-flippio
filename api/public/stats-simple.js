import { supabase } from '../../../src/lib/supabase.js'

// Standard Vercel serverless function for stats
export default async function handler(req, res) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get total cards count
    const { count: totalCards, error: countError } = await supabase
      .from('cards_with_prices')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.error('Count error:', countError);
      return res.status(500).json({ 
        success: false, 
        error: 'Database error',
        details: countError.message 
      });
    }
    
    // Get cards with prices
    const { count: cardsWithPrices, error: priceError } = await supabase
      .from('cards_with_prices')
      .select('latest_price', { count: 'exact', head: true })
      .not('latest_price', 'is', null);
    
    if (priceError) {
      console.error('Price count error:', priceError);
      return res.status(500).json({ 
        success: false, 
        error: 'Database error',
        details: priceError.message 
      });
    }
    
    // Get average price
    const { data: avgPriceData, error: avgError } = await supabase
      .from('cards_with_prices')
      .select('latest_price')
      .not('latest_price', 'is', null);
    
    if (avgError) {
      console.error('Average price error:', avgError);
      return res.status(500).json({ 
        success: false, 
        error: 'Database error',
        details: avgError.message 
      });
    }
    
    const prices = avgPriceData?.map(card => card.latest_price).filter(price => price !== null) || [];
    const averagePrice = prices.length > 0 ? prices.reduce((sum, price) => sum + price, 0) / prices.length : 0;
    const totalValue = prices.reduce((sum, price) => sum + price, 0);
    
    // Get category breakdown
    const { data: categoryData, error: categoryError } = await supabase
      .from('cards_with_prices')
      .select('category');
    
    if (categoryError) {
      console.error('Category error:', categoryError);
      return res.status(500).json({ 
        success: false, 
        error: 'Database error',
        details: categoryError.message 
      });
    }
    
    const categories = {};
    categoryData?.forEach(card => {
      const category = card.category || 'Other';
      categories[category] = (categories[category] || 0) + 1;
    });
    
    // Return response
    res.status(200).json({
      success: true,
      data: {
        totalCards: totalCards || 0,
        totalValue: totalValue,
        averagePrice: averagePrice,
        cardsWithPrices: cardsWithPrices || 0,
        categories: categories,
        lastUpdated: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error',
      details: error.message 
    });
  }
} 