import { supabase } from '../../../src/lib/supabase.js'

// Standard Vercel serverless function
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
    const { searchParams } = new URL(req.url);
    
    // Pagination parameters
    const limitParam = searchParams.get('limit')
    const offsetParam = searchParams.get('offset')
    
    // Validate and parse pagination parameters
    const limit = Math.min(parseInt(limitParam) || 20, 100) // Max 100 per request
    const offset = Math.max(parseInt(offsetParam) || 0, 0) // Min 0
    
    if (isNaN(limit) || isNaN(offset)) {
      return new Response(JSON.stringify({ 
        error: 'Invalid pagination parameters',
        details: 'limit and offset must be valid numbers'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    
    // Filter parameters
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const grading = searchParams.get('grading')
    const yearParam = searchParams.get('year')
    const set_name = searchParams.get('set_name')
    const min_priceParam = searchParams.get('min_price')
    const max_priceParam = searchParams.get('max_price')
    
    // Validate numeric parameters
    const year = yearParam ? parseInt(yearParam) : null
    const min_price = min_priceParam ? parseFloat(min_priceParam) : null
    const max_price = max_priceParam ? parseFloat(max_priceParam) : null
    
    if (yearParam && (isNaN(year) || year < 1900 || year > 2030)) {
      return new Response(JSON.stringify({ 
        error: 'Invalid year parameter',
        details: 'Year must be between 1900 and 2030'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    
    if (min_priceParam && (isNaN(min_price) || min_price < 0)) {
      return new Response(JSON.stringify({ 
        error: 'Invalid min_price parameter',
        details: 'min_price must be a positive number'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    
    if (max_priceParam && (isNaN(max_price) || max_price < 0)) {
      return new Response(JSON.stringify({ 
        error: 'Invalid max_price parameter',
        details: 'max_price must be a positive number'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    
    if (min_price !== null && max_price !== null && min_price > max_price) {
      return new Response(JSON.stringify({ 
        error: 'Invalid price range',
        details: 'min_price cannot be greater than max_price'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    
    // Sorting parameters
    const sortParam = searchParams.get('sort') || 'last_updated'
    const sortOrder = searchParams.get('order') || 'desc'
    
    // Map sort parameters to database fields
    const sortMapping = {
      'price_desc': { field: 'latest_price', order: 'desc' },
      'price_asc': { field: 'latest_price', order: 'asc' },
      'name': { field: 'name', order: 'asc' },
      'last_updated': { field: 'last_updated', order: 'desc' },
      'created_at': { field: 'created_at', order: 'desc' },
      'year': { field: 'year', order: 'desc' }
    }
    
    const sortConfig = sortMapping[sortParam] || sortMapping['last_updated']
    const sortBy = sortConfig.field
    const finalSortOrder = sortParam.startsWith('price_') ? sortConfig.order : (sortOrder || sortConfig.order)
    
    // Validate sort parameters
    const validSortFields = ['name', 'latest_price', 'last_updated', 'created_at', 'year']
    const validSortOrders = ['asc', 'desc']
    
    if (!validSortFields.includes(sortBy)) {
      return new Response(JSON.stringify({ 
        error: 'Invalid sort parameter',
        validSortFields 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    
    if (!validSortOrders.includes(sortOrder)) {
      return new Response(JSON.stringify({ 
        error: 'Invalid order parameter',
        validSortOrders 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Build the main query
    let query = supabase
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

    // Apply filters
    if (category && category !== 'all') {
      query = query.eq('category', category)
    }

    if (search) {
      query = query.ilike('name', `%${search}%`)
    }
    
    if (grading && grading !== 'all') {
      if (grading === 'graded') {
        query = query.neq('grading', 'Ungraded')
      } else if (grading === 'ungraded') {
        query = query.eq('grading', 'Ungraded')
      } else {
        query = query.eq('grading', grading)
      }
    }
    
    if (year) {
      query = query.eq('year', parseInt(year))
    }
    
    if (set_name) {
      query = query.ilike('set_name', `%${set_name}%`)
    }
    
    if (min_price !== null) {
      query = query.gte('latest_price', min_price)
    }
    
    if (max_price !== null) {
      query = query.lte('latest_price', max_price)
    }

    // Apply sorting
    query = query.order(sortBy, { ascending: finalSortOrder === 'asc' })

    // Get total count for pagination
    const { count } = await query.count()

    // Apply pagination
    query = query.range(offset, offset + limit - 1)

    const { data, error } = await query

    if (error) {
      console.error('Cards API error:', error)
      return new Response(JSON.stringify({ 
        error: 'Failed to fetch cards',
        details: 'Database query failed'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Get price history and affiliate links for each card
    const cardsWithDetails = await Promise.all(
      (data || []).map(async (card) => {
        // Get price history (last 10 entries)
        const { data: priceHistory } = await supabase
          .from('price_entries')
          .select('price, source, timestamp')
          .eq('card_id', card.id)
          .order('timestamp', { ascending: false })
          .limit(10)

        // Get latest eBay price for affiliate link
        const { data: latestEbay } = await supabase
          .from('price_entries')
          .select('price, timestamp')
          .eq('card_id', card.id)
          .eq('source', 'eBay')
          .order('timestamp', { ascending: false })
          .limit(1)

        // Generate affiliate link
        const affiliate_link = latestEbay && latestEbay.length > 0 
          ? `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(card.name)}`
          : null

        // Calculate price stats
        const prices = priceHistory?.map(p => p.price).filter(p => p > 0) || []
        const price_stats = {
          latest: card.latest_price,
          average: prices.length > 0 ? prices.reduce((a, b) => a + b, 0) / prices.length : null,
          min: prices.length > 0 ? Math.min(...prices) : null,
          max: prices.length > 0 ? Math.max(...prices) : null,
          count: prices.length
        }

        return {
          ...card,
          price_history: priceHistory || [],
          price_stats,
          affiliate_link,
          slug: card.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
        }
      })
    )

    // Get available filters for the current query
    const { data: categories } = await supabase
      .from('cards')
      .select('category')
      .not('category', 'is', null)
      .limit(1000)

    const { data: sets } = await supabase
      .from('cards')
      .select('set_name')
      .not('set_name', 'is', null)
      .limit(1000)

    const { data: years } = await supabase
      .from('cards')
      .select('year')
      .not('year', 'is', null)
      .limit(1000)

    const available_filters = {
      categories: [...new Set(categories?.map(c => c.category).filter(Boolean))].sort(),
      sets: [...new Set(sets?.map(s => s.set_name).filter(Boolean))].sort(),
      years: [...new Set(years?.map(y => y.year).filter(Boolean))].sort().reverse(),
      gradings: ['Ungraded', 'PSA 1', 'PSA 2', 'PSA 3', 'PSA 4', 'PSA 5', 'PSA 6', 'PSA 7', 'PSA 8', 'PSA 9', 'PSA 10', 'BGS 1', 'BGS 2', 'BGS 3', 'BGS 4', 'BGS 5', 'BGS 6', 'BGS 7', 'BGS 8', 'BGS 9', 'BGS 9.5', 'BGS 10']
    }

    const response = {
      success: true,
      data: cardsWithDetails,
      meta: {
        total: count || 0,
        page: Math.floor(offset / limit) + 1,
        limit,
        offset,
        hasMore: (offset + limit) < (count || 0),
        totalPages: Math.ceil((count || 0) / limit)
      },
      filters: {
        applied: {
          category,
          search,
          grading,
          year,
          set_name,
          min_price,
          max_price,
          sort: sortParam,
          order: finalSortOrder
        },
        available: available_filters
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
    console.error('Public cards API error:', error)
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      details: 'An unexpected error occurred'
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