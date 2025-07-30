import { supabase } from '../../../lib/supabase.js'

// GET /api/public/cards/:id - Get single card details (public endpoint)
export async function GET(request, { params }) {
  try {
    const { id } = params

    if (!id) {
      return new Response(JSON.stringify({ 
        error: 'Card ID is required' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Get card details
    const { data: card, error: cardError } = await supabase
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
      .eq('id', id)
      .single()

    if (cardError) {
      return new Response(JSON.stringify({ 
        error: 'Card not found',
        details: cardError.message 
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Get price history for this card
    const { data: priceHistory, error: priceError } = await supabase
      .from('price_entries')
      .select(`
        id,
        price,
        source,
        timestamp
      `)
      .eq('card_id', id)
      .order('timestamp', { ascending: false })
      .limit(20)

    if (priceError) {
      console.error('Price history error:', priceError)
    }

    return new Response(JSON.stringify({
      success: true,
      data: {
        ...card,
        price_history: priceHistory || []
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
    console.error('Public card detail API error:', error)
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