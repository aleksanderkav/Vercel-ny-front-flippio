import { supabase } from './src/lib/supabase.js'

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

  const { path, limit = 20, offset = 0, category, search, sortBy = 'created_at', sortOrder = 'desc' } = req.query;
  
  try {
    if (path === 'cards') {
      // Handle cards endpoint
      const parsedLimit = Math.min(parseInt(limit) || 20, 100);
      const parsedOffset = Math.max(parseInt(offset) || 0, 0);
      
      let query = supabase
        .from('cards_with_prices')
        .select('*', { count: 'exact' });
      
      // Apply filters
      if (category) {
        query = query.eq('category', category);
      }
      
      if (search) {
        query = query.ilike('name', `%${search}%`);
      }
      
      // Apply sorting
      query = query.order(sortBy, { ascending: sortOrder === 'asc' });
      
      // Apply pagination
      query = query.range(parsedOffset, parsedOffset + parsedLimit - 1);
      
      const { data, error, count } = await query;
      
      if (error) throw error;
      
      res.status(200).json({
        success: true,
        data: data || [],
        pagination: {
          limit: parsedLimit,
          offset: parsedOffset,
          total: count || 0,
          hasMore: (parsedOffset + parsedLimit) < (count || 0)
        }
      });
      
    } else if (path === 'stats') {
      // Handle stats endpoint
      const { count: totalCards, error: countError } = await supabase
        .from('cards_with_prices')
        .select('*', { count: 'exact', head: true });
      
      if (countError) throw countError;
      
      const { count: cardsWithPrices, error: priceError } = await supabase
        .from('cards_with_prices')
        .select('latest_price', { count: 'exact', head: true })
        .not('latest_price', 'is', null);
      
      if (priceError) throw priceError;
      
      const { data: avgPriceData, error: avgError } = await supabase
        .from('cards_with_prices')
        .select('latest_price')
        .not('latest_price', 'is', null);
      
      if (avgError) throw avgError;
      
      const prices = avgPriceData?.map(card => card.latest_price).filter(price => price !== null) || [];
      const averagePrice = prices.length > 0 ? prices.reduce((sum, price) => sum + price, 0) / prices.length : 0;
      const totalValue = prices.reduce((sum, price) => sum + price, 0);
      
      const { data: categoryData, error: categoryError } = await supabase
        .from('cards_with_prices')
        .select('category');
      
      if (categoryError) throw categoryError;
      
      const categories = {};
      categoryData?.forEach(card => {
        const category = card.category || 'Other';
        categories[category] = (categories[category] || 0) + 1;
      });
      
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
      
    } else if (path === 'categories') {
      // Handle categories endpoint
      const { data, error } = await supabase
        .from('cards_with_prices')
        .select('category')
        .not('category', 'is', null);
      
      if (error) throw error;
      
      const categories = [...new Set(data.map(card => card.category))].sort();
      
      res.status(200).json({
        success: true,
        data: categories.map(category => ({
          name: category,
          slug: category.toLowerCase().replace(/\s+/g, '-')
        }))
      });
      
    } else if (path === 'sets') {
      // Handle sets endpoint
      const { data, error } = await supabase
        .from('cards_with_prices')
        .select('set_name')
        .not('set_name', 'is', null);
      
      if (error) throw error;
      
      const sets = [...new Set(data.map(card => card.set_name))].sort();
      
      res.status(200).json({
        success: true,
        data: sets.map(set => ({
          name: set,
          slug: set.toLowerCase().replace(/\s+/g, '-')
        }))
      });
      
    } else {
      res.status(404).json({
        success: false,
        error: 'Endpoint not found. Available paths: cards, stats, categories, sets'
      });
    }
    
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error.message
    });
  }
} 