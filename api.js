import { createClient } from '@supabase/supabase-js'

// Create Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null

// API endpoint at root level for Vercel automatic detection
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get the path from query parameters
  const { path, limit = 20, offset = 0, category, search, sortBy = 'created_at', sortOrder = 'desc' } = req.query;

  try {
    if (path === 'cards') {
      // Handle cards endpoint
      if (!supabase) {
        return res.status(500).json({
          success: false,
          error: 'Supabase not configured'
        });
      }

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
      if (!supabase) {
        return res.status(500).json({
          success: false,
          error: 'Supabase not configured'
        });
      }

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
      
    } else {
      // Default response for other paths
      res.status(200).json({
        success: true,
        message: 'API is working! This is a serverless function response.',
        timestamp: new Date().toISOString(),
        method: req.method,
        url: req.url,
        path: path || 'none',
        availablePaths: ['cards', 'stats']
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