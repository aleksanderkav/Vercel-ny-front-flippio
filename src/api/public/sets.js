import { supabase } from '../../lib/supabase.js'

// Configure for Vercel Edge Runtime
export const runtime = 'edge';

// GET /api/public/sets - Get all unique sets with card counts
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Pagination parameters
    const limit = Math.min(parseInt(searchParams.get('limit')) || 50, 100)
    const offset = parseInt(searchParams.get('offset')) || 0
    
    // Filter parameters
    const category = searchParams.get('category')
    const year = searchParams.get('year')
    
    // Sorting parameters
    const sortBy = searchParams.get('sort') || 'card_count'
    const sortOrder = searchParams.get('order') || 'desc'
    
    // Validate sort parameters
    const validSortFields = ['set_name', 'card_count', 'year']
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

    // Build the query to get sets with card counts
    let query = supabase
      .from('cards')
      .select('set_name, year, category')
      .not('set_name', 'is', null)

    // Apply filters
    if (category && category !== 'all') {
      query = query.eq('category', category)
    }
    
    if (year) {
      query = query.eq('year', parseInt(year))
    }

    const { data: cards, error } = await query

    if (error) {
      console.error('Sets API error:', error)
      return new Response(JSON.stringify({ 
        error: 'Failed to fetch sets',
        details: error.message 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Process the data to group by set and count cards
    const setMap = new Map()
    
    cards?.forEach(card => {
      const key = `${card.set_name}|${card.year || 'Unknown'}`
      if (!setMap.has(key)) {
        setMap.set(key, {
          set_name: card.set_name,
          year: card.year || null,
          category: card.category,
          card_count: 0,
          slug: card.set_name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
        })
      }
      setMap.get(key).card_count++
    })

    // Convert to array and sort
    let sets = Array.from(setMap.values())
    
    // Apply sorting
    sets.sort((a, b) => {
      let aVal = a[sortBy]
      let bVal = b[sortBy]
      
      if (sortBy === 'set_name') {
        aVal = aVal?.toLowerCase() || ''
        bVal = bVal?.toLowerCase() || ''
      }
      
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1
      } else {
        return aVal < bVal ? 1 : -1
      }
    })

    // Apply pagination
    const total = sets.length
    sets = sets.slice(offset, offset + limit)

    // Get available filters
    const { data: categories } = await supabase
      .from('cards')
      .select('category')
      .not('category', 'is', null)
      .limit(1000)

    const { data: years } = await supabase
      .from('cards')
      .select('year')
      .not('year', 'is', null)
      .limit(1000)

    const available_filters = {
      categories: [...new Set(categories?.map(c => c.category).filter(Boolean))].sort(),
      years: [...new Set(years?.map(y => y.year).filter(Boolean))].sort().reverse()
    }

    const response = {
      success: true,
      data: sets,
      meta: {
        total: total,
        page: Math.floor(offset / limit) + 1,
        limit,
        offset,
        hasMore: (offset + limit) < total,
        totalPages: Math.ceil(total / limit)
      },
      filters: {
        applied: {
          category,
          year,
          sort: sortBy,
          order: sortOrder
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
    console.error('Public sets API error:', error)
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