import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { colors, typography, spacing, borderRadius, shadows } from '../styles/designSystem'

const PublicCardTracker = ({ 
  embedMode = false, 
  showScraper = false,
  maxCards = 20,
  theme = 'light',
  showStats = true
}) => {
  const [cards, setCards] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)

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
        .limit(maxCards)

      if (error) throw error
      setCards(data || [])
    } catch (error) {
      console.error('Error loading cards:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const { data, error } = await supabase
        .from('cards')
        .select('*')

      if (error) throw error

      const totalCards = data.length
      const totalValue = data.reduce((sum, card) => sum + (card.latest_price || 0), 0)
      const averagePrice = totalCards > 0 ? totalValue / totalCards : 0

      setStats({
        totalCards,
        totalValue,
        averagePrice
      })
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

  const containerStyle = {
    fontFamily: typography.fontFamily.primary,
    background: theme === 'dark' ? '#1A1A1A' : colors.background,
    color: theme === 'dark' ? '#FFFFFF' : colors.textPrimary,
    padding: embedMode ? spacing.md : spacing.xl,
    borderRadius: embedMode ? borderRadius.md : borderRadius.lg,
    boxShadow: embedMode ? 'none' : shadows.lg,
    maxWidth: '100%',
    overflow: 'hidden'
  }

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
    paddingBottom: spacing.md,
    borderBottom: `1px solid ${theme === 'dark' ? '#374151' : colors.border}`
  }

  const titleStyle = {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: theme === 'dark' ? '#FFFFFF' : colors.textPrimary,
    margin: 0
  }

  const statsStyle = {
    display: 'flex',
    gap: spacing.md,
    marginBottom: spacing.lg,
    flexWrap: 'wrap'
  }

  const statCardStyle = {
    background: theme === 'dark' ? '#2D3748' : colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    border: `1px solid ${theme === 'dark' ? '#4A5568' : colors.border}`,
    minWidth: '120px',
    textAlign: 'center'
  }

  const statValueStyle = {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: theme === 'dark' ? '#FFFFFF' : colors.textPrimary,
    marginBottom: spacing.xs
  }

  const statLabelStyle = {
    fontSize: typography.fontSize.sm,
    color: theme === 'dark' ? '#A0AEC0' : colors.textSecondary,
    fontWeight: typography.fontWeight.medium
  }

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: embedMode ? 'repeat(auto-fit, minmax(280px, 1fr))' : 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: spacing.md,
    marginTop: spacing.lg
  }

  const cardStyle = {
    background: theme === 'dark' ? '#2D3748' : colors.surface,
    border: `1px solid ${theme === 'dark' ? '#4A5568' : colors.border}`,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    transition: 'all 0.2s ease',
    cursor: 'pointer'
  }

  const cardHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm
  }

  const cardNameStyle = {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: theme === 'dark' ? '#FFFFFF' : colors.textPrimary,
    margin: 0,
    lineHeight: typography.lineHeight.tight
  }

  const cardDateStyle = {
    fontSize: typography.fontSize.sm,
    color: theme === 'dark' ? '#A0AEC0' : colors.textSecondary,
    marginTop: spacing.xs
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

      <div style={gridStyle}>
        {cards.map((card, index) => (
          <div key={card.id || index} style={cardStyle}>
            <div style={cardHeaderStyle}>
              <div>
                <h3 style={cardNameStyle}>{card.name}</h3>
                <p style={cardDateStyle}>
                  Added: {new Date(card.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            
            <div style={{
              ...priceStyle,
              color: getPriceColor(card.latest_price)
            }}>
              {formatPrice(card.latest_price)}
            </div>
            
            {card.price_entries_count > 0 && (
              <div style={{
                fontSize: typography.fontSize.sm,
                color: theme === 'dark' ? '#A0AEC0' : colors.textSecondary,
                marginTop: spacing.xs
              }}>
                {card.price_entries_count} price entries
              </div>
            )}
          </div>
        ))}
      </div>

      {cards.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: spacing.xl,
          color: theme === 'dark' ? '#A0AEC0' : colors.textSecondary
        }}>
          No cards found
        </div>
      )}
    </div>
  )
}

export default PublicCardTracker 