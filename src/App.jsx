import { useState, useEffect } from 'react'
import { supabase, isSupabaseConfigured } from './lib/supabase'
import Header from './components/Header'
import Hero from './components/Hero'
import CardLibrary from './components/CardLibrary'

function App() {
  const [cards, setCards] = useState([])
  const [loading, setLoading] = useState(false)
  const [libraryLoading, setLibraryLoading] = useState(true)
  const [searchStatus, setSearchStatus] = useState('')
  
  // Version tracking - prominently displayed
  const APP_VERSION = '1.0.0'

  useEffect(() => {
    fetchCards()
  }, [])

  const fetchCards = async () => {
    try {
      setLibraryLoading(true)
      console.log('=== FETCHING CARDS WITH PRICES (v1.0.0) ===')
      
      if (!isSupabaseConfigured) {
        throw new Error('Supabase environment variables not configured')
      }
      
      console.log('✅ Supabase configured - proceeding with API call')
      
      // Use Supabase client for better error handling
      const { data, error } = await supabase
        .from('cards_with_prices')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) {
        throw new Error(`Supabase error: ${error.message}`)
      }

      if (Array.isArray(data)) {
        setCards(data)
        console.log('✅ Cards updated successfully:', data.length)
      } else {
        setCards([])
        console.log('⚠️ No cards data received')
      }
    } catch (error) {
      console.error('❌ Error fetching cards:', error)
      setSearchStatus(`Error loading card library: ${error.message}`)
      setCards([])
    } finally {
      setLibraryLoading(false)
    }
  }

  const handleSearch = async (searchQuery) => {
    try {
      setLoading(true)
      setSearchStatus('Scraping prices...')

      const scraperUrl = `https://scraper-production-22f6.up.railway.app/scrape?query=${encodeURIComponent(searchQuery)}`
      const response = await fetch(scraperUrl)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const result = await response.json()

      if (result.status === 'success') {
        setSearchStatus('✅ Card scraped successfully! Refreshing library...')
        setTimeout(() => {
          fetchCards()
          setSearchStatus('')
        }, 2000)
      } else {
        setSearchStatus('❌ Failed to scrape card. Please try again.')
      }
    } catch (error) {
      console.error('Error scraping card:', error)
      setSearchStatus('❌ Error scraping card. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      <Header version={APP_VERSION} />
      <Hero 
        onSearch={handleSearch}
        loading={loading}
        searchStatus={searchStatus}
      />
      <CardLibrary 
        cards={cards}
        loading={libraryLoading}
        onRefresh={fetchCards}
      />
    </div>
  )
}

export default App