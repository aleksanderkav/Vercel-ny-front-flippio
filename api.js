// Simple API endpoint at root level for Vercel automatic detection
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

  // Return a simple JSON response
  res.status(200).json({
    success: true,
    message: 'API is working! This is a serverless function response.',
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url,
    path: path || 'none',
    headers: req.headers
  });
} 