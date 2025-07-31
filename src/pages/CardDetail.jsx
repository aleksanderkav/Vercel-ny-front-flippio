import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { LineChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts'
import { colors, typography, spacing, borderRadius, shadows, getPriceColor, formatPrice } from '../styles/designSystem'

const CardDetail = () => {
  const { slug } = useParams()
  const [card, setCard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadCardDetails()
  }, [slug])

  const loadCardDetails = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/public/cards/detail?slug=${encodeURIComponent(slug)}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to load card details')
      }

      setCard(data.data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const formatChartData = (priceHistory) => {
    return priceHistory.map(entry => ({
      date: new Date(entry.timestamp).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      }),
      price: entry.price,
      source: entry.source
    }))
  }

  const generateSlug = (cardName) => {
    return cardName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  }

  if (loading) {
    return (
      <div style={containerStyle}>
        <div style={loadingStyle}>
          <div style={spinnerStyle}></div>
          <p>Loading card details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={containerStyle}>
        <div style={errorStyle}>
          <h2>Card Not Found</h2>
          <p>{error}</p>
          <Link to="/" style={backButtonStyle}>
            ← Back to Collection
          </Link>
        </div>
      </div>
    )
  }

  if (!card) {
    return (
      <div style={containerStyle}>
        <div style={errorStyle}>
          <h2>Card Not Found</h2>
          <p>The requested card could not be found.</p>
          <Link to="/" style={backButtonStyle}>
            ← Back to Collection
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <Link to="/" style={backButtonStyle}>
          ← Back to Collection
        </Link>
        <h1 style={titleStyle}>{card.name}</h1>
      </div>

      <div style={contentStyle}>
        {/* Main Card Info */}
        <div style={mainSectionStyle}>
          <div style={cardOverviewStyle}>
            {/* Card Image Placeholder */}
            <div style={imagePlaceholderStyle}>
              <div style={imageIconStyle}>🃏</div>
              <p style={imageTextStyle}>Card Image</p>
            </div>

            {/* Card Metadata */}
            <div style={metadataStyle}>
              <div style={metadataGridStyle}>
                <div style={metadataItemStyle}>
                  <label style={metadataLabelStyle}>Set</label>
                  <span style={metadataValueStyle}>{card.set_name || 'Unknown'}</span>
                </div>
                
                <div style={metadataItemStyle}>
                  <label style={metadataLabelStyle}>Year</label>
                  <span style={metadataValueStyle}>{card.year || 'Unknown'}</span>
                </div>
                
                <div style={metadataItemStyle}>
                  <label style={metadataLabelStyle}>Grading</label>
                  <span style={metadataValueStyle}>{card.grading || 'Ungraded'}</span>
                </div>
                
                <div style={metadataItemStyle}>
                  <label style={metadataLabelStyle}>Category</label>
                  <span style={metadataValueStyle}>{card.category || 'Other'}</span>
                </div>
                
                <div style={metadataItemStyle}>
                  <label style={metadataLabelStyle}>Rarity</label>
                  <span style={metadataValueStyle}>{card.rarity || 'Unknown'}</span>
                </div>
                
                {card.serial_number && (
                  <div style={metadataItemStyle}>
                    <label style={metadataLabelStyle}>Serial #</label>
                    <span style={metadataValueStyle}>{card.serial_number}</span>
                  </div>
                )}
              </div>

              {/* Price Information */}
              <div style={priceSectionStyle}>
                <div style={currentPriceStyle}>
                  <label style={priceLabelStyle}>Current Price</label>
                  <div style={{ 
                    ...priceValueStyle, 
                    color: getPriceColor(card.latest_price) 
                  }}>
                    {formatPrice(card.latest_price)}
                  </div>
                </div>

                {card.affiliate_link && (
                  <a 
                    href={card.affiliate_link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={ebayButtonStyle}
                  >
                    🛒 Buy on eBay
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Price History Chart */}
          {card.price_history && card.price_history.length > 1 && (
            <div style={chartSectionStyle}>
              <h3 style={sectionTitleStyle}>Price History</h3>
              <div style={chartContainerStyle}>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={formatChartData(card.price_history)}>
                    <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
                    <XAxis 
                      dataKey="date" 
                      stroke={colors.textSecondary}
                      fontSize={12}
                    />
                    <YAxis 
                      stroke={colors.textSecondary}
                      fontSize={12}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip 
                      contentStyle={{
                        background: colors.surface,
                        border: `1px solid ${colors.border}`,
                        borderRadius: borderRadius.md,
                        boxShadow: shadows.lg
                      }}
                      formatter={(value, name) => [`$${value}`, 'Price']}
                    />
                    <Line
                      type="monotone"
                      dataKey="price"
                      stroke={colors.primary}
                      strokeWidth={3}
                      dot={{ fill: colors.primary, strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: colors.primary, strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>

        {/* Similar Cards */}
        {card.similar_cards && card.similar_cards.length > 0 && (
          <div style={similarSectionStyle}>
            <h3 style={sectionTitleStyle}>Similar Cards</h3>
            <div style={similarGridStyle}>
              {card.similar_cards.map((similarCard) => (
                <Link 
                  key={similarCard.id}
                  to={`/card/${generateSlug(similarCard.name)}`}
                  style={similarCardStyle}
                >
                  <h4 style={similarCardTitleStyle}>{similarCard.name}</h4>
                  <div style={similarCardMetaStyle}>
                    <span>{similarCard.set_name}</span>
                    {similarCard.grading && <span>• {similarCard.grading}</span>}
                  </div>
                  <div style={{ 
                    ...similarCardPriceStyle, 
                    color: getPriceColor(similarCard.latest_price) 
                  }}>
                    {formatPrice(similarCard.latest_price)}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Styles
const containerStyle = {
  maxWidth: '1200px',
  margin: '0 auto',
  padding: spacing.xl,
  fontFamily: typography.fontFamily.primary,
  background: colors.background,
  minHeight: '100vh'
}

const headerStyle = {
  marginBottom: spacing.xl
}

const backButtonStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: spacing.xs,
  color: colors.textSecondary,
  textDecoration: 'none',
  fontSize: typography.fontSize.sm,
  fontWeight: typography.fontWeight.medium,
  marginBottom: spacing.md,
  transition: 'color 0.2s ease',
  '&:hover': {
    color: colors.textPrimary
  }
}

const titleStyle = {
  fontSize: typography.fontSize['4xl'],
  fontWeight: typography.fontWeight.bold,
  color: colors.textPrimary,
  margin: 0,
  lineHeight: typography.lineHeight.tight
}

const contentStyle = {
  display: 'grid',
  gap: spacing.xl
}

const mainSectionStyle = {
  display: 'grid',
  gap: spacing.xl
}

const cardOverviewStyle = {
  display: 'grid',
  gridTemplateColumns: '300px 1fr',
  gap: spacing.xl,
  background: colors.surface,
  borderRadius: borderRadius.lg,
  padding: spacing.xl,
  boxShadow: shadows.md,
  border: `1px solid ${colors.border}`
}

const imagePlaceholderStyle = {
  width: '100%',
  height: '400px',
  background: colors.surfaceHover,
  borderRadius: borderRadius.md,
  border: `2px dashed ${colors.border}`,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  color: colors.textSecondary
}

const imageIconStyle = {
  fontSize: '4rem',
  marginBottom: spacing.sm
}

const imageTextStyle = {
  fontSize: typography.fontSize.sm,
  margin: 0
}

const metadataStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: spacing.lg
}

const metadataGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: spacing.md
}

const metadataItemStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: spacing.xs
}

const metadataLabelStyle = {
  fontSize: typography.fontSize.sm,
  fontWeight: typography.fontWeight.medium,
  color: colors.textSecondary,
  textTransform: 'uppercase',
  letterSpacing: '0.05em'
}

const metadataValueStyle = {
  fontSize: typography.fontSize.base,
  fontWeight: typography.fontWeight.semibold,
  color: colors.textPrimary
}

const priceSectionStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: spacing.lg,
  padding: spacing.lg,
  background: colors.surfaceHover,
  borderRadius: borderRadius.md,
  border: `1px solid ${colors.border}`
}

const currentPriceStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: spacing.xs
}

const priceLabelStyle = {
  fontSize: typography.fontSize.sm,
  fontWeight: typography.fontWeight.medium,
  color: colors.textSecondary
}

const priceValueStyle = {
  fontSize: typography.fontSize['2xl'],
  fontWeight: typography.fontWeight.bold
}

const ebayButtonStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: spacing.xs,
  padding: `${spacing.sm} ${spacing.lg}`,
  background: colors.primary,
  color: colors.white,
  textDecoration: 'none',
  borderRadius: borderRadius.full,
  fontWeight: typography.fontWeight.semibold,
  fontSize: typography.fontSize.sm,
  transition: 'all 0.2s ease',
  '&:hover': {
    background: colors.primaryHover,
    transform: 'translateY(-1px)'
  }
}

const chartSectionStyle = {
  background: colors.surface,
  borderRadius: borderRadius.lg,
  padding: spacing.xl,
  boxShadow: shadows.md,
  border: `1px solid ${colors.border}`
}

const sectionTitleStyle = {
  fontSize: typography.fontSize['2xl'],
  fontWeight: typography.fontWeight.bold,
  color: colors.textPrimary,
  margin: 0,
  marginBottom: spacing.lg
}

const chartContainerStyle = {
  width: '100%',
  height: '300px'
}

const similarSectionStyle = {
  background: colors.surface,
  borderRadius: borderRadius.lg,
  padding: spacing.xl,
  boxShadow: shadows.md,
  border: `1px solid ${colors.border}`
}

const similarGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
  gap: spacing.md
}

const similarCardStyle = {
  display: 'block',
  padding: spacing.lg,
  background: colors.surfaceHover,
  borderRadius: borderRadius.md,
  border: `1px solid ${colors.border}`,
  textDecoration: 'none',
  color: 'inherit',
  transition: 'all 0.2s ease',
  '&:hover': {
    boxShadow: shadows.lg,
    transform: 'translateY(-2px)',
    borderColor: colors.primary
  }
}

const similarCardTitleStyle = {
  fontSize: typography.fontSize.lg,
  fontWeight: typography.fontWeight.semibold,
  color: colors.textPrimary,
  margin: 0,
  marginBottom: spacing.xs,
  lineHeight: typography.lineHeight.tight
}

const similarCardMetaStyle = {
  fontSize: typography.fontSize.sm,
  color: colors.textSecondary,
  marginBottom: spacing.sm,
  display: 'flex',
  gap: spacing.xs
}

const similarCardPriceStyle = {
  fontSize: typography.fontSize.lg,
  fontWeight: typography.fontWeight.bold
}

const loadingStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: spacing.xl,
  gap: spacing.lg
}

const spinnerStyle = {
  width: '40px',
  height: '40px',
  border: `3px solid ${colors.border}`,
  borderTop: `3px solid ${colors.primary}`,
  borderRadius: '50%',
  animation: 'spin 1s linear infinite'
}

const errorStyle = {
  textAlign: 'center',
  padding: spacing.xl,
  color: colors.textSecondary
}

export default CardDetail 