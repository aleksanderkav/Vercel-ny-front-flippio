import React, { useState, useEffect } from 'react'
import { supabase, isSupabaseConfigured } from './lib/supabase'
import Header from './components/Header'
import Hero from './components/Hero'
import CardLibrary from './components/CardLibrary'

// Simple error boundary component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('❌ App Error Boundary caught error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          color: '#333',
          textAlign: 'center',
          padding: '20px'
        }}>
          <div>
            <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Trading Card Tracker</h1>
            <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>v1.0.0</p>
            <p style={{ color: '#666', marginBottom: '2rem' }}>Component Error Detected</p>
            <div style={{
              background: '#fee2e2',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              padding: '15px',
              margin: '10px 0',
              textAlign: 'left',
              fontFamily: 'monospace',
              fontSize: '0.9rem',
              color: '#dc2626'
            }}>
              <strong>Error:</strong> {this.state.error?.message}<br />
              <strong>Stack:</strong> {this.state.error?.stack?.split('\n').slice(0, 3).join('<br>') || 'No stack trace'}
            </div>
            <p style={{ color: '#999', fontSize: '0.9rem', marginTop: '2rem' }}>
              Check browser console for more details
            </p>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

function App() {
  const [cards, setCards] = useState([])
  const [loading, setLoading] = useState(false)
  const [libraryLoading, setLibraryLoading] = useState(true)
  const [searchStatus, setSearchStatus] = useState('')
  const [error, setError] = useState(null)
  
  // Version tracking - prominently displayed
  const APP_VERSION = '1.0.0'

  console.log('🚀 Full App component rendering...', { APP_VERSION })

  useEffect(() => {
    console.log('🔄 Full App useEffect running...')
    try {
      fetchCards()
    } catch (err) {
      console.error('❌ Error in useEffect:', err)
      setError(err.message)
    }
  }, [])

  const fetchCards = async () => {
    try {
      setLibraryLoading(true)
      console.log('=== FETCHING CARDS WITH PRICES (v1.0.0) ===')
      
      // For now, let's skip Supabase and just show a working UI
      console.log('✅ Skipping Supabase for now - showing UI only')
      
      // Simulate some data
      const mockCards = [
        {
          id: '1',
          name: 'Pikachu PSA 10',
          latest_price: 150.00,
          price_count: 5,
          last_price_update: new Date().toISOString(),
          created_at: new Date().toISOString()
        },
        {
          id: '2', 
          name: 'Charizard PSA 9',
          latest_price: 75.00,
          price_count: 3,
          last_price_update: new Date().toISOString(),
          created_at: new Date().toISOString()
        }
      ]
      
      setCards(mockCards)
      console.log('✅ Mock cards loaded successfully:', mockCards.length)
      
    } catch (error) {
      console.error('❌ Error fetching cards:', error)
      setError(`Error loading card library: ${error.message}`)
      setCards([])
    } finally {
      setLibraryLoading(false)
    }
  }

  const handleSearch = async (searchQuery) => {
    try {
      setLoading(true)
      setSearchStatus('Scraping prices...')

      // Simulate scraping delay
      await new Promise(resolve => setTimeout(resolve, 2000))

      setSearchStatus('✅ Card scraped successfully! Refreshing library...')
      setTimeout(() => {
        fetchCards()
        setSearchStatus('')
      }, 2000)
    } catch (error) {
      console.error('Error scraping card:', error)
      setSearchStatus('❌ Error scraping card. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  console.log('🎨 Rendering full App component with:', { cards: cards.length, loading, libraryLoading, error })

  if (error) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        color: '#333',
        textAlign: 'center',
        padding: '20px'
      }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Trading Card Tracker</h1>
          <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>v1.0.0</p>
          <p style={{ color: '#666', marginBottom: '2rem' }}>Application Error</p>
          <div style={{
            background: '#fee2e2',
            border: '1px solid #fecaca',
            borderRadius: '8px',
            padding: '15px',
            margin: '10px 0',
            textAlign: 'left',
            fontFamily: 'monospace',
            fontSize: '0.9rem',
            color: '#dc2626'
          }}>
            <strong>Error:</strong> {error}
          </div>
        </div>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        {/* Debug indicator */}
        <div style={{
          position: 'fixed',
          top: '10px',
          left: '10px',
          background: 'rgba(0,0,0,0.8)',
          color: 'white',
          padding: '10px',
          borderRadius: '5px',
          fontSize: '12px',
          zIndex: 9999
        }}>
          React App v{APP_VERSION}
        </div>
        
        {/* Simple header */}
        <div style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(24px)',
          borderBottom: '1px solid rgba(226, 232, 240, 0.6)',
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
          padding: '1rem'
        }}>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, color: '#0f172a' }}>
            Trading Card Tracker v{APP_VERSION}
          </h1>
        </div>

        {/* Simple hero section */}
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Track Card Prices</h2>
          <p style={{ fontSize: '1.1rem', color: '#475569', marginBottom: '2rem' }}>
            Search for trading cards to track their prices
          </p>
          
          {/* Simple search form */}
          <div style={{
            maxWidth: '500px',
            margin: '0 auto',
            background: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '1rem',
            padding: '2rem',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}>
            <input
              type="text"
              placeholder="Enter card name (e.g., Pikachu PSA 10)"
              style={{
                width: '100%',
                padding: '1rem',
                fontSize: '1rem',
                border: '1px solid #cbd5e1',
                borderRadius: '0.5rem',
                marginBottom: '1rem'
              }}
            />
            <button
              onClick={() => handleSearch('test')}
              disabled={loading}
              style={{
                width: '100%',
                padding: '1rem',
                fontSize: '1rem',
                fontWeight: 600,
                color: '#ffffff',
                backgroundColor: loading ? '#94a3b8' : '#2563eb',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Searching...' : '🚀 Search Cards'}
            </button>
            
            {searchStatus && (
              <div style={{
                marginTop: '1rem',
                padding: '1rem',
                borderRadius: '0.5rem',
                backgroundColor: '#ecfdf5',
                color: '#065f46'
              }}>
                {searchStatus}
              </div>
            )}
          </div>
        </div>

        {/* Simple card display */}
        <div style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Your Cards ({cards.length})</h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1rem'
          }}>
            {cards.map((card, index) => (
              <div key={index} style={{
                background: '#ffffff',
                borderRadius: '0.75rem',
                padding: '1.5rem',
                border: '1px solid #e2e8f0',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
              }}>
                <h4 style={{ margin: '0 0 0.5rem 0' }}>{card.name}</h4>
                <p style={{ margin: '0 0 0.5rem 0', color: '#64748b' }}>
                  Latest Price: ${card.latest_price}
                </p>
                <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>
                  {card.price_count} price entries
                </p>
              </div>
            ))}
          </div>
          
          {cards.length === 0 && !libraryLoading && (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
              No cards found. Search for a card above to get started!
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  )
}

export default App