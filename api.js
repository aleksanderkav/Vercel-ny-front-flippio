// Simple API endpoint for testing
export default function handler(req, res) {
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
  const { path } = req.query;

  // Simple response based on path
  if (path === 'cards') {
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
        }
      ],
      pagination: {
        limit: 20,
        offset: 0,
        total: 1,
        hasMore: false
      }
    });
  } else if (path === 'stats') {
    res.status(200).json({
      success: true,
      data: {
        totalCards: 1,
        totalValue: 1500.00,
        averagePrice: 1500.00,
        cardsWithPrices: 1,
        categories: {
          'Pokemon': 1
        },
        lastUpdated: new Date().toISOString()
      }
    });
  } else {
    res.status(200).json({
      success: true,
      message: 'API is working!',
      timestamp: new Date().toISOString(),
      path: path || 'none',
      availablePaths: ['cards', 'stats']
    });
  }
} 