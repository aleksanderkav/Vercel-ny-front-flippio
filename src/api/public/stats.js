import { supabase } from '../../lib/supabase.js'

// Configure for Vercel Edge Runtime
export const runtime = 'edge';

// GET /api/public/stats - Get overall statistics about the card database
export async function GET(request) {
  try {
    // Get basic card statistics
    const { data: cards, error: cardsError } = await supabase
      .from('cards')
      .select('id, latest_price, category, grading, year, set_name')

    if (cardsError) {
      console.error('Stats API cards error:', cardsError)
      return new Response(JSON.stringify({ 
        error: 'Failed to fetch card statistics',
        details: cardsError.message 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Get price entries statistics
    const { data: priceEntries, error: priceError } = await supabase
      .from('price_entries')
      .select('price, source, timestamp')

    if (priceError) {
      console.error('Stats API price entries error:', priceError)
    }

    // Calculate comprehensive statistics
    const totalCards = cards?.length || 0
    const totalPriceEntries = priceEntries?.length || 0
    
    // Price statistics
    const validPrices = cards?.filter(card => card.latest_price && card.latest_price > 0) || []
    const totalValue = validPrices.reduce((sum, card) => sum + card.latest_price, 0)
    const averagePrice = validPrices.length > 0 ? totalValue / validPrices.length : 0
    const maxPrice = validPrices.length > 0 ? Math.max(...validPrices.map(c => c.latest_price)) : 0
    const minPrice = validPrices.length > 0 ? Math.min(...validPrices.map(c => c.latest_price)) : 0

    // Category statistics
    const categoryStats = {}
    cards?.forEach(card => {
      if (card.category) {
        if (!categoryStats[card.category]) {
          categoryStats[card.category] = { count: 0, total_value: 0 }
        }
        categoryStats[card.category].count++
        if (card.latest_price && card.latest_price > 0) {
          categoryStats[card.category].total_value += card.latest_price
        }
      }
    })

    // Grading statistics
    const gradingStats = {}
    cards?.forEach(card => {
      const grade = card.grading || 'Ungraded'
      if (!gradingStats[grade]) {
        gradingStats[grade] = { count: 0, total_value: 0 }
      }
      gradingStats[grade].count++
      if (card.latest_price && card.latest_price > 0) {
        gradingStats[grade].total_value += card.latest_price
      }
    })

    // Year statistics
    const yearStats = {}
    cards?.forEach(card => {
      if (card.year) {
        if (!yearStats[card.year]) {
          yearStats[card.year] = { count: 0, total_value: 0 }
        }
        yearStats[card.year].count++
        if (card.latest_price && card.latest_price > 0) {
          yearStats[card.year].total_value += card.latest_price
        }
      }
    })

    // Set statistics
    const setStats = {}
    cards?.forEach(card => {
      if (card.set_name) {
        if (!setStats[card.set_name]) {
          setStats[card.set_name] = { count: 0, total_value: 0 }
        }
        setStats[card.set_name].count++
        if (card.latest_price && card.latest_price > 0) {
          setStats[card.set_name].total_value += card.latest_price
        }
      }
    })

    // Price entry source statistics
    const sourceStats = {}
    priceEntries?.forEach(entry => {
      if (entry.source) {
        if (!sourceStats[entry.source]) {
          sourceStats[entry.source] = { count: 0, total_value: 0 }
        }
        sourceStats[entry.source].count++
        if (entry.price && entry.price > 0) {
          sourceStats[entry.source].total_value += entry.price
        }
      }
    })

    // Recent activity (last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    
    const recentPriceEntries = priceEntries?.filter(entry => 
      new Date(entry.timestamp) > sevenDaysAgo
    ) || []

    const recentCards = cards?.filter(card => 
      new Date(card.last_updated || card.created_at) > sevenDaysAgo
    ) || []

    // Top categories by value
    const topCategories = Object.entries(categoryStats)
      .map(([category, stats]) => ({
        category,
        count: stats.count,
        total_value: Math.round(stats.total_value * 100) / 100,
        average_price: Math.round((stats.total_value / stats.count) * 100) / 100
      }))
      .sort((a, b) => b.total_value - a.total_value)
      .slice(0, 5)

    // Top sets by value
    const topSets = Object.entries(setStats)
      .map(([set_name, stats]) => ({
        set_name,
        count: stats.count,
        total_value: Math.round(stats.total_value * 100) / 100,
        average_price: Math.round((stats.total_value / stats.count) * 100) / 100
      }))
      .sort((a, b) => b.total_value - a.total_value)
      .slice(0, 5)

    const response = {
      success: true,
      data: {
        overview: {
          total_cards: totalCards,
          total_price_entries: totalPriceEntries,
          total_value: Math.round(totalValue * 100) / 100,
          average_price: Math.round(averagePrice * 100) / 100,
          max_price: Math.round(maxPrice * 100) / 100,
          min_price: Math.round(minPrice * 100) / 100,
          unique_categories: Object.keys(categoryStats).length,
          unique_sets: Object.keys(setStats).length,
          unique_years: Object.keys(yearStats).length
        },
        recent_activity: {
          price_entries_last_7_days: recentPriceEntries.length,
          cards_updated_last_7_days: recentCards.length,
          average_daily_price_entries: Math.round(recentPriceEntries.length / 7)
        },
        top_categories: topCategories,
        top_sets: topSets,
        grading_distribution: Object.entries(gradingStats)
          .map(([grade, stats]) => ({
            grade,
            count: stats.count,
            percentage: Math.round((stats.count / totalCards) * 100)
          }))
          .sort((a, b) => b.count - a.count),
        year_distribution: Object.entries(yearStats)
          .map(([year, stats]) => ({
            year: parseInt(year),
            count: stats.count,
            total_value: Math.round(stats.total_value * 100) / 100
          }))
          .sort((a, b) => b.year - a.year)
          .slice(0, 10),
        price_sources: Object.entries(sourceStats)
          .map(([source, stats]) => ({
            source,
            count: stats.count,
            percentage: Math.round((stats.count / totalPriceEntries) * 100)
          }))
          .sort((a, b) => b.count - a.count)
      },
      meta: {
        last_updated: new Date().toISOString(),
        cache_duration: '1 hour'
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
    console.error('Public stats API error:', error)
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