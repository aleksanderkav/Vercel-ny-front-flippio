import React, { useState } from 'react'
import Header from './components/Header'
import SearchBar from './components/SearchBar'
import CardLibrary from './components/CardLibrary'

function App() {
  const [searchResults, setSearchResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchStatus, setSearchStatus] = useState('')

  const handleSearch = async (query) => {
    setLoading(true)
    setSearchStatus('🔍 Searching for cards...')
    
    try {
      // Simulate API call - replace with actual Supabase query
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Mock data for demonstration
      const mockResults = [
        {
          id: 1,
          name: 'Pikachu',
          set: 'Base Set',
          condition: 'PSA 10',
          price: 299.99,
          image: 'https://via.placeholder.com/200x280/FFD700/000000?text=Pikachu',
          lastUpdated: new Date().toISOString()
        },
        {
          id: 2,
          name: 'Charizard',
          set: 'Base Set',
          condition: 'PSA 9',
          price: 899.99,
          image: 'https://via.placeholder.com/200x280/FF4500/FFFFFF?text=Charizard',
          lastUpdated: new Date().toISOString()
        },
        {
          id: 3,
          name: 'Blastoise',
          set: 'Base Set',
          condition: 'PSA 8',
          price: 199.99,
          image: 'https://via.placeholder.com/200x280/4169E1/FFFFFF?text=Blastoise',
          lastUpdated: new Date().toISOString()
        }
      ]
      
      setSearchResults(mockResults)
      setSearchStatus(`✅ Found ${mockResults.length} cards for "${query}"`)
    } catch (error) {
      console.error('Search error:', error)
      setSearchStatus('❌ Error searching for cards')
      setSearchResults([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <Header version="1.0.0" />
      
      <main style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem 1rem'
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '3rem'
        }}>
          <h1 style={{
            fontSize: '3rem',
            fontWeight: 700,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '1rem'
          }}>
            Track Card Prices
          </h1>
          <p style={{
            fontSize: '1.25rem',
            color: '#475569',
            marginBottom: '2rem'
          }}>
            Search for trading cards and get real-time market prices
          </p>
        </div>

        <SearchBar 
          onSearch={handleSearch}
          loading={loading}
          searchStatus={searchStatus}
        />

        {searchResults.length > 0 && (
          <CardLibrary 
            cards={searchResults}
            title={`Search Results (${searchResults.length} cards)`}
          />
        )}

        {!loading && searchResults.length === 0 && searchStatus && (
          <div style={{
            textAlign: 'center',
            marginTop: '3rem',
            padding: '2rem',
            background: 'rgba(255, 255, 255, 0.8)',
            borderRadius: '1rem',
            border: '1px solid rgba(226, 232, 240, 0.5)'
          }}>
            <p style={{
              fontSize: '1.125rem',
              color: '#64748b',
              margin: 0
            }}>
              {searchStatus}
            </p>
          </div>
        )}
      </main>
    </div>
  )
}

export default App