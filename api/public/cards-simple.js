import { supabase } from '../../../src/lib/supabase.js'

// Standard Vercel serverless function for cards
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
    // Get query parameters
    const { limit = 20, offset = 0, category, search, sortBy = 'created_at', sortOrder = 'desc' } = req.query;
    
    // Validate parameters
    const parsedLimit = Math.min(parseInt(limit) || 20, 100);
    const parsedOffset = Math.max(parseInt(offset) || 0, 0);
    
    // Build query
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
    
    // Execute query
    const { data, error, count } = await query;
    
    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ 
        success: false, 
        error: 'Database error',
        details: error.message 
      });
    }
    
    // Return response
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
    
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error',
      details: error.message 
    });
  }
} 