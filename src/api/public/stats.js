import { supabase } from '../../lib/supabase.js'

// GET /api/public/stats - Get card statistics (public endpoint)
export async function GET(request) {
  try {
    // Get total cards count
    const { count: totalCards, error: countError } = await supabase
      .from('cards')
      .select('*', { count: 'exact', head: true })

    if (countError) {
      throw countError
    }

    // Get cards with prices for calculations
    const { data: cardsWithPrices, error: cardsError } = await supabase
      .from('cards')
      .select('latest_price, category')
      .not('latest_price', 'is', null)

    if (cardsError) {
      throw cardsError
    }

    // Calculate statistics
    const totalValue = cardsWithPrices.reduce((sum, card) => sum + (card.latest_price || 0), 0)
    const averagePrice = cardsWithPrices.length > 0 ? totalValue / cardsWithPrices.length : 0

    // Calculate category distribution
    const categories = {}
    cardsWithPrices.forEach(card => {
      const category = card.category || 'Other'
      categories[category] = (categories[category] || 0) + 1
    })

    // Get latest update time
    const { data: latestCard, error: latestError } = await supabase
      .from('cards')
      .select('last_updated')
      .order('last_updated', { ascending: false })
      .limit(1)

    const lastUpdated = latestCard?.[0]?.last_updated || new Date().toISOString()

    return new Response(JSON.stringify({
      success: true,
      data: {
        totalCards: totalCards || 0,
        totalValue: Math.round(totalValue * 100) / 100,
        averagePrice: Math.round(averagePrice * 100) / 100,
        categories,
        lastUpdated,
        cardsWithPrices: cardsWithPrices.length
      }
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    })

  } catch (error) {
    console.error('Public stats API error:', error)
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      details: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
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