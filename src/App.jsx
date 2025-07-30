import React, { useState, useEffect } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import CardLibrary from './components/CardLibrary'
import { supabase } from './lib/supabase'

function App() {
  // Build timestamp for cache busting
  console.log('🚀 App loaded at:', new Date().toISOString())
  console.log('📦 Version: 1.2.5')
  
  const [cards, setCards] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchStatus, setSearchStatus] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [sortBy, setSortBy] = useState('name')

  useEffect(() => {
    loadCards()
  }, [])

  const loadCards = async () => {
    setLoading(true)
    try {
      console.log('🔄 Loading cards from database...')
      
      const { data, error } = await supabase
        .from('cards_with_prices')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('❌ Database error:', error)
        throw error
      }
      
      console.log('📊 Loaded cards:', data)
      console.log('💰 Cards with prices:', data?.filter(card => card.latest_price && card.latest_price > 0))
      console.log('📈 Price statistics:', {
        total: data?.length || 0,
        withPrices: data?.filter(card => card.latest_price && card.latest_price > 0).length || 0,
        averagePrice: data?.length > 0 ? 
          (data.reduce((sum, card) => sum + (card.latest_price || 0), 0) / data.length).toFixed(2) : 0
      })
      
      setCards(data || [])
    } catch (error) {
      console.error('❌ Error loading cards:', error)
      setSearchStatus('❌ Error loading cards from database')
    } finally {
      setLoading(false)
    }
  }

  // Function to automatically detect card category based on name
  const detectCategory = (cardName) => {
    const name = cardName.toLowerCase()
    
    // Pokemon cards
    if (name.includes('pikachu') || name.includes('charizard') || name.includes('abra') || 
        name.includes('jigglypuff') || name.includes('pokemon') || name.includes('pokémon')) {
      return 'Pokemon'
    }
    
    // Gaming cards
    if (name.includes('yugioh') || name.includes('magic') || name.includes('mtg') || 
        name.includes('hearthstone') || name.includes('card game')) {
      return 'Gaming'
    }
    
    // Sports cards
    if (name.includes('football') || name.includes('basketball') || name.includes('baseball') || 
        name.includes('messi') || name.includes('ronaldo') || name.includes('bastoni') ||
        name.includes('soccer') || name.includes('nba') || name.includes('nfl') || 
        name.includes('mlb')) {
      return 'Sports'
    }
    
    return 'Other'
  }

  const handleSearch = async (searchQuery) => {
    setLoading(true)
    setSearchStatus('🔍 Searching for card prices...')
    
    try {
      // Check if card already exists
      const { data: existingCard } = await supabase
        .from('cards_with_prices')
        .select('*')
        .eq('name', searchQuery)
        .single()

      if (existingCard) {
        console.log('Card already exists:', existingCard)
        const price = existingCard.latest_price ? `$${existingCard.latest_price.toFixed(2)}` : 'No price'
        setSearchStatus(`✅ Found existing card: "${searchQuery}" - ${price}`)
        await loadCards() // Refresh the list
        return
      }

      // Simulate real price scraping with more realistic data
      const cardTypes = {
        'pikachu': { basePrice: 15, variance: 10 },
        'charizard': { basePrice: 150, variance: 50 },
        'magic': { basePrice: 25, variance: 15 },
        'yugioh': { basePrice: 20, variance: 12 },
        'basketball': { basePrice: 45, variance: 25 },
        'football': { basePrice: 35, variance: 20 },
        'baseball': { basePrice: 30, variance: 18 }
      }

      let basePrice = 25 // Default price
      let variance = 15

      // Check for specific card types
      const queryLower = searchQuery.toLowerCase()
      for (const [type, config] of Object.entries(cardTypes)) {
        if (queryLower.includes(type)) {
          basePrice = config.basePrice
          variance = config.variance
          break
        }
      }

      // Generate realistic price
      const mockPrice = basePrice + (Math.random() * variance)
      const mockPriceCount = Math.floor(Math.random() * 20) + 5
      
      // Detect category automatically
      const category = detectCategory(searchQuery)
      
      console.log('🔍 Simulating price scraping for:', searchQuery)
      console.log('💰 Generated price:', mockPrice)
      console.log('🏷️ Detected category:', category)
      
      // Insert into the view (which will trigger the INSTEAD OF INSERT)
      const { data, error } = await supabase
        .from('cards_with_prices')
        .insert([
          {
            name: searchQuery,
            latest_price: mockPrice,
            price_count: mockPriceCount,
            category: category
            // Note: last_price_update will be handled by database default
          }
        ])
        .select()

      if (error) {
        console.error('❌ Database error:', error)
        throw error
      }
      
      console.log('✅ Inserted card data:', data)
      setSearchStatus(`✅ Added "${searchQuery}" (${category}) with price $${mockPrice.toFixed(2)}`)
      await loadCards() // Refresh the list
    } catch (error) {
      console.error('❌ Error adding card:', error)
      setSearchStatus('❌ Error adding card to database')
    } finally {
      setLoading(false)
    }
  }

  const getFilteredAndSortedCards = () => {
    let filteredCards = [...cards]
    
    // Apply category filter
    if (filterCategory !== 'all') {
      filteredCards = filteredCards.filter(card => {
        const cardCategory = card.category || detectCategory(card.name)
        return cardCategory.toLowerCase() === filterCategory.toLowerCase()
      })
    }
    
    // Apply sorting
    filteredCards.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'price-high':
          return (b.latest_price || 0) - (a.latest_price || 0)
        case 'price-low':
          return (a.latest_price || 0) - (b.latest_price || 0)
        case 'date-new':
          return new Date(b.created_at) - new Date(a.created_at)
        case 'date-old':
          return new Date(a.created_at) - new Date(b.created_at)
        default:
          return 0
      }
    })
    
    return filteredCards
  }

  const refreshPrices = async () => {
    setLoading(true)
    setSearchStatus('🔄 Refreshing all card prices...')
    
    try {
      // Get all cards
      const { data: allCards, error } = await supabase
        .from('cards_with_prices')
        .select('*')

      if (error) throw error

      // Update each card with new prices
      for (const card of allCards) {
        const newPrice = card.latest_price + (Math.random() * 10 - 5) // ±$5 variation
        const updatedPrice = Math.max(0.01, newPrice) // Ensure positive price
        
        await supabase
          .from('cards_with_prices')
          .update({
            latest_price: updatedPrice,
            price_count: (card.price_count || 0) + 1,
            last_price_update: new Date().toISOString()
          })
          .eq('id', card.id)
      }

      setSearchStatus('✅ All prices refreshed!')
      await loadCards()
    } catch (error) {
      console.error('❌ Error refreshing prices:', error)
      setSearchStatus('❌ Error refreshing prices')
    } finally {
      setLoading(false)
    }
  }

  const filteredCards = getFilteredAndSortedCards()

  try {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>

        
        <Header version="1.2.5" />
        <CardLibrary 
          cards={filteredCards}
          loading={loading}
          onRefresh={loadCards}
          onRefreshPrices={refreshPrices}
          filterCategory={filterCategory}
          setFilterCategory={setFilterCategory}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />
        <Hero 
          onSearch={handleSearch}
          loading={loading}
          searchStatus={searchStatus}
        />
        
        {/* Footer */}
        <footer style={{
          background: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(16px)',
          borderTop: '2px solid rgba(226, 232, 240, 0.6)',
          padding: '2rem 1rem',
          marginTop: '3rem',
          boxShadow: '0 -10px 15px -3px rgba(0, 0, 0, 0.1), 0 -4px 6px -2px rgba(0, 0, 0, 0.05)'
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            textAlign: 'center'
          }}>
            <p style={{
              color: '#374151',
              fontSize: '1rem',
              margin: 0,
              fontWeight: 600
            }}>
              Trading Card Tracker v1.2.5
            </p>
            <p style={{
              color: '#6b7280',
              fontSize: '0.875rem',
              margin: '0.75rem 0 0 0',
              fontWeight: 500
            }}>
              © 2024 • Market price tracking
            </p>
          </div>
        </footer>
      </div>
    )
  } catch (error) {
    console.error('❌ App rendering error:', error)
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#fee2e2',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem'
      }}>
        <div style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '1rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          textAlign: 'center',
          maxWidth: '500px'
        }}>
          <h1 style={{ color: '#dc2626', marginBottom: '1rem' }}>❌ App Error</h1>
          <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
            Something went wrong while loading the app.
          </p>
          <p style={{ color: '#dc2626', fontSize: '0.875rem' }}>
            Error: {error.message}
          </p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              marginTop: '1rem',
              padding: '0.75rem 1.5rem',
              backgroundColor: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer'
            }}
          >
            🔄 Reload Page
          </button>
        </div>
      </div>
    )
  }
}

export default App
