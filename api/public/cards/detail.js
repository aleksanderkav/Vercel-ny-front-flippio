import { supabase } from '../../../lib/supabase.js'

// GET /api/public/cards/detail?slug=card-name or /api/public/cards/detail?id=uuid
export async function GET(request) {
  try {
    console.log('🔍 API endpoint called:', request.url)
    
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')
    const id = searchParams.get('id')
    
    console.log('📝 Parameters - slug:', slug, 'id:', id)

    if (!slug && !id) {
      console.log('❌ No slug or id provided')
      return new Response(JSON.stringify({ 
        error: 'Either slug or id parameter is required' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    let card = null
    let cardError = null

    // If ID is provided, try to find by ID first
    if (id) {
      const { data, error } = await supabase
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

      card = data
      cardError = error
    }

    // If no card found by ID or slug is provided, try by name
    if (!card && slug) {
      const slugifiedName = slug.replace(/-/g, ' ').toLowerCase()
      console.log('🔍 Searching for card with slugified name:', slugifiedName)
      
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

      console.log('📦 Cards found by name:', cardsByName)
      console.log('❌ Name error:', nameError)

      if (nameError || !cardsByName || cardsByName.length === 0) {
        console.log('❌ No cards found with name search')
        return new Response(JSON.stringify({ 
          error: 'Card not found',
          details: 'No card found with the provided slug or name' 
        }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        })
      }
      
      card = cardsByName[0]
      console.log('✅ Card found:', card.name)
    }

    // If still no card found, return error
    if (!card) {
      return new Response(JSON.stringify({ 
        error: 'Card not found',
        details: 'No card found with the provided parameters' 
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
        slug: slug || card.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
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