import React from 'react'
import { Link } from 'react-router-dom'
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts'
import AdSlot from './AdSlot'
import { isSupabaseConfigured } from '../lib/supabase'
import { colors, typography, spacing, borderRadius, shadows, getPriceColor, formatPrice } from '../styles/designSystem'

const CardGrid = ({ cards = [], loading = false, onRefresh, gridColumns = 4 }) => {
  console.log('CardGrid received cards:', cards)
  console.log('Cards with prices:', cards.filter(card => card.latest_price > 0))

  const generateSlug = (cardName) => {
    return cardName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  }
  


  // Generate mock price history data for sparkline chart
  const generatePriceHistory = (currentPrice, count) => {
    const history = []
    const basePrice = currentPrice * 0.8 // Start 20% lower
    const variance = currentPrice * 0.3 // 30% variance
    
    // Generate dates going backwards from today
    const today = new Date()
    const daysBack = Math.min(count * 3, 30) // Spread over more days, max 30 days
    
    for (let i = 0; i < Math.min(count, 10); i++) { // Max 10 data points
      const price = basePrice + (Math.random() * variance)
      const date = new Date(today)
      date.setDate(date.getDate() - (daysBack - (i * daysBack / count)))
      
      history.push({
        date: date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric',
          year: '2-digit'
        }),
        fullDate: date.toLocaleDateString('en-US', { 
          weekday: 'long',
          year: 'numeric', 
          month: 'long', 
          day: 'numeric'
        }),
        price: Math.max(0.01, price)
      })
    }
    
    // Add current price as last point
    history.push({
      date: today.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: '2-digit'
      }),
      fullDate: today.toLocaleDateString('en-US', { 
        weekday: 'long',
        year: 'numeric', 
        month: 'long', 
        day: 'numeric'
      }),
      price: currentPrice
    })
    
    return history
  }

  // Sparkline Chart Component
  const SparklineChart = ({ data, color }) => (
    <div style={{ width: '100%', height: '60px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
          <Line
            type="monotone"
            dataKey="price"
            stroke={color}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 3, fill: color }}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                const dataPoint = payload[0].payload
                return (
                  <div style={{
                    background: '#1e293b',
                    color: 'white',
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.75rem',
                    border: 'none',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
                    minWidth: '150px'
                  }}>
                    <p style={{ 
                      margin: '0 0 0.25rem 0', 
                      color: '#94a3b8',
                      fontSize: '0.625rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      {dataPoint.fullDate}
                    </p>
                    <p style={{ 
                      margin: 0, 
                      fontWeight: 'bold',
                      fontSize: '0.875rem',
                      color: '#f1f5f9'
                    }}>
                      {formatPrice(payload[0].value)}
                    </p>
                  </div>
                )
              }
              return null
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )

  const getPriceBadgeColor = (price) => {
    if (price >= 100) return { bg: '#eff6ff', color: '#1e40af', border: '#93c5fd' }
    if (price >= 50) return { bg: '#fffbeb', color: '#92400e', border: '#fcd34d' }
    return { bg: '#ecfdf5', color: '#065f46', border: '#a7f3d0' }
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', paddingTop: '6rem', paddingBottom: '6rem' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '4rem',
          height: '4rem',
          backgroundColor: '#2563eb',
          borderRadius: '50%',
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
          marginBottom: '1.5rem'
        }}>
          <div style={{
            width: '1.5rem',
            height: '1.5rem',
            border: '2px solid #ffffff',
            borderTop: '2px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
        </div>
        <p style={{ fontSize: '1.125rem', color: '#475569' }}>Loading your card collection...</p>
      </div>
    )
  }

  if (cards.length === 0) {
    return (
      <div style={{ textAlign: 'center', paddingTop: '6rem', paddingBottom: '6rem' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '4rem',
          height: '4rem',
          backgroundColor: '#94a3b8',
          borderRadius: '50%',
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
          marginBottom: '1.5rem'
        }}>
          <span style={{ fontSize: '1.5rem' }}>📭</span>
        </div>
        <h3 style={{
          fontSize: '1.25rem',
          fontWeight: 600,
          color: '#374151',
          marginBottom: '0.5rem'
        }}>
          {!isSupabaseConfigured ? 'Configuration Required' : 'No cards found'}
        </h3>
        <p style={{ color: '#475569' }}>
          {!isSupabaseConfigured ? (
            <>
              Supabase environment variables need to be configured.<br />
              <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                Check the README for setup instructions.
              </span>
            </>
          ) : (
            'Start by searching for a card above to build your collection'
          )}
        </p>
      </div>
    )
  }

  return (
    <div>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <p style={{
          fontSize: '1.125rem',
          fontWeight: 600,
          color: '#374151'
        }}>
          Found {cards.length} card{cards.length !== 1 ? 's' : ''}
        </p>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          padding: '0.375rem 0.75rem',
          fontSize: '0.75rem',
          fontWeight: 500,
          borderRadius: '0.5rem',
          border: '1px solid',
          backgroundColor: '#ecfdf5',
          color: '#065f46',
          borderColor: '#a7f3d0'
        }}>
          💰 Live Prices
        </div>
      </div>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${gridColumns}, 1fr)`,
        gap: spacing.xl,
        fontFamily: typography.fontFamily.primary
      }}>
        {cards.map((card, index) => {
          // Add ads after cards 8 and 17
          const shouldShowAd = (index + 1) === 8 || (index + 1) === 17
          
          return (
            <React.Fragment key={index}>
              {shouldShowAd && (
                <div style={{
                  gridColumn: `1 / -1`,
                  margin: `${spacing.lg} 0`
                }}>
                  <AdSlot 
                    adSlot={`card-grid-${index + 1}`}
                    adFormat="auto"
                    className="grid-ad-slot"
                  />
                </div>
              )}
              <div 
            key={index} 
            style={{
              background: colors.surface,
              borderRadius: borderRadius.lg,
              boxShadow: shadows.sm,
              border: `1px solid ${colors.border}`,
              overflow: 'hidden',
              position: 'relative',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.boxShadow = shadows.lg
              e.target.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              e.target.style.boxShadow = shadows.sm
              e.target.style.transform = 'translateY(0)'
            }}
          >
            {/* Card Header */}
            <div style={{
              background: 'rgba(248, 250, 252, 0.8)',
              padding: '1rem',
              borderBottom: '1px solid rgba(226, 232, 240, 0.4)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '0.5rem'
              }}>
                <Link 
                  to={`/card/${generateSlug(card.name)}`}
                  style={{
                    textDecoration: 'none',
                    color: 'inherit'
                  }}
                >
                  <h3 style={{
                    fontWeight: 700,
                    color: '#1e293b',
                    fontSize: '1.125rem',
                    margin: 0,
                    lineHeight: '1.3',
                    cursor: 'pointer',
                    transition: 'color 0.2s ease',
                    '&:hover': {
                      color: colors.primary
                    }
                  }}>
                    {card.name || 'Unknown Card'}
                  </h3>
                </Link>

              </div>
              <p style={{
                color: '#6b7280',
                fontSize: '0.875rem',
                margin: 0,
                fontWeight: 500
              }}>
                Added: {new Date(card.created_at).toLocaleDateString()}
              </p>
            </div>
            
            {/* Card Image */}
            {card.image_url && (
              <div style={{
                width: '100%',
                height: '200px',
                background: colors.surfaceHover,
                borderBottom: '1px solid rgba(226, 232, 240, 0.4)'
              }}>
                <img 
                  src={card.image_url} 
                  alt={card.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}
            
            {/* Card Content */}
            <div style={{ padding: '1rem' }}>
              {card.latest_price !== null && card.latest_price !== undefined && card.latest_price > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {/* Price Information */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr',
                    gap: '1rem'
                  }}>
                    {/* Latest Price */}
                    <div style={{
                      padding: '0.75rem',
                      background: 'rgba(239, 246, 255, 0.5)',
                      borderRadius: '0.75rem',
                      border: '1px solid rgba(59, 130, 246, 0.2)'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginBottom: '0.25rem'
                      }}>
                        <span style={{ fontSize: '0.875rem', color: '#3b82f6' }}>💰</span>
                        <span style={{
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          color: '#1e40af'
                        }}>
                          Latest Price
                        </span>
                      </div>
                      <div style={{
                        fontSize: '1.25rem',
                        fontWeight: 700,
                        color: getPriceColor(card.latest_price)
                      }}>
                        {formatPrice(card.latest_price)}
                      </div>
                    </div>

                    {/* Average Price */}
                    <div style={{
                      padding: '0.75rem',
                      background: 'rgba(254, 243, 199, 0.5)',
                      borderRadius: '0.75rem',
                      border: '1px solid rgba(245, 158, 11, 0.2)'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginBottom: '0.25rem'
                      }}>
                        <span style={{ fontSize: '0.875rem', color: '#f59e0b' }}>📈</span>
                        <span style={{
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          color: '#92400e'
                        }}>
                          Average Price
                        </span>
                      </div>
                      <div style={{
                        fontSize: '1.25rem',
                        fontWeight: 700,
                        color: '#92400e'
                      }}>
                        {card.latest_price ? formatPrice(card.latest_price * 0.95) : 'N/A'}
                      </div>
                    </div>

                    {/* Price Count */}
                    <div style={{
                      padding: '0.75rem',
                      background: 'rgba(240, 253, 244, 0.5)',
                      borderRadius: '0.75rem',
                      border: '1px solid rgba(34, 197, 94, 0.2)'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginBottom: '0.25rem'
                      }}>
                        <span style={{ fontSize: '0.875rem', color: '#22c55e' }}>📊</span>
                        <span style={{
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          color: '#15803d'
                        }}>
                          Price Entries
                        </span>
                      </div>
                      <div style={{
                        fontSize: '1.25rem',
                        fontWeight: 700,
                        color: '#15803d'
                      }}>
                        {card.price_entries_count || 0}
                      </div>
                    </div>
                  </div>

                  {/* Last Updated */}
                  {card.last_price_update && (
                    <div style={{
                      padding: '0.75rem',
                      background: 'rgba(254, 243, 199, 0.5)',
                      borderRadius: '0.75rem',
                      border: '1px solid rgba(245, 158, 11, 0.2)'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginBottom: '0.25rem'
                      }}>
                        <span style={{ fontSize: '0.875rem', color: '#f59e0b' }}>📅</span>
                        <span style={{
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          color: '#92400e'
                        }}>
                          Last Updated
                        </span>
                      </div>
                      <div style={{
                        fontSize: '1rem',
                        fontWeight: 600,
                        color: '#92400e'
                      }}>
                        {new Date(card.last_price_update).toLocaleString()}
                      </div>
                    </div>
                  )}

                  {/* Price History Chart */}
                  {card.price_entries_count > 1 && (
                    <div style={{
                      padding: '0.75rem',
                      background: 'rgba(243, 244, 246, 0.5)',
                      borderRadius: '0.75rem',
                      border: '1px solid rgba(156, 163, 175, 0.2)'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginBottom: '0.5rem'
                      }}>
                        <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>📊</span>
                        <span style={{
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          color: '#374151'
                        }}>
                          Price History
                        </span>
                      </div>
                      <SparklineChart 
                        data={generatePriceHistory(card.latest_price, card.price_entries_count)}
                        color={getPriceColor(card.latest_price)}
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ textAlign: 'center', paddingTop: '1.5rem', paddingBottom: '1.5rem' }}>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '3rem',
                    height: '3rem',
                    backgroundColor: '#f3f4f6',
                    borderRadius: '50%',
                    marginBottom: '1rem'
                  }}>
                    <span style={{ fontSize: '1.25rem' }}>📊</span>
                  </div>
                  <p style={{
                    fontWeight: 500,
                    color: '#c2410c',
                    marginBottom: '0.5rem'
                  }}>
                    No Price Data
                  </p>
                  <p style={{
                    fontSize: '0.875rem',
                    color: '#6b7280',
                    marginBottom: '0.5rem'
                  }}>
                    Price: {card.latest_price === null ? 'null' : card.latest_price === undefined ? 'undefined' : card.latest_price}
                  </p>
                  <p style={{
                    fontSize: '0.75rem',
                    color: '#9ca3af',
                    fontStyle: 'italic'
                  }}>
                    Use the scraper above to add price data
                  </p>
                </div>
              )}
              

            </div>
          </div>
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}

export default CardGrid 