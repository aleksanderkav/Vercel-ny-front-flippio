import { supabase } from '../../lib/supabase.js'

// GET /api/public/categories - Get all categories with card counts
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Pagination parameters
    const limit = Math.min(parseInt(searchParams.get('limit')) || 50, 100)
    const offset = parseInt(searchParams.get('offset')) || 0
    
    // Sorting parameters
    const sortBy = searchParams.get('sort') || 'card_count'
    const sortOrder = searchParams.get('order') || 'desc'
    
    // Validate sort parameters
    const validSortFields = ['category', 'card_count']
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

    // Get all cards with categories
    const { data: cards, error } = await supabase
      .from('cards')
      .select('category, latest_price')
      .not('category', 'is', null)

    if (error) {
      console.error('Categories API error:', error)
      return new Response(JSON.stringify({ 
        error: 'Failed to fetch categories',
        details: error.message 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Process the data to group by category and calculate stats
    const categoryMap = new Map()
    
    cards?.forEach(card => {
      if (!categoryMap.has(card.category)) {
        categoryMap.set(card.category, {
          category: card.category,
          card_count: 0,
          total_value: 0,
          average_price: 0,
          slug: card.category.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
        })
      }
      
      const categoryData = categoryMap.get(card.category)
      categoryData.card_count++
      if (card.latest_price && card.latest_price > 0) {
        categoryData.total_value += card.latest_price
      }
    })

    // Calculate average prices
    categoryMap.forEach(categoryData => {
      if (categoryData.card_count > 0) {
        categoryData.average_price = Math.round((categoryData.total_value / categoryData.card_count) * 100) / 100
      }
    })

    // Convert to array and sort
    let categories = Array.from(categoryMap.values())
    
    // Apply sorting
    categories.sort((a, b) => {
      let aVal = a[sortBy]
      let bVal = b[sortBy]
      
      if (sortBy === 'category') {
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
    const total = categories.length
    categories = categories.slice(offset, offset + limit)

    // Get additional stats for the response
    const totalCards = cards?.length || 0
    const totalValue = cards?.reduce((sum, card) => sum + (card.latest_price || 0), 0) || 0
    const overallAverage = totalCards > 0 ? Math.round((totalValue / totalCards) * 100) / 100 : 0

    const response = {
      success: true,
      data: categories,
      meta: {
        total: total,
        page: Math.floor(offset / limit) + 1,
        limit,
        offset,
        hasMore: (offset + limit) < total,
        totalPages: Math.ceil(total / limit),
        overall_stats: {
          total_categories: total,
          total_cards: totalCards,
          total_value: Math.round(totalValue * 100) / 100,
          average_price: overallAverage
        }
      },
      filters: {
        applied: {
          sort: sortBy,
          order: sortOrder
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
    console.error('Public categories API error:', error)
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