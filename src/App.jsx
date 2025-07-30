import React, { useState, useEffect } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import CardLibrary from './components/CardLibrary'
import { supabase } from './lib/supabase'

function App() {
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
      const { data, error } = await supabase
        .from('cards_with_prices')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setCards(data || [])
    } catch (error) {
      console.error('Error loading cards:', error)
      setSearchStatus('Error loading cards')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (searchQuery) => {
    setLoading(true)
    setSearchStatus('Searching for card...')
    
    try {
      // Simulate price scraping (in a real app, this would call your scraper API)
      const mockPrice = Math.random() * 200 + 10
      const mockPriceCount = Math.floor(Math.random() * 50) + 1
      
      const { data, error } = await supabase
        .from('cards_with_prices')
        .insert([
          {
            name: searchQuery,
            latest_price: mockPrice,
            price_count: mockPriceCount,
            last_price_update: new Date().toISOString()
          }
        ])
        .select()

      if (error) throw error
      
      setSearchStatus(`✅ Added "${searchQuery}" with price $${mockPrice.toFixed(2)}`)
      await loadCards() // Refresh the list
    } catch (error) {
      console.error('Error adding card:', error)
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
        const name = card.name.toLowerCase()
        if (filterCategory === 'pokemon') return name.includes('pikachu') || name.includes('charizard') || name.includes('pokemon')
        if (filterCategory === 'sports') return name.includes('basketball') || name.includes('football') || name.includes('baseball')
        if (filterCategory === 'gaming') return name.includes('magic') || name.includes('yugioh') || name.includes('mtg')
        return true
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

  const filteredCards = getFilteredAndSortedCards()

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <Header version="1.0.1" />
      <Hero 
        onSearch={handleSearch}
        loading={loading}
        searchStatus={searchStatus}
      />
      <CardLibrary 
        cards={filteredCards}
        loading={loading}
        onRefresh={loadCards}
        filterCategory={filterCategory}
        setFilterCategory={setFilterCategory}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />
    </div>
  )
}

export default App
