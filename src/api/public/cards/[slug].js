import { supabase } from '../../../lib/supabase.js'

// GET /api/public/cards/[slug] - Get single card details by slug (public endpoint)
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

    // First try to find by slug (if we have slug field)
    let { data: card, error: cardError } = await supabase
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
      .eq('id', slug)
      .single()

    // If not found by ID, try by name (slugified)
    if (cardError) {
      const slugifiedName = slug.replace(/-/g, ' ').toLowerCase()
      const { data: cardsByName, error: nameError } = await supabase
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
        .ilike('name', `%${slugifiedName}%`)
        .limit(1)

      if (nameError || !cardsByName || cardsByName.length === 0) {
        return new Response(JSON.stringify({ 
          error: 'Card not found',
          details: 'No card found with the provided slug or name' 
        }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        })
      }
      
      card = cardsByName[0]
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
      .eq('card_id', card.id)
      .order('timestamp', { ascending: true })
      .limit(50)

    if (priceError) {
      console.error('Price history error:', priceError)
    }

    // Get latest eBay affiliate link
    const { data: latestEbayEntry, error: ebayError } = await supabase
      .from('price_entries')
      .select('source, price, timestamp')
      .eq('card_id', card.id)
      .eq('source', 'eBay')
      .order('timestamp', { ascending: false })
      .limit(1)

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
        rarity
      `)
      .or(`set_name.eq.${card.set_name},grading.eq.${card.grading},category.eq.${card.category}`)
      .neq('id', card.id)
      .limit(6)

    if (similarError) {
      console.error('Similar cards error:', similarError)
    }

    // Generate affiliate link (placeholder for now)
    const affiliateLink = latestEbayEntry && latestEbayEntry.length > 0 
      ? `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(card.name)}`
      : null

    return new Response(JSON.stringify({
      success: true,
      data: {
        ...card,
        slug: slug,
        price_history: priceHistory || [],
        similar_cards: similarCards || [],
        affiliate_link: affiliateLink,
        ebay_price: latestEbayEntry?.[0]?.price || null,
        ebay_last_updated: latestEbayEntry?.[0]?.timestamp || null
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