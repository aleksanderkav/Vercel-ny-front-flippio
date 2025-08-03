import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Hero from './components/Hero'
import CardLibrary from './components/CardLibrary'
import CardDetail from './pages/CardDetail'
import { supabase } from './lib/supabase'
import PriceService from './lib/priceService'
import ScrapingService from './lib/scrapingService'
import { scrapeAndInsertCard, batchScrapeCards, getCardStats } from './lib/cardScraper'
import PublicCardTracker from './components/PublicCardTracker'
import Embed from './pages/Embed'

function App() {
  // Build timestamp for cache busting
  console.log('🚀 App loaded at:', new Date().toISOString())
  console.log('📦 Version: 1.3.6')
  
  // Check if this is an embed request
  const isEmbed = window.location.pathname === '/embed' || window.location.search.includes('embed=true')
  
  if (isEmbed) {
    return <Embed />
  }

  return (
    <Router>
      <Routes>
        <Route path="/card/:slug" element={<CardDetail />} />
        <Route path="/" element={<MainApp />} />
      </Routes>
    </Router>
  )
}

function MainApp() {
  
  const [cards, setCards] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchStatus, setSearchStatus] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterGrade, setFilterGrade] = useState('all')
  const [filterPrice, setFilterPrice] = useState('with-prices') // New price filter
  const [sortBy, setSortBy] = useState('name')
  const [librarySearch, setLibrarySearch] = useState('')
  const [error, setError] = useState(null)

  useEffect(() => {
    try {
      loadCards()
    } catch (err) {
      console.error('❌ Error in useEffect:', err)
      setError(err.message)
    }
  }, [])

  const loadCards = async () => {
    setLoading(true)
    try {
      console.log('🔄 Loading cards from database...')
      
          const { data, error } = await supabase
      .from('cards')
      .select('*')
      .order('created_at', { ascending: false })

      if (error) {
        console.error('❌ Database error:', error)
        throw error
      }
      
      console.log('📊 Loaded cards:', data)
      console.log('🖼️ Cards with images:', data?.filter(card => card.image_url).length || 0)
      console.log('🔍 Sample card data:', data?.[0])
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
      setError(error.message)
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

  // Function to fetch real prices using the PriceService or ScrapingService
  const fetchRealPrices = async (searchQuery) => {
    try {
      console.log('🔍 Fetching real prices for:', searchQuery)
      
      // Choose between API and market data collection (you can toggle this)
      const useMarketData = true // Set to true to use market data collection instead of APIs
      
      let priceData
      if (useMarketData) {
        // Use market data collection
        priceData = await ScrapingService.scrapeCardPrices(searchQuery)
      } else {
        // Use APIs
        priceData = await PriceService.getCardPrices(searchQuery)
      }
      
      return {
        latest_price: priceData.latest_price,
        price_count: priceData.price_count,
        success: priceData.success,
        source: priceData.source
      }
    } catch (error) {
      console.error('❌ Error fetching real prices:', error)
      return {
        latest_price: null,
        price_count: 0,
        success: false,
        error: error.message
      }
    }
  }

  // Function to simulate eBay market data collection with enhanced metadata
  const simulateEbayScraping = async (searchQuery) => {
    const queryLower = searchQuery.toLowerCase()
    
    // Simulate eBay card type detection
    let cardType = 'Other'
    if (queryLower.includes('pokemon') || queryLower.includes('pikachu') || queryLower.includes('charizard')) {
      cardType = 'Pokémon'
    } else if (queryLower.includes('football') || queryLower.includes('basketball') || queryLower.includes('baseball')) {
      cardType = 'Sports Trading Card'
    } else if (queryLower.includes('magic') || queryLower.includes('mtg')) {
      cardType = 'Magic: The Gathering'
    } else if (queryLower.includes('yugioh')) {
      cardType = 'Yu-Gi-Oh!'
    }
    
    // Determine category based on card type first, then fallback to keyword matching
    let category = 'Other'
    if (cardType === 'Pokémon') {
      category = 'Pokemon'
    } else if (cardType === 'Sports Trading Card') {
      category = 'Sports'
    } else if (cardType === 'Magic: The Gathering' || cardType === 'Yu-Gi-Oh!') {
      category = 'Gaming'
    } else {
      // Fallback to keyword matching
      category = detectCategory(searchQuery)
    }
    
    // Simulate other eBay metadata
    const setNames = ['Base Set', 'Jungle', 'Fossil', 'Team Rocket', 'Gym Heroes', 'Champions Path', 'Vivid Voltage']
    const years = [1999, 2000, 2001, 2002, 2003, 2020, 2021, 2022, 2023, 2024]
    const gradings = ['PSA 10', 'PSA 9', 'PSA 8', 'BGS 10', 'BGS 9.5', 'Raw']
    const rarities = ['Common', 'Uncommon', 'Rare', 'Ultra Rare', 'Secret Rare', 'Holo']
    
    // Fetch real prices instead of mock prices
    const priceData = await fetchRealPrices(searchQuery)
    
    return {
      name: searchQuery,
      latest_price: priceData.latest_price,
      price_count: priceData.price_count,
      category: category,
      card_type: cardType,
      card_set: setNames[Math.floor(Math.random() * setNames.length)],
      card_year: years[Math.floor(Math.random() * years.length)],
      grading: gradings[Math.floor(Math.random() * gradings.length)],
      rarity: rarities[Math.floor(Math.random() * rarities.length)],
      serial_number: Math.floor(Math.random() * 1000000).toString().padStart(6, '0')
    }
  }

  const handleSearch = async (searchQuery) => {
    setLoading(true)
    setSearchStatus('🎯 Using advanced card search...')
    
    try {
      // Use the new search function instead of the old simulation
      const result = await scrapeAndInsertCard(searchQuery)
      
      if (result.success) {
        const action = result.action === 'created' ? 'Added' : 'Updated'
        setSearchStatus(`✅ ${action} "${result.cardName}" - $${result.latestPrice} (${result.category})`)
        await loadCards() // Refresh the list
      } else {
        setSearchStatus(`❌ Failed to find "${result.cardName}": ${result.error}`)
      }
    } catch (error) {
      console.error('❌ Error during search:', error)
      setSearchStatus('❌ Error during card search')
    } finally {
      setLoading(false)
    }
  }

  const getFilteredAndSortedCards = () => {
    let filteredCards = [...cards]
    
    // Apply library search filter
    if (librarySearch.trim()) {
      const searchTerm = librarySearch.toLowerCase()
      filteredCards = filteredCards.filter(card => 
        card.name.toLowerCase().includes(searchTerm) ||
        (card.category && card.category.toLowerCase().includes(searchTerm)) ||
        (card.card_type && card.card_type.toLowerCase().includes(searchTerm)) ||
        (card.set_name && card.set_name.toLowerCase().includes(searchTerm))
      )
    }
    
    // Apply category filter
    if (filterCategory !== 'all') {
      filteredCards = filteredCards.filter(card => {
        const cardCategory = card.category || detectCategory(card.name)
        return cardCategory.toLowerCase() === filterCategory.toLowerCase()
      })
    }
    
    // Apply grade filter
    if (filterGrade !== 'all') {
      filteredCards = filteredCards.filter(card => {
        const cardGrade = card.grading || 'Ungraded'
        if (filterGrade === 'graded') {
          return cardGrade !== 'Ungraded'
        } else if (filterGrade === 'ungraded') {
          return cardGrade === 'Ungraded'
        } else {
          return cardGrade === filterGrade
        }
      })
    }
    
    // Apply price filter
    if (filterPrice === 'with-prices') {
      // Show only cards with prices, but show all when searching
      if (!librarySearch.trim()) {
        filteredCards = filteredCards.filter(card => 
          card.latest_price && card.latest_price > 0
        )
      }
    } else if (filterPrice === 'no-prices') {
      // Show only cards without prices
      filteredCards = filteredCards.filter(card => 
        !card.latest_price || card.latest_price <= 0
      )
    }
    // 'all-prices' shows all cards regardless of price status
    
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
        .from('cards')
        .select('*')

      if (error) throw error

      // Update each card with new prices
      for (const card of allCards) {
        if (card.latest_price) {
          const newPrice = card.latest_price + (Math.random() * 10 - 5) // ±$5 variation
          const updatedPrice = Math.max(0.01, newPrice) // Ensure positive price
          
          await supabase
            .from('cards')
            .update({
              latest_price: updatedPrice,
              last_updated: new Date().toISOString()
            })
            .eq('id', card.id)
        }
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

  // New function for batch search
  const handleBatchScrape = async (cardNames) => {
    setLoading(true)
    setSearchStatus(`🔄 Starting batch search for ${cardNames.length} cards...`)
    
    try {
      const result = await batchScrapeCards(cardNames)
      
      if (result.successful > 0) {
        setSearchStatus(`✅ Batch completed: ${result.successful}/${result.total} cards found successfully`)
        await loadCards() // Refresh the list
      } else {
        setSearchStatus(`❌ Batch failed: ${result.failed}/${result.total} cards not found`)
      }
      
      return result
    } catch (error) {
      console.error('❌ Error during batch search:', error)
      setSearchStatus('❌ Error during batch search')
      throw error
    } finally {
      setLoading(false)
    }
  }

  // New function for getting statistics
  const handleGetStats = async () => {
    try {
      const stats = await getCardStats()
      console.log('📊 Card statistics:', stats)
      return stats
    } catch (error) {
      console.error('❌ Error getting statistics:', error)
      throw error
    }
  }

  // Function to scrape prices for cards without prices
  const scrapeMissingPrices = async () => {
    setLoading(true)
    setSearchStatus('🔍 Finding cards without prices...')
    
    try {
      // Get all cards without prices
      const { data: cardsWithoutPrices, error } = await supabase
        .from('cards')
        .select('*')
        .or('latest_price.is.null,latest_price.eq.0')

      if (error) throw error

      if (!cardsWithoutPrices || cardsWithoutPrices.length === 0) {
        setSearchStatus('✅ All cards already have prices!')
        return
      }

      setSearchStatus(`🔄 Scraping prices for ${cardsWithoutPrices.length} cards...`)
      
      let successCount = 0
      let failCount = 0

      for (const card of cardsWithoutPrices) {
        try {
          // Try to scrape price for this card
          const result = await handleSearch(card.name)
          if (result && result.latestPrice) {
            successCount++
          } else {
            failCount++
          }
          
          // Update progress every 5 cards
          if ((successCount + failCount) % 5 === 0) {
            setSearchStatus(`🔄 Scraped ${successCount + failCount}/${cardsWithoutPrices.length} cards...`)
          }
        } catch (cardError) {
          console.error(`Error scraping price for ${card.name}:`, cardError)
          failCount++
        }
      }

      setSearchStatus(`✅ Price scraping completed! ${successCount} updated, ${failCount} failed.`)
      
      // Refresh the cards list
      await loadCards()
      
    } catch (error) {
      console.error('❌ Error scraping missing prices:', error)
      setSearchStatus('❌ Error scraping missing prices')
    } finally {
      setLoading(false)
    }
  }

  const filteredCards = getFilteredAndSortedCards()

  // Show error if there is one
  if (error) {
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
            Error: {error}
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

  try {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>

        
        <Header version="1.3.6" />
        <CardLibrary 
          cards={filteredCards}
          loading={loading}
          onRefresh={loadCards}
          onRefreshPrices={refreshPrices}
          onScrapeMissingPrices={scrapeMissingPrices}
          onBatchScrape={handleBatchScrape}
          onGetStats={handleGetStats}
          filterCategory={filterCategory}
          setFilterCategory={setFilterCategory}
          filterGrade={filterGrade}
          setFilterGrade={setFilterGrade}
          filterPrice={filterPrice}
          setFilterPrice={setFilterPrice}
          sortBy={sortBy}
          setSortBy={setSortBy}
          librarySearch={librarySearch}
          setLibrarySearch={setLibrarySearch}
          onSearch={handleSearch}
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
              Trading Card Tracker v1.3.6
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
