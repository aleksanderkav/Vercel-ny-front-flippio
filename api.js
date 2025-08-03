// API endpoint at root level for Vercel automatic detection
// Note: Supabase integration temporarily disabled for testing

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
      // Handle cards endpoint - return mock data for testing
      res.status(200).json({
        success: true,
        data: [
          {
            id: 'test-card-1',
            name: 'Charizard PSA 10',
            category: 'Pokemon',
            latest_price: 1500.00,
            image_url: 'https://example.com/charizard.jpg',
            created_at: new Date().toISOString()
          },
          {
            id: 'test-card-2',
            name: 'Pikachu PSA 9',
            category: 'Pokemon',
            latest_price: 250.00,
            image_url: 'https://example.com/pikachu.jpg',
            created_at: new Date().toISOString()
          }
        ],
        pagination: {
          limit: parseInt(limit) || 20,
          offset: parseInt(offset) || 0,
          total: 2,
          hasMore: false
        }
      });
      
    } else if (path === 'stats') {
      // Handle stats endpoint - return mock data for testing
      res.status(200).json({
        success: true,
        data: {
          totalCards: 2,
          totalValue: 1750.00,
          averagePrice: 875.00,
          cardsWithPrices: 2,
          categories: {
            'Pokemon': 2
          },
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
        availablePaths: ['cards', 'stats'],
        note: 'Using mock data - Supabase integration pending'
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