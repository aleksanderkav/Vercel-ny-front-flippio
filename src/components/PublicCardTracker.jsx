import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { colors, typography, spacing, borderRadius } from '../styles/designSystem'

const PublicCardTracker = ({ 
  embedMode = false, 
  showScraper = false,
  maxCards = 20,
  theme = 'light',
  showStats = true,
  showSearch = true,
  showPagination = true,
  showSorting = true
}) => {
  const [cards, setCards] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('date-new')
  const [currentPage, setCurrentPage] = useState(1)
  const [cardsPerPage] = useState(12)

  useEffect(() => {
    loadCards()
    if (showStats) {
      loadStats()
    }
  }, [])

  const loadCards = async () => {
    try {
      const { data, error } = await supabase
        .from('cards')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setCards(data || [])
    } catch (error) {
      console.error('Error loading cards:', error)
    } finally {
      setLoading(false)
    }
  }

  // Filter and sort cards
  const getFilteredAndSortedCards = () => {
    let filtered = cards

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(card => 
        card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (card.category && card.category.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Apply sorting
    switch (sortBy) {
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'price-high':
        filtered.sort((a, b) => (b.latest_price || 0) - (a.latest_price || 0))
        break
      case 'price-low':
        filtered.sort((a, b) => (a.latest_price || 0) - (b.latest_price || 0))
        break
      case 'date-new':
        filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        break
      case 'date-old':
        filtered.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
        break
      default:
        filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    }

    return filtered
  }

  // Pagination logic
  const filteredCards = getFilteredAndSortedCards()
  const totalPages = Math.ceil(filteredCards.length / cardsPerPage)
  const startIndex = (currentPage - 1) * cardsPerPage
  const endIndex = startIndex + cardsPerPage
  const currentCards = filteredCards.slice(startIndex, endIndex)

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const loadStats = async () => {
    try {
      const { data, error } = await supabase
        .rpc('get_card_stats')

      if (error) throw error
      setStats(data)
    } catch (error) {
      console.error('Error loading stats:', error)
    }
  }

  const formatPrice = (price) => {
    if (!price || price <= 0) return 'N/A'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(price)
  }

  const getPriceColor = (price) => {
    if (!price || price <= 0) return colors.textMuted
    if (price < 50) return colors.priceLow
    if (price < 200) return colors.priceMedium
    if (price < 500) return colors.priceHigh
    return colors.pricePremium
  }

  // Styles
  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: spacing.lg,
    fontFamily: typography.fontFamily.primary,
    background: theme === 'dark' ? '#1A202C' : colors.background,
    color: theme === 'dark' ? '#FFFFFF' : colors.textPrimary,
    minHeight: '100vh'
  }

  const headerStyle = {
    textAlign: 'center',
    marginBottom: spacing.xl
  }

  const titleStyle = {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    margin: 0,
    marginBottom: spacing.sm,
    color: theme === 'dark' ? '#FFFFFF' : colors.textPrimary
  }

  const statsStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: spacing.md,
    marginBottom: spacing.xl
  }

  const statCardStyle = {
    background: theme === 'dark' ? '#2D3748' : colors.surface,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    border: `1px solid ${theme === 'dark' ? '#4A5568' : colors.border}`,
    textAlign: 'center'
  }

  const statValueStyle = {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
    marginBottom: spacing.xs
  }

  const statLabelStyle = {
    fontSize: typography.fontSize.sm,
    color: theme === 'dark' ? '#A0AEC0' : colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  }

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: spacing.lg,
    marginBottom: spacing.xl
  }

  const cardStyle = {
    background: theme === 'dark' ? '#2D3748' : colors.surface,
    borderRadius: borderRadius.lg,
    border: `1px solid ${theme === 'dark' ? '#4A5568' : colors.border}`,
    padding: spacing.lg,
    transition: 'all 0.2s ease'
  }

  const cardHeaderStyle = {
    marginBottom: spacing.md
  }

  const cardTitleStyle = {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    margin: 0,
    marginBottom: spacing.xs,
    color: theme === 'dark' ? '#FFFFFF' : colors.textPrimary
  }

  const cardMetaStyle = {
    fontSize: typography.fontSize.sm,
    color: theme === 'dark' ? '#A0AEC0' : colors.textSecondary,
    marginBottom: spacing.sm
  }

  const priceStyle = {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    marginTop: spacing.sm
  }

  if (loading) {
    return (
      <div style={containerStyle}>
        <div style={{ textAlign: 'center', padding: spacing.xl }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: `3px solid ${theme === 'dark' ? '#4A5568' : colors.border}`,
            borderTop: `3px solid ${colors.primary}`,
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto'
          }}></div>
          <p style={{ marginTop: spacing.md, color: theme === 'dark' ? '#A0AEC0' : colors.textSecondary }}>
            Loading cards...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h2 style={titleStyle}>
          {embedMode ? 'Card Collection' : 'Trading Card Tracker'}
        </h2>
        {embedMode && (
          <div style={{
            fontSize: typography.fontSize.sm,
            color: theme === 'dark' ? '#A0AEC0' : colors.textSecondary
          }}>
            Powered by Flippio
          </div>
        )}
      </div>

      {showStats && stats && (
        <div style={statsStyle}>
          <div style={statCardStyle}>
            <div style={statValueStyle}>{stats.totalCards}</div>
            <div style={statLabelStyle}>Total Cards</div>
          </div>
          <div style={statCardStyle}>
            <div style={statValueStyle}>{formatPrice(stats.totalValue)}</div>
            <div style={statLabelStyle}>Total Value</div>
          </div>
          <div style={statCardStyle}>
            <div style={statValueStyle}>{formatPrice(stats.averagePrice)}</div>
            <div style={statLabelStyle}>Average Price</div>
          </div>
        </div>
      )}

      {/* Search and Controls */}
      {(showSearch || showSorting) && (
        <div style={{
          display: 'flex',
          gap: spacing.md,
          marginBottom: spacing.lg,
          flexWrap: 'wrap',
          alignItems: 'center'
        }}>
          {showSearch && (
            <div style={{ flex: 1, minWidth: '200px' }}>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setCurrentPage(1) // Reset to first page
                }}
                placeholder="Search cards..."
                style={{
                  width: '100%',
                  padding: `${spacing.sm} ${spacing.md}`,
                  fontSize: typography.fontSize.sm,
                  border: `1px solid ${theme === 'dark' ? '#4A5568' : colors.border}`,
                  borderRadius: borderRadius.md,
                  background: theme === 'dark' ? '#2D3748' : colors.surface,
                  color: theme === 'dark' ? '#FFFFFF' : colors.textPrimary,
                  outline: 'none',
                  transition: 'all 0.2s ease'
                }}
              />
            </div>
          )}

          {showSorting && (
            <div style={{ minWidth: '150px' }}>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  width: '100%',
                  padding: `${spacing.sm} ${spacing.md}`,
                  fontSize: typography.fontSize.sm,
                  border: `1px solid ${theme === 'dark' ? '#4A5568' : colors.border}`,
                  borderRadius: borderRadius.md,
                  background: theme === 'dark' ? '#2D3748' : colors.surface,
                  color: theme === 'dark' ? '#FFFFFF' : colors.textPrimary,
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="date-new">Newest First</option>
                <option value="date-old">Oldest First</option>
                <option value="name">Name A-Z</option>
                <option value="price-high">Price High-Low</option>
                <option value="price-low">Price Low-High</option>
              </select>
            </div>
          )}
        </div>
      )}

      <div style={gridStyle}>
        {currentCards.map((card, index) => (
          <div key={card.id || index} style={cardStyle}>
            <div style={cardHeaderStyle}>
              <h3 style={cardTitleStyle}>
                {card.name || 'Unknown Card'}
              </h3>
              <div style={cardMetaStyle}>
                Added: {new Date(card.created_at).toLocaleDateString()}
              </div>
            </div>
            
            <div style={cardMetaStyle}>
              Category: {card.category || 'Other'}
            </div>
            
            {card.latest_price ? (
              <div style={priceStyle} style={{ color: getPriceColor(card.latest_price) }}>
                {formatPrice(card.latest_price)}
              </div>
            ) : (
              <div style={{ ...priceStyle, color: colors.textMuted }}>
                No Price Data
              </div>
            )}
            
            {card.price_entries_count > 0 && (
              <div style={cardMetaStyle}>
                Price Entries: {card.price_entries_count}
              </div>
            )}
          </div>
        ))}
        
        {currentCards.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: spacing.xl,
            color: theme === 'dark' ? '#A0AEC0' : colors.textSecondary
          }}>
            {searchTerm ? 'No cards match your search' : 'No cards found'}
          </div>
        )}
      </div>

      {/* Pagination */}
      {showPagination && totalPages > 1 && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: spacing.sm,
          marginTop: spacing.xl,
          padding: spacing.md,
          background: theme === 'dark' ? '#2D3748' : colors.surface,
          borderRadius: borderRadius.md,
          border: `1px solid ${theme === 'dark' ? '#4A5568' : colors.border}`
        }}>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            style={{
              padding: `${spacing.sm} ${spacing.md}`,
              fontSize: typography.fontSize.sm,
              fontWeight: typography.fontWeight.semibold,
              color: currentPage === 1 ? (theme === 'dark' ? '#4A5568' : '#9CA3AF') : (theme === 'dark' ? '#FFFFFF' : colors.textPrimary),
              backgroundColor: currentPage === 1 ? (theme === 'dark' ? '#1A202C' : '#F3F4F6') : (theme === 'dark' ? '#2D3748' : colors.surface),
              border: `1px solid ${theme === 'dark' ? '#4A5568' : colors.border}`,
              borderRadius: borderRadius.md,
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            ← Previous
          </button>

          <div style={{
            display: 'flex',
            gap: spacing.xs,
            alignItems: 'center'
          }}>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = i + 1
              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  style={{
                    padding: `${spacing.sm} ${spacing.md}`,
                    fontSize: typography.fontSize.sm,
                    fontWeight: typography.fontWeight.semibold,
                    color: currentPage === page ? colors.white : (theme === 'dark' ? '#FFFFFF' : colors.textPrimary),
                    backgroundColor: currentPage === page ? colors.primary : (theme === 'dark' ? '#2D3748' : colors.surface),
                    border: `1px solid ${theme === 'dark' ? '#4A5568' : colors.border}`,
                    borderRadius: borderRadius.sm,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    minWidth: '2.5rem'
                  }}
                >
                  {page}
                </button>
              )
            })}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            style={{
              padding: `${spacing.sm} ${spacing.md}`,
              fontSize: typography.fontSize.sm,
              fontWeight: typography.fontWeight.semibold,
              color: currentPage === totalPages ? (theme === 'dark' ? '#4A5568' : '#9CA3AF') : (theme === 'dark' ? '#FFFFFF' : colors.textPrimary),
              backgroundColor: currentPage === totalPages ? (theme === 'dark' ? '#1A202C' : '#F3F4F6') : (theme === 'dark' ? '#2D3748' : colors.surface),
              border: `1px solid ${theme === 'dark' ? '#4A5568' : colors.border}`,
              borderRadius: borderRadius.md,
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            Next →
          </button>

          <span style={{
            fontSize: typography.fontSize.sm,
            color: theme === 'dark' ? '#A0AEC0' : colors.textSecondary,
            marginLeft: spacing.md
          }}>
            Page {currentPage} of {totalPages} ({filteredCards.length} cards)
          </span>
        </div>
      )}
    </div>
  )
}

export default PublicCardTracker 