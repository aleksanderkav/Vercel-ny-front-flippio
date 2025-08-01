import { supabase } from '../../../../lib/supabase.js'

// GET /api/public/cards/slug/[slug] - Get single card by slug (SEO-friendly)
export async function GET(request, { params }) {
  try {
    const { slug } = params
    
    if (!slug) {
      return new Response(JSON.stringify({ 
        error: 'Card slug is required' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Convert slug back to searchable name
    const searchName = slug.replace(/-/g, ' ').toLowerCase()
    
    // Find card by name (fuzzy search)
    const { data: cards, error: cardError } = await supabase
      .from('cards')
      .select(`
        id,
        name,
        latest_price,
        price_entries_count,
        category,
        card_type,
        set_name,
        year,
        grading,
        rarity,
        serial_number,
        image_url,
        created_at,
        last_updated
      `)
      .ilike('name', `%${searchName}%`)
      .limit(1)

    if (cardError || !cards || cards.length === 0) {
      return new Response(JSON.stringify({ 
        error: 'Card not found',
        details: 'No card found with the provided slug'
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const card = cards[0]

    // Get price history (all entries)
    const { data: priceHistory, error: priceError } = await supabase
      .from('price_entries')
      .select('price, source, timestamp')
      .eq('card_id', card.id)
      .order('timestamp', { ascending: false })

    if (priceError) {
      console.error('Price history error:', priceError)
    }

    // Get latest eBay price for affiliate link
    const { data: latestEbay, error: ebayError } = await supabase
      .from('price_entries')
      .select('price, timestamp')
      .eq('card_id', card.id)
      .eq('source', 'eBay')
      .order('timestamp', { ascending: false })
      .limit(1)

    if (ebayError) {
      console.error('eBay price error:', ebayError)
    }

    // Generate affiliate link
    const affiliate_link = latestEbay && latestEbay.length > 0 
      ? `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(card.name)}`
      : null

    // Calculate comprehensive price stats
    const prices = priceHistory?.map(p => p.price).filter(p => p > 0) || []
    const price_stats = {
      latest: card.latest_price,
      average: prices.length > 0 ? prices.reduce((a, b) => a + b, 0) / prices.length : null,
      min: prices.length > 0 ? Math.min(...prices) : null,
      max: prices.length > 0 ? Math.max(...prices) : null,
      count: prices.length,
      trend: calculatePriceTrend(priceHistory || []),
      volatility: calculateVolatility(prices)
    }

    // Get similar cards based on set_name, grading, or category
    const { data: similarCards, error: similarError } = await supabase
      .from('cards')
      .select(`
        id,
        name,
        latest_price,
        category,
        set_name,
        year,
        grading,
        image_url
      `)
      .or(`set_name.eq.${card.set_name},grading.eq.${card.grading},category.eq.${card.category}`)
      .neq('id', card.id)
      .limit(6)

    if (similarError) {
      console.error('Similar cards error:', similarError)
    }

    // Add slugs to similar cards
    const similarCardsWithSlugs = (similarCards || []).map(similarCard => ({
      ...similarCard,
      slug: similarCard.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    }))

    // Prepare the response
    const response = {
      success: true,
      data: {
        ...card,
        slug: card.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        price_history: priceHistory || [],
        price_stats,
        affiliate_link,
        similar_cards: similarCardsWithSlugs,
        meta: {
          total_price_entries: priceHistory?.length || 0,
          last_updated: card.last_updated,
          created_at: card.created_at,
          canonical_url: `/api/public/cards/slug/${slug}`
        }
      }
    }

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600', // 1 hour cache
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    })

  } catch (error) {
    console.error('Slug-based card API error:', error)
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      details: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

// Helper function to calculate price trend
function calculatePriceTrend(priceHistory) {
  if (!priceHistory || priceHistory.length < 2) {
    return 'stable'
  }

  const recent = priceHistory.slice(0, 5) // Last 5 entries
  const older = priceHistory.slice(-5) // Previous 5 entries

  const recentAvg = recent.reduce((sum, p) => sum + p.price, 0) / recent.length
  const olderAvg = older.reduce((sum, p) => sum + p.price, 0) / older.length

  const change = ((recentAvg - olderAvg) / olderAvg) * 100

  if (change > 10) return 'increasing'
  if (change < -10) return 'decreasing'
  return 'stable'
}

// Helper function to calculate price volatility
function calculateVolatility(prices) {
  if (prices.length < 2) return 'low'

  const mean = prices.reduce((sum, price) => sum + price, 0) / prices.length
  const variance = prices.reduce((sum, price) => sum + Math.pow(price - mean, 2), 0) / prices.length
  const standardDeviation = Math.sqrt(variance)
  const coefficientOfVariation = (standardDeviation / mean) * 100

  if (coefficientOfVariation > 30) return 'high'
  if (coefficientOfVariation > 15) return 'medium'
  return 'low'
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  })
} 